import { FieldError } from "../generated/graphql";

interface ReqErrorResponse {
  [prop: string]: string;
}
export const toErrorMap = (errors: FieldError[]) => {
  const errorObj: ReqErrorResponse = {};
  errors.forEach(({ field, message }) => {
    errorObj[field] = message;
  });
  return errorObj;
};
