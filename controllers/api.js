'use strict';

const express = require('express');
const WorkersController = require('./workers');
const TeamsController = require('./teams');

class ApiController{
    constructor(workersService, teamsService){
        this.router = express.Router();
        this._teamsController = new TeamsController(workersService, teamsService);
        this._workersController = new WorkersController(workersService);
        this._registerRoutes();
    }

    _registerRoutes(){
        this.router.use('/workers', this._workersController.router);
        this.router.use('/teams', this._teamsController.router);
    }
}

module.exports = ApiController;
