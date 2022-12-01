const DatabaseConnection = require("../config/database");
const connection = DatabaseConnection.getInstance(); // get Singleton instance

const { isPresaleRestricted } = require("../services/showingService");

const serviceMethods = {};

serviceMethods.getAllSeats = (isRegisteredUser, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showing_id = query.showing_id || "%";
      const results = await connection.query(
        `SELECT ST.* FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
      INNER JOIN MOVIE M ON SH.movie_id = M.movie_id 
      WHERE (M.isPresale = false OR ?) AND SH.showing_id LIKE ?`,
        [isRegisteredUser, showing_id]
      );
      for (let i = 0; i < results.length; i++) {
        // Determine if seat is available or not (takes into account 10% presale limit)
        results[i].is_available = !(
          results[i].booked ||
          (await isPresaleRestricted(results[i].showing_id))
        );
        delete results[i].booked;
      }
      return resolve(results);
    } catch (err) {
      return reject(err);
    }
  });
};

serviceMethods.getOneSeat = (seat_id, isRegisteredUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await connection.query(
        `SELECT ST.* FROM SEATS ST INNER JOIN SHOWING SH ON SH.showing_id = ST.showing_id 
      INNER JOIN MOVIE M ON SH.movie_id = M.movie_id 
      WHERE ST.seat_id = ? AND (M.isPresale = false OR ?)`,
        [seat_id, isRegisteredUser]
      );
      if (results[0]) {
        // Determine if seat is available or not (takes into account 10% presale limit)
        results[0].is_available = !(
          results[0].booked ||
          (await isPresaleRestricted(results[0].showing_id))
        );
        delete results[0].booked;
        return resolve(results[0]);
      } else {
        return resolve(null);
      }
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = serviceMethods;
