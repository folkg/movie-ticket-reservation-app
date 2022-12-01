const DatabaseConnection = require("../config/database");
const connection = DatabaseConnection.getInstance(); // get Singleton instance

const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(`SELECT * FROM REGISTERED_USER`);
      return resolve(results);
    } catch (err) {
      reject(err);
    }
  });
};

serviceMethods.getOneUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `SELECT * FROM REGISTERED_USER WHERE id = ?`,
        [id]
      );
      return resolve(results);
    } catch (err) {
      reject(err);
    }
  });
};

serviceMethods.createUser = (body) => {
  return new Promise(async (resolve, reject) => {
    const {
      first_name,
      last_name,
      email_address,
      password,
      address,
      credit_card,
    } = body;
    const id = uuid();
    try {
      await connection.query(
        `INSERT INTO REGISTERED_USER (id, first_name, last_name, email_address, password, address, credit_card) values (?,?,?,?,?,?,?)`,
        [
          id,
          first_name,
          last_name,
          email_address,
          password,
          address,
          credit_card,
        ]
      );
      const results = await connection.query(
        `SELECT * FROM REGISTERED_USER WHERE id = ?`,
        [id]
      );
      return resolve(results[0]);
    } catch (err) {
      reject(err);
    }
  });
};

serviceMethods.updateUser = (body, id) => {
  return new Promise(async (resolve, reject) => {
    const {
      first_name,
      last_name,
      email_address,
      password,
      address,
      credit_card,
    } = body;
    try {
      await connection.query(
        `UPDATE REGISTERED_USER SET first_name = ?, last_name = ?, email_address = ?, password = ?, address = ?, credit_card = ? WHERE id = ?`,
        [
          first_name,
          last_name,
          email_address,
          password,
          address,
          credit_card,
          id,
        ]
      );
      const results = await connection.query(
        `SELECT * FROM REGISTERED_USER WHERE id = ?`,
        [id]
      );
      return resolve(results[0]);
    } catch (err) {
      reject(err);
    }
  });
};

serviceMethods.deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `DELETE FROM REGISTERED_USER WHERE id = ?`,
        [id]
      );
      if (results.affectedRows === 1) return resolve(results);
      return resolve(null);
    } catch (err) {
      reject(err);
    }
  });
};

serviceMethods.getUserByEmail = (body) => {
  const { email_address } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `SELECT * FROM REGISTERED_USER WHERE email_address = ? `,
        [email_address]
      );
      return resolve(results[0]);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = serviceMethods;
