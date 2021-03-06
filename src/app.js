const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const app = express()
const port = process.env.PORT || 3000

//Setting up directories
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setting the view engine to HBS
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Defining the static directory
app.use(express.static(publicDirectory))

//Writing function of each page
app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Shivam Pande"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "Shivam Pande"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        name: "Shivam Pande",
        helpMessage: 'To see the weather, navigate to the main Weather page, enter your location in the search box and press Search'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "No address provided!"
        })
    }

    geocode(req.query.address, (error, { location, latitude, longitude } = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        if (req.query.address === undefined) {
            return res.send({
                error: "Location incorrect! Please enter a proper location."
        })
    }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
            
        })

    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        name: "Shivam Pande", 
        errorMessage: "Help article not found!"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        name: "Shivam Pande",
        errorMessage: "Page Not Found!"
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '. Yayyyyyy!')
})