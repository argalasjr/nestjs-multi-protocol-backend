import { Controller, Get, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

export interface HelloRequest {
  name: string;
}

export interface HelloReply {
  message: string;
}

export interface IGrpcService {
  sayHello(data: HelloRequest): Observable<HelloReply>;
}

@Controller()
export class AppController {
  private logger = new Logger('AppController');

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('AppController', 'SayHello')
  sayHello(data: HelloRequest) {
    this.logger.log('GRPC method called');
    return { message: 'Hello' + data.name } as HelloReply;
  }
}
