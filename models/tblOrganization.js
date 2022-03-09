module.exports = (sequelize, DataTypes) => {
    const tblOrganization = sequelize.define(
      "tblOrganization",
      {
        ID: DataTypes.INTEGER,
        Name: DataTypes.STRING,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblOrganization.removeAttribute("id");
  
    return tblOrganization;
  };
  