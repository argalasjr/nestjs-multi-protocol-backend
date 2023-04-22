import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  currentPage = 1;

  @Field(() => Int, { nullable: true })
  limit = 10;

  @Field(() => Boolean, { nullable: true })
  total = false;
}
