var PLATFORM = process.env.PLATFORM || 'atm';
var mongoUri = 'mongodb://localhost:27017/atm';



var defaults = {
    PLATFORM: PLATFORM,
    mongoUri: mongoUri,
    mongoDB: {
        PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
        HOST: process.env.DB_HOST || '127.0.0.1',
        PORT: process.env.DB_PORT || 27017,
        NAME: PLATFORM || 'atm',
        USER: '',
        PASSWORD: '',
        get URL() { return process.env.dbUrl || `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.NAME}` }
    },
    server: {
        PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
        HOST: process.env.SERVER_HOST || '0.0.0.0',
        PORT: process.env.SERVER_PORT || '3000',
        get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
    },
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
    swagger: require('./swagger'),
};


module.exports = defaults;


