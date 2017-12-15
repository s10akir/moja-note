'use strict';

sessionStorage.note = 'null'; // 選択中ノート情報の初期化

const $ = require('jquery');

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});

db.find('', function (err, docs) {
    docs.forEach(function (element) {
        console.log(element['title']);
        let dom = '<div class="note" id="'+ element['_id'] + '" onclick="preview(\'' + element['_id'] +'\');">' + element['title'] + '<div class="note-tag">' + element['tag'] + '</div></div>';
        document.getElementById('notes-search').insertAdjacentHTML('afterend', dom);
    });
});


const marked = require('marked');

function preview(id) {
    console.log(id);
    sessionStorage.note = id; // 選択中ノート情報の設定
    db.find({_id: id}, function (err, docs) {
        console.log(docs);
        let dom = '<note-title>' + docs[0]['title'] + '</note-title>' + marked(docs[0]['text']);
        document.getElementById('note-view-body').innerHTML = dom;
    })
}