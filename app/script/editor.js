'use strict';

const $ = require('jquery');
const home_path = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
const webview = document.getElementById('preview');

const Datastore = require('nedb');
let db = new Datastore({
    filename: home_path + '/.moja-note/notes.db',
    autoload: true
});

// エディタ起動
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'markdown',
    indentUnit: 4,
    continuelist: true,
    allowAtxHeaderWithoutSpace: true,
    lineWrapping: true,
    keyMap: 'sublime',
    extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Ctrl-P': function () {
            togglePreview();
        }
    }
});

editor.focus();

let note_id;
if (sessionStorage.note !== 'undefined') {
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
        editor.setValue(text);
        webview.addEventListener('dom-ready', () => {
            webview.send('text-update', text);
            webview.send('title-update', title);
            webview.openDevTools();
        });
    });
} else {
    let doc = {'title':'タイトル未定義','text':'','tag':''};
    db.insert(doc, function(err, newDoc){
        note_id = newDoc['_id']
    });
}

// 編集時自動保存
editor.on('change' , function () {
    let text = editor.getValue();
    db.update({'_id': note_id},
        {$set:{'text': text}}
    );
    webview.send('text-update', text);
});

// title編集検知
$('#title').on('keyup', function () {
    let title = $('#title').val();
    db.update({'_id': note_id},
        {$set:{'title': title}}
    );
    webview.send('title-update', title);
});

// edit終了ボタン
$('#exit-edit').on('click', function () {
    window.location.href = '../index.html';
});

// プレビュー切り替え
function togglePreview() {
    $('#preview').toggleClass('hide');
    $('#editor-area').toggleClass('full-width');
    editor.replaceRange(' ', CodeMirror.Pos(editor.getCursor().line, editor.getCursor().ch));
    editor.replaceRange('', CodeMirror.Pos(editor.getCursor().line, editor.getCursor().ch - 1), CodeMirror.Pos(editor.getCursor().line, editor.getCursor().ch))
}
// プレビュー切り替えボタン
$('#toggle-preview').on('click', function () {
    togglePreview();
});