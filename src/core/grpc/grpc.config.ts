import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';

// Create a gRPC microservice options object
export const grpcMicroserviceOptions: MicroserviceOptions = {
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
