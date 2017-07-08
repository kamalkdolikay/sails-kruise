module.exports.security = {
    oauth : {
        version : '2.0',
        token : {
            length: 32,
            expiration: 36000
        }
    },
    admin: {
        email: {
            address: 'kamal.llymach@gmail.com',
            password: 'kamalkd123'
        },

    },
    server: {
        url: 'http://localhost:1337'
    }
};