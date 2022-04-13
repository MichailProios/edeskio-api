module.exports = (sequelize, DataTypes) => {
  const tblTickets = sequelize.define(
    "tblTickets",
    {
      ID: DataTypes.INTEGER,
      UserID: DataTypes.INTEGER,
      TechnicianID: DataTypes.INTEGER,
      Subject: DataTypes.STRING,
      Description: DataTypes.STRING,
      Status: DataTypes.STRING,
      Priority: DataTypes.STRING,
      SubmissionDate: DataTypes.STRING,
      LastModified: DataTypes.STRING,
      OpenDate: DataTypes.STRING,
      ClosedDate: DataTypes.STRING,
    },
    { freezeTableName: true, timestamps: false }
  );

  tblTickets.removeAttribute("id");

  return tblTickets;
};
