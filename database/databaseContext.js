import { Pool } from "postgres-pool";

const databaseContext = new Pool( {
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
    // database: process.env.DATABASE_NAME,
    // port: process.env.DATABASE_PORT,
    // password: process.env.DATABASE_PASSWORD,
    // user: process.env.DATABASE_USER
});

export default databaseContext