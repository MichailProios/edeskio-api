module.exports = (sequelize, DataTypes) => {
  const tblOrganizations = sequelize.define(
    "tblOrganizations",
    {
      ID: DataTypes.INTEGER,
      Name: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblOrganizations.removeAttribute("id");

  return tblOrganizations;
};
