import { ErrorHandler } from '@/types/errors';

export const handleErrors = (
  data: string | object[],
  errorHandler: ErrorHandler
) => {
  if (Array.isArray(data)) {
    let message = '';
    Array.from(data).forEach((obj) =>
      Object.entries(obj).forEach((entry) => {
        const [field, msg] = entry;
        if (field in errorHandler.validation) {
          errorHandler.setFieldError(field, { message: msg });
        } else {
          message += msg + '\n';
        }
      })
    );
    if (message.length !== 0) {
      errorHandler.setError(message.trim());
    }
  } else {
    errorHandler.setError(data);
  }
};
