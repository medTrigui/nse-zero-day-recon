window._locals = $.extend(true, {}, window.localizations);
if(typeof videojs != "undefined")
    videojs.options.flash.swf = "/WebInterface/Resources/js/video-js/video-js.swf"

$(document).ready(function() {
    AudioJS.setup();
    try{
        $('#filesContainer').fileTree({
            root: '/',
            overrideFromHash: true,
            expandSpeed: 1000,
            collapseSpeed: 1000,
            multiFolder: true,
            customData: true
        }, function(link) {
            window.open(link);
        });
    }catch(ex){}
    $.fn.media.defaults.flvPlayer = "/WebInterface/jQuery/js/player_flv_maxi.swf";
    $.fn.media.defaults.mp3Player = "/WebInterface/jQuery/js/player_mp3_maxi.swf";
});