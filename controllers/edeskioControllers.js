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
    const tblRoles = await edeskio_models.tblRoles.findAll();
    return res.status(200).json({ tblRoles });
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
        CompanyID: tblOrganizationsSelect.dataValues.ID,
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

      return res.status(200).json({ msg: "Success" });
    } catch (error) {
      // return res.status(500).send(error.message);
      return next(new errorResponse(error.message, 500));
    }
  });

module.exports = {
  get_tblRoles_All,
  get_tblUsers_One,
  post_tblUsers_tblOrganization_Register_NewOrganization,
  post_tblUsers_tblOrganization_Register_ExistingOrganization,
};
