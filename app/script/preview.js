'use strict';

const {ipcRenderer} = require('electron');
let marked = require('marked');


ipcRenderer.on('text-update', (event, text) => {
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