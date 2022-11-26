class HttpError extends Error {
    constructor(message, errorCode){

        // super -> to call the constructor of the base class(Error)
        super(message) //add a 'message' property

        // this -> to call the constructor of the current class (HttpError)
        this.code = errorCode // add a 'code' property
    }
}

module.exports = HttpError