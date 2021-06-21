import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import session from "express-session";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  //intersection types combines all the properties of 2 or more types into 1
  //denoted with the & operator
  req: Request & { session: session.Session & { userId?: number } };
  res: Response;
};
