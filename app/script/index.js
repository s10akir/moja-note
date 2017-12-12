'use strict';

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});

db.find('', function (err, docs) {
    docs.forEach(function (element) {
        console.log(element['title']);
        let dom = '<div class="note" id="'+ element['_id'] + '" onclick="preview(' + element['_id'] +');"><p>' + element['title'] + '</p></div>';
        document.getElementById('notes-search').insertAdjacentHTML('afterend', dom) ;
    });
});


const marked = require('marked');


function preview(id) {
    db.find(id, function (err, docs) {
        console.log(docs);
        let dom = '<h1>' + docs[0]['title'] + '</h1>' + marked(docs[0]['text']);
        document.getElementById('note-view-body').innerHTML = dom;
    })
}
