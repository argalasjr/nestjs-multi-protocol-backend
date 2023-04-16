import {
  Body,
  Controller,
  Get,
  Logger,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import {
  Client,
  ClientGrpc,
  ClientOptions,
  GrpcMethod,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:3001',
    package: 'app',
    protoPath: join(__dirname, '../proto/app.proto'),
  },
};

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

  @Get('/bye')
  getBye() {
    return 'Bye!';
  }

  @GrpcMethod('AppController', 'SayHello')
  sayHello(data: HelloRequest) {
    console.log('calld');
    return { message: 'test' } as HelloReply;
  }
}
