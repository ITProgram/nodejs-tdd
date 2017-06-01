'use strict';

module.exports = (Sequelize, sequelize) => {
    return sequelize.define('team', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.CHAR(16),
            notNull:true
        },
        description:{
            type:Sequelize.CHAR(50),
            notNull:true
        }
    });
};