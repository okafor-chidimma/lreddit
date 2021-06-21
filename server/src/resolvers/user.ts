import * as argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "../utils/types";
import { RegisterInputType } from "../utils/input-types/register-input-type";
import { UserResponse } from "../utils/custom-types/user-response-type";

//created the post resolver by decorating the post class with resolver method
@Resolver()
export default class UserResolver {
  @Query(() => UserResponse)
  me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "general",
            message: "You are not logged in",
          },
        ],
      };
    }
    const user = em.findOne(User, { id: req.session.userId });
    return { user };
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("data") { username, password }: RegisterInputType,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    //validate user input
    if (!username.trim()) {
      return {
        errors: [
          {
            field: "username",
            message: "username cannot be empty",
          },
        ],
      };
    }
    if (!password.trim()) {
      return {
        errors: [
          {
            field: "password",
            message: "password cannot be empty",
          },
        ],
      };
    }

    const hashPassword = await argon2.hash(password);
    console.log(hashPassword, "hash password");
    const user = em.create(User, {
      username: username.toLowerCase(),
      password: hashPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code == "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("data") { username, password }: RegisterInputType,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    //retrieve the user from db
    const user = await em.findOne(User, { username: username.toLowerCase() });
    //I did not find user
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "User not found",
          },
        ],
      };
    }
    //i found user
    //un hash the password
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "general",
            message: "Invalid Username & Password combination",
          },
        ],
      };
    }
    //store the userId session
    //this will set the cookie on the user
    //keep them logged in
    req.session.userId = user.id;
    return {
      user,
    };
  }
}
