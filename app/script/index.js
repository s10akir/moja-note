'use strict';

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});

db.find('', function (err, docs) {
    docs.forEach(function (element) {
        console.log(element['title']);
        let dom = '<div class="note" id="'+ element['_id'] + '" onclick="preview(' + element['_id'] +');">' + element['title'] + '<div class="note-tag">' + element['tag'] + '</div></div>';
        document.getElementById('notes-search').insertAdjacentHTML('afterend', dom);
    });
});


const marked = require('marked');


function preview(id) {
    db.find(id, function (err, docs) {
        let dom = '<note-title>' + docs[0]['title'] + '</note-title>' + marked(docs[0]['text']);
        document.getElementById('note-view-body').innerHTML = dom;
    })
}
