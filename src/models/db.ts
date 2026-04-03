import {Pool} from 'pg';

const pool = new Pool({
    user: 'postgres',
    password:"Chohieu1",
    host: 'localhost',
    port: 5432,
    database: "chat_app" 
})

export default pool;