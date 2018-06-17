'use strict';

const $ = require('jquery');
const home_path = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
const webview = document.getElementById('note-view-body');

const Datastore = require('nedb');
let db = new Datastore({
    filename: home_path + '/.moja-note/notes.db',
    autoload: true
});

// 空ドキュメントの削除
db.remove({'text':'', 'title':'タイトル未定義'}, { multi: true });
searchNote();

// ドキュメント検索
function searchNote(text) {
    let pattern = RegExp(text);
    $('#notes').empty();
    db.find({'title':pattern}, function (err, docs) {
        docs.forEach(function (element) {
            console.log(element['title']);
            let dom = '<div class="note" id="' + element['_id'] + '" onclick="preview(\'' + element['_id'] + '\');">' + element['title'] + '<div class="note-tag">' + element['tag'] + '</div></div>';
            $('#notes').append(dom);
        });
    });
}

if (sessionStorage.note !== 'undefined') {
    preview(sessionStorage.note);
}

$('#new-note').on('click', function (){
    sessionStorage.note = 'undefined';
    window.location.href = 'view/editor.html';
});

$('a').on('click', function () {
    switch (this.id) {
        case 'edit-note':
            window.location.href = 'view/editor.html';
            break;
        case 'delete-note':
            if (window.confirm('削除してもよろしいですか？')) {
                db.remove({'_id':sessionStorage.note}, {});
                sessionStorage.note = 'null';
                console.log('delete!');
                location.reload();
            }
            break;
        default:
            window.alert('未実装機能です。悔い改めて。');
            break;
    }
});

function preview(id) {
    console.log(id);
    sessionStorage.note = id; // 選択中ノート情報の設定
    db.find({_id: id}, function (err, docs) {
        console.log(docs);
        webview.openDevTools();
        webview.send('title-update', docs[0]['title']);
        webview.send('text-update', docs[0]['text']);
    })
}

$('#notes-search').on('keyup', function () {
    searchNote($('#notes-search').val());
});