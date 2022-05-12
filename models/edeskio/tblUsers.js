module.exports = (sequelize, DataTypes) => {
  const tblUsers = sequelize.define(
    "tblUsers",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Email: DataTypes.STRING,
      UserName: DataTypes.STRING,
      Password: DataTypes.STRING,
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      DateCreated: DataTypes.STRING,
      LastLogin: DataTypes.STRING,
      CompanyID: DataTypes.INTEGER,
      Approved: DataTypes.BOOLEAN,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblUsers.associate = (models) => {
    tblUsers.hasMany(models.tblNotifications, {
      foreignKey: "UserID",
    });

    tblUsers.hasMany(models.tblNotificationsUsers, {
      foreignKey: "UserID",
    });

    tblUsers.hasMany(models.tblTickets, {
      foreignKey: "UserID",
    });

    tblUsers.hasMany(models.tblMessages, {
      foreignKey: "SentBy",
    });
  };

  tblUsers.removeAttribute("id");

  return tblUsers;
};
