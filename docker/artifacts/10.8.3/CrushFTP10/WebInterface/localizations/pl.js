//Polish
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
localizations.UserNameText = "Użytkownik";
localizations.ResetUserNameText = "Username";
localizations.PasswordText = "Hasło";
localizations.RememberMeText = "Remember Me";
localizations.LoginButtonText = "Login";
localizations.ForgotPasswordLinkText = "I forgot my password, email it to me.";
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
            "fileAvailableInSelectedFolder" : "File already added to upload in the same folder",
            "hasReachedQuota": "File size is bigger than your quota",
            "fileExistOnServer" : "File exist on server",
            "fileBiggerThanAllowed" : "File is bigger than allowed size",
            "dirNoWritable" : "You can not upload to this directory",
            "blockUploadingDirs" : "Uploading directory is not allowed",
            "true" : "true"
        },
        "error": "Error",
        "start": "Start",
        "waiting" : "Waiting...",
        "uploading" : "Uploading : ",
        "reupload" : "Re-Upload",
        "share" : "Share",
        "cancel": "Cancel",
        "destroy": "Delete",
        "overwrite" : "Overwrite",
        "uploadTo" : "Upload to : ",
        "pause" : "Pause",
        "errorLabel" : "Error : ",
        "details" : "Details",
        "uploadedInLabelText" : "Uploaded in : ",
        "atAvgSpeedOfLabelText" : "at Avg. Speed of : ",
        "uploadCompletedText" : "Upload Completed",
        "uploadedFileText" : "File uploaded to server",
        "uploadedMultipleFilesText" : "All files uploaded."
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Usuń",
    "rename": "Zmień",
    "download": "Ściągnij",
    "advanced download": "Zaawansowane Ściąganie",
    "zipdownload": "ZipDownload",
    "unzip": "Rozpakuj",
    "zip selected": "Wybierz do zzipowania",
    "explore zip contents": "Przejrzyj zawartość spakowanego pliku",
    "create folder": "Utwórz Katalog",
    "upload": "Wgraj",
    "search": "Wyszukaj",
    "user options": "Opcje Użytkownika",
    "cut": "Wytnij",
    "copy": "Kopiuj",
    "paste": "Wklej",
    "slideshow": "Podgląd Slajdów",
    "quickview": "Szybki Podgląd",
    "download low-res": "Download Low-Res",
    "preview": "Podgląd",
    "batchcomplete": "BatchComplete",
    "share": "Udostępnij",
    "quick share": "Szybko Udostępnij",
    "manage shares": "Zarządzaj Udostępnianiem",
    "show basket": "Pokaż Koszyk",
    "add to basket": "Dodaj do Koszyka",
    "edit keywords": "Edit Keywords",
    "change icon": "Zmiana Ikony",
    "download crushtunnel": "Pobierz CrushTunnel",
    "help": "Pomoc",
    "login": "Zaloguj",
    "logout": "Wyloguj",
    "download sync app": "Pobierz Sync App",
    "download crushftpdrive": "Pobierz CrushFTPDrive",
    "sync manager": "Menadżer Synchronizacji"
};

// FTP WebInterface Localization options
localizations.currentLanguageName = "Polish"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Angielski (English)";
localizations.languageNameCzech = "Czeski (Čeština)";
localizations.languageNameDanish = "Duński (Danske)";
localizations.languageNameDutch = "Holenderski (Nederlands)";
localizations.languageNameFrench = "Francuski (Français)";
localizations.languageNameGerman = "Niemiecki (Deutsch)";
localizations.languageNameHungarian = "Węgierski (Magyar)";
localizations.languageNameItalian = "Włoski (Italiano)";
localizations.languageNamePolish = "Polskie";
localizations.languageNameSpanish = "Hiszpański (Español)";
localizations.languageNameSlovak = "Słowacki (Slovenský)";
localizations.languageNameChinese = "Chiński (中國)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";

//WebInterface
localizations.refreshListingButtonTooltipText = "Refresh";
localizations.FilterText = localizations.FilterTextBasket = "Filtr:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Czyść";
localizations.FileCounterItemsText = "Pozycje";
localizations.FileCounterFoldersText = "Foldery";
localizations.FileCounterFilesText = "Pliki";
localizations.FileCounterHiddenItemsText = "Ukryte pozycje";
localizations.ThumbnailViewLinkText = "Miniaturki";
localizations.TreeViewLinkText = "Drzewko";
localizations.DownloadResumeTextLabelBasket = "Resume";
localizations.BackToTopLinkText = "Do góry";
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
localizations.FilterItemCountText = '(Pozycji z frazą "{filterVal}" : {totalItems} , Folderów: {folders} Plików: {files})';
localizations.CurrentFileSizeText = " (Total file size in list {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} items) ";
localizations.quotaAvailableLabelText = "available";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Błąd: Wystąpił problem z zapisem";
localizations.TreeviewSpecificActionMsgTitleText = "Tylko w widoku drzewka";
localizations.TreeviewSpecificActionMsgDescText = "Dozwolone tylko w widoku drzewka";
localizations.PasswordExpiringMsgText = "Hasło wkrótce wygaśnie<br/>Użyj opcji użytkownia aby zmienić hasło.";
localizations.PasswordNotMatchingMsgText = "Nowe hasła nie pasują do siebie.";
localizations.PasswordMustBeComplexMsgText = "Hasło musi być bardziej skomplikowane.";
localizations.PasswordChangedMsgText = "Hasło zmienione.  Zaloguj się używając nowego hasła.";
localizations.AppletLoadingFailedMsgText = "Applet failed while uploading";
localizations.DownloadStartedAlertTitleText = "Pobieranie rozpoczęte";
localizations.DownloadStartedAlertDescText = "Wybierz miejsce do zapisu plików aby kontynuować";
localizations.LogoutButtonText = "Wyloguj";
localizations.browserUploaderNativeUploadTipSetTitle = "Wgraj pliki używając przeglądarki.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Wgraj pliki używając apletu, <br>pozwala na wgrywanie folderów i jest szybsze.";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Szczegóły wgrywania";
localizations.DownloadCompletedText = "[Download Completed]";
localizations.DownloadCompletedPathText = " Downloaded to : ";
localizations.browserUploaderDragDropHoverLabelText = "Drop files here to upload";
localizations.readOnlyFolderBannerText = "This folder is read-only.";
localizations.appletUploaderDropPanelLabelText = "&darr; Drop files here to upload &darr;";
localizations.browserUploaderDragDropLabelText = "Drag & drop files here to upload";
localizations.browserUploaderChromeDragDropLabelText = "Drag & drop files and folders here to upload";

localizations.NothingSelectedGrowlText = "Nic nie wybrano";
localizations.ShareNothingSelectedGrowlText = "Nic nie wybrano do udostępnienia";
localizations.RenameNothingSelectedGrowlText = "Nic nie wybrano do zmiany nazwy";
localizations.ProblemWhileRenamingGrowlText = "Problem ze zmianą nazwy";
localizations.ProblemWhileRenamingDescGrowlText = "Wystąpił problem ze zmianą nazwy. Proszę spróbować ponownie, Błąd : ";


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
localizations.ShareWindowDirectLinkLabelText = "Direct link to file?";
localizations.ShareWindowReplyToLabelText = "Reply To : ";
localizations.ShareWindowAttachFileLabelText = "Attach Files";
localizations.ShareWindowCommentsLabelText = "Comments : ";
localizations.ShareWindowKeywordsLabelText = "Keywords : ";
localizations.ShareWindowAlternateTempAccountLabelText = "Alternate TempAccount :";
localizations.ShareWindowUsernameMethodLabelText = "Share Method : ";
localizations.ShareWindowUsernameLabelText = "Share to Internal User";
localizations.ShareWindowUsernamesLabelText = "Usernames : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Separate multiple usernames with commas.)";
localizations.ShareActionCompleteShareUsernamesText = "The following users have now been granted access to the shared items.";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Please enter valid email address. You can enter multiple email addresses at once separated by comma. ie. <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Invalid Item";
localizations.SharFoldersCantBeSharedGrowlText = "Folders cannot be shared";
localizations.SharFilesCantBeSharedGrowlText = "Files cannot be shared";
localizations.ShareLinkCopyToClipboardText = "Copy link to clipboard";
localizations.ShareLinkCopiedToClipboardText = "Link copied to clipboard";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "Internal share does not accept email address, please use username";

localizations.ProblemWhileSharingGrowlText = "Problem z udostępnianiem";
localizations.ProblemWhileSharingDescGrowlText = "Wystąpił problem z udostępnianiem. Proszę spróbować ponownie";
localizations.DirectLinkDescGrowlText = "Kliknij prawym na pozycji a następnie kliknij na Skopiuj link bezpośredni";
localizations.UpdateKeywordDescGrowlText = "Kliknij prawym na pozycji a następnie kliknij na aktualizuj słowa kluczowe";
localizations.QuickViewNothingToShowGrowlText = "Błąd : nie można pokazać w szybkim widoku";
localizations.QuickViewNoItemsAvailableGrowlText = "Brak dostępnych pozycji";
localizations.ProblemWhileDeletingGrowlText = "Problem z kasowaniem";
localizations.ProblemWhileDeletingDescGrowlText = "Wystąpił problem z kasowaniem. Proszę spróbować ponownie. Błąd : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Problem z tworzeniem nowego folderu";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Wystąpił problem z tworzeniem nowego folderu. Proszę spróbować ponownie. Błąd : ";
localizations.JavaRequiredGrowlText = "Java jest wymagana";
localizations.JavaRequiredDescGrowlText = "Java jest wymagana do działania zaawansowanych funkcji.<br/><br/>Proszę przejść na: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaAppletNotLoadedGrowlText = "Aplet Java nie został załadowany";
localizations.JavaAppletNotLoadedDescGrowlText = "Kliknij napierw 'Zaawansowane przeglądanie...' aby przeciągnij i upuść było aktywne.";
localizations.ShareWindowHeaderText = "Udostępnianie";
localizations.ShareWindowFilesSharingLabelText = "Udostępnij :";
localizations.ShareWindowShareTypeLabelText = "Typ udostępnienia :";
localizations.ShareWindowSendEmailLabelText = "Wyślij Email :";
localizations.ShareWindowExpiresLabelText = "Wygasa :";
localizations.ShareWindowFromLabelText = "Od : ";
localizations.ShareWindowToLabelText = "Do : ";
localizations.ShareWindowCCLabelText = "DW : ";
localizations.ShareWindowBCCLabelText = "UDW : ";
localizations.ShareWindowSubjectLabelText = "Temat : ";
localizations.ShareWindowBodyLabelText = "Treść : ";
localizations.ShareWindowAdvancedLabelText = "Zaawansowane";
localizations.ShareWindowAttachThumbsLabelText = "Załącz miniaturkę";
localizations.ShareWindowAccessLabelText = "Pełne uprawnienia (odczyt, zapis, usuwanie) ";
localizations.ShareWindowSendButtonText = "Wyślij";
localizations.ShareWindowCancelButtonText = "Anuluj";
localizations.ShareActionCompleteUsernameText = "Użytkownik: ";
localizations.ShareActionCompletePasswordText = "Hasło: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "Ok";
localizations.CopyLinkWindowHeaderText = "Skopiuj link bezpośredni.";
localizations.CopyLinkText = "Skopiuj link";
localizations.CreateFolderWindowHeaderText = "Stwórz nowy folder.";
localizations.CreateFolderInputDefaultFolderName = "Nowy Folder";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Przejdź do nowego folderu po utworzeniu ";
localizations.CreateFolderButtonText = "Stwórz";

localizations.BrowserUploaderWindowHeaderText = "Wgraj plik";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Wgraj pliki";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Zaawansowane przeglądanie..";
localizations.BrowserUploaderStartUploadingLinkText = "Uruchom wgrywanie";
localizations.BrowserUploaderClearCompletedLinkText = "Usuń zakończone";
localizations.BrowserUploaderResumeCheckboxText = "Wznów";
localizations.BrowserUploaderFormResetButtonText = "Reset";
localizations.BrowserUploaderFormNextButtonText = "Następny";
localizations.BrowserUploaderFileAddedAlreadyText = "Ten plik został już dodany.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} został już dodany.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Te pliki zostały już dodane.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} zostało już dodanych.";
localizations.BrowserUploaderSelectedFilesGroupText = "Grupa plików : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Usuń";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Zostaną wgrane do";
localizations.BrowserUploaderSelectedFileOverwriteText = "Nadpisz";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "zostaną nadpisane";
localizations.BrowserUploaderSelectedFileExistsText = "Plik istnieje";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Uwaga";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignoruj";
localizations.BrowserUploaderSelectedFileDoneText = "Wykonano";
localizations.BrowserUploaderSelectedFileUploadedText = "Wgrane do";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "Ponowne wgranie";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "re-download";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Odrzuć";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Anuluj";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Wstrzymaj";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Wstrzymano";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Wznów";
localizations.BrowserUploaderAdvancedUploadingFilesText = "W sumie {0} plik(ów)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} z {1} pozycji ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Wgrywanie do : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Szybkość : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Avg. Speed : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Czas: Upłynęło: <span class='elapsed'>{0}</span> <span class='remained'>, Pozostało : {1}</span></div>";
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

localizations.uploadWindowShowCommonUploadFormByClass = "Details";
localizations.uploadBiggerFileNoticeTitleText = "For bigger files use advanced upload";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>It is advised to use advanced upload for bigger files, it allows to upload files easily and has <em>auto resume</em> feature. <br><br> (You can switch upload mode in Upload Bar)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='How to switch upload mode'>";

localizations.browseFileLabelByClass = "Dodaj pliki...";
localizations.advancedUploadResumeLabelByClass = "Wynów";
localizations.filesToUploadQueueWindowHeader = "Pliki do wgrania";
localizations.uploadWindowStartUploadingByClass = "Rozpocznij wgrywanie";
localizations.uploadWindowCancelUploadingByClass = "Anuluj wgrywanie";
localizations.uploadWindowClearUploadedByClass = "Wyczyść wgrane";
localizations.uploadWindowOverwriteAllByClass = "Nadpisz wszystkie";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Usuń wszystkie z błędami";
localizations.uploadWindowSummaryFilesByClass = "Pliki : ";
localizations.uploadWindowSummarySizeByClass = ", Rozmiar : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Pokaż/Ukryj wybrane pliki";
localizations.uploadBarAttentionTitle = "Teraz dodaj pliki z panelu wgrywania";
localizations.uploadBarAttentionText = "Użyj panelu wgrywania aby dodać pliki do wgrania. Kliknij na przycisk\"" + localizations.browseFileLabelByClass + "\"  aby dodać plik";

localizations.globalProgressbarSkipLabelByClass = "Pomiń";
localizations.globalProgressbarPauseLabelByClass = "Pauza";
localizations.globalProgressbarStopLabelByClass = "Zatrzymaj";

localizations.TotalItemsInDirMsgText = "(Wszystkich pozycji w folderze {count})";
localizations.ThumbnailsTooltipText = "<strong>Nazwa : </strong>{text}<br /><strong>Rozmiar : </strong>{size}<br /><strong>Zmodyfikowano : </strong>{date}<br /><strong>Słowa kluczowe : </strong> {keywords}";


localizations.popupOpenInSeparateWindowText = "Open in a separate window";
localizations.customFormPasswordMatchValidationFailedText = "Password does not match";
localizations.customFormCompareValueMatchValidationFailedText = "Values does not match";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Switch to Normal Upload";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Switch to Advanced Upload.<div style='font-size:11px;width:500px;margin:5px 0px;'>The advanced mode will accelerate transfers. It can automatically resume if a transfer fails, and can upload entire folders all at once.<br><br>It is the fastest way to upload files.<br>(Advanced mode requires the Java Applet plugin from www.java.com to be installed.)</div>";
}
localizations.SearchWindowHeaderText = "Szukaj";
localizations.SearchWindowKeywordsLabelText = "Słowa kluczowe :";
localizations.SearchWindowExactLabelText = "Dokładnie?";
localizations.SearchWindowByClassModifiedLabelText = "Zmodyfikowane";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/rrrr) ";
localizations.SearchWindowSizeLabelText = "Rozmiar jest ";
localizations.SearchWindowTypeLabelText = "Typ jest ";
localizations.SearchWindowSizeLabelByClassText = "Rozmiar jest ";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobajtów)";
localizations.SearchWindowSearchButtonText = "Szukaj";
localizations.SearchWindowCancelButtonText = "Anuluj";
localizations.SearchResultDisplayText = "Wyniki wyszukiwania:";
localizations.SearchResultClearLinkText = "(Wyczyść filtr wyszukiwania)";
localizations.SearchFormModifiedOptionAfterText = "Po";
localizations.SearchFormModifiedOptionBeforeText = "Przed";
localizations.SearchFormSizeOptionBiggerThanText = "Większe niż";
localizations.SearchFormSizeOptionSmallerThanText = "Mniejsze niż";
localizations.SearchFormItemTypeOptionFileText = "Plik";
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
localizations.UserOptionsWindowHeaderText = "Preferencje";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Ukryj '.' Pozycje ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Ukryj kolumnę ptaszków ";
localizations.UserOptionsWindowHideFilterLabelText = "Ukryj sekcję filtrów ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Wgrywanie od razu w trakcie wybierania. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Przy starcie uruchom aplet Java.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Wyłącz kompresję korzystając z apletu Java. ";
localizations.UserOptionsWindowDisableWaveformLabelText = "Disable inline audio playback";
localizations.UserOptionsWindowChangePasswordHeaderText = "Zmień hasło ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Aktualne hasło: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nowe hasło: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Zatwierdź hasło:";
localizations.UserOptionsWindowChangePasswordButtonText = "Zmień hasło";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generuj losowe hasło";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Użyj tego";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Anuluj";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "You did not enter the correct current password.";
localizations.ChangePasswordResetLinkExpiredText = "The link is invalid or expired.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Przełącz";
localizations.MainCheckboxContextMenuCheckAllText = "Zaznacz wszystkie";
localizations.MainCheckboxContextMenuUncheckAllText = "Odznacz wszystkie";
localizations.KeywordsWindowHeaderText = "Słowa kluczowe";
localizations.KeywordsWindowUpdateLinkText = "Aktualizuj";
localizations.KeywordsWindowCancelLinkText = "Anuluj";
localizations.BasketHeaderText = "Pliki w koszyku";
localizations.BasketClearAllLinkText = "Wyczyść wszystkie";
localizations.BasketDownloadLinkText = "Pobierz pliki";
localizations.BasketDownloadAdvancedLinkText = "Pobierz pliki zaawansowane";
localizations.BasketNoFilesAvailableText = "Brak plików";
localizations.BasketRemoveLinkText = "Usuń";
localizations.BasketTotalItemText = "W sumie {0} pozycji";
localizations.BasketFileAddedAlreadyText = "Plik już został dodany do koszyka";
localizations.BasketFileAddedAlreadyDetailsText = "Wybrany plik jest już w koszyku";
localizations.BasketNothingSelectedToAddText = "Nie zaznaczono pozycji do dodania do koszyka";
localizations.BasketNothingSelectedToAddDetailsText = " ";
localizations.BasketClearAllConfirmMessage = "Are you sure you wish to clear all selected files in Basket?";
localizations.PasteFormHeaderText = "Wklej";
localizations.PasteFormResetButtonText = "Reset";
localizations.PasteFormPasteButtonText = "Wklej";
localizations.PasteFormErrorHeaderText = "Problem z wklejaniem";
localizations.PasteFormErrorDetailsText = "Wystąpił problem z wklejaniem pozycji.<br />Błąd : {0}";
localizations.PasteFormErrorNothingToPasteText = "Nie ma pozycji do wklejenia";
localizations.PasteSelectDirectoryWarning = "Please select a target to paste copied items";
localizations.PasteSelectSingleDirectoryWarning = "Please select single target to paste copied items";
localizations.WelcomeFormHeaderText = "Witamy";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "Upload Details";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Cancel";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Pokaz slajdów";
localizations.ManageShareWindowHeaderText = "Zarządaj udostępnionymi";
localizations.ManageShareWindowRefreshLinkText = "Odświerz";
localizations.ManageShareWindowDeleteSelectedLinkText = "Usuń zaznaczone";

localizations.ManageShareWindowDeleteLinkText = "Delete";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "From";
localizations.ManageShareWindowGridToLabelText = "DO";
localizations.ManageShareWindowGridCCLabelText = "DW";
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
localizations.ManageShareWindowGridCreatedLabelText = "Stworzony";
localizations.ManageShareWindowGridExpiresLabelText = "Wygasa";
localizations.ManageShareWindowGridSharedItemsLabelText = "Udostępniane pozycje";
localizations.ManageShareWindowGridDownloadsLabelText = "Pobrania";
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
localizations.RenameWindowHeaderText = "Zmień nazwę";
localizations.RenamePanelSaveLinkText = "Zapisz";
localizations.RenamePanelCancelLinkText = "Anuluj";

localizations.ZipNameWindowHeaderText = "Zip file name";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Cancel";

localizations.SyncAppNameWindowHeaderText = "Sync application download";
localizations.SyncAppDownloadYourPassText = "Your Password : ";
localizations.SyncAppDownloadAdminPassText = "Admin Password : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Cancel";
localizations.TooltipPathLabelText = "Path";
localizations.FormEmailValidationFailText = "<br> - Enter valid email address for email field(s)";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "All items in folder \"{folder_name}\" will be deleted.\n\nTotal {count} items will be deleted.\n\nOnce deleted it can not revert back";
localizations.DownloadNothingSelectedGrowlText = "Nothing selected to download";
localizations.PreviewNothingSelectedGrowlText = "Nothing selected for preview";
localizations.NoPreviewGrowlText = "Preview";
localizations.NoPreviewGrowlDesc = "No preview available for selected item";
localizations.QuickViewRotateClockwiseTooltipText = "Rotate Clockwise";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Rotate Counter-Clockwise";
localizations.QuickViewCurrentImagePositionText = "Item {current} of {total}";

localizations.ProblemWhileUnzipGrowlText = "Problem while unzipping file(s)";
localizations.ProblemWhileUnzipDescGrowlText = "There was a problem while unzipping. Please retry. Error : ";
localizations.ProblemWhileZipGrowlText = "Problem while zipping file(s)";
localizations.ProblemWhileZipDescGrowlText = "There was a problem while zipping. Please retry. Error : ";




localizations.JavaLoadingProblemGrowlText = "Problem while loading Java";
localizations.JavaLoadingProblemDescGrowlText = "There was a problem while loading Java, if Java is disabled in browser, please enable and try again.";


localizations.NoFilesFoundGrowlTitle = "Backend storage unavailable";
localizations.NoFilesFoundGrowlText = "Error : Backend storage unavailable for location:";
localizations.AutoLogOutConfirmationTitle = "Auto Logout";
localizations.AutoLogOutConfirmationDesc = "You are about to be signed out due to inactivity";
localizations.AutoLogOutButtonText = "Stay logged in";
localizations.AutoLogOutMsg = "You are signed out due to inactivity";
localizations.AutoLogOutLoginButtonText = "Login again..";
localizations.TreeviewHeaderPathText = "Path";

localizations.TooltipNameLabelText = "Nazwa";
localizations.TooltipSizeLabelText = "Rozmiar";
localizations.TooltipModifiedLabelText = "Zmodyfikowano";
localizations.TooltipKeywordsLabelText = "Słowa kluczowe";
localizations.FormValidationFailText = "Jedna lub kilka pozycji nie zostało wprowadzonych prawidłowo. Wprowadź poprawne wartości dla pozycji oznaczonych *.";
localizations.DeleteConfirmationMessageText = "W sumie {0} folder(ów) i {1} plik(ów) Zostanie skasowanych.\n\nPozycji: {2} Raz skasowanych nie da się odzyskać";
localizations.CopyActionGrowlText = "W sumie {0} folder(ów) i {1} plik(ów) skopiowano.";
localizations.CutActionGrowlText = "W sumie {0} folder(ów) i {1} plik(ów) wycięto.";
localizations.TreeviewHeaderNameText = "Nazwa";
localizations.TreeviewHeaderSizeText = "Rozmiar";
localizations.TreeviewHeaderModifiedText = "Zmodyfikowano";
localizations.TreeviewHeaderKeywordsText = "Słowa kluczowe";
localizations.SelectItemOptionLinkText = "Wybierz";
localizations.SelectCheckboxContextMenuToggleText = "Przełącz";
localizations.SelectCheckboxContextMenuCheckAllText = "Wszystkie";
localizations.SelectCheckboxContextMenuUncheckAllText = "Żadne";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Wszystkie pliki";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Wszystkie foldery";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Pozycje zaczynające się od \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Zmodyfikowane dziś";
localizations.SelectCheckboxContextMenuCheckWeekText = "Zmodyfikowane w tym tygodniu";
localizations.SelectCheckboxContextMenuCheckMonthText = "Zmodyfikowane w tym miesiącu";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Zmodyfikowane w ostatnich 60 dniach.";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Zmodyfikowane w ostatnich 90 dniach.";
localizations.PageSizeSelectionLinkText = "Pokaż {0} pozycji na stronie";

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
localizations.advancedUploadOptionsDialogCancelButtonText = "Cancel";
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