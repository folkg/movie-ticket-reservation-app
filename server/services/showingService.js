const DatabaseConnection = require("../config/database");
const dbc = DatabaseConnection.getinstance(); // get Singleton instance
const connection = dbc.getConnection();

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

serviceMethods.isPresaleRestricted = (showing_id) => {
  // function to determine if a showing is presale restricted (10% sold in presale)
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT M.isPresale, ST.booked FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id
       INNER JOIN MOVIE M ON M.movie_id = SH.movie_id
       WHERE SH.showing_id = ?`,
      [showing_id],
      (err, results) => {
        if (err) return reject(err);
        if (results[0].isPresale) {
          const totalSeats = results.length;
          const totalBooked = results.filter((s) => s.booked == 1).length;
          return resolve(totalBooked / totalSeats >= 0.1);
        } else {
          return resolve(false);
        }
      }
    );
  });
};

module.exports = serviceMethods;
