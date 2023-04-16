import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as grpc from '@grpc/grpc-js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { resolve } from 'path';

async function bootstrap() {
  // Create a Fastify app instance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Create a gRPC microservice options object
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000', // Replace with your desired gRPC server address
      package: 'app', // Replace with your package name
      protoPath: resolve('proto/app.proto'), // Replace with the path to your proto file
      loader: {
        // Define how to load the proto file
        keepCase: true,
        enums: String,
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: true,
        //includeDirs: ['path/to/your/proto/includes'], // Replace with the path to your proto includes
        longs: Number,
        bytes: String,
        json: true,
      },
    },
  };

  // Create a gRPC microservice
  app.connectMicroservice(microserviceOptions);

  // Start the gRPC microservice
  await app.startAllMicroservices();
  await app.listen(3000); // Replace with your desired HTTP server port
}

bootstrap();
