import { Component } from '@nestjs/common'
import { DatabaseService } from './../shared/db.service';

@Component()
export class TopicService {

    constructor(private db: DatabaseService) {
    }

    public async getAll() {
        return await (this.db.query(`
            select 
            *
            from topic where fk_daddy is null`))
    }

    public async getSubTopics(topic_id: number) {
        return await (this.db.query(`
            select 
            t.*,
            concat('[', concat(group_concat(distinct  json_object(
                "id", p.id,
                "url", p.url
            )), ']')) as imagen
            from topic t 
            left join picture_topic pt on pt.fk_topic = t.id 
			left join picture p on p.id = pt.fk_picture 
            where t.fk_daddy = '${ topic_id }' 
            group by t.id`))
    }
    
}