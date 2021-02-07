import 'reflect-metadata';
import './config/tsyringe.cofig';
import './config/passport.config';
import { App } from './app';
import { connectionOptions } from './config/typeorm.config';
import { createConnection } from 'typeorm';
import { IUser } from './types';
import {
  UserController,
  HomeController,
  TestController,
  ViewController,
  AuthController,
  QuestionController,
  AnswerController,
} from './controllers/index';

// extending the express session to hold user
declare module 'express-session' {
  interface SessionData {
    user: IUser;
  }
}

if (process.env.DB_CONNECT == 'true') {
  // create connection and start the app
  console.log('inside db');
  createConnection(connectionOptions)
    /*eslint-disable @typescript-eslint/no-unused-vars */
    .then((connection) => {
      const app = new App([
        HomeController,
        UserController,
        TestController,
        QuestionController,
        AnswerController,
        AuthController,
      ]);
      app.listen();
    })
    .catch((err) => console.log(err));
} else {
  const app2 = new App([ViewController]);
  app2.port = 5000;
  app2.listen();
}
