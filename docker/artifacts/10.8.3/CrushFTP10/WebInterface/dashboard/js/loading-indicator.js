//Methods for showing loading indicator on the page
crushDashboard.loader = {
    init: function() {
        if ($("#loadingIndicator").length == 0)
            $("body").append("<div id='loadingIndicator'></div>");
        $("#loadingIndicator").dialog({
            autoOpen: false,
            dialogClass: "loadingIndicatorWindow",
            closeOnEscape: false,
            draggable: false,
            width: 220,
            minHeight: 50,
            modal: true,
            buttons: {},
            resizable: false,
            open: function(evt, ui) {
                $('body').css('overflow', 'hidden');
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            },
            close: function() {
                $('body').css('overflow', 'auto');
            }
        });
    },
    show: function(msg) {
        msg = msg || "Please wait...";
        $("#loadingIndicator").html('<i class="fa fa-spinner fa-spin margin-hor-20"></i> ' + msg);
        $("#loadingIndicator").dialog('open');
    },
    hide: function() {
        $("#loadingIndicator").dialog('close');
    }
};