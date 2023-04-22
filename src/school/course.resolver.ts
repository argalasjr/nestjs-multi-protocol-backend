import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from './course.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Resolver(() => Course)
export class CourseResolver {
  @ResolveField('teacher', () => Teacher)
  public async teachers(@Parent() course: Course): Promise<Teacher> {
    return await course.teacher;
  }
  @ResolveField('subject', () => Subject)
  public async courses(@Parent() course: Course): Promise<Subject> {
    return await course.subject;
  }
}
