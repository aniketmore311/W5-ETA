import passport from 'passport';
import { env } from '../config/env.config';
import { UserService } from '../services/user.service';
import makeGoogleStrategy from 'passport-google-oauth20';
const googleStrategy = makeGoogleStrategy.Strategy;
import { IUser } from '../types';
import { container } from 'tsyringe';

const userSerive = container.resolve(UserService);

declare global {
  /*eslint-disable*/
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser((user, done) => {
  console.debug('inside serialize');
  done(undefined, user.id);
});

passport.deserializeUser((id: number, done) => {
  console.debug('inside deserialize');
  userSerive.findOne(id).then((user) => {
    done(undefined, user);
  });
});

passport.use(
  new googleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // findone or create
      userSerive.findOneorCreate(profile).then((user) => {
        done(undefined, user);
      });
    }
  )
);
