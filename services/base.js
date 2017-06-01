'use strict';

class BaseService {
    constructor(repository) {
        this._repository = repository;
        this._defaults = {
            readChunk: {
                limit: 10,
                page: 1,
                order: 'asc',
                orderField: 'id'
            }
        };
    }

    readChunk(options) {
        options = Object.assign({}, this._defaults.readChunk, options);

        let limit = options.limit;
        let offset = (options.page - 1) * options.limit;

        return this._repository
            .findAll({
                limit: limit,
                offset: offset,
                order: [[options.orderField, options.order.toUpperCase()]],
                raw: true
            })
    }

    read(id) {
        id = parseInt(id);

        if (isNaN(id)) {
            return Promise.reject('invalid id');
        }

        return this._repository.findById(id, {raw: true});
    }

    create(data) {
        return this._repository.create(data);
    }

    update(id, data) {
        return this._repository.update(data, {where: {id: id}, limit: 1});
    }

    del(id) {
        id = parseInt(id);

        if (isNaN(id)) {
            return Promise.reject('invalid id');
        }
        return this._repository.destroy({where: {id: id}})
            .then(() => ({success: true}));
    }

    test(){
        console.log('test is called');
    }
}

module.exports = BaseService;