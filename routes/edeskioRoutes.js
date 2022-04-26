const { Router } = require("express");
const {
  get_tblRoles_All,
  get_tblOrganizations_All,
  get_tblTags_All,
  get_tblTagCategories,
  get_tblUser,
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
  get_tblTickets,
  put_tblTickets_Assign,
  put_tblTickets_AutoAssign,
  put_tblTickets_Priority,
  put_tblPermissions,
  put_tblTags_ManageTags,
  put_tblTagCategories_ManageTags,
  put_tblUsers_Approved,
  delete_tblTags,
  notifications_WebSocket,
} = require("../controllers/edeskioControllers");
const router = Router();

router.get("/get_tblRoles_All", get_tblRoles_All);

router.get("/get_tblTags_All", get_tblTags_All);

router.get("/get_tblTagCategories", get_tblTagCategories);

router.get("/get_tblTickets", get_tblTickets);

router.get("/get_tblOrganizations_All", get_tblOrganizations_All);

router.get("/get_tblUser", get_tblUser);

router.get("/get_tblUsers_One", get_tblUsers_One);

router.get("/get_tblUsers_All", get_tblUsers_All);

router.get("/get_tblExpertiseTags_One", get_tblExpertiseTags_One);

router.get("/get_TechniciansAssignInfo", get_TechniciansAssignInfo);

router.post("/post_tblTickets_NewTicket", post_tblTickets_NewTicket);

router.post("/post_tblTags_NewTag", post_tblTags_NewTag);

router.post(
  "/post_tblTagCategories_NewCategory",
  post_tblTagCategories_NewCategory
);

router.post("/post_tblExpertiseTags", post_tblExpertiseTags);

router.post(
  "/post_tblUsers_tblOrganization_Register_NewOrganization",
  post_tblUsers_tblOrganization_Register_NewOrganization
);

router.post(
  "/post_tblUsers_tblOrganization_Register_ExistingOrganization",
  post_tblUsers_tblOrganization_Register_ExistingOrganization
);

router.put("/put_tblTickets_Assign", put_tblTickets_Assign);

router.put("/put_tblTickets_AutoAssign", put_tblTickets_AutoAssign);

router.put("/put_tblTickets_Priority", put_tblTickets_Priority);

router.put("/put_tblPermissions", put_tblPermissions);

router.put("/put_tblTags_ManageTags", put_tblTags_ManageTags);

router.put("/put_tblTagCategories_ManageTags", put_tblTagCategories_ManageTags);

router.put("/put_tblUsers_Approved", put_tblUsers_Approved);

router.delete("/delete_tblTags", delete_tblTags);

router.get("/test", notifications_WebSocket);

module.exports = router;
