import { CustomError } from "./custom-error";

export class BadRequstError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, BadRequstError.prototype);
  }

  serializaErrors() {
      return [{ message: this.message }];
  }
}