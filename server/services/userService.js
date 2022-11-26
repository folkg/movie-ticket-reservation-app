const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM registeredusers`, [], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

serviceMethods.getOneUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM registeredusers WHERE id = ?`,
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
    const { firstName, lastName, email, password, address, creditCard } = body;
    const id = uuid();
    connection.query(
      `INSERT INTO registeredusers(id, first_name, last_name, email_address, password, address, credit_card) values (?,?,?,?,?,?,?)`,
      [id, firstName, lastName, email, password, address, creditCard],
      async (err, results) => {
        if (err) return reject(err);
        // return the new user object
        connection.query(
          `SELECT * FROM registeredusers WHERE id = ?`,
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
    const { firstName, lastName, email, password, address, creditCard } = body;
    connection.query(
      `UPDATE registeredusers SET first_name = ?, last_name = ?, email_address = ?, password = ?, address = ?, credit_card = ? WHERE id = ?`,
      [firstName, lastName, email, password, address, creditCard, id],
      (err, results) => {
        if (err) return reject(err);
        // return the new user object
        connection.query(
          `SELECT * FROM registeredusers WHERE id = ?`,
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
      `DELETE FROM registeredusers WHERE id = ?`,
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
  const { email } = body;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM registeredusers WHERE email_address = ? `,
      [email],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
