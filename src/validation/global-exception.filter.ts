import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Customize the error message and status code based on the exception
    const status = exception.status || 500;
    const message = exception.message || 'Internal server error';

    // Send the error response to the client
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
