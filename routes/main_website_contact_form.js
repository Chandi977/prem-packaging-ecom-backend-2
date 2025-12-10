const express = require("express");
const {
  createContactForm,getContactFormData,countContactFormData
} = require("../controller/main_website_contact_form");

const router = express.Router();

router.post("/contact-form/create", createContactForm);
router.get("/contact/form/get", getContactFormData);
router.get("/contact/form/count", countContactFormData);


module.exports = router;