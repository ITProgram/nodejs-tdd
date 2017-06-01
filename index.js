'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const DatabaseContext = require('./context/database');
const TeamsService = require('./services/teams');
const WorkersService = require('./services/workers');
const ApiController = require('./controllers/api');


const dbcontext = new DatabaseContext(Sequelize);
const teamsService = new TeamsService(dbcontext.team, dbcontext.worker);
const workersService = new WorkersService(dbcontext.worker, dbcontext.contacts);
const apiController = new ApiController(workersService, teamsService);


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));


app.use('/api', apiController.router);

app.set('port', (process.env.PORT || 3001));
dbcontext.sequelize.sync()
    .then(() => {
        app.listen(app.get('port'), () => console.log(`Running on http://localhost:${app.get('port')}`));
    })
    .catch(err => console.error(err));
