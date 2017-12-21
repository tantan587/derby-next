var method = ErrorText.prototype;

function ErrorText() {
    this.foundError = false
    this.addError = (field,message) =>
    {
        this.foundError = true;
        this[field] = message;
    }
}


module.exports = ErrorText;
