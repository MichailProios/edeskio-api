const models = require("../../models");

module.exports = (sequelize, DataTypes) => {
  const tblTags = sequelize.define(
    "tblTags",
    {
      Type: DataTypes.STRING,
      CategoryID: DataTypes.INTEGER,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTags.associate = (models) => {
    tblTags.belongsTo(models.tblTagCategories, { foreignKey: "CategoryID" });
  };

  tblTags.removeAttribute("id");

  return tblTags;
};
