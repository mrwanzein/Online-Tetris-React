const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });
const assert = require("assert");

const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const insertOneUser = async (username, password) => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();

        const db = client.db('Online_Tetris_React');
        
        const existingUser = await db.collection('users').findOne({ username });
        console.log(existingUser)
        if(existingUser) {
            client.close();
            return true;
        } else {
            const r = db.collection('users').insertOne({
                username,
                password: password
            })
            assert(1, r.insertedCount);
            client.close();
            return false;
        }


    } catch(err) {
        console.log(err);
    }
}

const getUser = async (username) => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();

        const db = client.db('Online_Tetris_React');
        const userExist = await db.collection('users').findOne({ username });

        client.close();

        return userExist;

    } catch(err) {
        console.log(err);
    }
}

module.exports = { insertOneUser, getUser };