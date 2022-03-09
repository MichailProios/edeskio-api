module.exports = (sequelize, DataTypes) => {
    const tblTicketTags = sequelize.define(
      "tblTicketTags",
      {
        ID: DataTypes.INTEGER,
        TicketID: DataTypes.INTEGER,
        TagType: DataTypes.STRING,
      },
      { freezeTableName: true, timestamps: false },
    );
  
    tblTicketTags.removeAttribute("id");
  
    return tblTicketTags;
  };
  