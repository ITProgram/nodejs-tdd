'use strict';
const config = require('../config.json');
const Team = require('../models/team');
const Worker = require('../models/worker');
const Contacts = require('../models/contacts');

class DatabaseContext {

    constructor(Sequelize) {
        this.sequelize = DatabaseContext._setDbConfig(Sequelize);
        this.team = Team(Sequelize, this.sequelize);
        this.worker = Worker(Sequelize, this.sequelize);
        this.contacts = Contacts(Sequelize, this.sequelize);
        this._createLinks();
    }


    static _setDbConfig(Sequelize) {
        return process.env.NODE_ENV === 'PROD' ?
            new Sequelize(process.env.DATABASE_URL) :
            new Sequelize(
                config.db.name,
                config.db.user,
                config.db.password,
                DatabaseContext._getSequelizeOptions(config));
    }


    static _getSequelizeOptions(config) {
        return {
            host: config.db.host,
            dialect: config.db.dialect,
            logging: false,
            define: {
                timestamps: true,
                paranoid: true,
                defaultScope: {
                    where: {
                        deletedAt: {$eq: null}
                    }
                }
            }
        };
    }

    _createLinks() {
        this.team.hasMany(this.worker);
        this.worker.belongsTo(this.team);
        this.worker.belongsToMany(this.worker, {as: 'user', foreignKey: 'usertId', through: this.contacts});
        this.worker.belongsToMany(this.worker, {as: 'contact', foreignKey: 'contactId', through: this.contacts});
    }
}
module.exports = DatabaseContext;