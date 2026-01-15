import sql from 'msnodesqlv8';
import dotenv from 'dotenv';
dotenv.config();
let connection: MsNodeSqlV8.Connection | null = null;

function initConnection() {
  return new Promise<MsNodeSqlV8.Connection>((resolve, reject) => {
    sql.open(process.env.MSSQL_CONNECTION_STRING!, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        connection = conn;
        console.log('Connected to MSSQL database');
        resolve(conn);
      }
    });
  });
}
await initConnection();

export function runQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    connection?.query(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export default connection;
