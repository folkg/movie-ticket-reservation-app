const { createConnection } = require("mysql");

class DatabaseConnection {
  // Using the Singleton deisgn pattern
  // There is one instance of DatabaseConnection

  constructor() {
    this.instance == null;
    this.connection == null;
  }

  static getinstance() {
    if (this.instance == null) {
      this.instance = new DatabaseConnection();
    }
    return this.instance;
  }

  getConnection() {
    if (!this.connection) {
      this.connection = createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.MYSQL_DB,
      });
    }
    return this.connection;
  }
  // We will just use the connection.query function to implicitly create and end the connection
}

module.exports = DatabaseConnection;
