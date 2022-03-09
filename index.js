//Main Dependancies
/*****************************************************************************************************************************/
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const pjson = require("./package.json");
const axios = require("axios");
// const FileStore = require("session-file-store")(session);
const models = require("./models");
const edeskio_models = models.edeskio.models;
const sequelize = require("sequelize");
/*****************************************************************************************************************************/

//https
/*****************************************************************************************************************************/
const fs = require("fs");
const https = require("https");
/*****************************************************************************************************************************/

//Routes
/*****************************************************************************************************************************/
const emailRoutes = require("./routes/emailRoutes");
const edeskioRoutes = require("./routes/edeskioRoutes");
/*****************************************************************************************************************************/

//Auth
/*****************************************************************************************************************************/
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const tblUsers = require("./models/edeskio/tblUsers");
/*****************************************************************************************************************************/

// const models = require("./models");
// const edeskio_models = models.edeskio.models;
// const sequelize = require("sequelize");

//Server Options
/*****************************************************************************************************************************/
const app = express();

// app.use(
//   compression({
//     filter: function () {
//       return true;
//     },
//   })
// );
//app.use(helmet());
// app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    genid: (req) => {
      return uuid(); // use UUIDs for session IDs
    },
    // store: new FileStore(),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//require("./utilities/passport/passportConfig")(passport);

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy(
    // { usernameField: 'email' },

    (username, password, done) => {
      const tblUsers = edeskio_models.tblUsers
        .findOne({
          where: {
            UserName: username,
          },
        })
        .then((value) => {
          let enteredPassword = "";
          let user = "";

          if (value) {
            enteredPassword = value.dataValues.Password;
            user = value.dataValues;
          }
          //const dbdata = value.dataValues.Email;

          // console.log(value);

          bcrypt.compare(password, enteredPassword, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch((error) => done(error));
    }
  )
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.UserName);
});

passport.deserializeUser((username, done) => {
  console.log("HEREEE", username);
  const tblUsers = edeskio_models.tblUsers
    .findOne({
      where: {
        UserName: username,
      },
    })
    .then((value) => {
      let dbdata = "";

      if (value) {
        dbdata = value.dataValues;
      }

      done(null, dbdata);
    })
    .catch((error) => done(error));
});
/*****************************************************************************************************************************/

//Endpoints
/*****************************************************************************************************************************/
app.get("/", (req, res) => {
  res.send(
    pjson.description + " v" + pjson.version + "<br/> <br/>" + new Date()
  );
});

app.get("/endpoints", function (req, res) {
  res.send(listEndpoints(app));
});

app.use("/api/email", emailRoutes);
app.use("/api/edeskio", edeskioRoutes);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.status(401).send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Not Authenticated");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send("Authenticated");
    });
  })(req, res, next);
});

app.get("/user", (req, res) => {
  // console.log(req);
  res.send(req.isAuthenticated()); // The req.user stores the entire user that has been authenticated inside of it.
});

// app.get("/authrequired", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("you hit the authentication endpoint\n");
//   } else {
//     res.redirect("/");
//   }
// });

// app.use(passport.initialize());
// app.use(passport.session());

/*****************************************************************************************************************************/

//Server
/*****************************************************************************************************************************/
const httpsOptions = {
  key: fs.readFileSync("./security/key.pem"),
  cert: fs.readFileSync("./security/cert.pem"),
};

const serverHttps = https.createServer(httpsOptions, app).listen(8443, () => {
  console.log("HTTPS server listening on port " + 8443);
});
/*****************************************************************************************************************************/
