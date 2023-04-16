import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus } from '@nestjs/common';
import { SubscriptionConfig } from '@nestjs/graphql';
//import { ApolloError } from 'apollo-server-fastify';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Oops, something went wrong';

export const concatenateArrayInReadableForm = (
  array: string[],
  lastSeparator: string,
): string => {
  if (array.length === 1) {
    return array[0];
  }
  return `${array.slice(0, -1).join(', ')} ${lastSeparator} ${array.slice(-1)}`;
};
export class GraphQLConfig {
  public static getApolloDriverConfig(): ApolloDriverConfig {
    return {
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      fieldResolverEnhancers: ['filters'],
      cache: 'bounded',
      autoSchemaFile: true,
      formatError: (error) => {
        return {
          message: GraphQLConfig.getMessage(error),
          statusCode: GraphQLConfig.getStatusCode(error),
        };
      },
      context: ({ req, res, connection, payload, request, reply }) => {
        return {
          req,
          res,
          connection,
          payload,
          request,
          reply,
        };
      },
      subscriptions: GraphQLConfig.getSubscriptionConfig(),
    };
  }

  private static getSubscriptionConfig(): SubscriptionConfig {
    return {
      'subscriptions-transport-ws': {
        onConnect: (connectionParams: Record<string, unknown>) => {
          return {
            isSubscription: true,
            ...connectionParams,
          };
        },
      },
    };
  }

  public static getStatusCode(error: unknown): HttpStatus {
    /**
     * Apollo errors https://bit.ly/3LGOm8r
     */
    const badRequestErrors = [
      'UserInputError',
      'ValidationError',
      'PersistedQueryNotSupportedError',
      'PersistedQueryNotFoundError',
    ];
    const isHttpStatusCode = (value: string) =>
      Object.values(HttpStatus).includes(parseInt(value));

    switch (true) {
      case error.constructor?.name &&
        badRequestErrors.includes(error.constructor?.name):
        return HttpStatus.BAD_REQUEST;
      case isHttpStatusCode(error['extensions']?.response?.statusCode):
        return error['extensions']?.response?.statusCode;
      case isHttpStatusCode(error['exception']?.status):
        return error['exception']?.status;
      case isHttpStatusCode(
        error['extensions']?.exception?.response?.statusCode,
      ):
        return error['extensions']?.exception?.response?.statusCode;
      case isHttpStatusCode(error['extensions']?.exception?.status):
        return error['extensions']?.exception?.status;
      case isHttpStatusCode(error['status']):
        return error['status'];
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  public static getMessage(error: unknown): string {
    const isStringMessage = (value: unknown) => typeof value === 'string';
    const isArrayOfStringMessages = (value: unknown) =>
      Array.isArray(value) &&
      value.length > 0 &&
      !value.some((message) => typeof message !== 'string');

    switch (true) {
      case isStringMessage(error['extensions']?.response?.message):
        return error['extensions']?.response?.message;
      case isArrayOfStringMessages(error['extensions']?.response?.message):
        return concatenateArrayInReadableForm(
          error['extensions']?.response?.message as string[],
          'and',
        );
      case isStringMessage(error['extensions']?.exception?.response?.message):
        return error['extensions']?.exception?.response?.message;
      case isStringMessage(error['message']):
        return error['message'];
      default:
        return INTERNAL_SERVER_ERROR_MESSAGE;
    }
  }
}
