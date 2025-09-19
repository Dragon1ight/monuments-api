const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const sequelize = require('./src/db/sequelize')
const auth = require('./src/auth/auth')
const http = require('http');
const setupSocketServer = require('./src/socket');


const app = express()
const server = http.createServer(app);
const io = setupSocketServer(server);
app.set('io', io);

function nightBlocker (req, res, next){
    const hour = new Date().getHours();
    if(hour >= 0 && hour < 6 ){
        res.status(503).json({message: "Le serveur est en cours de maintenance", data: null})
    }else{
        next();
    }
}

sequelize.initDb()

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(nightBlocker)
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan("dev"))
    .use(auth)
    
require('./src/docs/swagger')(app)

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Monumento ! Utilisez les routes pour interagir avec les monuments.')
})

// Monuments routes
require('./src/routes/findAllMonuments.route')(app)
require('./src/routes/searchMonuments.route')(app)
require('./src/routes/findMonumentByPK.route')(app)
require('./src/routes/createMonument.route')(app)
require('./src/routes/updateMonument.route')(app)
require('./src/routes/deleteMonument.route')(app)

// Anecdote routes
require('./src/routes/findAnecdotesByMonument.route')(app)
require('./src/routes/createAnecdotes.route')(app)
require('./src/routes/updateAnecdote.route')(app)
require('./src/routes/deleteAnecdote.route')(app)

// User routes
require('./src/routes/login.route')(app)
require('./src/routes/register.route')(app)
require('./src/routes/refreshToken.route')(app)

// Favorite routes
require('./src/routes/favorites.route')(app);

app.use((req, res) => {
    const url = req.originalUrl
    const method = req.method
    const message = `La ressource demandée : "${method} ${url}" n'existe pas. Réessayez avec une autre URL.`
    res.status(404).json({ message, data: null })
})


server.listen(3000, () => console.log('Server & Socket.io running at http://localhost:3000'))

