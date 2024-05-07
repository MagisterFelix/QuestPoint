import { Dispatch, SetStateAction } from 'react';
import { FieldValues, UseFormSetError } from 'react-hook-form';

export interface ErrorData {
  details: string | object[];
}

export interface ErrorHandler {
  validation: object;
  setError: Dispatch<SetStateAction<string>>;
  setFieldError: UseFormSetError<FieldValues>;
}
