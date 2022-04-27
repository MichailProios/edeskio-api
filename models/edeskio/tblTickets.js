module.exports = (sequelize, DataTypes) => {
  const tblTickets = sequelize.define(
    "tblTickets",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      UserID: DataTypes.INTEGER,
      TechnicianID: DataTypes.INTEGER,
      Subject: DataTypes.STRING,
      Description: DataTypes.STRING,
      Status: DataTypes.STRING,
      Priority: DataTypes.STRING,
      SubmissionDate: DataTypes.STRING,
      LastModified: DataTypes.STRING,
      OpenDate: DataTypes.STRING,
      ClosedDate: DataTypes.STRING,
    },

    { freezeTableName: true, timestamps: false }
  );

  tblTickets.associate = (models) => {
    tblTickets.hasMany(models.tblNotifications, {
      foreignKey: "TicketID",
    });

    tblTickets.hasMany(models.tblNotifications, {
      foreignKey: "TicketID",
    });

    tblTickets.belongsTo(models.tblUsers, {
      foreignKey: "UserID",
    });
  };

  tblTickets.removeAttribute("id");

  return tblTickets;
};
