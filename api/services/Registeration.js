var promisify = require('bluebird').promisify;;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {

    register: function(data){
        console.log("data", data);
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        return API.Model(Users).create(data).then(function(user){
            return {
                message: "success"
            };
        });
    },

    login: function(data){
        console.log("data",data);
        let username = data.username;
        return API.Model(Users).findOne({username:username}).then(function(user){
            console.log("user",user);
            if( user === undefined ){
                return {
                    success: false,
                    error: {
                        code: 404,
                        message: "user not found"
                    }
                };
            }

            if( !bcrypt.compareSync(data.password, user.password) ){
                return {
                    success: false,
                    error: {
                        code: 404,
                        message: "incorrect password"
                    }
                };
            } else {
                return Tokens.generateToken({
                        user_id: user.id,
                        client_id: Tokens.generateTokenString()
                    });
            }
        });
    }
}