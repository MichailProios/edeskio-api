const models = require("../../models");

module.exports = (sequelize, DataTypes) => {
  const tblNotifications = sequelize.define(
    "tblNotifications",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      UserID: DataTypes.INTEGER,
      TicketID: DataTypes.INTEGER,
      Content: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false, hasTrigger: true }
  );

  tblNotifications.associate = (models) => {
    tblNotifications.belongsTo(models.tblUsers, { foreignKey: "UserID" });
    tblNotifications.hasMany(models.tblNotificationsUsers, {
      foreignKey: "NotificationID",
    });
  };

  tblNotifications.removeAttribute("id");

  return tblNotifications;
};
