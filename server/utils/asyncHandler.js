import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';
function asyncHandler(handler) {
  function isPrismaError(err) {
    if (
      err instanceof PrismaClientInitializationError ||
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientValidationError
    ) {
      return true;
    }
    return false;
  }
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch((error) => {
      if (isPrismaError(error)) {
        error.message = 'Something went wrong. please try again later';
      }
      return res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
      });
    });
  };
}

export default asyncHandler;
