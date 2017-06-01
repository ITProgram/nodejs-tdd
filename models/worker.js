'use strict';

module.exports = (Sequelize, sequelize) => {
    return sequelize.define('worker', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:Sequelize.CHAR(16),
            notNull:true
        },
        worktime:{
            type:Sequelize.CHAR(50),
            notNull:true
        }
    });
};