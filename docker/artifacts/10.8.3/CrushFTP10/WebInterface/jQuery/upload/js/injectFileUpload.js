$(function() {
    var dropDiv;
    $.support.eventListener = !!window.addEventListener;
    if ($.support.eventListener) {
        window.addEventListener("dragover", function(e) {
            e = e || event;
            e.preventDefault();
        }, false);

        window.addEventListener("drop", function(e) {
            e = e || event;
            e.preventDefault();
        }, false);
    }
    var test = function(e) {
        $('body #fileUploadIframe').show();
    }
    $('body').append('<div id="fileUploadModule"></div><iframe id="fileUploadIframe" src="./index.html"></iframe>').find('#fileUploadIframe').on('load', function() {
        if ($.support.eventListener) {
            if ($(this).contents().find('#dropzone').length) {
                $(this).contents().find('#dropzone').appendTo('#fileUploadModule').end().end().end().hide();
                dropDiv = document.getElementById('dropzone');
                dropDiv.addEventListener('drop', test);
            }
        }
    }).end().prepend('<a href="#showForm"></a>').find('a[href="#showForm"]').text('Show form');

    $('body').on('click', 'a[href="#showForm"]', function(e) {
        e.preventDefault();
        $('iframe#fileUploadIframe').toggle();
    });
});
