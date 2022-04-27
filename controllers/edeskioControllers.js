const asyncHandler = require("../utilities/asyncHandler/asyncHandler");
const errorResponse = require("../utilities/errorResponse/errorResponse.js");
const models = require("../models");
const edeskio_models = models.edeskio.models;
const db = require("../models/index");
const moment = require("moment");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const Op = sequelize.Op;

const get_tblRoles_All = asyncHandler(async (req, res, next) => {
  try {
    const { organizationID } = req.query;

    const tblRoles = await edeskio_models.tblRoles.findAll();

    const tblAccess = await edeskio_models.tblAccess.findAll({});

    const tblUsers = await edeskio_models.tblUsers.findAll({
      where: { CompanyID: organizationID },
    });

    return res.status(200).json({ tblRoles, tblAccess, tblUsers });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblTags_All = asyncHandler(async (req, res, next) => {
  try {
    const { OrganizationID } = req.query;

    console.log("0", OrganizationID);

    const tblTags = await db.tblTags.findAll({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["Category", "CompanyID", "BackgroundColor", "Color"],
          where: {
            CompanyID: OrganizationID,
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblTagCategories = asyncHandler(async (req, res, next) => {
  try {
    const { OrganizationID } = req.query;

    const tblTagCategories = await edeskio_models.tblTagCategories.findAll({
      where: {
        CompanyID: OrganizationID,
      },
    });

    return res.status(200).json({ tblTagCategories });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblUser = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.query;

    const tblUser = await edeskio_models.tblUsers.findOne({
      where: {
        UserName: username,
      },
    });

    const tblOrganization = await edeskio_models.tblOrganizations.findOne({
      where: {
        ID: tblUser.dataValues.CompanyID,
      },
    });

    const tblAccess = await edeskio_models.tblAccess.findOne({
      where: {
        UserID: tblUser.dataValues.ID,
      },
    });

    return res.status(200).json({ tblUser, tblOrganization, tblAccess });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblOrganizations_All = asyncHandler(async (req, res, next) => {
  try {
    const tblOrganizations = await edeskio_models.tblOrganizations.findAll();

    return res.status(200).json({ tblOrganizations });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblUsers_All = asyncHandler(async (req, res, next) => {
  try {
    const { organizationID } = req.query;

    const tblUsers = await edeskio_models.tblUsers.findAll({
      where: {
        CompanyID: organizationID,
      },
    });

    return res.status(200).json({ tblUsers });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblUsers_One = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.body;

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        UserName: username,
      },
    });
    return res.status(200).json({ tblUsers });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblTickets = asyncHandler(async (req, res, next) => {
  const { OrganizationID } = req.query;

  try {
    const tblUsers_AllFromOrg = await edeskio_models.tblUsers.findAll({
      where: {
        CompanyID: OrganizationID,
        Approved: "1",
      },
    });

    let tblUsers_AllFromOrg_userIDs = [];

    tblUsers_AllFromOrg.forEach((element) => {
      tblUsers_AllFromOrg_userIDs.push(element.dataValues.ID);
    });

    let tblTickets = await edeskio_models.tblTickets.findAll({
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
      where: {
        UserID: tblUsers_AllFromOrg_userIDs.map((element) => parseInt(element)),
      },
    });

    let tblTickets_ticketIDs = [];

    tblTickets.forEach((element) => {
      tblTickets_ticketIDs.push(element.dataValues.ID);
    });

    let tblTicketTags = await edeskio_models.tblTicketTags.findAll({
      where: {
        TicketID: tblTickets_ticketIDs.map((element) => parseInt(element)),
      },
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblExpertiseTags_One = asyncHandler(async (req, res, next) => {
  try {
    const { TechnicianID } = req.query;

    const tblExpertiseTags = await edeskio_models.tblExpertiseTags.findAll({
      where: {
        TechnicianID: TechnicianID,
      },
    });
    return res.status(200).json({ tblExpertiseTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_TechniciansAssignInfo = asyncHandler(async (req, res, next) => {
  try {
    const { UserID } = req.query;

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: UserID,
      },
    });

    const tblUsers_All = await edeskio_models.tblUsers.findAll({
      where: {
        CompanyID: tblUsers.dataValues.CompanyID,
        Approved: "1",
      },
    });

    let tblUsers_All_userIDs = [];

    tblUsers_All.forEach((element) => {
      tblUsers_All_userIDs.push(element.dataValues.ID);
    });

    const tblAccess_AllTechs = await edeskio_models.tblAccess.findAll({
      where: {
        UserID: tblUsers_All_userIDs.map((element) => parseInt(element)),
        RoleName: ["Tech", "Admin"],
      },
    });

    let tblAccess_AllTechs_userIDs = [];

    tblAccess_AllTechs.forEach((element) => {
      tblAccess_AllTechs_userIDs.push(element.dataValues.UserID);
    });

    const tblUsers_AllTechs = await edeskio_models.tblUsers.findAll({
      where: {
        ID: tblAccess_AllTechs_userIDs.map((element) => parseInt(element)),
      },
    });

    const tblExpertiseTags_AllTechs =
      await edeskio_models.tblExpertiseTags.findAll({
        where: {
          TechnicianID: tblAccess_AllTechs_userIDs.map((element) =>
            parseInt(element)
          ),
        },
        order: [["TagType"]],
      });

    const TechTicketCount = await db.edeskio.query(
      `SELECT TechnicianID, COUNT(TechnicianID) as NumOfTickets FROM tblTickets WHERE TechnicianID IS NOT NULL AND ClosedDate IS NULL GROUP BY TechnicianID `
    );

    return res
      .status(200)
      .json({ tblUsers_AllTechs, tblExpertiseTags_AllTechs, TechTicketCount });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const post_tblTickets_NewTicket = asyncHandler(async (req, res, next) => {
  try {
    const { UserID, Subject, Description, SubmissionDate, Tags } = req.body;

    const tblTickets = await edeskio_models.tblTickets.create({
      UserID: UserID,
      Subject: Subject,
      Description: Description,
      SubmissionDate: SubmissionDate,
      Status: "Pending",
      Priority: "Medium",
    });

    for (const tag of Tags) {
      const tblTicketTags = await edeskio_models.tblTicketTags.create({
        TicketID: tblTickets.dataValues.ID,
        TagType: tag,
      });
    }

    return res.status(200).json({ msg: "Success" });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const post_tblTags_NewTag = asyncHandler(async (req, res, next) => {
  try {
    const { TagType, CategoryID, OrganizationID } = req.body;

    const tblTags_new = await edeskio_models.tblTags.create({
      Type: TagType,
      CategoryID: CategoryID,
    });

    const tblTags = await db.tblTags.findAll({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["Category", "CompanyID", "BackgroundColor", "Color"],
          where: {
            CompanyID: OrganizationID,
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const post_tblTagCategories_NewCategory = asyncHandler(
  async (req, res, next) => {
    try {
      const { Category, BackgroundColor, Color, OrganizationID } = req.body;

      const tblTagCategoriesInstance =
        await edeskio_models.tblTagCategories.create({
          Category: Category,
          CompanyID: OrganizationID,
          BackgroundColor: BackgroundColor,
          Color: Color,
        });

      const tblTagCategories = await edeskio_models.tblTagCategories.findAll({
        where: {
          CompanyID: OrganizationID,
        },
      });

      return res.status(200).json({ tblTagCategories });
    } catch (error) {
      // return res.status(500).send(error.message);
      return next(new errorResponse(error.message, 500));
    }
  }
);

const post_tblExpertiseTags = asyncHandler(async (req, res, next) => {
  try {
    const { UserID, Tags } = req.body;

    const currentExpertiseTags = await edeskio_models.tblExpertiseTags.destroy({
      where: {
        TechnicianID: UserID,
      },
    });

    for (const tag of Tags) {
      const tblExpertiseTags = await edeskio_models.tblExpertiseTags.create({
        TechnicianID: UserID,
        TagType: tag,
      });
    }

    const tblExpertiseTags = await edeskio_models.tblExpertiseTags.findAll({
      where: {
        TechnicianID: UserID,
      },
    });
    return res.status(200).json({ tblExpertiseTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const post_tblUsers_tblOrganization_Register_NewOrganization = asyncHandler(
  async (req, res, next) => {
    try {
      const { email, userName, password, firstName, lastName, companyName } =
        req.body;

      const tblOrganizationsInsert =
        await edeskio_models.tblOrganizations.create({
          Name: companyName,
        });

      const tblOrganizationsSelect =
        await edeskio_models.tblOrganizations.findOne({
          where: {
            Name: companyName,
          },
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const tblUsers = await edeskio_models.tblUsers.create({
        Email: email,
        UserName: userName,
        Password: hashedPassword,
        FirstName: firstName,
        LastName: lastName,
        // DateCreated: dateCreated,
        // LastLogin: lastLogin,
        Approved: true,
        CompanyID: tblOrganizationsSelect.dataValues.ID,
      });

      const tblUsersSelect = await edeskio_models.tblUsers.findOne({
        where: {
          Email: email,
          UserName: userName,
          Password: hashedPassword,
        },
      });

      const tblAccess = await edeskio_models.tblAccess.create({
        UserID: tblUsersSelect.dataValues.ID,
        RoleName: "Admin",
      });

      return res.status(200).json({ msg: "Success" });
    } catch (error) {
      // return res.status(500).send(error.message);
      return next(new errorResponse(error.message, 500));
    }
  }
);

const post_tblUsers_tblOrganization_Register_ExistingOrganization =
  asyncHandler(async (req, res, next) => {
    try {
      const { email, userName, password, firstName, lastName, companyName } =
        req.body;

      const tblOrganizationsSelect =
        await edeskio_models.tblOrganizations.findOne({
          where: {
            Name: companyName,
          },
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const tblUsers = await edeskio_models.tblUsers.create({
        Email: email,
        UserName: userName,
        Password: hashedPassword,
        FirstName: firstName,
        LastName: lastName,
        // DateCreated: dateCreated,
        // LastLogin: lastLogin,
        CompanyID: tblOrganizationsSelect.dataValues.ID,
      });

      const tblUsersSelect = await edeskio_models.tblUsers.findOne({
        where: {
          Email: email,
          UserName: userName,
          Password: hashedPassword,
        },
      });

      const tblAccess = await edeskio_models.tblAccess.create({
        UserID: tblUsersSelect.dataValues.ID,
        RoleName: "Basic",
      });

      return res.status(200).json({ msg: "Success" });
    } catch (error) {
      // return res.status(500).send(error.message);
      return next(new errorResponse(error.message, 500));
    }
  });

const put_tblTickets_Assign = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, TechnicianID, OpenDate } = req.body;

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    tblTickets.set({
      TechnicianID: TechnicianID,
      Status: "Open",
      OpenDate: OpenDate,
    });

    await tblTickets.save();

    tblTickets = await edeskio_models.tblTickets.findAll({
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
    });

    let tblTicketTags = await edeskio_models.tblTicketTags.findAll();

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_AutoAssign = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, CaseNumber, OpenDate } = req.body;

    const TechIDQuery = await db.edeskio.query(
      `EXECUTE [dbo].[spGetTechIDAutoAssign] @ticketID = ${TicketID}  ,@caseNumber = ${CaseNumber}`
    );

    const TechID = TechIDQuery[0][0].TechnicianID;

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    tblTickets.set({
      TechnicianID: TechID,
      Status: "Open",
      OpenDate: OpenDate,
    });

    await tblTickets.save();

    tblTickets = await edeskio_models.tblTickets.findAll({
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
    });

    let tblTicketTags = await edeskio_models.tblTicketTags.findAll();

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_Priority = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, Priority } = req.body;

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    tblTickets.set({
      Priority: Priority,
    });

    await tblTickets.save();

    tblTickets = await edeskio_models.tblTickets.findAll({
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
    });

    let tblTicketTags = await edeskio_models.tblTicketTags.findAll();

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTags_ManageTags = asyncHandler(async (req, res, next) => {
  try {
    const { TagType, Category, OrganizationID } = req.body;

    let tblTagsInstance;

    const tblTagCategoriesInstance =
      await edeskio_models.tblTagCategories.findOne({
        where: {
          Category: Category,
          CompanyID: OrganizationID,
        },
        order: [["CategoryID"]],
      });

    tblTagsInstance = await edeskio_models.tblTags.findOne({
      where: {
        Type: TagType,
      },
      order: [["Type"]],
    });

    tblTagsInstance.set({
      CategoryID: tblTagCategoriesInstance.dataValues.CategoryID,
    });

    await tblTagsInstance.save();

    const tblTags = await db.tblTags.findAll({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["Category", "CompanyID", "BackgroundColor", "Color"],
          where: {
            CompanyID: OrganizationID,
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTagCategories_ManageTags = asyncHandler(async (req, res, next) => {
  try {
    const { CategoryID, BackgroundColor, Color } = req.body;

    let tblTagCategories;

    tblTagCategories = await edeskio_models.tblTagCategories.findOne({
      where: {
        CategoryID: CategoryID,
      },
      order: [["CategoryID"]],
    });

    tblTagCategories.set({
      BackgroundColor: BackgroundColor,
      Color: Color,
    });

    await tblTagCategories.save();

    const tblTags = await db.tblTags.findAll({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["Category", "CompanyID", "BackgroundColor", "Color"],
          where: {
            CompanyID: tblTagCategories.dataValues.CompanyID,
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblUsers_Approved = asyncHandler(async (req, res, next) => {
  try {
    const { UserID, status, organizationID } = req.body;

    let tblUsers;

    tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: UserID,
      },
    });

    tblUsers.set({
      Approved: status,
    });

    await tblUsers.save();

    tblUsers = await edeskio_models.tblUsers.findAll({
      where: {
        CompanyID: organizationID,
      },
    });

    return res.status(200).json({ tblUsers });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblPermissions = asyncHandler(async (req, res, next) => {
  try {
    const { updatedRow, oldRow, organizationID } = req.body;

    let tblAccess;

    tblAccess = await edeskio_models.tblAccess.findOne({
      where: {
        ID: updatedRow.ID,
      },
    });

    tblAccess.set({
      RoleName: updatedRow.RoleName,
    });

    await tblAccess.save();

    tblAccess = await edeskio_models.tblAccess.findAll();

    const tblUsers = await edeskio_models.tblUsers.findAll({
      where: { CompanyID: organizationID },
    });

    const tblRoles = await edeskio_models.tblRoles.findAll();

    return res.status(200).json({ tblAccess, tblUsers, tblRoles });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const delete_tblTags = asyncHandler(async (req, res, next) => {
  try {
    const { TagType, OrganizationID } = req.body;

    const tblTagsInstance = await edeskio_models.tblTags.destroy({
      where: {
        Type: TagType.toString(),
      },
    });

    const tblTags = await db.tblTags.findAll({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["Category", "CompanyID", "BackgroundColor", "Color"],
          where: {
            CompanyID: OrganizationID,
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTags });
  } catch (error) {
    return res.status(500).json({ error: error.message });
    // return next(new ErrorResponse(error.message, 500));
  }
});

const notifications_WebSocket = asyncHandler(async (req, res, next) => {
  try {
    var io = req.app.get("socketio");
    // io.emit("hi!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  get_tblRoles_All,
  get_tblOrganizations_All,
  get_tblTags_All,
  get_tblTagCategories,
  get_tblUser,
  get_tblTickets,
  get_tblUsers_One,
  get_tblUsers_All,
  get_tblExpertiseTags_One,
  get_TechniciansAssignInfo,
  post_tblUsers_tblOrganization_Register_NewOrganization,
  post_tblUsers_tblOrganization_Register_ExistingOrganization,
  post_tblTickets_NewTicket,
  post_tblTags_NewTag,
  post_tblTagCategories_NewCategory,
  post_tblExpertiseTags,
  put_tblTickets_Assign,
  put_tblTickets_AutoAssign,
  put_tblTickets_Priority,
  put_tblPermissions,
  put_tblTags_ManageTags,
  put_tblTagCategories_ManageTags,
  put_tblUsers_Approved,
  delete_tblTags,
  notifications_WebSocket,
};
