import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';

import { AuthMiddleware } from '../shared/middlewares/user.middleware';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

import { SharedModule } from './../shared/shared.module';

@Module({
	components: [TopicService],
	controllers: [TopicController],
	modules: [SharedModule]
})
export class TopicModule {
	public configure(consumer: MiddlewaresConsumer) {
		//consumer.apply(AuthMiddleware).forRoutes(TopicController);
	}
}