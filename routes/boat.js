var express = require('express');
var router = express.Router();
var model = require('../model');


function hasOwnProperty (o, p) {
  return Object.prototype.hasOwnProperty.call(o, p);
}

function validateData (o) {
  var valid = o !== null && typeof o === 'object';
  valid = valid && hasOwnProperty(o, 'brand');
  valid = valid && hasOwnProperty(o, 'color');
  valid = valid && typeof o.brand === 'string';
  valid = valid && typeof o.color === 'string';
  return valid && {
    brand: o.brand,
    color: o.color
  };
}

function validateBody (o) {
  var valid = o !== null && typeof o === 'object';
  valid = valid && hasOwnProperty(o, 'data');
  valid = valid && o.data !== null && typeof o.data === 'object';
  var data = valid && validateData(o.data);
  return valid && data && {
    data: data
  };
}

function isIdValid (n) {
  n = Number(n)
  var MAX_SAFE = Math.pow(2, 53) - 1
  return isFinite(n) && Math.floor(n) === n && Math.abs(n) <= MAX_SAFE
}

function isParamsValid (o) {
  var valid = o !== null && typeof o === 'object';
  valid = valid && hasOwnProperty(o, 'id');
  valid = valid && isIdValid(o.id);
  return valid;
}

function badRequest () {
  const err = new Error('Bad Request');
  err.status = 400;
  return err;
}



router.post("/", function (req, res, next){
  var body= validateBody(req.body);
  if(body){
      model.boat.create(model.boat.uid(), req.body.data, (err, id)=>{
        if (err) {
          next(err)
          return
        }
        else res.status(201).json({id:id })
      })
  }
  else{
    next(badRequest())
  }
  
})

router.get("/:id", function(req, res, next){
  if (isParamsValid(req.params)){
  model.boat.read(req.params.id, (err, result)=>{
    if (err){
      if(err.message == 'not found') next()
      else next(err)
    }
    else{
      var sanitizedResult = validateData(result);
      if (sanitizedResult){
        res.send(sanitizedResult);
      }else{
        next(badRequest())
      }
    } 
  })
}else{
  next(badRequest())
}
})



router.post("/:id/update", function(req,res, next){
  model.boat.update(req.params.id, req.body.data, (err)=>{
    if (err){
      if (err.message =="not found") next();
      else next(err)
    } else{
      res.status(204).send("update successfully")
    }
  })
})

router.delete("/:id", function(req, res, next){
  if (isParamsValid(req.params.id)){
  model.boat.del(req.params.id, (err)=>{
    if(err) {
      if (err.message=="not found"){
        next()
      }else{
        next(err)
      }
    }
    else res.status(204).send()
  })}else{
    next(badRequest())
  }
})

router.put('/:id', function( req, res, next){
  model.boat.create(req.params.id, req.body.data, (err)=>{
    if (err){
      if (err.message =="resource exists"){
        model.boat.update(req.params.id, req.body.data, (err)=>{
          if (err) next(err);
          else res.status(204).send();
        })
      }else{
        next(err);
      }

    }else{
      res.status(201).send("put successfuly")
    }
  })
})

module.exports = router;