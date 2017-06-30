var promisify = require('bluebird').promisify;;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {

    register: function(data){
        console.log("data", data)
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        return API.Model(Users).create(data).then(function(user){
            return {
                message: "success"
            }
        })
    }
}