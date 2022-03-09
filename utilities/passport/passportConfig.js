// const tblUsers = require("../../models/edeskio/tblUsers");
const models = require("../../models");
const axios = require("axios");
// const edeskio_models = models.edeskio.models;
// const sequelize = require("sequelize");

const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      console.log("here", username);

      done(null, true);
      // axios
      //   .get("https://localhost:8443/api/edeskio/get_tblUsers_One", {
      //     params: {
      //       username: username,
      //     },
      //   })
      //   .then((res) => {
      //     console
      //       .log(res)
              bcrypt.compare(
                password,
                tblUsers.dataValues.password,
                (err, result) => {
                  if (err) throw err;
                  if (result === true) {
                    return done(null, user);
                  } else {
                    return done(null, false);
                  }
                }
              );
            })

      //       .catch((error) => done(error));
      //   });

      // User.findOne({ username: username }, (err, user) => {
      //   if (err) throw err;
      //   if (!user) return done(null, false);
      // bcrypt.compare(password, tblUsers.dataValues.password, (err, result) => {
      //   if (err) throw err;
      //   if (result === true) {
      //     return done(null, user);
      //   } else {
      //     return done(null, false);
      //   }
      // });
      // });
    })
  );

  passport.serializeUser((user, cb) => {
    console.log("here", user);
    // cb(null, tblUsers.dataValues.ID);
  });

  passport.deserializeUser((id, cb) => {
    console.log("here"), id;
    // User.findOne({ _id: id }, (err, user) => {
    //   const userInformation = {
    //     username: tblUsers.dataValues.UserName,
    //   };
    //   cb(err, userInformation);
    // });
  });
};
