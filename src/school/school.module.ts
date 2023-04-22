import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseResolver } from './course.resolver';
import { Subject } from './subject.entity';
import { SubjectResolver } from './subject.resolver';
import { Teacher } from './teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { TrainingController } from './training.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [TrainingController],
  providers: [TeacherResolver, SubjectResolver, CourseResolver],
})
export class SchoolModule {}
