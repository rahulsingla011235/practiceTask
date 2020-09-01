let dbUtills = {};
let { dbVersionModel, userModel } = require(`../models`);

//Db migrations.
dbUtills.db_migrations = async () => {
    let dbVersionInfo = await dbVersionModel.findOne({}, { version: 1 }, { lean: true });
    let currentVersion = dbVersionInfo ? dbVersionInfo.version : 0;
    let newVersion = currentVersion;
    //Db migration to add dummy user and balance.
    if (newVersion < 1) {
        await userModel({ balance: 100000 }).save();
        newVersion = 1;
    }
    //update version.
    if (currentVersion !== newVersion)
        await dbVersionModel.findOneAndUpdate({}, { version: newVersion }, { upsert: true });
    return;
};

module.exports = dbUtills;
