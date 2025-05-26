$(function () {
    var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');
    var dialog = $("<div><span class='loading'>Loading...</span></div>").append(iframe).appendTo("body").dialog({
        title : "Telnet Client",
        autoOpen: false,
        minHeight: '660',
        dialogClass: "telnet-frame",
        width: 850,
        modal: false,
        resizable: false,
        minWidth : 620,
        closeOnEscape: false,
        close: function () {
            iframe.attr("src", "");
        },
        open : function(evt, ui){
            $(evt.target).css("overflow", "hidden");
        },
        resizeStart: function (event, ui) {
            iframe.css("visibility", "hidden");
        },
        resizeStop: function (event, ui) {
            iframe.css("visibility", "visible");
            var size = ui.size;
            iframe.attr({
                height: size.height - 80
            });
        },
        buttons: {
            "Clear Console" : function(){
                iframe.contents().find('#telnet_area').val("").empty();
            },
            "Close Dialog": function() {
                $(this).dialog( "close" );
            }
        }
    });
    $("#telnetButton").on("click", function (e) {
        if(!e.ctrlKey && !e.metaKey)
        {
            e.preventDefault();
            loadPanel();
        }
    });
    function loadPanel(){
        dialog.find(".loading").show();
        var src = "/WebInterface/admin/telnet.html";
        iframe.attr({
            width : "100%",
            height: 570,
            src: src
        }).on("load", function(){
            dialog.find(".loading").hide();
        });
        dialog.dialog("open");
    }
    window.crushTelnet = {
        show : loadPanel
    };
});