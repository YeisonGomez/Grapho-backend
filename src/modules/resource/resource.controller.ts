import { Controller, Get, Res, Post, Put, Delete, Param, Body, HttpStatus, Request } from '@nestjs/common';
import { Response } from 'express';
import { CONFIG } from '../../environment'

import { ResourceService } from './resource.service';
import Util from '../shared/util';

@Controller('resource')
export class ResourceController {

    constructor(private resourceService: ResourceService) { }

    @Get('get-all')
    public async getAll (@Res() res: Response, @Request() req){
    	console.log("resource/get-all");
		res.status(HttpStatus.OK).json({ result: await this.resourceService.getAll(), state: 'OK' });	
    }

    /*@Post('response')
    public async response(@Res() res: Response, @Body() body){
		res.status(HttpStatus.OK).json({ result: await this.topicService.response(body.temary_id, body.email, body.response), state: 'OK' });	
    }*/
}