const connection = require("../config/database");

const serviceMethods = {};

serviceMethods.getAllTheatres = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM THEATRE`, [], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

serviceMethods.getOneTheatre = (theatre_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM THEATRE WHERE theatre_id = ?`,
      [theatre_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
