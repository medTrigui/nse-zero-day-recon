//English
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP WebInterface :: Autentificare";
localizations.BadLoginInfoText = "Numele de utilizator sau parola sunt greșite, sau contul este expirat.";
localizations.ServerErrorInfoText = "Serverul este inaccesibil, sau IP-ul dumneavoastră este neîngăduit.";
localizations.PasswordsDoNotMatchAlertText = "Parolele nu corespund.";
localizations.LoginAgainTitleText = "Vă rugăm să vă autentificați din nou ";
localizations.LoginWithNewPassText = "Autentificați-vă cu noua parolă";
localizations.AuthenticatingMsgText = "Autentificare în curs...";
localizations.LoginSuccessText = "Succes";
localizations.LoadingWebInterfaceText = "Încărcare interfață web...";
localizations.LoginWarningText = "Atențiune";
localizations.MultipleBadLoginsAlertDescText = "Prea multe încercări greșite și IP-ul va fii restricționat.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Click <a style='color:white;' href='/WebInterface/jQuery/reset.html'>aici</a> pentru resetarea parolei.</div>";
localizations.LoginFailedText = "Autentificare eșuată";
localizations.ChangePasswordGrowlTitleText = "Schimbați-vă parola";
localizations.UserNameText = "Utilizator";
localizations.PasswordText = "Parolă";
localizations.RememberMeText = "Ține-mă minte";
localizations.LoginButtonText = "Logare";
localizations.ForgotPasswordLinkText = "Mi-am uitat parola, trimite-mi-l pe email.";
localizations.ChangePasswordHeaderText = "Schimbare parolă";
localizations.ChangePasswordNoteText = "Pentru a continua este necesară schimbarea parolei.";
localizations.CurrentPasswordText = "Parolă curentă : ";
localizations.NewPasswordText = "Parolă nouă : ";
localizations.ConfirmPasswordText = "Confirmarea noii parole : ";
localizations.CancelButtonText = "Anulare";
localizations.ChanngePasswordButtonText = "Schimbare parolă";
localizations.GeneratePasswordButtonText = "Generare parolă";
localizations.GeneratePasswordUseButtonText = "Folosește acesta";
localizations.GeneratePasswordCancelButtonText = "Anulare";
localizations.OldBrowserNoticeHTMLAsText = 'Browser-ul dumneavoastră curent, a fost lansat cu aproape un deceniu în urmă! Ca urmare, este foarte lent, plin de bug-uri, iar această interfață web poate sau chiar nu poate lucra cu IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Continuă oricum, precaut</button> sau descarcă un browser mai performant:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "Acest server nu este setat să trimită memento-uri de parolă în email.";

/*Reset pass page specific*/
localizations.resetPageUserName = "Numele de utilizator sau Email : ";
localizations.resetPagePassword = "Parolă : ";
localizations.resetPagePasswordConfirm = "Confirmare parolă : ";
localizations.resetPageSubmit = "Trimite";
localizations.resetPageLoginPage = "Pagina de logare";
localizations.resetPageStartOver = "Reia procesul";

localizations.passwordRequirementsMessages = {
    errorTitle : "Eroare : \r\n",
    msgSeparator : "\r\n",
    chars : "Parola trebuie să conțină cel puțin $$ caractere.",
    numericChars : "Parola trebuie să conțină cel puțin $$ caractere numerice.",
    lowerCase : "Parola trebuie să conțină cel puțin $$ caractere cu minusculue.",
    upperCase : "Parola trebuie să conțină cel puțin $$ caractere cu majuscule.",
    specialCase : "Parola trebuie să conțină cel puțin $$ caractere speciale.",
    notAllowedErrorMsg : "Ne permis"
};


localizations.ItemsPerPageText = "Număr elemente de afișat pe pagină : ";
localizations.LayoutChangeLabelText = "Compoziție : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Fișierul este prea mare",
            "minFileSize": "Fișierul este prea mic",
            "acceptFileTypes": "Extensie nepremisă",
            "maxNumberOfFiles": "Ați depășit numărul maxim de fișire permise.",
            "uploadedBytes": "Octeții încărcați depășesc limita admisă",
            "emptyResult": "Rezultatul încărcării de fișier gol",
            "fileAvailableInSelectedFolder": "Fișierul a fost deja adăugat pentru încărcare în același folder",
            "hasReachedQuota": "Dimensiunea fișierului este mai mare decât cota dvs.",
            "fileExistOnServer": "Fișierul egzistă deja pe server",
            "fileBiggerThanAllowed": "Fișierul este mai mare decât dimensiunea permisă",
            "dirNoWritable": "Nu puteți încărca în acest folder",
            "blockUploadingDirs": "Nu este permisă încărcarea folderelor",
            "true": "Adevărat"
        },
        "error": "Eroare",
        "start": "Începe",
        "waiting": "Așteptare...",
        "uploading": "Încărcare : ",
        "reupload": "Re-Încărcare",
        "share": "Partajare",
        "Anulare": "Anulare",
        "destroy": "Ștergere",
        "overwrite": "Suprascrie",
        "uploadTo": "Încarcă în : ",
        "pause": "Pauză",
        "errorLabel": "eroare : ",
        "details": "Detalii",
        "uploadedInLabelText": "Încărcat în : ",
        "atAvgSpeedOfLabelText": "la viteza medie de : ",
        "uploadCompletedText": "Încărcare terminată",
        "uploadedFileText": "Fișier încărcat pe server.",
        "uploadedMultipleFilesText": "Toate fișierele încărcate."
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Stergere",
    "rename": "Redenumire",
    "download": "Descărcare",
    "advanced download": "Descărcare avansată",
    "zipdownload": "Descărcare arhivată",
    "unzip": "Dezarhivare",
    "zip selected": "Arhivare selectate",
    "explore zip contents": "Explorează conținutului arhivei",
    "create folder": "Creare folder",
    "upload": "Încărcare",
    "search": "Caută",
    "user options": "Opțiuni utilizator",
    "cut": "Taie",
    "copy": "Copiază",
    "paste": "Lipește",
    "slideshow": "Afișare imagini",
    "quickview": "Vizualizare rapidă",
    "download low-res": "Descărcare rezoluție mică",
    "preview": "Previzualizare",
    "batchcomplete": "Lot complet",
    "share": "Partajare",
    "quick share": "Partajare rapidă",
    "manage shares": "Gestionarea partajărilor",
    "show basket": "Vezi conținutul coșului",
    "add to basket": "Adaugă la coș",
    "edit keywords": "Editează cuvinte cheie",
    "change icon": "Schimbă pictogramă",
    "download crushtunnel": "Descarcă CrushTunnel",
    "help": "Ajutor",
    "login": "Autentificare",
    "logout": "Ieșire",
    "download sync app": "Descarcă applicația Sync",
    "download crushftpdrive": "Descară CrushFTPDrive",
    "sync manager": "Gestionarea sincronizărilor"
};

localizations.currentLanguageName = "Romanian"; //It has to be in english for mapping, to change display text use option below
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
localizations.languageNameRomanian = "Romanian (Română)";
localizations.languageNameJapanese = "Japanese (日本語)";

//WebInterface
localizations.refreshListingButtonTooltipText = "Reactualizează";
localizations.FilterText = localizations.FilterTextBasket = "Filtrează:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Golește";
localizations.FileCounterItemsText = "Element(e)";
localizations.FileCounterFoldersText = "Folder(e)";
localizations.FileCounterFilesText = "Fișier(e)";
localizations.FileCounterHiddenItemsText = "Element(e) ascuns(e)";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Vizualizare miniaturi";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Vizualizare arborescentă";
localizations.DownloadResumeTextLabelBasket = "Reluare"
localizations.BackToTopLinkText = "Înapoi la început";
localizations.FilesNotAvailableMessage = "Nu există fișier(e) disponibile";
localizations.CopyNoFilesSelectedMessage = "Selectați fișier(ele)/folder(ele) de copiat";
localizations.CopyOnlyFilesMessage = "Puteți tăia/copia doar fișier(ele), folder(ele) selectat(e) vor fii ignorat(e)";
localizations.DeleteNoFilesSelectedMessage = "Selectați fișier(ele)/folder(ele) de șters";
localizations.UnzipNoFilesSelectedMessage = "Selectați fișierul pentru dezarhivare";
localizations.ZipExploreNoFilesSelectedMessage = "Selectați zip pentru explorare";
localizations.CutNoFilesSelectedMessage = "Selectați fișier(ele)/folder(ele) de tăiat";
localizations.pagingPrevText = "Anterior";
localizations.pagingNextText = "Următor";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Element(e) care conțin fraza \"{filterVal}\" : {totalItems} , Folder(e): {folders} Fișier(e): {files})";
localizations.TotalItemsInDirMsgText = " (Elemente totale în director {count}) ";
localizations.TotalItemsInDirInlineText = " ({count} element(e)) ";
localizations.quotaAvailableLabelText = "disponibil(e)";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Eroare: Problemă în timpul salvării.";
localizations.TreeviewSpecificActionMsgTitleText = "Numai pentru vedere tip arbore.";
localizations.TreeviewSpecificActionMsgDescText = "Acesta este specific vederii de tip arbore";
localizations.PasswordExpiringMsgText = "Parola expiră curând<br/>Folosiți butonul Opțiuni Utilzator pentru a o schimba.";
localizations.PasswordNotMatchingMsgText = "Noile parole nu corespund.";
localizations.PasswordMustBeComplexMsgText = "Parola trebuie să fie mai complexă.";
localizations.PasswordChangedMsgText = "Parola schimbată.  Vă rugăm să vă autenificați pentru a folosi noua parolă.";
localizations.AppletLoadingFailedMsgText = "Miniaplicația a eșuat în timpul încărcării.";
localizations.DownloadStartedAlertTitleText = "Descărcarea a început. ";
localizations.DownloadCompletedText = "[Descărcare finalizată]";
localizations.DownloadCompletedPathText = " Descărcată în : ";
localizations.DownloadStartedAlertDescText = "Vă rugăm să selectați locația salvării fișier(elor) pentru a continua.";
localizations.LogoutButtonText = "Deconectare";
localizations.browserUploaderNativeUploadTipSetTitle = "Încărcare fișier(e) folsind aplicația web.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Încărcare fișier(e) folosind instrumentul de încărcare avansat, <br> permite încărcarea de folder(e) și poate accelera procesul de încărcare.";
localizations.browserUploaderDragDropHoverLabelText = "Lăsați fișier(ele) aici pentru a încărca";
localizations.appletUploaderDropPanelLabelText = "&darr; Lăsați fișier(ele) aici pentru a încărca &darr;";
localizations.browserUploaderDragDropLabelText = "Lăsați fișier(ele) aici pentru a încărca";
localizations.browserUploaderChromeDragDropLabelText = "Trageți și lăsați fișier(ele) aici pentru a încărca";
localizations.advancedUploadOptionsDialogSaveButtonText = "Salvare";
localizations.advancedUploadOptionsDialogCancelButtonText = "Anulare";

//Sharing Window
localizations.ShareWindowHeaderText = "Partajare Fișier(e)";
localizations.ShareWindowFilesSharingLabelText = "Partajare :";
localizations.ShareWindowShareTypeLabelText = "Tipul partajării :";
localizations.ShareWindowShareTypeLabelCopyText = "Copiază";
localizations.ShareWindowShareTypeLabelMoveText = "Mută";
localizations.ShareWindowShareTypeLabelReferenceText = "Referință";
localizations.ShareWindowShareToInternalUserLabelText = "Partajare Internă";
localizations.ShareWindowShareToExternalUserLabelText = "Partajare Externă";
localizations.ShareWindowDownloadLabelText = "Descărcare";
localizations.ShareWindowUploadLabelText = "Încărcare";
localizations.ShareWindowDeleteLabelText = "Ștergere";
localizations.ShareWindowSendEmailLabelText = "Trimite Email :";
localizations.ShareWindowDirectLinkLabelText = "Link direct către fișier?";
localizations.ShareWindowExpiresLabelText = "Expiră :";
localizations.ShareWindowFromLabelText = "Destinatar : ";
localizations.ShareWindowToLabelText = "Expeditor : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "BCC : ";
localizations.ShareWindowReplyToLabelText = "Răspunde la : ";
localizations.ShareWindowSubjectLabelText = "Subiect : ";
localizations.ShareWindowBodyLabelText = "Trunchi : ";
localizations.ShareWindowAdvancedLabelText = "Avansat";
localizations.ShareWindowAttachThumbsLabelText = "Atașează pictogramă";
localizations.ShareWindowAttachFileLabelText = "Atașează fișier(e)";
localizations.ShareWindowCommentsLabelText = "Comentarii : ";
localizations.ShareWindowKeywordsLabelText = "Cuvinte cheie : ";
localizations.ShareWindowAccessLabelText = "Access complet ";
localizations.ShareWindowSendButtonText = "Trimite";
localizations.ShareWindowCancelButtonText = "Anulare";
localizations.ShareWindowUsernameMethodLabelText = "Metoda de partajare : ";
localizations.ShareWindowUsernameLabelText = "Partajare către utilizator(i) intern(i)";
localizations.ShareWindowUsernamesLabelText = "Nume de utilizator(i) : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Separați utilizatorii multiplii cu virgulă.)";
localizations.ShareActionCompleteShareUsernamesText = "Utilizatorii enumerați au primit access la element(ele) partajat(e).";
localizations.ShareActionCompleteUsernameText = "Utilizator: ";
localizations.ShareActionCompletePasswordText = "Parolă: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Vă rugăm introduceți un email valid. Puteți introduce mai multe adrese separate cu virgulă. ex. <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Element invalid";
localizations.SharFoldersCantBeSharedGrowlText = "Folderele nu pot fii partajate";
localizations.SharFilesCantBeSharedGrowlText = "Fișierele nu pot fii partajate";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copiere link direct către fișier.";
localizations.CopyLinkText = "Copiere link";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Creare folder nou.";
localizations.CreateFolderInputDefaultFolderName = "Folder Nou";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Navighează la folderul nou după creare. ";
localizations.CreateFolderButtonText = "Creare";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Încărcare fișier";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Detalii încărcare";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Incărcare fișiere";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Navigare avansată ..";
localizations.BrowserUploaderStartUploadingLinkText = "Începe încărcare";
localizations.BrowserUploaderClearCompletedLinkText = "Golește element(ele) finalizat(e)";
localizations.BrowserUploaderResumeCheckboxText = "Reluare";
localizations.BrowserUploaderFormResetButtonText = "Resetează";
localizations.BrowserUploaderFormNextButtonText = "Următorul";
localizations.BrowserUploaderFileAddedAlreadyText = "Acest fișier a fost deja adăugat.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} a fost deja adăugat.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Aceste fișire au fost deja adăugate.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} au fost deja adăugate.";
localizations.BrowserUploaderSelectedFilesGroupText = "Grupare fișiere : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Elimină";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Va fii încărcat în";
localizations.BrowserUploaderSelectedFileOverwriteText = "Suprascrie";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "Va fii suprascris";
localizations.BrowserUploaderSelectedFileExistsText = "Fișier egzistent";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Necesită atenție";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorare";
localizations.BrowserUploaderSelectedFileDoneText = "Terminat";
localizations.BrowserUploaderSelectedFileUploadedText = "Încărcat către";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "re-încărcare";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "re-descărcare";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Demite";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Anulare";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Întrerupere";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Întrerupt";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Reluare";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Total {0} fișier(e)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} din {1} element(e) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Încărcare în : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Viteza curentă : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Viteza medie : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Timp: Consumat: <span class='elapsed'>{0}</span> <span class='remained'>, Rămas : {1}</span></div>";
localizations.BatchCompleteText = "Rezultat";
localizations.BatchComplete = "Transfer(uri) confirmat(e).";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Se calculează..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problemă în timpul transferului";
localizations.BrowserUploaderCancelledUploadMsgText = "Încărcare anulată";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Fișierele dumneavoastră sunt încărcate momentan. Dacă navigați de la această pagină încărcarea se va întrerupe și fișierele se vor pierde.  Sigur doriți să părăsiți această pagină?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Fișierele dumneavoastră sunt descărcate momentan. Dacă navigați de la această pagină încărcarea se va întrerupe și fișierele se vor pierde.  Sigur doriți să părăsiți această pagină?";
localizations.NoUploadInDirGrowlText = "Încărcarea nu este permisă";
localizations.NoUploadInDirGrowlDesc = "Încărcarea elementelor în folderul selectat nu este permisă";
localizations.AdvancedUploadDirNotAllowedText = "Încărcarea folderelor nu este permisă";
localizations.AdvancedUploadDirNotAllowedDescText = "Foldere nu pot fii încărcate, vă rugăm să selectați doar fișiere";
localizations.uploadConfirmCancelUploadText = "Sunteți sigur(ă) că doriți anularea încărcării?";
localizations.uploadConfirmCancelUploadAfterFormText = "Sunteți sigur(ă) că doriți anularea încărcării ultimelor {count} fișiere selectate?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Adaugă fișiere...";
localizations.advancedUploadResumeLabelByClass = "Reluare";
localizations.filesToUploadQueueWindowHeader = "Fișiere de încărcat";
localizations.uploadWindowStartUploadingByClass = "Începe încărcarea";
localizations.uploadWindowCancelUploadingByClass = "Anulează încărcarea";
localizations.uploadWindowShowCommonUploadFormByClass = "Detalii";
localizations.uploadWindowClearUploadedByClass = "Golește elementele încărcate";
localizations.uploadWindowOverwriteAllByClass = "Suprascrie tot";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Golește toate elementele cu erori";
localizations.uploadWindowSummaryFilesByClass = "Fișiere : ";
localizations.uploadWindowSummarySizeByClass = ", Mărimea încărcării : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Arată / ascunde fișierele selectate";
localizations.uploadBarAttentionTitle = "Adăugați fișiere în bara de încărcare";
localizations.uploadBarAttentionText = "Folosiți bara de încărcare să adugați fișiere. Dați click pe \"" + localizations.browseFileLabelByClass + "\" buton pentru adăugare fișiere";
localizations.uploadBiggerFileNoticeTitleText = "Pentru fișiere mai mari folosiți încărcarea avansată";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>Este recomandat utilizarea încărcării avansate pentru fișierele mari, permite încărcarea ușoară a fișierelor și are funcția de <em>auto coninuare</em>. <br><br> (Puteți comuta modul de încărcare în bara de încărcare)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='Cum să activăm modul avansat de încărcare'>";

localizations.globalProgressbarSkipLabelByClass = "Sari peste";
localizations.globalProgressbarPauseLabelByClass = "Pauză";
localizations.globalProgressbarStopLabelByClass = "Stop";

localizations.popupOpenInSeparateWindowText = "Deschide în fereastră nouă";
localizations.customFormPasswordMatchValidationFailedText = "Parola nu corespunde";
localizations.customFormCompareValueMatchValidationFailedText = "Valorile nu corespund";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Comută la modul normal de încărcare";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Comută la modul avansat de încărcare.<div style='font-size:11px;width:500px;margin:5px 0px;'>Modul avansat va The advanced mode will accelera transferurile. Poate continua automat transferurile întrerupte și este capabil să încarce foldere întregi.<br><br>Este o metodă mai rapidă de a încărca fișiere.<br>(Modul avansat necesită pulig-in-ul Java Applet de la www.java.com să fie instalat.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Caută";
localizations.SearchWindowKeywordsLabelText = "Cuvinte cheie :";
localizations.SearchWindowExactLabelText = "Exact?";
localizations.SearchWindowByClassModifiedLabelText = "Modificat";
localizations.SearchWindowByClassDateFormatLabelText = "(ll/zz/aaaa) ";
localizations.SearchWindowSizeLabelByClassText = "Mărimea este ";
localizations.SearchWindowTypeLabelText = "Elementul este";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kiloocteţi)";
localizations.SearchWindowSearchButtonText = "Începe căutarea";
localizations.SearchWindowCancelButtonText = "Anulare";
localizations.SearchResultDisplayText = "Rezultatul căutării:";
localizations.SearchResultClearLinkText = "(Golește filtrul de căutare)";
localizations.SearchFormModifiedOptionAfterText = "După";
localizations.SearchFormModifiedOptionBeforeText = "Înainte";
localizations.SearchFormSizeOptionBiggerThanText = "Mai mare ca";
localizations.SearchFormSizeOptionSmallerThanText = "Mai mic ca";
localizations.SearchFormItemTypeOptionFileText = "Fișier";
localizations.SearchFormItemTypeOptionFolderText = "Folder";
localizations.SearchProcessNotificationText = "Se procesează... ";
localizations.SearchProcessCancelText = "Anulare";
localizations.SearchItemsContextGoToParentText = "Mergi la folderul părinte";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Toate <strong>{count}</strong> elementele pe această pagină sunt selectate.";
localizations.ItemsSelectionSelectAllItemsInDir = "Selectează toate <strong>{total_items}</strong> elmentelele în <strong>{list_type}</strong> (inclusiv elemtele ascunse)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Toate <strong>{total_items}</strong> elementele în <strong>{list_type}</strong> (inclusiv elemtele ascunse) sunt selectate";
localizations.ItemsSelectionClearSelection = "Golește selecția";
localizations.ItemsSelectionShowingFolderText = "Folderul curent";
localizations.ItemsSelectionShowingFilteredItemsText = "Lista curentă filtrată";
localizations.ItemsSelectionShowingSearchedItemsText = "Rezultatul căutării";
//User options window
localizations.UserOptionsWindowHeaderText = "Preferințe";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Ascunde elemntele care încep cu '.'  ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Ascunde coloana de selecție ";
localizations.UserOptionsWindowHideFilterLabelText = "Ascunde selecția de filtrare ";
localizations.UserOptionsWindowAutostartUploadLabelText = "La selectarea unui fișier începe încărcarea automată. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "La încărcarea interfeței web încarcă appletul Java.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Dezactivează comprimarea pe applet-ul Java. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Schimbă parola ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Parola curentă: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Parola nouă: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Confirmarea parolei:";
localizations.UserOptionsWindowChangePasswordButtonText = "Schimbă parola";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generează parolă aleatoare";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Folosește acesta";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Anulare";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "Nu ați introdus parola curentă corectă.";
localizations.ChangePasswordResetLinkExpiredText = "Linkul este invalid sau a expirat.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Comutare";
localizations.MainCheckboxContextMenuCheckAllText = "Seltează toate";
localizations.MainCheckboxContextMenuUncheckAllText = "Deselectează toate";
//Keywords window
localizations.KeywordsWindowHeaderText = "Cuvinte cheie";
localizations.KeywordsWindowUpdateLinkText = "Adaugă";
localizations.KeywordsWindowCancelLinkText = "Anulare";
//File basket
localizations.BasketHeaderText = "Fișiere în coș";
localizations.BasketClearAllLinkText = "Golire toate";
localizations.BasketDownloadLinkText = "Descarcă conținutul coșului";
localizations.BasketDownloadAdvancedLinkText = "Descarcă avansat conținutul coșului";
localizations.BasketNoFilesAvailableText = "Nu sunt fișiere disponibile";
localizations.BasketRemoveLinkText = "Elimină";
localizations.BasketTotalItemText = "{0} Element(e) ";
localizations.BasketFileAddedAlreadyText = "Fișierul este deja adăugat în coș";
localizations.BasketFileAddedAlreadyDetailsText = "Fișierul adăguat este deja disponibil în coș";
localizations.BasketNothingSelectedToAddText = "Nimic nu este selectat pentru a fii adăugat în coș";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Sunteți sigur(ă) că doriți golirea tuturor fișierelor din coș?";
//Paste form panel
localizations.PasteFormHeaderText = "Lipire";
localizations.PasteFormResetButtonText = "Resetare";
localizations.PasteFormPasteButtonText = "Lipire";
localizations.PasteFormErrorHeaderText = "Problemă la lipire";
localizations.PasteFormErrorDetailsText = "A apărut o problemă în timpul lipirii elementelor.<br />Eroare : {0}";
localizations.PasteFormErrorNothingToPasteText = "Nu este nimic de lipit";
localizations.PasteSelectDirectoryWarning = "Vă rugăm selectați o destinație pentru lipirea elementelor copiate";
localizations.PasteSelectSingleDirectoryWarning = "Vă rugăm selectați o singură destinație pentru lipirea elementelor copiate.";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Bine ați venit.";
localizations.WelcomeFormOkButtonText = "OK";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Vizualizare imagini";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Gestionați partajări";
localizations.ManageShareWindowRefreshLinkText = "Reactualizează";
localizations.ManageShareWindowDeleteSelectedLinkText = "Șterge element(ele) selectat(e)";
localizations.ManageShareWindowDeleteLinkText = "Șterge";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "Expeditor";
localizations.ManageShareWindowGridToLabelText = "Destinatar";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridReplyToLabelText = "Răspunde către";
localizations.ManageShareWindowGridSubjectLabelText = "Subiect";
localizations.ManageShareWindowGridBodyLabelText = "Trunchi";
localizations.ManageShareWindowGridShareTypeLabelText = "Tipul partajării";
localizations.ManageShareWindowGridUserNameLabelText = "Utilizator";
localizations.ManageShareWindowGridPasswordLabelText = "Parolă";
localizations.ManageShareWindowGridAttachedLabelText = "Atașare în Email?";
localizations.ManageShareWindowGridUploadLabelText = "Permite încărcări?";
localizations.ManageShareWindowGridPathsLabelText = "Căi de acces";
localizations.ManageShareWindowGridCreatedLabelText = "Creat";
localizations.ManageShareWindowGridExpiresLabelText = "Expiră";
localizations.ManageShareWindowGridSharedItemsLabelText = "Element(e) partajat(e)";
localizations.ManageShareWindowGridDownloadsLabelText = "Descărcări";
localizations.ManageShareWindowNothingToShowMessageText = "Nimic de afișat";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Sunteți sigur(ă) că doriți ștergerea a {count} utilizator(i) temporar(i) ?";
localizations.ManageShareWindowFilterText = "Filtrează :";
localizations.ManageShareWindowClearFilterText = "Golește";
localizations.ManageShareWindowNextItemText = "Următorul";
localizations.ManageShareWindowPrevItemText = "Anterior";
localizations.ManageShareWindowSelectSimilarText = "Selectează Similar";
localizations.ManageShareWindowPageTitle = "CrushFTP - Gestionare Partajări";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Redenumire";
localizations.RenamePanelSaveLinkText = "Salvare";
localizations.RenamePanelCancelLinkText = "Anulare";

localizations.ZipNameWindowHeaderText = "Denumire arhivă";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Anulare";

localizations.SyncAppNameWindowHeaderText = "Descărcarea applicației Sync ";
localizations.SyncAppDownloadYourPassText = "Parola dumneavoastră : ";
localizations.SyncAppDownloadAdminPassText = "Parola administrativă : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Anulare";

//Tooltip info
localizations.TooltipNameLabelText = "Nume";
localizations.TooltipPathLabelText = "Cale";
localizations.TooltipSizeLabelText = "Mărime";
localizations.TooltipModifiedLabelText = "Modificat";
localizations.TooltipKeywordsLabelText = "Cuvinte cheie";

//Form alerts and notifications
localizations.FormValidationFailText = "Unul sau mai multe elemente nu sunt introduse corect.Vă rugăm introduceți valorile corecte pentru elmentele cu * în formularul de mai jos";
localizations.FormEmailValidationFailText = "<br> - Introduce-ți adresă de email validă pentru câmpurile de email";
localizations.DeleteConfirmationMessageText = "{0} folder(e) și {1} fișier(e) vor fii șterse.\n\nElement(e): {2} Odată șters(e) nu se mai pot recupera.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Toate elemntele în folderul \"{folder_name}\" vor fii șterse.\n\nÎn total {count} elemnte vor fii șterse.\n\nOdată șterse nu se mai pot recupera";
localizations.CopyActionGrowlText = "Total {0} folder(e) și {1} fișier(e) copiate.";
localizations.CutActionGrowlText = "Total {0} folder(e) și {1} fișier(e) tăiat(e).";
localizations.NothingSelectedGrowlText = "Nimic nu este selectat";
localizations.ShareNothingSelectedGrowlText = "Nimic nu este selectat pentru partajare";
localizations.DownloadNothingSelectedGrowlText = "Nimic nu este selectat pentru descărcare";
localizations.RenameNothingSelectedGrowlText = "Nimic nu este selectat pentru redenumire";
localizations.PreviewNothingSelectedGrowlText = "Nimic nu este selectat pentru previzualizare ";
localizations.NoPreviewGrowlText = "Previzualizare";
localizations.NoPreviewGrowlDesc = "Nici o previzualizare disponibilă pentru elementele selectate";
localizations.ProblemWhileRenamingGrowlText = "Problemă la redenumire";
localizations.ProblemWhileRenamingDescGrowlText = "A apărut o problemă la denumire. Vă rugăm reîncercați. Eroare : ";
localizations.ProblemWhileSharingGrowlText = "Problemă la partajare";
localizations.ProblemWhileSharingDescGrowlText = "A apărut o problemă la partajare. Vă rugăm reîncercați.";
localizations.DirectLinkDescGrowlText = "Dreapta click pe un element și dați click pe copiere link direct";
localizations.UpdateKeywordDescGrowlText = "Dreapta click pe un element și dați click pe actualizare cuvinte cheie";
localizations.QuickViewNothingToShowGrowlText = "Eroare : Nimic nu este selectat pentru previzualizare rapidă";
localizations.QuickViewNoItemsAvailableGrowlText = "Nu sunt elemente disponibile";
localizations.QuickViewRotateClockwiseTooltipText = "Rotește în sensul acelor de ceasornic";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Roteste contra sensului acelor de ceasornic";
localizations.QuickViewCurrentImagePositionText = "Element {current} din {total}";
localizations.ProblemWhileDeletingGrowlText = "Problemă în timpul ștergerii";
localizations.ProblemWhileDeletingDescGrowlText = "A apărut o problemă la ștergere. Vă rugăm reîncercați. Eroare : ";
localizations.ProblemWhileUnzipGrowlText = "Problemă în timpul dezarhivării fișier(elor)";
localizations.ProblemWhileUnzipDescGrowlText = "A apărut o problemă la dezarhivare. Vă rugăm reîncercați. Eroare : ";
localizations.ProblemWhileZipGrowlText = "Problemă în timpul arhivării fișier(elor)";
localizations.ProblemWhileZipDescGrowlText = "A apărut o problemă la arhivare. Vă rugăm reîncercați. Eroare : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Problemă în timpul creării unui folder nou";
localizations.ProblemWhileCreatingFolderDescGrowlText = "A apărut o problemă la crearea unui folder nou. Vă rugăm reîncercați. Eroare: ";
localizations.JavaRequiredGrowlText = "Java este necesar";
localizations.JavaRequiredDescGrowlText = "Java trebuie să fie instalat ca funcțiile avansate să funcționeze.<br/><br/>Vă rugăm mergeți la: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Problemă în timpul încărcării Java";
localizations.JavaLoadingProblemDescGrowlText = "A apărut o problemă la There was a problem while loading Java, if Java is disabled in browser, please enable and try again.";
localizations.JavaAppletNotLoadedGrowlText = "Appletul Java  nu a fost încărcat";
localizations.JavaAppletNotLoadedDescGrowlText = "Trebuie să activați mai întâi butonul 'Navigare Avansată...' înainte ca trage și lipește să fie activat.";
localizations.NoFilesFoundGrowlTitle = "Nici un element găsit";
localizations.NoFilesFoundGrowlText = "Eroare : Nici un element găsit pentru: ";
localizations.AutoLogOutConfirmationTitle = "Auto deconectare";
localizations.AutoLogOutConfirmationDesc = "Ve-ți fii deconectat(ă) automat din cazua inactivității";
localizations.AutoLogOutButtonText = "Rămâi conectat(ă)";
localizations.AutoLogOutMsg = "Sunteți deconectat(ă) automat din cazua inactivității";
localizations.AutoLogOutLoginButtonText = "Reautentificare..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Nume";
localizations.TreeviewHeaderPathText = "Cale";
localizations.TreeviewHeaderSizeText = "Mărime";
localizations.TreeviewHeaderModifiedText = "Modificat";
localizations.TreeviewHeaderKeywordsText = "Cuvinte cheie";
//Selection menu items
localizations.SelectItemOptionLinkText = "Selectează";
localizations.SelectCheckboxContextMenuToggleText = "Comutare";
localizations.SelectCheckboxContextMenuCheckAllText = "Toate elementele";
localizations.SelectCheckboxContextMenuUncheckAllText = "Nici unul";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Toate fișierele";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Toate folderele";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Elemente care încep cu \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Modificate astăzi";
localizations.SelectCheckboxContextMenuCheckWeekText = "Modificate săptămâna aceasta";
localizations.SelectCheckboxContextMenuCheckMonthText = "Modificate luna aceasta";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Modificate în ultimele 60 de zile";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Modificate în ultimele 90 de zile";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Arată {0} elemente pe pagină";
//Webinterface labels
localizations.CopyrightText = "&copy; 2022 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Selectează elemente pentru încărcat..";
localizations.advancedDownloadPathSelectionWindowTitle = "Selectează calea pentru descărcare..";
localizations.advancedOperationsDownloadStatus = "Descărcare";
localizations.advancedOperationsUploadStatus = "Încărcare";

localizations.maxAllowedDownloadSizeReached = "Descărcare a depășit mărimea maximă permisă"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Mărimea maximă de descărcare permisă este de : {size}. <br />Folosiți descărcarea avansată sau adăugați în coș."; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "Play";
localizations.AudioPlayerPauseText = "Pause";
localizations.AudioPlayerStopText = "Stop";
localizations.AudioPlayerMuteText = "Mute";
localizations.AudioPlayerUnmuteText = "Un-mute";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Schimbă pictogramă ";
localizations.ChangeIconWindowInstructionsText = "Selectați o imagine mică pentru a o seta ca pictograma element(elor) selectat(e):";
localizations.ChangeIconWindowSelectedFilesLabelText = "Fișier selectat : ";
localizations.ChangeIconWindowCancelLinkText = "Anulare";
localizations.ChangeIconWindowUpdateLinkText = "Salvare";
localizations.ChangeIconFileSelectAlertText = "Vă rugăm selectați fișierul de imagine pentru a continua.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Dezarhivarea a început";
localizations.UnzipStartedAlertDescText = "Procesul de dezarhivare a început pentru fișierele selectate";
localizations.UnzipCompletedAlertTitleText = "Dezarhivarea s-a terminat";
localizations.UnzipCompletedAlertDescText = "Procesul de dezarhivare s-a terminat pentru fișierele selectate";

//zip operation
localizations.ZipStartedAlertTitleText = "Arhivarea a început";
localizations.ZipStartedAlertDescText = "Procesul de arhivare a început pentru fișierele selectate";
localizations.ZipCompletedAlertTitleText = "Arhivarea s-a terminat";
localizations.ZipCompletedAlertDescText = "Procesul de arhivare s-a terminat pentru fișierele selectate";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Registrarea s-a completat : ";
localizations.RegisterWindowProcessCompleteMessage = "Puteți să vă autentificați cu utilizatorul creat după ce este activat de administrator.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Câteva cauze pentru care registrarea poate eșua : </strong><br><br>- Numele de utilizator este deja în folosință. <br> - Serverul este inaccesibil temporar ne permițând registrările.  <br><br> Vă rugăm încercați mai târziu, sau contactați administratorul.";

//Data size format items
localizations.dataByClassFormatBytes = "octeți";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "Vă rugăm aștepați...";

localizations.bytesSentLabelTextByClass = "Trimis :";
localizations.bytesReceivedLabelTextByClass = "Primit :";
localizations.dirInfoDownloadLabelTextByClass = "Descărcare : ";
localizations.dirInfoUploadLabelTextByClass = "Încărcare : ";
localizations.maxAndAvailableAmountLabelTextByClass = "Disponibil/Max :";
localizations.maxAmountPerDayLabelTextByClass = "Per zi :";
localizations.quotaAvailableTextByClass = "disponibil";
localizations.maxAmountPerMonthLabelTextByClass = "Per lună :";

//Server message localized
localizations.share_complete = "Plasarea finalizată.";
localizations.share_email_sent = "Mesaj email trimis.";
localizations.share_open_in_email_client = "deschide în client email";
localizations.email_failed = "<div class='errorMessage'>Serverul SMTP a eșuat în a trimite e-mailul.  Verificați jurnalele de server</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Încărcare eșuată : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "Eroare: Acces restricționat. (Nu aveți dreptul să încărcați sau extensia este ne permisă.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "Eroare:550 Eroare: Conținutul fișierului nu este permis.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "Eroare:Nu puteți suprascrie un fișier.";

localizations.CustomEventCallSuccessTitle = "Succes";
localizations.CustomEventCallSuccessDesc = "Eveniment personalizat inițiat";
localizations.CustomEventCallFailureTitle = "Eșec";
localizations.CustomEventCallFailureDesc = "A apărut o problemă la rularea evenimentului personalizat";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Opțiuni avansate";
localizations.advancedDownloadOptionsButtonText = "Opțiuni de descărcare avansate";
localizations.advancedUploadOptionsDialogSaveButtonText = "Salvează";
localizations.advancedUploadOptionsItemAvailableLabel = "Când un element existent este găsit :";
localizations.advancedUploadOptionsUseCompressionLabel = "Folosește compresia :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Vă rugăm să confirmați acțiunea";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Vă rugăm să confirmați acțiunea pentru fișier :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Acțiune :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Suprascrie";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Suprascrie tot";
localizations.advancedUploadActionResumeSelectOptionText = "Reluare";
localizations.advancedUploadActionResumeAllSelectOptionText = "Reluare toate";
localizations.advancedUploadActionSkipSelectOptionText = "Sari peste";
localizations.advancedUploadActionSkilAllSelectOptionText = "Sari peste toate";
localizations.advancedUploadActionAskSelectOptionText = "Întreabă";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Da";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Nu";

localizations.LoggedInAsLabelText = "Autentificat : ";
localizations.AccountExpiresOnLabelText = "Expiră : ";

if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Sesiunea expiră în %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Vă rugăm așteptați...",
    playSlideshow : "Porniți afișare imagini",
    pauseSlideshow : "Pauză afișare imagini",
    refresh : "Reactualizează",
    fullscreen : "Ecran complet",
    download : "Descărcare",
    upload : "Încărcare",
    deleteText : "Ștergere",
    rotateClockwise : "Rotește în sensul acelor de ceasornic",
    rotateCounterClockwise : "Rotește contra sensul acelor de ceasornic",
    previousItem : "Elementul anterior",
    nextItem : "Elementul următor",
    delayText : "(Întârziere {x} secunde)",
    nextPageText : "Următorul &rsaquo;",
    prevPageText : "&lsaquo; Anteriorul",
    itemCountText : "(Element(e) {x} din {y})",
    noItemMessage : "<h3 style='text-align:center;'>Nu sunt elemente disponibile, sau au apărut probleme la preluarea înregistrărilor</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Incărcare",
    dragDropMsg : "Lăsați fișier(ele) aici pentru a încărca",
    remove : "Elimină",
    removeAllSelected : "Toate selectate",
    removeAllWithError : "Toate cu eroare",
    removeAllUploaded : "Toate încărcate",
    removeAllCancelled : "Toate anulate",
    removeAllSkipped : "Toate sărite",
    removeAll : "Toate",
    addFiles : "Adăugă fișiere...",
    upload : "Încărcare",
    uploadSelected : "Încărcare selectate",
    reuploadAll : "Re-Încărcare Toate",
    cancel : "Anulare",
    uploadDetails : "Detalii ăncărcare",
    overwriteAll : "Suprascrie toate",
    resumeAll : "Reluare toate",
    shareUploaded : "Partajare încărcate",
    shareSelected : "Partajare selectate",
    quickFilterSubtext : "Filtrare rapidă...",
    total : "Total",
    filesFailed : "fișier(e) eșuat(e).",
    selectedFiles : "Fișier(e) selecționat(e) :",
    size : "Mărimea :",
    filtered : "(Filtrată)",
    totalFiles : "Toat(e) fișier(e) :",
    scrollWithActivity : "Derulare cu activitate",
    writingFile : "Scrierea fișierului...",
    decompressingFile : "Decomprimarea fișierului...",
    pleaseWait : "Vă rugăm, așteptați...",
    uploadedIn : "Încărcat în",
    aMoment: "un moment",
    atAvgSpeedOf : "viteza medie de",
    uploadingFailed : "Încărcare eșuată",
    canceled : "Anulat",
    skipped : "Sarit peste",
    currentSpeed : "Viteza actuală :",
    averageSpeed : "Viteza medie :",
    "of" : "din",
    elapsed : "Scurs",
    remaining : "Rămas",
    waiting : "Așteptare..",
    details : "Detalii",
    overwrite : "Suprascriere",
    resume : "Reluare",
    reupload : "Re-Încărcare",
    pause : "Pauză",
    paused : "Pauzat",
    uploading : "Încărcare",
    items : "articol(e)",
    skip : "Sari peste",
    cancelAll : "Anulare toate",
    OK : 'Da',
    CANCEL : 'Nu',
    CONFIRM : "Da",
    reuploadConfirmation : "Va reîncărca toate fișierele deja încărcate, anulate. sărit peste sau eșuate și va suprascrie fișiere existente. Doriți să continuați?",
    folderUploadNotSupported : "Încărcare a folderului nu este suportată în acest browser",
    fileAlreadySelected : "Fișier deja adaugat la încărcare.",
    fileExistsOnServer : "Fișier cu același nume există pe server.",
    fileSizeExceed : "Mărime de fișier depășit.",
    fileNameNotAllowed: "Numele conține caractere nesuportate / nesigure.",
    fileTypeNotAllowed : "Tip de fișier nepermis.",
    filterApplied : "Filtru aplicat.",
    noMatchingItemAvailable : "Nu este disponibil niciun articol potrivit.",
    addFilesToUpload : "Adăuga fișiere pentru încărcare...",
    file : "Fișier",
    reason : "Cauza",
    failedItems : "Articole eșuate",
    ignoreAll : "Anulare toate",
    retryAll : "Reluare toate",
    failedOpeningFile : "Spațiul de stocare indisponibil.",
    cancelConfirmation : "Sunteți sigur că doriți anularea încărcării?",
    failedClosingFile : "Închiderea fișierului eșuată",
    failedWileRetryingChunk : "Nu a reușit reluarea încărcării de bucată.",
    retryingFile : "Reluare încărcarea fișierului",
    "in" : "În",
    seconds : "secund(e)",
    skipFile : "Sari peste fișier",
    retryNow : "Reluare acum",
    retryingClosingFile : "Reluare închidere fișierului",
    fileExistConfirmation : "Fișier [1] cu același mărime există, vreți încărcarea din nou?",
    bigFileOverwriteConfirmation : "Fișier [1] pe server cu mărime mai mare decât cel încărcat există, vreți suprascrierea?",
    fileExistsOnServerConfirmation : "Fișier [1] există pe server",
    fileActionTitle : "Vă rugăm selectați ce doriți să faceți cu acest fișier.",
    applyToAll : "Aplicare la toate",
    retryingOpeningFile : "Reluare deschiderea fișierului",
    secondsAbbr : "sec",
    minutesAbbr : "min",
    hoursAbbr : "ore"
};
