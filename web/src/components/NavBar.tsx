import React from "react";
import { Link, Flex, Box, Button } from "@chakra-ui/react";

import NextLink from "next/link";
import { useGetCurrentlyLoggedInUserQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useGetCurrentlyLoggedInUserQuery();

  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me.user) {
    console.log(data, "nl");
    body = (
      <Flex justifyContent="flex-end">
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </Flex>
    );
    // user is logged in
  } else {
    console.log(data, "logged in");
    body = (
      <Flex justifyContent="flex-end">
        <Box mr={2}>{data.me.user?.username}</Box>
        <Button variant="link">logout</Button>
      </Flex>
    );
  }

  return (
    <Box w="100%" mr={"auto"} bg="tomato" p={4}>
      {body}
    </Box>
  );
};
