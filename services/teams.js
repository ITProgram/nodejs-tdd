'use strict';

const BaseService = require('./base');

class TeamsService extends BaseService{

    constructor(teamsRepository){
        super(teamsRepository);
    }

}

module.exports = TeamsService;