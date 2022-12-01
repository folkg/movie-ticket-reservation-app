const DatabaseConnection = require("../config/database");
const connection = DatabaseConnection.getInstance(); // get Singleton instance

const serviceMethods = {};

serviceMethods.getAllMovies = (isRegisteredUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `SELECT * FROM MOVIE WHERE (isPresale = false OR ?)`,
        [isRegisteredUser]
      );
      return resolve(results);
    } catch (err) {
      return reject(err);
    }
  });
};

serviceMethods.getOneMovie = (movie_id, isRegisteredUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `SELECT * FROM MOVIE WHERE movie_id = ? AND (isPresale = false OR ?)`,
        [movie_id, isRegisteredUser]
      );
      return resolve(results[0]);
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = serviceMethods;
