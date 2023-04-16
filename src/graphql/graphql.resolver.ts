import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class GraphQLResolver {
  @Query(() => Number)
  public healthCheck() {
    return new Date().getTime();
  }
}
