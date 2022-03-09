const { Router } = require("express");
const {
  get_tblRoles_All,
  get_tblOrganizations_All,
  get_tblUsers_One,
  post_tblUsers_tblOrganization_Register_NewOrganization,
  post_tblUsers_tblOrganization_Register_ExistingOrganization,
} = require("../controllers/edeskioControllers");
const router = Router();

router.get("/get_tblRoles_All", get_tblRoles_All);

router.get("/get_tblOrganizations_All", get_tblOrganizations_All);

router.get("/get_tblUsers_One", get_tblUsers_One);

router.post(
  "/post_tblUsers_tblOrganization_Register_NewOrganization",
  post_tblUsers_tblOrganization_Register_NewOrganization
);

router.post(
  "/post_tblUsers_tblOrganization_Register_ExistingOrganization",
  post_tblUsers_tblOrganization_Register_ExistingOrganization
);

module.exports = router;
