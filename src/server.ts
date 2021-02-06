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
  ViewController,
} from './controllers/index';

// extending the express session to hold user
declare module 'express-session' {
  interface SessionData {
    user: IUserDTO;
  }
}

if (process.env.DB_CONNECT == 'true') {
  // create connection and start the app
  console.log('inside db');
  createConnection(connectionOptions)
    /*eslint-disable @typescript-eslint/no-unused-vars */
    .then((connection) => {
      const app = new App([HomeController, UserController, TestController]);
      app.listen();
    })
    .catch((err) => console.log(err));
}

const app2 = new App([ViewController]);
app2.port = 5000;
app2.listen();
