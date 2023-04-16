import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';

import { GraphQLResolver } from './graphql.resolver';
import { GraphQLConfig } from './graphql.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(
      GraphQLConfig.getApolloDriverConfig(),
    ),
  ],
  providers: [GraphQLResolver],
})
export class GraphQLConfigModule {}
