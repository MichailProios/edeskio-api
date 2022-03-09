module.exports = (sequelize, DataTypes) => {
    const tblMessages = sequelize.define(
      "tblMessages",
      {
        ID: DataTypes.INTEGER,
        DateSent: DataTypes.STRING,
        Seen: DataTypes.BOOLEAN, // bit in SSSMS?
        Content: DataTypes.STRING,	 
        SentBy: DataTypes.INTEGER,
        TicketID: DataTypes.INTEGER,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblMessages.removeAttribute("id");
  
    return tblMessages;
  };
  