"use strict";
/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    balance: { type: Number, default: 0 }    
});

userSchema.set('timestamps', true);

module.exports = MONGOOSE.model('user', userSchema);



