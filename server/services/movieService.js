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
    connection.query(
      `SELECT * FROM MOVIE WHERE movie_id = ? AND (isPresale = false OR ?)`,
      [movie_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

serviceMethods.getTheatreForMovie = (movie_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM THEATRE T INNER JOIN SHOWING S ON T.theatre_id = S.theatre_id INNER JOIN MOVIE M ON S.movie_id = M.movie_id 
      WHERE M.movie_id = ? AND (M.isPresale = false OR ?)`,
      [movie_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

serviceMethods.getShowingForMovie = (movie_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM SHOWING S INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id INNER JOIN MOVIE M ON S.movie_id = M.movie_id 
      WHERE M.movie_id = ? AND (M.isPresale = false OR ?)`,
      [movie_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

module.exports = serviceMethods;
