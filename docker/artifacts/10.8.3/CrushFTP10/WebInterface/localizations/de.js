//German

// localizations.FilesNotAvailableMessage = "Keine Dateien vorhanden";
localizations.LoggedInAsLabelText = "Angemeldeter Benutzer: ";
localizations.AccountExpiresOnLabelText = "Account gültig bis: ";

if (typeof $.sessionChecker != "undefined")
$.sessionChecker.defaultOptions.noteTextTemplate = "(Sie werden in %time% automatisch ausgeloggt.)";

/*Login page specific*/
localizations.BadLoginInfoText = "Ihr Benutzername/Passwort ist falsch, oder die login Daten sind abgelaufen.";
localizations.ServerErrorInfoText = "Der Server ist nicht erreichbar oder ihre IP Adresse wurde gebannt.";
localizations.PasswordsDoNotMatchAlertText = "Die Passwörter stimmen nicht überein.";
localizations.LoginAgainTitleText = "Bitte loggen sie sich wieder ein";
localizations.LoginWithNewPassText = "Loggen sie sich mit ihrem neuen Passwort ein";
localizations.AuthenticatingMsgText = "Uberprüft...";
localizations.LoginSuccessText = "Erfolgreich";
localizations.LoadingWebInterfaceText = "Lädt WebInterface...";
localizations.LoginWarningText = "Warnung";
localizations.MultipleBadLoginsAlertDescText = "Bei zu vielen falsch Anmeldungen wird ihre IP Adresse gesperrt.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Klicken Sie <a style='color:white;' href='/WebInterface/jQuery/reset.html'>hier</a> um ihr Passwort zurückzusetzen.</div>";
localizations.LoginFailedText = "Login fehlgeschlagen";
localizations.ChangePasswordGrowlTitleText = "Passwort ändern";
localizations.UserNameText = "Benutzername";
localizations.PasswordText = "Passwort";
localizations.RememberMeText = "Benutzerangaben merken";
localizations.ResetUserNameText = "Benutzername";
localizations.RequestPasswordHeaderText = "Passwort anfordern";
localizations.ResetPasswordButtonText = "Passwort zurücksetzen";
localizations.BackToLoginButtonText = "Zurück zum Login";
localizations.LoginButtonText = "Login";
localizations.ForgotPasswordLinkText = "E-Mail mit neuem Passwort anfordern.";
localizations.ChangePasswordHeaderText = "Ändern sie ihr Passwort";
localizations.ChangePasswordNoteText = "Sie müssen ihr Passwort ändern um fortzufahren";
localizations.CurrentPasswordText = "Aktuelles Passwort : ";
localizations.NewPasswordText = "Neues Passwort: ";
localizations.ConfirmPasswordText = "Bestätigen sie ihr Passwort : ";
localizations.CancelButtonText = "Abbrechen";
localizations.ChanngePasswordButtonText = "Passwort ändern";
localizations.GeneratePasswordButtonText = "Passwort generieren";
localizations.GeneratePasswordUseButtonText = "Dieses Passwort benutzen";
localizations.GeneratePasswordCancelButtonText = "Abbrechen";
localizations.OldBrowserNoticeHTMLAsText = 'Ihr Browser is zu alt! Aus dieesm Grund wird das WebInterface evetnuell sehr langsam sein und verschiedene funktionieren nicht so, wie Sie sollten ...<br><br><div style="text-align:right;"><button id="proceedAnyway">Trotzdem weiter</button> oder laden Sie eine neuen Browser herunter:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.UserOptionsWindowUpdateButtonText = "Save";

// Password reset page
localizations.resetPageUserName = "Benutzername oder E-Mail";
localizations.resetPagePassword = "Passwort";
localizations.resetPagePasswordConfirm = "Passwort bestätigen";
localizations.resetPageSubmit = "Speichern";
localizations.resetPageLoginPage = "Startseite";
localizations.resetPageStartOver = "Zurücksetzen";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Die Datei ist zu groß",
            "minFileSize": "Die Datei ist zu klein",
            "acceptFileTypes": "Der daten Typ ist nicht zulässig",
            "maxNumberOfFiles": "Die maximale Anzahl an Daten ist überschritten",
            "uploadedBytes": "Die Datei beinhaltet zu viele Bytes für die daten Größe",
            "emptyResult": "Resultat, leere Datei",
            "fileAvailableInSelectedFolder" : "Die Datei befindet sich schon in dem gewählten Ordner",
            "fileExistOnServer" : "Die Datei befindet sich schon auf dem Server",
            "fileBiggerThanAllowed" : "Die Datei ist größer als die zugelassene daten Größe",
            "dirNoWritable" : "Sie dürfen diesem Verzeichnis nichts hinzufügen",
            "blockUploadingDirs" : "Sie dürfen diesem Verzeichnis nichts hinzufügen",
            "true" : "true"
        },
        "error": "Fehler",
        "start": "Start",
        "waiting" : "Bitte warten...",
        "uploading" : "Lädt hoch : ",
        "reupload" : "Erneut hochladen",
        "share" : "Teilen",
        "cancel": "Abbrechen",
        "destroy": "Löschen",
        "overwrite" : "Überschreiben",
        "uploadTo" : "Hochladen nach : ",
        "pause" : "Pause",
        "errorLabel" : "Fehler : ",
        "details" : "Details",
        "uploadedInLabelText" : "Hochladen in : ",
        "atAvgSpeedOfLabelText" : "Mit durchschnitlicher Geschwindigkeit von : ",
        "uploadCompletedText" : "Hochladen abgeschlossen",
        "uploadedFileText" : "Datei auf den Server laden",
        "uploadedMultipleFilesText" : "Alle Dateien hochladen."
    }
};

localizations.buttons = {
    "admin": "Administrator",
    "delete": "Löschen",
    "rename": "Umbenennen",
    "download": "Herunterladen",
    "advanced download": "Erweiterters herunterladen",
    "zipdownload": "Gepackt Herunterladen",
    "unzip": "Entpacken",
    "zip selected": "Zip ausgewählt",
    "explore zip contents": "Gepackte Datei anschauen",
    "create folder": "Ordner anlegen",
    "upload": "Hochladen",
    "search": "Suchen",
    "user options": "Benutzer Optionen",
    "cut": "Trennen",
    "copy": "Kopieren",
    "paste": "Einfügen",
    "slideshow": "Diashow",
    "quickview": "Schnellansicht",
    "download low-res": "In minderer Qualität herunterladen",
    "preview": "Vorschau",
    "batchcomplete": "Stapel vollständig",
    "share": "Teilen",
    "quick share": "Schnelles teilen",
    "manage shares": "Teilen Verwalten",
    "show basket": "Liste anzeigen",
    "add to basket": "Der Liste hinzufügen",
    "edit keywords": "Stichwörter bearbeiten",
    "change icon": "Symbol bearbeiten",
    "download crushtunnel": "CrushTunnel herunterladen",
    "help": "Hilfe",
    "login": "Anmelden",
    "logout": "Abmelden",
    "download sync app": "Sync App herunterladen",
    "download crushftpdrive": "CrushFTPDrive herunterladen",
    "sync manager": "Synchronisations Manager"
};

// FTP WebInterface Localization options
localizations.currentLanguageName = "German"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Englisch (English)";
localizations.languageNameCzech = "Tschechisch (Čeština)";
localizations.languageNameDanish = "Dänisch (Danske)";
localizations.languageNameDutch = "Holländish (Nederlands)";
localizations.languageNameFrench = "Französisch (Français)";
localizations.languageNameGerman = "Deutsch";
localizations.languageNameHungarian = "Ungarisch (Magyar)";
localizations.languageNameItalian = "Italienisch (Italiano)";
localizations.languageNamePolish = "Polnisch (Polskie)";
localizations.languageNameSpanish = "Spanisch (Español)";
localizations.languageNameSlovak = "Slovakisch (Slovenský)";
localizations.languageNameChinese = "Chinesisch (中國)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";

localizations.FilterText = "Filter:";
localizations.ClearFilterLinkText = "Filter löschen";
localizations.FileCounterItemsText = "Objekte";
localizations.FileCounterFoldersText = "Ordner";
localizations.FileCounterFilesText = "Dateien";
localizations.FileCounterHiddenItemsText = "Verborgene Objekte";
localizations.ThumbnailViewLinkText = "Voransicht";
localizations.TreeViewLinkText = "Listenansicht";
localizations.BackToTopLinkText = "Nach oben";


localizations.NothingSelectedGrowlText = "Nichts gewählt";

localizations.ShareNothingSelectedGrowlText = "Nichts zum Freigeben gewählt";

localizations.RenameNothingSelectedGrowlText = "Nichts zum Umbennen gewählt";

localizations.ProblemWhileRenamingGrowlText = "Problem beim Umbenennen";
localizations.ProblemWhileRenamingDescGrowlText = "Problem beim Umbenennen. Bitte nochmal versuchen. Fehler: ";

localizations.ProblemWhileSharingGrowlText = "Problem beim Freigeben";
localizations.ProblemWhileSharingDescGrowlText = "Problem beim Freigeben. Bitte nochmal versuchen.";

localizations.DirectLinkDescGrowlText = "Rechter Mausklick, dann Direktlink kopieren";
localizations.UpdateKeywordDescGrowlText = "Rechter Mausklick, dann Stichwort aktualisieren";

localizations.QuickViewNothingToShowGrowlText = "Fehler: nichts sichtbar in Schnellansicht";
localizations.QuickViewNoItemsAvailableGrowlText = "Nichts verfügbar";

localizations.ProblemWhileDeletingGrowlText = "Problem beim Löschen";
localizations.ProblemWhileDeletingDescGrowlText = "Problem beim Löschen. Bitte nochmal versuchen. Fehler:";

localizations.ProblemWhileCreatingFolderGrowlText = "Problem beim Ordner anlegen";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Problem beim Ordner anlegen. Bitte nochmal versuchen. Fehler:";

localizations.JavaRequiredGrowlText = "Java ist erforderlich";
localizations.JavaRequiredDescGrowlText = "Java ist für die erweiterten Funktionen erforderlich.<br/><br/>Das gibts bei: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaAppletNotLoadedGrowlText = "Java-Applet nicht geladen";
localizations.JavaAppletNotLoadedDescGrowlText = "Zuerst auf 'Erweiterte Dateiauswahl' klicken, bevor Drap-and-Drop funktioniert.";


//Sharing Window
localizations.ShareWindowHeaderText = "Freigeben";
localizations.ShareWindowFilesSharingLabelText = "Freigabe:";
localizations.ShareWindowShareTypeLabelText = "Freigabetyp:";
localizations.ShareWindowSendEmailLabelText = "E-Mail senden:";
localizations.ShareWindowExpiresLabelText = "Gültig bis:";
localizations.ShareWindowExpiresInDaysLabelText = "Days";
localizations.ShareWindowMaxUsesLabelText = "Maximum number of uses :";
localizations.ShareWindowExpiresInDaysValidationErrorText = "Expiration days can't be more than {days} days";
localizations.ShareWindowFromLabelText = "Absender: ";
localizations.ShareWindowToLabelText = "Empfänger: ";
localizations.ShareWindowCCLabelText = "CC: ";
localizations.ShareWindowBCCLabelText = "BCC: ";
localizations.ShareWindowSubjectLabelText = "Betreff: ";
localizations.ShareWindowBodyLabelText = "Nachricht: ";
localizations.ShareWindowAdvancedLabelText = "Fortgeschritten";
localizations.ShareWindowAttachThumbsLabelText = "Voransicht anhängen";
localizations.ShareWindowAccessLabelText = "Voller Zugriff (lesen, schreiben, löschen) ";
localizations.ShareWindowSendButtonText = "Share erstellen";
localizations.ShareWindowCancelButtonText = "Abbrechen";
localizations.ShareActionCompleteUsernameText = "Benutzername: ";
localizations.ShareActionCompletePasswordText = "Passwort: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "Ok";
localizations.ShareLinkCopyToClipboardText = "Link in die Zwischenablage kopieren";
localizations.ShareLinkCopiedToClipboardText = "Link wurde in die Zwischenablage kopiert";

//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Direktlink kopieren.";

//Create folder window
localizations.CreateFolderWindowHeaderText = "Neuen Ordner anlegen.";
localizations.CreateFolderInputDefaultFolderName = "Neuer Ordner";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Nach dem Anlegen zum neuen Ordner gehen ";
localizations.CreateFolderButtonText = "Anlegen";

//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Datei-Upload";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Upload-Details";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Datei-Upload";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Erweiterte Dateiauswahl..";
localizations.BrowserUploaderStartUploadingLinkText = "Hochladen beginnen";
localizations.BrowserUploaderClearCompletedLinkText = "Übertragene aus Liste löschen";
localizations.BrowserUploaderResumeCheckboxText = "Fortsetzen";
localizations.BrowserUploaderFormResetButtonText = "Zurücksetzen";
localizations.BrowserUploaderFormNextButtonText = "Nächster";
localizations.BrowserUploaderFileAddedAlreadyText = "Diese Datei ist bereits hinzugefügt.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} wurden bereits hinzugefügt.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Diese Dateien wurden bereits hinzugefügt.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} wurden bereits hinzugefügt";
localizations.BrowserUploaderSelectedFilesGroupText = "Dateigruppe: ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Entfernen";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Wird hochgeladen zu";
localizations.BrowserUploaderSelectedFileOverwriteText = "Überschreiben";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "wird überschrieben";
localizations.BrowserUploaderSelectedFileExistsText = "Datei vorhanden";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Achtung";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorieren";
localizations.BrowserUploaderSelectedFileDoneText = "Fertig";
localizations.BrowserUploaderSelectedFileUploadedText = "Hochgeladen nach";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "re-upload";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Abweisen";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Abbrechen";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pause";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Pausiert";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Fortsetzen";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Gesamt {0} Datei(en)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} von {1} Objekt(en) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Hochladen zu : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Geschwindigkeit : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Zeit: Verstrichen: <span class='elapsed'>{0}</span> <span class='remained'>, Verbleibend : {1}</span></div>";

//Search window
localizations.SearchWindowHeaderText = "Suchen";
localizations.SearchWindowKeywordsLabelText = "Schlüsselwörter:";
localizations.SearchWindowExactLabelText = "Exakt?";
localizations.SearchWindowByClassModifiedLabelText = "Geändert";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelText = "Grösse ";
localizations.SearchWindowTypeLabelText = "Typ a";
localizations.SearchWindowSizeLabelText = "Grösse ";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Suche starten";
localizations.SearchWindowCancelButtonText = "Abbrechen";
localizations.SearchResultDisplayText = "Suchergebnis:";
localizations.SearchResultClearLinkText = "(Suchfilter löschen)";
localizations.SearchFormModifiedOptionAfterText = "Nach";
localizations.SearchFormModifiedOptionBeforeText = "Vor";
localizations.SearchFormSizeOptionBiggerThanText = "Grösser als";
localizations.SearchFormSizeOptionSmallerThanText = "Kleiner als";
localizations.SearchFormItemTypeOptionFileText = "Datei";
localizations.SearchFormItemTypeOptionFolderText = "Ordner";

//User options window
localizations.UserOptionsWindowHeaderText = "Voreinstellungen";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Objekte mit '.' ausblenden ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Kontrollkästen ausblenden ";
localizations.UserOptionsWindowHideFilterLabelText = "Filter ausblenden ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Nach Uploadauswahl automatisch mit dem Upload beginnen. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Java bei Programmstart laden.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Datei-Kompression verhindern im Java applet. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Passwort ändern ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Derzeitiges Passwort: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Neues Passwort: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Passwort bestätigen:";
localizations.UserOptionsWindowChangePasswordButtonText = "Passwort ändern";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Zufälliges Passwort generieren";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "verwenden";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Abbrechen";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Umschalten";
localizations.MainCheckboxContextMenuCheckAllText = "Alle markieren";
localizations.MainCheckboxContextMenuUncheckAllText = "Alle entmarkieren";

//Keywords window
localizations.KeywordsWindowHeaderText = "Schlüsselwörter";
localizations.KeywordsWindowUpdateLinkText = "Aktualisieren";
localizations.KeywordsWindowCancelLinkText = "Abbrechen";

//File basket
localizations.BasketHeaderText = "Dateien in der Download-Liste";
localizations.BasketClearAllLinkText = "Liste entlehren";
localizations.BasketDownloadLinkText = "Dateien der Liste downloaden";
localizations.BasketDownloadAdvancedLinkText = "Dateien der Liste downloaden (erweitert)";
localizations.BasketNoFilesAvailableText = "Keine Dateien vorhanden";
localizations.BasketRemoveLinkText = "Entfernen";
localizations.BasketTotalItemText = "Gesamt {0} Objekt(e)";
localizations.BasketFileAddedAlreadyText = "Datei ist bereits in der Download-Liste";
localizations.BasketFileAddedAlreadyDetailsText = "Ausgewählte Datei ist bereits in der Download-Liste verfügbar";
localizations.BasketNothingSelectedToAddText = "Es ist nichts ausgewählt um es zur Download-Liste hinzuzufügen";
localizations.BasketNothingSelectedToAddDetailsText = " ";

//Paste form panel
localizations.PasteFormHeaderText = "Einfügen";
localizations.PasteFormResetButtonText = "Zurücksetzen";
localizations.PasteFormPasteButtonText = "Einfügen";
localizations.PasteFormErrorHeaderText = "Problem beim Einfügen";
localizations.PasteFormErrorDetailsText = "Es ist ein Problem beim Einfügen aufgetreten.<br />Error : {0}";
localizations.PasteFormErrorNothingToPasteText = "Es gibt nichts einzufügen";

//Welcome form panel
localizations.WelcomeFormHeaderText = "Willkommen";
localizations.WelcomeFormOkButtonText = "OK";

//Slideshow popup
localizations.SlideshowPopupHeaderText = "Diashow";

//Manage Share window
localizations.ManageShareWindowHeaderText = "Freigaben bearbeiten";
localizations.ManageShareWindowRefreshLinkText = "Aktualisieren";
localizations.ManageShareWindowDeleteSelectedLinkText = "Ausgewählte Objekte löschen";
localizations.ManageShareWindowGridToLabelText = "Empfänger";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridCreatedLabelText = "Erstellt";
localizations.ManageShareWindowGridExpiresLabelText = "Gültig bis";
localizations.ManageShareWindowGridSharedItemsLabelText = "Freigabe Objekt";
localizations.ManageShareWindowGridDownloadsLabelText = "Downloads";

//Rename window and panel
localizations.RenameWindowHeaderText = "Umbenennen";
localizations.RenamePanelSaveLinkText = "Sichern";
localizations.RenamePanelCancelLinkText = "Abbrechen";

//Tooltip info
localizations.TooltipNameLabelText = "Name";
localizations.TooltipSizeLabelText = "Grösse";
localizations.TooltipModifiedLabelText = "Geändert";
localizations.TooltipKeywordsLabelText = "Schlüsselwörter";

//Form alerts and notifications
localizations.FormValidationFailText = "Ein oder mehrere erforderliche Einträge fehlen oder sind falsch. Füllen Sie bitte die mit * gekennzeichneten Felder richtig aus.";
localizations.DeleteConfirmationMessageText = "{0} Ordner und {1} Datei(en) werden gelöscht.\n\nObjekte: {2} Diese Aktion kann nicht rückgängig gemacht werden.";
localizations.CopyActionGrowlText = "{0} Ordner and {1} Datei(en) kopiert.";
localizations.CutActionGrowlText = "{0} Ordner and {1} Datei(en) ausgeschnitten.";

//Treeview header items
localizations.TreeviewHeaderNameText = "Name";
localizations.TreeviewHeaderSizeText = "Grösse";
localizations.TreeviewHeaderModifiedText = "Geändert";
localizations.TreeviewHeaderKeywordsText = "Schlüsselwörter";

//Selection menu items
localizations.SelectItemOptionLinkText = "Auswählen"
localizations.SelectCheckboxContextMenuToggleText = "Umschalten";
localizations.SelectCheckboxContextMenuCheckAllText = "Alle Objekte";
localizations.SelectCheckboxContextMenuUncheckAllText = "Keine";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Alle Dateien";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Alle Ordner";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Objekte beginnend mit \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Heute geändert";
localizations.SelectCheckboxContextMenuCheckWeekText = "Diese Woche geändert";
localizations.SelectCheckboxContextMenuCheckMonthText = "Diesen Monat geändert";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "In den letzten 60 Tagen geändert";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "In den letzten 90 Tagen geändert";

// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "{0} Objekte auf der Seite anzeigen";

/*Translation pending items*/
localizations.passwordRequirementsMessages = {
    errorTitle : "Error : \r\n",
    msgSeparator : "\r\n",
    chars : "Passwort muss mindestens $$ Zeichen lang sein.",
    numericChars : "Passwort muss mindestens $$ Nummern enthalten.",
    lowerCase : "Passwort muss mindestens $$ kleine Buchstaben enthalten.",
    upperCase : "Passwort muss mindestens $$ gro�e Buchstaben enthalten.",
    specialCase : "Passwort muss mindestens $$ Sonderzeichen enthalten.",
    notAllowedErrorMsg : "Nicht erlaubt"
};
localizations.ItemsPerPageText = 'Anzahl der Element pro Seite : ';
localizations.LayoutChangeLabelText = 'Layout : ';
localizations.refreshListingButtonTooltipText = 'neu laden';
localizations.FilterTextBasket = 'Filter:';
localizations.ClearFilterLinkTextBasket = 'Clear';
localizations.ThumbnailViewLinkTextBasket = 'Miniaturansicht';
localizations.TreeViewLinkTextBasket = 'Baumansicht';
localizations.DownloadResumeTextLabelBasket = 'Wiederaufnehmen';
localizations.FilesNotAvailableMessage = 'keine Dateien verfügbar';
localizations.CopyNoFilesSelectedMessage = 'Bitte wählen Sie die Dateien / den Ordner zum kopieren';
localizations.CopyOnlyFilesMessage = 'Sie können nur Dateien ausschneiden bzw. kopieren; Ordner werden ignoriert';
localizations.DeleteNoFilesSelectedMessage = 'Bitte wählen Sie die Dateien / Ordner zum löschen';
localizations.UnzipNoFilesSelectedMessage = 'Bitte wählen Sie die Datei zum entpacken';
localizations.ZipExploreNoFilesSelectedMessage = 'Bitte w�hlen Sie ein ZIP-Archiv aus';
localizations.CutNoFilesSelectedMessage = 'Bitte wählen Sie die Datei bzw. den Ordner zum ausschneiden';
localizations.pagingPrevText = 'Vorheriges';
localizations.pagingNextText = 'Nächstes';
localizations.pagingEllipseText = '...';
localizations.FilterItemCountText = '(Daten die dem Filter  "{filterVal}" entsprechen: {totalItems} , Ordner: {folders} Dateien: {files})';
localizations.TotalItemsInDirMsgText = ' (Anzahl der Elemente im Verzeichnis {count}) ';
localizations.CurrentFileSizeText = " (Gesamtdateigröße in der Liste: {size}) ";
localizations.TotalItemsInDirInlineText = ' ({count} Daten) ';
localizations.quotaAvailableLabelText = 'verfügbar';
localizations.WelcomeNoteSubmitFormFailureMsgText = 'Fehler: Problem beim speichern der Daten';
localizations.TreeviewSpecificActionMsgTitleText = 'Nur in der Baumansicht möglich';
localizations.TreeviewSpecificActionMsgDescText = 'Die ist nur in der Baumansicht möglich';
localizations.PasswordExpiringMsgText = 'Ihr Passwort läuft bald ab<br/>Bitte ändern Sie das Passwort in den Benutzer-Optionen.';
localizations.PasswordNotMatchingMsgText = 'Neue Passwörter stimmen nicht überein.';
localizations.PasswordMustBeComplexMsgText = 'Das Passwort muss komplexer sein.';
localizations.PasswordChangedMsgText = 'Passwort geändert. Bitte melden Sie sich mit dem neuen Passwort erneut an.';
localizations.AppletLoadingFailedMsgText = 'Applet Fehler beim hochladen';
localizations.DownloadStartedAlertTitleText = 'Download hat begonnen';
localizations.DownloadCompletedText = '[Download fertig]';
localizations.DownloadCompletedPathText = ' Downloaded nach : ';
localizations.DownloadStartedAlertDescText = 'Bitte wählen Sie den Ort um ihre Datei(en) abzuspeichern';
localizations.LogoutButtonText = 'Abmelden';
localizations.browserUploaderNativeUploadTipSetTitle = 'Upload Datei(en) mit dem Browser Uploader.';
localizations.browserUploaderAdvancedUploadTipSetTitle = 'Upload Datei(en) mit dem erweiterten Uploader, <br>(erlaubt das hochladen von Verzeichnissen und beschleunigt den Transfer)';
localizations.browserUploaderDragDropHoverLabelText = 'Legen Sie hier per Drag&Drop Dateien ab, um Sie hochzuladen';
localizations.appletUploaderDropPanelLabelText = '&darr; Legen Sie hier per Drag&Drop Dateien ab, um Sie hochzuladen &darr;';
localizations.browserUploaderDragDropLabelText = 'Legen Sie hier per Drag&Drop Dateien und Ordner ab, um Sie anschließend hochzuladen';
localizations.browserUploaderChromeDragDropLabelText = 'Legen Sie hier per Drag&Drop Dateien und Ordner ab um Sie anschließend hochzuladen';
localizations.ShareWindowShareTypeLabelCopyText = 'Kopieren';
localizations.ShareWindowShareTypeLabelMoveText = 'Verschieben';
localizations.ShareWindowShareTypeLabelReferenceText = 'Reference';
localizations.ShareWindowShareToInternalUserLabelText = 'Interne Freigabe';
localizations.ShareWindowShareToExternalUserLabelText = 'Externe Freigabe';
localizations.ShareWindowDownloadLabelText = 'Download';
localizations.ShareWindowUploadLabelText = 'Upload';
localizations.ShareWindowDeleteLabelText = 'Löschen';
localizations.ShareWindowDirectLinkLabelText = 'Direkter Link zur Datei?';
localizations.ShareWindowAttachFileLabelText = 'Datei anhängen';
localizations.ShareWindowUsernameMethodLabelText = 'Freigabe Methode : ';
localizations.ShareWindowUsernameLabelText = 'Freigabe f�r interne Benutzer';
localizations.ShareWindowUsernamesLabelText = 'Benutzername : ';
localizations.ShareWindowUsernamesLabelHelpText = '(Mehrere Benutzer durch Komma trennen.)';
localizations.ShareActionCompleteShareUsernamesText = 'Der folgende Benutzer wurden nun auf freigegebene Objekte berechtigt.';
localizations.ShareActionEmailValidationFailureHelpToolTip = 'Bitte geben Sie eine g�ltige E-Mail-Adresse ein. Mehrere Adresse k�nnen durch Komma getrennt eingegeben werden. Z.B.: <strong>bob@email.com, john@email.com,...</strong>';
localizations.ShareInvalidItemSelectedGrowlText = 'Ungültige Auswahl';
localizations.SharFoldersCantBeSharedGrowlText = 'Ordner kann nicht freigegeben werden';
localizations.SharFilesCantBeSharedGrowlText = 'Datei kann nicht freigegeben werden';
localizations.CopyLinkText = 'Link kopieren';
localizations.BrowserUploaderSelectedFileReDownloadLinkText = 'erneut herunterladen';
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = 'Durchschnittsgeschwindigkeit : ';
localizations.BatchCompleteText = 'Ergebnis';
localizations.BatchComplete = 'Übertragung best�tigt.';
localizations.BrowserUploaderSpeedTimeCalculatingText = 'Berechne..';
localizations.BrowserUploaderProblemWhileTransferMsgText = 'Problem beim Übertragen';
localizations.BrowserUploaderCancelledUploadMsgText = 'Upload abgebrochen';
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = 'Ihre Datei(en) werden gerade hochgeladen. Wenn Sie diese Seite verlassen, wird der Upload abgebrochen. Sind Sie sicher, dass Sie die Seite verlassen wollen?';
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = 'Ihre Datei(en) werden gerade heruntergeladen. Wenn Sie diese Seite verlassen, wird der Download abgebrochen.  Sind Sie sicher, dass Sie die Seite verlassen wollen?';
localizations.NoUploadInDirGrowlText = 'Hochladen nicht erlaubt';
localizations.NoUploadInDirGrowlDesc = 'Hochladen von Elementen in das gewählte Verzeichnis ist nicht erlaubt';
localizations.AdvancedUploadDirNotAllowedText = 'das hochladen von Verzeichnisse ist nicht erlaubt';
localizations.AdvancedUploadDirNotAllowedDescText = 'Verzeichnisse können nicht hochgeladen werden, bitte wählen Sie eine einzelne Datei';
localizations.uploadConfirmCancelUploadText = 'Snd Sie sicher, dass Sie das hochladen abbrechen möchten?';
localizations.uploadConfirmCancelUploadAfterFormText = 'Sie Sie sicher, dass Sie das hochladen der letzten {count} Elemente abbrechen möchten?';
localizations.browseFileLabelByClass = 'Dateien hinzufügen...';
localizations.advancedUploadResumeLabelByClass = 'Fortsetzen';
localizations.filesToUploadQueueWindowHeader = 'Dateien zum hochladen';
localizations.uploadWindowStartUploadingByClass = 'Hochladen starten';
localizations.uploadWindowCancelUploadingByClass = 'Hochladen abbrechen';
localizations.uploadWindowShowCommonUploadFormByClass = 'Details';
localizations.uploadWindowClearUploadedByClass = 'Liste leeren';
localizations.uploadWindowOverwriteAllByClass = 'Alle überschreiben';
localizations.uploadWindowRemoveAllWithErrorsByClass = 'Alle mit Fehler entfernen';
localizations.uploadWindowSummaryFilesByClass = 'Dateien : ';
localizations.uploadWindowSummarySizeByClass = ', Upload Größe : ';
localizations.uploadBarShowHideFilesSetTitleClass = 'Ausgewählte Dateien Anzeigen/Ausblenden';
localizations.uploadBarAttentionTitle = 'Keine Dateien zum hochladen vorhanden.';
localizations.uploadBarAttentionText = 'Bitte Upload-Funktion verwenden. Klicken Sie auf "Dateien" um Dateien hinzuzufügen';
localizations.uploadBiggerFileNoticeTitleText = 'Für größere Dateien nutzen Sie bitte das erweiterte Hochladen';
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>Es ist ratsam das erweiterte Hochladen für größere Dateien zu nutzen. Es lädt Dateien einfacher hoch und hat die <em>Auto Fortsetzen</em> Möglichkeit. <br><br> (Sie können in die Upload-Funktion zum erweiterte Hochladen wechseln)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='Ändern des Hochlade-Modus'>";
localizations.globalProgressbarSkipLabelByClass = 'Überspringen';
localizations.globalProgressbarPauseLabelByClass = 'Pause';
localizations.globalProgressbarStopLabelByClass = 'Stop';
localizations.popupOpenInSeparateWindowText = 'In einem separaten Fenster öffnen';
localizations.customFormPasswordMatchValidationFailedText = 'Passwörter stimmen nicht überein';
localizations.customFormCompareValueMatchValidationFailedText = 'Werte stimmen nicht überein';
localizations.syncAppName = 'CrushSync';
localizations.uploadWindowUploadTypeSwitchSetTitleClass = "Zum erweiterten Hochladen wechseln.<div style='font-size:11px;width:500px;margin:5px 0px;'>Der erweiterte Modus beschleunigt den Transfer. Er kann automatisch abgebrochene Transfers wieder aufnehmen und komplette Ordner auf einmal hochladen.<br><br>Es ist der schnellste Weg um Dateien hochzuladen.<br>(Für den erweiterten Modus muss ein Java Plugin Applet von www.java.com installiert werden.)</div>";
localizations.SearchWindowSizeLabelByClassText = 'Größe ist ';
localizations.SearchProcessNotificationText = 'Wird bearbeitet... ';
localizations.SearchProcessCancelText = 'Abbrechen';
localizations.SearchItemsContextGoToParentText = 'Zum übergeordneten Verzeichnis';
localizations.ItemsSelectionDisplayText = 'Alle <strong>{count}</strong> Elemente dieser Seite sind ausgewählt.';
localizations.ItemsSelectionSelectAllItemsInDir = 'Wählen Sie alle <strong>{total_items}</strong> Elemente in <strong>{list_type}</strong> (inklusive versteckte Elemente)</span>';
localizations.ItemsSelectionSelectedAllItemsInDir = 'Alle <strong>{total_items}</strong> Elemente in <strong>{list_type}</strong> (inklusive versteckter Elemente) sind ausgewählt';
localizations.ItemsSelectionClearSelection = 'Auswahl löschen';
localizations.ItemsSelectionShowingFolderText = 'Aktueller Ordner';
localizations.ItemsSelectionShowingFilteredItemsText = 'Aktuell gefilterte Liste';
localizations.ItemsSelectionShowingSearchedItemsText = 'Such Ergebnisse';
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = 'Sie haben nicht das korrekte Passwort eingegeben.';
localizations.ChangePasswordResetLinkExpiredText = 'Der Links ist falsch oder abgelaufen.';
localizations.BasketClearAllConfirmMessage = 'Sind Sie sicher alle ausgewählten Dateien in der Liste zu verwerfen?';
localizations.PasteSelectDirectoryWarning = 'Bitte wählen Sie ein Ziel um die kopierten Elemente einzufügen';
localizations.PasteSelectSingleDirectoryWarning = 'Bitte wählen Sie ein einzelnes Ziel um die kopierten Elemente einzufügen';
localizations.ManageShareWindowDeleteLinkText = 'Löschen';
localizations.ManageShareWindowGridLinkLabelText = 'Link';
localizations.ManageShareWindowGridFromLabelText = 'Von';
localizations.ManageShareWindowGridBCCLabelText = 'BCC';
localizations.ManageShareWindowGridSubjectLabelText = 'Betreff';
localizations.ManageShareWindowGridBodyLabelText = 'Nachrichtentext';
localizations.ManageShareWindowGridShareTypeLabelText = 'Freigabe Typ';
localizations.ManageShareWindowGridUserNameLabelText = 'Benutzername';
localizations.ManageShareWindowGridPasswordLabelText = 'Passwort';
localizations.ManageShareWindowGridAttachedLabelText = 'An E-Mail anhägen?';
localizations.ManageShareWindowGridUploadLabelText = 'Hochladen erlaubt?';
localizations.ManageShareWindowGridPathsLabelText = 'Pfad';
localizations.ManageShareWindowNothingToShowMessageText = 'Nichts zum anzeigen';
localizations.ManageShareWindowDeleteAccountConfirmationText = 'Sind Sie sicher, dass Sie {count} ausgewähltes/n Konto/en löschen möchten?';
localizations.ManageShareWindowFilterText = 'Filter :';
localizations.ManageShareWindowClearFilterText = 'L�schen';
localizations.ManageShareWindowNextItemText = 'Nächstes';
localizations.ManageShareWindowPrevItemText = 'Vorheriges';
localizations.ManageShareWindowSelectSimilarText = 'Gleiches auswählen';
localizations.ManageShareWindowPageTitle = 'CrushFTP - Freigaben verwalten';
localizations.ZipNameWindowHeaderText = 'Zip Dateiname';
localizations.ZipNamePanelSaveLinkText = 'OK';
localizations.ZipNamePanelCancelLinkText = 'Abbrechen';
localizations.SyncAppNameWindowHeaderText = 'Sync-Applikation herunterladen';
localizations.SyncAppDownloadYourPassText = 'Ihr Passwort : ';
localizations.SyncAppDownloadAdminPassText = 'Admin Passwort : ';
localizations.SyncAppNamePanelSaveLinkText = 'OK';
localizations.SyncAppNamePanelCancelLinkText = 'Abbrechen';
localizations.TooltipPathLabelText = 'Pfad';
localizations.FormEmailValidationFailText = '<br> - Bitte tragen Sie eine korrekte E-Mail Adresse ein';
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = 'Alle Elemente im Verzeichnis "{folder_name}" \r\nwerden gelöscht.\r\nInsgesamt werden {count} Elemente gelöscht.\r\nEinmal gelöscht, kann dies nicht rückgängig gemacht werden';
localizations.DownloadNothingSelectedGrowlText = 'Nichts zum herunterladen ausgewählt';
localizations.PreviewNothingSelectedGrowlText = 'Nichts für die Vorschau ausgewählt';
localizations.NoPreviewGrowlText = 'Vorschau';
localizations.NoPreviewGrowlDesc = 'Für diese Elemente ist keine Vorschau verfügbar';
localizations.QuickViewRotateClockwiseTooltipText = 'Im Uhrzeigersinn drehen';
localizations.QuickViewRotateCounterClockwiseTooltipText = 'Gegen den Uhrzeigersinn drehen';
localizations.QuickViewCurrentImagePositionText = 'Element {current} von {total}';
localizations.ProblemWhileUnzipGrowlText = 'Problem bei entpacken der Datei(en)';
localizations.ProblemWhileUnzipDescGrowlText = 'Es gab ein Problem beim entpacken. Bitte versuchen Sie es erneut. Fehler : ';
localizations.ProblemWhileZipGrowlText = 'Problem beim entpacken der Datei(en)';
localizations.ProblemWhileZipDescGrowlText = 'Fehler beim packen. Bitte versuchen Sie es erneut. Fehler : ';
localizations.JavaLoadingProblemGrowlText = 'Fehler beim laden von Java';
localizations.JavaLoadingProblemDescGrowlText = 'Es gab einen Fehler beim laden von Java, falls Java in Ihrem Browser deaktviert ist, aktivieren Sie es bitte und versuchen es erneut.';
localizations.NoFilesFoundGrowlTitle = 'Keine Daten gefunden';
localizations.NoFilesFoundGrowlText = 'Fehler : Keine Daten gefunden für';
localizations.AutoLogOutConfirmationTitle = 'Auto Logout';
localizations.AutoLogOutConfirmationDesc = 'Sie werden aufgrund von inaktivität abgemeldet.';
localizations.AutoLogOutButtonText = 'Angemeldet bleiben';
localizations.AutoLogOutMsg = 'Sie wurden aufgrund von iaktivität abgemeldet';
localizations.AutoLogOutLoginButtonText = 'Erneut anmelden..';
localizations.TreeviewHeaderPathText = 'Pfad';
localizations.advancedUploadItemsSelectionWindowTitle = 'Wählne Sie Element zum hochladen aus..';
localizations.advancedDownloadPathSelectionWindowTitle = 'Wählen Sie den Pfad für das heruntergeladen aus..';
localizations.advancedOperationsDownloadStatus = 'Herunterladen';
localizations.advancedOperationsUploadStatus = 'Hochladen';
localizations.maxAllowedDownloadSizeReached = 'Der Download überschreitet die maximal zugelassene Download-Größe';
localizations.maxAllowedDownloadSizeReachedText = 'Maximal erlaubte Größe zum herunterladen: {size}. <br />Nutzen Sie den erweiterten Download oder fügen Sie die Datei stattdessen der Liste hinzu.';
localizations.AudioPlayerPlayText = 'Abspielen';
localizations.AudioPlayerPauseText = 'Pause';
localizations.AudioPlayerStopText = 'Stoppen';
localizations.AudioPlayerMuteText = 'Lautlos';
localizations.AudioPlayerUnmuteText = 'Laut';
localizations.ChangeIconWindowHeaderText = 'Icon ändern ';
localizations.ChangeIconWindowInstructionsText = 'Wählen Sie ein kleines Bild aus um es als Icon f�r das gewählte Objekt zu verwenden:';
localizations.ChangeIconWindowSelectedFilesLabelText = 'Datei auswälen : ';
localizations.ChangeIconWindowCancelLinkText = 'Abbruch';
localizations.ChangeIconWindowUpdateLinkText = 'Speichern';
localizations.ChangeIconFileSelectAlertText = 'Bitte Bild-Datei auswählen um fortzufahren.';
localizations.UnzipStartedAlertTitleText = 'Entpacken wurde gestartet';
localizations.UnzipStartedAlertDescText = 'Entpacken wurde für die ausgewählten Dateien begonnen';
localizations.UnzipCompletedAlertTitleText = 'Entpacken ist abgeschlossen';
localizations.UnzipCompletedAlertDescText = 'Entpacken wurde f�r die ausgewählten Dateien abgeschlossen';
localizations.ZipStartedAlertTitleText = 'Zipen wurde gestartet';
localizations.ZipStartedAlertDescText = 'Zipen wurde für die ausgeählten Dateien gestartet';
localizations.ZipCompletedAlertTitleText = 'Zipen ist abgeschlossen';
localizations.ZipCompletedAlertDescText = 'Zipen ist für die ausgew�hlten Dateien abgeschlossen';
localizations.RegisterWindowProcessCompletedTitle = 'Registrierung abgeschlossen : ';
localizations.RegisterWindowProcessCompleteMessage = 'Sie können sich mit einem registrierten Benutzer anmelden, sobald er von Admin aktiviert wurde.';
localizations.RegisterWindowProcessFailedMessage = '<strong>Einige Gründe warum die Registrierung fehlschlagen kann : </strong><br><br>- Der Benutzername ist bereits in Verwendung. <br> - Der Server erlaubt temporär keine Registrierung.  <br><br> Bitte versuchen Sie es noch einmal oder wenden Sie sich an den Administrator.';
localizations.dataByClassFormatBytes = 'Bytes';
localizations.dataByClassFormatKiloBytes = 'KB';
localizations.dataByClassFormatMegaBytes = 'MB';
localizations.dataByClassFormatGigaBytes = 'GB';
localizations.dataByClassFormatTeraBytes = 'TB';
localizations.loadingIndicatorText = 'Bitte warten...';
localizations.bytesSentLabelTextByClass = 'Senden :';
localizations.bytesReceivedLabelTextByClass = 'Empfangen :';
localizations.dirInfoDownloadLabelTextByClass = 'Hochladen : ';
localizations.dirInfoUploadLabelTextByClass = 'Herunterladen : ';
localizations.maxAndAvailableAmountLabelTextByClass = 'Verfügbar/Max :';
localizations.maxAmountPerDayLabelTextByClass = 'Pro Tag :';
localizations.quotaAvailableTextByClass = 'verfügbar';
localizations.maxAmountPerMonthLabelTextByClass = 'Pro Monat :';
localizations.share_complete = 'Download erfolgreich zur Verfügung gestellt.';
localizations.share_email_sent = 'E-Mail wurde versandt';
localizations.share_open_in_email_client = 'In E-Mail Programm öffnen';
localizations.email_failed = "<div class='errorMessage'>SMTP konnte die E-Mail nicht senden.  Bitte prüfen Sie die LOG-Dateien.</div>";
localizations.loadingPageInFormFailedTitle = 'Laden fehlgeschlagen : ';
localizations.FileUploadAccessDeniedErrorMsgText = 'ERROR: Zugriff verweigert. (Sie haben nicht die Berechtigung oder die Dateierweiterung ist nicht erlaubt.)';
localizations.FileUploadContentNotAllowedErrorMsgText = 'FEHLERR:550 Fehler: Dateiinhalt nicht erlaubt';
localizations.FileUploadCanNotOverwriteErrorMsgText = 'FEHLER:Datei kann nicht überschrieben werden.';
localizations.CustomEventCallSuccessTitle = 'Erfolgreich';
localizations.CustomEventCallSuccessDesc = 'Benutzerdefiniertes Ereignis initiiert';
localizations.CustomEventCallFailureTitle = 'Fehler';
localizations.CustomEventCallFailureDesc = 'Beim Ausführen eines benutzerdefinierten Ereignisses ist ein Problem aufgetreten';
localizations.advancedUploadOptionsDialogTitle = 'Erweiterte Optionen';
localizations.advancedDownloadOptionsButtonText = 'Erweiterte Download Optionen';
localizations.advancedUploadOptionsDialogSaveButtonText = 'Speichern';
localizations.advancedUploadOptionsItemAvailableLabel = 'Wenn ein vorhandenes Element gefunden wurde :';
localizations.advancedUploadOptionsUseCompressionLabel = 'Verwenden Sie die Komprimierung :';
localizations.advancedUploadOptionsAskActionDialogTitle = 'Bitte bestätigen Sie ihre Aktion';
localizations.advancedUploadOptionsAskActionForFileDialogTitle = 'Bitte bestätigen Sie ihre Aktion für die Datei :';
localizations.advancedUploadOptionsAskActionLabelByClass = 'Aktion :';
localizations.advancedUploadOptionsAskActionDialogBtnText = 'OK';
localizations.advancedUploadActionOverWriteSelectOptionText = 'Überschreiben';
localizations.advancedUploadActionOverWriteAllSelectOptionText = 'Alle Überschreiben';
localizations.advancedUploadActionResumeSelectOptionText = 'Fortsetzen';
localizations.advancedUploadActionResumeAllSelectOptionText = 'Alle Fortsetzen';
localizations.advancedUploadActionSkipSelectOptionText = 'Überspringen';
localizations.advancedUploadActionSkilAllSelectOptionText = 'Alle Überspringen';
localizations.advancedUploadActionAskSelectOptionText = 'Fragen';
localizations.advancedUploadActionCompressionYesSelectOptionText = 'Ja';
localizations.advancedUploadActionCompressionNoSelectOptionText = 'Nein';
/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
( function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [ "../widgets/datepicker" ], factory );
    } else {

        // Browser globals
        factory( jQuery.datepicker );
    }
}( function( datepicker ) {

datepicker.regional.de = {
    closeText: "Schließen",
    prevText: "&#x3C;Zurück",
    nextText: "Vor&#x3E;",
    currentText: "Heute",
    monthNames: [ "Januar","Februar","März","April","Mai","Juni",
    "Juli","August","September","Oktober","November","Dezember" ],
    monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun",
    "Jul","Aug","Sep","Okt","Nov","Dez" ],
    dayNames: [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
    dayNamesShort: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
    dayNamesMin: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
    weekHeader: "KW",
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.de );

return datepicker.regional.de;

} ) );
//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Bitte warten...",
    playSlideshow : "Diashow abspielen",
    pauseSlideshow : "Diashow pausieren",
    refresh : "Aktualisieren",
    fullscreen : "Vollbildschirm",
    download : "Herunterladen",
    upload : "Hochladen",
    deleteText : "Löschen",
    rotateClockwise : "Im Uhrzeigersinn drehen",
    rotateCounterClockwise : "Im Gegen-Uhrzeigersinn drehen",
    previousItem : "Vorheriges Objekt",
    nextItem : "Nächstes Objekt",
    delayText : "(Verzögerung von {x} Sekunden)",
    nextPageText : "Nächste &rsaquo;",
    prevPageText : "&lsaquo; Vorherige",
    itemCountText : "(Objekt {x} von {y})",
    noItemMessage : "<h3 style='text-align:center;'>Keine Objekte verfügbar oder Problem beim Abrufen von Datensätzen.</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Hochzuladende Dateien",
    dragDropMsg : "Dateien hier per Drag and Drop ablegen",
    remove : "Entfernen",
    removeAllSelected : "Alle ausgewählten",
    removeAllWithError : "Alle fehlerhaften",
    removeAllUploaded : "Alle hochgeladenen",
    removeAllCancelled : "Alle abgebrochenen",
    removeAllSkipped : "Alle übersprungenen",
    removeAll : "Alle",
    addFiles : "Dateien hinzufügen...",
    upload : "Hochladen",
    uploadSelected : "Ausgewählte hochladen",
    reuploadAll : "Alle erneut hochladen",
    cancel : "Abbrechen",
    uploadDetails : "Upload Details",
    overwriteAll : "Alle überschreiben",
    resumeAll : "Alle fortsetzen",
    shareUploaded : "Hochgeladene teilen",
    quickFilterSubtext : "Schnellfilter...",
    total : "Insgesamt",
    filesFailed : "Datei(en) fehlgeschlagen.",
    selectedFiles : "Ausgewählte Datei(en) :",
    size : "Größe :",
    filtered : "(Gefiltert)",
    totalFiles : "Datei(en) insgesamt:",
    scrollWithActivity : "Automatisch scrollen",
    writingFile : "Schreibe Datei...",
    decompressingFile : "Entpacke Datei...",
    pleaseWait : "Bitte warten...",
    uploadedIn : "Hochgeladen in",
    aMoment: "einen Moment",
    atAvgSpeedOf : "mit einer durchschnittlichen Geschwindigkeit von",
    uploadingFailed : "Hochladen fehlgeschlagen",
    canceled : "Abgebrochen",
    skipped : "Übersprungen",
    currentSpeed : "Aktuelle Geschwindigkeit :",
    averageSpeed : "Durchschnittliche Geschwindigkeit :",
    "of" : "von",
    elapsed : "Vergangen",
    remaining : "Übrig",
    waiting : "Warten..",
    details : "Details",
    overwrite : "Überschreiben",
    resume : "Fortsetzen",
    reupload : "Erneut hochladen",
    pause : "Pause",
    paused : "Pausiert",
    uploading : "Lädt hoch",
    items : "Objekt(e)",
    skip : "Überspringen",
    cancelAll : "Alles abbrechen",
    OK : 'OK',
    CANCEL : 'Abbrechen',
    CONFIRM : "Ja",
    reuploadConfirmation : "Dies wird alle Dateien erneut hochladen, welche bereits hochgeladen, abgebrochen, übersprungen wurden oder fehlschlugen und vorhandene Dateien werden überschrieben. Möchten Sie wirklich fortfahren?",
    folderUploadNotSupported : "Das Hochladen von Dateiordnern wird vom diesem Browser nicht unterstützt.",
    fileAlreadySelected : "Datei mit selbem Ziel bereits hinzugefügt.",
    fileExistsOnServer : "Datei mit selbem Namen auf Server vorhanden.",
    fileSizeExceed : "Dateigröße überschritten.",
    fileTypeNotAllowed : "Dateityp nicht erlaubt.",
    filterApplied : "Angewandter Filter",
    noMatchingItemAvailable : "Kein passendes Objekt vorhanden.",
    addFilesToUpload : "Dateien zum Hochladen hinzufügen...",
    file : "Datei",
    reason : "Ursache",
    failedItems : "Fehlgeschlagene Objekte",
    ignoreAll : "Alle ignorieren",
    retryAll : "Alle erneut versuchen",
    failedOpeningFile : "Backend Speicher nicht verfügbar.",
    cancelConfirmation : "Möchten Sie wirklich das Hochladen abbrechen?",
    failedClosingFile : "Fehler beim Schließen der Datei",
    failedWileRetryingChunk : "Fehler beim erneuten Versuch Datensegment hochzuladen",
    retryingFile : "Versuche erneut Datei hochzuladen",
    "in" : "In",
    seconds : "Sekunde(n)",
    skipFile : "Datei überspringen",
    retryNow : "Erneut versuchen",
    retryingClosingFile : "Versuche erneut Datei zu schließen",
    fileExistConfirmation : "Die Datei [1] mit der selben Größe existiert bereits. Möchten Sie die Datei erneut senden?",
    bigFileOverwriteConfirmation : "Die Datei [1] auf dem Server ist größer, als die hochzuladende Datei. Möchten Sie die vorhandene Datei überschreiben?",
    fileExistsOnServerConfirmation : "Die Datei [1] ist bereits auf dem Server vorhanden",
    fileActionTitle : "Bitte entscheiden Sie, was mit der Datei geschehen soll.",
    applyToAll : "Auf alle anwenden",
    retryingOpeningFile : "Versuche erneut Datei zu öffnen",
    secondsAbbr : "Sek.",
    minutesAbbr : "Min.",
    hoursAbbr : "Std."
};