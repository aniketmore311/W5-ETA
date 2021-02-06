import 'reflect-metadata';
import './config/tsyringe.cofig';
import { App } from './app';
import { connectionOptions } from './config/typeorm.config';
import { createConnection } from 'typeorm';
import { IUserDTO } from './types';
import {
  UserController,
  HomeController,
  TestController,
} from './controllers/index';

// extending the express session to hold user
declare module 'express-session' {
  interface SessionData {
    user: IUserDTO;
  }
}

// create connection and start the app
createConnection(connectionOptions)
  /*eslint-disable @typescript-eslint/no-unused-vars */
  .then((connection) => {
    const app = new App([HomeController, UserController, TestController]);
    app.listen();
  })
  .catch((err) => console.log(err));
