const { Router } = require("express");
const {
  get_tblRoles_All,
  get_tblOrganizations_All,
  get_tblTags_All,
  get_tblUser,
  get_tblUsers_One,
  get_tblUsers_All,
  post_tblUsers_tblOrganization_Register_NewOrganization,
  post_tblUsers_tblOrganization_Register_ExistingOrganization,
  post_tblTickets_NewTicket,
  get_tblTickets,
  put_tblTickets_SelfAssign,
  put_tblPermissions,
} = require("../controllers/edeskioControllers");
const router = Router();

router.get("/get_tblRoles_All", get_tblRoles_All);

router.get("/get_tblTags_All", get_tblTags_All);

router.get("/get_tblTickets", get_tblTickets);

router.get("/get_tblOrganizations_All", get_tblOrganizations_All);

router.get("/get_tblUser", get_tblUser);

router.get("/get_tblUsers_One", get_tblUsers_One);

router.get("/get_tblUsers_All", get_tblUsers_All);

router.post("/post_tblTickets_NewTicket", post_tblTickets_NewTicket);

router.post(
  "/post_tblUsers_tblOrganization_Register_NewOrganization",
  post_tblUsers_tblOrganization_Register_NewOrganization
);

router.post(
  "/post_tblUsers_tblOrganization_Register_ExistingOrganization",
  post_tblUsers_tblOrganization_Register_ExistingOrganization
);

router.put("/put_tblTickets_SelfAssign", put_tblTickets_SelfAssign);

router.put("/put_tblPermissions", put_tblPermissions);

module.exports = router;
