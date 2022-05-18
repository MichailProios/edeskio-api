const models = require("../../models");

module.exports = (sequelize, DataTypes) => {
  const tblTags = sequelize.define(
    "tblTags",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Type: DataTypes.STRING,
      CategoryID: DataTypes.INTEGER,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTags.associate = (models) => {
    tblTags.hasMany(models.tblExpertiseTags, {
      foreignKey: "TagID",
    });
    tblTags.hasMany(models.tblTicketTags, {
      foreignKey: "TagID",
    });

    tblTags.belongsTo(models.tblTagCategories, { foreignKey: "CategoryID" });
  };

  tblTags.removeAttribute("id");

  return tblTags;
};
