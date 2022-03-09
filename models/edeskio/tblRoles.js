module.exports = (sequelize, DataTypes) => {
  const tblRoles = sequelize.define(
    "tblRoles",
    {
      Name: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblRoles.removeAttribute("id");

  return tblRoles;
};
