'use strict';

const BaseService = require('./base');
const Promise = require('bluebird');

class WorkersService extends BaseService {

    constructor(workersRepository, contacts) {
        super(workersRepository);
        this._repository = workersRepository;
        this._contacts = contacts;
    }

    read(id) {
        id = parseInt(id);

        if (isNaN(id)) {
            return Promise.reject('invalid id');
        }
        return this._repository.findById(id)
            .then(worker => Promise.all([worker, worker.getContact()]));
    }

    setContact(userId, contactId) {
        if(!userId || !contactId){
            throw Error('userId or contactId not found');
        }
        return Promise.all([this._repository.findById(userId), this._repository.findById(contactId)])
            .spread((user, contact) => {
                return user.addContact(contact);
            });
    }

    getTimeIntersection(yourId, teammateId){
        return Promise.all([this._repository.findById(yourId), this._repository.findById(teammateId)])
            .spread((you, teammate)=>{
                return  {timeIntersection: this._getIntersection(you.worktime, teammate.worktime)};
            })
    }

    _getIntersection(first, second){ //12.00 - 20.00
        try{
            first = first.replace(/ /g,'');
            second = second.replace(/ /g,'');
            let start = first.split('-')[0] > second.split('-')[0] ? first.split('-')[0] : second.split('-')[0];
            let end = first.split('-')[1] > second.split('-')[1] ? second.split('-')[1] : first.split('-')[1];
            return  start < end ? `${start}-${end}` : 'none';
        }
        catch(ex) {
            throw Error('invalid date format. you should use HH-MM - HH.MM');
        }
    }


}

module.exports = WorkersService;