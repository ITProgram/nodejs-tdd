'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('contacts', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
};