import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { resolve } from 'path';
const packageDefinition = loadSync(resolve('./proto/app.proto'));
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const appPackage = grpcObject.app;

const client = new (appPackage as any).AppController(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

const request = { name: 'World' };
client.SayHello(request, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(response.message);
});
