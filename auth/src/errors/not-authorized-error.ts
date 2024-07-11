import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 404;
  
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializaErrors() {
    return [{ message: 'Not authorized' }];
  }
}