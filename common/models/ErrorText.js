function ErrorText() {
    
  this.addError = (field,message) =>
  {
    this[field] = message
  }
  this.foundError = () =>
  {
    return Object.keys(this).length > 2
  }
}

module.exports = ErrorText


