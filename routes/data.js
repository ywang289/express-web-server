

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const { Readable, Transform } = require('stream')

  function stream () {
    const readable = Readable.from([
      'this', 'is', 'a', 'stream', 'of', 'data'
    ].map((s) => s + '<br>'))
    const delay = new Transform(({
      transform (chunk, enc, cb) {
        setTimeout(cb, 500, null, chunk)
      }
    }))
    return readable.pipe(delay)
  }

  const data = stream()



  data.pipe(res, { end: false })

  finished(data, (err) => {
      if (err) {
          next(err)
          return
      }

      res.end()
  })
});

module.exports = router;