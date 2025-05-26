/*!
* CrushFTP Web GUI Initial events
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Thu, Apr 16 2014
*
* Author: Carlos Quintero
*
*/
var mainTour = [
{
    objectKey: ".",
    name: "dashboardGraphPanelGroup:eq(2)",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "This is the dashboard it contains server stats.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "pnlGraphs",
    bgcolor: "black",
    color: "white",
    text: "This grahps show information about current speed usage, connections and memory usage.",
    position: "BL",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "topSwitchButtons li:eq(3)",
    bgcolor: "black",
    color: "white",
    text: "Now we will create a new user, we can do this on this section \"User Manager\".",
    position: "TL",
    time: 7000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: function(){
    	window.top.location = '/WebInterface/UserManager/index.html?tour=y';
    }
},
{
    objectKey: "#",
    name: "topSwitchButtons li:eq(3)",
    bgcolor: "black",
    color: "white",
    text: "Please wait untill the section load.",
    position: "TL",
    time: 7000,
    top: 0,
    left: 0,
    beforeload: function(){
        if($.jStorage.storageAvailable()){
            $.jStorage.set("tour", "y");
            $.jStorage.setTTL("tour", (10 * (60 * 1000)));
            if($.jStorage.storageAvailable()){
                $.jStorage.deleteKey("tourDMZ");
            }
            window.top.location = '/WebInterface/UserManager/index.html';
        } else {
            window.top.location = '/WebInterface/UserManager/index.html?tour=y';
        }
    },
    callback: false,
}
],
mainTour2 = [
{
    objectKey: "#",
    name: "addUser",
    bgcolor: "black",
    color: "white",
    position: "TL",
    text: "With this button we can create new users.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: function(){
    	$('a#addUser').trigger('click');
    }
},
{
    objectKey: "#",
    name: "popup_prompt",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "Now we type the username for our new user and we click OK button.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: function(){
        $('a#popup_ok').bind('click', function(event){
            event.stopPropagation();
            nextStep();
        });
    },
    callback: function(){
    	//$('input#popup_prompt').val('touruser').trigger('change');
    }
},
{
    objectKey: "#",
    name: "user_generateRandomPass",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "You can type your own password or use the password generator.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: function(){
    	var isOpen = false;
    	if ($("#userPasswordDialog").hasClass('ui-dialog-content')) {
    		isOpen = $( "#userPasswordDialog" ).dialog("isOpen");
    	}
    	return isOpen;
    },
    callback: false
},
{
    objectKey: "#",
    name: "user_password_prompt",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "we will set the password here.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: function(){
        $('input#user_password_prompt').focus();
        return true;
    },
    callback: function(){
    	//$('input#user_password_prompt').val('tourpass').trigger('change');
    }
},
{
    objectKey: "#",
    name: "passbtn-ok",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "Now we click on \"OK\" for create the user.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: function(){
        $('#passbtn-ok').bind('click', function(event){
            event.stopPropagation();
            endTour();
        });
        return true;
    },
    callback: function(){
    	endTour();
    }
}
],
mainTour3 = [
{
    objectKey: "#",
    name: "serverDirBrowsePanel",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "You can drag the folder to the right and the user will have access to that folder.",
    time: 5000,
    top: -50,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "vfsItems",
    bgcolor: "black",
    color: "white",
    text: "When the folder is listed on this list, you will be able to set folder permissions on the next column.",
    position: "BL",
    time: 5000,
    top: -10,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "inheritFromRootVFSOptions",
    bgcolor: "black",
    color: "white",
    text: "You can set folder permissions here.",
    position: "BL",
    time: 7000,
    top: 25,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "saveUserData",
    bgcolor: "black",
    color: "white",
    text: "Once you finish the changes, click here to save.",
    position: "BL",
    time: 7000,
    top: 0,
    left: 0,
    beforeload: function(){
        if($.jStorage.storageAvailable()){
            $.jStorage.deleteKey("tour");
        }
        return true;
    },
    callback: false
}
],
dmzTour = [
{
    objectKey: "#",
    name: "settingsPanel",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "Before we start check the DMZ documentation on our <a href=\"http://www.crushftp.com/crush9wiki/Wiki.jsp?page=DMZ\" target=\"_blank\" style=\"color: #FFF\">WIKI page</a>.",
    time: 5000,
    top: 50,
    left: 0,
    beforeload: false,
    callback: false
},
{
    objectKey: "input#",
    name: "ip",
    bgcolor: "black",
    color: "white",
    text: "The IP is the IP of the DMZ server.",
    position: "L",
    time: 5000,
    top: 0,
    left: 15,
    beforeload: false,
    callback: false
},
{
    objectKey: "input#",
    name: "port",
    bgcolor: "black",
    color: "white",
    text: "The port is the port you used when you start the dmz server.",
    position: "L",
    time: 7000,
    top: 0,
    left: 15,
    beforeload: false,
    callback: false
},
{
    objectKey: "input#",
    name: "server_item_name",
    bgcolor: "black",
    color: "white",
    text: "The name is requiered and should match the name on your dmz preferences file, for example if you file is prefs_dmztest.XML the name should be dmztest.",
    position: "L",
    time: 7000,
    top: 0,
    left: 15,
    beforeload: false,
    callback: false
},
{
    objectKey: "#",
    name: "saveContent",
    bgcolor: "black",
    color: "white",
    text: "Once you complete all the fields click on save and we will create the requiered user for you.",
    position: "BR",
    time: 7000,
    top: -15,
    left: -15,
    beforeload: function(){
        $('#saveContent').bind('click', function(event){
            if($.jStorage.storageAvailable()){
                $.jStorage.set("tourDMZ", "y");
                $.jStorage.setTTL("tourDMZ", (10 * (60 * 1000)));
                if($.jStorage.storageAvailable()){
                    $.jStorage.deleteKey("tour");
                }
                window.top.location = '/WebInterface/UserManager/index.html';
            } else {
                window.top.location = '/WebInterface/UserManager/index.html?tourDMZ=y';
            }
        });
        return true;
    },
    callback: false
}
],
dmzTour2 = [
{
    objectKey: "#",
    name: "addUser",
    bgcolor: "black",
    color: "white",
    position: "TL",
    text: "We will create now the DMZ user.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: function(){
        $('a#addUser').trigger('click');
    }
},
{
    objectKey: "#",
    name: "popup_prompt",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "Now we will call this new user \"template\".",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: function(){
        $('input#popup_prompt').val('template').trigger('change');
    }
},
{
    objectKey: "#",
    name: "popup_ok",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "Now we click on OK.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: false,
    callback: function(){
        $('#popup_ok').trigger('click');
    }
},
{
    objectKey: "#",
    name: "user_generateRandomPass",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "You can type your own password or use the password generator.",
    time: 5000,
    top: 0,
    left: 0,
    beforeload: function(){
        var isOpen = false;
        if ($("#userPasswordDialog").hasClass('ui-dialog-content')) {
            isOpen = $( "#userPasswordDialog" ).dialog("isOpen");
        }
        return isOpen;
    },
    callback: false
}
],
dmzTour3 = [
{
    objectKey: ".",
    name: "newItem",
    bgcolor: "black",
    color: "white",
    position: "L",
    text: "Now we will create a new virtual item and configure for you.",
    time: 5000,
    top: -30,
    left: 0,
    beforeload: false,
    callback: function(){
        $('.newItem a').trigger('click');
    }
},
{
    objectKey: "#",
    name: "vitem-ok",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "Now we will configure all for you, click Next to continue.",
    time: 5000,
    top: -10,
    left: 0,
    beforeload: function(){
        var isOpen = false;
        if ($("#fieldPropertiesDialog").hasClass('ui-dialog-content')) {
            isOpen = $( "#fieldPropertiesDialog" ).dialog("isOpen");
        }
        return isOpen;
    },
    callback: function(){
        $('#item_option_itemType').val('http').trigger('change');
        $('#itemProperty_option_name').val('internal').trigger('change');
        $('#itemProperty_option_url').val('HTTP://%username%:%password%@127.0.0.1:80/').trigger('change');
    }
},
{
    objectKey: "#",
    name: "vitem-ok",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "All is configured now, click on OK to continue.",
    time: 5000,
    top: -10,
    left: 0,
    beforeload: false,
    callback: function(){
        $('#vitem-ok').trigger('click');
    }
},
{
    objectKey: "fieldset",
    name: "[pnlid=restrictions12]",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "We will configure now the SSH key for the DMZ user.",
    time: 5000,
    top: -10,
    left: 0,
    beforeload: false,
    callback: function(){
        $('fieldset[pnlid=restrictions12] table td.checkboxArea').find('span.ui-state-default').trigger('click');
        $('#ssh_public_keys').val('DMZ');
    }
},
{
    objectKey: "#",
    name: "saveUserData",
    bgcolor: "black",
    color: "white",
    position: "BL",
    text: "Now you can click on Save All Changes for finish the DMZ configuration.",
    time: 5000,
    top: -10,
    left: 0,
    beforeload: function(){
        $('#saveUserData').bind('click', function(){
            endTour();
            if($.jStorage.storageAvailable()){
                $.jStorage.deleteKey("tourDMZ");
            }
        });
    },
    callback: function(){

    }
}
],
autoplay = false,
tourOverlay = false,
showtime,
step = 0,
tour,
tourdisableScroll = false,
total_steps;

$('#activatetour').live('click',startTour);
$('#canceltour').live('click',endTour);
$('#endtour').live('click',endTour);
$('#restarttour').live('click',restartTour);
$('#nextstep').live('click',nextStep);
$('#prevstep').live('click',prevStep);

function startTour(){
    $('#activatetour').remove();
    $('#endtour,#restarttour').show();
    if(!autoplay && total_steps > 1)
        $('#nextstep').show();
    showOverlay();
    nextStep();
}

function nextStep(){
	if(step > 0){
    	var prev_step_config = tour[step-1];
    	var step_config = (step >= total_steps) ? tour[step-1] : tour[step];
    	//run callback
    	if(typeof prev_step_config.callback == "function"){
    		prev_step_config.callback();
    	}
    	//beforeload condition
    	if(typeof step_config.beforeload == "function"){
    		if(step_config.beforeload() == false){
    			setTimeout(nextStep, 500);
    			return false;
    		}
    	}
    }
    if(!autoplay){
        if(step > 0)
            $('#prevstep').show();
        else
            $('#prevstep').hide();
        if(step == total_steps-1)
            $('#nextstep').hide();
        else
            $('#nextstep').show();
    }
    if(step >= total_steps){
        //if last step then end tour
        endTour();
        return false;
    }
    ++step;
    showTooltip();
}

function prevStep(){
    if(!autoplay){
        if(step > 2)
            $('#prevstep').show();
        else
            $('#prevstep').hide();
        if(step == total_steps)
            $('#nextstep').show();
    }
    if(step <= 1)
        return false;
    --step;
    showTooltip();
}

function endTour(){
    step = 0;
    $.jStorage.deleteKey("tour");
    $.jStorage.deleteKey("tourDMZ");
    if(autoplay) clearTimeout(showtime);
    removeTooltip();
    hideControls();
    hideOverlay();
}

function restartTour(){
    step = 0;
    if(autoplay) clearTimeout(showtime);
    nextStep();
}

function showTooltip(){
    //remove current tooltip
    removeTooltip();

    var step_config     = tour[step-1];
    var $elem           = $(step_config.objectKey + step_config.name);



    if(autoplay)
        showtime    = setTimeout(nextStep,step_config.time);

    var bgcolor         = step_config.bgcolor;
    var color           = step_config.color;

    var opts = {
        id          : 'tour_tooltip',
        html        : '<p>'+step_config.text+'</p><span class="tooltip_arrow"></span>'
    };
    opts['class'] = 'tooltip';
    var $tooltip        = $('<div>',opts).css({
        'display'           : 'none',
        'background-color'  : bgcolor,
        'color'             : color
    });

    //position the tooltip correctly:

    //the css properties the tooltip should have
    var properties      = {};

    var tip_position    = step_config.position;

    //append the tooltip but hide it
    $('BODY').prepend($tooltip);

    //get some info of the element
    var e_w             = $elem.outerWidth();
    var e_h             = $elem.outerHeight();
    var e_l             = $elem.offset().left;
    var e_t             = $elem.offset().top;


    switch(tip_position){
        case 'TL'   :
            properties = {
                'left'  : e_l,
                'top'   : e_t + e_h + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_TL');
            break;
        case 'TR'   :
            properties = {
                'left'  : e_l + e_w - $tooltip.width() + 'px',
                'top'   : e_t + e_h + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_TR');
            break;
        case 'BL'   :
            properties = {
                'left'  : e_l + 'px',
                'top'   : e_t - $tooltip.height() + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_BL');
            break;
        case 'BR'   :
            properties = {
                'left'  : e_l + e_w - $tooltip.width() + 'px',
                'top'   : e_t - $tooltip.height() + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_BR');
            break;
        case 'LT'   :
            properties = {
                'left'  : e_l + e_w + 'px',
                'top'   : e_t + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_LT');
            break;
        case 'LB'   :
            properties = {
                'left'  : e_l + e_w + 'px',
                'top'   : e_t + e_h - $tooltip.height() + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_LB');
            break;
        case 'RT'   :
            properties = {
                'left'  : e_l - $tooltip.width() + 'px',
                'top'   : e_t + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_RT');
            break;
        case 'RB'   :
            properties = {
                'left'  : e_l - $tooltip.width() + 'px',
                'top'   : e_t + e_h - $tooltip.height() + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_RB');
            break;
        case 'T'    :
            properties = {
                'left'  : e_l + e_w/2 - $tooltip.width()/2 + 'px',
                'top'   : e_t + e_h + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_T');
            break;
        case 'R'    :
            properties = {
                'left'  : e_l - $tooltip.width() + 'px',
                'top'   : e_t + e_h/2 - $tooltip.height()/2 + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_R');
            break;
        case 'B'    :
            properties = {
                'left'  : e_l + e_w/2 - $tooltip.width()/2 + 'px',
                'top'   : e_t - $tooltip.height() + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_B');
            break;
        case 'L'    :
            properties = {
                'left'  : e_l + e_w  + 'px',
                'top'   : e_t + e_h/2 - $tooltip.height()/2 + 'px'
            };
            $tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_L');
            break;
    }
    if(step_config.top != 0){
    	var topInitial = parseFloat(properties.top.toString().replace('px', ''));
    	properties.top = (topInitial + step_config.top)+'px';
    }
    if(step_config.left != 0){
    	var leftInitial = parseFloat(properties.left.toString().replace('px', ''));
    	properties.left = (leftInitial + step_config.left)+'px';
    }


    /*
    if the element is not in the viewport
    we scroll to it before displaying the tooltip
     */
    var w_t = $(window).scrollTop();
    var w_b = $(window).scrollTop() + $(window).height();
    //get the boundaries of the element + tooltip
    var b_t = parseFloat(properties.top,10);

    if(e_t < b_t)
        b_t = e_t;

    var b_b = parseFloat(properties.top,10) + $tooltip.height();
    if((e_t + e_h) > b_b)
        b_b = e_t + e_h;


    if((b_t < w_t || b_t > w_b) || (b_b < w_t || b_b > w_b) && tourdisableScroll == false){
        $('html, body').stop()
        .animate({scrollTop: b_t}, 500, 'easeInOutExpo', function(){
            //need to reset the timeout because of the animation delay
            if(autoplay){
                clearTimeout(showtime);
                showtime = setTimeout(nextStep,step_config.time);
            }
            //show the new tooltip
            $tooltip.css(properties).show();
        });
    }
    else
    //show the new tooltip
        $tooltip.css(properties).show();
}

function removeTooltip(){
    $('#tour_tooltip').remove();
}

function showControls(configuration, position, autostart, scroll){
    /*
    we can restart or stop the tour,
    and also navigate through the steps
     */
    tourdisableScroll = (scroll == true) ? true : false;
    step = 0;
    tour = configuration;
    total_steps = tour.length;
    if(autoplay) clearTimeout(showtime);
    var $tourcontrols  = '<div id="tourcontrols" class="tourcontrols" style="z-index: 9999999">';
    $tourcontrols += '<p>User Manager Tour</p>';
    $tourcontrols += '<span class="button" id="activatetour">Start the tour</span>';
        if(!autoplay){
            $tourcontrols += '<div class="nav"><span class="button" id="prevstep" style="display:none;">< Previous</span>';
            $tourcontrols += '<span class="button" id="nextstep" style="display:none;">Next ></span></div>';
        }
        $tourcontrols += '<a id="restarttour" style="display:none;">Restart the tour</span>';

        $tourcontrols += '<a id="endtour" style="display:none;">End the tour</a>';
        $tourcontrols += '<span class="close" id="canceltour"></span>';
    $tourcontrols += '</div>';

    $('BODY').prepend($tourcontrols);
    if(position == 'r') { $('#tourcontrols').css({right: '-300px'}).animate({'right':'30px'},500); }
    else if(position == 'l') { $('#tourcontrols').css({left: '-300px', right: '0px'}).animate({'left':'30px'},500); }
    if(autostart){
    	$('#activatetour').trigger('click');
    }
}

function hideControls(){
    $('#tourcontrols').remove();
}

function showOverlay(){
    if(tourOverlay == false)
        return;
    var $overlay    = '<div id="tour_overlay" class="overlay" style="z-index: 999999"></div>';
    $('BODY').prepend($overlay);
}

function hideOverlay(){
    $('#tour_overlay').remove();
}