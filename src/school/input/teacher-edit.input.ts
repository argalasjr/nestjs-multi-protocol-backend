import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { TeachearAddInput } from './teacher-add.input';

@InputType()
export class TeacherEditInput extends PartialType(
  OmitType(TeachearAddInput, ['gender']),
) {}
