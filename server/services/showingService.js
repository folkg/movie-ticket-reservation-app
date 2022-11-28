const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

serviceMethods.getAllShowings = (isRegisteredUser, query) => {
  return new Promise((resolve, reject) => {
    // set query parameters to wildcard if they aren't passed in
    const movie_id = query.movie_id || "%";
    const theatre_id = query.theatre_id || "%";
    connection.query(
      `SELECT * FROM SHOWING S INNER JOIN MOVIE M ON M.movie_id = S.movie_id INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id 
      WHERE (M.isPresale = false OR ?) AND M.movie_id LIKE ? AND T.theatre_id LIKE ?`,
      [isRegisteredUser, movie_id, theatre_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

serviceMethods.getOneShowing = (showing_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    let data;
    connection.query(
      `SELECT * FROM SHOWING S INNER JOIN MOVIE M ON M.movie_id = S.movie_id INNER JOIN THEATRE T ON T.theatre_id = S.theatre_id 
      WHERE S.showing_id = ? AND (M.isPresale = false OR ?)`,
      [showing_id, isRegisteredUser],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
