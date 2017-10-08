import { Component } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { DatabaseService } from './../shared/db.service';

import { UsersService } from '../users/users.service';
import { Box } from '../../providers/box.provider';


@Component()
export class BoxsService {

    private users = [];

    constructor(
        private db: DatabaseService, private box: Box, private userService: UsersService) {
    }
    
    public async getAllPrivate() {
        return await (this.db.query(`select 
            u.id as usuario_id,
            u.nombres as usuario_nombres,
            (CASE WHEN u.team = 0 THEN 'white' ELSE 'black' END) as usuario_color,
            u.vida as usuario_vida,
            c.nombre as casilla,
            COUNT(p.fk_asesino) as muertes
            from casilla c
            right join usuario u on c.fk_usuario = u.id
            left join puntaje p on u.id = p.fk_asesino
            group by u.id, c.nombre, p.fk_asesino;`))
    }

    public async getById(id: string){
        return await (this.db.query(`SELECT * FROM casilla WHERE id = ${id}`))
    }

    public async updateUserBox(boxName: string, fk_user: number){
        return await (this.db.query(`UPDATE casilla SET fk_usuario='${fk_user}' where nombre='${boxName}'`));
    }

    public async getEndBox(){
        return await (this.db.query(`select nombre from casilla where id = (select max(id) from casilla)`))
    }

    public async getTablePublic(){
        return await (this.db.query(`
            select c.nombre as casilla, c.fk_usuario as usuario, (CASE WHEN u.team = 0 THEN 'white' ELSE 'black' END) as color  
            from casilla c 
            right join usuario u on c.fk_usuario = u.id
            where c.fk_usuario IS NOT null`))
    }    

    public async killUserTable(fk_user: number, box: string){
        return await (this.db.query(`UPDATE casilla SET fk_usuario=null where nombre='${box}'`));
    }

    public async newPosition(userId: number, box: string){
        return await (this.db.query(`UPDATE casilla SET fk_usuario=${userId} where nombre='${box}'`));
    }

    public async getUserAndBox(){
         return await (this.db.query(`
            select  
            c.id as casilla_id,
            c.nombre as casilla_nombre,
            u.*
            from casilla c
            right join usuario u on u.id = c.fk_usuario
            where u.estado = '1'`
          ))   
    }

    public async existUserBox(box){
        return await (this.db.query(`select * from casilla where nombre='${box}' AND fk_usuario IS NOT NULL`))
    }  

    public async resertScore(){
        return await (this.db.query(`DELETE FROM puntaje`));
    }   

    public async resertBox(){
        return await (this.db.query(`UPDATE casilla SET fk_usuario=null`));
    }   

    public async startGame(users: any){
        let boxEnd = await this.getEndBox();
        await this.resertBox();
        boxEnd = boxEnd[0].nombre;
        let boxPositions = this.box.getPositionInitial(boxEnd.toString());
        if((boxPositions.white.length * 2) != users.length){
            return { state: 'ERROR', description: `Hacen falta ${ ((boxPositions.white.length * 2) - users.length) } usuarios` };
        }
        let j = 0;
        for (var i = 0; i < boxPositions.white.length; ++i) {
            //white
            j = Math.floor((Math.random() * users.length));
            await this.updateUserBox(boxPositions.white[i], users[j].id);
            await this.userService.updateColor(users[j].id, 0);
            users.splice(j, 1);
            //black
            j = Math.floor((Math.random() * users.length));
            await this.updateUserBox(boxPositions.black[i], users[j].id);
            await this.userService.updateColor(users[j].id, 1);
            users.splice(j, 1);
        }

        await this.userService.startGameUsers();
        await this.resertScore();
        return { state: 'OK' };
    }

    public async createBoxs(size) {
        let boxs = this.box.getListBox(size);
        let i = 0;
        while(i < boxs.length){
            let response = await this.createBox(boxs[i])
            if(response == 'ER_DUP_ENTRY'){
                return response;
            } else {
                i++;
            }
        }
        return 'OK';
    }

    public async createBox(name: string){
        return this.db.query(
            `INSERT INTO casilla (nombre) VALUES ('${name}')`
        ).then(data => {
            return data;
        })
        .catch(e => {
            return e.code;
        })
    }

    public async orderUsersFromMovement(users: any, size: number){
        let array_final = [];
        this.users = users;

        while(this.existUsersColor('white')){
            let endUsersWhite = this.findUserInColumns('white', size);

            if(endUsersWhite.length > 0){
                array_final = this.arrayAddArray(endUsersWhite, array_final);
            }
        }

        while(this.existUsersColor('black')){
            let endUsersBlack = this.findUserInColumns('black', size);

            if(endUsersBlack.length > 0){
                array_final = this.arrayAddArray(endUsersBlack, array_final);
            }
        }

        /*while(this.users.length > 0){
            //console.log("==============================================================");
            let endUsersWhite = this.findUserInColumns('white', size);
            let endUsersBlack = this.findUserInColumns('black', size);
            //console.log(endUsersWhite);
            //console.log("----------------------------------");
            //console.log(endUsersBlack);
            if(endUsersWhite.length == 0 && endUsersBlack.length > 0){
                array_final = this.arrayAddArray(endUsersBlack, array_final); 

            } else if(endUsersBlack.length == 0 && endUsersWhite.length > 0){
                array_final = this.arrayAddArray(endUsersWhite, array_final);

            } else if(endUsersWhite.length > 0 && endUsersBlack.length > 0){
                let columnWhite = parseInt(endUsersWhite[0].casilla_nombre.substring(1, endUsersWhite[0].casilla_nombre.length));
                let columnBlack = parseInt(endUsersBlack[0].casilla_nombre.substring(1, endUsersBlack[0].casilla_nombre.length));
                
                //Quien avanzo más.
                if(((10 - columnBlack) + 1) == columnWhite){
                    columnWhite = (Math.floor(Math.random() * 2) == 0)? 0 : 99;
                }

                if(((10 - columnBlack) + 1) > columnWhite){
                    array_final = this.arrayAddArray(endUsersBlack, array_final);
                    array_final = this.arrayAddArray(endUsersWhite, array_final);
                } else if(((10 - columnBlack) + 1) < columnWhite){
                    array_final = this.arrayAddArray(endUsersWhite, array_final);
                    array_final = this.arrayAddArray(endUsersBlack, array_final);
                }
            }
        }*/

        return array_final;
    }

    private existUsersColor(color){
        for (var i = 0; i < this.users.length; ++i) {
            if(this.users[i].team == (color == 'white')? 0 : 1){
                return true;
            }
        }
        return false;
    }

    private arrayAddArray(array: any, array_final: any){
        while(array.length > 0){
            let j = Math.floor((Math.random() * array.length));
            array_final.push(array[j]);
            this.users.splice(this.findUserById(this.users, array[j].id), 1);
            array.splice(j, 1);
        }
        return array_final;
    }

    private findUserInColumns(color: string, size: number){
        let array = [];
        if(color == 'white'){
            for (var i = size - 1; i >= 2; --i) {
                for (var j = 0; j < this.users.length; ++j) {
                    if(this.users[j].team == 0 && this.users[j].casilla_nombre.substring(1, this.users[j].casilla_nombre.length) == i){
                        array.push(this.users[j]);
                    }
                }
                if(array.length > 0){
                    break;
                }
            }
        } else {
            for (var i = 2; i < size; ++i) {
                for (var j = 0; j < this.users.length; ++j) {
                    if(this.users[j].team == 1 && this.users[j].casilla_nombre.substring(1, this.users[j].casilla_nombre.length) == i){
                        array.push(this.users[j]);
                    }
                }
                if(array.length > 0){
                    break;
                }
            }
        }
        return array;
    }

    public validUsersLifes(users, maximoVida){
        let cont = 0;
        for (var i = 0; i < users.length; ++i) {
            if(users[i].usuario_vida == maximoVida){
                cont++;
            }
        }
        return cont == users.length;
    }

    private findUserById(array: any, id: any){
        for (var i = 0; i < array.length; ++i) {
            if(array[i].id == id){
                return i;
            }
        }
        return -1;
    }
}