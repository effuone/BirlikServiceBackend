import { Pool } from "postgres-pool";

const databaseContext = new Pool( {
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

export default databaseContext