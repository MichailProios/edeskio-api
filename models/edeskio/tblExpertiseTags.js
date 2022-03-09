module.exports = (sequelize, DataTypes) => {
    const tblExpertiseTags = sequelize.define(
      "tblExpertiseTags",
      {
        ID: DataTypes.INTEGER,
        TechnicianID: DataTypes.INTEGER,
        TagType: DataTypes.STRING,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblExpertiseTags.removeAttribute("id");
  
    return tblExpertiseTags;
  };
  