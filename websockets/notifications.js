const models = require("../models");
const edeskio_models = models.edeskio.models;

const notifications = async (io) => {
  //Define namespace
  /***************************************************************************************************************/
  var nsp = io.of(process.env.WEBSOCKET_ENDPOINT_PREFIX + "/notifications");
  /***************************************************************************************************************/

  edeskio_models.tblTickets.afterCreate(
    "insertNotifications",
    async (ticket, options) => {
      console.log(ticket);
      edeskio_models.tblNotifications
        .create({
          UserID: ticket.dataValues.UserID,
          TicketID: ticket.dataValues.ID,
          Content: "Created a New Ticket",
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
              where: { Read: false },
              raw: true,
            })
            .then((notifications) => {
              nsp.emit("notificationNew", { notifications });
            });
        });
    }
  );

  //Open connection
  /***************************************************************************************************************/
  nsp.on("connection", (socket) => {
    console.log("Notifications " + socket.id + " connected");

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
        where: { Read: false },
        raw: true,
      })
      .then((notifications) => {
        nsp.emit("notificationNew", { notifications });
      });

    //Notifications Read
    /***************************************************************************************************************/
    socket.on("notificationRead", ({ userID, notificationID }) => {
      edeskio_models.tblNotificationsUsers
        .update(
          {
            Read: true,
          },
          {
            where: {
              UserID: userID,
              NotificationID: notificationID,
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
              where: { Read: false },

              raw: true,
            })
            .then((notifications) => {
              nsp.emit("notificationNew", { notifications });
            });
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
