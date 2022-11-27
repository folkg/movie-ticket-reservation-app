const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllTheatres = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM THEATRE`, [], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

serviceMethods.getOneTheatre = (theatre_id) => {
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

serviceMethods.getMovieForTheatre = (theatre_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM MOVIE M INNER JOIN SHOWING S ON S.movie_id = M.movie_id INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id
      WHERE T.theatre_id = ? AND (M.isPresale = false OR ?)`,
      [theatre_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

serviceMethods.getShowingForTheatre = (theatre_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM SHOWING S INNER JOIN MOVIE M ON S.movie_id = M.movie_id INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id
      WHERE T.theatre_id = ? AND (M.isPresale = false OR ?)`,
      [theatre_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

module.exports = serviceMethods;
