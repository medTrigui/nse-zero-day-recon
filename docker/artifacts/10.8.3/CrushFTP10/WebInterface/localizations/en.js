//English
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP WebInterface :: Login";
localizations.BadLoginInfoText = "Your username, or password may be incorrect, or the account may have expired.";
localizations.ServerErrorInfoText = "The server is unavailable or your IP has been banned.";
localizations.PasswordsDoNotMatchAlertText = "New passwords don't match.";
localizations.LoginAgainTitleText = "Please login again";
localizations.LoginWithNewPassText = "Login with new password";
localizations.AuthenticatingMsgText = "Authenticating...";
localizations.LoginSuccessText = "Success";
localizations.LoadingWebInterfaceText = "Loading WebInterface...";
localizations.LoginWarningText = "Warning";
localizations.MultipleBadLoginsAlertDescText = "Too many failed attempts and your IP will be banned.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Click <a style='color:white;' href='/WebInterface/jQuery/reset.html'>here</a> to reset password.</div>";
localizations.LoginFailedText = "Login Failed";
localizations.ChangePasswordGrowlTitleText = "Change Password";
localizations.UserNameText = "Username";
localizations.ResetUserNameText = "Username";
localizations.PasswordText = "Password";
localizations.RememberMeText = "Remember Me";
localizations.LoginButtonText = "Login";
localizations.ForgotPasswordLinkText = "I forgot my password";
localizations.ResetPasswordButtonText = "Reset Password";
localizations.BackToLoginButtonText = "Back to Login";
localizations.ValidUserNameAlertText = "Please enter valid user name";
localizations.RequestPasswordHeaderText = "Request Password";
localizations.ChangePasswordHeaderText = "Change your password";
localizations.ChangePasswordNoteText = "You must change your password to continue";
localizations.CurrentPasswordText = "Current Password : ";
localizations.NewPasswordText = "New Password : ";
localizations.ConfirmPasswordText = "Confirm Password : ";
localizations.CancelButtonText = "Cancel";
localizations.ChanngePasswordButtonText = "Change Password";
localizations.GeneratePasswordButtonText = "Generate password";
localizations.GeneratePasswordUseButtonText = "Use this";
localizations.GeneratePasswordCancelButtonText = "Cancel";
localizations.OldBrowserNoticeHTMLAsText = 'Your browser is out of date, it was released almost a decade ago! As a result it is very slow, full of bugs, and this WebInterface may or may not even work with IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Proceed Anyway Cautiously</button> or get a better browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "This server is not configured to send email password reminders.";
localizations.RecaptchaValidationRequiredText = "Please validate captcha to login";
localizations.UserOptionsWindowUpdateButtonText = "Save";
localizations.InvalidPasswordCharacterMsgText = "Password has invalid characters, please remove it from password. Invalid characters ";
localizations.CookiePolicyNotificationText = "We use cookies on this site to facilitate your ability to login for technical reasons.";
localizations.CookiePolicyLinkText = "Cookie Policy";
localizations.CookiePolicyAcceptButtonText = "Accept";
localizations.CookiePolicyDismissButtonText = "Dismiss";
/*Reset pass page specific*/
localizations.resetPageUserName = "Username or Email : ";
localizations.resetPagePassword = "Password : ";
localizations.resetPagePasswordConfirm = "Password Confirm : ";
localizations.resetPageSubmit = "Submit";
localizations.resetPageLoginPage = "Login Page";
localizations.resetPageStartOver = "Start Over";

localizations.passwordRequirementsMessages = {
    errorTitle : "Error : \r\n",
    msgSeparator : "\r\n",
    chars : "Password must be at least $$ characters.",
    numericChars : "Password must have at least $$ numeric characters.",
    lowerCase : "Password must have at least $$ lower case characters.",
    upperCase : "Password must have at least $$ upper case characters.",
    specialCase : "Password must have at least $$ special characters.",
    unsafeChars: "Password cannot contain URL unsafe chars: $$",
    recentPass: "Password cannot be one of your recent passwords.",
    notAllowedErrorMsg : "Not Allowed"
};

localizations.ItemsPerPageText = "Items to show per page : ";
localizations.LayoutChangeLabelText = "Layout : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "File is too big",
            "minFileSize": "File is too small",
            "acceptFileTypes": "Filetype not allowed",
            "maxNumberOfFiles": "Max number of files exceeded",
            "uploadedBytes": "Uploaded bytes exceed file size",
            "emptyResult": "Empty file upload result",
            "fileAvailableInSelectedFolder": "File already added to upload in the same folder",
            "hasReachedQuota": "File size is bigger than your quota",
            "fileExistOnServer": "File exist on server",
            "fileBiggerThanAllowed": "File is bigger than allowed size",
            "dirNoWritable": "You can not upload to this directory",
            "blockUploadingDirs": "Uploading directory is not allowed",
            "true": "true"
        },
        "error": "Error",
        "start": "Start",
        "waiting": "Waiting...",
        "uploading": "Uploading : ",
        "reupload": "Re-Upload",
        "share": "Share",
        "cancel": "Cancel",
        "destroy": "Delete",
        "overwrite": "Overwrite",
        "uploadTo": "Upload to : ",
        "pause": "Pause",
        "errorLabel": "Error : ",
        "details": "Details",
        "uploadedInLabelText": "Uploaded in : ",
        "atAvgSpeedOfLabelText": "at Avg. Speed of : ",
        "uploadCompletedText": "Upload Completed",
        "uploadedFileText": "File uploaded to server",
        "uploadedMultipleFilesText": "All files uploaded."
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Delete",
    "rename": "Rename",
    "download": "Download",
    "advanced download": "Advanced Download",
    "zipdownload": "ZipDownload",
    "unzip": "Unzip",
    "zip selected": "Zip Selected",
    "explore zip contents": "Explore zip contents",
    "create folder": "Create Folder",
    "upload": "Upload",
    "search": "Search",
    "user options": "User Options",
    "cut": "Cut",
    "copy": "Copy",
    "paste": "Paste",
    "slideshow": "Slideshow",
    "quickview": "QuickView",
    "download low-res": "Download Low-Res",
    "preview": "Preview",
    "batchcomplete": "BatchComplete",
    "share": "Share",
    "quick share": "Quick Share",
    "manage shares": "Manage Shares",
    "show basket": "Show Basket",
    "add to basket": "Add To Basket",
    "edit keywords": "Edit Keywords",
    "change icon": "Change Icon",
    "download crushtunnel": "Download CrushTunnel",
    "help": "Help",
    "login": "Login",
    "logout": "Logout",
    "download sync app": "Download Sync App",
    "download crushftpdrive": "Download CrushFTPDrive",
    "sync manager": "Sync Manager"
};

localizations.currentLanguageName = "English"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "English";
localizations.languageNameCzech = "Czech (Čeština)";
localizations.languageNameDanish = "Danish (Danske)";
localizations.languageNameDutch = "Dutch (Nederlands)";
localizations.languageNameFrench = "French (Français)";
localizations.languageNameGerman = "German (Deutsch)";
localizations.languageNameHungarian = "Hungarian (Magyar)";
localizations.languageNameItalian = "Italian (Italiano)";
localizations.languageNamePolish = "Polish (Polskie)";
localizations.languageNameSpanish = "Spanish (Español)";
localizations.languageNameSlovak = "Slovak (Slovenský)";
localizations.languageNameChinese = "Chinese (中國)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";

//WebInterface
localizations.refreshListingButtonTooltipText = "Refresh";
localizations.FilterText = localizations.FilterTextBasket = "Filter:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Clear";
localizations.FileCounterItemsText = "Items";
localizations.FileCounterFoldersText = "Folders";
localizations.FileCounterFilesText = "Files";
localizations.FileCounterHiddenItemsText = "Hidden Items";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Thumbnail View";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Tree View";
localizations.DownloadResumeTextLabelBasket = "Resume"
localizations.BackToTopLinkText = "Back to top";
localizations.FilesNotAvailableMessage = "No files available";
localizations.CopyNoFilesSelectedMessage = "Please select files/folders to copy";
localizations.CopyOnlyFilesMessage = "You can cut/copy only files, selected folders will be ignored";
localizations.DeleteNoFilesSelectedMessage = "Please select files/folders to delete";
localizations.UnzipNoFilesSelectedMessage = "Please select file to unzip";
localizations.ZipExploreNoFilesSelectedMessage = "Please select zip to explore";
localizations.CutNoFilesSelectedMessage = "Please select files/folders to cut";
localizations.pagingPrevText = "Prev";
localizations.pagingNextText = "Next";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Items with phrase \"{filterVal}\" : {totalItems} , Folders: {folders} Files: {files})";
localizations.TotalItemsInDirMsgText = " (Total items in directory {count}) ";
localizations.CurrentFileSizeText = " (Total file size in list {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} items) ";
localizations.quotaAvailableLabelText = "available";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Error: Problem while saving data";
localizations.TreeviewSpecificActionMsgTitleText = "For tree view only";
localizations.TreeviewSpecificActionMsgDescText = "This is specific to tree view only";
localizations.PasswordExpiringMsgText = "Password Expiring Soon<br/>Use User Options button to change.";
localizations.PasswordNotMatchingMsgText = "New passwords don't match.";
localizations.PasswordMustBeComplexMsgText = "Password must be more complex.";
localizations.PasswordChangedMsgText = "Password changed.  Please login using the new password.";
localizations.AppletLoadingFailedMsgText = "Applet failed while uploading";
localizations.DownloadStartedAlertTitleText = "Download has started";
localizations.DownloadCompletedText = "[Download Completed]";
localizations.DownloadCompletedPathText = " Downloaded to : ";
localizations.DownloadStartedAlertDescText = "Please select location to save your file(s) to proceed";
localizations.LogoutButtonText = "Logout";
localizations.browserUploaderNativeUploadTipSetTitle = "Upload files using browser uploader.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Upload files using the advanced uploader, <br>it allows folders and may accelerate the transfer.";
localizations.browserUploaderDragDropHoverLabelText = "Drop files here to upload";
localizations.readOnlyFolderBannerText = "This folder is read-only.";
localizations.appletUploaderDropPanelLabelText = "&darr; Drop files here to upload &darr;";
localizations.browserUploaderDragDropLabelText = "Drag & drop files here to upload";
localizations.browserUploaderChromeDragDropLabelText = "Drag & drop files and folders here to upload";
localizations.advancedUploadOptionsDialogSaveButtonText = "Save";
localizations.advancedUploadOptionsDialogCancelButtonText = "Cancel";

//Sharing Window
localizations.ShareWindowHeaderText = "Sharing Files";
localizations.ShareWindowFilesSharingLabelText = "Sharing :";
localizations.ShareWindowShareTypeLabelText = "Share Type :";
localizations.ShareWindowShareTypeLabelCopyText = "Copy";
localizations.ShareWindowShareTypeLabelMoveText = "Move";
localizations.ShareWindowShareTypeLabelReferenceText = "Reference";
localizations.ShareWindowShareToInternalUserLabelText = "Internal Share";
localizations.ShareWindowShareToExternalUserLabelText = "External Share";
localizations.ShareWindowDownloadLabelText = "Download";
localizations.ShareWindowExpiresInDaysLabelText = "Days";
localizations.ShareWindowExpiresInDaysValidationErrorText = "Expiration days can't be more than {days} days";
localizations.ShareWindowMaxUsesLabelText = "Maximum number of uses :";
localizations.ShareWindowUploadLabelText = "Upload";
localizations.ShareWindowDeleteLabelText = "Delete";
localizations.ShareWindowSendEmailLabelText = "Send Email :";
localizations.ShareWindowDirectLinkLabelText = "Direct link to file?";
localizations.ShareWindowExpiresLabelText = "Expires :";
localizations.ShareWindowFromLabelText = "From : ";
localizations.ShareWindowToLabelText = "To : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "BCC : ";
localizations.ShareWindowReplyToLabelText = "Reply To : ";
localizations.ShareWindowSubjectLabelText = "Subject : ";
localizations.ShareWindowBodyLabelText = "Body : ";
localizations.ShareWindowAdvancedLabelText = "Advanced";
localizations.ShareWindowAttachThumbsLabelText = "Attach Thumbnail";
localizations.ShareWindowAttachFileLabelText = "Attach Files";
localizations.ShareWindowCommentsLabelText = "Comments : ";
localizations.ShareWindowKeywordsLabelText = "Keywords : ";
localizations.ShareWindowAccessLabelText = "Full Access ";
localizations.ShareWindowSendButtonText = "Send";
localizations.ShareWindowAlternateTempAccountLabelText = "Alternate TempAccount :";
localizations.ShareWindowCancelButtonText = "Cancel";
localizations.ShareWindowUsernameMethodLabelText = "Share Method : ";
localizations.ShareWindowUsernameLabelText = "Share to Internal User";
localizations.ShareWindowUsernamesLabelText = "Usernames : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Separate multiple usernames with commas.)";
localizations.ShareActionCompleteShareUsernamesText = "The following users have now been granted access to the shared items.";
localizations.ShareActionCompleteUsernameText = "Username: ";
localizations.ShareActionCompletePasswordText = "Password: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Please enter valid email address. You can enter multiple email addresses at once separated by comma. ie. <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Invalid Item";
localizations.SharFoldersCantBeSharedGrowlText = "Folders cannot be shared";
localizations.SharFilesCantBeSharedGrowlText = "Files cannot be shared";
localizations.ShareLinkCopyToClipboardText = "Copy link to clipboard";
localizations.ShareLinkCopiedToClipboardText = "Link copied to clipboard";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "Internal share does not accept email address, please use username";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copy direct link.";
localizations.CopyLinkText = "Copy link";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Create new folder.";
localizations.CreateFolderInputDefaultFolderName = "New Folder";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Navigate to the folder after creation ";
localizations.CreateFolderButtonText = "Create";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Upload file";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Upload Details";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Upload Files";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Advanced Browse..";
localizations.BrowserUploaderStartUploadingLinkText = "Start Uploading";
localizations.BrowserUploaderClearCompletedLinkText = "Clear Completed";
localizations.BrowserUploaderResumeCheckboxText = "Resume";
localizations.BrowserUploaderFormResetButtonText = "Reset";
localizations.BrowserUploaderFormNextButtonText = "Next";
localizations.BrowserUploaderFileAddedAlreadyText = "This file has already been added.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} has already been added.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "These files are already added.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} are already added.";
localizations.BrowserUploaderSelectedFilesGroupText = "File Group : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Remove";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Will be uploaded to";
localizations.BrowserUploaderSelectedFileOverwriteText = "Overwrite";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "will be overwritten";
localizations.BrowserUploaderSelectedFileExistsText = "File exist";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Attention Required";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignore";
localizations.BrowserUploaderSelectedFileDoneText = "Done";
localizations.BrowserUploaderSelectedFileUploadedText = "Uploaded to";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "re-upload";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "re-download";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Dismiss";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Cancel";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pause";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Paused";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Resume";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Total {0} File(s)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} of {1} item(s) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Uploading to : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Current Speed : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Avg. Speed : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Time: Elapsed: <span class='elapsed'>{0}</span> <span class='remained'>, Remaining : {1}</span></div>";
localizations.BatchCompleteText = "Result";
localizations.BatchComplete = "Transfers Acknowledged.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Calculating..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problem while transferring";
localizations.BrowserUploaderCancelledUploadMsgText = "Cancelled uploading";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Your file(s) are currently uploading.  If you navigate away from this page you will lose them.  Are you sure you want to exit this page?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Your files are currently downloading. If you navigate away from this page you will lose them.  Are you sure you want to exit this page?";
localizations.NoUploadInDirGrowlText = "Upload not allowed";
localizations.NoUploadInDirGrowlDesc = "Uploading items to selected directory is not allowed";
localizations.AdvancedUploadDirNotAllowedText = "Uploading directory is not allowed";
localizations.AdvancedUploadDirNotAllowedDescText = "Directories can not be uploaded, select only files";
localizations.uploadConfirmCancelUploadText = "Are you sure you wish to cancel this upload?";
localizations.uploadConfirmCancelUploadAfterFormText = "Are you sure you wish to cancel upload for last selected {count} item(s)?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Add files...";
localizations.advancedUploadResumeLabelByClass = "Resume";
localizations.filesToUploadQueueWindowHeader = "Files to upload";
localizations.uploadWindowStartUploadingByClass = "Start Uploading";
localizations.uploadWindowCancelUploadingByClass = "Cancel Uploading";
localizations.uploadWindowShowCommonUploadFormByClass = "Details";
localizations.uploadWindowClearUploadedByClass = "Clear uploaded";
localizations.uploadWindowOverwriteAllByClass = "Overwrite all";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Remove all with errors";
localizations.uploadWindowSummaryFilesByClass = "Files : ";
localizations.uploadWindowSummarySizeByClass = ", Upload size : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Show/Hide upload panel";
localizations.uploadBarAttentionTitle = "Now add files from upload bar";
localizations.uploadBarAttentionText = "Use upload bar to add files to upload. Click on \"" + localizations.browseFileLabelByClass + "\" button to add files";
localizations.uploadBiggerFileNoticeTitleText = "For bigger files use advanced upload";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>It is advised to use advanced upload for bigger files, it allows to upload files easily and has <em>auto resume</em> feature. <br><br> (You can switch upload mode in Upload Bar)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='How to switch upload mode'>";

localizations.globalProgressbarSkipLabelByClass = "Skip";
localizations.globalProgressbarPauseLabelByClass = "Pause";
localizations.globalProgressbarStopLabelByClass = "Stop";

localizations.popupOpenInSeparateWindowText = "Open in a separate window";
localizations.customFormPasswordMatchValidationFailedText = "Password does not match";
localizations.customFormCompareValueMatchValidationFailedText = "Values does not match";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Switch to Normal Upload";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Switch to Advanced Upload.<div style='font-size:11px;width:500px;margin:5px 0px;'>The advanced mode will accelerate transfers. It can automatically resume if a transfer fails, and can upload entire folders all at once.<br><br>It is the fastest way to upload files.<br>(Advanced mode requires the Java Applet plugin from www.java.com to be installed.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Search";
localizations.SearchWindowKeywordsLabelText = "Keywords :";
localizations.SearchWindowExactLabelText = "Exact?";
localizations.SearchWindowByClassModifiedLabelText = "Modified";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelByClassText = "Size is ";
localizations.SearchWindowTypeLabelText = "Type is a";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Start Search";
localizations.SearchWindowCancelButtonText = "Cancel";
localizations.SearchResultDisplayText = "Search Result:";
localizations.SearchResultClearLinkText = "(Clear Search Filter)";
localizations.SearchFormModifiedOptionAfterText = "After";
localizations.SearchFormModifiedOptionBeforeText = "Before";
localizations.SearchFormSizeOptionBiggerThanText = "Bigger Than";
localizations.SearchFormSizeOptionSmallerThanText = "Smaller Than";
localizations.SearchFormItemTypeOptionFileText = "File";
localizations.SearchFormItemTypeOptionFolderText = "Folder";
localizations.SearchProcessNotificationText = "Processing... ";
localizations.SearchProcessCancelText = "Cancel";
localizations.SearchItemsContextGoToParentText = "Go To Parent Folder";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "All <strong>{count}</strong> items on this page are selected.";
localizations.ItemsSelectionSelectAllItemsInDir = "Select all <strong>{total_items}</strong> items in <strong>{list_type}</strong> (including hidden items)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "All <strong>{total_items}</strong> items in <strong>{list_type}</strong> (including hidden items) are selected";
localizations.ItemsSelectionClearSelection = "Clear selection";
localizations.ItemsSelectionShowingFolderText = "Current Folder";
localizations.ItemsSelectionShowingFilteredItemsText = "Current filtered list";
localizations.ItemsSelectionShowingSearchedItemsText = "Search result";
//User options window
localizations.UserOptionsWindowHeaderText = "Preferences";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Hide '.' Items ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Hide Checkbox Column ";
localizations.UserOptionsWindowHideFilterLabelText = "Hide Filter Section ";
localizations.UserOptionsWindowAutostartUploadLabelText = "When choosing file to upload, auto start upload. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "When loading the interface, load the Java applet.";
localizations.UserOptionsWindowDisableWaveformLabelText = "Disable inline audio playback";
localizations.UserOptionsWindowDisableCompressionLabelText = "Disable compression on the Java applet. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Change your password ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Current Password: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "New Password: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Confirm Password:";
localizations.UserOptionsWindowChangePasswordButtonText = "Change Password";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generate random password";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Use this";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Cancel";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "You did not enter the correct current password.";
localizations.ChangePasswordResetLinkExpiredText = "The link is invalid or expired.";
localizations.UserOptionsWindowChangePhoneHeaderText = "Phone No.: ";
localizations.UserOptionsWindowChangePhoneLabelText = "Phone No.:  ";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Toggle";
localizations.MainCheckboxContextMenuCheckAllText = "Check All";
localizations.MainCheckboxContextMenuUncheckAllText = "Un-check All";
//Keywords window
localizations.KeywordsWindowHeaderText = "Keywords";
localizations.KeywordsWindowUpdateLinkText = "Update";
localizations.KeywordsWindowCancelLinkText = "Cancel";
//File basket
localizations.BasketHeaderText = "Files in the Basket";
localizations.BasketClearAllLinkText = "Clear all";
localizations.BasketDownloadLinkText = "Download Basket";
localizations.BasketDownloadAdvancedLinkText = "Download Basket Advanced";
localizations.BasketNoFilesAvailableText = "No Files Available";
localizations.BasketRemoveLinkText = "Remove";
localizations.BasketTotalItemText = "{0} Items ";
localizations.BasketFileAddedAlreadyText = "File already added to the basket";
localizations.BasketFileAddedAlreadyDetailsText = "Selected file is already available in the basket";
localizations.BasketNothingSelectedToAddText = "Nothing selected to add to the basket";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Are you sure you wish to clear all selected files in Basket?";
//Paste form panel
localizations.PasteFormHeaderText = "Paste";
localizations.PasteFormResetButtonText = "Reset";
localizations.PasteFormPasteButtonText = "Paste";
localizations.PasteFormErrorHeaderText = "Problem while pasting";
localizations.PasteFormErrorDetailsText = "There was a problem while pasting items.<br />Error : {0}";
localizations.PasteFormErrorNothingToPasteText = "There is nothing to paste";
localizations.PasteSelectDirectoryWarning = "Please select a target to paste copied items";
localizations.PasteSelectSingleDirectoryWarning = "Please select single target to paste copied items";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Welcome";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "Upload Details";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Cancel";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Slideshow";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Manage Shares";
localizations.ManageShareWindowRefreshLinkText = "Refresh";
localizations.ManageShareWindowDeleteSelectedLinkText = "Delete Selected Items";
localizations.ManageShareWindowDeleteLinkText = "Delete";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "From";
localizations.ManageShareWindowGridToLabelText = "To";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridReplyToLabelText = "Reply To";
localizations.ManageShareWindowGridSubjectLabelText = "Subject";
localizations.ManageShareWindowGridBodyLabelText = "Body";
localizations.ManageShareWindowGridShareTypeLabelText = "Share Type";
localizations.ManageShareWindowGridUserNameLabelText = "Username";
localizations.ManageShareWindowGridPasswordLabelText = "Password";
localizations.ManageShareWindowGridAttachedLabelText = "Attached in Email?";
localizations.ManageShareWindowGridUploadLabelText = "Upload Allowed?";
localizations.ManageShareWindowGridPathsLabelText = "Paths";
localizations.ManageShareWindowGridCreatedLabelText = "Created";
localizations.ManageShareWindowGridExpiresLabelText = "Expires";
localizations.ManageShareWindowGridSharedItemsLabelText = "Shared Items";
localizations.ManageShareWindowGridDownloadsLabelText = "Downloads";
localizations.ManageShareWindowNothingToShowMessageText = "Nothing to display";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Are you sure you wish to delete selected {count} account(s) ?";
localizations.ManageShareWindowFilterText = "Filter :";
localizations.ManageShareWindowClearFilterText = "Clear";
localizations.ManageShareWindowNextItemText = "Next";
localizations.ManageShareWindowPrevItemText = "Prev";
localizations.ManageShareWindowSelectSimilarText = "Select Similar";
localizations.ManageShareWindowPageTitle = "CrushFTP - Manage Shares";
localizations.ManageShareWindowEditDialogTitle = "Edit Share";
localizations.ManageShareWindowShareDetailsDialogTitle = "Share details";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Rename";
localizations.RenamePanelSaveLinkText = "Save";
localizations.RenamePanelCancelLinkText = "Cancel";

localizations.ZipNameWindowHeaderText = "Zip file name";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Cancel";

localizations.SyncAppNameWindowHeaderText = "Sync application download";
localizations.SyncAppDownloadYourPassText = "Your Password : ";
localizations.SyncAppDownloadAdminPassText = "Admin Password : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Cancel";

//Tooltip info
localizations.TooltipNameLabelText = "Name";
localizations.TooltipPathLabelText = "Path";
localizations.TooltipSizeLabelText = "Size";
localizations.TooltipModifiedLabelText = "Modified";
localizations.TooltipCreatedLabelText = "Created";
localizations.TooltipKeywordsLabelText = "Keywords";

//Form alerts and notifications
localizations.FormValidationFailText = "One or more required items are not entered or not entered properly. Enter proper value for the items with * in below form";
localizations.FormEmailValidationFailText = "<br> - Enter valid email address for email field(s)";
localizations.DeleteConfirmationMessageText = "{0} folder(s) and its contents will be deleted and {1} individual selected files.\n\nItems: {2} Once deleted it can not be restored.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "All items in folder \"{folder_name}\" will be deleted.\n\nTotal {count} items will be deleted.\n\nOnce deleted it can not revert back";
localizations.CopyActionGrowlText = "Total {0} folder(s) and {1} file(s) copied.";
localizations.CutActionGrowlText = "Total {0} folder(s) and {1} file(s) cut.";
localizations.NothingSelectedGrowlText = "Nothing selected";
localizations.ShareNothingSelectedGrowlText = "Nothing selected to share";
localizations.DownloadNothingSelectedGrowlText = "Nothing selected to download";
localizations.RenameNothingSelectedGrowlText = "Nothing selected to rename";
localizations.PreviewNothingSelectedGrowlText = "Nothing selected for preview";
localizations.NoPreviewGrowlText = "Preview";
localizations.NoPreviewGrowlDesc = "No preview available for selected item";
localizations.ProblemWhileRenamingGrowlText = "Problem while renaming";
localizations.ProblemWhileRenamingDescGrowlText = "There was a problem while renaming. Please retry. Error : ";
localizations.ProblemWhileSharingGrowlText = "Problem while sharing";
localizations.ProblemWhileSharingDescGrowlText = "There was a problem while sharing a file. Please retry";
localizations.DirectLinkDescGrowlText = "Right click on item and click on copy direct link";
localizations.UpdateKeywordDescGrowlText = "Right click on item and click on update keywords";
localizations.QuickViewNothingToShowGrowlText = "Error : Nothing to show in quick view";
localizations.QuickViewNoItemsAvailableGrowlText = "No items available";
localizations.QuickViewRotateClockwiseTooltipText = "Rotate Clockwise";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Rotate Counter-Clockwise";
localizations.QuickViewCurrentImagePositionText = "Item {current} of {total}";
localizations.ProblemWhileDeletingGrowlText = "Problem while deleting";
localizations.ProblemWhileDeletingDescGrowlText = "There was a problem while deleting. Please retry. Error : ";
localizations.ProblemWhileUnzipGrowlText = "Problem while unzipping file(s)";
localizations.ProblemWhileUnzipDescGrowlText = "There was a problem while unzipping. Please retry. Error : ";
localizations.ProblemWhileZipGrowlText = "Problem while zipping file(s)";
localizations.ProblemWhileZipDescGrowlText = "There was a problem while zipping. Please retry. Error : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Problem while creating new folder";
localizations.ProblemWhileCreatingFolderDescGrowlText = "There was a problem while creating new folder. Please retry. Error : ";
localizations.JavaRequiredGrowlText = "Java Required";
localizations.JavaRequiredDescGrowlText = "Java must be installed for the advanced functions to work.<br/><br/>Please go to: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Problem while loading Java";
localizations.JavaLoadingProblemDescGrowlText = "There was a problem while loading Java, if Java is disabled in browser, please enable and try again.";
localizations.JavaAppletNotLoadedGrowlText = "Java Applet Not Loaded";
localizations.JavaAppletNotLoadedDescGrowlText = "You must first click the 'Advanced Browse...' button before drag and drop will be enabled.";
localizations.NoFilesFoundGrowlTitle = "Backend storage unavailable";
localizations.NoFilesFoundGrowlText = "Error : Backend storage unavailable for location:";
localizations.InvalidPathGrowlTitle = "Invalid Directory";
localizations.InvalidPathGrowlText = "Backend storage not available, or invalid directory:";
localizations.ErrorPathGrowlTitle = "Invalid Directory";
localizations.ErrorPathGrowlText = "Backend storage not available, or invalid directory:";
localizations.AutoLogOutConfirmationTitle = "Auto Logout";
localizations.AutoLogOutConfirmationDesc = "You are about to be signed out due to inactivity";
localizations.AutoLogOutButtonText = "Stay logged in";
localizations.AutoLogOutMsg = "You are signed out due to inactivity";
localizations.AutoLogOutLoginButtonText = "Login again..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Name";
localizations.TreeviewHeaderPathText = "Path";
localizations.TreeviewHeaderSizeText = "Size";
localizations.TreeviewHeaderModifiedText = "Modified";
localizations.TreeviewHeaderCreatedText = "Created";
localizations.TreeviewHeaderKeywordsText = "Keywords";
//Selection menu items
localizations.SelectItemOptionLinkText = "Select";
localizations.SelectCheckboxContextMenuToggleText = "Toggle";
localizations.SelectCheckboxContextMenuCheckAllText = "All items";
localizations.SelectCheckboxContextMenuUncheckAllText = "None";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "All files";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "All folders";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Items starting with \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Modified today";
localizations.SelectCheckboxContextMenuCheckWeekText = "Modified this week";
localizations.SelectCheckboxContextMenuCheckMonthText = "Modified this month";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Modified in last 60 days";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Modified in last 90 days";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Show {0} items on page";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Choose items to upload..";
localizations.advancedDownloadPathSelectionWindowTitle = "Choose path where to download..";
localizations.advancedOperationsDownloadStatus = "Downloading";
localizations.advancedOperationsUploadStatus = "Uploading";

localizations.maxAllowedDownloadSizeReached = "Download size exceeded the maximum allowed size"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Maximum size allowed to download : {size}. <br />Use the advanced downloader, or add to basket instead."; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "Play";
localizations.AudioPlayerPauseText = "Pause";
localizations.AudioPlayerStopText = "Stop";
localizations.AudioPlayerMuteText = "Mute";
localizations.AudioPlayerUnmuteText = "Un-mute";
localizations.AudioPlayerDownloadText = "Download";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Change icon ";
localizations.ChangeIconWindowInstructionsText = "Choose a small image to set as the icon for selected item:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Selected file : ";
localizations.ChangeIconWindowCancelLinkText = "Cancel";
localizations.ChangeIconWindowUpdateLinkText = "Save";
localizations.ChangeIconFileSelectAlertText = "Please select image file to continue.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Unzip has started";
localizations.UnzipStartedAlertDescText = "Unzip operation has started for selected files";
localizations.UnzipCompletedAlertTitleText = "Unzip has completed";
localizations.UnzipCompletedAlertDescText = "Unzip operation has completed for selected files";

//zip operation
localizations.ZipStartedAlertTitleText = "Zip has started";
localizations.ZipStartedAlertDescText = "Zip operation has started for selected files";
localizations.ZipCompletedAlertTitleText = "Zip has completed";
localizations.ZipCompletedAlertDescText = "Zip operation has completed for selected files";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Registration completed : ";
localizations.RegisterWindowProcessCompleteMessage = "You can login using registered user once it is enabled by admin.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Few reasons why registration can fail : </strong><br><br>- The username is already in use. <br> - Server is temporarily not allowing registrations.  <br><br> Please try again, or contact your administrator.";

//Data size format items
localizations.dataByClassFormatBytes = "bytes";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "Please wait...";

localizations.bytesSentLabelTextByClass = "Sent:";
localizations.bytesReceivedLabelTextByClass = "Received:";
localizations.bytesAvailableLabelTextByClass = "Available:";
localizations.ratioTextByClass = "Ratio:";
localizations.dirInfoDownloadLabelTextByClass = "Download : ";
localizations.dirInfoUploadLabelTextByClass = "Upload : ";
localizations.maxAndAvailableAmountLabelTextByClass = "Available/Max :";
localizations.maxAmountPerDayLabelTextByClass = "Per Day :";
localizations.quotaAvailableTextByClass = "available";
localizations.maxAmountPerMonthLabelTextByClass = "Per Month :";

//Server message localized
localizations.share_complete = "Publish Completed.";
localizations.share_email_sent = "Email message sent.";
localizations.share_open_in_email_client = "Open in Email Client";
localizations.email_failed = "<div class='errorMessage'>SMTP failed to send the email.  Check server logs.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Loading failed : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "ERROR: Access denied. (You do not have permission or the file extension is not allowed.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "ERROR:550 Error: File content not allowed.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "ERROR:Cannot overwrite a file.";

localizations.CustomEventCallSuccessTitle = "Success";
localizations.CustomEventCallSuccessDesc = "Custom Event Initiated";
localizations.CustomEventCallFailureTitle = "Failure";
localizations.CustomEventCallFailureDesc = "There was a problem while running custom event";

localizations.ProblemEventCallSuccessTitle = "Success";
localizations.ProblemEventCallSuccessDesc = "Problem reported";
localizations.ProblemEventCallFailureTitle = "Failure";
localizations.ProblemEventCallFailureDesc = "There was a problem while reporting a problem";


//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Advanced Options";
localizations.advancedDownloadOptionsButtonText = "Advanced Download Options";
localizations.advancedUploadOptionsDialogSaveButtonText = "Save";
localizations.advancedUploadOptionsItemAvailableLabel = "When an existing item is found :";
localizations.advancedUploadOptionsUseCompressionLabel = "Use compression :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Please confirm your action";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Please confirm your action for the file :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Action :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Overwrite";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Overwrite All";
localizations.advancedUploadActionResumeSelectOptionText = "Resume";
localizations.advancedUploadActionResumeAllSelectOptionText = "Resume All";
localizations.advancedUploadActionSkipSelectOptionText = "Skip";
localizations.advancedUploadActionSkilAllSelectOptionText = "Skip All";
localizations.advancedUploadActionAskSelectOptionText = "Ask";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Yes";
localizations.advancedUploadActionCompressionNoSelectOptionText = "No";
localizations.MaxUploadFilesCountReachedGrowlText = "Max number of files exceeded";
localizations.MaxUploadFilesCountReachedGrowlDesc = "Max number of files allowed to upload exceeded, maximum files allowed to upload:";

localizations.OTPDialogHeaderText = "Enter your OTP here";

localizations.LoggedInAsLabelText = "Logged in : ";
localizations.AccountExpiresOnLabelText = "Expires : ";
localizations.maxListItemsWarningMessage = "Large directory listings cause significant performance issues. We suggest organizing items into subfolders to prevent performance issues.";
if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Session timeout in %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Please wait...",
    playSlideshow : "Play Slideshow",
    pauseSlideshow : "Pause Slideshow",
    refresh : "Refresh",
    fullscreen : "Fullscreen",
    download : "Download",
    upload : "Upload",
    deleteText : "Delete",
    rotateClockwise : "Rotate Clockwise",
    rotateCounterClockwise : "Rotate Counter-Clockwise",
    previousItem : "Previous Item",
    nextItem : "Next Item",
    delayText : "(Delay {x} seconds)",
    nextPageText : "Next &rsaquo;",
    prevPageText : "&lsaquo; Prev",
    itemCountText : "(Item {x} of {y})",
    noItemMessage : "<h3 style='text-align:center;'>No items available, or problem while fetching records.</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Files to upload",
    dragDropMsg : "Drag and Drop File Here",
    remove : "Remove",
    removeAllSelected : "All Selected",
    removeAllWithError : "All With Error",
    removeAllUploaded : "All Uploaded",
    removeAllCancelled : "All Canceled",
    removeAllSkipped : "All Skipped",
    removeAll : "All",
    addFiles : "Add files...",
    upload : "Upload",
    uploadSelected : "Upload Selected",
    reuploadAll : "Re-Upload All",
    cancel : "Cancel",
    uploadDetails : "Upload Details",
    overwriteAll : "Overwrite All",
    resumeAll : "Resume All",
    shareUploaded : "Share Uploaded",
    shareSelected : "Share Selected",
    quickFilterSubtext : "Quick Filter...",
    total : "Total",
    filesFailed : "file(s) failed.",
    selectedFiles : "Selected File(s) :",
    size : "Size :",
    filtered : "(Filtered)",
    totalFiles : "Total File(s) :",
    scrollWithActivity : "Scroll with activity",
    writingFile : "Writing file...",
    decompressingFile : "Decompressing file...",
    pleaseWait : "Please wait...",
    uploadedIn : "Uploaded in",
    aMoment: "a moment",
    atAvgSpeedOf : "at average speed of",
    uploadingFailed : "Uploading failed",
    canceled : "Canceled",
    skipped : "Skipped",
    currentSpeed : "Current Speed :",
    averageSpeed : "Average Speed :",
    "of" : "of",
    elapsed : "Elapsed",
    remaining : "Remaining",
    waiting : "Waiting..",
    details : "Details",
    overwrite : "Overwrite",
    resume : "Resume",
    reupload : "Re-Upload",
    pause : "Pause",
    paused : "Paused",
    uploading : "Uploading",
    items : "item(s)",
    skip : "Skip",
    cancelAll : "Cancel All",
    OK : 'Yes',
    CANCEL : 'No',
    CONFIRM : "Yes",
    reuploadConfirmation : "It will re-upload all files which are already uploaded, canceled, skipped or failed while uploading and it will overwrite existing files. Are you sure you want to continue?",
    folderUploadNotSupported : "Folder upload is not supported in this browser",
    fileAlreadySelected : "File already added to upload at same location.",
    fileExistsOnServer : "File with same name available on the server.",
    fileSizeExceed : "File size exceed.",
    fileNameNotAllowed: "The name contains unsafe characters.",
    fileTypeNotAllowed : "File type not allowed.",
    filterApplied : "Filter applied",
    noMatchingItemAvailable : "No matching item available.",
    addFilesToUpload : "Add files to upload...",
    file : "File",
    reason : "Reason",
    failedItems : "Failed items",
    ignoreAll : "Ignore All",
    retryAll : "Retry All",
    failedOpeningFile : "Backend storage unavailable.",
    cancelConfirmation : "Are you sure you wish to cancel uploading",
    failedClosingFile : "Failed while closing file",
    failedWileRetryingChunk : "Failed while retrying chunk upload.",
    retryingFile : "Retrying uploading file",
    "in" : "In",
    seconds : "second(s)",
    skipFile : "Skip File",
    retryNow : "Retry now",
    retryingClosingFile : "Retrying closing file",
    fileExistConfirmation : "File [1] with same size exists, do you want to resend the file?",
    bigFileOverwriteConfirmation : "File [1] on the server is bigger than the one being uploaded, do you want to overwrite?",
    fileExistsOnServerConfirmation : "File [1] exists of the server",
    fileActionTitle : "Please select what you want to do with this file.",
    applyToAll : "Apply to all",
    retryingOpeningFile : "Retrying opening file",
    secondsAbbr : "secs",
    minutesAbbr : "mins",
    hoursAbbr : "hours"
};