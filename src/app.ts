import { container, injectable, InjectionToken, singleton } from 'tsyringe';
import passport from 'passport';
import { IBaseController } from './types/index';
import session, { MemoryStore } from 'express-session';
import { env } from './config/env.config';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import morgan from 'morgan';
import { logError, errorTransformer, SiteErrorHandler } from './middleware';

@injectable()
@singleton()
export class App {
  public app: express.Application;
  public port: number = env.PORT;
  public controllerTokens: InjectionToken<IBaseController>[];

  constructor(controllerTokens: InjectionToken<IBaseController>[]) {
    this.controllerTokens = controllerTokens;
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers();
    this.initializeNotFound();
    this.initializeErrorHandler();
  }

  public initializeMiddleware(): void {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser(env.COOKIE_KEY));
    // setup sessions
    this.app.use(
      session({
        cookie: {
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
        },
        // usinng memory store here use redis or something in production
        store: new MemoryStore(),
        secret: env.SESS_KEY,
        resave: false,
        name: 'sid',
        saveUninitialized: false,
      })
    );
    this.app.use(flash());
    this.app.use(morgan(env.MORGAN_MODE));
    this.app.set('views', `${env.ROOT_DIR}/src/views`);
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(`${env.ROOT_DIR}/src/public`));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    // if root path ('/') is visited then redirect to '/home'
    this.app.use((req: Request, res: Response, next: NextFunction): void => {
      if (req.url === '/') {
        res.redirect('/home');
      } else {
        next();
      }
    });
  }

  public initializeControllers(): void {
    this.controllerTokens.forEach((token) => {
      const controllerInstance: IBaseController = container.resolve(token);
      this.app.use(
        controllerInstance.path,
        ...controllerInstance.middlewareBefore,
        controllerInstance.router,
        ...controllerInstance.middlewareAfter
      );
    });
  }

  public initializeNotFound(): void {
    this.app.use((req: Request, res: Response) => res.render('pages/404'));
  }

  public initializeErrorHandler(): void {
    this.app.use(logError);
    this.app.use(errorTransformer);
    this.app.use(SiteErrorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`server is listening on port ${this.port}`);
    });
  }
}
