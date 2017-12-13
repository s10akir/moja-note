'use strict';

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});