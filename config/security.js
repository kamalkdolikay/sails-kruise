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
            address: 'gurjeets@smartdatainc.net',
            password: 'gurjeets'
        },

    },
    server: {
        url: 'https://efarmapi.herokuapp.com'
    }
};