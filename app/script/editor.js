'use strict';

const $ = require('jquery');

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});

// エディタ起動
const CodeMirror = require('codemirror');
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: "markdown",
    indentUnit: 4,
    continuelist: true,
    allowAtxHeaderWithoutSpace: true,
    lineWrapping: true,
    extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
    }
});

let note_id;
if (sessionStorage.note !== 'null') {
    note_id = sessionStorage.note;
}
console.log('editing:' + note_id);

// 初期読み込み
if (note_id) {
    db.find({'_id': note_id}, function (err, docs) {
        console.log(docs);
        editor.setValue(docs[0]['text']);
        $('#title').val(docs[0]['title']);
    });
} else {
    let doc = {"title":"","text":"","tag":""};
    db.insert(doc, function(err, newDoc){
        note_id = newDoc['_id'];
    });
}

// 編集時自動保存
editor.on("change" , function () {
    db.update({'_id': note_id},
        {$set:{'text': editor.getValue()}},
    );
});

// title編集検知
$('#title').on('keyup', function () {
    db.update({'_id': note_id},
        {$set:{'title': $('#title').val()}},
    );
});