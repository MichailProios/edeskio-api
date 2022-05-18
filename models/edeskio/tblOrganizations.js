module.exports = (sequelize, DataTypes) => {
  const tblOrganizations = sequelize.define(
    "tblOrganizations",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Name: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblOrganizations.removeAttribute("id");

  // tblOrganizations.associate = (models) => {
  //   tblOrganizations.belongsTo(models.tblUsers, {
  //     foreignKey: "CompanyID",
  //   });
  // };

  return tblOrganizations;
};
