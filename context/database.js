'use strict';
const config = require('../config.json');
const Team = require('../models/team');
const Worker = require('../models/worker');
const Contacts = require('../models/contacts');

const optionsProduction = {
    host: config.db.host,
    dialect: config.db.dialect,
    dialectOptions: {ssl: true}
};
const optionsLocal = {
    host: config.dbl.host,
    dialect: 'mysql',
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

class DatabaseContext {

    constructor(Sequelize) {
        this.sequelize = new Sequelize(
            config.db.name,
            config.db.user,
            config.db.password,
            optionsProduction
        ); //DatabaseContext._setDbConfig(Sequelize);
        //this.sequelize = DatabaseContext._setDbConfig(Sequelize);
        this.team = Team(Sequelize, this.sequelize);
        this.worker = Worker(Sequelize, this.sequelize);
        this.contacts = Contacts(Sequelize, this.sequelize);
        this._createLinks();
    }


    static _setDbConfig(Sequelize) {
        return //(process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'production' )?
        //new Sequelize(process.env.DATABASE_URL) :
        new Sequelize(
            config.db.name,
            config.db.user,
            config.db.password,
            optionsProduction
        );
        // :
        //     new Sequelize(
        //         config.dbl.name,
        //         config.dbl.user,
        //         config.dbl.password,
        //         optionsLocal
        //         //DatabaseContext._getSequelizeOptions(config)
        //     );
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