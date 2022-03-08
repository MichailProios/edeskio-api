const asyncHandler = require("../utilities/asyncHandler/asyncHandler");
const errorResponse = require("../utilities/errorResponse/errorResponse.js");
const nodemailer = require("nodemailer");
const moment = require("moment");

// const post_ContactUsEmail = asyncHandler(async (req, res, next) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: "allconcontracting-com.mail.protection.outlook.com",
//       port: 25,
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     transporter.verify(function (error, success) {
//       if (error) {
//         console.log(error, "Nodemailer Verify Error".bgRed);
//         //return res.status(500).json({ error });
//       } else {
//         console.log("Nodemailer Ready".bgGreen);
//         // return res.status(200).json({ success });
//       }
//     });

//     const output = `
//     test
//           `;

//     let info = await transporter.sendMail(
//       {
//         from: `michaelp@allconcontracting.com`,
//         to: "michaelp@allconcontracting.com",
//         subject: `test`,
//         html: output,
//       },
//       (error) => {
//         if (!error) {
//           console.log("Success".bgGreen);
//           return res.status(200).json({
//             success: "Your email has been sent.".bgGreen,
//           });
//         } else {
//           console.log(error, "Failure".bgRed);
//           return res.status(500).json({ error });
//         }
//       }
//     );
//   } catch (error) {
//     return next(new errorResponse(error.message, 500));
//   }
// });

// module.exports = {
//   post_ContactUsEmail,
// };
