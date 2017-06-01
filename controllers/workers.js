'use strict';

const express = require('express');
const _ = require('lodash');
class WorkersController {
    constructor(workersService) {
        this._service = workersService;
        this.router = express.Router();
        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.del = this.del.bind(this);
        this.setContact = this.setContact.bind(this);
        this.getTimeIntersection = this.getTimeIntersection.bind(this);
        this._registerRoutes();
    }

    _getRoutes() {
        return {
            '/': [{method: 'get', cb: this.readAll}, {method: 'post', cb: this.create}],
            '/:id': [{method: 'get', cb: this.read},
                {method: 'delete', cb: this.del},
                {method: 'put', cb: this.update}],
            '/:id/contacts': [{method: 'post', cb: this.setContact}],
            '/:yourId/time-intersection/:teammateId': [{method: 'get', cb: this.getTimeIntersection}]
        }
    }

    readAll(req, res) {
        this._service.readChunk(req.params)
            .then(data => res.json(data))
            .catch(err => res.send({error: err.message}));
    }

    setContact(req, res) {
        this._service.setContact(req.params.id, req.body.id)
            .then(data => {
                return res.json(data)
            })
            .catch(err => res.send({error: err.message}));
    }

    getTimeIntersection(req, res) {
        this._service.getTimeIntersection(req.params.yourId, req.params.teammateId)
            .then(data => res.json(data))
            .catch(err => res.send({error: err.message}));
    }

    read(req, res) {
        this._service.read(req.params.id)
            .spread((worker, contacts) => res.json(_.merge({worker: worker.dataValues}, {contacts})))
            .catch(err => res.send({error: err.message}));
    }

    create(req, res) {
        this._service.create(req.body)
            .then(data => res.json(_.head(data)))
            .catch(err => res.send({error: err.message}));
    }

    update(req, res) {
        this._service.update(req.params.id, req.body)
            .then(data => res.json(data))
            .catch(err => res.send({error: err.message}));
    }

    del(req, res) {
        const id = req.params.id;
        this._service.del(id)
            .then(data => res.json(data))
            .catch(err => res.send({error: err.message}));
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
;

module.exports = WorkersController;