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
        data = results[0];
        if (data) {
          connection.query(
            `SELECT showing_id, show_time, T.theatre_id, T.theatre_name FROM SHOWING S INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id 
            INNER JOIN MOVIE M ON S.movie_id = M.movie_id 
            WHERE M.movie_id = ? AND (M.isPresale = false OR ?)`,
            [movie_id, isRegisteredUser],
            (err, results) => {
              if (err) return reject(err);
              data.showings = results;
              return resolve(data);
            }
          );
        } else {
          console.log("test");
          return resolve(null);
        }
      }
    );
  });
};

module.exports = serviceMethods;
