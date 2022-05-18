const models = require("../models");
const edeskio_models = models.edeskio.models;

const messages = async (io) => {
  //Define namespace
  /***************************************************************************************************************/
  var nsp = io.of(process.env.WEBSOCKET_ENDPOINT_PREFIX + "/messages");
  /***************************************************************************************************************/

  //Open connection
  /***************************************************************************************************************/
  nsp.on("connection", (socket) => {
    console.log("Messages " + socket.id + " connected");

    console.log(socket.handshake.query);
    /***************************************************************************************************************/
    // socket.on("notificationRead", ({ userID, notificationID }) => {});
    /***************************************************************************************************************/
    socket.join("some room");

    socket.on("messagesOpen", ({ ticketID }) => {
      edeskio_models.tblMessages
        .findAll({
          include: [
            {
              model: edeskio_models.tblUsers,
            },
          ],
          where: { TicketID: ticketID, Private: false },
        })
        .then((messages) => {
          nsp.emit("messagesNew", { messages });
        });
    });

    socket.on(
      "messageSent",
      ({ userID, ticketID, currentMessage, date, privateMsg }) => {
        edeskio_models.tblMessages
          .create({
            SentBy: userID,
            TicketID: ticketID,
            Content: currentMessage,
            DateSent: date,
            Private: privateMsg,
            Seen: false,
            Edited: false,
          })
          .then(() => {
            edeskio_models.tblMessages
              .findAll({
                include: [
                  {
                    model: edeskio_models.tblUsers,
                  },
                ],
                where: { TicketID: ticketID, Private: false },
              })
              .then((messages) => {
                nsp.emit("messagesNew", { messages });
              });
          });
      }
    );

    //On disconnect
    /***************************************************************************************************************/
    socket.on("disconnect", () => {
      console.log("Messages " + socket.id + " disconnected");
    });
    /***************************************************************************************************************/
  });
  /***************************************************************************************************************/
};

module.exports = messages;
