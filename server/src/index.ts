import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

//custom imports
import { __prod__ } from "./constants";
import config from "./mikro-orm.config";
import PostResolver from "./resolvers/post";
import UserResolver from "./resolvers/user";
import { MyContext } from "./utils/types";

// declare module "express-session" {
//   interface Session {
//     userId: number;
//   }
// }

const main = async () => {
  //db configuration
  const orm = await MikroORM.init(config);
  //run migrations automatically
  await orm.getMigrator().up();

  //setup the express server
  const app = express();
  //add cors middleware
  app.use(
    cors({
      origin: ["http://localhost:3000"],//cors is going to apply on all routes. I can add more routes to this array
      credentials: true,//just to accept credentials
    })
  );
  let RedisStore = connectRedis(session);
  let redisClient = redis.createClient();
  app.use(
    session({
      //session configuration
      //sets the storage to redis
      store: new RedisStore({ client: redisClient }),
      //does not save any session cookie that was not initialized to the session store
      //only store session data that i have initialized
      saveUninitialized: false,
      //uses this secret to sign your session cookie to strengthen security. usually store the value in .env
      secret: "keyboard cat",
      // Forces the session not to be saved
      // back to the session store. this ensures that the session does not continuously ping th the redis server
      resave: false,
      //gives our session cookie a name. would be helpful in the FE
      name: "SID",
      //for the cookie stored in the session object
      cookie: {
        //restricts cookie access on FE. for security reasons
        httpOnly: true,
        //ensures that cookie only works for https request.
        secure: __prod__,
        //csrf
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, //saves cookie for  whole day 1000ms = 1second *60 secs = 1min * 60mins = 1hr * 24hrs = 1day
      },
    })
  );
  //we used the session middleware before apollo because we want it to be applied so that we can use it in apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      //turned off validator so that the default class-validator package that type graphql uses will not be used for us
      validate: false,
    }),
    //our session is stored in the req object and we have access to the request and response objects via the context. and we can pass them to the resolvers
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    //tracing: true,
  });
  apolloServer.applyMiddleware({ app });
  app.listen(3000, () => {
    console.log("app is running");
  });
};
main().catch((err) => {
  console.log(err, "error");
});
