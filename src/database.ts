import { DataSource } from "typeorm";
import "dotenv/config";
import { Comment, Team, TeamToTech, User, UserToTech } from "@/entity/";

const datasource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 3306,
  logging: true,
  synchronize: true,
  database: process.env.DB_NAME,
  entities: [Comment, Team, TeamToTech, User, UserToTech],
});

let source: DataSource;

const initDatabase = async () => {
  try {
    source = await datasource.initialize();
    console.log("datasource is initialized!!");
  } catch (e) {
    console.error(e);
  }
};

export { initDatabase, source };