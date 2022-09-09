const mongoose = require('mongoose');

// DB PRODUCTION
const database = process.env.DATA_BASE;

const conn = async () => {
    try {
        
        // DB Mongoose Connect
        const dbConn = await mongoose.connect(database);
        
        console.log('Conectou ao banco');

        return dbConn;

    } catch (error) {

        console.log(error);

    }
}

conn();

module.exports = conn;