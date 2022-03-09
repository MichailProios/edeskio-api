module.exports = (sequelize, DataTypes) => {
    const tblNotifications = sequelize.define(
      "tblNotifications",
      {
        ID: DataTypes.INTEGER,
        UserID: DataTypes.INTEGER,
        TicketID: DataTypes.INTEGER,
        Content: DataTypes.STRING,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblNotifications.removeAttribute("id");
  
    return tblNotifications;
  };
  