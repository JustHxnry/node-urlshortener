const fs = require('fs'),
      path = require('path'),
      jsoned = require('@justhxnry/jsoned'),
      randoms = require('@justhxnry/randoms'),
      config = require('config');

var dbPath = path.join(__dirname, '..', 'databases', 'urls.json');
let db = JSON.parse(fs.readFileSync(dbPath));

//! Functions to export

function addUrl(longUrl) {

    if (urlExists(longUrl).id) {
        console.log(urlExists(longUrl));
        return urlExists(longUrl);
    }

    let idLength = randoms.randomNum(3, 10);

    let id = randoms.randomString(idLength);

    var model = {
        longUrl,
        id,
        fullUrl: config.get('baseUrl') + '/' + id,
        dateCreated: new Date()
    };

    db.push(model);

    fs.writeFileSync(dbPath, JSON.stringify(db));

    return model;

};

function getUrl(data) {

    let identifier = {};

    if (data.longUrl) identifier.id = data.longUrl; identifier.method = "longUrl";
    if (data.id) identifier.id = data.id; identifier.method = "id";
    if (!data.longUrl && !data.id) return;

    let result = jsoned.findOne(db, identifier.id, identifier.method);

    if (!result.fullUrl) result = null;

    return result;

};

function getAll() {

    return db;

};

function deleteUrl(id) {

    db = db.filter(x => x.id != id);

    console.log(db);

    fs.writeFileSync(dbPath, JSON.stringify(db));

    return db;

};

//! Internal functions not to be exported

function urlExists(longUrl) {

    let result = jsoned.findOne(db, longUrl, 'longUrl');

    return result;

};

//! Export functions
module.exports = {
    addUrl,
    getUrl,
    getAll,
    deleteUrl
};