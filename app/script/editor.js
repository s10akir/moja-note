'use strict';

const $ = require('jquery');
const marked = require('marked');

const Datastore = require('nedb');
let db = new Datastore({
    filename: 'app/db/notes.db',
    autoload: true
});

// エディタ起動
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

editor.focus();

let note_id;
if (sessionStorage.note !== 'null') {
    note_id = sessionStorage.note;
}
console.log('editing:' + note_id);

// 初期読み込み
if (note_id) {
    db.find({'_id': note_id}, function (err, docs) {
        console.log(docs);
        let title = docs[0]['title'];
        let text = docs[0]['text'];
        $('#title').val(title);
        $('#preview-title').text(title);
        editor.setValue(text);
        $('#preview-text').html(marked(text));
    });
} else {
    let doc = {"title":"タイトル未定義","text":"","tag":""};
    db.insert(doc, function(err, newDoc){
        note_id = newDoc['_id']
    });
}

// 編集時自動保存
editor.on("change" , function () {
    let text = editor.getValue();
    db.update({'_id': note_id},
        {$set:{'text': text}}
    );
    $('#preview-text').html(marked(text));
});

// title編集検知
$('#title').on('keyup', function () {
    let title = $('#title').val();
    db.update({'_id': note_id},
        {$set:{'title': title}}
    );
    $('#preview-title').text(title);
});

// edit終了ボタン
$("#exit-edit").on('click', function () {
    window.location.href = "../index.html";
});