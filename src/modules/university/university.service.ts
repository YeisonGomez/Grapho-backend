import { Component } from '@nestjs/common'
import { DatabaseService } from './../shared/db.service';

@Component()
export class UniversityService {

    constructor(private db: DatabaseService) {
    }

    public async getAll() {
        return await (this.db.query(`
            select 
            *
            from university`))
    }
}