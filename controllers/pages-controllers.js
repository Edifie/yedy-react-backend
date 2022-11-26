const { v4: uuidv4 } = require("uuid"); //universally unique identifier generator
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let PAGES = [
  {
    id: "p1",
    name: "Webinar Butique",
    tema: "Boho",
    area: "Hardware Store",
    type: "Basic",
    imageUrl: "https://i.ytimg.com/vi/U72Aoxuv5d8/maxresdefault.jpg",
    creator: "u1",
  },
  {
    id: "p2",
    name: "Novo Butique",
    tema: "Minimalist",
    area: "Sell clothes",
    type: "Responsive",
    imageUrl: "https://i.ytimg.com/vi/U72Aoxuv5d8/maxresdefault.jpg",
    creator: "u1",
  },
];

// Route to get page by ID
const getPageById = (req, res, next) => {
  const pageId = req.params.pid; // {pid: 'p1}
  const page = PAGES.find((p) => {
    return p.id === pageId;
  });

  if (!page) {
    // HttpError(messsage, status code)
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ page }); // { page } => { page: page }
};

// Route to get page by User
const getPagesByUser = (req, res, next) => {
  const userId = req.params.uid;
  const pages = PAGES.filter((p) => {
    return p.creator === userId;
  });

  if (!pages || pages.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 400)
    );
  }
  res.json({ pages });
};

// Route to Create Page
const createPage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, tema, type, area, creator } = req.body;
  // instead of doing -> const name = req.body.name for each of them use {}

  const createdPage = {
    id: uuidv4(),
    name,
    tema,
    type,
    area,
    creator,
  };

  PAGES.push(createdPage); // unshift(createdPage)

  res.status(201).json({ page: createdPage }); // 201 - sucessfully created in the server
};

// Route to update page by ID
const updatePageById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  //const stores the address of the object and not the object it self
  const { name, tema, type, area } = req.body;
  const pageId = req.params.pid;

  const updatedPage = { ...PAGES.find((p) => p.id === pageId) };
  const pageIndex = PAGES.findIndex((p) => p.id === pageId);

  // applying if statement, won't lose the data if the user only wants to update one field instead of given all req.body
  if (name) updatedPage.name = name;
  if (type) updatedPage.type = type;
  if (area) updatedPage.area = area;
  if (tema) updatedPage.tema = tema;

  // replace the old object at that index with the new updatedPage
  PAGES[pageIndex] = updatedPage;

  res.status(201).json({ page: updatedPage });
};

// Route to delete page by ID
const deletePageById = (req, res, next) => {
  const pageId = req.params.pid;

  if(!PAGES.find(p=> p.id === pageId)){
    throw new HttpError('Could not find a page with that ID!', 404)
  }
  // if we return true in that function, we keep that page in the newly returned array. if it false, drop it.
  PAGES = PAGES.filter((p) => p.id !== pageId);
  res.status(200).json({ message: "Deleted page!" });
};

exports.getPageById = getPageById;
exports.getPagesByUser = getPagesByUser;
exports.createPage = createPage;
exports.updatePageById = updatePageById;
exports.deletePageById = deletePageById;
