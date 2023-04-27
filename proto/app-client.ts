import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { resolve } from 'path';
import {
  CreateEventRequest,
  UpdateEventRequest,
  GetEventRequest,
  GetEventsRequest,
} from './generated/app';
const packageDefinition = loadSync(resolve('./proto/app.proto'));
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const appPackage = grpcObject.app;

const client = new (appPackage as any).AppController(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

// const request = { name: 'World' };
// client.SayHello(request, (error, response) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log(response.message);
// });

// const getEventRequest:GetEventRequest = { id: 1 };
// client.findEvent(getEventRequest, (error, response) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log(response);
// });

// const getEventsRequest: GetEventsRequest = { page: 1, limit: 5 };
// client.findEvents(getEventsRequest, (error, response) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log(response);
// });

const createEventRequest: CreateEventRequest = {
  name: 'nameeee',
  description: 'description',
  address: 'address',
  when: '2011-10-05T14:48:00.000Z',
};
client.createEvent(createEventRequest, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(response);
});

// const deleteEventRequest = {
//   id: 1,
// };
// client.create(deleteEventRequest, (error, response) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log(response);
// });
