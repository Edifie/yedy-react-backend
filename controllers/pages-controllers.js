const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Page = require("../models/page");
const User = require("../models/user");

/*********************************************** GET PAGE BY ID ***********************************************/
// GET http://localhost:8080/api/pages/:pid
const getPageById = async (req, res, next) => {
  const pageId = req.params.pid; // {pid: 'p1}
  let page;

  try {
    page = await Page.findById(pageId);
  } catch (err) {
    const error = new HttpError(
      // this error will display if our get request generally has some kind of a problem
      "Something went wrong, could not find a page with that ID.",
      500
    );
    return next(error);
  }

  // this error will display if the get request it's okay but don't have an id in the database
  if (!page) {
    // HttpError(messsage, status code)
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  // to get rid of _id in the mongoDB
  res.json({ page: page.toObject({ getters: true }) }); // { page } => { page: page }
};

/*********************************************** GET PAGE BY USER ID ***********************************************/
// GET http://localhost:8080/api/pages/user/:uid
const getPagesByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let pages;

  // difference between find() and findById() is that find() will return the all pages to specific userID and not the specific page.
  // another reason that, also MongoDB uses find() as a cursor and iterates every object that it finds with the id.
  try {
    pages = await Page.find({ creator: userId }); //returns an array
  } catch (err) {
    const error = new HttpError(
      "Fetching pages failed. Please try again later.",
      500
    );
    return next(error);
  }

  if (!pages || pages.length === 0) {
    const error = new HttpError(
      "Could not find a place for the provided user id.",
      400
    );
    return next(error);
  }
  res.json({ pages: pages.map((page) => page.toObject({ getters: true })) });
};

/*********************************************** CREATE PAGE ***********************************************/
// POST http://localhost:8080/api/pages/
const createPage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, tema, type, area, creator } = req.body;
  // instead of doing -> const name = req.body.name for each of them use {}

  const createdPage = new Page({
    name,
    area,
    tema,
    type,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  // check if the user is already exists to add a page
  if (!user) {
    const error = new HttpError("We could not find user for provided ID.", 404);
    return next(error);
  }

  // console.log(user);

  try {
    await createdPage.save(); //save the page to db
    user.pages.push(createdPage); // add to page id to user
    await user.save(); // save the page id to user db
  } catch (err) {
    console.log("err", err);
    const error = new HttpError("Creating page failed. Please try again", 500);
    return next(error);
  }

  res.status(201).json({ page: createdPage }); // 201 - sucessfully created in the server
};

/*********************************************** UPDATE PAGE ***********************************************/
// PATCH http://localhost:8080/api/pages/:pid
const updatePageById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  //const stores the address of the object and not the object it self
  const { name, tema, type, area } = req.body;
  const pageId = req.params.pid;

  try {
    page = await Page.findById(pageId);
  } catch (err) {
    const error = new HttpError(
      // this error will display if our get request generally has some kind of a problem
      "Something went wrong, could not update a page with that ID.",
      500
    );
    return next(error);
  }

  // applying if statement, won't lose the data if the user only wants to update one field instead of given all req.body
  if (name) page.name = name;
  if (type) page.type = type;
  if (area) page.area = area;
  if (tema) page.tema = tema;

  try {
    await page.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update page",
      500
    );
    return next(error);
  }

  res.status(201).json({ page: page.toObject({ getters: true }) });
};

/*********************************************** DELETE PAGE ***********************************************/
// DELETE http://localhost:8080/api/pages/:pid
const deletePageById = async (req, res, next) => {
  const pageId = req.params.pid;

  let page;

  try {
    // populate -> refer to a document storedin another collection and to work with data in that existing document of that other collection
    page = await Page.findById(pageId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete page.",
      500
    );
    return next(error);
  }

  if (!page) {
    const error = new HttpError("Could not find page for this ID.", 404);
    return next(error);
  }

  try {
    await page.remove();
    page.creator.pages.pull()
  } catch (err) {
    console.log("err", err);
    const error = new HttpError(
      "Something went wrong, could not delete the page.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted page!" });
};

//Exports
exports.getPageById = getPageById;
exports.getPagesByUser = getPagesByUser;
exports.createPage = createPage;
exports.updatePageById = updatePageById;
exports.deletePageById = deletePageById;
