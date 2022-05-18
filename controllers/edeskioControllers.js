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
    // const tblUsers_AllFromOrg = await edeskio_models.tblUsers.findAll({
    //   where: {
    //     CompanyID: OrganizationID,
    //     Approved: "1",
    //   },
    // });

    // let tblUsers_AllFromOrg_userIDs = [];

    // tblUsers_AllFromOrg.forEach((element) => {
    //   tblUsers_AllFromOrg_userIDs.push(element.dataValues.ID);
    // });

    // let tblTickets = await edeskio_models.tblTickets.findAll({
    //   include: [
    //     {
    //       model: edeskio_models.tblUsers,
    //     },
    //   ],
    //   where: {
    //     UserID: tblUsers_AllFromOrg_userIDs.map((element) => parseInt(element)),
    //   },
    // });

    // let tblTickets_ticketIDs = [];

    // tblTickets.forEach((element) => {
    //   tblTickets_ticketIDs.push(element.dataValues.ID);
    // });

    // let tblTicketTags = await edeskio_models.tblTicketTags.findAll({
    //   where: {
    //     TicketID: tblTickets_ticketIDs.map((element) => parseInt(element)),
    //   },
    // });

    const tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          // attributes: [],
          as: "User",
          where: {
            CompanyID: OrganizationID,
            Approved: "1",
          },
        },
        {
          model: db.tblUsers,
          // attributes: [],
          as: "Technician",
          required: false,
        },
      ],
      // raw: true,
    });

    const tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
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
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
      ],
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

    console.log(tblUsers);

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
        include: [
          {
            model: db.tblTags,
            attributes: ["Type"],
            order: [["Type"]],
          },
        ],
        where: {
          TechnicianID: tblAccess_AllTechs_userIDs.map((element) =>
            parseInt(element)
          ),
        },
        order: [["TagID"]],
        raw: true,
      });

    const TechTicketCount = await db.edeskio.query(
      `SELECT TechnicianID, b.FirstName + ' ' + b.LastName as FullName, COUNT(TechnicianID) as NumOfTickets FROM tblTickets a
      INNER JOIN tblUsers b
      ON a.TechnicianID = b.ID
      WHERE a.TechnicianID IS NOT NULL AND a.Status != 'Closed' AND b.CompanyID = ${tblUsers.dataValues.CompanyID}  GROUP BY TechnicianID, b.FirstName, b.LastName `
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

    for (const tagID of Tags) {
      const tblTicketTags = await edeskio_models.tblTicketTags.create({
        TicketID: tblTickets.dataValues.ID,
        TagID: tagID,
      });
    }

    return res.status(200).json({ msg: "Success" });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const get_tblMessages_OneTicket = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID } = req.query;

    const tblMessages = await edeskio_models.tblMessages.findAll({
      where: {
        TicketID: TicketID,
      },
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
    });

    return res.status(200).json({ tblMessages });
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

    for (const tagID of Tags) {
      const tblExpertiseTags = await edeskio_models.tblExpertiseTags.create({
        TechnicianID: UserID,
        TagID: tagID,
      });
    }

    const tblExpertiseTags = await edeskio_models.tblExpertiseTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
      ],
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

const post_tblMessages_NewMessage = asyncHandler(async (req, res, next) => {
  try {
    const { SentBy, TicketID, Content, DateSent, Private } = req.body;

    const tblMessagesInstance = await edeskio_models.tblMessages.create({
      SentBy: SentBy,
      TicketID: TicketID,
      Content: Content,
      DateSent: DateSent,
      Private: Private,
      Seen: false,
      Edited: false,
    });

    const tblMessages = await edeskio_models.tblMessages.findAll({
      include: [
        {
          model: edeskio_models.tblUsers,
        },
      ],
      where: {
        TicketID: TicketID,
      },
    });

    return res.status(200).json({ tblMessages });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_Assign = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, TechnicianID, OpenDate } = req.body;

    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    if (tblTickets.dataValues.OpenDate === null) {
      tblTickets.set({
        TechnicianID: TechnicianID,
        Status: "Open",
        OpenDate: OpenDate,
        LastModified: date,
      });
    } else {
      tblTickets.set({
        TechnicianID: TechnicianID,
        Status: "Open",
        LastModified: date,
      });
    }

    await tblTickets.save();

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: tblTickets.dataValues.UserID,
      },
    });

    tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          attributes: [],
          as: "User",
          where: {
            CompanyID: tblUsers.dataValues.CompanyID,
            Approved: "1",
          },
        },
      ],
      raw: true,
    });

    const tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_AutoAssign = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, CaseNumber, OpenDate } = req.body;

    const date = moment().format("YYYY-MM-DD HH:mm:ss");

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

    if (tblTickets.dataValues.OpenDate === null) {
      tblTickets.set({
        TechnicianID: TechID,
        Status: "Open",
        OpenDate: OpenDate,
        LastModified: date,
      });
    } else {
      tblTickets.set({
        TechnicianID: TechID,
        Status: "Open",
        LastModified: date,
      });
    }

    await tblTickets.save();

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: tblTickets.dataValues.UserID,
      },
    });

    tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          attributes: [],
          as: "User",
          where: {
            CompanyID: tblUsers.dataValues.CompanyID,
            Approved: "1",
          },
        },
      ],
      raw: true,
    });

    const tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_Priority = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID, Priority } = req.body;

    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    tblTickets.set({
      Priority: Priority,
      LastModified: date,
    });

    await tblTickets.save();

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: tblTickets.dataValues.UserID,
      },
    });

    tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          attributes: [],
          as: "User",
          where: {
            CompanyID: tblUsers.dataValues.CompanyID,
            Approved: "1",
          },
        },
      ],
      raw: true,
    });

    const tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTags_ManageTags = asyncHandler(async (req, res, next) => {
  try {
    const { TagID, CategoryID, OrganizationID } = req.body;

    let tblTagsInstance;

    const tblTagCategoriesInstance =
      await edeskio_models.tblTagCategories.findOne({
        where: {
          CategoryID: CategoryID,
        },
        order: [["CategoryID"]],
      });

    tblTagsInstance = await edeskio_models.tblTags.findOne({
      where: {
        ID: TagID,
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
      where: { CompanyID: organizationID, Approved: true },
    });

    const tblRoles = await edeskio_models.tblRoles.findAll();

    return res.status(200).json({ tblAccess, tblUsers, tblRoles });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const put_tblTickets_CloseTicket = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID } = req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    let tblTickets;

    tblTickets = await edeskio_models.tblTickets.findOne({
      where: {
        ID: TicketID,
      },
    });

    tblTickets.set({
      LastModified: date,
      ClosedDate: date,
      Status: "Closed",
    });

    await tblTickets.save();

    const tblUsers = await edeskio_models.tblUsers.findOne({
      where: {
        ID: tblTickets.dataValues.UserID,
      },
    });

    tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          attributes: [],
          as: "User",
          where: {
            CompanyID: tblUsers.dataValues.CompanyID,
            Approved: "1",
          },
        },
      ],
      raw: true,
    });

    const tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
  }
});

const delete_tblTags = asyncHandler(async (req, res, next) => {
  try {
    const { TagID, OrganizationID, TechnicianID } = req.body;

    let tblTags = await db.tblTags.findOne({
      include: [
        {
          model: db.tblTagCategories,
          attributes: ["CompanyID"],
          where: {
            CompanyID: OrganizationID,
          },
        },
      ],
      where: {
        ID: TagID,
      },
      raw: true,
    });

    let tblExpertiseTags = await edeskio_models.tblExpertiseTags.destroy({
      where: {
        TagID: TagID,
      },
    });

    let tblTicketTags = await edeskio_models.tblTicketTags.destroy({
      where: {
        TagID: TagID,
      },
    });

    tblTags = await edeskio_models.tblTags.destroy({
      where: {
        ID: TagID,
      },
    });

    tblTags = await db.tblTags.findAll({
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

    tblExpertiseTags = await edeskio_models.tblExpertiseTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
      ],
      where: {
        TechnicianID: TechnicianID,
      },
    });

    return res.status(200).json({ tblTags, tblExpertiseTags });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const delete_tblTickets = asyncHandler(async (req, res, next) => {
  try {
    const { TicketID } = req.body;

    let tblTickets;
    let tblTicketTags;

    const tblNotificationsUsers_Find =
      await edeskio_models.tblNotificationsUsers.findAll({
        include: [
          {
            model: db.tblNotifications,
            attributes: [],
            where: {
              TicketID: TicketID,
            },
          },
        ],
        raw: true,
      });

    const tblNotificationsUsers =
      await edeskio_models.tblNotificationsUsers.destroy({
        where: {
          ID: tblNotificationsUsers_Find.map((element) => parseInt(element.ID)),
        },
      });

    const tblMessages = await edeskio_models.tblMessages.destroy({
      where: {
        TicketID: TicketID,
      },
    });

    const tblNotifications = await edeskio_models.tblNotifications.destroy({
      where: {
        TicketID: TicketID,
      },
    });

    tblTicketTags = await edeskio_models.tblTicketTags.destroy({
      where: {
        TicketID: TicketID,
      },
    });

    const tblUsers = await edeskio_models.tblUsers.findOne({
      include: [
        {
          model: db.tblTickets,
          attributes: [],
          as: "Ticket",
          where: {
            ID: TicketID,
          },
        },
      ],
      raw: true,
    });

    console.log(tblUsers);

    const CompanyID = tblUsers.CompanyID;

    tblTickets = await edeskio_models.tblTickets.destroy({
      where: {
        ID: TicketID,
      },
    });

    tblTickets = await db.tblTickets.findAll({
      include: [
        {
          model: db.tblUsers,
          attributes: [],
          as: "User",
          where: {
            CompanyID: CompanyID,
            Approved: "1",
          },
        },
      ],
      raw: true,
    });

    tblTicketTags = await db.tblTicketTags.findAll({
      include: [
        {
          model: db.tblTags,
          attributes: ["Type"],
        },
        {
          model: db.tblTickets,
          attributes: [],
          where: {
            ID: tblTickets.map((element) => parseInt(element.ID)),
          },
        },
      ],
      raw: true,
    });

    return res.status(200).json({ tblTickets, tblTicketTags });
  } catch (error) {
    return res.status(500).json({ error: error.message });
    // return next(new ErrorResponse(error.message, 500));
  }
});

// const notifications_WebSocket = asyncHandler(async (req, res, next) => {
//   try {
//     var io = req.app.get("socketio");
//     // io.emit("hi!");
//   } catch (error) {}
// });

const get_Statistics = asyncHandler(async (req, res, next) => {
  try {
    const { organizationID } = req.query;

    console.log("HERE ", req.query);

    const ticketsStatus = await db.edeskio.query(
      `SELECT Status, Count(Status) as Number from tblTickets a
        INNER JOIN tblUsers b on a.UserID = b.ID 
        where b.CompanyID = ${organizationID}  AND  a.SubmissionDate >= DATEADD(DAY,-7,GETDATE())
        group by Status`
    );

    const ticketsActiveTech = await db.edeskio.query(
      `SELECT u.FirstName + ' ' + u.LastName  as FullName, Count(t.[Status]) as ActiveTickets from tblUsers u
        LEFT JOIN tblTickets t on t.TechnicianID = u.ID AND t.[Status] in ('Open')
        INNER JOIN tblAccess a on a.UserID = u.ID 
        where u.CompanyID = ${organizationID} AND a.RoleName in('Tech','Admin')
        group by u.FirstName, u.LastName`
    );

    const ticketsUnresolved = await db.edeskio.query(
      `SELECT CAST('Last 3 days' as varchar(100)) as Timeframe, 
          (SELECT COUNT(*) 
            FROM tblTickets t
            LEFT JOIN tblUsers u
              ON t.UserID = u.ID
            WHERE u.CompanyID = ${organizationID} AND t.SubmissionDate >= DATEADD(DAY,-3,GETDATE())) AS TicketAmount
      into #unresolved

      INSERT INTO #unresolved (Timeframe, TicketAmount)
      SELECT CAST('3-7 days ago' as varchar(100)) as Timeframe, 
          (SELECT COUNT(*) 
            FROM tblTickets t
            LEFT JOIN tblUsers u
              ON t.UserID = u.ID
            WHERE u.CompanyID = ${organizationID} AND t.SubmissionDate < DATEADD(DAY,-3,GETDATE()) AND t.SubmissionDate >= DATEADD(DAY,-7,GETDATE())) AS TicketAmount

      INSERT INTO #unresolved (Timeframe, TicketAmount)
      SELECT CAST('Over 7 days ago' as varchar(100)) as Timeframe, 
          (SELECT COUNT(*) 
            FROM tblTickets t
            LEFT JOIN tblUsers u
              ON t.UserID = u.ID
            WHERE u.CompanyID = ${organizationID} AND t.SubmissionDate < DATEADD(DAY,-7,GETDATE())) AS TicketAmount

      SELECT * FROM #unresolved`
    );

    const underPerformingTechs = await db.edeskio.query(
      `SELECT b.FirstName + ' ' + b.LastName  as FullName, Count(a.ID) as ClosedTickets from tblTickets a
      INNER JOIN tblUsers b on a.TechnicianID = b.ID 
      INNER JOIN tblAccess c on c.UserID = b.ID 
      where b.CompanyID = ${organizationID} AND c.RoleName in('Tech','Admin') AND a.Status in('Closed') AND a.ClosedDate >= DATEADD(DAY,-14,GETDATE())
      group by Status, FirstName, LastName
      having  Count(a.ID) <=2`
    );

    return res.status(200).json({
      ticketsStatus,
      ticketsActiveTech,
      ticketsUnresolved,
      underPerformingTechs,
    });
  } catch (error) {
    // return res.status(500).send(error.message);
    return next(new errorResponse(error.message, 500));
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
  get_tblMessages_OneTicket,
  post_tblUsers_tblOrganization_Register_NewOrganization,
  post_tblUsers_tblOrganization_Register_ExistingOrganization,
  post_tblTickets_NewTicket,
  post_tblTags_NewTag,
  post_tblTagCategories_NewCategory,
  post_tblExpertiseTags,
  post_tblMessages_NewMessage,
  put_tblTickets_Assign,
  put_tblTickets_AutoAssign,
  put_tblTickets_Priority,
  put_tblPermissions,
  put_tblTags_ManageTags,
  put_tblTagCategories_ManageTags,
  put_tblUsers_Approved,
  put_tblTickets_CloseTicket,
  delete_tblTags,
  delete_tblTickets,
  get_Statistics,
  // notifications_WebSocket,
};
