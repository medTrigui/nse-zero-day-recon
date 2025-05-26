var userAudit = (function(){
    var actions = [];
    var maxActins = 10;
    var userinfoPanel;
    function init(){
        var breadCrumbsPanel = $(".breadCrumbsPanel");
        var userName = $(document).data("username");
        var infoButton = $('<span class="userInfo"><span class="usericon"></span> <span class="userName">'+userName+'</span> <span class="infoicon"></span></span>');
        breadCrumbsPanel.prepend(infoButton);
        breadCrumbsPanel.append('<div id="userinfoPanel"><h2>Information</h2><div class="info"><div class="label">Login Name:</div><div class="value" rel="userName"></div></div><div class="info"><div class="label">Login Time:</div><div class="value" rel="loginTime"></div></div><div class="info"><div class="label">Session Timeout:</div><div class="value" rel="sessionTimeout"></div></div><div class="info"><div class="label">Browser Name:</div><div class="value" rel="browserName"></div></div><div class="info"><div class="label">Browser Version:</div><div class="value" rel="browserVersion"></div></div><div class="info"><div class="label">Browser Info:</div><div class="value" rel="browserInfo"></div></div><div class="info"><div class="label">URL:</div><div class="value" rel="URL"></div></div><div class="info"><div class="label">HostName:</div><div class="value" rel="hostname"></div></div><div class="info"><div class="label">Version:</div><div class="value" rel="app_version"></div></div><div class="info dmz"><div class="label">Internal HostName:</div><div class="value" rel="internal_hostname"></div></div><div class="info dmz"><div class="label">Internal Version:</div><div class="value" rel="internal_app_version"></div></div><div class="info"><div class="label">Recent Actions:</div><div class="clear" rel="recentActions"></div></div></div>');
        userinfoPanel = $("#userinfoPanel");
        userinfoPanel.draggable({
            handle: "h2"
        });
        userinfoPanel.hide();
        infoButton.click(function(){
            if(userinfoPanel.is(":visible"))
                userinfoPanel.hide();
            else
                showInfo(userinfoPanel);
        })
    }
    function formatDate(dt){
        var format = window.customDateFormat || "mm/dd/yyyy";
        format = format.replace(/:mm/g, ":nn");
        var timeFormat = window.customTimeFormat || "hh:nn:ss TT";
        var formatted = dt.toString();
        if(dt){
            if(format.toLowerCase().indexOf("hh")<0)
                formatted = dt.format(format.replace("MMM","M").replace("MM","mm") + " " + timeFormat);
            else
                formatted = dt.format(format.replace("MMM","M").replace("MM","mm"));
        }
        return formatted;
    }

    function updateData(){
        if(!userinfoPanel.is(":visible"))
            return;
        var loginTime = localStorage.getItem("loginTime") || "";
        if(loginTime)
        {
            var dt = new Date(parseInt(loginTime));
            loginTime = formatDate(dt);
        }
        var _actions = [];
        for (var i = actions.length-1; i >= 0; i--) {
            var curAct = actions[i];
            _actions.push('<li>'+curAct+'</li>');
        }
        var browserInfo = get_browser_info();
        var obj = {
            userName: $(document).data("username"),
            loginTime: loginTime,
            sessionTimeout: window.sessionRemaining,
            browserName: browserInfo.name,
            browserVersion: browserInfo.version,
            browserInfo: window.navigator.appVersion,
            hostname: window.userInfo.hostname,
            internal_hostname: window.userInfo.internal_hostname,
            internal_app_version: window.userInfo.internal_app_version,
            app_version: window.userInfo.app_version,
            URL: location.href,
            recentActions: "<ul>"+_actions.join("")+"</ul>"
        };
        for(var item in obj){
            userinfoPanel.find("[rel='"+item+"']").html(obj[item]);
        }
        if(obj.internal_hostname || obj.internal_app_version){
            userinfoPanel.find(".dmz").show();
        }
        else{
            userinfoPanel.find(".dmz").hide();
        }
    }

    function showInfo(){
        userinfoPanel.show();
        updateData();
        var updateInterval = setInterval(updateData, 1000);
        function bindEscape(){
            $(document).unbind("click.dismisspopup").one("click.dismisspopup", function(evt){
                if($(evt.target).is("#userinfoPanel") || $(evt.target).closest("#userinfoPanel").length>0)
                {
                    bindEscape();
                }
                else{
                    userinfoPanel.hide();
                    $(document).unbind("click.dismisspopup");
                    $(document).unbind("keydown.dismisspopup");
                    clearInterval(updateInterval);
                }
            });
            $(document).unbind("keydown.dismisspopup").one("keydown.dismisspopup", function(evt){
                if (evt.keyCode == 27){
                    userinfoPanel.hide();
                    $(document).unbind("click.dismisspopup");
                    $(document).unbind("keydown.dismisspopup");
                    clearInterval(updateInterval);
                }
                else
                {
                    bindEscape();
                }
            });
        }
        setTimeout(bindEscape, 10);
    }
    function logAction(action){
        actions.push(formatDate(new Date()) + " | " + action);
        if(actions.length>maxActins){
            actions = actions.slice(actions.length-maxActins);
        }
        updateData();
    }
    function get_browser_info(){
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE ',version:(tem[1]||'')};
            }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
          name: M[0],
          version: M[1]
        };
     }
    return {
        init: init,
        log: logAction,
        v: 1
    }
})();