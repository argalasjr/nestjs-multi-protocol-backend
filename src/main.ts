import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ValidationPipe } from '@nestjs/common';
import { EnityNotFoundErrorFilter } from './validation/entity-not-found-error.filter';
import { grpcMicroserviceOptions } from './core/grpc/grpc.config';

async function bootstrap() {
  // Create a Fastify app instance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EnityNotFoundErrorFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Create a gRPC microservice
  app.connectMicroservice(grpcMicroserviceOptions);

  // Start the gRPC microservice
  await app.startAllMicroservices();
  await app.listen(3000); // Replace with your desired HTTP server port
}

bootstrap();
