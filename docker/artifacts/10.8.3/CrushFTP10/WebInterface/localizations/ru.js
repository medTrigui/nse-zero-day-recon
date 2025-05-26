//Русский
/*Страница входа на FTP*/
localizations.loginPageTitle = "FTP Сервер :: вход";
localizations.BadLoginInfoText = "Логин или пароль неверны, либо аккаунт просрочен.";
localizations.ServerErrorInfoText = "Сервер недоступен или Ваш IP был забанен.";
localizations.PasswordsDoNotMatchAlertText = "Паоль и подтвержение не совпадают.";
localizations.LoginAgainTitleText = "Пожалуйста, войдите снова.";
localizations.LoginWithNewPassText = "Зайдите с новым паролем.";
localizations.AuthenticatingMsgText = "Аутентификация...";
localizations.LoginSuccessText = "Успешно.";
localizations.LoadingWebInterfaceText = "Загрузка интерфейса...";
localizations.LoginWarningText = "Внимание.";
localizations.MultipleBadLoginsAlertDescText = "Слишком много попыток и Ваш IP был забанен.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Нажмите <a style='color:white;' href='/WebInterface/jQuery/reset.html'>здесь</a> для сброса пароля.</div>";
localizations.LoginFailedText = "Неудачная попытка входа";
localizations.ChangePasswordGrowlTitleText = "Смена пароля";
localizations.UserNameText = "Логин";
localizations.ResetUserNameText = "Логин";
localizations.PasswordText = "Пароль";
localizations.RememberMeText = "Запомнить";
localizations.LoginButtonText = "Войти";
localizations.ForgotPasswordLinkText = "Забыли пароль?";
localizations.ResetPasswordButtonText = "Сброс пароля";
localizations.BackToLoginButtonText = "Вернуться";
localizations.ValidUserNameAlertText = "Введите правильную учётную запись";
localizations.RequestPasswordHeaderText = "Сброс пароля";
localizations.ChangePasswordHeaderText = "Сменить пароль";
localizations.ChangePasswordNoteText = "Вы должны сменить пароль чтобы продолжить";
localizations.CurrentPasswordText = "Текущий пароль : ";
localizations.NewPasswordText = "новый пароль : ";
localizations.ConfirmPasswordText = "Подтверждение : ";
localizations.CancelButtonText = "Отмена";
localizations.ChanngePasswordButtonText = "Смена пароля";
localizations.GeneratePasswordButtonText = "Сгенерировать пароль";
localizations.GeneratePasswordUseButtonText = "Используйте это";
localizations.GeneratePasswordCancelButtonText = "Отмена";
localizations.OldBrowserNoticeHTMLAsText = 'Ваш браузер давно не обновлялся! WEB-интерфейс может работать некорреткно с IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Всё равно зайти</button> или скачайте браузер:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "Этот сервер не настроен на рассылку напоминаний паролей.";

/*Сброс пароля*/
localizations.resetPageUserName = "Логин или почта : ";
localizations.resetPagePassword = "Пароль : ";
localizations.resetPagePasswordConfirm = "Подтверждение пароля : ";
localizations.resetPageSubmit = "Отправить";
localizations.resetPageLoginPage = "Страница входа";
localizations.resetPageStartOver = "Начать заново";

localizations.passwordRequirementsMessages = {
    errorTitle : "Ошибка : \r\n",
    msgSeparator : "\r\n",
    chars : "Пароль должен быть не короче $$ символов.",
    numericChars : "В пароле должно быть как мининимум $$ цифр.",
    lowerCase : "В пароле должно быть как мининимум $$ символов нижнего регистра.",
    upperCase : "В пароле должно быть как мининимум $$ символов верхнего регистра.",
    specialCase : "В пароле должно быть как мининимум $$ спец-символов.",
    notAllowedErrorMsg : "Не разрешено"
};


localizations.ItemsPerPageText = "Показать на 1 странице по : ";
localizations.LayoutChangeLabelText = "Стиль : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Файл слишком большой",
            "minFileSize": "Файл слишком маленький",
            "acceptFileTypes": "Данный тип файла не разрешен",
            "maxNumberOfFiles": "Достигнуто максимальное количество файлов",
            "uploadedBytes": "Размер загружаемого файла достиг максимального значения",
            "emptyResult": "Загружен пустой файл",
            "fileAvailableInSelectedFolder": "Файл уже добавлен в загрузку в этот же каталог",
            "hasReachedQuota": "размер файла превысил квоту",
            "fileExistOnServer": "Данный файл уже существует на сервере",
            "fileBiggerThanAllowed": "Размер файла больше разрешенного",
            "dirNoWritable": "Вы не можете загружать файлы в данный каталог",
            "blockUploadingDirs": "Загружать директории не разрешено",
            "true": "true"
        },
        "error": "Ошибка",
        "start": "Старт",
        "waiting": "Ожидание...",
        "uploading": "Загрузка : ",
        "reupload": "загрузить заново",
        "share": "Поделиться",
        "cancel": "Отмена",
        "destroy": "Удалить",
        "overwrite": "Перезаписать",
        "uploadTo": "Загрузить в : ",
        "pause": "Пауза",
        "errorLabel": "Ошибка : ",
        "details": "Детали",
        "uploadedInLabelText": "Загружено в : ",
        "atAvgSpeedOfLabelText": "со средней скоростью : ",
        "uploadCompletedText": "Загрузка завершена",
        "uploadedFileText": "Файл загружен на сервер",
        "uploadedMultipleFilesText": "Все файлы загружены."
    }
};

localizations.buttons = {
    "admin": "Админ",
    "delete": "Удалить",
    "rename": "Переименовать",
    "download": "Загрузить",
    "advanced download": "Дополнительные параметры загрузки",
    "zipdownload": "Скачать в zip",
    "unzip": "Распаковать",
    "zip selected": "Запаковать в zip",
    "explore zip contents": "Просмотреть zip архив",
    "create folder": "Создать каталог",
    "upload": "Загрузить",
    "search": "Поиск",
    "user options": "Настройки пользователя",
    "cut": "Вырезать",
    "copy": "Копировать",
    "paste": "Вставить",
    "slideshow": "Слайдшоу",
    "quickview": "Быстрый просмотр",
    "download low-res": "Скачать в низком разрешении",
    "preview": "Превью",
    "batchcomplete": "Пакетная обработка завершена",
    "share": "Поделиться",
    "quick share": "Поделиться быстро",
    "manage shares": "Усправление расшареными данными",
    "show basket": "Показать корзину",
    "add to basket": "Добавить в корзину",
    "edit keywords": "Редактировать ключевые слова",
    "change icon": "Сменить иконку",
    "download crushtunnel": "Скачать CrushTunnel",
    "help": "Помощь",
    "login": "Логин",
    "logout": "Выйти",
    "download sync app": "Скачать Sync App",
    "download crushftpdrive": "Скачать CrushFTPDrive",
    "sync manager": "Менеджер синхронизации"
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
localizations.refreshListingButtonTooltipText = "Обновить";
localizations.FilterText = localizations.FilterTextBasket = "Фильтр:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Очистить";
localizations.FileCounterItemsText = "Позиции";
localizations.FileCounterFoldersText = "Каталоги";
localizations.FileCounterFilesText = "Файлы";
localizations.FileCounterHiddenItemsText = "Спрятанные позиции";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Значки";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Показать дерево";
localizations.DownloadResumeTextLabelBasket = "Продолжить"
localizations.BackToTopLinkText = "Наверх";
localizations.FilesNotAvailableMessage = "Нет доступных файлов";
localizations.CopyNoFilesSelectedMessage = "Выберите каталоги/файлы для копирования";
localizations.CopyOnlyFilesMessage = "Вы можете только вырезать/скопировать файлы, выбранные каталоги будут игнорированы";
localizations.DeleteNoFilesSelectedMessage = "Выберите каталоги/файлы для удаления";
localizations.UnzipNoFilesSelectedMessage = "Выберите каталоги/файлы для разархивирования";
localizations.ZipExploreNoFilesSelectedMessage = "Выберите архив для просмотра";
localizations.CutNoFilesSelectedMessage = "Выберите каталоги/файлы, которые нужно вырезать";
localizations.pagingPrevText = "Предыдущий";
localizations.pagingNextText = "Следующий";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Отфильтрованные позиции \"{filterVal}\" : {totalItems} , Каталоги: {folders} Файлы: {files})";
localizations.TotalItemsInDirMsgText = " (Всего позиций в директории {count}) ";
localizations.CurrentFileSizeText = " (Общий размер файлов {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} позиций) ";
localizations.quotaAvailableLabelText = "достно";

localizations.WelcomeNoteSubmitFormFailureMsgText = "ошибка при сохранении данных";
localizations.TreeviewSpecificActionMsgTitleText = "Только для показа деревом";
localizations.TreeviewSpecificActionMsgDescText = "Только для показа деревом";
localizations.PasswordExpiringMsgText = "Пароль скоро истечёт<br/>Используйте настройки пользователя для замены.";
localizations.PasswordNotMatchingMsgText = "Новый пароль не совпадает с подтверждением.";
localizations.PasswordMustBeComplexMsgText = "Пароль слишком простой.";
localizations.PasswordChangedMsgText = "Пароль был изменён. Зайдите в учётную запись с ноым паролем.";
localizations.AppletLoadingFailedMsgText = "Ошибка апплета при загрузке";
localizations.DownloadStartedAlertTitleText = "Загрузка началась";
localizations.DownloadCompletedText = "[Загрузка завершена]";
localizations.DownloadCompletedPathText = " Скачать в : ";
localizations.DownloadStartedAlertDescText = "Пожалуйста выберите каталог для сохраниения";
localizations.LogoutButtonText = "Выйти";
localizations.browserUploaderNativeUploadTipSetTitle = "Загрузить файлы используя браузер.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Загрузить файлы используя улучшеный загрузчик, <br>он поддерживает каталоги и может ускорить передачу.";
localizations.browserUploaderDragDropHoverLabelText = "Перебросьте файлы отсюда для загрузки";
localizations.appletUploaderDropPanelLabelText = "&darr; Перебросьте файлы сюда для загрузки &darr;";
localizations.browserUploaderDragDropLabelText = "Перебросьте файлы сюда для загрузки";
localizations.browserUploaderChromeDragDropLabelText = "Перебросьте файлы и каталоги сюда для загрузки";
localizations.advancedUploadOptionsDialogSaveButtonText = "Сохранить";
localizations.advancedUploadOptionsDialogCancelButtonText = "Отмена";

//Окно расшаривания
localizations.ShareWindowHeaderText = "Расшарить файл";
localizations.ShareWindowFilesSharingLabelText = "Расшарить :";
localizations.ShareWindowShareTypeLabelText = "Тип :";
localizations.ShareWindowShareTypeLabelCopyText = "Копировать";
localizations.ShareWindowShareTypeLabelMoveText = "двигать";
localizations.ShareWindowShareTypeLabelReferenceText = "Справка";
localizations.ShareWindowShareToInternalUserLabelText = "Внутренняя шара";
localizations.ShareWindowShareToExternalUserLabelText = "Внешняя шара";
localizations.ShareWindowDownloadLabelText = "Скачать";
localizations.ShareWindowUploadLabelText = "Загрузить";
localizations.ShareWindowDeleteLabelText = "Удалить";
localizations.ShareWindowSendEmailLabelText = "Отправить письмо :";
localizations.ShareWindowDirectLinkLabelText = "Прямая ссылка на файл?";
localizations.ShareWindowExpiresLabelText = "Исчезнет :";
localizations.ShareWindowFromLabelText = "От : ";
localizations.ShareWindowToLabelText = "Кому : ";
localizations.ShareWindowCCLabelText = "Копия : ";
localizations.ShareWindowBCCLabelText = "Вторая копия : ";
localizations.ShareWindowReplyToLabelText = "Ответить : ";
localizations.ShareWindowSubjectLabelText = "тема : ";
localizations.ShareWindowBodyLabelText = "Тело письма : ";
localizations.ShareWindowAdvancedLabelText = "Настройки";
localizations.ShareWindowAttachThumbsLabelText = "Прикрепить значек";
localizations.ShareWindowAttachFileLabelText = "Прикрепить файл";
localizations.ShareWindowCommentsLabelText = "Комментарии : ";
localizations.ShareWindowKeywordsLabelText = "Ключевые слова : ";
localizations.ShareWindowAccessLabelText = "Полный доступ ";
localizations.ShareWindowSendButtonText = "Отправить";
localizations.ShareWindowCancelButtonText = "Отмена";
localizations.ShareWindowUsernameMethodLabelText = "Метод шары : ";
localizations.ShareWindowUsernameLabelText = "Поделиться с внутренним пользователем";
localizations.ShareWindowUsernamesLabelText = "Учетный записи : ";
localizations.ShareWindowUsernamesLabelHelpText = "(разделите несколько получатаей запятыми)";
localizations.ShareActionCompleteShareUsernamesText = "У данных пользователей теперь есть доступ к файлам.";
localizations.ShareActionCompleteUsernameText = "Логин: ";
localizations.ShareActionCompletePasswordText = "Пароль: ";
localizations.ShareActionCompleteLinkText = "Ссылка";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Просьба ввести правильный адрес почты. Вы можете ввести несколько получателей, разделив их адреса запятыми, например <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Неправильная позиция";
localizations.SharFoldersCantBeSharedGrowlText = "Каталоги не могут быть расшарены";
localizations.SharFilesCantBeSharedGrowlText = "Файлы не могут быть расшарены";
localizations.ShareLinkCopyToClipboardText = "Скопировать ссылку в буфер обмена";
localizations.ShareLinkCopiedToClipboardText = "Ссылка скопирована";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Скопировать прямую ссылку.";
localizations.CopyLinkText = "Скопировать ссылку";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Создать новый каталог.";
localizations.CreateFolderInputDefaultFolderName = "Новый каталог";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Зайти в каталог после создания ";
localizations.CreateFolderButtonText = "Создать";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Загрузить файл";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Информация о загрузке";
localizations.BrowserUploaderUploadFilesTabHeaderText = "загрузить файлы";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Расширенный поиск..";
localizations.BrowserUploaderStartUploadingLinkText = "начать загрузку";
localizations.BrowserUploaderClearCompletedLinkText = "Убрать загруженное";
localizations.BrowserUploaderResumeCheckboxText = "Продолжить";
localizations.BrowserUploaderFormResetButtonText = "Перезагрузить";
localizations.BrowserUploaderFormNextButtonText = "Далее";
localizations.BrowserUploaderFileAddedAlreadyText = "Этот файл уже добавлен.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} уже добавлен.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Данные файлы уже добавлены.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} уже добавлены.";
localizations.BrowserUploaderSelectedFilesGroupText = "Группа файлов : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Убрать";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "будет загружено в";
localizations.BrowserUploaderSelectedFileOverwriteText = "Перезаписать";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "будут перезаписаны";
localizations.BrowserUploaderSelectedFileExistsText = "Файл существует";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Требуется осторожность";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Игнорировать";
localizations.BrowserUploaderSelectedFileDoneText = "завершено";
localizations.BrowserUploaderSelectedFileUploadedText = "Загружено в";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "Загрузить заново";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "Скачать заново";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Убрать";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Отмена";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Пауза";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Пауза";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Возобновить";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Всего {0} файлов";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} из {1} позиций ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Загрузка в : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Текущая скорость : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Средняя скорость : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Время: Прошло: <span class='elapsed'>{0}</span> <span class='remained'>, Осталось : {1}</span></div>";
localizations.BatchCompleteText = "Результат";
localizations.BatchComplete = "Передачи подтверждены.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Подсчёт..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Проблема при передаче";
localizations.BrowserUploaderCancelledUploadMsgText = "Загрузка отменена";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Ваши файлы ещё загружаются. Если Вы покинете страницу этот процесс прервётся. Вы хотите покинуть страницу?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Ваши файлы ещё скачиваются. Если Вы покинете страницу этот процесс прервётся. Вы хотите покинуть страницу?";
localizations.NoUploadInDirGrowlText = "Загрузка файлов не разрешена";
localizations.NoUploadInDirGrowlDesc = "Загрузка файлов в данную директорию не разрешена";
localizations.AdvancedUploadDirNotAllowedText = "Загрузка каталогов не разрешена";
localizations.AdvancedUploadDirNotAllowedDescText = "Загрузка каталогов не разрешена. Выберите файлы для загрузки";
localizations.uploadConfirmCancelUploadText = "Вы действительно хотите прервать загрузку?";
localizations.uploadConfirmCancelUploadAfterFormText = "Вы уверены что хотите прервать загрузку {count} позиций?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Добавить файлы...";
localizations.advancedUploadResumeLabelByClass = "Возобновить";
localizations.filesToUploadQueueWindowHeader = "Файлы для загрузки";
localizations.uploadWindowStartUploadingByClass = "Начать загрузку";
localizations.uploadWindowCancelUploadingByClass = "Отмена загрузки";
localizations.uploadWindowShowCommonUploadFormByClass = "Детали";
localizations.uploadWindowClearUploadedByClass = "Чистая загрузка";
localizations.uploadWindowOverwriteAllByClass = "Переписать всё";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Удалить всё с ошибками";
localizations.uploadWindowSummaryFilesByClass = "Файлы : ";
localizations.uploadWindowSummarySizeByClass = ", Размер загрузок : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Показать/скрыть панель загрузок";
localizations.uploadBarAttentionTitle = "Теперь добавьте файлы с панели загрузок";
localizations.uploadBarAttentionText = "Используйте панель загрузок чтобы добавить файл для загрузки. Нажмите на \"" + localizations.browseFileLabelByClass + "\" кнопку чтобы добавить файлы";
localizations.uploadBiggerFileNoticeTitleText = "Для больших файлов используйте продвинутю загрузку";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>советуем использовать продвинутю загрузку для больших файлов, он позволяет загружать файлы легче и  имеет функцию <em>авто продолжение</em>. <br><br> (Вы можете поменять режим на панели загрузок)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='Как поменять режим загрузки'>";

localizations.globalProgressbarSkipLabelByClass = "Пропустить";
localizations.globalProgressbarPauseLabelByClass = "Пауза";
localizations.globalProgressbarStopLabelByClass = "Стоп";

localizations.popupOpenInSeparateWindowText = "Открыть в новом окне";
localizations.customFormPasswordMatchValidationFailedText = "Пароли не совпадаютh";
localizations.customFormCompareValueMatchValidationFailedText = "Значения не совпадают";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Сменить на обычную загрузку";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Переключиться на продвинутую загрузку.<div style='font-size:11px;width:500px;margin:5px 0px;'>Продвинутый режим упрощает передачи. Он может автоматически продолжить загрузку, если передача прервалась, и может передавать целые каталоги.<br><br>Это быстрейший способ передачи файлов.<br>(Продвинутый режим требует Java Applet plugin, скачать можно на www.java.com )</div>";
}

//Окно поиска
localizations.SearchWindowHeaderText = "Поиск";
localizations.SearchWindowKeywordsLabelText = "Ключевые слова :";
localizations.SearchWindowExactLabelText = "Вы уверены?";
localizations.SearchWindowByClassModifiedLabelText = "Изменено";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelByClassText = "Размер ";
localizations.SearchWindowTypeLabelText = "Тип";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Килобайт)";
localizations.SearchWindowSearchButtonText = "Начать поиск";
localizations.SearchWindowCancelButtonText = "Отмена";
localizations.SearchResultDisplayText = "Результат поиска:";
localizations.SearchResultClearLinkText = "(Очистить фильтр поиска)";
localizations.SearchFormModifiedOptionAfterText = "После";
localizations.SearchFormModifiedOptionBeforeText = "Перед";
localizations.SearchFormSizeOptionBiggerThanText = "Больше чем";
localizations.SearchFormSizeOptionSmallerThanText = "Меньше чем";
localizations.SearchFormItemTypeOptionFileText = "Файл";
localizations.SearchFormItemTypeOptionFolderText = "Каталог";
localizations.SearchProcessNotificationText = "Выполняется... ";
localizations.SearchProcessCancelText = "Отмена";
localizations.SearchItemsContextGoToParentText = "В родительский каталог";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Все <strong>{count}</strong> позиции на этой странице выделены.";
localizations.ItemsSelectionSelectAllItemsInDir = "Выбрать все <strong>{total_items}</strong> позиции в <strong>{list_type}</strong> (включая скрытые)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Все <strong>{total_items}</strong> позиции в <strong>{list_type}</strong> (включая скрытые) выбраны";
localizations.ItemsSelectionClearSelection = "Снять выделение";
localizations.ItemsSelectionShowingFolderText = "Текущий каталог";
localizations.ItemsSelectionShowingFilteredItemsText = "Текущий отфильтрованный лист";
localizations.ItemsSelectionShowingSearchedItemsText = "Результат поиска";
//User options window
localizations.UserOptionsWindowHeaderText = "Preferences";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Скрывать '.' Позиции ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Скрыть колонку CheckBox ";
localizations.UserOptionsWindowHideFilterLabelText = "Скрыть фильтр ";
localizations.UserOptionsWindowAutostartUploadLabelText = "После выбора файла, сразу начать загрузку. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Пока загружается интерфейс, загрузить аплет Java.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Отключить сжатие аплета Java. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Сменить пароль ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Текущий пароль: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Новый пароль: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Подтверждение:";
localizations.UserOptionsWindowChangePasswordButtonText = "Сменить пароль";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Сгенирировать пароль";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Используйте это";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Отмена";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "Вы не правильно ввели действующий пароль.";
localizations.ChangePasswordResetLinkExpiredText = "Ссылка нерабочая или просрочена.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Переключить";
localizations.MainCheckboxContextMenuCheckAllText = "Отметить всё";
localizations.MainCheckboxContextMenuUncheckAllText = "Снять все отметки";
//Keywords window
localizations.KeywordsWindowHeaderText = "Ключевые слова";
localizations.KeywordsWindowUpdateLinkText = "Обновить";
localizations.KeywordsWindowCancelLinkText = "Отмена";
//File basket
localizations.BasketHeaderText = "Файлы в корзине";
localizations.BasketClearAllLinkText = "Очистить всё";
localizations.BasketDownloadLinkText = "Скачать корзину";
localizations.BasketDownloadAdvancedLinkText = "Продвинутая загрузка корзины";
localizations.BasketNoFilesAvailableText = "Нет доступных файлов";
localizations.BasketRemoveLinkText = "Удалить";
localizations.BasketTotalItemText = "{0} позиций ";
localizations.BasketFileAddedAlreadyText = "Данный файл уже добавлен к корзине";
localizations.BasketFileAddedAlreadyDetailsText = "Данный файл уже в корзине";
localizations.BasketNothingSelectedToAddText = "Для добавления в корзину ничего не выбрано";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Вы действительно хотите убрать все файлы из корзины?";
//Paste form panel
localizations.PasteFormHeaderText = "Вставить";
localizations.PasteFormResetButtonText = "Сброс";
localizations.PasteFormPasteButtonText = "Вставить";
localizations.PasteFormErrorHeaderText = "Возникла проблема при вставке";
localizations.PasteFormErrorDetailsText = "Ошибка при копировании в корзину.<br />Ошибка : {0}";
localizations.PasteFormErrorNothingToPasteText = "Нечего добавлять";
localizations.PasteSelectDirectoryWarning = "Пожалуйста выберите место для добавления";
localizations.PasteSelectSingleDirectoryWarning = "Выберите одно место для добавления скопированных позиций";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Добро пожаловать";
localizations.WelcomeFormOkButtonText = "OK";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Слайдшоу";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Управление шарами";
localizations.ManageShareWindowRefreshLinkText = "Обновить";
localizations.ManageShareWindowDeleteSelectedLinkText = "Удалить выбранные элементы";
localizations.ManageShareWindowDeleteLinkText = "Удалить";
localizations.ManageShareWindowGridLinkLabelText = "Ссылка";
localizations.ManageShareWindowGridFromLabelText = "От";
localizations.ManageShareWindowGridToLabelText = "Кому";
localizations.ManageShareWindowGridCCLabelText = "Копия";
localizations.ManageShareWindowGridBCCLabelText = "Вторая копия";
localizations.ManageShareWindowGridReplyToLabelText = "Ответить";
localizations.ManageShareWindowGridSubjectLabelText = "Тема";
localizations.ManageShareWindowGridBodyLabelText = "тело письма";
localizations.ManageShareWindowGridShareTypeLabelText = "Тип шары";
localizations.ManageShareWindowGridUserNameLabelText = "Логин";
localizations.ManageShareWindowGridPasswordLabelText = "Пароль";
localizations.ManageShareWindowGridAttachedLabelText = "Прикрепить к письму?";
localizations.ManageShareWindowGridUploadLabelText = "Загрузки разрешены?";
localizations.ManageShareWindowGridPathsLabelText = "Пути";
localizations.ManageShareWindowGridCreatedLabelText = "Создано";
localizations.ManageShareWindowGridExpiresLabelText = "Истекает";
localizations.ManageShareWindowGridSharedItemsLabelText = "расшареные позиции";
localizations.ManageShareWindowGridDownloadsLabelText = "Скачивания";
localizations.ManageShareWindowNothingToShowMessageText = "Ничего не найдено";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Вы уверены что хотите удалить {count} аккаунты ?";
localizations.ManageShareWindowFilterText = "Фильтр :";
localizations.ManageShareWindowClearFilterText = "Очистить";
localizations.ManageShareWindowNextItemText = "Следующий";
localizations.ManageShareWindowPrevItemText = "Предыдущий";
localizations.ManageShareWindowSelectSimilarText = "Выбрать похожие";
localizations.ManageShareWindowPageTitle = "WEB FTP сервер - обмен файлами";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Переименовать";
localizations.RenamePanelSaveLinkText = "Сохранить";
localizations.RenamePanelCancelLinkText = "Отмена";

localizations.ZipNameWindowHeaderText = "Запаковать в архив с именем";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Отмена";

localizations.SyncAppNameWindowHeaderText = "Синхронизация загрузок";
localizations.SyncAppDownloadYourPassText = "Ваш пароль : ";
localizations.SyncAppDownloadAdminPassText = "Пароль администратора : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Отмена";

//Tooltip info
localizations.TooltipNameLabelText = "Имя";
localizations.TooltipPathLabelText = "Путь";
localizations.TooltipSizeLabelText = "Размер";
localizations.TooltipModifiedLabelText = "Последние изменения";
localizations.TooltipKeywordsLabelText = "Ключевые слова";

//Form alerts and notifications
localizations.FormValidationFailText = "Одно или несколько значений не введы или введены неправильно. Введите правильные значения в строки, помеченные *";
localizations.FormEmailValidationFailText = "<br> - Введите правильное значение";
localizations.DeleteConfirmationMessageText = "{0} каталогов и {1} файлов будет удалено.\n\nItems: {2} После удаления эти файлы нельзя будет вернуть.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Все файлы в папке \"{folder_name}\" будут удалены.\n\n Всего будет удалено {count} позиций.\n\n После удаления их нельзя будет востановить";
localizations.CopyActionGrowlText = "Итого {0} каталогов и {1} файлов скопировано.";
localizations.CutActionGrowlText = "Итого {0} каталогов и {1} файлов вырезано.";
localizations.NothingSelectedGrowlText = "Ничего не выбрано";
localizations.ShareNothingSelectedGrowlText = "Ничего не выбрано для передачи";
localizations.DownloadNothingSelectedGrowlText = "Ничего не выбрано для скачивания";
localizations.RenameNothingSelectedGrowlText = "Ничего не выбрано для переименования";
localizations.PreviewNothingSelectedGrowlText = "Ничего не выбрано для просмотра";
localizations.NoPreviewGrowlText = "Предпросмотр";
localizations.NoPreviewGrowlDesc = "Для данной позиции предпросмотр не предусмотрен";
localizations.ProblemWhileRenamingGrowlText = "Возникла ошибка при переименовании";
localizations.ProblemWhileRenamingDescGrowlText = "Возникла ошибка при переименовании. Попробуйте заново. Ошибка : ";
localizations.ProblemWhileSharingGrowlText = "Возникла ошибка при расшаривании";
localizations.ProblemWhileSharingDescGrowlText = "Возникла ошибка при расшаривании. Попробуйте заново.";
localizations.DirectLinkDescGrowlText = "Щелкните правой кнопкой мыши на элементе и щелкните по прямой ссылке";
localizations.UpdateKeywordDescGrowlText = "Щелкните правой кнопкой мыши по элементу и выберите обновить ключевые слова";
localizations.QuickViewNothingToShowGrowlText = "Ошибка: нечего показать в режиме быстрого просмотра";
localizations.QuickViewNoItemsAvailableGrowlText = "Нет доступных позиций";
localizations.QuickViewRotateClockwiseTooltipText = "Вращать по часовой стрелке";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Врощать против часовой стрелки";
localizations.QuickViewCurrentImagePositionText = "Позиция {current} из {total}";
localizations.ProblemWhileDeletingGrowlText = "Ошибка при удалении";
localizations.ProblemWhileDeletingDescGrowlText = "Возникла ошибка при удалении. Попробуйте заново. Ошибка : ";
localizations.ProblemWhileUnzipGrowlText = "Возникла ошибка при распаковке";
localizations.ProblemWhileUnzipDescGrowlText = "Возникла ошибка при распаковке. Попробуйте заново. Ошибка : ";
localizations.ProblemWhileZipGrowlText = "Возникла ошибка при архивации";
localizations.ProblemWhileZipDescGrowlText = "Возникла ошибка при архивации. Попробуйте заново. Ошибка : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Возникла ошибка при создании каталога";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Возникла ошибка при создании каталога. Попробуйте заново. Ошибка : ";
localizations.JavaRequiredGrowlText = "Java Required";
localizations.JavaRequiredDescGrowlText = "Для использований расширенных возможностей необходимо установить Java.<br/><br/>Перейдите: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Проблема при загрузке Java";
localizations.JavaLoadingProblemDescGrowlText = "Проблема при загрузке Java, если Java выключена в браузере, включите его и обновите страницу.";
localizations.JavaAppletNotLoadedGrowlText = "Не удалось загрузить аплет Java";
localizations.JavaAppletNotLoadedDescGrowlText = "Сначала неободимо нажать 'Расширенный поиск...' перед тем, как функция перетаскивания станет доступной.";
localizations.NoFilesFoundGrowlTitle = "Не найдено";
localizations.NoFilesFoundGrowlText = "Не найдена информация для ";
localizations.AutoLogOutConfirmationTitle = "Автоматический выход";
localizations.AutoLogOutConfirmationDesc = "Произведён автоматический выход из-за неактивности";
localizations.AutoLogOutButtonText = "Остаться подключенным";
localizations.AutoLogOutMsg = "Произведён автоматический выход из-за неактивности";
localizations.AutoLogOutLoginButtonText = "Войти заново..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Имя";
localizations.TreeviewHeaderPathText = "Путь";
localizations.TreeviewHeaderSizeText = "размер";
localizations.TreeviewHeaderModifiedText = "Последнее изменение";
localizations.TreeviewHeaderKeywordsText = "Ключевые слова";
//Selection menu items
localizations.SelectItemOptionLinkText = "Выбрать";
localizations.SelectCheckboxContextMenuToggleText = "Включить";
localizations.SelectCheckboxContextMenuCheckAllText = "Все элементы";
localizations.SelectCheckboxContextMenuUncheckAllText = "Ничего";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Все файлы";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Все каталоги";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Все элементы начинающиеся с \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Изменены сегодня";
localizations.SelectCheckboxContextMenuCheckWeekText = "Изменены не позже недели назад";
localizations.SelectCheckboxContextMenuCheckMonthText = "Изменены не позже месяца назад";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Изменены не позже 60 дней";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Изменены не позже 90 дней";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Показывать по {0} элементов на странице";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.bi.ru/\">Бюро информатизации</a>";
localizations.PoweredByText = "Создано на базе <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Выбрать элементы для загрузки..";
localizations.advancedDownloadPathSelectionWindowTitle = "Выбрать путь для скачивания..";
localizations.advancedOperationsDownloadStatus = "Скачивание";
localizations.advancedOperationsUploadStatus = "Загрузка";

localizations.maxAllowedDownloadSizeReached = "Размер скачивания превысил максимально допустимый"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Максимальный размер для скачивания : {size}. <br />Используйте продвинутый загрузчик, или добавьте файлы в корзину."; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "Играть";
localizations.AudioPlayerPauseText = "Пауза";
localizations.AudioPlayerStopText = "Стоп";
localizations.AudioPlayerMuteText = "Выключить звук";
localizations.AudioPlayerUnmuteText = "Включить звук";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Сменить иконку ";
localizations.ChangeIconWindowInstructionsText = "Выберите изображение меленького размера для установки значка:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Выбранный файл : ";
localizations.ChangeIconWindowCancelLinkText = "Отмена";
localizations.ChangeIconWindowUpdateLinkText = "Сохранить";
localizations.ChangeIconFileSelectAlertText = "Выберите изображение для продолжения";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Распаковка архива началась";
localizations.UnzipStartedAlertDescText = "Распаковка началась для выбранных элементов";
localizations.UnzipCompletedAlertTitleText = "Распаковка завершена";
localizations.UnzipCompletedAlertDescText = "Распаковка завершена для выбранных элементов";

//zip operation
localizations.ZipStartedAlertTitleText = "Архивация началась";
localizations.ZipStartedAlertDescText = "Архивация для выбранных элементов началась";
localizations.ZipCompletedAlertTitleText = "Архивация завершилась";
localizations.ZipCompletedAlertDescText = "Архивация для выбранных элементов завершилась";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Регистрация завершена : ";
localizations.RegisterWindowProcessCompleteMessage = "Вы сможете зайти под своей учётной записью после разрешения администратора.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Почему регистрация могла быть не одобрена : </strong><br><br>- Логин уже занят. <br> - На серевере запрещена регистрация.  <br><br> Пожалуйста, попробуйте ещё раз или свяжитесь с администратором.";

//Data size format items
localizations.dataByClassFormatBytes = "байтов";
localizations.dataByClassFormatKiloBytes = "КБ";
localizations.dataByClassFormatMegaBytes = "МБ";
localizations.dataByClassFormatGigaBytes = "ГБ";
localizations.dataByClassFormatTeraBytes = "ТБ";

localizations.loadingIndicatorText = "Пожалуйста подождите...";

localizations.bytesSentLabelTextByClass = "Отправлено :";
localizations.bytesReceivedLabelTextByClass = "Получено :";
localizations.dirInfoDownloadLabelTextByClass = "Скачано : ";
localizations.dirInfoUploadLabelTextByClass = "Загружено : ";
localizations.maxAndAvailableAmountLabelTextByClass = "Доступно/Максимум :";
localizations.maxAmountPerDayLabelTextByClass = "В день :";
localizations.quotaAvailableTextByClass = "доступно";
localizations.maxAmountPerMonthLabelTextByClass = "В месяц :";

//Server message localized
localizations.share_complete = "Публикация завершена.";
localizations.share_email_sent = "Сообщение отправлено.";
localizations.share_open_in_email_client = "Открыть в почтовом клиенте";
localizations.email_failed = "<div class='errorMessage'>SMTP не смог отправить сообщение. Проверьте лог сервера.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Не удалось загрузить : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "ОШИБКА: доступ запрещен. (недостаточно привелегий.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "ОШИБКА:550 Ошибка: Содержимое файла не допускается.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "ОШИБКА:Невозможно переписать файл.";

localizations.CustomEventCallSuccessTitle = "Успешно";
localizations.CustomEventCallSuccessDesc = "Инициированно пользовательское событие";
localizations.CustomEventCallFailureTitle = "Отказ";
localizations.CustomEventCallFailureDesc = "Возникла ошибка при инициации пользовательского события";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Дополнительные настройки";
localizations.advancedDownloadOptionsButtonText = "Дополнительные настройки скачивания";
localizations.advancedUploadOptionsDialogSaveButtonText = "Сохранить";
localizations.advancedUploadOptionsItemAvailableLabel = "Когда существующий элемент найден :";
localizations.advancedUploadOptionsUseCompressionLabel = "Использовать сжатие :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Подтвердите действие";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Подтвердите действие для файла :";
localizations.advancedUploadOptionsAskActionLabelByClass = "действие :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Перезаписать";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Перезаписать всё";
localizations.advancedUploadActionResumeSelectOptionText = "Продолжить";
localizations.advancedUploadActionResumeAllSelectOptionText = "Продолжить всё";
localizations.advancedUploadActionSkipSelectOptionText = "Пропустить";
localizations.advancedUploadActionSkilAllSelectOptionText = "Пропустить всё";
localizations.advancedUploadActionAskSelectOptionText = "Вопрос";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Да";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Нет";

localizations.LoggedInAsLabelText = "Вы зашли под учётной записью : ";
localizations.AccountExpiresOnLabelText = "Срок учётной записи истекает : ";

if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Тайм-аут сессии через %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Пожалуйста подождите...",
    playSlideshow : "Проиграть слайдшоу",
    pauseSlideshow : "Пауза",
    refresh : "Обновить",
    fullscreen : "Полноэкранный режим",
    download : "Скачки",
    upload : "Загрузки",
    deleteText : "Удалить",
    rotateClockwise : "Повернуть по часовой стрелке",
    rotateCounterClockwise : "Повернуть против часовой стрелке",
    previousItem : "Предыдущий элемент",
    nextItem : "Следующий элемент",
    delayText : "(Повтор {x} секунд)",
    nextPageText : "Следующий &rsaquo;",
    prevPageText : "&lsaquo; Предыдущий",
    itemCountText : "(Элемент {x} из {y})",
    noItemMessage : "<h3 style='text-align:center;'>Произошла ошибка, или не выбран ни один элемент.</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Файлы для загрузки",
    dragDropMsg : "Переместите файлы сюда",
    remove : "Удалить",
    removeAllSelected : "Все выбранные",
    removeAllWithError : "Все с ошибкой",
    removeAllUploaded : "Все загруженный",
    removeAllCancelled : "Все отменённые",
    removeAllSkipped : "Все пропущенные",
    removeAll : "Все",
    addFiles : "Добавить файлы...",
    upload : "загрузить",
    uploadSelected : "Загрузить выбранные",
    reuploadAll : "Заново загрузить выбранные",
    cancel : "Отмена",
    uploadDetails : "Детали",
    overwriteAll : "Перезаписать всё",
    resumeAll : "Продолжить всё",
    shareUploaded : "Расшарить загруженное",
    quickFilterSubtext : "Быстрый фильтр...",
    total : "Всего",
    filesFailed : "файлов с ошибкой.",
    selectedFiles : "Выбранных файлов :",
    size : "Размер :",
    filtered : "(Отфильтровано)",
    totalFiles : "Всего файлов :",
    scrollWithActivity : "Прокрутка с активностью",
    writingFile : "Пишется файл...",
    pleaseWait : "Пожалуйста подождите...",
    uploadedIn : "Загружено в",
    aMoment: "момент",
    atAvgSpeedOf : "со средней скоростью",
    uploadingFailed : "Загрузка прервана",
    canceled : "Отменено",
    skipped : "Пропущено",
    currentSpeed : "Текущая скорость :",
    averageSpeed : "Средняя скорость :",
    "of" : "из",
    elapsed : "Прошло",
    remaining : "Осталось",
    waiting : "Ожидание..",
    details : "Детали",
    overwrite : "Перезаписать",
    resume : "Продолжить",
    reupload : "Загрузить заново",
    pause : "Пауза",
    paused : "Пауза",
    uploading : "Загрузка",
    items : "элементов",
    skip : "Пропустить",
    cancelAll : "Отменить всё",
    OK : 'Да',
    CANCEL : 'Нет',
    CONFIRM : "Да",
    reuploadConfirmation : "Это заново загрузит файлы, которые уже загружены, отменены, пропущены и перезапишет файлы, уже загруженные. Вы хотите продолжить?",
    folderUploadNotSupported : "Загрузка каталогов ",
    fileAlreadySelected : "Файл уже выбран для загрузки в данный каталог.",
    fileExistsOnServer : "Файл с таким же именем уже есть на сервере.",
    fileSizeExceed : "Первышен размер файла.",
    fileTypeNotAllowed : "Данный тип файла не разрешен.",
    filterApplied : "Фильтр применён",
    noMatchingItemAvailable : "Элементов с таким имененм нет.",
    addFilesToUpload : "Выберите файлы для загрузки...",
    file : "Файл",
    reason : "Причина",
    failedItems : "Элементы с ошибкой",
    ignoreAll : "Игнорировать всё",
    retryAll : "Начать заново всё",
    failedOpeningFile : "Ошибка при открытии файла.",
    cancelConfirmation : "Вы уверены что хотите прервать загрузку?",
    failedClosingFile : "Ошибка при закрытии файла",
    failedWileRetryingChunk : "Ошибка при повторной загрузке части файлов.",
    retryingFile : "Попытка загрузить файл заново",
    "in" : "В",
    seconds : "секунд(ы)",
    skipFile : "Пропустить файл",
    retryNow : "Перезапустить сейчас",
    retryingClosingFile : "Попытка закрыть файл",
    fileExistConfirmation : "Файл [1] с таким-же размером существует, Вы действительно хотите загрузить файл?",
    bigFileOverwriteConfirmation : "Файл [1] больше, чем Вы пытаетесь загрузить, продолжить?",
    fileExistsOnServerConfirmation : "Файл [1] существует на сервере",
    fileActionTitle : "Выберите, что Вы хотите сделать с файлом.",
    applyToAll : "Применить ко всем",
    retryingOpeningFile : "Попытка открыть файл",
    secondsAbbr : "сек",
    minutesAbbr : "мин",
    hoursAbbr : "часов"
};