var _ = require('lodash');

exports.register = function (server, options, next) {

    // Hook onto the 'onPostHandler'
    server.ext('onPostHandler', function (request, reply) {
        // Get the response object
        var response = request.response;

        // Check to see if the response is a view
        if (response.variety === 'view') {

            if(_.isEmpty(response.source.context)){
                response.source.context = {};
            }

            response.source.context = _.merge(options(server,request),response.source.context);
        }
        return reply.continue();
    });
    return next();
};

exports.register.attributes = {
    name: 'g'
};