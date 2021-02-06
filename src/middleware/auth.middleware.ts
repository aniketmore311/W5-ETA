import { Request, Response, NextFunction } from 'express';
/**
 * @description
 * middleware to ensure user is logged in
 */
export const ensureAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // is user is set then allow
  if (req.user) {
    next();
  } else {
    // else dont allow and redirect to login
    req.flash('errorMessages', ['login to continue']);
    res.redirect('/user/login');
  }
};

/**
 * @description
 * middleware to ensure user is not logged in
 */
export const ensureUnauth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // if user is set then don't allow and redirect to home
  if (req.user) {
    res.redirect('/home');
  } else {
    // else allow
    next();
  }
};
