import path from "path";
import { MikroORM } from "@mikro-orm/core";

//import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  user: "postgres",
  password: "Jennylove19!",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

// export default {
//   driver: PostgreSqlDriver,
//   entities: [Post],
//   dbName: "lireddit",
//   type: "postgresql",
//   user: "postgres",
//   password: "Jennylove19!",
//   debug: !__prod__,
// } as Options<PostgreSqlDriver>;
