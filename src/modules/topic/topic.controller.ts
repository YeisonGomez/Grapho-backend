import { Controller, Get, Res, Post, Put, Delete, Param, Body, HttpStatus, Request } from '@nestjs/common';
import { Response } from 'express';
import { CONFIG } from '../../environment'

import { TopicService } from './topic.service';
import Util from '../shared/util';

@Controller('topic')
export class TopicController {

    constructor(private topicService: TopicService) { }

    @Get('get-all')
    public async getAll (@Res() res: Response, @Request() req){
    	console.log("topic/get-all");
		res.status(HttpStatus.OK).json({ result: await this.topicService.getAll(), state: 'OK' });	
    }

    @Get('get-sub-topics/:topic_id')
    public async getSubTopics (@Res() res: Response, @Request() req, @Param('topic_id') topic_id){
        res.status(HttpStatus.OK).json({ result: await this.topicService.getSubTopics(topic_id), state: 'OK' });    
    }    

    /*@Post('response')
    public async response(@Res() res: Response, @Body() body){
		res.status(HttpStatus.OK).json({ result: await this.topicService.response(body.temary_id, body.email, body.response), state: 'OK' });	
    }*/
}