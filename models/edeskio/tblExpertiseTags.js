module.exports = (sequelize, DataTypes) => {
  const tblExpertiseTags = sequelize.define(
    "tblExpertiseTags",
    {
      ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      TechnicianID: DataTypes.INTEGER,
      TagID: DataTypes.INTEGER,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblExpertiseTags.associate = (models) => {
    tblExpertiseTags.belongsTo(models.tblUsers, { foreignKey: "TechnicianID" });
    tblExpertiseTags.belongsTo(models.tblTags, { foreignKey: "TagID" });
  };

  tblExpertiseTags.removeAttribute("id");

  return tblExpertiseTags;
};
