function isNumeric(value) {
    return /^\d+$/.test(value);
}
//Apply customizations
function applyCustomizations() {
    var customizations = $(document).data("customizations"); //Customizations from cache
    if (!customizations) return;
    if(!window.useOldUploader && window.newUploadAdded && window.crushUpload && !window.newUploadCustomizationsApplied){
        window.newUploadCustomizationsApplied = true;
        if(window.crushUpload)
            window.crushUpload.applyCustomizations(customizations);
    }
    /*if(window.hideFilter)
        window.hideFilter("false");
    if(window.hideCheckBoxColumn)
        window.hideCheckBoxColumn();*/
    var advUpload = $("#advancedBrowseOptionsDiv");
    var nativeUpload = $("#nativeBrowseOptionsDiv");
    var filesContainer = $("#filesContainer");
    var searchDiv = $("#searchDiv");
    for (var i=0;i<customizations.length;i++) //Loop through customizations
    {
        var custItem = customizations[i];
        //Switch from key and apply customization based on key and value
        switch (custItem.key) {
        case "redirectRoot":
            //Redirect root
            window.redirectRoot = custItem.value;
            break;
        case "shareyyyymmdd":
            // If share window to yse yyyymmdd format
            window.Shareyyyymmdd = custItem.value == "true";
            break;
        case "shareddmmyyyy":
            // If share window to yse ddmmyyyy format
            window.Shareddmmyyyy = custItem.value == "true";
            break;
        case "customformyyyymmdd":
            // If custom forms has to use yyyymmdd format for date
            window.CustomFormyyyymmdd = custItem.value == "true";
            break;
        case "DATE_FORMAT_TEXT":
            window.customDateFormat = custItem.value;
            break;
        case "dateSeparator":
            window.dateSeparator = custItem.value;
            break;
        case "TIME_FORMAT_TEXT":
            window.customTimeFormat = custItem.value;
            break;
        case "logo":
            //Logo to show on layout
            var logoLink = custItem.value;
            if(logoLink.toLowerCase().indexOf("http://")<0 && logoLink.toLowerCase().indexOf("https://")<0)
            {
                logoLink = "/WebInterface/images/" + logoLink;
            }
            if($("div.logo", "#header").find("img").length>0)
                $("div.logo", "#header").find("img").replaceWith("<img src='" + logoLink+ "' />");
            else
                $("div.logo", "#header").append("<img src='" + logoLink + "' />");
            break;
        case "linkOnLogo":
            // Hyperlink on logo
            var link = custItem.value;
            if (link) {
                if (!$("div.logo").find("img").parent().attr("href")) {
                    if(link == "#")
                        $("div.logo").find("img").wrap("<a href='" + link + "'></a>");
                    else
                       $("div.logo").find("img").wrap("<a target='_blank' href='" + link + "'></a>");
                } else {
                    $("div.logo").parent().attr("href", link);
                }
                if(window.logoLinkTarget){
                    $("div.logo").parent().attr("target", window.logoLinkTarget);
                }
                $("div.logo").find("img").css("border", "none");
            }
            break;
        case "linkTargetOnLogo":
            // Hyperlink on logo
            var linkTarget = custItem.value;
            if (linkTarget) {
                window.logoLinkTarget = linkTarget;
                if ($("div.logo").find("img").parent().attr("href")) {
                    $("div.logo").find("img").parent().attr("target", linkTarget);
                }
            }
            break;
        case "logoAlign":
            //Allignment of logo on screen
            if (custItem.value == "middle") {
                $("div.logo").css("float", "none").addClass("logoCenter").parent().css("text-align", "center");
            } else if (custItem.value == "right") {
                $("div.logo").css("float", "right").addClass("logoCenter").parent().css("text-align", "right");
            } else {
                $("div.logo").css("float", "left").removeClass("logoCenter").parent().css("text-align", "left");
            }
            break;
        case "title":
            //Document title
            if(!window.hasLocalTitle)
            {
                document.title = custItem.value;
                try{
                    pageTitleNotification.vars.OriginalTitle = custItem.value;
                }catch(ex){}
            }
            break;
        case "slideshowWindowTitle":
            if(window.forSlideshow)
            {
                document.title = custItem.value;
            }
            break;
        case "header":
            //Header on layout
            if($("div#headerText").text().length==0)
                $("div#headerText").html(DOMPurify.sanitize(custItem.value)).attr("id", "_headerText");
            break;
        case "hideUploadBar" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true" && $.CrushFTP)
            {
                $.cssRule({
                    "#fileUploadBarHolder, #viewFileQueue, #globalProgressBar": [
                        ["display", "none !important;"]
                    ]
                });

                $("#fileQueueInfo").removeClass("ui-widget-content ui-corner-all").css("box-shadow", "none").css("-webkit-box-shadow", "none").css("-moz-box-shadow", "none").css("border", "none");

                $.CrushFTP.uploadBarHidden = true;
            }
            break;
        case "uploadBarInline" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true" && $.CrushFTP)
            {
                $("#fileRepo").css("position", "relative").css("max-width", "100%")

                //$("#fileRepo").find("ul").css("max-height", "100px");

                $.CrushFTP.uploadBarInline = true;
            }
            break;
        case "hideGlobalUploadBar" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true")
            {
                $.cssRule({
                    "#globalProgressBar": [
                        ["display", "none"]
                    ]
                });
            }
            break;
        case "hideDNDUploadInfoText" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true")
            {
                $.cssRule({
                    "#browserDragdropInfoText": [
                        ["display", "none"]
                    ]
                });
            }
            break;
        case "showUploadNotification" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true")
            {
               window.showUploadNotification = true;
            }
            break;
        case "dontShowUploadQueueCompletedGrowlMessage" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true")
            {
               window.dontShowUploadQueueCompletedGrowlMessage = true;
            }
            break;
        case "disableUploadTimeLimit" :
            //Hide new upload bar
            if (custItem.value.toLowerCase() == "true")
            {
               window.disableUploadTimeLimit = true;
            }
            break;
        case "blockUploadingDirs":
            //Uploading dir is disabled
            window.blockUploadingDirs = custItem.value.toLowerCase() == "true";
            break;
        case "upload_disableFileQueueDisplayAfterFilesAdded":
            //Uploading dir is disabled
            window.disableFileQueueOnFileAdded = custItem.value.toLowerCase() == "true";
            break;
        case "upload_MaxChunkSizeInMB":
            if(isNumeric(custItem.value)){
                window.maxChunkSize = parseInt(custItem.value);
            }
            break;
        case "upload_MaxFileSizeInMB":
            if(isNumeric(custItem.value)){
                window.maxFileSizeAllowed = parseInt(custItem.value);
            }
            break;
        case "maxRetriesBeforeCancellingUpload":
            if(isNumeric(custItem.value)){
                window.requestRetries = parseInt(custItem.value);
            }
            break;
        case "noTimeoutUploadedNote":
            //Uploading dir is disabled
            window.noTimeoutUploadedNote = custItem.value.toLowerCase() == "true";
            break;
        case "noFilesOverlayBGColor":
            //No files available msg overlay BG color
            window.noFilesOverlayBGColor = custItem.value;
            break;
        case "noFilesOverlayTransparency":
            //No files available msg overlay BG color
            window.noFilesOverlayTransparency = custItem.value;
            break;
        case "headerTextColor":
            //Header text color
            $("#headerContent").css("color", custItem.value);
            break;
        case "growlTextColor":
            //Growl message text color
            $.blockUI.defaults.growlCSS.color = custItem.value;
            break;
        case "growlBackgroundColor":
            //Growl message BG color
            $.blockUI.defaults.growlCSS.backgroundColor = custItem.value;
            break;
        case "headerTextSize":
            //Header text size
            $("#headerContent").css("font-size", custItem.value);
            break;
        case "headerTextStyle":
            //Header text style
            if (custItem.value.indexOf("bold") >= 0) {
                $("#headerContent").css("font-weight", custItem.value);
            } else {
                $("#headerContent").css("font-style", custItem.value);
            }
            break;
        case "headerTextAlign":
            //Header text aling
            $("div#_headerText").css("text-align", custItem.value);
            break;
        case "headerBackgroundColor":
            //Header background color
            $("#headerContent").css("background-color", custItem.value);
            break;
        case "footer":
            //Footer html
            if($("div.footerContent").length>0 && $("div.footerContent").html().length==0)
                $("div.footerContent").html(DOMPurify.sanitize(custItem.value));
            break;
        case "footerTextColor":
            //Footer text color
            $.cssRule({
                "div.footerContent": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "footerTextSize":
            //Footer text size
            $.cssRule({
                "div.footerContent": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "footerTextStyle":
            //Footer text style
            if (custItem.value.indexOf("bold") >= 0) {
                $.cssRule({
                    "div.footerContent": [
                        ["font-weight", custItem.value]
                        ]
                });
            } else {
                $.cssRule({
                    "div.footerContent": [
                        ["font-style", custItem.value]
                        ]
                });
            }
            break;
        case "footerTextAlign":
            //Footer text alignment
            $.cssRule({
                "div.footerContent": [
                    ["text-align", custItem.value]
                    ]
            });
            break;
        case "footerBackgroundColor":
            //Footer background color
            $.cssRule({
                "div.footerContent": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "uploadOnly":
            //If layout need to be upload only
            if (custItem.value.toLowerCase() == "true") {
                makeItUploadOnly();
            }
            break;
        case "slideShowOnly":
            //If layout need to be slideshow only
            if (custItem.value.toLowerCase() == "true") {
                if (!window.forSlideshow) {
                    makeItSlideShowOnly();
                }
            }
            break;
        case "replaceListingWithPage":
            //If layout need to be replaced with HTML file
            if (custItem.value.toLowerCase() != "") {
                window.listingHTMLPage = custItem.value;
            }
            break;
        case "replaceListingWithPageKeepButtons":
            //If layout need to be replaced with HTML file
            if (custItem.value.toLowerCase() == "true") {
                window.listingHTMLPageKeepButtons = true;
            }
            break;
        case "metaInfoKeysToShowInTreeview":
                window.metaInfoKeysToShowInTreeview = custItem.value;
            break;
        case "popupBackgroundColor":
            //Popup background color
            $(document).data("popupBackgroundColor", custItem.value);
             $.cssRule({
                "#searchDiv tr.tblAltRow, #searchDiv tr.tblRow, .ui-dialog .ui-widget-content": [
                    ["background-color", custItem.value]
                ]
            });
            if(!$(document).data("slideShowOnly"))
            {
                $.fn.media.defaults.bgColor = custItem.value;
            }
            break;
        case "popupOverlayBackgroundColor":
            //Popup background color
            $(document).data("popupOverlayBackgroundColor", custItem.value);
            $.cssRule({
                ".blockUI.blockOverlay, div.ui-widget-overlay": [
                    ["background", custItem.value + " !important"]
                ]
            });
            break;
        case "popupBorderColor":
            //Popup border color
            $(document).data("popupBorderColor", custItem.value);
            $.cssRule({
                ".ui-dialog": [
                    ["border-color", custItem.value]
                ]
            });
            $.cssRule({
                ".ui-dialog .ui-widget-header": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "popupHeaderBackgroundColor":
            //Popup header BG color
            $(document).data("popupHeaderBackgroundColor", custItem.value);
            $.cssRule({
                ".blockUI .popupHeader": [
                    ["background-color", custItem.value]
                    ]
            });
            $.cssRule({
                ".ui-dialog .ui-widget-header": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "popupHeaderTextColor":
            //Popup header text color
            $.cssRule({
                ".blockUI .popupHeader": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                ".ui-dialog .ui-widget-header": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "quickSharePopupBackgroundColor":
             $.cssRule({
                ".publishStatusDialog, .publishStatusDialog div, .publishStatusDialog .ui-dialog-content, .publishStatusDialog .ui-widget-content, .publishStatusDialog .ui-dialog-buttonpane": [
                    ["background-color", custItem.value]
                ]
            });
            break;
        case "quickSharePopupHeaderBackgroundColor":
            //Popup header BG color
            $.cssRule({
                ".publishStatusDialog .ui-dialog-titlebar, .publishStatusDialog .ui-widget-header": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "quickSharePopupHeaderTextColor":
            //Popup header text color
            $.cssRule({
                ".publishStatusDialog .ui-dialog-titlebar, .publishStatusDialog .ui-widget-header": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "quickSharePopupHeaderBorderColor":
            //Popup header border color
            $.cssRule({
                ".publishStatusDialog .ui-dialog-titlebar, .publishStatusDialog .ui-widget-header": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "quickShareSendEmail":
            if (custItem.value == "true")
            {
                window.quickShareSendEmail = true;
            }
            break;
        case "altTempAccount":
            if (custItem.value == "true")
            {
                window.altTempAccount = true;
            }
            break;
        case "splitShareRequests":
            if (custItem.value == "true")
            {
                window.splitShareRequests = true;
            }
            break;
        case "shareAllowPrivsModification":
            if (custItem.value == "true")
            {
                window.shareAllowPrivsModification = true;
            }
            break;
        case "defaultAltTempAccount":
            if (custItem.value)
            {
                window.defaultAltTempAccount = custItem.value;
            }
            break;
        case "quickShareDisableNotificationPopup":
            if (custItem.value == "true")
            {
                window.quickShareDisableNotificationPopup = true;
            }
            break;
        case "shareShowCopyEmailBody":
            if (custItem.value == "true")
            {
                $.cssRule({
                ".shareCompleted a.copybodytoclip, .ui-dialog-content a.copybodytoclip": [
                    ["display", "inline-block !important"]
                    ]
                });
            }
            break;
        case "shareHideCopyLinkButton":
            if (custItem.value == "true")
            {
                $.cssRule({
                ".publishStatusDialog .copytoclip, .shareCompleted .copytoclip": [
                    ["display", "none !important"]
                    ]
                });
            }
            break;
        case "discourageEmailsInInternalShares":
            if (custItem.value == "true")
            {
                window.discourageEmailsInInternalShares = true;
            }
            break;
        case "hideShareMultipleSelectionQuick":
            if (custItem.value == "true")
            {
                $.cssRule({
                "#shareMultipleSelectionQuickPanel": [
                    ["display", "none !important"]
                    ]
                });

                $.cssRule({
                "#shareMultipleSelectionQuickPanel.override": [
                    ["display", "block !important"]
                    ]
                });
            }
            break;
        case "shareDisableNotificationPopup":
            if (custItem.value == "true")
            {
                window.shareDisableNotificationPopup = true;
            }
            break;
        case "quickShareOpenEmailClient":
            if (custItem.value == "true")
            {
                window.quickShareOpenEmailClient = true;
            }
            break;
        case "normalShareOpenEmailClient":
            if (custItem.value == "true")
            {
                window.normalShareOpenEmailClient = true;
            }
            break;
        case "hideShareResultLink":
            if (custItem.value == "true")
            {
                window.hideShareResultLink = true;
            }
            break;
        case "mainBackgroundColor":
            //Body background color
            $.cssRule({
                "body": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "mainTextColor":
            //Body text color
            $.cssRule({
                "body, a, a:visited, a:active,.viewSelectorPanel a.viewlink, .viewSelectorPanel a.viewlink:visited,.filterPanel a, .filterPanel a:visited": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "mainBackgroundImage":
            //Body background image
            var imgLink = custItem.value;
            if(imgLink.toLowerCase().indexOf("http://")<0 && imgLink.toLowerCase().indexOf("https://")<0)
            {
                imgLink = "/WebInterface/images/" + imgLink;
            }
            $.cssRule({
                "body": [
                    ["background-image", "url(" + imgLink + ")"]
                    ]
            });
            break;
        case "mainBackgroundImageNoRepeat":
            //Body background image, no-repeat
            if (custItem.value == "true") {
                $.cssRule({
                    "body": [
                        ["background-repeat", "no-repeat"]
                        ]
                });
            }
            break;
        case "mainBorderColor":
            //Body border color
            $.cssRule({
                "body": [
                    ["border", "1px solid " + custItem.value]
                    ]
            });
            break;
        case "headerButtonBarBackgroundColor":
            //header button bar background color
            $.cssRule({
                "#mainNavigation": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "buttonFontColor":
            //Main navigation button font color
            $.cssRule({
                "ul.topnav li a.menuLink": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "buttonHoverFontColor":
            //Main navigation button font color on hover
            $.cssRule({
                "ul.topnav li a.menuLink:hover": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "buttonBackgroundColor":
            //Main navigation button font background color
            $.cssRule({
                "#mainNavigation li": [
                    ["background-color", custItem.value + " !important"]
                    ]
            });
            break;
        case "buttonHoverColor":
            //Main navigation button background color on hover
            $.cssRule({
                "#mainNavigation a.menuLink:hover": [
                    ["background-color", custItem.value + " !important"]
                    ]
            });
            break;
        case "buttonBackgroundImage":
            //Main navigation button background image
            var imgLink = custItem.value;
            if(imgLink.toLowerCase().indexOf("http://")<0 && imgLink.toLowerCase().indexOf("https://")<0)
            {
                imgLink = "/WebInterface/images/" + imgLink;
            }
            $.cssRule({
                "#mainNavigation a.menuLink": [
                    ["background-image", "url(" + imgLink + ")" + " !important"],
                    ["background-repeat", "repeat-x" + " !important"]
                    ]
            });
            break;
        case "buttonHoverImage":
            //Main navigation button background image on hover
            var imgLink = custItem.value;
            if(imgLink.toLowerCase().indexOf("http://")<0 && imgLink.toLowerCase().indexOf("https://")<0)
            {
                imgLink = "/WebInterface/images/" + imgLink;
            }
            $.cssRule({
                "#mainNavigation a.menuLink:hover": [
                    ["background-image", "url(" + imgLink + ") !important"],
                    ["background-repeat", "repeat-x !important"]
                    ]
            });
            break;
        case "listBackgroundColor":
            //Item listing background color
            $.cssRule({
                "#filesListing, #basketFilesContainer, div.filesSelectedInBasket, #basketFilesContainerThumb, div.filesSelectedInBasket div": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "listTextColor":
            //Item listing font/text color
            $.cssRule({
                "#filesListing, #basketFilesContainer": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                "#filesListing a, #basketFilesContainer a": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "listTextColorHover":
            //Item listing font/text color on hover
            $.cssRule({
                "#filesListing tr:hover, #basketFilesContainer tr:hover": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                "#filesListing tr:hover a, #basketFilesContainer tr:hover a": [
                    ["color", custItem.value]
                    ]
            });

            $.cssRule({
                "#filesListing a:hover, #basketFilesContainer a:hover": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "listTextSize":
            //Item listing text size
            $.cssRule({
                "#filesListing,tr.jqueryFileTree, #filesListing a, #basketFilesContainer": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "listTextStyle":
            //Item listing text style ie. bold, italic etc
            if (custItem.value.indexOf("bold") >= 0) {
                $.cssRule({
                    "#filesListing,tr.jqueryFileTree, #filesListing a, #basketFilesContainer, #basketFilesContainer a": [
                        ["font-weight", custItem.value]
                        ]
                });
            } else {
                $.cssRule({
                    "#filesListing,tr.jqueryFileTree, #filesListing a, #basketFilesContainer, #basketFilesContainer a": [
                        ["font-style", custItem.value]
                        ]
                });
            }
            break;
        case "listHeaderBackgroundColor":
            //Item listing header background color
            $.cssRule({
                "#filesListing td.header, #basketFilesContainer td.header": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "listHeaderTextColor":
            //Item listing header text color
            $.cssRule({
                "#filesListing td.header, #basketFilesContainer td.header": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "listHeaderTextSize":
            //Item listing header text size
            $.cssRule({
                "#filesListing td.header, #basketFilesContainer td.header": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "listHeaderTextStyle":
            //Item listing header text style
            if (custItem.value.indexOf("bold") >= 0) {
                $.cssRule({
                    "#filesListing td.header, #basketFilesContainer td.header": [
                        ["font-weight", custItem.value]
                        ]
                });
            } else {
                $.cssRule({
                    "#filesListing td.header, #basketFilesContainer td.header": [
                        ["font-style", custItem.value]
                        ]
                });
            }
            break;
        case "listDefaultSortColumnIndex":
            //Item listing default sorting column
            {
                var val = parseInt(custItem.value);
                if(val)
                {
                    if(val>=2)
                        val+=1;
                    $(document).data("listDefaultSortColumnIndex", val);
                }
            }
            break;
        case "listDefaultSortDirection":
            //Item listing default sort direction
            $(document).data("listDefaultSortDirection", custItem.value);
            break;
        case "listSortingAlphaNumeric":
            if(custItem.value == "true")
            {
                window.alphanumericalSorting = true;
            }
            break;
        case "listAlternateColor":
            //Item listing alternate item row background color
            $.cssRule({
                ".jqueryFileTreeAlt": [
                    ["background-color", custItem.value + ""]
                    ]
            });
            break;
        case "listHoverColor":
            //Item listing background color on hover
            $.cssRule({
                ".rowHover td, .rowHoverFixed td": [
                    ["background-color", custItem.value + " !important"]
                    ]
            });
            break;
        case "tooltipBackgroundColor":
            //Tooltip's background color
            $.cssRule({
                ".tipsy-inner": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "tooltipTextColor":
            //Tooltip's text color
            $.cssRule({
                ".tipsy-inner": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "useFilterForSearch":
            if(custItem.value == "true")
            {
                window.useFilterForSearch = true;
            }
            break;
        case "searchDepth":
            if(custItem.value)
            {
                window.searchDepth = custItem.value;
            }
            break;
        case "startFileFilterOnlyAfterThisChars":
            if(custItem.value)
            {
                window.startFileFilterOnlyAfterThisChars = parseInt(custItem.value);
            }
            break;
        case "disableFolderExpansionInTreeview":
            if(custItem.value == "true")
            {
                window.disableFolderExpansionInTreeview = true;
            }
            break;
        case "hideFilterPanel":
            // Hide filter
            window.hideFilter(custItem.value);
            var varHideFilter = $.cookie(window.fileTreeOptions.CookieHideFilter);
            varHideFilter = varHideFilter == "true";
            if (varHideFilter) {
                $("#hideFilter").attr("checked", "checked");
                $("#hideFilter").closest("span").hide();
            } else {
                $("#hideFilter").removeAttr("checked");
            }
            break;
         case "hideSelectionLink":
            if(custItem.value == "true")
            {
                $("a.selectionLink").parent().hide();
            }
            break;
         case "hidePageSizeSelectionLink":
            if(custItem.value == "true")
            {
                $("a.pageSizeSelectionLink").parent().hide().closest(".per-page").hide();
            }
            break;
        case "defaultItemsPerPage":
            if(custItem.value && !window.defaultPageSizeSet)
            {
                window.defaultPageSizeSet = true;
                changePagerSize(parseInt(custItem.value), true);
            }
            break;
        case "CHECK_COL":
            //Enable/disable checkbox column
            $(document).data("disableCheckCol", custItem.value);
            if (custItem.value == "true") {
                $("#hideCheckBoxColumn").attr("checked", "checked");
            } else {
                $("#hideCheckBoxColumn").removeAttr("checked");
            }
            window.hideCheckBoxColumn(custItem.value == "true");
            break;
        case "NAME_COL":
            //Enable/disable name column
            $(document).data("disableNameCol", custItem.value);
            break;
        case "SIZE_COL":
            //Enable/disable size column
            $(document).data("disableSizeCol", custItem.value);
            break;
        case "MODIFIED_COL":
            //Enable/disable modified column
            $(document).data("disableModifiedCol", custItem.value);
            break;
        case "CREATED_COL":
            //Enable/disable created column
            $(document).data("enableCreatedCol", custItem.value);
            break;
        case "KEYWORDS_COL":
            //Enable/disable keywords column
            $(document).data("disableKeywordsCol", custItem.value);
            break;
        case "SHOWPATH_COL":
            if (custItem.value == "true")
            {
                window.alwaysShowPathColumn = true;
                $("#filesListing").addClass("showPathColumn");
            }
            break;
        case "enableFolderPreview" :
            if (custItem.value == "true")
            {
                window.enableFolderPreview = true;
            }
            break;
        case "disableCrushSyncIcon" :
            if (custItem.value == "true")
            {
                window.disableCrushSyncIcon = true;
            }
            break;
        case "noCopyLinkOnContextMenu" :
            if (custItem.value == "true")
            {
                window.noCopyLinkOnContextMenu = true;
                $("#myMenu").find(".copydirectlink").remove();
            }
            break;
        case "NAME_COL_TEXT":
            //name column header text
            localizations.TreeviewHeaderNameText =  custItem.value;
            filesContainer.find("td[colName='name']").text(custItem.value);
            break;
        case "SIZE_COL_TEXT":
            //size column header text
            localizations.TreeviewHeaderSizeText =  custItem.value;
            filesContainer.find("td[colName='size']").text(custItem.value);
            break;
        case "MODIFIED_COL_TEXT":
            //modified column header text
            localizations.TreeviewHeaderModifiedText =  custItem.value;
            filesContainer.find("td[colName='modified']").text(custItem.value);
            break;
        case "CREATED_COL_TEXT":
            //created column header text
            localizations.TreeviewHeaderCreatedText =  custItem.value;
            filesContainer.find("td[colName='created']").text(custItem.value);
            break;
        case "KEYWORDS_COL_TEXT":
            //keywords column header text
            localizations.TreeviewHeaderKeywordsText =  custItem.value;
            filesContainer.find("td[colName='keywords']").text(custItem.value);
            break;
        case "BROWSER_UPLOAD_START_TEXT":
            //Browser upload windo "start upload" button text to display
            $("#browserFileUpload").find("#submitAction").find("a.upload").text(custItem.value);
            break;
        case "shareThumbnail":
            //Settings to share thumbnail or not
            $(document).data("shareThumbnail", custItem.value);
            break;
        case "shareFiles":
            //Settings to share thumbnail or not
            $(document).data("shareFiles", custItem.value);
            break;
        case "autoShareUploadedItem":
            //Auto share uploaded item
            $(document).data("autoShareUploadedItem", custItem.value);
            break;
        case "autoShareUploadedItemInBatch":
            //Auto share uploaded item
            $(document).data("autoShareUploadedItemInBatch", custItem.value);
            break;
        case "autoShareUploadedItemNotify":
            //Auto share uploaded item
            $(document).data("autoShareUploadedItemNotify", custItem.value);
            break;
        case "autoRemoveUploadedItemFromList":
            if (custItem.value == "true")
            {
                window.autoRemoveUploadedItemFromList = true;
            }
            break;
        case "hideStartButtonOnIndividualUploadItem":
            if (custItem.value == "true")
            {
                window.hideStartButtonOnIndividualUploadItem = true;
            }
            break;
        case "maxFilesInQueue":
            if (custItem.value)
            {
                window.maxFilesInQueue = parseInt(custItem.value);
            }
            break;
        case "maxFileNameLengthInUpload":
            if (custItem.value)
            {
                window.maxFileNameLengthInUpload = parseInt(custItem.value);
            }
            break;
        case "shareAsMoveReference":
            if (custItem.value == "true")
            {
                window.shareAsMoveReference = true;
            }
            break;
        case "disableShareForUploadedItem":
            //Disable share from uploaded item
            $(document).data("disableShareForUploadedItem", custItem.value);
            break;
        case "shareMethodUploadedItem":
            //Default method to use while sharing uploaded item
            $(document).data("shareMethodUploadedItem", custItem.value);
            break;
        case "defaultShareMethod":
            //Default method to use while sharing
            $(document).data("defaultShareMethod", custItem.value);
            break;
        case "defaultShareMethodCrushDrop":
            //Default method to use while sharing
            $(document).data("defaultShareMethodCrushDrop", custItem.value);
            break;
        case "shareWindowNoUserInfoAfterShare":
            if (custItem.value == "true")
            {
                window.shareWindowNoUserInfoAfterShare = true;
            }
            break;
        case "shareIgnoreFolders":
            if (custItem.value == "true")
            {
                window.shareIgnoreFolders = true;
            }
            break;
        case "shareEmailBodyNoHTMLArea":
            if (custItem.value == "true")
            {
                window.shareEmailBodyNoHTMLArea = true;
            }
            break;
        case "shareIgnoreFiles":
            if (custItem.value == "true")
            {
                window.shareIgnoreFiles = true;
            }
            break;
        case "shareWindowNoOpenInEmail":
            if (custItem.value == "true")
            {
                window.shareWindowNoOpenInEmail = true;
            }
            break;
        case "shareWindowEnableUsernameLookup":
            if (custItem.value == "true")
            {
                window.shareWindowEnableUsernameLookup = true;
            }
            break;
        case "shareWindowHidePermissions":
            if (custItem.value == "true")
            {
                window.shareWindowHidePermissions = true;
            }
            break;
        case "shareWindowDefaultPermissions":
            if (custItem.value)
            {
                window.shareWindowDefaultPermissions = custItem.value;
            }
            break;
        case "shareWindowEnableMultipleUsernameSelection":
            if (custItem.value == "true")
            {
                window.shareWindowEnableMultipleUsernameSelection = true;
            }
            break;
        case "shareWindowNoOpenInNewTab":
            if (custItem.value == "true")
            {
                window.noOpenInNewTabManageShares = true;
            }
            break;
        case "shareWindowDisableDirectLinkForFile":
                window.shareWindowDisableDirectLinkForFile = custItem.value == "true";
            break;
        case "shareWindowFlagDirectLinkForFile":
            window.shareWindowFlagDirectLinkForFile = custItem.value == "true";
            break;
        case "shareWindowHideDownloadButtonVisible":
            window.shareWindowHideDownloadButtonVisible = custItem.value == "true";
            break;
        case "shareWindowHideDownloadButtonVisibleDefaultVal":
            window.shareWindowHideDownloadButtonVisibleDefaultVal = custItem.value == "true";
            break;
        case "shareAdvanced":
            //Allow/dis-allow advanced sharing option
            $(document).data("shareAdvanced", custItem.value);
            break;
        case "ShareDefaultLoginsValue":
            var maxLogins = parseInt(custItem.value);
            if(maxLogins && maxLogins != NaN)
            {
                if(maxLogins<-1)maxLogins=-1;
                $(document).data("ShareDefaultLoginsValue", maxLogins);
            }
            break;
        case "shareAllowUploads":
            //Allow/dis-allow uploads while sharing
            $(document).data("shareAllowUploads", custItem.value);
            break;
        case "shareAllowUploadsPrivs":
            if(custItem.value)
                $(document).data("shareAllowUploadsPrivs", custItem.value);
            break;
        case "disableThumbnailHover":
            //Enable/disable thumbnail hover info popup setting
            $(document).data("disableThumbnailHover", custItem.value);
            break;
        case "defaultThumbnailSize":
            //Default thumbs size (1 to 30)
            var size = parseInt(custItem.value);
            if(size && size != NaN)
            {
                if(size>30)size = 30;
                if(size<0)size = 0;
                window.defaultThumbnailSize = size;
                if(typeof window.defaultThumbnailSize != "undefined" && typeof window.zoomSlider != "undefined")
                {
                    window.zoomSlider.slider("value", window.defaultThumbnailSize);
                }
            }
            break;
        case "maxImageSizeForThumbnail":
            //Default thumbs size (1 to 30)
            var size = parseInt(custItem.value);
            if(size && size != NaN)
            {
                window.maxImageSizeForThumbnail = size;
            }
            break;
        case "disableTreeviewHover":
            //Enable/disable treeview item hover info popup setting
            $(document).data("disableTreeviewHover", custItem.value);
            break;
        case "disableUploadBarAnimation":
            //Disable animation of upload bar when showing
            if (custItem.value == "true") window.disableUploadBarAttentionAnimation = true;
            break;
        case "disableDragDropUpload":
            //Disable animation of upload bar when showing
            if (custItem.value == "true") {
                window.disableDragDropUpload = true;
                window.disableDragDropUploadPerm = true;
                $.cssRule({
                    "#browserDragdropInfoText": [
                        ["display", "none"]
                    ]
                });
            }
            break;
        case "upload_hideUploadBarAfterUpload":
            //Hide upload window after upload finishes
            if (custItem.value == "true") window.hideUploadBarAfterUpload = true;
            break;
        case "autoAppletFlag":
            //Load applet automatically when page loads flag
            window.autoAppletFlagSet(custItem.value == "true");
            if (custItem.value == "true") $("#autoAppletFlag").attr("checked", "checked");
            break;
        case "autoUploadFlag":
            if(typeof window.autoUploadFlagSet != "undefined")
            {
                //Load applet automatically when page loads flag
                if (custItem.value == "true")
                    window.autoUploadFlagSet(custItem.value);
                else
                    window.autoUploadFlagSet();
            }
            break;
        case "notAllowedExtensionsToUpload":
            if (custItem.value && custItem.value.length>0)
            {
                var exts = custItem.value.toLowerCase().split(",");
                exts.clean("");
                window.notAllowedExtensionsToUpload = exts;
            }
            break;
        case "onlyAllowedExtensionsToUpload":
            if (custItem.value && custItem.value.length>0)
            {
                var exts = custItem.value.toLowerCase().split(",");
                exts.clean("");
                window.onlyAllowedExtensionsToUpload = exts;
            }
            break;
        case "compressionInApplet":
            //admin preference to use compression in applet or not.
            window.compressionInApplet = custItem.value;
            break;
        case "showResume":
            //Show an option of resume in browser file upload window flag
            if (custItem.value == "false") {
                $("#browserFileUpload").find("label[for='chkUploadResume']").hide();
                $("#filesBasket").find("#chkDownloadResume").closest("div").hide();
            } else {
                $("#browserFileUpload").find("label[for='chkUploadResume']").show();
                $("#filesBasket").find("#chkDownloadResume").closest("div").show();
            }
            break;
        case "ResumeUploadSelectedByDefault":
            //Show an option of resume in browser file upload window flag
            if (custItem.value == "true") {
                $("#browserFileUpload").find("#chkUploadResume").attr("checked", "checked");
                $("#filesBasket").find("#chkDownloadResume").attr("checked", "checked");
                $("#resumeUpload_AppletConfig").attr("checked", "checked");
            }
            break;
        case "pathBackgroundColor":
            // Path/Breadcrumbs background color
            $.cssRule({
                "#crumbs": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "thumbsViewSingleClick":
            if (custItem.value == "true")
            {
                window.thumbsViewSingleClick = true;
            }
            break;
        case "autoRefreshListingTime":
            if (custItem.value)
            {
                window.autoRefreshListingTime = parseInt(custItem.value);
                if(!window.autoRefreshListingTime || isNaN(window.autoRefreshListingTime))
                    window.autoRefreshListingTime = 0;
            }
            break;
        case "hideHiddenFilesCount":
            if (custItem.value == "true")
            {
                window.hideHiddenFilesCount = true;
            }
            break;
        case "pathTextColor":
            // Path/Breadcrumbs font color
            $.cssRule({
                "#crumbs li,#crumbs li a, #crumbs li a:visited": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "pathTextSize":
            // Path/Breadcrumbs text size
            $.cssRule({
                "#crumbs": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "quotaTextColor":
            // Quota text color
            $.cssRule({
                ".quotaText": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "quotaTextSize":
            // Quota text size
            $.cssRule({
                ".quotaText": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "quotaTextStyle":
            // Quota text style
            if (custItem.value.indexOf("bold") >= 0) {
                $.cssRule({
                    ".quotaText": [
                        ["font-weight", custItem.value]
                        ]
                });
            } else {
                $.cssRule({
                    ".quotaText": [
                        ["font-style", custItem.value]
                        ]
                });
            }
            break;
        case "quotaTextAlign":
            // Quota text allignment on screen
            $.cssRule({
                ".quotaText": [
                    ["text-align", custItem.value]
                    ]
            });
            break;
        case "quotaBackgroundColor":
            // Quota text background color
            $.cssRule({
                ".quotaText": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "commentsTextColor":
            // Comments text color
            $.cssRule({
                ".comments": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "commentsTextSize":
            // Comments text size
            $.cssRule({
                ".comments": [
                    ["font-size", custItem.value]
                    ]
            });
            break;
        case "commentsTextStyle":
            // Comments text style
            if (custItem.value.indexOf("bold") >= 0) {
                $.cssRule({
                    ".comments": [
                        ["font-weight", custItem.value]
                        ]
                });
            } else {
                $.cssRule({
                    ".comments": [
                        ["font-style", custItem.value]
                        ]
                });
            }
            break;
        case "commentsTextAlign":
            // Comments text allignment on screen
            $.cssRule({
                ".comments": [
                    ["text-align", custItem.value]
                    ]
            });
            break;
        case "commentsBackgroundColor":
            // Comments background color
            $.cssRule({
                ".comments": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "OPEN_NEW_WINDOW_EXTENSIONS":
            // Extensions to open in new window and void forced download
            var exts = custItem.value.split(",");
            if (exts && exts.length > 0) {
                var trimmed = [];
                $.each(exts, function(index, item){
                    trimmed.push($.trim(this));
                });
                $(document).data("OPEN_NEW_WINDOW_EXTENSIONS", trimmed);
            } else {
                $(document).removeData("OPEN_NEW_WINDOW_EXTENSIONS");
            }
            break;
        case "OPEN_NEW_WINDOW_EXTENSIONS_SAMETAB" :
            if (custItem.value == "true")
            {
                window.OPEN_NEW_WINDOW_EXTENSIONS_SAMETAB = true;
            }
            break;
        case "OPEN_NEW_WINDOW_EXTENSIONS_SAMETAB_MOBILE" :
            if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && custItem.value == "true")
            {
                window.OPEN_NEW_WINDOW_EXTENSIONS_SAMETAB = true;
            }
            break;
        case "promptZipNameWhileDownloading" :
            if (custItem.value == "true")
            {
                window.promptZipNameWhileDownloading = true;
            }
            break;
        case "defaultZipNameWhileDownloading" :
            if (custItem.value)
            {
                window.archiveFileName = custItem.value;
            }
            break;
        case "useSlideshowInsteadOfPreview" :
            if (custItem.value == "true")
            {
                window.useSlideshowInsteadOfPreview = true;
            }
            break;
         case "hideRotateIconsInPreview" :
            if (custItem.value == "true")
            {
                window.hideRotateIconsInPreview = true;
            }
            break;
        case "showDownloadButtonInQuickPreview" :
            if (custItem.value == "true")
            {
                window.showDownloadButtonInQuickPreview = true;
            }
            break;
        case "showAddToBasketButtonInQuickPreview" :
            if (custItem.value == "true")
            {
                window.showAddToBasketButtonInQuickPreview = true;
            }
        case "showQuickShareButtonInQuickPreview" :
            if (custItem.value == "true")
            {
                window.showQuickShareButtonInQuickPreview = true;
            }
            break;
        case "showKeywordButtonInQuickPreview" :
            if (custItem.value == "true")
            {
                window.showKeywordButtonInQuickPreview = true;
            }
            break;
        case "useExtensionForAltMoviewPreview" :
            if (custItem.value)
            {
                window.useExtensionForAltMoviewPreview = $.trim(custItem.value).toLowerCase();
            }
            break;
        case "hidePreviewOptionForFiles" :
            if (custItem.value)
            {
                window.hidePreviewOptionForFiles = $.trim(custItem.value).toLowerCase().split(",") || [];
                for(var ext = 0; ext < window.hidePreviewOptionForFiles.length; ext++){
                    window.hidePreviewOptionForFiles[ext] = $.trim(window.hidePreviewOptionForFiles[ext]);
                }
            }
            break;
        case "OPEN_PREVIEW_EXTENSIONS":
            // Extensions to open preview window and void forced download
            var exts = custItem.value.split(",");
            if (exts && exts.length > 0) {
                var trimmed = [];
                $.each(exts, function(index, item){
                    trimmed.push($.trim(this));
                });
                $(document).data("OPEN_PREVIEW_EXTENSIONS", trimmed);
            } else {
                $(document).removeData("OPEN_PREVIEW_EXTENSIONS");
            }
            break;
        case "OPEN_PREVIEW_EXTENSIONS_MOBILE":
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Extensions to open preview window and void forced download
                var exts = custItem.value.split(",");
                if (exts && exts.length > 0) {
                    var trimmed = [];
                    $.each(exts, function(index, item){
                        trimmed.push($.trim(this));
                    });
                    $(document).data("OPEN_PREVIEW_EXTENSIONS", trimmed);
                } else {
                    $(document).removeData("OPEN_PREVIEW_EXTENSIONS");
                }
            }
            break;
        case "OPEN_SLIDESHOW_EXTENSIONS":
            // Extensions to open SLIDESHOW window and void forced download
            var exts = custItem.value.split(",");
            if (exts && exts.length > 0) {
                var trimmed = [];
                $.each(exts, function(index, item){
                    trimmed.push($.trim(this));
                });
                $(document).data("OPEN_SLIDESHOW_EXTENSIONS", trimmed);
            } else {
                $(document).removeData("OPEN_SLIDESHOW_EXTENSIONS");
            }
            break;
        case "DisableClickToDownload":
            if (custItem.value && custItem.value.length > 0)
                window.disableClickToDownload = custItem.value == "true";
            break;
        case "TooltipExifInfoKeys":
            if (custItem.value && custItem.value.length > 0)
                window.TooltipExifInfoKeys = custItem.value;
            break;
        case "EditeableExifInfoKeys":
            if (custItem.value && custItem.value.length > 0)
                window.EditeableExifInfoKeys = custItem.value;
            break;
        case "genericIconTree":
            //Generic icon to use in tree, no preview icon
            if (custItem.value && custItem.value.length > 0 && custItem.value == "true") {
                $(document).data("genericIconTree", true);
            }
            break;
        case "genericIconThumbnail":
            //Generic icon to use in thumbnails, no preview icon
            if (custItem.value && custItem.value.length > 0 && custItem.value == "true") {
                $(document).data("genericIconThumbnail", true);
            }
            break;
        case "maxAllowedDownloadSize":
            //Maximum size allowed to download
            if (custItem.value && custItem.value.length>0) {
                $(document).data("maxAllowedDownloadSize", custItem.value);
            }
            break;
        case "hideAdvancedUploader":
            //Hide advanced uploader
            if (custItem.value == "true")
            {
                window.hideAdvancedUploader = true;
                $("#browseTypeSelector").hide();
            }
            break;
        case "doNotAdviceAdvancedUploader":
            //Do not show message to prefer advanced uploading for big files
            if (custItem.value == "true")
            {
                window.doNotAdviceAdvancedUploader = true;
            }
            break;
        case "defaultAdvancedUploader":
            //make advanced uploader default
            if (custItem.value == "true")
            {
                setTimeout(function(){
                    $("#browseTypeSelector").removeClass("advanced").addClass("normal").trigger("click").attr("title", locale.fileupload.SwitchToNormalUpload).removeData('thisInfo').unbind('.cluetip');
                    vtip($("#browseTypeSelector"));
                }, 500);
            }
            break;
        case "hideShareMethod":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".shareMethodRow": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    ".shareMethodRow.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideInternalShareMethod":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".shareInternalOption": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".shareInternalOption.override": [
                        ["display", "inline-block !important"]
                        ]
                });
            }
            break;
        case "hideExternalShareMethod":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".shareExternalOption": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".shareExternalOption.override": [
                        ["display", "inline-block !important"]
                        ]
                });
            }
            break;
        case "hideShareType":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareTypeRow": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    "#shareTypeRow.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareSendEmail":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".sendEmail": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".sendEmail.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareExpiresRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareExpirationRow": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    "#shareExpirationRow.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareLoginsRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareMaxUsesRow": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    "#shareMaxUsesRow.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareFromRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailFrom": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailFrom.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareToRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailTo": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailTo.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareCCRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailCc": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailCc.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareBCCRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailBcc": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailBcc.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareReplyToRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailReplyTo": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailReplyTo.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "hideShareSubjectRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailSubject": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailSubject.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "readonlyShareSubject":
            window.shareWindoeEmailSubjectReadonly = custItem.value == "true";
            break;
        case "hideShareBodyRow":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".emailBody": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    ".emailBody.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "readonlyShareBody":
            window.shareWindoeEmailBodyReadonly = custItem.value == "true";
            break;
        case "hideAdvancedOption":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareAdvancedHolder": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    "#shareAdvancedHolder.override": [
                        ["display", "inline-block !important"]
                        ]
                });
            }
            break;
        case "hideAttachThumbnailOption":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareAttachHolder": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    "#shareAttachHolder.override": [
                        ["display", "inline-block !important"]
                        ]
                });
            }
            break;
        case "hideAttachFilesOption":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareAttachFileHolder": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    "#shareAttachFileHolder.override": [
                        ["display", "inline-block !important"]
                        ]
                });
            }
            break;
        case "hideShareComments":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".share_comments": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    ".share_comments.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "showShareKeywords":
            if (custItem.value == "true")
            {
                window.keywordsInShare = true;
                $.cssRule({
                    ".share_keywords": [
                        ["display", "table-row"]
                        ]
                });
                $.cssRule({
                    ".share_keywords.override": [
                        ["display", "table-row !important"]
                        ]
                });
            }
            break;
        case "shareIncludeAllRecursiveItemsList":
            if (custItem.value == "true")
            {
                window.shareIncludeAllRecursiveItemsList = true;
            }
            break;
        case "forceGeneratePasswordShare":
            if (custItem.value == "true")
            {
                window.forceGeneratePasswordShare = true;
            }
            break;
        case "hideFullAccessOption":
            if (custItem.value == "true")
            {
                $.cssRule({
                    "#shareFullAccessHolder": [
                        ["display", "none !important"]
                        ]
                });
                $.cssRule({
                    "#shareFullAccessHolder.override": [
                        ["display", "inline-block !important"]
                        ]
                });
                window.hideFullAccessOption = true;
            }
            break;
        case "hideUserPassGenerationOption":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".shareUserGenerationPanel": [
                        ["display", "none !important"]
                        ]
                });

                $.cssRule({
                    ".shareUserGenerationPanel.override": [
                        ["display", "table-cell !important"]
                        ]
                });
            }
            break;
        /*Upload window customizations*/
        case "upload_UploadBarBorderColor":
            $.cssRule({
                "#fileQueueInfo": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "upload_UploadBarBGColor":
            $.cssRule({
                "#fileQueueInfo": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "upload_UploadBarTextColor":
            $.cssRule({
                "#fileQueueInfo": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "upload_UploadBarDragHoverBGColor":
            $.cssRule({
                ".dropzone.hover, #dropItemsPanel": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "upload_UploadBarDragHoverBorderColor":
            $.cssRule({
                ".dropzone.hover, #dropItemsPanel": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "upload_UploadBarDragHoverTextColor":
            $.cssRule({
                ".dropzone.hover, #dropItemsPanel": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "upload_fileWindowAsDialog":
            if(custItem.value == "true")
            {
                window.fileWindowAsDialog = true;
            }
            break;
        case "upload_oldFileUploader":
            if(custItem.value == "true")
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_oldFileUploaderFF":
            if(custItem.value == "true" && navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_oldFileUploaderSafari":
            if(custItem.value == "true" && navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 &&  navigator.userAgent.indexOf('Android') == -1)
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_oldFileUploaderEdge":
            if(custItem.value == "true" && navigator.appVersion.indexOf("Edge") != -1)
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_oldFileUploaderChrome":
            if(custItem.value == "true" && navigator.userAgent.indexOf('Chrome') > -1)
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_oldFileUploaderIE":
            if(custItem.value == "true" && $("html").hasClass('ie') && $.browser.version <= 10)
            {
                if(!window.useOldUploader){
                    window.useOldUploader = true;
                }
            }
            break;
        case "upload_UploadQueueHeaderBGColor":
            $.cssRule({
                ".fileListHeader, div.uploadFormHeader": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
         case "upload_UploadQueueHeaderBorderColor":
            $.cssRule({
                ".fileListHeader, div.uploadFormHeader": [
                    ["border", "none"]
                    ]
            });
            break;
        case "upload_UploadQueueHeaderTextColor":
            $.cssRule({
                ".fileListHeader, div.uploadFormHeader": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "upload_UploadQueueBGColor":
            $.cssRule({
                "#fileRepo,#uploadInfoForm, .ui-dialog .ui-dialog-buttonpane, #fileUploadModule": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "upload_UploadQueueTextColor":
            $.cssRule({
                "#fileRepo, #uploadInfoForm": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                "#fileRepo a, #fileRepo .ui-widget-content": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "upload_UploadQueueItemBGColor":
            $.cssRule({
                "#fileRepo .template-upload": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "upload_UploadQueueItemTextColor":
            $.cssRule({
                "#fileRepo .template-upload": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                "#fileRepo .template-upload a, #fileRepo .template-upload.ui-widget-content": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "upload_UploadProgressbarBGColor":
            $.cssRule({
                "#fileRepo .template-upload": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "upload_UploadProgressbarTextColor":
            $.cssRule({
                "#globalProgressBar": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                "#globalProgressBar a": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "waveformLoadingProgressbarColor":
            $.cssRule({
                ".columnName .progressBar .ui-progressbar-value": [
                    ["background-image", "none"],
                    ["background", custItem.value]
                ]
            });
            break;
        case "slideshow_BackgroundColor":
            if($(document).data("slideShowOnly"))
            {
                $.cssRule({
                    "#slideshowPage, #slideshowPage #container, #slideshowPage #fileQueueInfo, div.slideshow a.advance-link, div.caption-container, span.image-caption, div.photo-index, div.navigation-container, div.navigation, ul.thumbs, div.pagination span.current, .image-wrapper, .previewPanel": [
                        ["background", custItem.value]
                        ]
                });
            }
            window.slideshowBG = custItem.value;
            break;
        case "slideshow_TextColor":
            if($(document).data("slideShowOnly"))
            {
               $.cssRule({
                    "#slideshowPage, #slideshowPage #container, #slideshowPage #fileQueueInfo, div.slideshow a.advance-link, div.caption-container, span.image-caption, div.photo-index, div.navigation-container, div.navigation, ul.thumbs, div.pagination span.current": [
                        ["color", custItem.value]
                        ]
                });
               if(!window.slideshowAnchorCSSSet)
               {
                    $.cssRule({
                        "#slideshowPage a, #itemControls": [
                            ["color", custItem.value]
                            ]
                    });
                }
            }
            break;
        case "slideshow_AnchorColor":
            if($(document).data("slideShowOnly"))
            {
                $.cssRule({
                    "#slideshowPage a, #itemControls, #SSPage .play,#SSPage .pause,#SSPage .prev,#SSPage .next, #footerss a": [
                        ["color", custItem.value]
                        ]
                });
                window.slideshowAnchorCSSSet = true;
            }
            break;
        case "slideshow_AutoStartInXSeconds":
            if($(document).data("slideShowOnly") || window.forSlideshow)
            {
                var slideshowAutoStartIn = parseInt(custItem.value);
                if(typeof slideshowAutoStartIn != "undefined" && slideshowAutoStartIn!= NaN)
                {
                    if(slideshowAutoStartIn<=0)slideshowAutoStartIn=1;
                    setTimeout(function(){
                        $("#controls").find("a.play").trigger("click");
                    }, slideshowAutoStartIn * 1000);
                }
            }
            break;
        /*Manage share window*/
        case "manageShare_HeaderBGColor":
            $.cssRule({
                ".manageShareWindow .ui-widget-header": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
         case "manageShare_HeaderBorderColor":
            $.cssRule({
                ".manageShareWindow .ui-widget-header": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "manageShare_HeaderTextColor":
            $.cssRule({
                ".manageShareWindow .ui-widget-header": [
                    ["color", custItem.value]
                    ]
            });
            break;
        /*Basket items*/
        case "basket_HeaderBGColor":
            $.cssRule({
                ".downloadBasket .ui-widget-header": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
         case "basket_HeaderBorderColor":
            $.cssRule({
                ".downloadBasket .ui-widget-header": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "basket_HeaderTextColor":
            $.cssRule({
                ".downloadBasket .ui-widget-header": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "basket_BGColor":
            $.cssRule({
                ".downloadBasket,.downloadBasket #filesBasket, .downloadBasket .ui-dialog .ui-dialog-buttonpane": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "basket_TextColor":
            $.cssRule({
                ".downloadBasket, #filesBasket": [
                    ["color", custItem.value]
                    ]
            });
            $.cssRule({
                ".downloadBasket a, .downloadBasket .ui-widget-content": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "basket_TVHeaderBGColor":
            $.cssRule({
                ".downloadBasket thead td": [
                    ["background", custItem.value]
                    ]
            });
            break;
        case "basket_TVHeaderTextColor":
            $.cssRule({
                ".downloadBasket thead td": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "basket_TVBGColor":
            $.cssRule({
                ".downloadBasket #basketFilesContainer tbody tr": [
                    ["background", custItem.value],
                    ["background-color", custItem.value]
                    ]
            });
            break;
         case "basket_TVTextColor":
            $.cssRule({
                ".downloadBasket #basketFilesContainer tbody td, .downloadBasket #basketFilesContainer tbody td a, a.imgLink": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "basket_TVHoverBGColor":
            $.cssRule({
                ".downloadBasket #basketFilesContainer .rowHover": [
                    ["background", custItem.value + " !important"],
                    ["background-color", custItem.value + " !important"]
                    ]
            });
            break;
        case "basket_TVHoverTextColor":
            $.cssRule({
                ".downloadBasket #basketFilesContainer .rowHover td, .downloadBasket #basketFilesContainer .rowHover td a, a.imgLink": [
                    ["color", custItem.value + " !important"]
                    ]
            });
            break;
        case "basket_HideCheckbox":
            if(custItem.value == "true")
            {
                $.cssRule({
                    ".downloadBasket #basketFilesContainer .thSelect, .downloadBasket #basketFilesContainer .columnSelect": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_DefaultView":
            if(custItem.value == "treeview")
            {
                $("#viewSelectorPanelBasket").find("a.treeViewLink").trigger("click");
            }
            else
            {
                $("#viewSelectorPanelBasket").find("a.thumbnailViewLink").trigger("click");
            }
            break;
        case "hideViewSelector":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#viewSelectorPanel": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "listDefaultView":
            if(!window.customListDefaultView)
            {
                if(custItem.value == "treeview")
                {
                    window.customListDefaultView = "tree";
                    changeView("tree");
                    $(".treeViewLink", "#viewSelectorPanel").animate({
                        opacity: 0.3
                    }, 500);
                    $(".thumbnailViewLink", "#viewSelectorPanel").animate({
                        opacity: 1
                    }, 500);
                }
                else
                {
                    window.customListDefaultView = "thumbs";
                     $(".thumbnailViewLink", "#viewSelectorPanel").animate({
                        opacity: 0.3
                    }, 500);

                    $(".treeViewLink", "#viewSelectorPanel").animate({
                        opacity: 1
                    }, 500);
                    changeView("Thumbnail");
                }
            }
            break;
        case "basket_NoViewChange":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#viewSelectorPanelBasket": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_Maximized":
            if(custItem.value == "true")
            {
                window.basketKeepMaximized = true;
            }
            break;
        case "basket_HideFilter":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#filterPanelBasket": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_HideDownload":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#BasketDownloadLinkText": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_HideShare":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#BasketShareItemsLinkText": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_HideDownloadAdvanced":
            if(custItem.value == "true")
            {
                $.cssRule({
                    "#BasketDownloadAdvancedLinkText": [
                        ["display", "none !important"]
                        ]
                });
            }
            break;
        case "basket_NoContextMenu":
            if(custItem.value == "true")
            {
                window.disableContextMenuOnBasket = true;
            }
            break;
        case "basket_ThumbnailsBorderColor":
            $.cssRule({
                ".fileBoxBasket .imgBox": [
                    ["border-color", custItem.value],
                    ["-moz-box-shadow", "none"],
                    ["-webkit-box-shadow", "none"],
                    ["box-shadow", "none"]
                ]
            });
            break;
        case "basket_ThumbnailsHoverBorderColor":
            $.cssRule({
                ".fileBoxBasket:hover": [
                    ["border-color", custItem.value]
                ]
            });
            break;
        case "thumbnailsImageBoxBorderColor":
            $.cssRule({
                ".fileBox .imgBox": [
                    ["border-color", custItem.value],
                    ["-moz-box-shadow", "none"],
                    ["-webkit-box-shadow", "none"],
                    ["box-shadow", "none"]
                ]
            });
            break;
        case "thumbnailsBorderColor":
            $.cssRule({
                ".fileBox": [
                    ["border-color", custItem.value],
                    ["-moz-box-shadow", "none"],
                    ["-webkit-box-shadow", "none"],
                    ["box-shadow", "none"]
                ]
            });
            break;
        case "thumbnailsBGColor":
            $.cssRule({
                ".fileBox": [
                    ["background-color", custItem.value]
                ]
            });
            break;
        case "thumbnailsTextColor":
            $.cssRule({
                ".fileBox a": [
                    ["color", custItem.value]
                ]
            });
            break;
        case "thumbnailsSelectedTextColor":
            $.cssRule({
                ".fileBox.fileBoxSelected, .fileBox.fileBoxSelected a": [
                    ["color", custItem.value]
                ]
            });
            break;
        case "thumbnailsSelectedBGColor":
            $.cssRule({
                ".fileBox.fileBoxSelected, .fileBox.fileBoxSelected div": [
                    ["background-color", custItem.value + " !important"]
                ]
            });
            break;
        case "thumbnailsSelectedBorderColor":
            $.cssRule({
                ".fileBox.fileBoxSelected": [
                    ["border-color", custItem.value]
                ]
            });
            break;
        case "thumbnailsHoverBGColor":
            $.cssRule({
                ".fileBox:hover": [
                    ["background-color", custItem.value + " !important"]
                ]
            });
            break;
        case "thumbnailsHoverTextColor":
            $.cssRule({
                ".fileBox:hover a": [
                    ["color", custItem.value]
                ]
            });
            break;
        case "thumbnailsHoverBorderColor":
            $.cssRule({
                ".fileBox:hover": [
                    ["border-color", custItem.value]
                ]
            });
            break;
        case "UPLOAD_THREADS":
                window.UPLOAD_THREADS = parseInt(custItem.value);
                if(!window.UPLOAD_THREADS || window.UPLOAD_THREADS == NaN)
                    window.UPLOAD_THREADS = 1;
            break;
        case "DOWNLOAD_THREADS":
                window.DOWNLOAD_THREADS = parseInt(custItem.value);
                if(!window.DOWNLOAD_THREADS || window.DOWNLOAD_THREADS == NaN)
                    window.DOWNLOAD_THREADS = 1;
            break;
        case "pagination_Color":
            $.cssRule({
                ".pagination a": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "pagination_BGColor":
            $.cssRule({
                ".pagination a": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "pagination_BorderColor":
            $.cssRule({
                ".pagination a": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "pagination_ActiveColor":
            $.cssRule({
                ".pagination .current": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "pagination_ActiveBGColor":
            $.cssRule({
                ".pagination .current": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "pagination_ActiveBorderColor":
            $.cssRule({
                ".pagination .current": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
          case "pagination_DisabledColor":
            $.cssRule({
                ".pagination .prev.disable, .pagination .next.disable": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "pagination_DisabledBGColor":
            $.cssRule({
                ".pagination .prev.disable, .pagination .next.disable": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "pagination_DisabledBorderColor":
            $.cssRule({
                ".pagination .prev.disable, .pagination .next.disable": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "pagination_HoverColor":
            $.cssRule({
                ".pagination a:hover, .pagination span:hover": [
                    ["color", custItem.value]
                    ]
            });
            break;
        case "pagination_HoverBGColor":
            $.cssRule({
                ".pagination a:hover, .pagination span:hover": [
                    ["background-color", custItem.value]
                    ]
            });
            break;
        case "pagination_HoverBorderColor":
            $.cssRule({
                ".pagination a:hover, .pagination span:hover": [
                    ["border-color", custItem.value]
                    ]
            });
            break;
        case "maskedEmptyFolder":
            if(custItem.value == "true")
            {
                window.maskedEmptyFolder = true;
            }
            break;
        case "autoNavigateToFolderOnCreation":
            if(custItem.value == "true")
            {
                $("#chkNavigateAfterMkdir").attr("checked", "checked");
            }
            break;
        case "cutCopyOnlyFiles":
            if(custItem.value == "true")
            {
                window.cutCopyOnlyFiles = true;
            }
            break;
        case "uploadFormAskAgainChecked":
            window.uploadFormAskAgainChecked = custItem.value == "true";
            break;
        case "uploadFormAskAgainHideAndChecked":
            window.uploadFormAskAgainHideAndChecked = custItem.value == "true";
            break;
        case "uploadFormAskAgainHideAndUnchecked":
            window.uploadFormAskAgainHideAndUnchecked = custItem.value == "true";
            break;
        case "dontuseHTML5Player":
            window.dontuseHTML5Player = custItem.value == "true";
            break;
        case "dontuseHTML5PlayerMobile":
            if(custItem.value == "true"){
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    window.dontuseHTML5Player = true;
                }
            }
            break;
        case "disableRightClickOnHTML5Player":
            window.disableRightClickOnHTML5Player = custItem.value == "true";
            break;
        case "autoStartMediaPlaybackInPreview":
            window.autoStartMediaPlaybackInPreview = custItem.value == "true";
            break;
        case "autoPreviewMediaOnLoad":
            window.autoPreviewMediaOnLoad = custItem.value == "true";
            break;
        case "searchOnRoot":
            window.noSearchOnRoot = custItem.value == "false";
            break;
        case "searchDefaultKeywords":
            searchDiv.find("#keyword").val(custItem.value);
            break;
        case "searchDefaultExactMatch":
            if(custItem.value == "true")
                searchDiv.find("#exact").attr("checked", "checked");
            else
                searchDiv.find("#exact").removeAttr("checked");
            break;
        case "searchDefaultSearchOnlyKeywords":
            if(custItem.value == "true")
                searchDiv.find("#keywords_only").attr("checked", "checked");
            else
                searchDiv.find("#keywords_only").removeAttr("checked");
            break;
        case "searchDefaultModifiedBefore":
            var val = custItem.value;
            if(val)
            {
                searchDiv.find("#date2").attr("checked", "checked");
                searchDiv.find("#date2_action").val("before");
                searchDiv.find("#date2_value").val(val);
            }
            break;
        case "searchDefaultModifiedAfter":
            var val = custItem.value;
            if(val)
            {
                searchDiv.find("#date1").attr("checked", "checked");
                searchDiv.find("#date1_action").val("before");
                searchDiv.find("#date1_value").val(val);
            }
            break;
        case "searchDefaultSize":
            var val = custItem.value;
            if(val)
            {
                if(val.indexOf(">")>=0)
                {
                    searchDiv.find("#size1").attr("checked", "checked");
                    searchDiv.find("#size1_action").val("bigger than");
                    searchDiv.find("#size1_value").val(val.replace(">",""));
                }
                else if(val.indexOf("<")>=0)
                {
                    searchDiv.find("#size1").attr("checked", "checked");
                    searchDiv.find("#size1_action").val("smaller than");
                    searchDiv.find("#size1_value").val(val.replace("<",""));
                }
            }
            break;
        case "searchDefaultType":
            var val = custItem.value;
            if(val)
            {
                searchDiv.find("#type1").attr("checked", "checked");
                if(val=="file")
                    searchDiv.find("#type1_action").val("file");
                else if(val=="dir")
                    searchDiv.find("#type1_action").val("folder");
            }
            break;
        case "uploadBarHeaderText":
            $("#uploadBarInformationText").text(custItem.value);
            break;
        case "showLanguageSelection":
            if(custItem.value == "true")
            {
                $("#languageSelector").show();
            }
            break;
        case "showLanguageSelectionPos":
            if(custItem.value == "left")
            {
                $("#languageSelector").addClass('left');
            }
            break;
        case "showOnlyTheseLanguages":
            if(custItem.value)
            {
                window.showOnlyTheseLanguages = custItem.value;
            }
            break;
        case "saveLanguageSelectionInCookie":
            if(custItem.value == "false")
            {
                window.saveLanguageSelectionInCookie = false;
            }
            else if(custItem.value == "true")
            {
                window.saveLanguageSelectionInCookie = true;
            }
            break;
        case "defaultWILanguage":
            if(custItem.value && custItem.key == "defaultWILanguage")
            {
                window.defaultWILanguage = custItem.value;
                setTimeout(function(){
                    if(!window.isInitComplete)
                    {
                        loadAndApplyLanguageLocalizations(window.defaultWILanguage);
                    }
                }, 100);
            }
            break;
        case "detectBrowserLanguage":
            if(custItem.value == "true")
            {
                window.detectBrowserLanguage = true;
            }
            break;
        case "doNotDisplayDirectoryInformation":
            window.doNotDisplayDirectoryInformation = custItem.value == "true";
            break;
        case "doNotShowListFileSize":
            $.cssRule({
                "#dirSizeInfo": [
                    ["display", "none !important"]
                ]
            });
            break;
        case "dontShowButtonsInMainMenu":
            window.dontShowButtonsInMainMenu = custItem.value == "true";
            break;
        case "applyFilterToTreeLevels":
            window.applyFilterToTreeLevels = custItem.value == "true";
            break;
        case "showExpandCollapseAllForTreeView":
            if(custItem.value == "true" && !window.expandCollapseAllEventReady)
            {
                window.expandCollapseAllEventReady = true;
                if(isCrush7Ready())
                {
                    $("a.treeViewExpandAllLink,a.treeViewCollapseAllLink").unbind().click(function(event) {
                        if (currentView() != "Thumbnail") {
                            expandAllItems(false, $(this).is(".treeViewExpandAllLink"));
                        }
                        return false;
                    });
                    $(".treeviewExpandOptions").show();
                    if (currentView() == "Thumbnail") {
                        $(".treeviewExpandOptions").hide();
                    }
                    window.showExpandAllButtons = true;
                }
                else
                {
                    $(".treeviewExpandOptions").hide();
                }
            }
        case "noRedirectToLoginAfterAutoLogout":
            if (custItem.value == "true")
            {
                window.noRedirectToLoginAfterAutoLogout = true;
            }
            break;
        case "logoutOnPageClose":
            if (custItem.value == "true")
            {
                window.logoutOnPageClose = true;
            }
            break;
        case "HideUserOptionHideDotItems":
            if(custItem.value && custItem.value == "true")
                $("#userOptionHideDotItems").hide();
            break;
        case "HideUserOptionHideCheckBoxColumn":
            if(custItem.value && custItem.value == "true")
                $("#userOptionHideCheckBoxColumn").hide();
            break;
        case "HideUserOptionHideFilterSection":
            if(custItem.value && custItem.value == "true")
                $("#userOptionHideFilterSection").hide();
            break;
        case "HideUserOptionAutoStartUpload":
            if(custItem.value && custItem.value == "true")
                $("#userOptionAutoStartUpload").hide();
            break;
        case "HideUserOptionAutoLoadJavaApplet":
            if(custItem.value && custItem.value == "true")
                $("#userOptionAutoLoadJavaApplet").hide();
            break;
        case "HideUserOptionJavaCompression":
            if(custItem.value && custItem.value == "true")
                $("#userOptionJavaCompression").hide();
            break;
        case "HideUserOptionChangePassword":
            if(custItem.value && custItem.value == "true")
                $(".changePasswordPanel").hide();
            break;
        case "HideUserOptionChangePhone":
            if(custItem.value && custItem.value == "true")
                $(".changePhonePanel").hide();
            break;
        case "HideUserOptionGeneratePassword":
            if(custItem.value && custItem.value == "true")
                $("#btnGeneratePassword", "#userOptionChangePassword").hide();
            break;
        case "useroptions_only_twofactor_google_enrollment":
            if(custItem.value && custItem.value == "true")
            {
                $("#userOptions").find("li:not(.twofactorAuthPanel)").hide();
                $("#userOptions").find("li.twofactorAuthPanel").show();
                $("#userOptions").find(".tabs").find("li.twofactorAuthPanel").find("a").click();
                window.userOptionsOnlyGoogle = true;
            }
            break;
        case "disableDirectoryItemCount":
            if(custItem.value && custItem.value == "true")
                window.disableDirectoryItemCount = true;
            break;
        case "hideDirectoryInfo":
            if(custItem.value && custItem.value == "true"){
                window.hideDirectoryInfo = true;
                $.cssRule({
                    "span#dirInfoText, div#itemCount": [
                        ["display", "none !important;"]
                    ]
                });
            }
            break;
        /* added by carlos */
        case "inlinePlayer_graphcolor":
            if(custItem.value)
                inlinePlayer_graphcolor = custItem.value;
            break;
        case "inlinePlayer_progresscolor":
            if(custItem.value)
                inlinePlayer_progresscolor = custItem.value;
            break;
        case "inlinePlayer_visible":
            if(custItem.value && (custItem.value == "true" || custItem.value == "false"))
                inlinePlayer_enable = custItem.value;
            break;
        case "inlinePlayer_graphvisible":
            if(custItem.value)
                inlinePlayer_graphvisible = custItem.value;
            break;
        case "inlinePlayer_playqueue":
            if(custItem.value == "true")
                inlinePlayer_playqueue = true;
            break;
        case "AdvancedUploadDownloadOptionDefaultMode":
            if(custItem.value)
            {
                $("#uploadOptionsDialog_ow").val(custItem.value);
            }
            break;
        case "AdvancedUploadDownloadOptionHideCompression":
            if(custItem.value && custItem.value == "true")
            {
                $("#uploadOptionsDialog").find(".compressionOptions").hide();
            }
            break;
        case "AdvancedUploadDownloadOptionCompression":
            if(custItem.value)
            {
                if(custItem.value == "true")
                    $("#uploadOptionsDialog_co").val("false");
                else
                    $("#uploadOptionsDialog_co").val("true");
            }
            break;
        case "AdvancedUploadDownloadOptionConfirmDialogDefaultAction":
            if(custItem.value)
            {
                $("#ask_response, #ask_responseDownload").val(custItem.value);
            }
            break;
        case "LogoutCustomRedirectPath":
            if (custItem.value)
            {
                window.LogoutCustomRedirectPath = custItem.value;
            }
            break;
        case "runBatchCompletedCommandAfterUploadQueueFinishes":
            if(custItem.value && custItem.value == "true")
                window.runBatchCompletedCommandAfterUploadQueueFinishes = true;
            break;
        case "customFileValidationMethod":
            if(custItem.value)
                window.customFileValidationMethod = window[custItem.value];
            break;
        case "customShareLinkURL":
            if(custItem.value)
                window.customShareLinkURL = custItem.value;
            break;
        case "disableUIDragDrop":
            if(custItem.value == "true")
                window.disableUIItemDragDrop = true;
            break;
        case "showFullKeywords":
            if(custItem.value && custItem.value == "true"){
                window.donotConcatKeywords = true;
                $("body").addClass('fullKeywords');
            }
            break;
        case "contextmeuBGColor":
            $.cssRule({
                ".contextMenu": [
                    ["background-color", custItem.value]
                ]
            });
            break;
        case "contextmeuColor":
            $.cssRule({
                ".contextMenu": [
                    ["color", custItem.value]
                ]
            });
            break;
        case "contextmeuHoverBGColor":
            $.cssRule({
                ".contextMenu LI.hover A": [
                    ["background-color", custItem.value]
                ]
            });
            break;
        case "contextmeuHoverColor":
            $.cssRule({
                ".contextMenu LI.hover A": [
                    ["color", custItem.value]
                ]
            });
            break;
        case "maxListItemsBeforeShowingWarning":
            if(custItem.value)
                window.maxListItemsBeforeShowingWarning = parseInt(custItem.value);
            break;
        case "maxListItemsWarningMessage":
            if(custItem.value)
                window.maxListItemsWarningMessage = custItem.value;
            break;
        case "maxUploadItemsBeforeShowingWarning":
            if(custItem.value)
                window.maxUploadItemsBeforeShowingWarning = parseInt(custItem.value);
            break;
        case "maxUploadItemsWarningMessage":
            if(custItem.value)
                window.maxUploadItemsWarningMessage = custItem.value;
            break;
         case "uploadWindowShowNameInsteadOfFullPath" :
            if (custItem.value == "true")
            {
                window.uploadWindowShowNameInsteadOfFullPath = true;
            }
            break;
        case "clickOnParentOfFileName" :
            if (custItem.value == "true")
            {
                window.clickOnParentOfFileName = true;
            }
            break;
        case "showReadOnlyBanner" :
            if (custItem.value == "true")
            {
                window.showReadOnlyBanner = true;
            }
            break;
         case "homeCustomTextFormat":
            if(custItem.value)
                window.homeCustomTextFormat = custItem.value;
            break;
        case "directCopyLinkWebInterfaceFriendly":
            if(custItem.value == "true")
                window.directCopyLinkWebInterfaceFriendly = true;
            break;
        case "maxAllowedFileSizeForInlineEdit":
            window.maxAllowedFileSizeForInlineEdit = parseInt(custItem.value);
            break;
        case "allowedFileExtensionsForInlineEdit":
            window.allowedFileExtensionsForInlineEdit = custItem.value;
            break;
        case "UserOption2fa":
            if (custItem.value == "true")
            {
                $.cssRule({
                    ".twofactorAuthPanel": [
                        ["display", "block"]
                    ]
                });
            }
            break;
        case "enableUserInformationPopup":
            if(custItem.value == "true")
            {
                if(!window.userAudit.v){
                    $.getScript("/WebInterface/jQuery/js/userAudit.js").done(function(){
                        window.userAudit.init();
                    });
                }
            }
            break;
        case "autoRenameFilesWhileUploading" :
            if (custItem.value == "true")
            {
                window.autoRenameFilesWhileUploading = true;
            }
            break;
        case "autoRenameFilesWhileUploadingCrushDrop" :
            if (custItem.value == "true")
            {
                window.autoRenameFilesWhileUploadingCrushDrop = true;
            }
            break;
        case "groupShareFiles" :
            if (custItem.value == "true")
            {
                window.groupShareFiles = true;
            }
            break;
        case "groupShareFilesCrushDrop" :
            if (custItem.value == "true")
            {
                window.groupShareFilesCrushDrop = true;
            }
            break;
        case "dontClosePopupOnClip" :
            if (custItem.value == "true")
            {
                window.dontClosePopupOnClip = true;
            }
            break;
        case "HTML5TapOnFullscreen" :
            if (custItem.value == "true")
            {
                window.HTML5TapOnFullscreen = true;
            }
            break;
        case "noSourcesInHTML5Video" :
            if (custItem.value == "true")
            {
                window.noSourcesInHTML5Video = true;
            }
            break;
        case "commonFormPerBatch" :
            if (custItem.value == "true")
            {
                window.commonFormPerBatch = true;
            }
            break;
        case "waitFormSubmitForDownload" :
            if (custItem.value == "true")
            {
                window.waitFormSubmitForDownload = true;
            }
            break;
        case "twofactor_force_google_enrollment":
            if (custItem.value == "true")
            {
                if($(document).data("twofactor_secret_confirmed") != "true"){
                    window.forceGoogleEnrollment = true;
                    window.performAction('userOptions');
                }
            }
            break;
        case "hideQuotaForSubdirs" :
            if (custItem.value == "true")
            {
                window.hideQuotaForSubdirs = true;
            }
            break;
        case "auto_next_audio" :
            if (custItem.value == "true")
            {
                window.auto_next_audio = true;
            }
            break;
        case "EMAILBODY":
            var val = custItem.value.replace(/\\r/g, '\r');
            val = val.replace(/\\n/g, '\n');
            var emailVal = val;
            var curVal = crushFTPTools.decodeXML(emailVal);
            var nameBodySeparator = "``````";
            var templateSeparator = "^^^^^^";
            var _templates = curVal || "";
            var templates = _templates.split(templateSeparator);
            var curTemplates = [];
            if(templates.length>1){
                for (var k = 0; k < templates.length; k++) {
                    var curTemplate = templates[k];
                    var splits = curTemplate.split(nameBodySeparator);
                    var name, body, isDefault = false;
                    if(splits.length>1){
                        name = splits[0];
                        if(name.indexOf("_default")>0){
                            isDefault = true;
                            name = name.replace("_default", "");
                        }
                        body = splits[1];
                    }
                    else{
                        name = 'Default';
                        body = curTemplate;
                    }
                    curTemplates.push({
                        name: name,
                        body: body,
                        isDefault: isDefault
                    });
                }
            }
            else{
                var splits = _templates.split(nameBodySeparator);
                var name, body, isDefault = false;
                if(splits.length>1){
                    name = splits[0];
                    if(name.indexOf("_default")>0){
                        isDefault = true;
                        name = name.replace("_default", "");
                    }
                    body = splits[1];
                }
                else{
                    body = splits[0];
                }
                curTemplates.push({
                    name: 'Default',
                    body: body,
                    isDefault: true
                });
            }
            if(curTemplates.length>1)
            {
                window.customShareTemplates = curTemplates;
            }
            break;
        default:
            break;
        }
    }
    var destinationPath = hashListener.getHash().toString().replace("#", "");
    if (destinationPath.indexOf("/IMPULSEUpload/") > 0) //Upload only
    {
        makeItUploadOnly();
    }

    if(!window.isInitComplete)
    {
        setTimeout(function(){
            if(!window.isInitComplete)
            {
                loadAndApplyLanguageLocalizations(false, true);
            }
            window.isInitComplete = true;
        },100);
    }
    $.crushFtpCustomization.init();
}