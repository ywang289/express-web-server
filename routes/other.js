const express = require('express');
const requestProxy = require("express-request-proxy");
const router = express.Router();

router.get('/', async function(req, res, next) {
const { url } = req.query

const proxy = requestProxy({ url });
proxy(req, res, next);
});

module.exports = router;