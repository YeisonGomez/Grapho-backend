import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';

import { AuthMiddleware } from '../shared/middlewares/user.middleware';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

import { SharedModule } from './../shared/shared.module';

@Module({
	components: [ResourceService],
	controllers: [ResourceController],
	modules: [SharedModule]
})
export class ResourceModule {
	public configure(consumer: MiddlewaresConsumer) {
		//consumer.apply(AuthMiddleware).forRoutes(ResourceController);
	}
}