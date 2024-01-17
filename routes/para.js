'use strict'
const express = require('express')
const app = express()
const router = express.Router()


const upper = (input = '') => {
  if (Array.isArray(input)) {
    return input.map(i => String(i).toUpperCase())
  }

  return input.toUpperCase()
}

router.get('/', (req, res) => {
  setTimeout(() => {
    res.send(upper(req.query.un))
  }, 1000)
})


module.exports = router;