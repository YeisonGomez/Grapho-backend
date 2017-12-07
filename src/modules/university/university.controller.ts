import { Controller, Get, Res, Post, Put, Delete, Param, Body, HttpStatus, Request } from '@nestjs/common';
import { Response } from 'express';
import { CONFIG } from '../../environment'

import { UniversityService } from './university.service';
import Util from '../shared/util';

@Controller('university')
export class UniversityController {

    constructor(private universityService: UniversityService) { }

    @Get('get-all')
    public async getAll (@Res() res: Response, @Request() req){
    	console.log("university/get-all");
		res.status(HttpStatus.OK).json({ result: await this.universityService.getAll(), state: 'OK' });	
    }

    /*@Post('response')
    public async response(@Res() res: Response, @Body() body){
		res.status(HttpStatus.OK).json({ result: await this.topicService.response(body.temary_id, body.email, body.response), state: 'OK' });	
    }*/
}