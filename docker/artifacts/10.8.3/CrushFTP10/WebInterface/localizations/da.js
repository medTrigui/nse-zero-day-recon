//March 20th 2015
// Danish
/*Login page specific*/

localizations.BadLoginInfoText = "Det angivne brugernavn eller kodeord er forkert eller din konto er deaktiveret.";
localizations.ServerErrorInfoText = "Serveren er ikke tilgængelig eller din IP adresse er blevet  blokeret.";
localizations.PasswordsDoNotMatchAlertText = "Kodeordene er ikke ens.";
localizations.LoginAgainTitleText = "Log venligst ind igen";
localizations.LoginWithNewPassText = "Login med dit nye kodeord";
localizations.AuthenticatingMsgText = "Godkender login...";
localizations.LoginSuccessText = "Succes";
localizations.LoadingWebInterfaceText = "Loader webInterface...";
localizations.LoginWarningText = "Advarsel";
localizations.MultipleBadLoginsAlertDescText = "For mange fejlede loginforsøg og din IP adresse bliver blokeret.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Klik <a style='color:white;' href='/WebInterface/jQuery/reset.html'>her</a> for at nulstille kodeord.</div>";
localizations.LoginFailedText = "Login fejlede";
localizations.ChangePasswordGrowlTitleText = "Skift kodeord";
localizations.UserNameText = "Brugernavn";
localizations.PasswordText = "Kodeord";
localizations.LoginButtonText = "Login";
localizations.ForgotPasswordLinkText = "Jeg har glemt mit kodeord. Send det til mig via e-mail.";
localizations.ChangePasswordHeaderText = "Skift dit kodeord";
localizations.ChangePasswordNoteText = "Du skal skifte kodeord for at fortsætte";
localizations.CurrentPasswordText = "Nuværende kodeord : ";
localizations.NewPasswordText = "Ny kodeord : ";
localizations.ConfirmPasswordText = "Bekræft kodeord : ";
localizations.CancelButtonText = "Annuller";
localizations.ChanngePasswordButtonText = "Skift kodeord";
localizations.GeneratePasswordButtonText = "Generer tilfældig kodeord";
localizations.GeneratePasswordUseButtonText = "Brug dette";
localizations.GeneratePasswordCancelButtonText = "Annuller";
localizations.OldBrowserNoticeHTMLAsText = 'Din browser er ikke er ikke understøttet! Du vil få en dårlig og langsom brugeroplevelse fyldt med fejl.<br><br><div style="text-align:right;"><button id="proceedAnyway">Fortsæt alligevel</button> eller hent en nyere og bedre browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Filen er for stor",
            "minFileSize": "Filen er for lille",
            "acceptFileTypes": "Filetype er ikke tilladt",
            "maxNumberOfFiles": "Max antal filer er overskredet",
            "uploadedBytes": "Uploaded bytes overskrider filstørrelse",
            "emptyResult": "Tom fil uploadet",
            "fileAvailableInSelectedFolder" : "Filen er allerede tilføjet til upload til samme mappe",
            "fileExistOnServer" : "Filen findes på serveren",
            "fileBiggerThanAllowed" : "Filen er større end den tilladte størrelse",
            "dirNoWritable" : "Du kan ikke uploade til denne mappe",
            "blockUploadingDirs" : "Upload af mapper er ikke tilladt",
            "true" : "true"
        },
        "error": "Error",
        "start": "Start",
        "waiting" : "Venter...",
        "uploading" : "Uploader : ",
        "reupload" : "Upload igen",
        "share" : "Del",
        "cancel": "Annuller",
        "destroy": "Slet",
        "overwrite" : "Overskriv",
        "uploadTo" : "Upload til : ",
        "pause" : "Pause",
        "errorLabel" : "Error : ",
        "details" : "Detaljer",
        "uploadedInLabelText" : "Uploaded i : ",
        "atAvgSpeedOfLabelText" : "med gns.hastighed på : ",
        "uploadCompletedText" : "Upload fuldført",
        "uploadedFileText" : "Filen er uploaded til serveren",
        "uploadedMultipleFilesText" : "Alle filer er uploaded."
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Slet",
    "rename": "Omdøb",
    "download": "Download",
    "advanced download": "Advancet download",
    "zipdownload": "Download som zip-fil",
    "unzip": "Udpak zip-fil",
    "zip selected": "Zip valgte",
    "explore zip contents": "Se indhold i zip-fil",
    "create folder": "Opret mappe",
    "upload": "Upload",
    "search": "Søg",
    "user options": "Brugerindstillinger",
    "cut": "Klip",
    "copy": "Kopier",
    "paste": "Indsæt",
    "slideshow": "Slideshow",
    "quickview": "Hurtig visning",
    "download low-res": "Download i lav opløsning",
    "preview": "Smugkik",
    "batchcomplete": "Resultat",
    "share": "Del",
    "quick share": "Del nu!",
    "manage shares": "Administrer delinger",
    "show basket": "Vis kurv",
    "add to basket": "Tilføj til kurv",
    "edit keywords": "Rediger nøgleord",
    "change icon": "Skift ikon",
    "download crushtunnel": "Download CrushTunnel",
    "help": "Hjælp",
    "login": "Login",
    "logout": "Log ud",
    "download sync app": "Download Sync App",
    "download crushftpdrive": "Download CrushFTPDrive",
    "sync manager": "Sync Manager"
};

// FTP WebInterface Localization options
localizations.currentLanguageName = "Danish"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Engelsk (English)";
localizations.languageNameCzech = "Tjekkisk (Čeština)";
localizations.languageNameDanish = "Danske";
localizations.languageNameDutch = "Hollandsk (Nederlands)";
localizations.languageNameFrench = "Fransk (Français)";
localizations.languageNameGerman = "Tysk (Deutsch)";
localizations.languageNameHungarian = "Ungarsk (Magyar)";
localizations.languageNameItalian = "Italiensk (Italiano)";
localizations.languageNamePolish = "Polere (Polskie)";
localizations.languageNameSpanish = "Spansk (Español)";
localizations.languageNameSlovak = "Slovakisk (Slovenský)";
localizations.languageNameChinese = "Kinesisk (中國)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";

if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Din session timer automatisk ud om %time%.)";

localizations.minutesLabelText = "min.";
localizations.secondsLabelText = "sek.";

////////////////////////////////////////////////////////////////////
////////                                                    ////////
////////                    Localization                    ////////
////////                                                    ////////
////////////////////////////////////////////////////////////////////

localizations.ItemsPerPageText = "Emner pr. side";
localizations.LoggedInAsLabelText = "Logget ind som :";
localizations.TreeviewHeaderNameText = "Navn";
localizations.TreeviewHeaderPathText = "Sti";
localizations.TreeviewHeaderSizeText = "Størrelse";
localizations.TreeviewHeaderModifiedText = "Ændret";
localizations.TreeviewHeaderKeywordsText = "Nøgleord";
localizations.LayoutChangeLabelText = "Visning:";


//WebInterface
localizations.FilterText = localizations.FilterTextBasket = "Filtrer:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Nulstil";
localizations.FileCounterItemsText = "Elementer";
localizations.FileCounterFoldersText = "Mapper";
localizations.FileCounterFilesText = "Filer";
localizations.FileCounterHiddenItemsText = "Skjulte elementer";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Vis miniaturer";
localizations.NothingSelectedGrowlText = "Intet valgt";
localizations.RenameNothingSelectedGrowlText = "Intet valgt til omdøbning";
localizations.ProblemWhileRenamingGrowlText = "Problem opstået ved omdøbning";
localizations.ProblemWhileRenamingDescGrowlText = "Der opstod et problem ved omdøbning. Prøv venligst igen. Fejl:..";
localizations.ProblemWhileSharingGrowlText = "Problem opstået ved deling";
localizations.ProblemWhileSharingDescGrowlText = "Der opstod et problem ved deling. Prøv venligst igen.";
localizations.DirectLinkDescGrowlText = "Højreklik på emnet og klik 'Kopier direkte link'";
localizations.UpdateKeywordDescGrowlText = "Højreklik på emnet og klik 'Opdater nøgleord'";
localizations.ProblemWhileDeletingGrowlText = "Problem ved sletning";
localizations.ProblemWhileDeletingDescGrowlText = "Der opstod et problem ved sletning. Prøv venligst igen. Fejl:..";
localizations.ProblemWhileCreatingFolderGrowlText = "Problem ved oprettelse af mappe";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Der opstod et problem ved oprettelse af ny mappe. Prøv venligst igen. Fejl:..";
localizations.JavaRequiredGrowlText = "Java er ikke installeret";
localizations.JavaRequiredDescGrowlText = "Java skal være installeret for brug af avancerede funktioner.<br/><br/>Download Java her: <a target = \" _blank \"href = \" http://www.java.com / \"class = \" whiteError \"> http://www.java.com/ </ a>";
localizations.JavaAppletNotLoadedGrowlText = "Java applet Ikke startet";
localizations.JavaAppletNotLoadedDescGrowlText = "Du skal først klikke 'Avanceret browsning ... ' før du kan bruge træk og slip.";
localizations.loadingIndicatorText = "Vent venligst ...";
localizations.LogoutButtonText = "Log ud";
localizations.DownloadResumeTextLabelBasket = "Genoptag"
localizations.BackToTopLinkText = "Tilbage til toppen";
localizations.FilesNotAvailableMessage = "Ingen tilgængelige filer eller mapper";
localizations.CopyNoFilesSelectedMessage = "Vælg venligst den/de filer eller mapper der skal kopieres";
localizations.pagingPrevText = "Forrige";
localizations.pagingNextText = "Næste";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Elementer med søgestrengen \"{filterVal}\" : {totalItems} , Mapper: {folders} Filer: {files})";
localizations.TotalItemsInDirMsgText = "(Antal elementer i mappen {count})";
localizations.quotaAvailableLabelText = "ledig";
localizations.WelcomeNoteSubmitFormFailureMsgText = "Fejl: Problem ved lagring af data";
localizations.PasswordExpiringMsgText = "Kodeordet udløber snart<br/>Anvend knappen \"Brugerindstillinger\" til at ændre.";
localizations.PasswordNotMatchingMsgText = "De nye kodeord stemmer ikke overens.";
localizations.PasswordMustBeComplexMsgText = "Kodeordet er ikke kompleks nok.";
localizations.PasswordChangedMsgText = "Kodeordet er gemt.  Log venligst ind med det nye kodeord.";
localizations.AppletLoadingFailedMsgText = "Appletten fejlede under overførslen";
localizations.DownloadStartedAlertTitleText = "Download er startet";
localizations.DownloadCompletedText = "[Download gennemført]";
localizations.DownloadCompletedPathText = " Downloadet til : ";
localizations.DownloadStartedAlertDescText = "Vælg venligst en destination til din(e) fil(er) for at kunne fortsætte";
localizations.LogoutButtonText = "Log ud";
localizations.browserUploaderNativeUploadTipSetTitle = "Upload filer ved at anvende browser uploaderen.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Upload filer ved at anvende den avancerede uploader, <br>den muliggør overførsel af mapper, og i flere tilfælde går overførslen hurtigere.";
localizations.browserUploaderDragDropHoverLabelText = "Træk og slip filer her for at uploade";
localizations.appletUploaderDropPanelLabelText = "&darr; Træk og slip filer her for at uploade &darr;";

// Form indberetninger og meddelelser
localizations.CopyActionGrowlText = "I alt {0} mappe(r) og {1} fil(er) kopieret.";
localizations.CutActionGrowlText = "I alt {0} mappe(r) og {1} fil(er) i udklipsholderen.";
localizations.CutNoFilesSelectedMessage = "Venligst vælg den/de filer eller mapper der flyttes";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Alle elementer i mappen \"{folder_name}\" vil blive slettet.\n\nTotalt {count} elementer vil blive slettet.\n\nNår først de er slettet kan det ikke fortrydes";
localizations.DeleteConfirmationMessageText = "Totalt {0} mappe(r) og {1} fil(er) vil blive slettet.\n\nElementer: {2} Når først de er slettet kan det ikke fortrydes";
localizations.DeleteNoFilesSelectedMessage = "Vælg venligst hvilke fil(er)/mappe(r) der skal slettes";
localizations.FormValidationFailText = "Der er indtastet forkert værdi i de med * markederede felter";
localizations.FormEmailValidationFailText = "<br> - Indtast gyldig email adresse i modtagerfeltet(-erne)";

// Treeview header items
localizations.TreeviewHeaderNameText = "Navn";
localizations.TreeviewHeaderSizeText = "Størrelse";
localizations.TreeviewHeaderModifiedText = "Ændret";
localizations.TreeviewHeaderKeywordsText = "Nøgleord";

// Other treeview relatd items
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Vis træstruktur";

localizations.TreeviewSpecificActionMsgTitleText = "Kun til træstruktur";
localizations.TreeviewSpecificActionMsgDescText = "Dette er kun relevant ved visning i træstruktur";

//Selection menu items
localizations.SelectItemOptionLinkText = "Vælg efter kriterie";
localizations.SelectCheckboxContextMenuToggleText = "Vis/Skjul";
localizations.SelectCheckboxContextMenuCheckAllText = "Alle elementer";
localizations.SelectCheckboxContextMenuUncheckAllText = "Ingen";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Alle filer";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Alle mapper";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Elementer der begynder med \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Ændret i dag";
localizations.SelectCheckboxContextMenuCheckWeekText = "Ændret i denne uge";
localizations.SelectCheckboxContextMenuCheckMonthText = "Ændret i denne måned";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Ændret indenfor de sidste 60 dage";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Ændret indenfor de sidste 90 dage";

// Pagesize selection
localizations.PageSizeSelectionLinkText = "Vis {0} elementer på siden";
localizations.pagingSizeAllText = "Alle (langsom ved mange filer/mapper)";

//Sharing Window
localizations.ShareWindowHeaderText = "Deling af filer";
localizations.ShareWindowFilesSharingLabelText = "Deling :";
localizations.ShareWindowShareTypeLabelText = "Delingstype :";
localizations.ShareWindowShareTypeLabelCopyText = "Kopier";
localizations.ShareWindowShareTypeLabelMoveText = "Flyt";
localizations.ShareWindowShareTypeLabelReferenceText = "Reference";
localizations.ShareWindowShareToInternalUserLabelText = "Intern deling";
localizations.ShareWindowShareToExternalUserLabelText = "Ekstern deling";
localizations.ShareWindowDownloadLabelText = "Download";
localizations.ShareWindowUploadLabelText = "Upload";
localizations.ShareWindowDeleteLabelText = "Slet";
localizations.ShareWindowSendEmailLabelText = "Send e-mail :";
localizations.ShareWindowExpiresLabelText = "Udløber :";
localizations.ShareWindowFromLabelText = "Fra : ";
localizations.ShareWindowToLabelText = "Til : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "BCC : ";
localizations.ShareWindowSubjectLabelText = "Emne : ";
localizations.ShareWindowBodyLabelText = "Brødtekst : ";
localizations.ShareWindowAdvancedLabelText = "Avanceret";
localizations.ShareWindowAttachThumbsLabelText = "Vedhæft miniature-billede";
localizations.ShareWindowAccessLabelText = "Fuld adgang (læse, skrive, slette) ";
localizations.ShareWindowSendButtonText = "Send";
localizations.ShareWindowCancelButtonText = "Annuller";
localizations.ShareWindowUsernameMethodLabelText = "Delingsmetode : ";
localizations.ShareWindowUsernameLabelText = "Del med intern bruger";
localizations.ShareWindowUsernamesLabelText = "Brugernavne : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Adskil flere brugernavne med komma.)";
localizations.ShareActionCompleteShareUsernamesText = "De følgende brugere har fået adgang til delt indhold.";
localizations.ShareActionCompleteUsernameText = "Brugernavn: ";
localizations.ShareActionCompletePasswordText = "Kodeord: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "Ok";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Indtast venligst en gyldig e-mail adresse. Du kan indtaste flere adresse ved at adskille dem med komma - f.eks. <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareNothingSelectedGrowlText = "Intet valgt til deling";
localizations.ShareWindowMaxUsesLabelText = "Antal gange delingen kan anvendes : ";
localizations.ShareWindowAttachFileLabelText = "Vedhæft filer";
localizations.ShareWindowInternalLookupAvailableUsersLabelText = "Tilgængelige brugere";
localizations.ShareWindowInternalLookupSelectedUsersLabelText = "Valgte brugere";
localizations.ShareWindowInternalLookupFilterLabelText = "Filter";
localizations.ShareWindowInternalLookupFilterLabelText2 = "Filter";
localizations.ShareWindowInternalLookupSelectLabelText = "Vælg";
localizations.selectAllAvailableUsers = "Alle";
localizations.selectNoneAvailableUsers = "Ingen";
localizations.removeSelectedUsers = "Fjern markederede";
localizations.ShareWindowInternalLookupSelectLabelText2 = "Vælg";
localizations.selectAllSelectedUsers = "Alle";
localizations.selectNoneSelectedUsers = "Ingen";
localizations.ShareWindowInternalUserQuickSelectLabelText = "Vælg brugere fra liste";
localizations.ShareWindowUsernamePermissionsLabelText = "Rettigheder";
localizations.ShareWindowExpiresInDaysLabelText = "dage";
localizations.ShareGeneratePassAuto = "Automatisk";
localizations.ShareWindowUserPassGenerateLabelText = "Generer selv";
localizations.ShareWindowCommentsLabelText = "Kommentar";
localizations.ShareWindowDirectLinkLabelText = "Direkte link til deling?";

//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Kopier direkte link.";
localizations.CopyLinkText = "Kopier link";

//Create folder window
localizations.CreateFolderWindowHeaderText = "Opret ny mappe.";
localizations.CreateFolderInputDefaultFolderName = "Ny mappe";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Gå til mappen efter den er oprettet ";
localizations.CreateFolderButtonText = "Opret";

if(typeof window.locale != "undefined")
{
    window.locale.fileupload.SwitchToNormalUpload = "Skift til normal upload";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Skift til avanceret upload";
}
// Browser upload window
localizations.BrowserUploaderAdvancedBrowseButtonText = "Avanceret gennemsyn...";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} af {1} emne (r)";
localizations.BrowserUploaderAdvancedUploadingFilesText = "I alt {0} fil (er)";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Overfører til:";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Nuværende hastighed:";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Gennemsnitshastighed : ";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Upload filer ved at anvende den avancerede uploader, <br>den muliggør overførsel af mapper, og i flere tilfælde går overførslen hurtigere.";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Tid: Forbrugt: <span class='elapsed'>{0}</span> <span class='remained'>, Tilbage : {1}</span></div>";
localizations.BatchCompleteText = "Resultat";
localizations.BrowserUploaderCancelledUploadMsgText = "Upload annulleret";
localizations.BrowserUploaderClearCompletedLinkText = "Fjern gennemførte uploads";
localizations.browserUploaderDragDropHoverLabelText = "Træk filer hertil for at uploade";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} er allerede blevet tilføet.";
localizations.BrowserUploaderFileAddedAlreadyText = "Denne fil er allerede blevet tilføjet.";
localizations.BrowserUploaderFormNextButtonText = "Næste";
localizations.BrowserUploaderFormResetButtonText = "Nulstil";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} er allerede tilføjet.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Disse filer er allerede tilføjet.";
localizations.browserUploaderNativeUploadTipSetTitle = "Upload filer ved hjælp af browser.";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problem under overførsel";
localizations.BrowserUploaderResumeCheckboxText = "Genoptag";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Opmærksomhed påkrævet";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Annuller";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Afvis";
localizations.BrowserUploaderSelectedFileDoneText = "Færdig";
localizations.BrowserUploaderSelectedFileExistsText = "Filen eksisterer allerede";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorer";
localizations.BrowserUploaderSelectedFileOverwriteText = "Overskriv";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Sat på pause";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pause";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "download igen";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Fjern";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Genoptag";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "Upload igen";
localizations.BrowserUploaderSelectedFilesGroupText = "Filgruppen:";
localizations.BrowserUploaderSelectedFileUploadedText = "uploadet til";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "vil blive overskrevet";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "vil blive uploadet til";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Beregner..";
localizations.BrowserUploaderStartUploadingLinkText = "Start upload";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Upload detaljer";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Upload filer";
localizations.BrowserUploaderWindowHeaderText = "Upload fil";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Dine filer er i gang med at uploade. Hvis du navigerer væk fra denne side vil du potentielt miste dem. Er du sikker på du vil forlade denne side?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Dine filer er i gang med at downloade. Hvis du navigerer væk fra denne side vil du potentielt miste dem. Er du sikker på du vil forlade denne side?";
localizations.browserUploaderDragDropLabelText = "Træk og slip filer her for at uploade";
localizations.browserUploaderChromeDragDropLabelText = "Træk og slip filer og mapper her for at uploade";

//New upload bar localizations
localizations.browseFileLabelByClass = "Tilføj filer...";
localizations.advancedUploadResumeLabelByClass = "Genoptag";
localizations.filesToUploadQueueWindowHeader = "Filer der skal uploades";
localizations.uploadWindowStartUploadingByClass = "Start upload";
localizations.uploadWindowCancelUploadingByClass = "Annuller upload";
localizations.uploadWindowClearUploadedByClass = "Fjern filer der er uploadet";
localizations.uploadWindowOverwriteAllByClass = "Overskriv alle";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Fjern alle med fejl";
localizations.uploadWindowSummaryFilesByClass = "Filer : ";
localizations.uploadWindowSummarySizeByClass = ", Størrelse på upload : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Vis/Skjul de valgte filer";
localizations.uploadBarAttentionTitle = "Tilføj nu filer fra uploadbjælken";
localizations.uploadBarAttentionText = "Anvend uploadbjælken til at tilføje filer til upload. Klik på \"" + localizations.browseFileLabelByClass + "\" knappen for at tilføje filer";
localizations.globalProgressbarSkipLabelByClass = "Spring over";
localizations.globalProgressbarPauseLabelByClass = "Pause";
localizations.globalProgressbarStopLabelByClass = "Stop";

//For Advanced Upload Options
localizations.advancedUploadOptionsDialogTitle = "Avanceret upload indstillinger";
localizations.advancedUploadOptionsDialogSaveButtonText = "Gem";
localizations.advancedUploadOptionsItemAvailableLabel = "Når eksisterende element findes :";
localizations.advancedUploadOptionsUseCompressionLabel = "Brug komprimering :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Bekræft handling";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Bekræft venligst handling for filen :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Handling :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Overskriv";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Overskriv alle";
localizations.advancedUploadActionResumeSelectOptionText = "Genoptag";
localizations.advancedUploadActionResumeAllSelectOptionText = "Genoptag alle";
localizations.advancedUploadActionSkipSelectOptionText = "Spring over";
localizations.advancedUploadActionSkilAllSelectOptionText = "Spring over alle";
localizations.advancedUploadActionAskSelectOptionText = "Spørg";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Ja";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Nej";

//Search window
localizations.SearchWindowHeaderText = "Søg";
localizations.SearchWindowKeywordsLabelText = "Nøgleord :";
localizations.SearchWindowKeywordsOnlyLabelText = "Søg kun i nøgleord.";
localizations.SearchWindowOptionTypeOrLabelText = "eller";
localizations.SearchWindowOptionTypeAndLabelText = "og";
localizations.SearchWindowExactLabelText = "Nøjagtig?";
localizations.SearchWindowByClassModifiedLabelText = "Ændret";
localizations.SearchWindowByClassDateFormatLabelText = "dd.MM.yyyy";
localizations.SearchWindowSizeLabelText = "Størrelsen er ";
localizations.SearchWindowSizeLabelByClassText = "Størrelsen er ";
localizations.SearchWindowTypeLabelText = "Typen er en";
localizations.SearchWindowSizeUnitLabelText = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Start søgning";
localizations.SearchWindowCancelButtonText = "Annuller";
localizations.SearchResultDisplayText = "Søgeresultat:";
localizations.SearchResultClearLinkText = "(Nulstil søgefilter)";
localizations.SearchFormModifiedOptionAfterText = "Efter";
localizations.SearchFormModifiedOptionBeforeText = "Før";
localizations.SearchFormSizeOptionBiggerThanText = "Større end";
localizations.SearchFormSizeOptionSmallerThanText = "Mindre end";
localizations.SearchFormItemTypeOptionFileText = "Fil";
localizations.SearchFormItemTypeOptionFolderText = "Mappe";
localizations.SearchProcessNotificationText = "Bearbejder... ";
localizations.SearchProcessCancelText = "Annuller";

//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Alle <strong>{count}</strong> elementer på denne side er valgt.";
localizations.ItemsSelectionSelectAllItemsInDir = "Vælg alle <strong>{total_items}</strong> elementer i <strong>{list_type}</strong> (inkluder skjulte elementer)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Alle <strong>{total_items}</strong> elementer i <strong>{list_type}</strong> (inklusiv skjulte elementer) er valgt";
localizations.ItemsSelectionClearSelection = "Nulstil udvalgte elementer";
localizations.ItemsSelectionShowingFolderText = "Nuværende mappe";
localizations.ItemsSelectionShowingFilteredItemsText = "Nuværende filtrerede lists";
localizations.ItemsSelectionShowingSearchedItemsText = "Søgeresultat";

// Filter sektion
localizations.ClearFilterLinkText = "Ryd";
localizations.ClearFilterLinkTextBasket = "Ryd";
localizations.clearUsdFilter = "Ryd";
localizations.clearAvlUsers = "Ryd";

//User options window
localizations.UserOptionsWindowHeaderText = "Indstillinger";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Skjul '.' elementer ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Skjul tjekboks kolonnen ";
localizations.UserOptionsWindowHideFilterLabelText = "Skjul filtreringssektionen ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Start upload med det samme en fil er valgt til upload. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Indlæs Java appletten når interfacet indlæses.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Deaktiver komprimering på Java appletten. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Skift dit kodeord ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Nuværende kodeord: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nyt kodeord: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Bekræft kodeord:";
localizations.UserOptionsWindowChangePasswordButtonText = "Skift kodeord";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generer tilfældigt kodeord";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Anvend dette";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Annuller";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Vis/Skjul";
localizations.MainCheckboxContextMenuCheckAllText = "Marker alle";
localizations.MainCheckboxContextMenuUncheckAllText = "Fravælg alle";

//Keywords window
localizations.KeywordsWindowHeaderText = "Nøgleord";
localizations.KeywordsWindowUpdateLinkText = "Opdater";
localizations.KeywordsWindowCancelLinkText = "Annuller";

//File basket
localizations.BasketHeaderText = "Filer i kurven";
localizations.BasketClearAllLinkText = "Fjern alle";
localizations.BasketDownloadLinkText = "Download kurven";
localizations.BasketDownloadAdvancedLinkText = "Download kurv (avanceret)";
localizations.BasketNoFilesAvailableText = "Ingen valgte filer";
localizations.BasketRemoveLinkText = "Fjern";
localizations.BasketTotalItemText = "{0} elementer ";
localizations.BasketFileAddedAlreadyText = "Filen er allerede tilføjet til kurven";
localizations.BasketFileAddedAlreadyDetailsText = "Den valgte fil er allerede tilgængelig i kurven";
localizations.BasketNothingSelectedToAddText = "Der er ikke valgt noget der skal tilføjes til kurven";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Er du sikker på at du vil tømme kurven?";
localizations.BasketShareItemsLinkText = "Del emner";
localizations.BasketHeaderText = "Filer i kurven";

//Paste form panel
localizations.PasteFormHeaderText = "Indsæt";
localizations.PasteFormResetButtonText = "Nulstil";
localizations.PasteFormPasteButtonText = "Indsæt";
localizations.PasteFormErrorHeaderText = "Problem under indsættelse";
localizations.PasteFormErrorDetailsText = "Der opstod et problem under indsættelsen af flere elementer.<br />Error : {0}";
localizations.PasteFormErrorNothingToPasteText = "Der er intet i udklipsholderen";

// Welcome form panel
localizations.WelcomeFormHeaderText = "Velkommen";
localizations.WelcomeFormOkButtonText = "OK";

// Slideshow popup
localizations.SlideshowPopupHeaderText = "Slideshow";
localizations.QuickViewCurrentImagePositionText = "Emne {current} af {total}";
localizations.QuickViewNoItemsAvailableGrowlText = "Ingen emner tilgængelig";
localizations.QuickViewNothingToShowGrowlText = "Fejl : Ingenting at vise i hurtig visning";
localizations.QuickViewRotateClockwiseTooltipText = "Roter med uret";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Roter mod uret";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow.waitMessage = "Vent venligst ...";
localizations.slideshow.playSlideshow = "Start sideshow";
localizations.slideshow.pauseSlideshow = "Pause slideshow";
localizations.slideshow.refresh = "Opdater";
localizations.slideshow.fullscreen = "Fuld skærm";
localizations.slideshow.download = "Download";
localizations.slideshow.upload = "Upload";
localizations.slideshow.deleteText = "Slet";
localizations.slideshow.rotateClockwise = "Roter med uret";
localizations.slideshow.rotateCounterClockwise = "Roter mod uret";
localizations.slideshow.previousItem = "Forrige";
localizations.slideshow.nextItem = "Næste";
localizations.slideshow.delayText = "(Vent {x} sekunder)";
localizations.slideshow.nextPageText = "Næste &rsaquo;";
localizations.slideshow.prevPageText = "&lsaquo; Forrige";
localizations.slideshow.itemCountText = "(Emne {x} af {y})";
localizations.slideshow.noItemMessage = "<h3 style='text-align:center;'>Ingen emner tilgængelig. Problemer med at hente oplysninger.</h3>";

//Custom form
localizations.customFormCompareValueMatchValidationFailedText = "Værdien matcher ikke";
localizations.customFormPasswordMatchValidationFailedText = "Kodeord er ikke ens";

//Manage Share window
localizations.ManageShareWindowClearFilterText = "Nulstil";
localizations.ManageShareWindowHeaderText = "Administrer delinger";
localizations.ManageShareWindowRefreshLinkText = "Opdater";
localizations.ManageShareWindowDeleteSelectedLinkText = "Slet valgte elementer";
localizations.ManageShareWindowDeleteLinkText = "Slet";
localizations.ManageShareWindowHideLinkText = "Skjul";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "Fra";
localizations.ManageShareWindowGridToLabelText = "Til";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridSubjectLabelText = "Emne";
localizations.ManageShareWindowGridBodyLabelText = "Brødtekst";
localizations.ManageShareWindowGridShareTypeLabelText = "Delingstype";
localizations.ManageShareWindowGridUserNameLabelText = "Brugernavn";
localizations.ManageShareWindowGridPasswordLabelText = "Kodeord";
localizations.ManageShareWindowGridAttachedLabelText = "Vedhæftet i e-mail?";
localizations.ManageShareWindowGridUploadLabelText = "Tillad upload?";
localizations.ManageShareWindowGridPathsLabelText = "Stier";
localizations.ManageShareWindowGridCreatedLabelText = "Oprettet";
localizations.ManageShareWindowGridExpiresLabelText = "Udløber";
localizations.ManageShareWindowGridSharedItemsLabelText = "Delte elementer";
localizations.ManageShareWindowGridDownloadsLabelText = "Antal downloads";
localizations.ManageShareWindowNextItemText = "Næste";
localizations.ManageShareWindowPrevItemText = "Forrige";
localizations.ManageShareWindowNothingToShowMessageText = "Intet at vise";
localizations.ManageShareWindowNothingSelectedToDeleteMessageText = "(Intet valgt til sletning)";
localizations.ManageShareWindowDeleteAccountConfirmationText= "Er du sikker på du vil slette den/de valgte {count} konto/konti ?";
localizations.ManageShareWindowUserDeletedMessageText = "(Bruger : {name} slettet)";
localizations.ShareWindowMaxUsesUnlimitedText = "Ubegrænset";
localizations.ManageShareWindowGridCommentLabelText = "Kommentar";
localizations.ManageShareWindowGridRemainingUsesLabelText = "Resterende downloads";
localizations.ManageShareWindowItemNoteLabelText = "delinger";
localizations.ManageShareWindowTotalLabelText = "I alt : ";
localizations.ShareWindowUserPassLabelText = "Brugernavn / kodeord";
localizations.ShareWindowByClassUserPassGenerateLabelText = "Generer";

//Rename window and panel
localizations.RenameWindowHeaderText = "Omdøb";
localizations.RenamePanelSaveLinkText = "Gem";
localizations.RenamePanelCancelLinkText = "Annuller";

localizations.SyncAppNameWindowHeaderText = "Sync administratorkodeord";
localizations.SyncAppNamePanelSaveLinkText = "Ok";
localizations.SyncAppNamePanelCancelLinkText = "Annuller";

//Tooltip info
localizations.TooltipNameLabelText = "Navn";
localizations.TooltipSizeLabelText = "Størrelse";
localizations.TooltipModifiedLabelText = "Ændret";
localizations.TooltipKeywordsLabelText = "Nøgleord";
localizations.ThumbnailsTooltipText = "<strong>"+localizations.TooltipNameLabelText+" : </strong>{text}<br /><strong>"+localizations.TooltipSizeLabelText+" : </strong>{size}<br /><strong>"+localizations.TooltipModifiedLabelText+" : </strong>{date}<br /><strong>"+localizations.TooltipKeywordsLabelText+" : </strong> {keywords}";

// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Vis {0} elementer pr. side";

// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Vælg elemmenter til upload..";
localizations.advancedDownloadPathSelectionWindowTitle = "Vælg stien hvortil der skal downloades..";
localizations.advancedOperationsDownloadStatus = "Downloader";
localizations.advancedOperationsUploadStatus = "Uploader";


localizations.maxAllowedDownloadSizeReached = "Downloadstørrelsen overskrider den maksimale tilladte størrelse"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Maksimal tilladte størrelse til download : {size}. <br />Anvend den avancerede downloader, eller tilføj til downloadkurven i stedet for."; //Text of growl to display when download reaches maximum allowed size

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Skift ikon ";
localizations.ChangeIconWindowInstructionsText = "Vælg et lille billede der skal bruges som ikon for valgte elementer:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Valgt fil : ";
localizations.ChangeIconWindowCancelLinkText = "Annuller";
localizations.ChangeIconWindowUpdateLinkText = "Gem";
localizations.ChangeIconFileSelectAlertText = "Vælg venligst en billedfil for at fortsætte.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Udpakning er påbegyndt";
localizations.UnzipStartedAlertDescText = "Udpakningen af de valgte filer er påbegyndt";
localizations.UnzipCompletedAlertTitleText = "Udpakningen er gennemført";
localizations.UnzipCompletedAlertDescText = "Udpakning er færdig for de valgte filer";
localizations.UnzipNoFilesSelectedMessage = "Vælg hvilken fil der skal udpakkes";

//zip operation
localizations.ZipStartedAlertTitleText = "Pakningen er påbegyndt";
localizations.ZipStartedAlertDescText = "Pakningen af de valgte filer er påbegyndt";
localizations.ZipCompletedAlertTitleText = "Pakningen er gennemført";
localizations.ZipCompletedAlertDescText = "Pakningen af de valgte filer er afsluttet";
localizations.ZipNamePanelCancelLinkText = "Annuller";
localizations.ZipNamePanelSaveLinkText = "Ok";
localizations.ZipNameWindowHeaderText = "Zip fil-name";

//Signup-Page
localizations.RegisterWindowProcessCompleteMessage = "Du kan logge ind med den oprettede bruger så snart den er aktiveret af administratoren.";

//Data size format items
localizations.dataFormatBytes = "bytes";
localizations.dataFormatKiloBytes = "KB";
localizations.dataFormatMegaBytes = "MB";
localizations.dataFormatGigaBytes = "GB";
localizations.dataFormatTeraBytes = "TB";

//Server message localized
localizations.share_complete = "Deling gennemført.";
localizations.share_email_sent = "E-mailen blev afsendt.";
localizations.share_open_in_email_client = "Åben i dit e-mailprogram";

localizations.syncAppName = "CrushSync";

//SyncManager localized
localizations.syncManagerEnterCrushSyncPasswordText = "Indtast CrushSync kodeord :";
localizations.syncManagerEnterPasswordTitleText = "Kodeord";
localizations.syncManagerPageTitleText = "CrushSync - WebInterface";
localizations.syncManagerRefreshButtonText = "Opdater";
localizations.syncManagerPleaseWaitText = "Vent venligst...";
localizations.syncManagerChangeAdminPasswordText = "Skift agenten/agenternes administrator-kodeord";
localizations.syncManagerDataTakingLongTimeNoteText = "Hvis det tager for lang tid at vise synkroniseringsagenterne, tjek at <strong>CrushSync</strong> kører og er konfigureret rigtigt.";
localizations.syncManagerAdminPasswordNotCorrectText = 'Forkert administrator-kodeord. <a href="#" class="reloadPage">Klik her</a> for at indtaste kodeordet igen.';
localizations.syncManagerConfigTabText = "Konfiguration";
localizations.syncManagerLogTabText = "Log";
localizations.syncManagerStatusLabelText = "Status =";
localizations.syncManagerSyncNotRunningTitleText = "Kører ikke";
localizations.syncManagerSyncUploadTitleText = "Upload";
localizations.syncManagerSyncDownloadTitleText = "Download";
localizations.syncManagerTestButtonText = "Test";
localizations.syncManagerCreateNewSyncButtonText = "Opret ny Sync";
localizations.syncManagerSetAgentNameButtonText = "Indstil agentnavn";
localizations.syncManagerLastAgentCommunicationText = "Sidste agentkommunikation : ";
localizations.syncManagerStartButtonText = "Start Sync";
localizations.syncManagerStopButtonText = "Stop Sync";
localizations.syncManagerDeleteButtonText = "Slet konfiguration";
localizations.syncManagerAdvancedSettingsButtonText = "Avancerede indstillinger";
localizations.syncManagerSaveSettingsButtonText = "Gem indstillinger";
localizations.syncManagerLocalFolderText = "Lokal mappe =";
localizations.syncManagerRequestSubmittedText = "Din forespørgsel blev modtaget på serveren, vent venligst imens data opdateres.";
localizations.syncManagerServerPathNotValidText = "Den valgte server-sti er ikke gyldig eller Sync er ikke slået til";
localizations.syncManagerErrorText = "Fejl : ";
localizations.syncManagerBrowseButtonText = "Gennemse";
localizations.syncManagerServerPathText = "Server-sti =";
localizations.syncManagerAutoStartText = "Autostart Sync";
localizations.syncManagerAllowTunnelText = "Tillad tunnel?";
localizations.syncManagerAllowCompressionText = "Tillad kompression?";
localizations.syncManagerReadOnlyText = "Skrivebeskyttet?";
localizations.syncManagerDontWaitForStabilizationText = "Vent ikke for fil-stabilisering";
localizations.syncManagerScheduledTimesText = "Planlæg tider =";
localizations.syncManagerAddButtonText = "Tilføj";
localizations.syncManagerRefreshLogButtonText = "Opdater Log";
localizations.syncManagerLiveUpdateText = "Live opdatering";
localizations.syncManagerScrollWithActivityText = "Scroll ved aktivitet";
localizations.syncManagerFindText = "Find =";
localizations.syncManagerRegexSearchText = "Regex søgning?";
localizations.syncManagerClearFilterText = "Nulstil";
localizations.syncManagerEmailLogButtonText = "E-mail log";
localizations.syncManagerLogLastUpdatedText = 'Log sidst opdateret : <span class="logUpdatedTimestamp"></span>';
localizations.syncManagerBackToTopText = "Tilbage til toppen";
localizations.syncManagerExistingPasswordText = "Nuværende kodeord =";
localizations.syncManagerNewPasswordText = "Nyt kodeord =";
localizations.syncManagerConfirmPasswordText = "Bekræft kodeord =";
localizations.syncManagerEnterPasswordText = "Indtast venligst et kodeord";
localizations.syncManagerPasswordDoesNotMatchText = "De to kodeord stemmer ikke overens";
localizations.syncManagerPasswordChangedText = "Dit kodeord blev ændret, log venligst ind igen.";
localizations.syncManagerEnterAgentNameText = "Indtast agentnavn :";
localizations.syncManagerUnableToConnectToTheServerText = "Indtast agentnavn :";
localizations.syncManagerMailSentText = "E-mail afsendt : ";
localizations.syncManagerMailSentDescText = "Log blev sendt via e-mail";
localizations.syncManagerMailSendingFailedText = "Afsendelse af e-mail fejlede : ";
localizations.syncManagerEnterTimeText = "Indtast et planlægningstidspunkt : (24-timers format)";
localizations.syncManagerScheduleTitleText = "Planlægningstidspunkt";
localizations.syncManagerInvalidTimeText = "Forkert tidsformat, prøve venligst igen";

/*Date picker language translation*/
/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define([ "../jquery.ui.datepicker" ], factory );
    } else {
        // Browser globals
        factory( jQuery.datepicker );
    }
}(function( datepicker ) {
    $.datepicker.regional['da'] = {
        closeText: 'Luk',
        prevText: '&#x3c;Forrige',
        nextText: 'Næste&#x3e;',
        currentText: 'Idag',
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
        dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
        dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
        dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
        weekHeader: 'Uge',
        dateFormat: 'dd-mm-yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['da']);
    return datepicker.regional['da'];
}));

//Webinterface labels
localizations.CopyrightText = "Powered by &copy; CrushFTP</a>";