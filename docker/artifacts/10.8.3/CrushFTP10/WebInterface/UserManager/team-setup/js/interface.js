var crushTeamSetup = (function($) {
    var teamSetupDialog;
    var msg = "It will create 3 users: <strong>{1}_limited_users</strong>, <strong>{1}_Sub_User</strong> and <strong>{1}_Sub_Admin</strong>";
    var site_prefs = {
        limited_user: "<site>(SITE_PASS)(SITE_DOT)(SITE_EMAILPASSWORD)</site>",
        sub_user: "<site>(SITE_PASS)(SITE_DOT)(SITE_EMAILPASSWORD)</site>",
        sub_admin: "<site>(SITE_PASS)(SITE_DOT)(SITE_EMAILPASSWORD)(USER_ADMIN)</site>"
    }

    function checkuserName(names, callback){
        var checked = 0;
        function verifyNext(){
            if(checked<names.length){
                var name = names[checked];
                userManager.methods.checkUserNameAvailability(name, function(available){
                    if(available)
                    {
                        jAlert("User already exist, please choose another name", "Message", function(){
                            callback(true);
                        });
                    }
                    else
                    {
                        checked++;
                        verifyNext();
                    }
                });
            }
            else{
                callback();
            }
        }
        verifyNext();
    }

    function addUser(value, cb){
        if(value)
        {
            value = $.trim(value);
            var userName = value;
            var waitBoxOpen = false;

            function continueUserCreation(value)
            {
                var users = [
                    value+'_limited_users',
                    value+'_Sub_User',
                    value+'_Sub_Admin'
                ];
                crushFTP.UI.showLoadingIndicator(true);
                checkuserName(users, function(error){
                    crushFTP.UI.hideLoadingIndicator(true);
                    if(!error){
                        createUsers(users, function(){
                             $(".reloadUsersLinkMain", "#GUIInterface").trigger("click");
                             cb();
                        });
                    }
                });

                function createUsers(names, callback){
                    var created = 0;
                    function createNext(){
                        if(created<names.length){
                            var name = names[created];
                            continueAddUser(name, function(){
                                created++;
                                createNext();
                            });
                        }
                        else{
                            callback();
                        }
                    }
                    createNext();
                }

                function continueAddUser(userName, callback){
                    function choosePassword(password)
                    {
                        if(typeof password != undefined)
                        {
                            var msgs = userManager.methods.validateUserPassword(password, userName.toLowerCase());
                            if(msgs && msgs.length)
                            {
                                jAlert(msgs[0], "Error", function(){
                                    showPasswordDialog(password);
                                }, {
                                    classForPopupPanel : 'warning'
                                });
                                return false;
                            }
                            crushFTP.UI.showLoadingIndicator(true);
                            var defaultUser = crushFTP.storage("defaultUser");
                            var salt = "";
                            if(defaultUser && defaultUser.user && defaultUser.user.salt && defaultUser.user.salt == "random")
                            {
                                var pass = panelSetup.generatePasswordUsingPrefs();
                                salt = "<salt>"+pass+"</salt>";
                            }
                            var currentUserForCreateUser = $(document).data("username");
                            var site = userName.endsWith("sub_admin") ? site_prefs.sub_admin : userName.endsWith("limited_user") ? site_prefs.limited_user : site_prefs.sub_user;
                            crushFTP.data.getServerItem("server_info/current_datetime_ddmmyyhhmmss", function (serverTime) {
                                var responseStatusForCreateUser = $(serverTime).find("response_status").text() || "";
                                userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><created_by_username>"+currentUserForCreateUser+"</created_by_username><created_by_email>"+userManager.currentUserEmail+"</created_by_email><created_time>"+responseStatusForCreateUser+"</created_time><username>"+crushFTP.methods.htmlEncode(userName)+"</username><password>"+crushFTP.methods.htmlEncode(password)+"</password>"+salt+"<max_logins>0</max_logins><root_dir>/</root_dir>"+site+"</user>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"properties\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></permissions>", userName, "new", function(response){
                                        crushFTP.UI.hideLoadingIndicator();
                                        if(response) {
                                            crushFTP.UI.growl("Message : ", "User created", false, 3000);
                                            callback();
                                        }else{
                                            crushFTP.UI.growl("Failure: ", DOMPurify.sanitize(data), true, true);
                                        }
                                });
                            })
                        }
                    }
                    function showPasswordDialog(password, user)
                    {
                        $("#userPasswordDialog").form().dialog({
                            autoOpen: true,
                            width: 500,
                            modal: true,
                            resizable: false,
                            closeOnEscape: false,
                            title : "Choose a password for this user : "+ user,
                            /* edited by carlos assign some ids to the buttons for easy tour reference */
                            buttons: [{
                                id:"passbtn-cancel",
                                text: "Cancel",
                                click: function() {
                                    $(this).dialog("close");
                                }
                            },
                            {
                                id:"passbtn-ok",
                                text: "OK",
                                click: function() {
                                    var pass = $("#user_password_prompt").val();
                                    choosePassword(pass);
                                    $(this).dialog("close");
                                }
                            }],
                            open : function(){
                                $("#user_generated_password").val("");
                                var passtoShow = password || "";
                                $("#user_password_prompt").val(passtoShow).focus();
                            }
                        });
                    }
                    userManager.methods.showInfoToUserAboutSpecialUser(userName, function(isdone){
                        if(isdone)
                            choosePassword("");
                        else
                            showPasswordDialog("" , userName);
                    });
                }
            }

            if(crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInUserName))
            {
                jAlert("You can not use these characters in user name : \"" + userManager.notAllowedCharsInUserName + "\"", "Error", function(){
                    addUserMethod(value);
                });
            }
            else
            {
                continueUserCreation(value);
            }
        }
    }

    function init() {
        if($("#automate-user-creation").length)
            return;
        $("body").append("<div id='automate-user-creation' class='customForm'></div>");
        var popup = $("#automate-user-creation").load("team-setup/index.html", function(){
            teamSetupDialog = popup.form().dialog({
                autoOpen: false,
                title : "Setup Team: ",
                resizable: false,
                width: 600,
                closeOnEscape: true,
                modal: true,
                open: function(event, ui){
                    var dlg = $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
                    dlg.find(".ui-state-error").removeClass('ui-state-error');
                    dlg.find(".validationErrorMessage").remove();
                },
                create: function(event, ui) {
                    $(event.target).parent().css('position', 'fixed');
                },buttons : {
                    "OK" : function(){
                        var teamName = $("#team_name", teamSetupDialog);
                        if(teamName.hasClass('ui-state-error'))
                        {
                            return false;
                        }
                        var name = teamName.val();
                        addUser(name, function(){
                            teamSetupDialog.dialog("close");
                            $("#team_name", teamSetupDialog).val("");
                            $("#create-user-note", $("#automate-user-creation")).html("");
                        });
                    }
                }
            });
            var note = $("#create-user-note", $("#automate-user-creation"));
            $(".validate", $("#automate-user-creation")).crushValidator({
                notAllowedCharsInUserName: userManager.notAllowedCharsInUserName.replace("&", "& ")
            }).bind("textchange", function(){
                $(this).validateNow({
                    notAllowedCharsInUserName: userManager.notAllowedCharsInUserName.replace("&", "& ")
                });
                var team="";
                if(!$(this).hasClass('ui-state-error')){
                    team = msg.replace(/\{1\}/g, crushFTP.methods.xssEncode($.trim($(this).val())));
                }
                note.html(team);
            });
        }).hide();
    }

    function show(){
        teamSetupDialog.dialog("open");
    }

    return {
        init : init,
        show : show
    };
})(jQuery);

$(document).ready(function() {
    crushTeamSetup.init();
});