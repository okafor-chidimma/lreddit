import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterUserMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  //using the mutation hook that was generated for us
  const [_, register] = useRegisterUserMutation();

  //for routing, provided by nextjs
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          //call the register function from the useRegisterUserMutation hook
          const response = await register(values);
          if (response.data?.register.errors) {
            //this adds the error messages and styling to the individual input elements
            //setErrors accepts an object where name of the input tag is the prop name and the value is the error message
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
              type="text"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Register;
