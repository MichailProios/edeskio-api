module.exports = (sequelize, DataTypes) => {
  const tblTicketTags = sequelize.define(
    "tblTicketTags",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      TicketID: DataTypes.INTEGER,
      TagType: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTicketTags.associate = (models) => {
    tblTicketTags.belongsTo(models.tblTickets, { foreignKey: "TicketID" });
  };

  tblTicketTags.removeAttribute("id");

  return tblTicketTags;
};
