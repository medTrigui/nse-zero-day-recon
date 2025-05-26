/*
This jQuery plugin will be used to bind test PGP events to particular button
options will be passed to fetch correct values for required parameters
*/
(function ($) {
    $.testPGPButton = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("testPGPButton", base);

        base.init = function(){
            base.options = $.extend({},$.testPGPButton.defaultOptions, options);
            $(el).off().on("click", function () {
                var elm = $(this);
                if (elm.hasClass("ui-state-disabled"))
                    return false;
                var params = elm.attr("rel").split(",");
                var parent = elm.closest(elm.attr("_parent") || base.options.parent);
                if (parent.find(".hasPendingCall").length > 0) {
                    window.pendingEncryptionCall = function () {
                        elm.trigger("click");
                    }
                    return false;
                }
                var privateKey = crushFTP.methods.htmlEncode(parent.find("#" + params[0]).data("realURL"));
                var privateKeyPass = (parent.find("#" + params[1]).val());
                var publicKey = crushFTP.methods.htmlEncode(parent.find("#" + params[2]).data("realURL"));
                if (!privateKey && !publicKey) {
                    crushFTP.UI.growl("Input required", "Please enter valid key information to test", true, 3000);
                    return false;
                }
                if (!privateKey || !publicKey) {
                    crushFTP.UI.growl("Input required", "You can test PGP only when you have a private key and public key. You don’t need to test when just doing encryption.", true, 3000);
                    return false;
                }
                var obj = {
                    command: "testPGP",
                    privateKey: encodeURIComponent(privateKey),
                    privateKeyPass: privateKeyPass,
                    publicKey: encodeURIComponent(publicKey)
                };

                elm.addClass("ui-state-disabled");
                elm.block({
                    message:  'Wait..',
                    css: {
                        border: 'none',
                        padding: '0px 10px',
                        backgroundColor: '#000',
                        opacity: .5,
                        color: '#fff',
                        'text-align':'left'
                    }
                });
                crushFTP.data.serverRequest(obj, function (data) {
                    elm.removeClass("ui-state-disabled");
                    elm.unblock();
                    var message = $(data).find("response").text();
                    if (message) {
                        crushFTP.UI.growl("Test Key Result", (message), false, false);
                    }
                });

                return false;
            });
        };
        base.init();
    };

    $.testPGPButton.defaultOptions = {
        parent: "div"
    };

    $.fn.testPGPButton = function(options){
        return this.each(function(){
            (new $.testPGPButton(this, options));
        });
    };

})(jQuery);