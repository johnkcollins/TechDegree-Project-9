const Sequelize = require ('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        fname: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Please provide a value for "first name"'
            },
            notEmpty: {
              msg: 'Please provide a value for "first name"'
            }
          }
        },
        lname: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Please provide a value for "last name"'
            },
            notEmpty: {
              msg: 'Please provide a value for "last name"'
            }
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Please provide a value for "password"'
            },
            notEmpty: {
              msg: 'Please provide a value for "password"'
            },
            min:{
              args: 8,
              msg: "Please provide a password between 8 and 20 characters long"
            },
            max: {
              args: 20,
              msg: "Please provide a password between 8 and 20 characters long"
            }
          }
        }
      },

      {sequelize});
  return User;
};