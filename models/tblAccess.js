module.exports = (sequelize, DataTypes) => {
    const tblAccess = sequelize.define(
      "tblAccess",
      {
        ID: DataTypes.INTEGER,
        UserID: DataTypes.INTEGER,
        RoleName: DataTypes.STRING,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblAccess.removeAttribute("id");
  
    return tblAccess;
  };
  