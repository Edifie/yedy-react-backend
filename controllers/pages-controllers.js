const { v4: uuidv4 } = require('uuid'); //universally unique identifier generator

const HttpError = require("../models/http-error");


const PAGES = [
  {
    id: "p1",
    name: "Webinar Butique",
    tema: "Boho",
    area: "Hardware Store",
    type: "Basic",
    imageUrl: "https://i.ytimg.com/vi/U72Aoxuv5d8/maxresdefault.jpg",
    creator: "u1",
  },
];

// Get page by ID
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

// Get page by User
const getPageByUser = (req, res, next) => {
  const userId = req.params.uid;
  const page = PAGES.find((p) => {
    return p.creator === userId;
  });

  if (!page) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 400)
    );
  }
  res.json({ page });
};

const createPage = (req, res, next) => {
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

exports.getPageById = getPageById;
exports.getPageByUser = getPageByUser;
exports.createPage = createPage;
