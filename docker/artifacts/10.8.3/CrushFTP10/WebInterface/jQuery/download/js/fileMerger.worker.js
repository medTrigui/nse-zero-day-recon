"use strict";

self.importScripts("StreamSaver/StreamSaver.js", "StreamSaver/web-streams-polyfill/polyfill.min.js");

self.addEventListener('message', e => {
    console.log(e);
    writeFile(e.data);
    // .then(data => {
    //     console.log(data);
    //     self.postMessage(data);
    // }).catch(err=>{console.log(err)})
});

function writeFile(info){
    console.log(info, 'received');
    const fileStream = streamSaver.createWriteStream("dummy.text");
    const writer = fileStream.getWriter();
    writer.write("test 123");
    writer.close();
};