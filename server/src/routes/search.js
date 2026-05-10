const r = require("express").Router();
const c = require("../controllers/searchController");

r.get("/", c.global);
module.exports = r;
