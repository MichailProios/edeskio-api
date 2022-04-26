module.exports = (sequelize, DataTypes) => {
  const tblTagCategories = sequelize.define(
    "tblTagCategories",
    {
      CategoryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Category: DataTypes.STRING,
      CompanyID: DataTypes.INTEGER,
      BackgroundColor: DataTypes.STRING,
      Color: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTagCategories.associate = (models) => {
    tblTagCategories.hasMany(models.tblTags, {
      foreignKey: "CategoryID",
    });
  };

  tblTagCategories.removeAttribute("id");

  return tblTagCategories;
};
