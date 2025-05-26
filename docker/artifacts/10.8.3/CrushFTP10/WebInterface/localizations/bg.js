//Bulgarian
/*Login page specific*/
localizations.BadLoginInfoText = "Вашето потребителско име или парола са грешни, или акаунтът Ви е изтекъл!";
localizations.ServerErrorInfoText = "Няма връзка със сървъра или вашият IP адрес е блокиран.";
localizations.PasswordsDoNotMatchAlertText = "Новата парола не съвпада";
localizations.LoginAgainTitleText = "Моля, влезте отново";
localizations.LoginWithNewPassText = "Влезте с новата Ви парола";
localizations.AuthenticatingMsgText = "Удостоверяване...";
localizations.LoginSuccessText = "Успешно";
localizations.LoadingWebInterfaceText = "Зареждане на WebInterface...";
localizations.LoginWarningText = "Внимание";
localizations.MultipleBadLoginsAlertDescText = "Прекалено много неуспешни влизания, вашият IP адрес ще бъде блокиран .\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Натиски <a style='color:white;' href='/WebInterface/jQuery/reset.html'>тук</a> за възстановяване на парола.</div>";
localizations.LoginFailedText = "Неуспешно влизане";
localizations.ChangePasswordGrowlTitleText = "Промени парола";
localizations.UserNameText = "Потребител";
localizations.ResetUserNameText = "Потребител";
localizations.PasswordText = "Парола";
localizations.RememberMeText = "Запомни ме";
localizations.LoginButtonText = "Влизане";
localizations.ForgotPasswordLinkText = "Забравих паролата си (само за външни потребители)";
localizations.ResetPasswordButtonText = "Нулиране на парола";
localizations.BackToLoginButtonText = "Върни се към Влизане";
localizations.ValidUserNameAlertText = "Моля, въведете валидно потребителско име";
localizations.RequestPasswordHeaderText = "Заявете парола";
localizations.ChangePasswordHeaderText = "Промяна на вашата парола";
localizations.ChangePasswordNoteText = "Трябва да промените вашата парола, за да продължите";
localizations.CurrentPasswordText = "Текуща парола: ";
localizations.NewPasswordText = "Бова парола: ";
localizations.ConfirmPasswordText = "Потвърдете парола: ";
localizations.CancelButtonText = "Отказ";
localizations.ChanngePasswordButtonText = "Смени парола";
localizations.GeneratePasswordButtonText = "Генерирай парола";
localizations.GeneratePasswordUseButtonText = "Използвай това";
localizations.GeneratePasswordCancelButtonText = "Отказ";
localizations.OldBrowserNoticeHTMLAsText = 'Вашият браузър е прекалено стар! Това ще доведе до забавяне и проблеми със съвместимостта. Този WebInterface може или може да не работи с  IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Продължи въпреки това</button> или вземете по-добър браузър:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "Този сървър не е конфигуриран да изпраща имейли с напомняния за пароли.";
localizations.RecaptchaValidationRequiredText = "Моля валидирайте captcha, за да влезете";
localizations.UserOptionsWindowUpdateButtonText = "Запази";
localizations.InvalidPasswordCharacterMsgText = "Паролата ви съдържа невалидни символи, моля премахнете ги.Невалидни символи ";
localizations.CookiePolicyNotificationText = "Използваме бисквитки в този сайт, за да улесним вашето влизане поради технически причини.";
localizations.CookiePolicyLinkText = "Полица за бисквитките";
localizations.CookiePolicyAcceptButtonText = "Приеми";
localizations.CookiePolicyDismissButtonText = "Откажи";
/*Reset pass page specific*/
localizations.resetPageUserName = "Потребител или Имейл : ";
localizations.resetPagePassword = "Парола: ";
localizations.resetPagePasswordConfirm = "Потвърди парола: ";
localizations.resetPageSubmit = "Потвърди";
localizations.resetPageLoginPage = "Страница за влизане";
localizations.resetPageStartOver = "Започни отначало";

localizations.passwordRequirementsMessages = {
    errorTitle : "Грешка : \r\n",
    msgSeparator : "\r\n",
    chars : "Паролата трябва да е най-малко $$ символа.",
    numericChars : "Паролата трябва да съдържа поне $$ цифри.",
    lowerCase : "Паролата трябва да е най-малко $$ малки букви.",
    upperCase : "Паролата трябва да е най-малко $$ големи букви.",
    specialCase : "Паролата трябва да е най-малко $$ специални символи.",
    unsafeChars: "Паролата не може да съдържа URL небезопасни символи: $$",
    recentPass: "Паролата не може да бъде някоя от вашите предишни пароли.",
    notAllowedErrorMsg : "Не е позволено"
};

localizations.ItemsPerPageText = "елемента за показване на страница : ";
localizations.LayoutChangeLabelText = "Лейаут : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Файлът е твърде голям",
            "minFileSize": "Файлът е твърде малък",
            "acceptFileTypes": "Типът файл не е разрешен",
            "maxNumberOfFiles": "Превишен е максималният брой файлове",
            "uploadedBytes": "Качените байтове надвишават размера на файла",
            "emptyResult": "Празен файл",
            "fileAvailableInSelectedFolder": "Файлът вече е добавен за качване в същата папка",
            "hasReachedQuota": "Размерът на файла е по-голям от вашата квота",
            "fileExistOnServer": "Файл съществува на сървъра",
            "fileBiggerThanAllowed": "Файлът е по-голям от разрешения размер",
            "dirNoWritable": "Не можете да качите в тази директория",
            "blockUploadingDirs": "Качването на директория не е позволено",
            "true": "true"
        },
        "error": "Грешка",
        "start": "Старт",
        "waiting": "Изчакване...",
        "uploading": "Качване : ",
        "reupload": "Качи отново",
        "share": "Сподели",
        "cancel": "Откажи",
        "destroy": "Изтрий",
        "overwrite": "Презапиши",
        "uploadTo": "Качи на : ",
        "pause": "Пауза",
        "errorLabel": "Грешка : ",
        "details": "Детайли",
        "uploadedInLabelText": "Качено в : ",
        "atAvgSpeedOfLabelText": "със средна скорост от : ",
        "uploadCompletedText": "Качването приключено",
        "uploadedFileText": "Файлът е качен на сървъра",
        "uploadedMultipleFilesText": "Всички файлове са качени"
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Изтрий",
    "rename": "Преименувай",
    "download": "Изтегли",
    "advanced download": "Разширено сваляне",
    "zipdownload": "Сваляне на архив",
    "unzip": "Разархивирай",
    "zip selected": "Избран архив",
    "explore zip contents": "Разгледай архивирани елементи",
    "create folder": "Създай папка",
    "upload": "Качи",
    "search": "Търси",
    "user options": "Потребителски опции",
    "cut": "Изрежи",
    "copy": "Копирай",
    "paste": "Постави",
    "slideshow": "Визуализация",
    "quickview": "QuickView",
    "download low-res": "Свали Low-Res",
    "preview": "Предварителен изглед",
    "batchcomplete": "Партида завършена",
    "share": "Сподели",
    "quick share": "Бързо споделяне",
    "manage shares": "Управлявай споделяния",
    "show basket": "Покажи кошницата",
    "add to basket": "Добави към кошницата",
    "edit keywords": "Промени ключови думи",
    "change icon": "Промени икона",
    "download crushtunnel": "Изтегли CrushTunnel",
    "help": "Помощ",
    "login": "Влизане",
    "logout": "Излизане",
    "download sync app": "Изтегли приложение за синхронизиране",
    "download crushftpdrive": "Изтегли CrushFTPDrive",
    "sync manager": "Приложение за синхронизиране"
};

localizations.currentLanguageName = "Bulgarian"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Английски (English)";
localizations.languageNameCzech = "чешки (čeština)";
localizations.languageNameDanish = "датски (Dansk)";
localizations.languageNameDutch = "холандски (Nederlands)";
localizations.languageNameFrench = "Френски (Français)";
localizations.languageNameGerman = "Немски (Deutsch)";
localizations.languageNameHungarian = "унгарски (Magyar)";
localizations.languageNameItalian = "Италиански (Italiano)";
localizations.languageNamePolish = "полски (Polskie)";
localizations.languageNameSpanish = "испански (Español)";
localizations.languageNameSlovak = "словашки (Slovenský)";
localizations.languageNameChinese = "Китайски (中文)";
localizations.languageNameSwedish = "шведски (Svenska)";
localizations.languageNameBulgarian = "Българскиi";
localizations.languageNameRussian = "Руски (русский)";
localizations.languageNameJapanese = "японски (日本語)";
localizations.languageNameRomanian = "румънски (Română)";
localizations.languageNameKorean = "корейски (한국어)";


//WebInterface
localizations.refreshListingButtonTooltipText = "Обнови";
localizations.FilterText = localizations.FilterTextBasket = "Филтър:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Изчисти";
localizations.FileCounterItemsText = "Елементи";
localizations.FileCounterFoldersText = "Папки";
localizations.FileCounterFilesText = "Файлове";
localizations.FileCounterHiddenItemsText = "Скрити елементи";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Преглед на миниатюри";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Изглед на дърво";
localizations.DownloadResumeTextLabelBasket = "Продължи"
localizations.BackToTopLinkText = "Върнете се в началото";
localizations.FilesNotAvailableMessage = "Няма налични файлове";
localizations.CopyNoFilesSelectedMessage = "Моля, изберете файлове / папки, които да копирате";
localizations.CopyOnlyFilesMessage = "Можете да изрежете / копирате само файлове, избраните папки ще бъдат игнорирани";
localizations.DeleteNoFilesSelectedMessage = "Моля, изберете файлове / папки, които да изтриете";
localizations.UnzipNoFilesSelectedMessage = "Изберете файл за разархивиране";
localizations.ZipExploreNoFilesSelectedMessage = "Изберете архив за разглеждане";
localizations.CutNoFilesSelectedMessage = "Изберете файлове/папки за изрязване";
localizations.pagingPrevText = "Предишен";
localizations.pagingNextText = "Следващ";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Елементи с фраза \"{filterVal}\" : {totalItems} , Папки: {folders} Файлове: {files})";
localizations.TotalItemsInDirMsgText = " (Общо елементи в директория {count}) ";
localizations.CurrentFileSizeText = " (Общ размер на файла в списъка {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} брой) ";
localizations.quotaAvailableLabelText = "на разположение";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Грешка: Проблем при запазване на данни";
localizations.TreeviewSpecificActionMsgTitleText = "Само за изглед на дърво";
localizations.TreeviewSpecificActionMsgDescText = "Това е специфично само за изглед на дърво";
localizations.PasswordExpiringMsgText = "Парола изтича скоро <br/> Използвайте бутона за потребителски опции, за да промените.";
localizations.PasswordNotMatchingMsgText = "Новите пароли не съвпадат.";
localizations.PasswordMustBeComplexMsgText = "Паролата трябва да е по-сложна.";
localizations.PasswordChangedMsgText = "Паролата е сменена. Моля, влезте с новата парола.";
localizations.AppletLoadingFailedMsgText = "Приложение се провали при качването";
localizations.DownloadStartedAlertTitleText = "Изтеглянето започна";
localizations.DownloadCompletedText = "[Изтеглянето завърши] ";
localizations.DownloadCompletedPathText = "Изтеглено в:";
localizations.DownloadStartedAlertDescText = "Моля, изберете местоположение, за да запазите вашите файлове или файлове, за да продължите";
localizations.LogoutButtonText = "Излезте";
localizations.browserUploaderNativeUploadTipSetTitle = "Качване на файлове с помощта на браузър за качване.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Качвайте файлове с помощта на разширения инструмент за качване, <br> той позволява папки и може да ускори прехвърлянето. ";
localizations.browserUploaderDragDropHoverLabelText = "Пуснете файловете тук, за да ги качите";
localizations.appletUploaderDropPanelLabelText = "&darr; Пуснете файловете тук, за да ги качите &darr;";
localizations.browserUploaderDragDropLabelText = "Пуснете файловете тук, за да ги качите";
localizations.browserUploaderChromeDragDropLabelText = "Пуснете файловете тук, за да ги качите";
localizations.advancedUploadOptionsDialogSaveButtonText = "Запази";
localizations.advancedUploadOptionsDialogCancelButtonText = "Откажи";

//Sharing Window
localizations.ShareWindowHeaderText = "Споделяне на файлове";
localizations.ShareWindowFilesSharingLabelText = "Споделяне :";
localizations.ShareWindowShareTypeLabelText = "Тип на споделяне:";
localizations.ShareWindowShareTypeLabelCopyText = "Копиране";
localizations.ShareWindowShareTypeLabelMoveText = "Премести";
localizations.ShareWindowShareTypeLabelReferenceText = "Референция";
localizations.ShareWindowShareToInternalUserLabelText = "Вътрешно споделяне";
localizations.ShareWindowShareToExternalUserLabelText = "Външно споделяне";
localizations.ShareWindowDownloadLabelText = "Изтегли";
localizations.ShareWindowExpiresInDaysLabelText = "Дни";
localizations.ShareWindowExpiresInDaysValidationErrorText = "Дните на изтичане не могат да бъдат повече от {days} дни";
localizations.ShareWindowMaxUsesLabelText = "Максимален брой приложения:";
localizations.ShareWindowUploadLabelText = "Качи";
localizations.ShareWindowDeleteLabelText = "Изтрий";
localizations.ShareWindowSendEmailLabelText = "Изпрати Email :";
localizations.ShareWindowDirectLinkLabelText = "Директен линк към файла?";
localizations.ShareWindowExpiresLabelText = "Изтича :";
localizations.ShareWindowFromLabelText = "From : ";
localizations.ShareWindowToLabelText = "To : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "BCC : ";
localizations.ShareWindowReplyToLabelText = "Reply To : ";
localizations.ShareWindowSubjectLabelText = "Subject : ";
localizations.ShareWindowBodyLabelText = "Body : ";
localizations.ShareWindowAdvancedLabelText = "Advanced";
localizations.ShareWindowAttachThumbsLabelText = "Прикачете миниатюра";
localizations.ShareWindowAttachFileLabelText = "Прикачи файлове";
localizations.ShareWindowCommentsLabelText = "Коментари : ";
localizations.ShareWindowKeywordsLabelText = "Ключови думи : ";
localizations.ShareWindowAccessLabelText = "Пълен достъп ";
localizations.ShareWindowSendButtonText = "Изпрати";
localizations.ShareWindowAlternateTempAccountLabelText = "Алтернативен временен акаунт :";
localizations.ShareWindowCancelButtonText = "Откажи";
localizations.ShareWindowUsernameMethodLabelText = "Метод на споделяне : ";
localizations.ShareWindowUsernameLabelText = "Споделяне с вътрешнен потребител";
localizations.ShareWindowUsernamesLabelText = "Потребителски имена : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Отделете няколко потребителски имена със запетаи.)";
localizations.ShareActionCompleteShareUsernamesText = "Следните потребители получиха достъп до споделените елементи.";
localizations.ShareActionCompleteUsernameText = "Потребител: ";
localizations.ShareActionCompletePasswordText = "Парола: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Моля, въведете валиден имейл адрес. Можете да въведете няколко имейл адреса, разделени със запетая. т.е.. <strong> bob@email.com, john@email.com, ...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Невалиден елемент";
localizations.SharFoldersCantBeSharedGrowlText = "Папките не могат да се споделят";
localizations.SharFilesCantBeSharedGrowlText = "Файлове не могат да се споделят";
localizations.ShareLinkCopyToClipboardText = "Копирайте връзката в клипборда";
localizations.ShareLinkCopiedToClipboardText = "Връзка се копира в клипборда";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "Вътрешното споделяне не приема имейл адрес, моля използвайте потребителско име";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Копиране на директна връзка.";
localizations.CopyLinkText = "Копиране на връзка";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Създайте нова папка.";
localizations.CreateFolderInputDefaultFolderName = "Нова папка";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Придвижете се до папката след създаването ";
localizations.CreateFolderButtonText = "Създай";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Качи файл";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Подробности за качване ";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Качване на файлове ";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Разширено преглед..";
localizations.BrowserUploaderStartUploadingLinkText = "Стартиране на качване";
localizations.BrowserUploaderClearCompletedLinkText = "Изчистване завършено";
localizations.BrowserUploaderResumeCheckboxText = "Продължи";
localizations.BrowserUploaderFormResetButtonText = "Нулиране";
localizations.BrowserUploaderFormNextButtonText = "Следващия";
localizations.BrowserUploaderFileAddedAlreadyText = "Този файл вече е добавен.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} вече са били добавени.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Тези файлове вече са добавени.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} вече са добавени. ";
localizations.BrowserUploaderSelectedFilesGroupText = "Група файлове:";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Премахване";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Ще бъде качен в";
localizations.BrowserUploaderSelectedFileOverwriteText = "Презаписване";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "ще бъде презаписан";
localizations.BrowserUploaderSelectedFileExistsText = "Файл съществува";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Необходимо внимание";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Игнорирай";
localizations.BrowserUploaderSelectedFileDoneText = "Изпълнени";
localizations.BrowserUploaderSelectedFileUploadedText = "Качено в";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "Качи отново";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "Свали отново";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Отхвърляне";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Откажи";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Пауза";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Паузиран";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Възобнови";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Общо {0} файл(ове)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} от {1} елемент(а) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Качване в  ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Текуща скорост : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Средна скорост : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Изминало време: <span class='elapsed'>{0}</span> <span class='remained'>, Оставащо : {1}</span></div>";
localizations.BatchCompleteText = "Резултат";
localizations.BatchComplete = "Признати трансфери.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Изчисляване..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Проблем при прехвърлянето";
localizations.BrowserUploaderCancelledUploadMsgText = "Качването е анулирано";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "В момента вашите файлове или файлове се качват. Ако отидете далеч от тази страница, ще ги загубите. Наистина ли искате да излезете от тази страница?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "В момента вашите файлове или файлове се свалят. Ако отидете далеч от тази страница, ще ги загубите. Наистина ли искате да излезете от тази страница?";
localizations.NoUploadInDirGrowlText = "Качването не е позволено";
localizations.NoUploadInDirGrowlDesc = "Качването на елементи в избраната директория не е позволено";
localizations.AdvancedUploadDirNotAllowedText = "Качването на директория не е позволено";
localizations.AdvancedUploadDirNotAllowedDescText = "Не могат да се качват директории, изберете само файлове";
localizations.uploadConfirmCancelUploadText = "Наистина ли искате да прекратите това качване?";
localizations.uploadConfirmCancelUploadAfterFormText = "Сигурни ли сте, че искате да отмените качването за последно избраните {count} елемент(и)?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Добави файлове...";
localizations.advancedUploadResumeLabelByClass = "Продължи";
localizations.filesToUploadQueueWindowHeader = "Файлове за качване";
localizations.uploadWindowStartUploadingByClass = "Започнете качването";
localizations.uploadWindowCancelUploadingByClass = "Отказ за качване";
localizations.uploadWindowShowCommonUploadFormByClass = "детайли";
localizations.uploadWindowClearUploadedByClass = "Изчистване на каченото";
localizations.uploadWindowOverwriteAllByClass = "Презапишете всички";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Премахнете всички с грешки";
localizations.uploadWindowSummaryFilesByClass = "файлове : ";
localizations.uploadWindowSummarySizeByClass = ", Размер на качване : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Показване / скриване на панела за качване";
localizations.uploadBarAttentionTitle = "Сега добавете файлове от лентата за качване";
localizations.uploadBarAttentionText = "Използвайте лентата за качване, за да добавите файлове за качване. Кликнете върху \"" + localizations.browseFileLabelByClass + "\" бутона за добавяне на файлове";
localizations.uploadBiggerFileNoticeTitleText = "За по-големи файлове използвайте разширено качване";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>Препоръчва се да се използва разширено качване за по-големи файлове, то позволява да се качват файлове лесно и има <em>функция автоматично възобновяване</em>. <br><br> (Можете да превключите режим на качване в лентата за качване)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='How to switch upload mode'>";

localizations.globalProgressbarSkipLabelByClass = "пропускане";
localizations.globalProgressbarPauseLabelByClass = "пауза";
localizations.globalProgressbarStopLabelByClass = "стоп";

localizations.popupOpenInSeparateWindowText = "Отваряне в отделен прозорец";
localizations.customFormPasswordMatchValidationFailedText = "Паролата не съвпада";
localizations.customFormCompareValueMatchValidationFailedText = "Стойностите не съвпадат";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Превключване към Нормално качване";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Преминаване към разширено качване.<div style='font-size:11px;width:500px;margin:5px 0px;'>Разширеният режим ще ускори трансферите. Той може автоматично да се възобнови, ако прехвърлянето не успее, и може да качи цели папки наведнъж.<br><br>Това е най-бързият начин за качване на файлове.<br>(Разширеният режим изисква да бъде инсталиран плъгинът Java Applet от www.java.com.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Търси";
localizations.SearchWindowKeywordsLabelText = "Ключови думи :";
localizations.SearchWindowExactLabelText = "точен?";
localizations.SearchWindowByClassModifiedLabelText = "Модифициран";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelByClassText = "Размер ";
localizations.SearchWindowTypeLabelText = "Тип";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Стартирай търсене";
localizations.SearchWindowCancelButtonText = "Откажи";
localizations.SearchResultDisplayText = "Резултати от търсенето:";
localizations.SearchResultClearLinkText = "(Изчисти филтъра на търсенето)";
localizations.SearchFormModifiedOptionAfterText = "Следващ";
localizations.SearchFormModifiedOptionBeforeText = "Предишен";
localizations.SearchFormSizeOptionBiggerThanText = "По-голям от";
localizations.SearchFormSizeOptionSmallerThanText = "По-малък от";
localizations.SearchFormItemTypeOptionFileText = "файл";
localizations.SearchFormItemTypeOptionFolderText = "папка";
localizations.SearchProcessNotificationText = "обработване... ";
localizations.SearchProcessCancelText = "Откажи";
localizations.SearchItemsContextGoToParentText = "Отидете на родителска папка";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Всички <strong>{count}</strong> елементи от тази страница са избрани.";
localizations.ItemsSelectionSelectAllItemsInDir = "Избери всички <strong>{total_items}</strong> елементи в <strong>{list_type}</strong> (включително скритите елементи)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Всички <strong>{total_items}</strong> елементи в <strong>{list_type}</strong> (включително скритите елементи) са избрани";
localizations.ItemsSelectionClearSelection = "Изчисти избора";
localizations.ItemsSelectionShowingFolderText = "Текуща папка";
localizations.ItemsSelectionShowingFilteredItemsText = "Текущ филтриран лист";
localizations.ItemsSelectionShowingSearchedItemsText = "Резултат от търсенето";
//User options window
localizations.UserOptionsWindowHeaderText = "Предпочитания";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Скрий '.' елементи ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Скриване на колона за отметка ";
localizations.UserOptionsWindowHideFilterLabelText = "Скриване на секцията за филтриране ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Когато избирате файл за качване, автоматично стартирайте качването. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Когато зареждате интерфейса, заредете аплета Java.";
localizations.UserOptionsWindowDisableWaveformLabelText = "Деактивира възпроизвеждането на вградено аудио";
localizations.UserOptionsWindowDisableCompressionLabelText = "Деактивирайте компресирането на Java аплета. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Променете паролата си ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Текуща парола: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Нова парола: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Потвърди парола:";
localizations.UserOptionsWindowChangePasswordButtonText = "Промяна на паролата";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Генериране на случайна парола";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Използвай това";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Откажи";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "Не сте въвели правилната текуща парола.";
localizations.ChangePasswordResetLinkExpiredText = "Не сте въвели правилната текуща парола. Връзката е невалидна или изтекла.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Бутон";
localizations.MainCheckboxContextMenuCheckAllText = "Избери всички";
localizations.MainCheckboxContextMenuUncheckAllText = "Премахнете отметката от всички";
//Keywords window
localizations.KeywordsWindowHeaderText = "Ключови думи";
localizations.KeywordsWindowUpdateLinkText = "Обнови";
localizations.KeywordsWindowCancelLinkText = "Откажи";
//File basket
localizations.BasketHeaderText = "Файлове в кошницата";
localizations.BasketClearAllLinkText = "Изчисти всичко";
localizations.BasketDownloadLinkText = "Изтеглете кошницата";
localizations.BasketDownloadAdvancedLinkText = "Кошница разширено изтеглене";
localizations.BasketNoFilesAvailableText = "Няма налични файлове";
localizations.BasketRemoveLinkText = "Премахни";
localizations.BasketTotalItemText = "{0} Елемента ";
localizations.BasketFileAddedAlreadyText = "Файлът вече е добавен в кошницата";
localizations.BasketFileAddedAlreadyDetailsText = "Избраният файл вече е наличен в кошницата";
localizations.BasketNothingSelectedToAddText = "Нищо не е избрано за добавяне в кошницата";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Сигурни ли сте, че искате да изчистите всички избрани файлове в кошницата?";
//Paste form panel
localizations.PasteFormHeaderText = "Поставяне";
localizations.PasteFormResetButtonText = "Нулиране";
localizations.PasteFormPasteButtonText = "Поставяне";
localizations.PasteFormErrorHeaderText = "Проблем при поставяне";
localizations.PasteFormErrorDetailsText = "При поставяне на елементи възникна проблем.<br /Грешка : {0}";
localizations.PasteFormErrorNothingToPasteText = "Няма какво да се постави";
localizations.PasteSelectDirectoryWarning = "Моля, изберете цел, за да поставите копирани елементи";
localizations.PasteSelectSingleDirectoryWarning = "Моля, изберете единична цел, за да поставите копирани елементи";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Добре дошли";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "Качете подробности";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Откажи";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Визуализация";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Управление на споделяния";
localizations.ManageShareWindowRefreshLinkText = "Обновяване";
localizations.ManageShareWindowDeleteSelectedLinkText = "Изтрийте избраните елементи";
localizations.ManageShareWindowDeleteLinkText = "Изтрий";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "From";
localizations.ManageShareWindowGridToLabelText = "To";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridReplyToLabelText = "Reply To";
localizations.ManageShareWindowGridSubjectLabelText = "Subject";
localizations.ManageShareWindowGridBodyLabelText = "Body";
localizations.ManageShareWindowGridShareTypeLabelText = "Тип на споделяне";
localizations.ManageShareWindowGridUserNameLabelText = "Потребител";
localizations.ManageShareWindowGridPasswordLabelText = "Парола";
localizations.ManageShareWindowGridAttachedLabelText = "Прикачен в имейл?";
localizations.ManageShareWindowGridUploadLabelText = "Качването е разрешено?";
localizations.ManageShareWindowGridPathsLabelText = "Пътища";
localizations.ManageShareWindowGridCreatedLabelText = "Създаден";
localizations.ManageShareWindowGridExpiresLabelText = "Изтича";
localizations.ManageShareWindowGridSharedItemsLabelText = "Споделени елементи";
localizations.ManageShareWindowGridDownloadsLabelText = "Downloads";
localizations.ManageShareWindowNothingToShowMessageText = "Нищо за показване";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Сигурни ли сте, че искате да изтриете избраните {count} акаунт (и) ?";
localizations.ManageShareWindowFilterText = "Филтър :";
localizations.ManageShareWindowClearFilterText = "Изчисти";
localizations.ManageShareWindowNextItemText = "Следващ";
localizations.ManageShareWindowPrevItemText = "Предишен";
localizations.ManageShareWindowSelectSimilarText = "Изберете подобни";
localizations.ManageShareWindowPageTitle = "LEONI SFX - Manage Shares";
localizations.ManageShareWindowEditDialogTitle = "Редактиране на споделяне";
localizations.ManageShareWindowShareDetailsDialogTitle = "Споделете подробности";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Преименувай";
localizations.RenamePanelSaveLinkText = "Запази";
localizations.RenamePanelCancelLinkText = "Откажи";

localizations.ZipNameWindowHeaderText = "Име на архив";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Откажи";

localizations.SyncAppNameWindowHeaderText = "Сваляне на приложение за синхронизиране";
localizations.SyncAppDownloadYourPassText = "Вашата парола : ";
localizations.SyncAppDownloadAdminPassText = "Парола Администратор : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Откажи";

//Tooltip info
localizations.TooltipNameLabelText = "Име";
localizations.TooltipPathLabelText = "Местоположение";
localizations.TooltipSizeLabelText = "Размер";
localizations.TooltipModifiedLabelText = "Променен";
localizations.TooltipKeywordsLabelText = "Ключови думи";

//Form alerts and notifications
localizations.FormValidationFailText = "Един или повече необходими елементи не са въведени или не са въведени правилно. Въведете подходяща стойност за елементите с * във формата по-долу";
localizations.FormEmailValidationFailText = "<br> - Въведи валиден имейл адрес в полето(тата) за имейл";
localizations.DeleteConfirmationMessageText = "{0} папка(и) и {1} файл(ове) ще бъдат изтрити.\n\nФайлове: {2} Веднъж изтрити, не могат да бъдат възстановени.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Всички файлове в папка \"{folder_name}\" ще бъдат изтрите.\n\nОбщо {count} ще бъдат изтрити.\n\nВеднъж изтрити, не могат да бъдат възстановени";
localizations.CopyActionGrowlText = "Общо {0} папка(и) и {1} файл(ове) копирани.";
localizations.CutActionGrowlText = "Общо {0} папка(и) и {1} файл(ове) изрязани.";
localizations.NothingSelectedGrowlText = "Нищо не е избрано";
localizations.ShareNothingSelectedGrowlText = "Нищо не е избрано за споделяне";
localizations.DownloadNothingSelectedGrowlText = "Нищо не е избрано за изтегляне";
localizations.RenameNothingSelectedGrowlText = "Нищо не е избрано за преименуване";
localizations.PreviewNothingSelectedGrowlText = "Нищо не е избрано за визуализация";
localizations.NoPreviewGrowlText = "Визуализация";
localizations.NoPreviewGrowlDesc = "Не е наличена визуализация за избрания елемент";
localizations.ProblemWhileRenamingGrowlText = "Проблем при преименуването";
localizations.ProblemWhileRenamingDescGrowlText = "При преименуването възникна проблем. Моля, опитайте отново. Грешка: ";
localizations.ProblemWhileSharingGrowlText = "Проблем при споделянето";
localizations.ProblemWhileSharingDescGrowlText = "При споделянето на файл възникна проблем. Моля, опитайте отново";
localizations.DirectLinkDescGrowlText = "Щракнете с десния бутон върху елемент и кликнете върху копиране на директна връзка";
localizations.UpdateKeywordDescGrowlText = "Щракнете с десния бутон върху елемент и кликнете върху актуализиране на ключови думи";
localizations.QuickViewNothingToShowGrowlText = "Грешка: Нищо не се показва на бърз преглед";
localizations.QuickViewNoItemsAvailableGrowlText = "Няма налични елементи";
localizations.QuickViewRotateClockwiseTooltipText = "Завърти по часовниковата стрелка";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Завърти обратно на часовниковата стрелка";
localizations.QuickViewCurrentImagePositionText = "Елемнт {current} от {total}";
localizations.ProblemWhileDeletingGrowlText = "Имаше проблем при изтриването";
localizations.ProblemWhileDeletingDescGrowlText = "Имаше проблем при изтриването. Моля, опитайте отново. ГРЕШКА : ";
localizations.ProblemWhileUnzipGrowlText = "Имаше проблем при разархивиране";
localizations.ProblemWhileUnzipDescGrowlText = "Имаше проблем при разархивиране. Моля, опитайте отново. ГРЕШКА : ";
localizations.ProblemWhileZipGrowlText = "Проблем при архивирването на файл(ове)";
localizations.ProblemWhileZipDescGrowlText = "При архивирването възникна проблем. Моля, опитайте отново. ГРЕШКА: ";
localizations.ProblemWhileCreatingFolderGrowlText = "ри създаването на нова папка възникна проблем";
localizations.ProblemWhileCreatingFolderDescGrowlText = "При създаването на нова папка възникна проблем. Моля, опитайте отново. Грешка:";
localizations.JavaRequiredGrowlText = "Изисква се Java";
localizations.JavaRequiredDescGrowlText = "Трябва да се инсталира Java, за да работят разширените функции.<br/><br/>Моля отидете на: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Проблем при зареждането на Java";
localizations.JavaLoadingProblemDescGrowlText = "При зареждането на Java възникна проблем, ако Java е деактивиран в браузъра, моля, активирайте и опитайте отново.";
localizations.JavaAppletNotLoadedGrowlText = "Java Applet не е зареден";
localizations.JavaAppletNotLoadedDescGrowlText = "Първо трябва да кликнете върху бутона 'Разширено преглед ...', преди да се активира плъзгането и пускането.";
localizations.NoFilesFoundGrowlTitle = "Бекенд съхранение e недостъпнo";
localizations.NoFilesFoundGrowlText = "Грешка: бекенд съхранение e недостъпнo за вашето местоположение:";
localizations.AutoLogOutConfirmationTitle = "Автоматично излизане";
localizations.AutoLogOutConfirmationDesc = "На път сте да излезете поради бездействие";
localizations.AutoLogOutButtonText = "Остани вписан";
localizations.AutoLogOutMsg = "Отвисани сте поради бездействие";
localizations.AutoLogOutLoginButtonText = "Влез отново..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Име";
localizations.TreeviewHeaderPathText = "Местоположение";
localizations.TreeviewHeaderSizeText = "Размер";
localizations.TreeviewHeaderModifiedText = "Променено";
localizations.TreeviewHeaderKeywordsText = "Ключови думи";
//Selection menu items
localizations.SelectItemOptionLinkText = "Избор";
localizations.SelectCheckboxContextMenuToggleText = "Бутон";
localizations.SelectCheckboxContextMenuCheckAllText = "Всички";
localizations.SelectCheckboxContextMenuUncheckAllText = "Нито един";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Всички файлове";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Всички папки";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Елементи започващи с  \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Променен днес";
localizations.SelectCheckboxContextMenuCheckWeekText = "Променен тази седмица";
localizations.SelectCheckboxContextMenuCheckMonthText = "Промене този месец";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Променен в последните 60 дни";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Променен в последните 90 дни";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Покажи {0} елемента на страница";
//Webinterface labels
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Изберете елемента за качване ..";
localizations.advancedDownloadPathSelectionWindowTitle = "Изберете път, където да изтеглите ..";
localizations.advancedOperationsDownloadStatus = "Сваляне";
localizations.advancedOperationsUploadStatus = "Качване";

localizations.maxAllowedDownloadSizeReached = "Размерът на изтегляне надвишава максимално разрешения размер"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Максимален размер, разрешен за изтегляне: {size}. <br />Използвайте разширения изтеглятел или добавете в кошницата вместо това."; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "Старт";
localizations.AudioPlayerPauseText = "Пауза";
localizations.AudioPlayerStopText = "Спри";
localizations.AudioPlayerMuteText = "Заглуши";
localizations.AudioPlayerUnmuteText = "Включи звука";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Промяна на иконата ";
localizations.ChangeIconWindowInstructionsText = "Изберете малко изображение, което да зададете като икона за избрания елемент:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Избран файл: ";
localizations.ChangeIconWindowCancelLinkText = "Откажи";
localizations.ChangeIconWindowUpdateLinkText = "Запази";
localizations.ChangeIconFileSelectAlertText = "Моля, изберете файл с изображения, за да продължите.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Разархивирането стартира";
localizations.UnzipStartedAlertDescText = "Операцията по разархивирване е започнала за избрани файлове";
localizations.UnzipCompletedAlertTitleText = "Разархивирането е завършено";
localizations.UnzipCompletedAlertDescText = "Разархивирането приключи за избраните файлове";

//zip operation
localizations.ZipStartedAlertTitleText = "Архивиране стартира";
localizations.ZipStartedAlertDescText = "Операцията по архивирване е започнала за избрани файлове";
localizations.ZipCompletedAlertTitleText = "Архивирането е завършено";
localizations.ZipCompletedAlertDescText = "Архивирането приключи за избраните файлове";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Регистрацията приключи : ";
localizations.RegisterWindowProcessCompleteMessage = "Можете да влезете с регистриран потребител, след като е активиран от администратора.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Малко са причините, поради които регистрацията може да се провали : </strong><br><br>- Потребителското име вече се използва. <br> - Сървърът временно не позволява регистрации.  <br><br> Моля, опитайте отново или се свържете с вашия администратор.";

//Data size format items
localizations.dataByClassFormatBytes = "bytes";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "Моля изчакайте...";

localizations.bytesSentLabelTextByClass = "Изпрати :";
localizations.bytesReceivedLabelTextByClass = "Получи :";
localizations.dirInfoDownloadLabelTextByClass = "Свали : ";
localizations.dirInfoUploadLabelTextByClass = "Качи : ";
localizations.maxAndAvailableAmountLabelTextByClass = "На разположение/Максимално:";
localizations.maxAmountPerDayLabelTextByClass = "На ден :";
localizations.quotaAvailableTextByClass = "на разположение";
localizations.maxAmountPerMonthLabelTextByClass = "На месец :";

//Server message localized
localizations.share_complete = "Публикуване завършено.";
localizations.share_email_sent = "Изпратено имейл съобщение.";
localizations.share_open_in_email_client = "Oтворете в имейл клиента";
localizations.email_failed = "<div class='errorMessage'>SMTP не успя да изпрати имейла. Проверете логовете на сървъра.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Зареждането не бе успешно : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "ГРЕШКА: Достъпът е отказан. (Нямате разрешение или разширението на файла не е позволено.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "ГРЕШКА: 550 Грешка: Съдържанието на файл не е позволено.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "ГРЕШКА: Не може да се презапише файл.";

localizations.CustomEventCallSuccessTitle = "успех";
localizations.CustomEventCallSuccessDesc = "Инициирано персонализирано събитие";
localizations.CustomEventCallFailureTitle = "неуспех";
localizations.CustomEventCallFailureDesc = "Възникна проблем при изпълнение на персонализирано събитие";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Разширени опции";
localizations.advancedDownloadOptionsButtonText = "Разширени опции за изтегляне";
localizations.advancedUploadOptionsDialogSaveButtonText = "Запази";
localizations.advancedUploadOptionsItemAvailableLabel = "Когато се намери съществуващ елемент :";
localizations.advancedUploadOptionsUseCompressionLabel = "Използвайте компресия :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Моля, потвърдете действието си";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Моля, потвърдете действието си за файла :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Действие :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Презапиши";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Презапиши всички";
localizations.advancedUploadActionResumeSelectOptionText = "Възобнови";
localizations.advancedUploadActionResumeAllSelectOptionText = "Възобнови всички";
localizations.advancedUploadActionSkipSelectOptionText = "Пропусни";
localizations.advancedUploadActionSkilAllSelectOptionText = "Пропусни всички";
localizations.advancedUploadActionAskSelectOptionText = "Попитай";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Да";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Не";
localizations.MaxUploadFilesCountReachedGrowlText = "Превишен е максималният брой файлове";
localizations.MaxUploadFilesCountReachedGrowlDesc = "Максималният брой файлове, разрешени за качване, е надвишен, максималният брой файлове е позволен:";

localizations.LoggedInAsLabelText = "Влязъл като : ";
localizations.AccountExpiresOnLabelText = "Изтича : ";
localizations.maxListItemsWarningMessage = "Големите списъци с директории причиняват значителни проблеми с производителността. Предлагаме да организирате елемента в подпапки, за да предотвратите проблеми с производителността.";
if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Сетията ще изтече след %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Моля, изчакайте...",
    playSlideshow : "Стартирай Slideshow",
    pauseSlideshow : "Пауза на  Slideshow",
    refresh : "Обнови",
    fullscreen : "Цял екран",
    download : "Свали",
    upload : "Качи",
    deleteText : "Изтрий",
    rotateClockwise : "Завърти по часовниковата стрелка",
    rotateCounterClockwise : "Завърти  на обратно на часовниковата стрелка",
    previousItem : "Предишен елемент",
    nextItem : "Следващ елемент",
    delayText : "(Закъснение {x} секунди)",
    nextPageText : "Следваща &rsaquo;",
    prevPageText : "&lsaquo; Предишна",
    itemCountText : "(Елемент {x} от {y})",
    noItemMessage : "<h3 style='text-align:center;'>Няма налични елемента или проблем при извличането на записи.</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Файлове за качване",
    dragDropMsg : "Плъзнете и пуснете файла тук",
    remove : "Премахни",
    removeAllSelected : "Всички избрани",
    removeAllWithError : "Всички с грешка",
    removeAllUploaded : "Всички качени",
    removeAllCancelled : "Всички отменени",
    removeAllSkipped : "Всички пропуснати",
    removeAll : "Всички",
    addFiles : "Доабави файлове...",
    upload : "Качи",
    uploadSelected : "Качи избраните",
    reuploadAll : "Качи всички отново",
    cancel : "Откажи",
    uploadDetails : "Качи детайли",
    overwriteAll : "Презапиши всички",
    resumeAll : "Възстанови всички",
    shareUploaded : "Споделянето качено",
    quickFilterSubtext : "Бързо филтриране...",
    total : "Общо",
    filesFailed : "файл(ове) неуспешно",
    selectedFiles : "Избраните файл(ове):",
    size : "Размер :",
    filtered : "(Филтър)",
    totalFiles : "Общо файл(ове) :",
    scrollWithActivity : "Превъртете с дейност",
    writingFile : "Записване файл...",
    decompressingFile : "Декомпресиране на файл...",
    pleaseWait : "Моля, изчакайте...",
    uploadedIn : "Качено в ",
    aMoment: "в момента",
    atAvgSpeedOf : "със средна скорост от",
    uploadingFailed : "Качване неуспешно",
    canceled : "Отказани",
    skipped : "Пропуснати",
    currentSpeed : "Текуща скорост :",
    averageSpeed : "Средна скорост :",
    "of" : "от",
    elapsed : "Изминати",
    remaining : "Остава",
    waiting : "Изчакване..",
    details : "Детайли",
    overwrite : "Презапиши",
    resume : "Поднови",
    reupload : "Качване отново",
    pause : "Пауза",
    paused : "Паузиран",
    uploading : "Качване",
    items : "елемент(и)",
    skip : "Пропусни",
    cancelAll : "Откажи всички",
    OK : 'Да',
    CANCEL : 'Не',
    CONFIRM : "Да",
    reuploadConfirmation : "Ще бъдат качени отново всички файлове, които вече са качени, анулирани, пропуснати или неуспешни по време на качването и ще бъдат презаписани съществуващите файлове. Сигурни ли сте, че искаш да продължите?",
    folderUploadNotSupported : "Качването на папки не се поддържа в този браузър",
    fileAlreadySelected : "Файлът вече е добавен за качване на същото местоположение.",
    fileExistsOnServer : "Файл със същото име, е наличен на сървъра.",
    fileSizeExceed : "Размерът на файла надвишава.",
    fileTypeNotAllowed : "Типът на файла не е разрешен.",
    filterApplied : "Приложен е филтър",
    noMatchingItemAvailable : "Няма наличен съвпадащ елемент",
    addFilesToUpload : "Добави файлове за качване...",
    file : "Файл",
    reason : "Причина",
    failedItems : "Неуспешни файлове",
    ignoreAll : "Игнорирай всички",
    retryAll : "Повторен опит за всички",
    failedOpeningFile : "Съхранението в бекенд не е достъпно.",
    cancelConfirmation : "Сигурни ли сте, че искате да прекратите качването",
    failedClosingFile : "Неуспех при затваряне на файл",
    failedWileRetryingChunk : "Неуспешно при повторно качване на парче.",
    retryingFile : "Опиване файла да бъде качен отвново",
    "in" : "в",
    seconds : "секунди(s)",
    skipFile : "SПропусни файл",
    retryNow : "Опитай пак сега",
    retryingClosingFile : "Повторен опит да се затвори файла",
    fileExistConfirmation : "Файл [1] със същия размер, искате ли да изпратите отново файла?",
    bigFileOverwriteConfirmation : "Файл [1] на сървъра е по-голям от този, който искате да качите, искате ли да го презапишете?",
    fileExistsOnServerConfirmation : "Файл [1] съществува на сървъра",
    fileActionTitle : "Моля, изберете какво искате да направите с този файл.",
    applyToAll : "Приложи на всички",
    retryingOpeningFile : "Опитване отново да се отвори файла",
    secondsAbbr : "секунди",
    minutesAbbr : "минути",
    hoursAbbr : "часове"
};
