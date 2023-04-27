import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException, BadRequestException, HttpException, UnauthorizedException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const status = this.getStatus(exception);

    return {
      status,
      message: exception.message,
    };
  }

  private getStatus(exception: RpcException | HttpException): status {
    if (exception instanceof UnauthorizedException) {
      return status.UNAUTHENTICATED;
    } else if (exception instanceof BadRequestException) {
      return status.INVALID_ARGUMENT;
    } else {
      return status.UNKNOWN;
    }
  }
}
