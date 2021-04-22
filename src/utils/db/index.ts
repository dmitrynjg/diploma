require('dotenv').config();
const mysql = require('mysql2');

class DB {
  conn: any = null;

  async connect() {
    if (this.conn === null) {
      try {
        this.conn = await mysql.createPool({
          connectionLimit: 5,
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_TABLE,
          password: process.env.DB_PASS,
        });
      } catch (e) {
        process.exit();
      }
    }
  }

  async query(query: String = 'SELECT 1 + 1 as `sum`', args: Array<any> = []): Promise<Array<any>> {
    await this.connect();
    return this.conn
      .promise()
      .execute(query, args)
      .then((res: Array<any>) => res);
  }

  async fetchAll(query: String = 'SELECT 1 + 1 as `sum`', args: Array<any> = []): Promise<Array<any>> {
    return this.query(query, args).then((res) => res[0]);
  }

  async fetchObj(query: String = 'SELECT 1 + 1 as `sum`', args: Array<any> = []): Promise<Object> {
    return this.fetchAll(query, args).then((list) => (list.length > 0 ? list[0] : {}));
  }

  async disconnect(): Promise<void> {
    await this.conn.end();
    this.conn = null;
  }
}

export = new DB();
