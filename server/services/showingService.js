const connection = require("../config/database");

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
      `SELECT M.isPresale FROM SHOWING S INNER JOIN MOVIE M ON M.movie_id = S.movie_id 
      WHERE S.showing_id = ?`,
      [showing_id],
      (err, resultsPresale) => {
        if (err) return reject(err);
        // If showing is presale, count number of total seats and booked seats
        if (resultsPresale[0].isPresale) {
          connection.query(
            `SELECT COUNT(1) AS TS FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
            WHERE SH.showing_id = ?`,
            [showing_id],
            (err, resultsTotalSeats) => {
              if (err) return reject(err);
              connection.query(
                `SELECT COUNT(1) AS BS FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
            WHERE SH.showing_id = ? AND ST.booked = true`,
                [showing_id],
                (err, resultsBookedSeats) => {
                  if (err) return reject(err);
                  const percentBooked =
                    resultsBookedSeats[0].BS / resultsTotalSeats[0].TS;
                  if (percentBooked >= 0.1) {
                    return resolve(true);
                  } else {
                    return resolve(false);
                  }
                }
              );
            }
          );
        } else {
          return resolve(false);
        }
      }
    );
  });
};

module.exports = serviceMethods;
