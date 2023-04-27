import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(ctx);

    if (graphqlContext.getContext().req) {
      return graphqlContext.getContext().req.user;
    }

    if (graphqlContext.getContext().request) {
      return graphqlContext.getContext().request.user;
    }

    const httpRequest = ctx.switchToHttp().getRequest();
    if (httpRequest.user) {
      return httpRequest.user;
    }

    return ctx.switchToRpc().getContext().user ?? null;
  },
);
