'use strict';

const express = require('express');

class TeamsController{
    constructor(workersService, teamsService){
        this._workersService = workersService;
        this._teamsService = teamsService;
        this.router = express.Router();
        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.del = this.del.bind(this);
        this._registerRoutes();
    }

    _getRoutes(){
        return {
            '/': [{method: 'get', cb: this.readAll}, {method: 'post', cb: this.create}],
            '/:id': [{method: 'get', cb: this.read}, {method: 'delete', cb: this.del}, {method: 'put', cb: this.update}]
        }
    }

    readAll(req, res) {
        this._teamsService.readChunk(req.params)
            .then((data) => res.json(data))
            .catch((err) => res.send({error: err.message}));
    }

    read(req, res) {
        this._teamsService.read(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.send({error: err.message}));
    }

    create(req, res) {
        this._teamsService.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.send({error: err.message}));
    }

    update(req, res) {
        this._teamsService.update(req)
            .then((data) => res.json(data))
            .catch((err) => res.send({error: err.message}));
    }

    del(req, res) {
        const id = req.params.id;
        this._teamsService.del(id)
            .then((data) => res.json(data))
            .catch((err) => res.send({error: err.message}));
    }

    _registerRoutes() {
        let routes = this._getRoutes();
        for (let route in routes) {
            if (!routes.hasOwnProperty(route)) {
                continue;
            }

            let handlers = routes[route];

            if (handlers === undefined) continue;

            for (let handler of handlers) {
                this.router[handler.method](route, handler.cb);
            }
        }
    }
}

module.exports =  TeamsController;