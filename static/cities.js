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

//reads cities in
var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//displaying all of the city details
var displayAllDetails = function () {

    return new Promise((resolve, reject) => {
        pool.query('select city.cty_code, city.co_code, city.cty_name, city.population, city.isCoastal, city.areaKM, country.co_name from city left join country on city.co_code = country.co_code;')

            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//displaying each city
var displayEachCity = function (cty_code) {

    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select city.cty_code,city.co_code, city.cty_name, city.population, city.isCoastal, city.areaKM, country.co_name from city left join country on city.co_code = country.co_code where city.cty_code = ?',
            values: [cty_code]
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


module.exports = { getCities, displayAllDetails, displayEachCity }

