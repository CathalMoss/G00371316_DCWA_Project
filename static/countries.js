var mysql = require('promise-mysql');

var pool

mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'cathaldmoss00!',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error);
    });

//reads in Countries
var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//gives the option to add country
var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        pool.query('insert into country set ?', { co_code, co_name, co_details })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//gives the option to edit a selected country
var updateCountry = function (co_name, co_details, co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update country set co_name = ?, co_details = ? where co_code = ?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)

            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//displays the Countries
var displayCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//gives the option to delete a country
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { getCountries, addCountry, deleteCountry, updateCountry, displayCountry }