//connection to mongo
const MongoClient = require('mongodb').MongoClient;

// only local host for mongodb
const url = 'mongodb://localhost:27017';

//define const
const dbName = 'headsOfStateDB'
const colName = 'headsOfState'

//initalise variables
var headsOfStateDB
var headsOfState

//connection to url
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        //read in database
        headsOfStateDB = client.db(dbName)
        //reads in collection from database
        headsOfState = headsOfStateDB.collection(colName)
    })
    .catch((error) => {
        console.log(error)
    })

//reads in head of state
var getHeadOfState = function () {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//gives option to add a Head of state
var addHeadOfState = function (_id, headOfState) {
    return new Promise((resolve, reject) => {
        state.insertOne({ "_id": _id, "headOfState": headOfState })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getHeadOfState, addHeadOfState }

