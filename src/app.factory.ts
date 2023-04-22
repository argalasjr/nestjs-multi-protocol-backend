// import './app.tracer';
// import './app.segfault-handler';
// import fastifyHelmet from 'fastify-helmet';
// import { NestFactory, Reflector } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { processRequest } from 'graphql-upload-minimal';
// import { RequestMethod } from '@nestjs/common';
// import { FastifyRequest, FastifyReply } from 'fastify';
// import fastifyCookie from '@fastify/cookie';

// export class AppFactory {
//   public async bootstrap() {
//     const adapter = new FastifyAdapter({ bodyLimit: 10048576 });
//     this.registerContentParser(adapter);

//     const app = await this.getApp(adapter, AppModule);
//     // const metricsApp = await this.getApp(metricsAdapter, MetricsModule);

//     await this.registerAppComponents(app);

//     // const { apiServerHost, apiServerPort } = app.get(ConfigService).get('general');
//     // const { metricsServerHost, metricsServerPort } = app.get(ConfigService).get('general');

//     await this.registerServer(app, 'localhost', 3000);
//     //await this.registerServer(metricsApp, metricsServerHost, metricsServerPort);
//   }

//   public async registerAppComponents(app: NestFastifyApplication) {
//     await this.registerHelmet(app);
//     this.setGlobalRoutePrefix(app);
//     await this.registerCookieParser(app);
//   }

//   private getApp(
//     adapter: FastifyAdapter,
//     module: unknown,
//   ): Promise<NestFastifyApplication> {
//     return NestFactory.create<NestFastifyApplication>(module, adapter, {
//       bufferLogs: true,
//       autoFlushLogs: true,
//     });
//   }

//   /**
//    * @see https://docs.nestjs.com/security/helmet
//    * The directives below are for solving GraphQL Playground issues
//    */
//   private async registerHelmet(app: NestFastifyApplication) {
//     await app.register(fastifyHelmet, {
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: [`'self'`],
//           styleSrc: [
//             `'self'`,
//             `'unsafe-inline'`,
//             'cdn.jsdelivr.net',
//             'fonts.googleapis.com',
//           ],
//           fontSrc: [`'self'`, 'fonts.gstatic.com'],
//           imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
//           scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
//         },
//       },
//     });
//   }

//   public registerContentParser(adapter: FastifyAdapter) {
//     const fastify = adapter.getInstance();

//     fastify.addContentTypeParser('multipart', (request, done) => {
//       request.isMultipart = true;
//       done();
//     });

//     fastify.addHook(
//       'preValidation',
//       async function (request: FastifyRequest, reply: FastifyReply) {
//         if (!request.raw['isMultipart']) {
//           return;
//         }
//         request.body = await processRequest(request.raw, reply.raw);
//       },
//     );
//   }

//   private setGlobalRoutePrefix(app: NestFastifyApplication) {
//     app.setGlobalPrefix('api', {
//       exclude: [
//         { path: '/health', method: RequestMethod.GET },
//         { path: '/graphql', method: RequestMethod.POST },
//       ],
//     });
//   }

//   private async registerCookieParser(app: NestFastifyApplication) {
//     await app.register(fastifyCookie);
//   }

//   private async registerServer(
//     app: NestFastifyApplication,
//     host: string,
//     port: number,
//   ) {
//     await app.listen(port, host);
//   }
// }
