module.exports = (sequelize, DataTypes) => {
    const tblUsers = sequelize.define(
      "tblUsers",
      {
        ID: DataTypes.INTEGER,
        Email: DataTypes.STRING,
        UserName: DataTypes.STRING,
        Password: DataTypes.STRING,
        FirstName: DataTypes.STRING,
        LastName: DataTypes.STRING,
        DateCreated: DataTypes.STRING, 
        LastLogin: DataTypes.STRING, 
        CompanyID: DataTypes.INTEGER,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblUsers.removeAttribute("id");
  
    return tblUsers;
  };
  