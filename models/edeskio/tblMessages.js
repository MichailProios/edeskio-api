module.exports = (sequelize, DataTypes) => {
  const tblMessages = sequelize.define(
    "tblMessages",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      DateSent: DataTypes.STRING,
      Seen: DataTypes.BOOLEAN, // bit in SSSMS?
      Content: DataTypes.STRING,
      SentBy: DataTypes.INTEGER,
      TicketID: DataTypes.INTEGER,
      Private: DataTypes.BOOLEAN,
      Edited: DataTypes.BOOLEAN,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblMessages.associate = (models) => {
    tblMessages.belongsTo(models.tblUsers, { foreignKey: "SentBy" });
    tblMessages.belongsTo(models.tblTickets, { foreignKey: "TicketID" });
  };

  tblMessages.removeAttribute("id");

  return tblMessages;
};
