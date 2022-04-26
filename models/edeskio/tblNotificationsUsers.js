const models = require("../../models");

module.exports = (sequelize, DataTypes) => {
  const tblNotificationsUsers = sequelize.define(
    "tblNotificationsUsers",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      UserID: DataTypes.INTEGER,
      NotificationID: DataTypes.INTEGER,
      Read: DataTypes.BOOLEAN,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblNotificationsUsers.associate = (models) => {
    tblNotificationsUsers.belongsTo(models.tblUsers, { foreignKey: "UserID" });
    tblNotificationsUsers.belongsTo(models.tblNotifications, {
      foreignKey: "NotificationID",
    });
  };

  return tblNotificationsUsers;
};
