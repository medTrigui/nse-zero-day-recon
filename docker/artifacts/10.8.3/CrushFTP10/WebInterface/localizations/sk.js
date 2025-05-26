//Slovak localization by Jozef Steglik (jozef.steglik@gmail.com)

/*Login page specific*/
localizations.BadLoginInfoText = "Vaše uživateľské meno alebo heslo sú nesprávne, alebo Vášmu účetu vypršala platnosť.";
localizations.ServerErrorInfoText = "Server nie je dostupný alebo bola Vaša IP zablokovaná.";
localizations.PasswordsDoNotMatchAlertText = "Heslá sa nezhodujú.";
localizations.LoginAgainTitleText = "Prosím prihláste sa znova";
localizations.LoginWithNewPassText = "Prihlásiť sa s novým heslom";
localizations.AuthenticatingMsgText = "Autentifikácia...";
localizations.LoginSuccessText = "V poriadku";
localizations.LoadingWebInterfaceText = "Nahrávam WebInterface...";
localizations.LoginWarningText = "Varovanie";
localizations.MultipleBadLoginsAlertDescText = "Príliš veľa chybných pokusov môže viesť k zablokovaniu Vašej IP adresy.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>kliknite <a style='color:white;' href='/WebInterface/jQuery/reset.html'>SEM</a> pre reset hesla.</div>";
localizations.LoginFailedText = "Prihlásenie neúspešné";
localizations.ChangePasswordGrowlTitleText = "Zmeniť heslo";
localizations.UserNameText = "Uživateľske meno";
localizations.PasswordText = "Heslo";
localizations.LoginButtonText = "Prihlásiť";
localizations.ForgotPasswordLinkText = "Zabudol som heslo, pošlite mi ho.";
localizations.ChangePasswordHeaderText = "Zmeňte svoje heslo";
localizations.ChangePasswordNoteText = "Pre pokračovanie musíte zmeniť heslo";
localizations.CurrentPasswordText = "Aktuálne heslo : ";
localizations.NewPasswordText = "Nové heslo : ";
localizations.ConfirmPasswordText = "Potvrďťe heslo : ";
localizations.CancelButtonText = "Zrušiť";
localizations.ChanngePasswordButtonText = "Zmeniť heslo";
localizations.GeneratePasswordButtonText = "Vygenerovať heslo";
localizations.GeneratePasswordUseButtonText = "Použiť toto";
localizations.GeneratePasswordCancelButtonText = "Zrušiť";
localizations.OldBrowserNoticeHTMLAsText = 'Váš prehliadač je zastaralý, pomalý, plný bugov a tento WebInterface môže, ale nemusí fungovať správne <br><br><div style="text-align:right;"><button id="proceedAnyway">Aj tak pokračovať</button> alebo si stiahnite lepší browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Súbor je príliš veľký",
            "minFileSize": "Súbor je príliš malý",
            "acceptFileTypes": "Súbor s touto koncovkou nie je povolený",
            "maxNumberOfFiles": "maximálny počet súborov prekročený",
            "uploadedBytes": "nahraté byty súboru prekročené",
            "emptyResult": "Výsledky nahrávanie Prázdneho súboru",
            "fileAvailableInSelectedFolder": "Súbor už bol pridaný na nahratie do rovnakého adresára",
            "fileExistOnServer": "Súbor existuje na serveri",
            "fileBiggerThanAllowed": "Súbor je väčší ako povolená veľkosť",
            "dirNoWritable": "Nemôžete nahrávať do tohto adresára",
            "blockUploadingDirs": "Nahrávanie adresára nie je povolené",
            "true": "pravda"
        },
        "error": "Chyba",
        "start": "Štart",
        "waiting": "Čakám...",
        "uploading": "Nahrávam : ",
        "reupload": "Re-Upload",
        "share": "Zdieľať",
        "cancel": "Zrušiť",
        "destroy": "Zmazať",
        "overwrite": "Prepísať",
        "uploadTo": "Nahrať do : ",
        "pause": "Pauza",
        "errorLabel": "Chyba : ",
        "details": "Detaily",
        "uploadedInLabelText": "Nahraté do : ",
        "atAvgSpeedOfLabelText": "pri priemernej rýchlosti : ",
        "uploadCompletedText": "Nahrávanie dokončené",
        "uploadedFileText": "Súbor nahratý na server",
        "uploadedMultipleFilesText": "Všetky súbory nahraté."
    }
};

localizations.buttons = {
    "admin": "admin",
    "delete": "zmazať",
    "rename": "premenovať",
    "download": "stiahnuť",
    "advanced download": "pokročilé sťahovanie",
    "zipdownload": "ZipStiahnutie",
    "unzip": "unzip",
    "zip selected": "zip vybraté",
    "explore zip contents": "preskúmať obsah zip",
    "create folder": "vytvoriť adresár",
    "upload": "nahrať",
    "search": "hľadať",
    "user options": "uživateľské možnosti",
    "cut": "vystrihnúť",
    "copy": "kopírovať",
    "paste": "vložiť",
    "slideshow": "slideshow",
    "quickview": "rýchly náhľad",
    "download low-res": "stiahnuť Low-Res",
    "preview": "náhľad",
    "batchcomplete": "BatchComplete",
    "share": "zdieľať",
    "quick share": "rýchle zdieľanie",
    "manage shares": "spravovať zdieľania",
    "show basket": "zobraziť košík",
    "add to basket": "pridať do košíka",
    "edit keywords": "upraviť kľúčové slová",
    "change icon": "zmeniť ikonu",
    "download crushtunnel": "stiahnuť CrushTunnel",
    "help": "pomoc",
    "login": "prihlásiť",
    "logout": "odhlásiť",
    "download sync app": "stiahnuť Sync App",
    "download crushftpdrive": "stiahnuť CrushFTPDrive",
    "sync manager": "Sync Manager"
};

localizations.currentLanguageName = "Slovak"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Anglický (English)";
localizations.languageNameCzech = "Český (Čeština)";
localizations.languageNameDanish = "Dánsky (Danske)";
localizations.languageNameDutch = "Holandský (Nederlands)";
localizations.languageNameFrench = "Francúzsky (Français)";
localizations.languageNameGerman = "Nemec (Deutsch)";
localizations.languageNameHungarian = "Maďarský (Magyar)";
localizations.languageNameItalian = "Talianský (Italiano)";
localizations.languageNamePolish = "Poľský (Polskie)";
localizations.languageNameSpanish = "Španielsky (Español)";
localizations.languageNameSlovak = "Slovenský";
localizations.languageNameChinese = "Čínsky (中國)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";

//WebInterface
localizations.FilterText = localizations.FilterTextBasket = "Filter:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Zrušiť Filter";
localizations.FileCounterItemsText = "Položky";
localizations.FileCounterFoldersText = "Adresáre";
localizations.FileCounterFilesText = "Súbory";
localizations.FileCounterHiddenItemsText = "Skryté položky";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Zobraziť náhľady";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Zobraziť zoznam";
localizations.DownloadResumeTextLabelBasket = "Pokračovať"
localizations.BackToTopLinkText = "Späť hore";
localizations.FilesNotAvailableMessage = "Žiadne dostupné súbory";
localizations.CopyNoFilesSelectedMessage = "Vyberte súbory/adresáre na kopírovanie";
localizations.DeleteNoFilesSelectedMessage = "Vyberte súbory/adresáre na zmazanie";
localizations.UnzipNoFilesSelectedMessage = "Vyberte súbor na rozbalenie";
localizations.CutNoFilesSelectedMessage = "Vyberte súbory/adresáre na vystrihnutie";
localizations.pagingPrevText = "Predchadzajúci";
localizations.pagingNextText = "Nasledujúcí";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Položky obsahujúce frázu \"{filterVal}\" : {totalItems} , Adresáre: {folders} Súbory: {files})";
localizations.TotalItemsInDirMsgText = "(Celkom položiek v adresári {count})";
localizations.quotaAvailableLabelText = "k dispozícii";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Chyba: Problém pri ukladaní dát";
localizations.TreeviewSpecificActionMsgTitleText = "Iba v režime zobrazenia Zoznam";
localizations.TreeviewSpecificActionMsgDescText = "Toto je možné použiť iba v režime zobrazenia Zoznam";
localizations.PasswordExpiringMsgText = "Platnosť hesla čoskoro vyprší<br/>Zmeňte si ho v menu Nastavenia.";
localizations.PasswordNotMatchingMsgText = "Hesla sa nezhodujú.";
localizations.PasswordMustBeComplexMsgText = "Heslo musí byť zložitejšie.";
localizations.PasswordChangedMsgText = "Heslo bolo zmenené. Prihláste sa prosím pomocou nového hesla.";
localizations.AppletLoadingFailedMsgText = "Došlo k chybe apletu počas nahrávania";
localizations.DownloadStartedAlertTitleText = "Sťahovanie zahájené";
localizations.DownloadStartedAlertDescText = "Vyberte miesto, kam chcete uložiť súbor(y)";
localizations.LogoutButtonText = "Odhlásenie";
localizations.browserUploaderNativeUploadTipSetTitle = "Nahrávanie súborov cez prehliadač.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Pokročilé nahrávanie súborov, <br>umožňuje nahrávať adresáre a urýchľuje prenos.";
localizations.browserUploaderDragDropHoverLabelText = "Sem pretiahnite súbory";
localizations.appletUploaderDropPanelLabelText = "&darr; Sem pretiahnite súbory &darr;";

//Sharing Window
localizations.ShareWindowHeaderText = "Zdieľať";
localizations.ShareWindowFilesSharingLabelText = "Zdieľanie :";
localizations.ShareWindowShareTypeLabelText = "Typ zdieľania :";
localizations.ShareWindowShareTypeLabelCopyText = "Kopírovať";
localizations.ShareWindowShareTypeLabelMoveText = "Presunúť";
localizations.ShareWindowShareTypeLabelReferenceText = "Odkaz";
localizations.ShareWindowShareToInternalUserLabelText = "Interné";
localizations.ShareWindowShareToExternalUserLabelText = "Externé";
localizations.ShareWindowSendEmailLabelText = "Poslať E-mail :";
localizations.ShareWindowExpiresLabelText = "Vyprší :";
localizations.ShareWindowFromLabelText = "Od : ";
localizations.ShareWindowToLabelText = "Komu : ";
localizations.ShareWindowCCLabelText = "Kópia : ";
localizations.ShareWindowBCCLabelText = "Skrytá kópia : ";
localizations.ShareWindowSubjectLabelText = "Predmet : ";
localizations.ShareWindowBodyLabelText = "Telo správy : ";
localizations.ShareWindowAdvancedLabelText = "Pokročilé";
localizations.ShareWindowAttachThumbsLabelText = "Pripojiť náhľad";
localizations.ShareWindowAccessLabelText = "Plný prístup (čítať, zapisovať, mazať) ";
localizations.ShareWindowSendButtonText = "Zdieľať";
localizations.ShareWindowCancelButtonText = "Zrušiť";
localizations.ShareWindowUsernameMethodLabelText = "Metóda zdieľania : ";
localizations.ShareWindowUsernameLabelText = "Zdieľanie s interným uživateľom";
localizations.ShareWindowUsernamesLabelText = "Uživatelia : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Viac uživateľov oddeľte čiarkami.)";
localizations.ShareActionCompleteShareUsernamesText = "Nasledujúci uživatelia majú povolený prístup k zdieľaným položkám.";
localizations.ShareActionCompleteUsernameText = "Uživateľ: ";
localizations.ShareActionCompletePasswordText = "Heslo: ";
localizations.ShareActionCompleteLinkText = "Odkaz:";
localizations.ShareActionCompleteOkButtonText = "Ok";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Zadajte prosím platnú emailovú adresu. Môžete zadať viac adries oddelených čiarkami, napríklad <strong>bob@email.com, john@email.com,...</strong>";

//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Kopírovať priamy odkaz.";
localizations.CopyLinkText = "Kopírovať odkaz";

//Create folder window
localizations.CreateFolderWindowHeaderText = "Vytvoriť nový adresár.";
localizations.CreateFolderInputDefaultFolderName = "Nový adresár";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Po vytvorení otvoriť adresár ";
localizations.CreateFolderButtonText = "Vytvoriť";

//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Nahrať súubor";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Podrobnosti";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Nahrať súbory";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Pokročilé prehliadanie..";
localizations.BrowserUploaderStartUploadingLinkText = "Začať nahrávanie";
localizations.BrowserUploaderClearCompletedLinkText = "Odstrániť dokončené";
localizations.BrowserUploaderResumeCheckboxText = "Pokračovať";
localizations.BrowserUploaderFormResetButtonText = "Reset";
localizations.BrowserUploaderFormNextButtonText = "Ďalší";
localizations.BrowserUploaderFileAddedAlreadyText = "Tento súbor už bol pridaný.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} už bol pridaný.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Tietou súbory už sú pridané";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} sú už pridané.";
localizations.BrowserUploaderSelectedFilesGroupText = "Skupina súborov : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Odobrať";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Bude nahraté do";
localizations.BrowserUploaderSelectedFileOverwriteText = "Prepísať";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "bude prepisané";
localizations.BrowserUploaderSelectedFileExistsText = "Súbor už existuje";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Vyžaduje pozornosť";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorovať";
localizations.BrowserUploaderSelectedFileDoneText = "Hotovo";
localizations.BrowserUploaderSelectedFileUploadedText = "Nahraté do";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "Znovu nahrať";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "Znovu stiahnuť";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Odstrániť";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Zrušiť";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pauza";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Pozastavené";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Pokračovať";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Celkom {0} súbor(ov)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} z {1} položiek ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Nahrávam do : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Aktuálna rýchlosť : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Priemerná rýchlosť : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Čas: Uplynutý: <span class='elapsed'>{0}</span> <span class='remained'>, Zostávajúci : {1}</span></div>";
localizations.BatchCompleteText = "Výsledok";
localizations.BatchComplete = "Prenosy potvrdené.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Počítam...";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problém pri prenose";
localizations.BrowserUploaderCancelledUploadMsgText = "Zrušené nahrávanie";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Vaše súbory sa práve nahrávajú na server. Pokiaľ opustíte túto stránku, tak o ne prídete. Skutočne chcete opustiť túto stránku?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Vaše súbory su práve sťahujú zo servera. Pokiaľ opustíte túto stránku, tak o ne prídete. Skutočne chcete opustiť túto stránku?";
localizations.NoUploadInDirGrowlText = "Nahrávanie zakázané";
localizations.NoUploadInDirGrowlDesc = "Nahrávanie položiek do vybraného adresára je zakázané";

//New upload bar localizations
localizations.browseFileLabelByClass = "Pridať súbory...";
localizations.advancedUploadResumeLabelByClass = "Pokračovať";
localizations.filesToUploadQueueWindowHeader = "Súbory pripravené na nahratie na server";
localizations.uploadWindowStartUploadingByClass = "Spustiť nahrávanie";
localizations.uploadWindowCancelUploadingByClass = "Zrušiť nahrávanie";
localizations.uploadWindowClearUploadedByClass = "Odstrániť nahraté";
localizations.uploadWindowOverwriteAllByClass = "Prepísať všetko";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Odstrániť všetky s chybami";
localizations.uploadWindowSummaryFilesByClass = "Súbory : ";
localizations.uploadWindowSummarySizeByClass = ", Veľkosť celkovo : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Ukázať/Skryť vybraté súbory";
localizations.uploadBarAttentionTitle = "Pridajte súbory pomocou nahrávacej lišty";
localizations.uploadBarAttentionText = "Použite lištu pre nahrávanie. Kliknite na tlačítko \"" + localizations.browseFileLabelByClass + "\" a vyberte súbory na nahrávanie.";
localizations.globalProgressbarSkipLabelByClass = "Preskočiť";
localizations.globalProgressbarPauseLabelByClass = "Pauza";
localizations.globalProgressbarStopLabelByClass = "Zastaviť";
window.locale.fileupload.errors.fileAvailableInSelectedFolder = "Súbor už bol pridaný do fronty pre nahratie do rovnakého adresára";
window.locale.fileupload.errors.fileExistOnServer = "Súbor už na serveri existuje";
window.locale.fileupload.errors.fileBiggerThanAllowed = "Veľkosť súboru je väčšia ako povolená";
window.locale.fileupload.errors.dirNoWritable = "Nemôžete nahrávať do tohto adresára";
window.locale.fileupload.error = "Chyba";
window.locale.fileupload.start = "Spustiť nahrávanie";
window.locale.fileupload.reupload = "Nahrať znovu";
window.locale.fileupload.cancel = "Odobrať";
window.locale.fileupload.destroy = "Zmazať";
window.locale.fileupload.overwrite = "Prepísať";
window.locale.fileupload.uploadTo = "Nahráť do : ";
window.locale.fileupload.pause = "Pauza";
window.locale.fileupload.errorLabel = "Chyba : ";
window.locale.fileupload.details = "Podrobnosti";
window.locale.fileupload.SwitchToNormalUpload = "Prepnúť na základné nahrávanie";
localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Prepnuť na pokročilé nahrávanie";

//Search window
localizations.SearchWindowHeaderText = "Hľadať";
localizations.SearchWindowKeywordsLabelText = "Kľúčové slová :";
localizations.SearchWindowExactLabelText = "Presne?";
localizations.SearchWindowByClassModifiedLabelText = "Upravené";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/rrrr) ";
localizations.SearchWindowSizeLabelText = "Veľkosť je ";
localizations.SearchWindowTypeLabelText = "Typ je ";
localizations.SearchWindowSizeUnitLabelTextByClass = "(kB)";
localizations.SearchWindowSearchButtonText = "Začať hľadanie";
localizations.SearchWindowCancelButtonText = "Zrušiť";
localizations.SearchResultDisplayText = "Výsledek hľadania:";
localizations.SearchResultClearLinkText = "(Vymazať vyhľadávací filter)";
localizations.SearchFormModifiedOptionAfterText = "Po";
localizations.SearchFormModifiedOptionBeforeText = "Pred";
localizations.SearchFormSizeOptionBiggerThanText = "Väčší ako";
localizations.SearchFormSizeOptionSmallerThanText = "Menší ako";
localizations.SearchFormItemTypeOptionFileText = "Súbor";
localizations.SearchFormItemTypeOptionFolderText = "Adresár";
localizations.SearchProcessNotificationText = "Zpracovávam... ";
localizations.SearchProcessCancelText = "Zrušiť";

//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Všetky <strong>{count}</strong> položky na tejto stránke su vybraté.";
localizations.ItemsSelectionSelectAllItemsInDir = "Vybrať všetky<strong>{total_items}</strong> položky v <strong>{list_type}</strong> (vrátane skrytých)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Všetky <strong>{total_items}</strong> položky v <strong>{list_type}</strong> (vrátane skrytých) sú vybraté";
localizations.ItemsSelectionClearSelection = "Zrušiť výber";
localizations.ItemsSelectionShowingFolderText = "Aktuálny adresár";
localizations.ItemsSelectionShowingFilteredItemsText = "Aktuálny filtrovaný zoznam";
localizations.ItemsSelectionShowingSearchedItemsText = "Výsledky vyhľadávania";

//User options window
localizations.UserOptionsWindowHeaderText = "Nastavenia";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Skryť '.' položky ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Skryť stĺpec s políčkami k zaškrtnutiu ";
localizations.UserOptionsWindowHideFilterLabelText = "Skryť filter ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Začať nahrávať ihneď po výbere súborov";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Spustiť Java aplet počas spustenia UI";
localizations.UserOptionsWindowDisableCompressionLabelText = "Vypnúť kompresiu v Java aplete";
localizations.UserOptionsWindowChangePasswordHeaderText = "Zmena hesla ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Aktuálne heslo: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nové heslo: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Potvrdenie hesla:";
localizations.UserOptionsWindowChangePasswordButtonText = "Zmeniť heslo";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generovať náhodné heslo";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Použiť toto";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Zrušiť";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Prepnúť";
localizations.MainCheckboxContextMenuCheckAllText = "Vybrať všetko";
localizations.MainCheckboxContextMenuUncheckAllText = "Odobrať všetko";

//Keywords window
localizations.KeywordsWindowHeaderText = "Kľúčové slová";
localizations.KeywordsWindowUpdateLinkText = "Aktualizovať";
localizations.KeywordsWindowCancelLinkText = "Zrušiť";

//File basket
localizations.BasketHeaderText = "Súbory v košíku";
localizations.BasketClearAllLinkText = "Vyčistiť všetko";
localizations.BasketDownloadLinkText = "Stiahnuť košík";
localizations.BasketDownloadAdvancedLinkText = "Sttiahnuť košík - pokročilé";
localizations.BasketNoFilesAvailableText = "Žiadne súbory k dispozícii";
localizations.BasketRemoveLinkText = "Odobrať";
localizations.BasketTotalItemText = "Celkom {0} položiek";
localizations.BasketFileAddedAlreadyText = "Súbor už bol pridaný do košíka";
localizations.BasketFileAddedAlreadyDetailsText = "Vybratý súbor sa už nachádza v košíku ";
localizations.BasketNothingSelectedToAddText = "Nebolo vybraté nič, čo by sa dalo pridať do košíka";
localizations.BasketNothingSelectedToAddDetailsText = " ";
localizations.BasketClearAllConfirmMessage = "Určite chcete odobrať všetky vybraté súbory z košíka?";

//Paste form panel
localizations.PasteFormHeaderText = "Vloženie";
localizations.PasteFormResetButtonText = "Reset";
localizations.PasteFormPasteButtonText = "Vložiť";
localizations.PasteFormErrorHeaderText = "Problém pri vkladaní";
localizations.PasteFormErrorDetailsText = "Vyskytol se problém pri vkladaní položiek.<br />Chyba : {0}";
localizations.PasteFormErrorNothingToPasteText = "Nie je čo vložiť";

//Welcome form panel
localizations.WelcomeFormHeaderText = "Vitajte";
localizations.WelcomeFormOkButtonText = "OK";

//Slideshow popup
localizations.SlideshowPopupHeaderText = "Prezentácia";

//Manage Share window
localizations.ManageShareWindowHeaderText = "Spravovať zdieľania";
localizations.ManageShareWindowRefreshLinkText = "Aktualizovať";
localizations.ManageShareWindowDeleteSelectedLinkText = "Zmazať vybraté položky";
localizations.ManageShareWindowGridToLabelText = "Komu";
localizations.ManageShareWindowGridCCLabelText = "Kópia";
localizations.ManageShareWindowGridCreatedLabelText = "Vytvorené";
localizations.ManageShareWindowGridExpiresLabelText = "Vyprší";
localizations.ManageShareWindowGridSharedItemsLabelText = "Zdieľané položky";
localizations.ManageShareWindowGridDownloadsLabelText = "Stiahnutí";
localizations.ManageShareWindowNothingToShowMessageText = "Nie je čo zobraziť";
localizations.ManageShareWindowNothingSelectedToDeleteMessageText = "(Žiadane vybraté položky na zmazanie)";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Skutočne si prajete zmazať vybraté {count} účty?";
localizations.ManageShareWindowUserDeletedMessageText = "(Uživateť : {name} zmazaný)";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Premenovať";
localizations.RenamePanelSaveLinkText = "Uložiť";
localizations.RenamePanelCancelLinkText = "Zrušiť";

//Tooltip info
localizations.TooltipNameLabelText = "Meno";
localizations.TooltipSizeLabelText = "Veľkosť";
localizations.TooltipModifiedLabelText = "Zmenené";
localizations.TooltipKeywordsLabelText = "Kľúčové slová";

//Form alerts and notifications
localizations.FormValidationFailText = "Nesprávne zadanie jednej alebo viacerých položiek. Zadajte prosím správnu hodnotu u položiek ozačených * vo formulári nižšie";
localizations.FormEmailValidationFailText = "<br> - Do príslušného poľa zadajte platnú emailovú adresu";
localizations.DeleteConfirmationMessageText = "Celkom {0} adresárov a {1} súborov bude zmazaných.\n\nPoložky: {2} Táto akcia sa nedá vratiť späť!";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Všetky položky v adresári \"{folder_name}\" budú zmazané.\n\nCelkom {count} položiek bude zmazanych.\n\nTáto operácia sa nedá vrátiť späť!";
localizations.CopyActionGrowlText = "Celkom {0} adresárov a {1} súborov zkopírovaných.";
localizations.CutActionGrowlText = "Celkem {0} adresárov a {1} súborov vystrihnutých.";
localizations.NothingSelectedGrowlText = "Žiadne vybraté položky";
localizations.ShareNothingSelectedGrowlText = "Žiadne vybraté položky na zdieľanie";
localizations.DownloadNothingSelectedGrowlText = "Žiadne vybraté položky na stiahnutie";
localizations.RenameNothingSelectedGrowlText = "Žiadne vybraté položky na premenovanie";
localizations.PreviewNothingSelectedGrowlText = "Žiadne vybraté položky na prezeranie";
localizations.NoPreviewGrowlText = "Náhľad";
localizations.NoPreviewGrowlDesc = "pre vybraté položky nie je k dispozícii náhľad";
localizations.ProblemWhileRenamingGrowlText = "Problém počas premenovávania";
localizations.ProblemWhileRenamingDescGrowlText = "Problém počas premenovávania. Skúste to prosím znova. Chyba : ";
localizations.ProblemWhileSharingGrowlText = "Problém počas zdieľania";
localizations.ProblemWhileSharingDescGrowlText = "Vyskytol sa problém počas zdieľania. Skúste to prosím znova";
localizations.DirectLinkDescGrowlText = "Kliknite pravým tl. na položku a vyberte kopírovať priamy odkaz";
localizations.UpdateKeywordDescGrowlText = "Kliknite pravým tl. na položku a vyberte aktualizovať kľúčové slová";
localizations.QuickViewNothingToShowGrowlText = "Chyba : V rýchlom prehliadaní sa nedá nič zobraziť";
localizations.QuickViewNoItemsAvailableGrowlText = "Žiadne dostupné položky";
localizations.ProblemWhileDeletingGrowlText = "Problém počas odstránenia";
localizations.ProblemWhileDeletingDescGrowlText = "Došlo k problému počas odstránenia. Skúste to prosím znova. Chyba : ";
localizations.ProblemWhileUnzipGrowlText = "Problém počas rozbaľovania súborov";
localizations.ProblemWhileUnzipDescGrowlText = "Došlo k problému počas rozbaľovania súboru. Skúste to prosím znova. Chyba : ";
localizations.ProblemWhileZipGrowlText = "Problém počas komprimácie súborov";
localizations.ProblemWhileZipDescGrowlText = "Došlo k problému počas komprimácie. Skúste to prosím znova. Chyba : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Problém počas vytvárania adresára";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Došlo k problému počas vytvárania adresára. Skúste to prosím znova. Chyba : ";
localizations.JavaRequiredGrowlText = "Vyžadovaná Java";
localizations.JavaRequiredDescGrowlText = "Pokročilé funkcie vyžadujú inštaláciu Java.<br/><br/>Jděte na: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaAppletNotLoadedGrowlText = "Java Applet nebol spustený";
localizations.JavaAppletNotLoadedDescGrowlText = "Technológia 'Ťahaj a Pusť'(Drag&Drop) je dostupná až po kliknutí na tlačítko 'Pokročilé prehliadanie...'";
localizations.NoFilesFoundGrowlTitle = "Dáta nenájdené";
localizations.NoFilesFoundGrowlText = "Chyba : Neboli nájdené dáta pre ";
localizations.AutoLogOutConfirmationTitle = "Automatické odhlásenie";
localizations.AutoLogOutConfirmationDesc = "Budete odhlásený z dôvodu nečinnosti";
localizations.AutoLogOutButtonText = "Zostať přihlásený";

//Treeview header items
localizations.TreeviewHeaderNameText = "Meno";
localizations.TreeviewHeaderSizeText = "Veľkosť";
localizations.TreeviewHeaderModifiedText = "Zmenené";
localizations.TreeviewHeaderKeywordsText = "Kľúčové slová";

//Selection menu items
localizations.SelectItemOptionLinkText = "Výber";
localizations.SelectCheckboxContextMenuToggleText = "Invertovať";
localizations.SelectCheckboxContextMenuCheckAllText = "Všetky položky";
localizations.SelectCheckboxContextMenuUncheckAllText = "Nič";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Všetky súbory";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Všetky adresáre";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Položky začínajúce na \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Zmenené dnes";
localizations.SelectCheckboxContextMenuCheckWeekText = "Zmenené tento týždeň";
localizations.SelectCheckboxContextMenuCheckMonthText = "Zmenené tento mesiac";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Zmenené za 60 dní";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Zmenené za 90 dní";

// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Zobraziť {0} položiek na stránke";

//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";

// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Vyberte položky na nahratie...";
localizations.advancedDownloadPathSelectionWindowTitle = "Vyberte cieľovú cestu...";
localizations.maxAllowedDownloadSizeReached = "Veľkosť sťahovaných položiek prekročila povolenú hranicu"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Maximálna veľkosť sťahovaných položiek je: {size}. <br />Použite pokročilé sťahovanie alebo vložte požadované položky do košíka."; //Text of growl to display when download reaches maximum allowed size

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Zmeni´t ikonu ";
localizations.ChangeIconWindowInstructionsText = "Vyberte malý obrázok a nastavte ako ikonu pre vybratú položku:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Vybratý súbor : ";
localizations.ChangeIconWindowCancelLinkText = "Zrušiť";
localizations.ChangeIconWindowUpdateLinkText = "Uložiť";
localizations.ChangeIconFileSelectAlertText = "Vyberte prosím obrázok.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Začala dekomprimácia";
localizations.UnzipStartedAlertDescText = "Začala dekomprimácia vybratých súborov";
localizations.UnzipCompletedAlertTitleText = "Dekomprimácia dokončená";
localizations.UnzipCompletedAlertDescText = "Vybraté soubory boli dekomprimované";

//zip operation
localizations.ZipStartedAlertTitleText = "Započala komprimácia";
localizations.ZipStartedAlertDescText = "Vybraté súbory budú skomprimované";
localizations.ZipCompletedAlertTitleText = "Komprimácia dokončená";
localizations.ZipCompletedAlertDescText = "Vybrané súbory boli skomprimované";

//Signup-Page
localizations.RegisterWindowProcessCompleteMessage = "Môžete sa prihlásiť ako registrovaný uživateľ akonáhle to bude umožnené administrátorom.";

//PSV - additional customizations, found elsewhere
localizations.uploadWindowShareUploadedByClass = "Zdieľanie nahraté";
window.locale.fileupload.share = "Zdieľanie";
window.locale.fileupload.waiting = "Čakanie...";
window.locale.fileupload.pause = "Pauza";
localizations.BasketShareItemsLinkText = "Zdieľať položky";
if(typeof $.sessionChecker !="undefined")
    $.sessionChecker.defaultOptions.noteTextTemplate = "(Spojenie vyprší za %time%.)";
localizations.pagingSizeAllText = "Všetko (pomalé u veľkých adresárov)";
localizations.ShareWindowUsernamePermissionsLabelText = "Práva : ";
localizations.SelectItemHeaderNameText = "Výber";

//PSV - strings sent by Ben on 19.11.2012
localizations.DownloadCompletedText = "[Sťahovanie dokončené]";
localizations.DownloadCompletedPathText = " Stiahnuté do: ";
localizations.ShareWindowHeaderText = "Zdieľať súbory";
localizations.ShareWindowDownloadLabelText = "Stiahnuť";
localizations.ShareWindowUploadLabelText = "Nahrať";
localizations.ShareWindowDeleteLabelText = "Zamazať";
localizations.QuickViewCurrentImagePositionText = "Položka {current} z {total}";
window.locale.fileupload.uploadedInLabelText = "Nahraté do: ";
window.locale.fileupload.atAvgSpeedOfLabelText = "priemernou rýchlosťou: ";
window.locale.fileupload.uploadCompletedText = "Nahrávanie dokončené";
window.locale.fileupload.uploadedFileText = "Súbor bol nahratýt na server";
window.locale.fileupload.uploadedMultipleFilesText = "Všetky súbory boli nahraté.";

//PSV - strings sent by Ben on 1.12.2012
//Manage Share window
localizations.ManageShareWindowRefreshLinkText = "Aktualizovať";
localizations.ManageShareWindowDeleteSelectedLinkText = "Zmazať vybraté položky";
localizations.ManageShareWindowDeleteLinkText = "Zmazať";
localizations.ManageShareWindowHideLinkText = "Skryť";
localizations.ManageShareWindowGridLinkLabelText = "Odkaz";
localizations.ManageShareWindowGridFromLabelText = "Od";
localizations.ManageShareWindowGridToLabelText = "Komu";
localizations.ManageShareWindowGridCCLabelText = "Kópia";
localizations.ManageShareWindowGridBCCLabelText = "Skrytá kópia";
localizations.ManageShareWindowGridSubjectLabelText = "Predmet";
localizations.ManageShareWindowGridBodyLabelText = "Telo správy";
localizations.ManageShareWindowGridShareTypeLabelText = "Typ zdieľania";
localizations.ManageShareWindowGridUserNameLabelText = "Uživateľ";
localizations.ManageShareWindowGridPasswordLabelText = "Heslo";
localizations.ManageShareWindowGridAttachedLabelText = "Pripojiť k emailu??";
localizations.ManageShareWindowGridUploadLabelText = "Nahrávanie povolené?";
localizations.ManageShareWindowGridPathsLabelText = "Cesty";
localizations.ManageShareWindowGridCreatedLabelText = "Vytvorené";
localizations.ManageShareWindowGridExpiresLabelText = "Vyprší";
localizations.ManageShareWindowGridSharedItemsLabelText = "Zdieľané položky";
localizations.ManageShareWindowGridDownloadsLabelText = "Stiahnutí";
localizations.ManageShareWindowNothingToShowMessageText = "Nie je čo zobraziť";
localizations.ManageShareWindowNothingSelectedToDeleteMessageText = "(Nebolo vybraté nič, čo by sa dalo zmazať)";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Skutočne chcete zmazať vybraté {count} účty?";
localizations.ManageShareWindowUserDeletedMessageText = "(Uživateľ : {name} zmazaný)";

localizations.dataFormatBytes = "bytes";
localizations.dataFormatKiloBytes = "kB";
localizations.dataFormatMegaBytes = "MB";
localizations.dataFormatGigaBytes = "GB";
localizations.dataFormatTeraBytes = "TB";

localizations.advancedOperationsDownloadStatus = "Sťahovanie";
localizations.advancedOperationsUploadStatus = "Nahrávanie";

localizations.loadingIndicatorText = "Čakejte prosím...";


//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";