var fs = require('fs');

module.exports = {

    uploadImage: function(data, context, req, res) {
        var matches = data.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let response = {};
        response.data = new Buffer(matches[2], 'base64');
        fs.writeFile('assets/kd.jpg', response.data, function(imgerr, img) {
            console.log(imgerr, img);
        });
        return {
            success: true,
            data: matches
        };
    }
}