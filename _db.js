import { neon } from '@neondatabase/serverless';
let sql;
export function getSql(){if(!process.env.DATABASE_URL)throw new Error('Falta DATABASE_URL en las variables de entorno.');if(!sql)sql=neon(process.env.DATABASE_URL);return sql}
export function json(res,status,body){return res.status(status).json(body)}