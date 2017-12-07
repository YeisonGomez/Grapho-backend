import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';

import { AuthMiddleware } from '../shared/middlewares/user.middleware';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';

import { SharedModule } from './../shared/shared.module';

@Module({
	components: [UniversityService],
	controllers: [UniversityController],
	modules: [SharedModule]
})
export class UniversityModule {
	public configure(consumer: MiddlewaresConsumer) {
		//consumer.apply(AuthMiddleware).forRoutes(UniversityController);
	}
}