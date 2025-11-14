import { SQLDatabase } from "encore.dev/storage/sqldb";

export default new SQLDatabase("notes_db", {
  migrations: "./migrations",
});
