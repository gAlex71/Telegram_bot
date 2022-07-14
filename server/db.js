const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'name',
    'author',
    'password',
    {
        host: '7823842398',
        port: '7482',
        dialect: 'postgres'
    }
)