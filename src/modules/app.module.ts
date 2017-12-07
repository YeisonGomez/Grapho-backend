import { Module } from '@nestjs/common';
import { TopicModule } from './topic/topic.module';
import { ResourceModule } from './resource/resource.module';
import { UniversityModule } from './university/university.module';

@Module({
    modules: [ TopicModule, ResourceModule, UniversityModule ],
})
export class ApplicationModule {}