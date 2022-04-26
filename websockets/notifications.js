const models = require("../models");
const edeskio_models = models.edeskio.models;

const notifications = (io) => {
  //Define namespace
  /***************************************************************************************************************/
  var nsp = io.of(process.env.WEBSOCKET_ENDPOINT_PREFIX + "/notifications");
  /***************************************************************************************************************/

  //Open connection
  /***************************************************************************************************************/
  nsp.on("connection", (socket) => {
    console.log("Notifications " + socket.id + " connected");

    //notification New
    /***************************************************************************************************************/
    socket.on("notificationNew", ({ userID, notification }, successful) => {
      edeskio_models.tblNotificationsUsers
        .findAll({
          include: [
            {
              model: edeskio_models.tblNotifications,
              include: [
                {
                  model: edeskio_models.tblUsers,
                },
              ],
            },
          ],

          raw: true,
        })
        .then((notifications) => {
          nsp.emit("notificationNew", { notifications });
        });

      if (notification.length > 0 && typeof notification !== "undefined") {
        edeskio_models.tblNotifications
          .create({
            UserID: userID,
            Content: notification,
          })
          .then(() => {
            edeskio_models.tblNotificationsUsers
              .findAll({
                include: [
                  {
                    model: edeskio_models.tblNotifications,
                    include: [
                      {
                        model: edeskio_models.tblUsers,
                      },
                    ],
                  },
                ],

                raw: true,
              })
              .finally(() => successful(true))
              .catch(() => successful(false));
          });
      }
    });
    /***************************************************************************************************************/

    //Notifications Read
    /***************************************************************************************************************/
    socket.on("notificationRead", ({ notificationID }, successful) => {
      edeskio_models.tblNotificationsUsers
        .update(
          {
            Read: true,
          },
          {
            where: {
              ID: notificationID,
            },
          }
        )
        .then(() => {
          edeskio_models.tblNotificationsUsers
            .findAll({
              include: [
                {
                  model: edeskio_models.tblNotifications,
                  include: [
                    {
                      model: edeskio_models.tblUsers,
                    },
                  ],
                },
              ],

              raw: true,
            })
            .then((notifications) => {
              nsp.emit("notificationNew", { notifications });
            })
            .finally(() => successful(true))
            .catch(() => successful(false));
        });
    });
    /***************************************************************************************************************/

    //On disconnect
    /***************************************************************************************************************/
    socket.on("disconnect", () => {
      console.log("Notifications " + socket.id + " disconnected");
    });
    /***************************************************************************************************************/
  });
  /***************************************************************************************************************/
};

module.exports = notifications;
