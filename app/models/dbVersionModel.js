"use strict";
/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
/**************************************************
 ************* db version Model or collection ***********
 **************************************************/
const dbVersionSchema = new Schema({
    version: { type: Number, default: 0 }
});

dbVersionSchema.set('timestamps', true);

module.exports = MONGOOSE.model('dbversion', dbVersionSchema);



