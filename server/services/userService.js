const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM REGISTERED_USER`, [], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

serviceMethods.getOneUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM REGISTERED_USER WHERE id = ?`,
      [id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

serviceMethods.createUser = (body) => {
  return new Promise((resolve, reject) => {
    const {
      first_name,
      last_name,
      email_address,
      password,
      address,
      credit_card,
    } = body;
    const id = uuid();
    connection.query(
      `INSERT INTO REGISTERED_USER (id, first_name, last_name, email_address, password, address, credit_card) values (?,?,?,?,?,?,?)`,
      [
        id,
        first_name,
        last_name,
        email_address,
        password,
        address,
        credit_card,
      ],
      async (err, results) => {
        if (err) return reject(err);
        // return the new user object
        connection.query(
          `SELECT * FROM REGISTERED_USER WHERE id = ?`,
          [id],
          (err, results) => {
            if (err) return reject(err);
            return resolve(results[0]);
          }
        );
      }
    );
  });
};

serviceMethods.updateUser = (body, id) => {
  return new Promise((resolve, reject) => {
    const {
      first_name,
      last_name,
      email_address,
      password,
      address,
      credit_card,
    } = body;
    connection.query(
      `UPDATE REGISTERED_USER SET first_name = ?, last_name = ?, email_address = ?, password = ?, address = ?, credit_card = ? WHERE id = ?`,
      [
        first_name,
        last_name,
        email_address,
        password,
        address,
        credit_card,
        id,
      ],
      (err, results) => {
        if (err) return reject(err);
        // return the new user object
        connection.query(
          `SELECT * FROM REGISTERED_USER WHERE id = ?`,
          [id],
          (err, results) => {
            if (err) return reject(err);
            return resolve(results[0]);
          }
        );
      }
    );
  });
};

serviceMethods.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM REGISTERED_USER WHERE id = ?`,
      [id],
      (err, results) => {
        if (err) return reject(err);
        // return null if nothing was deleted
        if (results.affectedRows === 1) return resolve(results);
        return resolve(null);
      }
    );
  });
};

serviceMethods.getUserByEmail = (body) => {
  const { email_address } = body;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM REGISTERED_USER WHERE email_address = ? `,
      [email_address],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
