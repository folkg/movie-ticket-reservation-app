const connection = require("../config/database");

const serviceMethods = {};

serviceMethods.getAllSeats = (isRegisteredUser, query) => {
  return new Promise((resolve, reject) => {
    const showing_id = query.showing_id || "%";
    connection.query(
      `SELECT ST.* FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
      INNER JOIN MOVIE M ON SH.movie_id = M.movie_id 
      WHERE (M.isPresale = false OR ?) AND SH.showing_id LIKE ?`,
      [isRegisteredUser, showing_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

serviceMethods.getOneSeat = (seat_id, isRegisteredUser) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT ST.* FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
      INNER JOIN MOVIE M ON SH.movie_id = M.movie_id 
      WHERE ST.seat_id = ? AND (M.isPresale = false OR ?)`,
      [seat_id, isRegisteredUser],
      async (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

module.exports = serviceMethods;
