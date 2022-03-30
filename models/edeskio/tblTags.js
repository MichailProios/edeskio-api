module.exports = (sequelize, DataTypes) => {
  const tblTags = sequelize.define(
    "tblTags",
    {
      Type: DataTypes.STRING,
      Category: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTags.removeAttribute("id");

  return tblTags;
};
