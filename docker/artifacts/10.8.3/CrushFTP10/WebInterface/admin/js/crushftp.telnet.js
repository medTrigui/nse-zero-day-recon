var crushTelnet = {
    telnetTimer : false,
    telnetReading : false,
    ajaxCallURLBase : "/WebInterface/function/",
    methods : {
        init : function(){
            var mainServerInstance = localStorage.getItem("mainServerInstance");
            if(mainServerInstance!=null && mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
            {
                crushFTP.ajaxCallURL = window.ajaxCallURL = crushTelnet.ajaxCallURLBase + mainServerInstance + "/";
            }
            /*Telnet Client*/
            $("#telnet_host").focus();
            $('#telnet_area').empty();
            $('#telnet_cmd').val("");
            crushTelnet.methods.telnetReset();
            $("#telnet_host, #telnet_port").keyup(function(ev) {
                if (ev.which === 13) {
                    $('#telnet_connect').trigger('click');
                }
            });
            $(window).unload(function(){
                if( $("#telnetDialog").data("connected") == "true"){
                    var obj = {
                        command: "telnetSocket",
                        sub_command: "close",
                        id: $("#telnetDialog").data("conid"),
                        random: Math.random(),
                        c2f: crushFTP.getCrushAuth()
                    };
                    $.ajax({
                        type: "POST",
                        url: crushFTP.ajaxCallURL,
                        data: obj,
                        async: true,
                        success: function (data) {
                            $("#telnetDialog").data("conid", "");
                            $("#telnetDialog").data("connected", "false");
                            $('#telnet_connect').text("Connect");
                            $('#telnet_host, #telnet_port').removeAttr("disabled");
                        }
                    });
                }
            });
            $("#telnet_cmd").keyup(function(ev) {
                if (ev.which === 13) {
                    var command = $(this).val();
                    var timer;
                    if( $("#telnetDialog").data("connected") == "false"){
                        crushFTP.UI.growl("Telnet Client", "Please connect before send commands.", 2000);
                    } else {
                        $('#telnet_cmd').val("");
                        $("#telnet_cmd").focus();
                        crushTelnet.methods.telnetAddMSG("\n"+command);
                        var obj = {
                            command: "telnetSocket",
                            sub_command: "write",
                            id: $("#telnetDialog").data("conid"),
                            data: command,
                            random: Math.random(),
                            c2f: crushFTP.getCrushAuth()
                        };
                        $.ajax({
                            type: "POST",
                            url: crushFTP.ajaxCallURL,
                            data: obj,
                            async: true,
                            success: function (data) {
                                var response = $(data);
                                var error = jQuery.trim(response.find("error").text());
                                if(error != ""){
                                    crushTelnet.methods.telnetAddMSG("\n"+error);
                                    crushTelnet.methods.telnetDisconnect();
                                    crushTelnet.methods.telnetReset();
                                }
                            }
                        });
                    }
                }
            });
            $('#telnet_connect').unbind().click(function(){
                if( $("#telnetDialog").data("connected") == "true"){
                    crushTelnet.methods.telnetDisconnect();
                } else {
                    crushTelnet.methods.telnetConnect();
                }
            });
        },
        telnetListener : function(activate){
            if(activate){
                if(crushTelnet.telnetTimer)
                    clearInterval(crushTelnet.telnetTimer);
                crushTelnet.telnetTimer = setInterval(function(){
                    var obj = {
                        command: "telnetSocket",
                        sub_command: "read",
                        id: $("#telnetDialog").data("conid"),
                        random: Math.random(),
                        c2f: crushFTP.getCrushAuth()
                    };
                    if(crushTelnet.telnetReading == false){
                        $.ajax({
                            type: "POST",
                            url: crushFTP.ajaxCallURL,
                            data: obj,
                            async: true,
                            beforeSend: function(){
                                crushTelnet.telnetReading = true;
                            },
                            success: function (data) {
                                var response = $(data);
                                var error = jQuery.trim(response.find("error").text());
                                if(error != ""){
                                    crushTelnet.methods.telnetAddMSG("\n"+error);
                                    crushTelnet.methods.telnetDisconnect();
                                    crushTelnet.methods.telnetReset();
                                } else {
                                    var finalResponse = decodeURIComponent(jQuery.trim(response.find("data").text()));
                                    if(finalResponse != ""){
                                        crushTelnet.methods.telnetAddMSG("\n"+finalResponse.replace(/[\s\r\n]+$/, ''));
                                        $("#telnet_area").animate({
                                            scrollTop:$("#telnet_area")[0].scrollHeight - $("#telnet_area").height()
                                        },10);
                                    }
                                }
                                crushTelnet.telnetReading = false;
                            }
                        });
                    } else {
                        //console.log('skipping');
                    }
                }, 1000);
            } else {
                if(crushTelnet.telnetTimer)
                    clearInterval(crushTelnet.telnetTimer);
            }
        },
        telnetDisconnect : function(){
            var obj = {
                command: "telnetSocket",
                sub_command: "close",
                id: $("#telnetDialog").data("conid"),
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function (data) {
                    var response = $(data);
                    crushTelnet.methods.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("data").text())));
                    crushTelnet.methods.telnetReset();
                }
            });
        },
        telnetConnect : function(){
            if( jQuery.trim($('#telnet_host').val()) == "" || jQuery.trim($('#telnet_port').val()) == "" ) {
                crushFTP.UI.growl("Telnet Client", "Host and port cannot be empty.", 2000);
            } else {
                $('#telnet_area').empty();
                crushTelnet.methods.telnetAddMSG("Connecting to: "+$('#telnet_host').val()+" on port: "+$('#telnet_port').val()+"...");
                var obj = {
                    command: "telnetSocket",
                    sub_command: "connect",
                    host: $('#telnet_host').val(),
                    port: $('#telnet_port').val(),
                    random: Math.random(),
                    c2f: crushFTP.getCrushAuth()
                };
                $.ajax({
                    type: "POST",
                    url: crushFTP.ajaxCallURL,
                    data: obj,
                    async: true,
                    success: function (data) {
                        var response = $(data);
                        var idConnection = jQuery.trim(response.find("id").text());
                        if(idConnection != "") {
                            $("#telnetDialog").data("conid", idConnection);
                            $('#telnet_connect').text("Disconnect");
                            //$('#telnet_host, #telnet_port').attr("disabled", "disabled");
                            $("#telnetDialog").data("connected", "true");
                            crushTelnet.methods.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("data").text())));
                            crushTelnet.methods.telnetListener(true);
                        } else {
                            crushTelnet.methods.telnetReset();
                            crushTelnet.methods.telnetAddMSG("\n"+decodeURIComponent(jQuery.trim(response.find("error").text())));
                        }
                        $("#telnet_cmd").focus();
                    }
                });
            }
        },
        telnetReset : function(){
            $("#telnetDialog").data("conid", "");
            $("#telnetDialog").data("connected", "false");
            $('#telnet_connect').text("Connect");
            $('#telnet_host, #telnet_port').removeAttr("disabled");
            crushTelnet.methods.telnetListener(false);
        },
        telnetAddMSG : function(msg){
            $('#telnet_area').append(crushTelnet.methods.htmlspecialchars(decodeURIComponent(msg)));
            $("#telnet_area").animate({
                scrollTop:$("#telnet_area")[0].scrollHeight - $("#telnet_area").height()
            },10);
        },
        htmlspecialchars : function(string, quote_style, charset, double_encode){
            var optTemp = 0,
              i = 0,
              noquotes = false;
            if (typeof quote_style === 'undefined' || quote_style === null) {
              quote_style = 2;
            }
            string = string.toString();
              if (double_encode !== false) {
                // Put this first to avoid double-encoding
                string = string.replace(/&/g, '&amp;');
            }
            string = string.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');

              var OPTS = {
                'ENT_NOQUOTES': 0,
                'ENT_HTML_QUOTE_SINGLE': 1,
                'ENT_HTML_QUOTE_DOUBLE': 2,
                'ENT_COMPAT': 2,
                'ENT_QUOTES': 3,
                'ENT_IGNORE': 4
              };
              if (quote_style === 0) {
                noquotes = true;
              }
              if (typeof quote_style !== 'number') {
                // Allow for a single string or an array of string flags
                quote_style = [].concat(quote_style);
                for (i = 0; i < quote_style.length; i++) {
                  // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                  if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                  } else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                  }
                }
                quote_style = optTemp;
              }
              if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
                string = string.replace(/'/g, '&#039;');
              }
              if (!noquotes) {
                string = string.replace(/"/g, '&quot;');
              }

              return string;
        }
    }
};