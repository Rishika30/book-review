class CustomErrorHandler extends Error {
    status;
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message ="Your email or password is wrong") {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message ="Unauthorised User") {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message ="404 Not Found") {
        return new CustomErrorHandler(404, message);
    }

    static authorizeRoles(message) {
        return new CustomErrorHandler(403, message);
    }

    static badRequest(message) {
        return new CustomErrorHandler(400, message);
    }

    static serverError(message ="Internal Server Error") {
        return new CustomErrorHandler(500, message);
    }

}

export default CustomErrorHandler;