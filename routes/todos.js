const express = require('express');
const requestProxy = require('express-request-proxy');
const router = express.Router();

router.use('/', requestProxy({
  url: "https://jsonplaceholder.typicode.com/todos"
}));

module.exports = router;
