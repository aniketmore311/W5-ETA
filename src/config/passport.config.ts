import passport from 'passport';
import { User } from '../models/entity/user.entity';
import { env } from '../config/env.config';
import makeGoogleStrategy from 'passport-google-oauth20';
const googleStrategy = makeGoogleStrategy.Strategy;
import { IUser } from '../types';

declare global {
  /*eslint-disable*/
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser<any>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ where: { username: 'ani' } }).then((user) => {
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
      User.findOne({ where: { username: 'ani' } }).then((user) => {
        done(undefined, user);
      });
    }
  )
);
