const { verify } = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  let token = req.get("authorization");
  if (token) {
    //get bearer from token, starting at index 7
    token = token.slice(7);
    verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) res.json({ success: false, message: "Invalid token." });
      else next();
    });
  } else {
    res.json({ success: false, message: "Access denied." });
  }
};

module.exports = checkToken;
