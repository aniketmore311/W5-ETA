import { Request, Response, NextFunction } from 'express';

// user defined error classes
export class SiteError extends Error {
  // every site error has a status code
  statusCode: number;
  constructor(
    // set the default values
    message = 'something went wrong',
    statusCode = 500
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * @description
 * wrap all async request handlers in your routes files with this function
 * to catch async errors and send them to error handling middleware
 */
/* eslint-disable */
export const catchAsync = (fn: any) => {
  // takes an async function and returns a handler that runs that function and catches errors
  return function (req: Request, res: Response, next: NextFunction): void {
    fn(req, res, next).catch(next);
  };
};
