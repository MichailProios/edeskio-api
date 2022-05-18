module.exports = (sequelize, DataTypes) => {
  const tblTicketTags = sequelize.define(
    "tblTicketTags",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      TicketID: DataTypes.INTEGER,
      TagID: DataTypes.INTEGER,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTicketTags.associate = (models) => {
    tblTicketTags.belongsTo(models.tblTickets, { foreignKey: "TicketID" });
    tblTicketTags.belongsTo(models.tblTags, { foreignKey: "TagID" });
  };

  tblTicketTags.removeAttribute("id");

  return tblTicketTags;
};
