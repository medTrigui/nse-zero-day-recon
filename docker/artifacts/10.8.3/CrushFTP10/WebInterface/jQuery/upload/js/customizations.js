function applyCustomizations(customizations) {
    var styles = {};
    var styleToAppend = "";
    for (var i = 0; i < customizations.length; i++) //Loop through customizations
    {
        var custItem = customizations[i];
        switch (custItem.key) {
            case "disableShareForUploadedItem":
                if(custItem.value == "true"){
                    styleToAppend += "#queue-top-buttons button#shareUploaded {display:none !important;}";
                }
                break;
            /*Upload window customizations*/
            case "upload_UploadBarDragHoverBGColor":
                styles.hoverBGcolor = custItem.value;
                break;
            case "upload_UploadBarDragHoverBorderColor":
                styles.hoverBorderColor = custItem.value;
                break;
            case "upload_UploadBarDragHoverTextColor":
                styles.hoverColor = custItem.value;
                break;
            case "upload_UploadQueueHeaderBGColor":
                styles.buttonsBGcolor = custItem.value;
                break;
            case "upload_UploadQueueHeaderBorderColor":
                styles.buttonsBorderColor = custItem.value;
                break;
            case "upload_UploadQueueHeaderTextColor":
                styles.buttonsColor = custItem.value;
                break;
            case "upload_UploadQueueBGColor":
                styles.listBGcolor = custItem.value;
                break;
            case "upload_UploadQueueTextColor":
                styles.listColor = custItem.value;
                break;
            case "upload_UploadQueueMenuTextColor":
                styles.listMenuTextColor = custItem.value;
                break;
            case "upload_UploadQueueMenuHoverTextColor":
                styles.listMenuHoverTextColor = custItem.value;
                break;
            case "upload_UploadQueueMenuBGColor":
                styles.listMenuBgColor = custItem.value;
                break;
            case "upload_UploadQueueMenuHoverBGColor":
                styles.listMenuHoverBGColor = custItem.value;
                break;
            case "upload_UploadQueueItemBGColor":
                styles.itemBGcolor = custItem.value;
                break;
            case "upload_UploadQueueItemTextColor":
                styles.itemColor = custItem.value;
                break;
            case "upload_UploadProgressbarBGColor":
                styles.progressBGcolor = custItem.value;
                break;
            case "upload_UploadProgressbarTextColor":
                styles.progressColor = custItem.value;
                break;
            case "upload_IconColor":
                styles.iconColor = custItem.value;
                break;
            case "upload_HeaderIconColor":
                styles.headerIconColor = custItem.value;
                break;
            case "upload_SeparatorColor":
                styles.separatorColor = custItem.value;
                break;
            case "hideStartButtonOnIndividualUploadItem":
                if (custItem.value == "true")
                {
                    styleToAppend += "#queue .queue-item-row .buttons .btn.upload{display: none !important;}";
                }
                break;
            case "maxUploadItemsBeforeShowingWarning":
                if(custItem.value)
                    window.maxUploadItemsBeforeShowingWarning = parseInt(custItem.value);
                break;
            case "maxUploadItemsWarningMessage":
                if(custItem.value)
                    window.maxUploadItemsWarningMessage = custItem.value;
                break;
            case "upload_UploadPanelDefaultWidth":
                if(custItem.value){
                    if(parseInt(custItem.value) > 600)
                        window.crushUpload.resizeList(parseInt(custItem.value), false, true);
                }
                break;
            default :
                break;
        }
    }
    if(styles.hoverBGcolor || styles.hoverBorderColor || styles.hoverColor)
    {
        styles.hoverBGcolor = styles.hoverBGcolor || "inherit";
        styles.hoverBorderColor = styles.hoverBorderColor || "inherit";
        styles.hoverColor = styles.hoverColor || "inherit";
        styleToAppend += '#dropzone, #dropzone.active{background : '+styles.hoverBGcolor+';color : '+styles.hoverColor+';border-color: '+styles.hoverBorderColor+';}';
    }
    if(styles.iconColor){
        styleToAppend += '#fileselector #queue i{color : '+styles.iconColor+' !important;}#fileselector i.failure-mark {color: red !important;}#fileselector i.success-mark {color: green !important;}';
    }
    if(styles.headerIconColor){
        styleToAppend += '#fileselector #queue-top-buttons i{color : '+styles.headerIconColor+' !important;}';
    }
    if(styles.separatorColor)
    {
        styleToAppend += '#fileselector hr{color:'+styles.separatorColor+';border-color:'+styles.separatorColor+';background:'+styles.separatorColor+';}';
    }
    if(styles.buttonsBGcolor || styles.buttonsColor){
        styles.buttonsBGcolor = styles.buttonsBGcolor || "inherit";
        styles.buttonsColor = styles.buttonsColor || "inherit";
        styleToAppend += '#fileselector #queue-top-buttons{background: '+styles.buttonsBGcolor+';display: block;width: 100%;height: 35px;position: absolute;top: 0px;left: 1px;}#fileselector #queue-top-buttons button{padding-left: 9px;padding-right: 9px;background: '+styles.buttonsBGcolor+';color: '+styles.buttonsColor+';border: none;}#fileselector #queue-top-buttons .input-group-btn{position: relative !important;margin-left: 2px;top:4px;}#fileselector .dropdown-menu{background-color: '+styles.buttonsBGcolor+';border: none;}#fileselector div.remove-top-dropdown{z-index: 5;}#fileselector .scroll-with-activity{background-color: '+styles.buttonsBGcolor+';color:'+styles.buttonsColor+';}';
    }
    if(styles.listBGcolor || styles.listColor){
        styles.listBGcolor = styles.listBGcolor || "inherit";
        styles.listColor = styles.listColor || "inherit";
        styleToAppend += '#fileUploadModule, #fileselector{background : '+styles.listBGcolor+';color : '+styles.listColor+';margin: 0px -1px;}#fileUploadModule, #fileselector{background : '+styles.listBGcolor+';color : '+styles.listColor+';margin: 0px -1px;}';
    }

    if(styles.listMenuTextColor || styles.listMenuHoverTextColor){
        styles.listMenuTextColor = styles.listMenuTextColor || "inherit";
        styles.listMenuHoverTextColor = styles.listMenuHoverTextColor || "inherit";
        styleToAppend += '#fileListPanel ul.dropdown-menu li a{color : '+styles.listMenuTextColor+'} #fileListPanel ul.dropdown-menu li a:hover{color : '+styles.listMenuHoverTextColor+'}';
    }

    if(styles.listMenuBgColor || styles.listMenuHoverBGColor){
        styles.listMenuBgColor = styles.listMenuBgColor || "inherit";
        styles.listMenuHoverBGColor = styles.listMenuHoverBGColor || "inherit";
        styleToAppend += '#fileListPanel ul.dropdown-menu li a{background : '+styles.listMenuBgColor+'} #fileListPanel ul.dropdown-menu li a:hover{background : '+styles.listMenuHoverBGColor+'}';
    }

    if(styles.itemBGcolor || styles.itemColor){
        styles.itemBGcolor = styles.itemBGcolor || "inherit";
        styles.itemColor = styles.itemColor || "inherit";
        styleToAppend += '#fileselector .queue-item-row{background : '+styles.itemBGcolor+';color : '+styles.itemColor+';}#fileselector .queue-item-row:hover{background: '+styles.itemBGcolor+';opacity: 0.9;}#fileselector .queue-item-row .closing, #fileselector .queue-item-row .processing, #fileselector .global-progressbar .processing{background: '+styles.itemBGcolor+';opacity: 0.7;}';
    }
    if(styles.progressBGcolor || styles.progressColor){
        styles.progressBGcolor = styles.progressBGcolor || "inherit";
        styles.progressColor = styles.progressColor || "inherit";
        styleToAppend += '#fileselector .progress-bar-warning{background-color: '+styles.progressBGcolor+';color: '+styles.progressColor+';}#fileselector .global-progressbar{border:none;border-top: 1px solid #eee;box-shadow: none;background: inherit;}';
    }
    if(styleToAppend){
        $("<style>"+styleToAppend+"</style>").appendTo("head");
    }
}