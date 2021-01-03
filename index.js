var express = require('express')
var countries = require('./static/countries')
var cities = require('./static/cities')
const { addCountry, updateCountry } = require('./static/countries')
var cityDetails = require('./static/cities')
const { body, validationResult, check } = require('express-validator');
var bodyParser = require('body-parser')
var headsOfState = require('./static/headsOfState')
var ejs = require('ejs')

var app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

//index/ home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

//list countries
app.get('/listCountries', (req, res) => {
    countries.getCountries()
        .then((result) => {
            console.log(result)
            res.render('showCountries', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//list cities
app.get('/listCities', (req, res) => {
    cityDetails.getCities()
        .then((result) => {
            res.render('showCities', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//list Heads Of State
app.get('/listHeadsOfState', (req, res) => {
    headsOfState.getHeadOfState()
        .then((documents) => {
            res.render('showHeadsOfState', { headsOfState: documents })
        })
        .catch((error) => {
            res.send(errorS)
        })
})

//Delete country
app.get('/deleteCountry/:code', (req, res) => {
    countries.deleteCountry(req.params.code)
        .then((result) => {
            res.redirect('/listCountries')
        })
        .catch((error) => {
            res.send("<h1>Error Message</h1><br><br> <h2>" + req.params.code + " has cities, it cannot be deleted </h2><br>" + " <a href=/>Home</a>")
        })
})

//update country
app.get('/updateCountry/:code', (req, res) => {
    countries.displayCountry(req.params.code)
        .then((result) => {
            res.render('updateCountry', { countries: result, errors: undefined })
        })
        .catch((error) => {
            res.send(error)
        })

})

//City Details (all other infomation)
app.get('/cityDetails/:code', (req, res) => {
    cities.displayEachCity(req.params.code)
        .then((result) => {
            res.render('cityDetails', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//City Details (cities only)
app.get('/cityDetails', (req, res) => {
    cities.displayAllDetails()
        .then((result) => {
            res.render('cityDetails', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//update country
//name must have a minimum length of 3 characters 
app.post('/updateCountry', [check('name').isLength({ min: 3 }).withMessage("The Country Name is mandatory")],
    (req, res) => {
        var errors = validationResult(req)

        //catching any errors and redirected to list Countries page if successful
        if (!errors.isEmpty()) {
            res.render("updateCountry", { errors: errors.errors, countries: errors.errors })
        } else {
            countries.updateCountry(req.body.name, req.body.details, req.body.code)
                .then((result) => {
                    res.redirect('/listCountries')
                })
                .catch((error) => {
                    res.send(error)
                })
        }
    })

//add Country
app.get('/addCountry', (req, res) => {

    //defining the error
    res.render('addCountry', { errors: undefined })
})

//county code must be at least 3 characters long and maximum 3 characters long
//otherwise print quoted text
app.post('/addCountry', [check('code').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"),
check('name').isLength({ min: 3 }).withMessage("Country Name must be at least 3 characters"),],
    (req, res) => {

        var errors = validationResult(req)
        //catching any errors and redirected to the listCountries page if successful
        if (!errors.isEmpty()) {

            res.render("addCountry", { errors: errors.errors })
        } else {


            countries.addCountry(req.body.code, req.body.name, req.body.details)
                .then((result) => {
                    res.redirect('/listCountries')
                })
                .catch((error) => {
                    res.send("Error: " + req.body.code + " already exists")
                })
        }
    })

//add Head Of State
app.get('/addHeadOfState', (req, res) => {
    res.render('addHeadOfState', { errors: undefined })
})

app.post('/addHeadOfState',
    //Country code has to be minimum and maximum 3 characters.
    //head of state must be 3 characters otherwise print quoted text
    [check('_id').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"),
    check('headOfState').isLength({ min: 3 }).withMessage("Head Of State must be at least 3 characters"),],
    (req, res) => {

        var errors = validationResult(req)

        //catching any errors and redirecting to the list heads of state page if successful
        if (!errors.isEmpty()) {
            res.render("addHeadOfState", { errors: errors.errors })
        } else {
            headsOfState.addHeadOfState(req.body._id, req.body.headOfState)
                .then((result) => {
                    res.redirect('/listHeadsOfState')
                })
                //error message print if id is the same
                .catch((error) => {
                    res.send("Error: " + req.body._id + " already exists")
                })
        }
    })

//localhost:3557
app.listen(3557, () => {
    console.log("Listening on Port 3557")
})