/*Electron does some crazy thing and jQuery library goes completely into window.module exports*/
if(window.module){
    window.$ = window.jQuery = window.module.exports;
}