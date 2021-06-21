import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import React from "react";
import { InputHTMLAttributes } from "react";
/*
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
  FieldHookConfig<any> & {
    label: string;
    placeholder: string;
  };
*/
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  //useField hook is used to connect html form elements such as input element to Formik
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      {/* htmlFor value must match id field */}
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} id={field.name} {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
