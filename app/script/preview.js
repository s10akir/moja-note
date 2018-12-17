'use strict';

const {ipcRenderer} = require('electron');
let marked = require('marked');


ipcRenderer.on('text-update', (event, text) => {
    // +++をページ区切りとして解釈する
    text = '+++\n' + text;  // 頭のdivが必要
    text = text.replace(/(^|\n)\+\+\+(\n|$)/g, '</div><div class="page">');  // TODO: ローテクすぎるのでなんとかしたい

    let dom = marked(text);
    let preview = document.getElementById('preview-text');

    console.log(dom);
    preview.innerHTML = dom;
});

ipcRenderer.on('title-update', (event, title) => {
    let preview = document.getElementById('preview-title');

    console.log(title);
    preview.innerHTML = title;
});