module.exports = function asyncWrapper(asyncFunction) {
  return function(req, res, next) {
    asyncFunction(req, res, next)
    .then(next)
    .catch(next)
  }
}

