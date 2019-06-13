'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    like: DataTypes.BOOLEAN
  }, {});
  message.associate = function(models) {
    models.message.belongsTo(models.user, {
      foreignKey: {
        allownull: false
      }
    })
  };
  return message;
};