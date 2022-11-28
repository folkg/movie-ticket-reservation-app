const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllMovies = (isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM MOVIE WHERE (isPresale = false OR ?)`,
      [isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

serviceMethods.getOneMovie = (movie_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    let data;
    connection.query(
      `SELECT * FROM MOVIE WHERE movie_id = ? AND (isPresale = false OR ?)`,
      [movie_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
