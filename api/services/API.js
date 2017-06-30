var Promise = require('bluebird'),
    promisify = Promise.promisify,
    sendResult,
    sendError,
    Model,
    API;

sendResult = function (request, response) {
    return function (result) {
        // Assume the response has already been sent if a null(ish) result
        if (result == null) return;

        //Ensure JSON Formatted Response
        if (typeof(result) != 'object') {
            result = {result: result};
        }
        response.json(result);
    }
};

sendError = function (request, response) {
    return function (err) {
        var str,
            errTypes = ['unauthorized', 'forbidden', 'invalid', 'internal'],
            lineSeparator = "\n-------------------------------------------------------------------------\n",
            type = typeof(err);

        if (type != 'object') {

            //Wrap the error in an object
            err = {message: err};
        }

        else if (err instanceof Error) {
            err = {
                name: err.name || undefined,
                message: err.message || undefined,
                raw: err
            };
        }

        if (type == 'string' || typeof err.message == 'string') {
            //Check if the error is more specific
            str = err.message.toLowerCase();
            if (errTypes.indexOf(str) > -1) {
                err[str] = true;
            }
            else if (err.code == "E_VALIDATION") {
                err.invalid = true;
            }
            else {
                err.internal = true;
            }
        }

        //Decide error response

        if (err.unauthorized) {
            response.send(401, err);
        }
        else if (err.forbidden) {
            response.forbidden(err);
        }
        else if (err.invalid) {
            response.send(422, err);
        }
        else if (err.internal) {
            response.serverError(err);
        }
        else {
            err.request = true;
            response.badRequest(err);
        }

        // Output error to server log
        console.log(lineSeparator);
        console.error(err);
        if (err.raw) console.error(err.raw);
        console.log("\nError Date: ", new Date());
        console.log(lineSeparator);
        //throw err.raw;
    }
};

Model = function (model) {
    this.model = model;
};

Model.prototype = {

    create: function (attributes) {
        return promisify(this.model.create)(attributes);
    },

    find: function () {
        return promisify(this.model.find);
    },
    findWithQuery: function ( criteria) {
        return promisify(this.model.find)(criteria);
    },
    findOne: function (criteria) {
        return promisify(this.model.findOne)(criteria);
    },

    findOrCreate: function (criteria, attributes) {
        return promisify(this.model.findOrCreate)(criteria, attributes);
    },

    update: function (criteria, attributes) {
        return promisify(this.model.update)(criteria, attributes);
    },


    destroy: function (criteria) {
        return promisify(this.model.destroy)(criteria);
    }
};

API = function (action, req, res) {
    var data, context;

    //Validate Arguments
    if (!res || !req || !action) {
        throw {
            internal: true,
            message: "API Call Problem",
            parameters: {
                action: (action && "OK") || "BAD",
                request: (req && "OK") || "BAD",
                response: (res && "OK") || "BAD"
            }
        };

    }

    context = req.context || {};

    //Setup User Identity and Authorization data for ease of access
    context.identity      = req.identity;
    context.authorization = req.authorization;

    data = req.params.all();

    return Promise.method(action)(data, context, req, res)
        .then(sendResult(req, res))
        .catch(sendError(req, res));
};

API.Model = function (model) {
    return new Model(model);
};

module.exports = API;