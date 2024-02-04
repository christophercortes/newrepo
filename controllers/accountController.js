const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const { getClassifications } = require("../models/inventory-model");

/* Delivering a Login View */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    //login match in render function controller
    title: "Login",
    nav,
    errors: null,
  });
}

/*Delivering a registration view connected to
accountRoute.js */

async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    //register must match in the login.js function
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.accountRegister(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* Delivering Management View */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  });
}

/* Delivering Add Classification */
async function buildAddClassification(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: req.flash("error"), // Pass errors to the template
    });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
}

/* Delivering Add Inventory View */
async function buildAddInventory(req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classifications = await getClassifications();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications,
      errors: req.flash("error"),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  buildManagement,
  buildAddClassification,
  buildAddInventory,
};
