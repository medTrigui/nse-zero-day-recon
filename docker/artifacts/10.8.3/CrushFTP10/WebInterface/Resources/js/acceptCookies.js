var acceptCookies = {
    show: function(fixed){
        var fixedClass = fixed ? "accept-cookies-fixed" : "";
        var div = $("<div class='accept-cookies "+fixedClass+"'><span id='CookiePolicyNotificationText'>We use cookies on this site to facilitate your ability to login for technical reasons.</span> <a href='/WebInterface/cookie-policy.html' target='_blank' id='CookiePolicyLinkText'>Cookie Policy</a> <button class='accept' id='CookiePolicyAcceptButtonText'>Accept</button><button class='dismiss' id='CookiePolicyDismissButtonText'>Dismiss</button><span class='dismiss'>X</span></div>");
        $('body').append(div);
        div.find(".accept").click(function(){
            div.removeClass('show');
            localStorage["acceptCookies"] = true;
            if(div.hasClass("accept-cookies-fixed")){
                div.remove();
            }
            else{
                setTimeout(function(){
                    div.remove();
                }, 3000);
            }
        });
        div.find(".dismiss").click(function(){
            div.removeClass('show');
            setTimeout(function(){
                div.remove();
            }, 3000);
        });
        setTimeout(function(){
            div.addClass('show');
        });
    }
}

jQuery(document).ready(function($) {
    if(!localStorage["acceptCookies"] && !window.dontShowCookieNotification){
        acceptCookies.show();
    }
});