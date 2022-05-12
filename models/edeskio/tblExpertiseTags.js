module.exports = (sequelize, DataTypes) => {
  const tblExpertiseTags = sequelize.define(
    "tblExpertiseTags",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      TechnicianID: DataTypes.INTEGER,
      TagType: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  // tblExpertiseTags.associate = (models) => {
  //   tblExpertiseTags.belongsTo(models.tblUsers, { foreignKey: "UserID" });
  // };

  tblExpertiseTags.removeAttribute("id");

  return tblExpertiseTags;
};
