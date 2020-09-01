'use strict';
/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    userModel: require(`../models/userModel`),
    dbVersionModel: require(`./dbVersionModel`)
};