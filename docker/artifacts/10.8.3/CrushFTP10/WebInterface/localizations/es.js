//Spanish
//CrushFTP 9.1.0 - Spanish localization ver. 0.1 by Guillermo MP
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP - Interfaz Web  :: Acceso";
localizations.BadLoginInfoText = "Su nombre de usuario o contraseña pueden ser incorrectos o la cuenta puede estar cerrada.";
localizations.ServerErrorInfoText = "El servidor no está disponible o su IP ha sido bloqueada.";
localizations.PasswordsDoNotMatchAlertText = "Las nuevas contraseñas no coinciden.";
localizations.LoginAgainTitleText = "Por favor ingrese nuevamente";
localizations.LoginWithNewPassText = "Iniciar sesión con nueva contraseña";
localizations.AuthenticatingMsgText = "Autenticando...";
localizations.LoginSuccessText = "Válido";
localizations.LoadingWebInterfaceText = "Cargando Interface Web...";
localizations.LoginWarningText = "Aviso";
localizations.MultipleBadLoginsAlertDescText = "Demasiados intentos fallidos y su IP será bloqueada.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Click <a style='color:white;' href='/WebInterface/jQuery/reset.html'>here</a> to reset password.</div>";
localizations.LoginFailedText = "Error de inicio de sesion";
localizations.ChangePasswordGrowlTitleText = "Cambia la contraseña";
localizations.UserNameText = "Usuario";
localizations.ResetUserNameText = "Usuario";
localizations.PasswordText = "Contraseña";
localizations.RememberMeText = "Recuérdame";
localizations.LoginButtonText = "Iniciar sesión";
localizations.ForgotPasswordLinkText = "Olvidé mi contraseña";
localizations.ResetPasswordButtonText = "Restablecer la contraseña";
localizations.BackToLoginButtonText = "Volver al inicio de sesión";
localizations.ValidUserNameAlertText = "Por favor, introduzca un nombre de usuario válido";
localizations.RequestPasswordHeaderText = "Solicite una contraseña";
localizations.ChangePasswordHeaderText = "Cambie su contraseña";
localizations.ChangePasswordNoteText = "Debe cambiar su contraseña para continuar";
localizations.CurrentPasswordText = "Contraseña actual : ";
localizations.NewPasswordText = "Nueva Contraseña : ";
localizations.ConfirmPasswordText = "Confirmar Contraseña : ";
localizations.CancelButtonText = "Cancelar";
localizations.ChanngePasswordButtonText = "Cambiar Contraseña";
localizations.GeneratePasswordButtonText = "Generar Contraseña";
localizations.GeneratePasswordUseButtonText = "Usar esta";
localizations.GeneratePasswordCancelButtonText = "Cancelar";
localizations.OldBrowserNoticeHTMLAsText = 'Su navegador está desactualizado, ¡fue lanzado hace casi una década! Como resultado es muy lento, lleno de errores, y este Interfaz web puede o no funcionar con IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Asumir el riesgo y proceder</button> obtener navegador actualizado:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "Este servidor no está configurado para enviar recordatorios de contraseña por correo electrónico.";
localizations.RecaptchaValidationRequiredText = "Por favor, valide el captcha para iniciar sesión";
localizations.UserOptionsWindowUpdateButtonText = "Guardar";
localizations.InvalidPasswordCharacterMsgText = "La contraseña tiene caracteres inválidos, por favor eliminelos de la contraseña. ";
localizations.CookiePolicyNotificationText = "Utilizamos cookies en este sitio para facilitar su capacidad de inicio de sesión por razones técnicas.";
localizations.CookiePolicyLinkText = "Política de cookies";
localizations.CookiePolicyAcceptButtonText = "Aceptar";
localizations.CookiePolicyDismissButtonText = "Descartar";
/*Reset pass page specific*/
localizations.resetPageUserName = "Nombre de usuario o Email : ";
localizations.resetPagePassword = "Contraseña : ";
localizations.resetPagePasswordConfirm = "Confirmar Contraseña : ";
localizations.resetPageSubmit = "Enviar";
localizations.resetPageLoginPage = "Página de inicio de sesión";
localizations.resetPageStartOver = "Empezar de nuevo";

localizations.passwordRequirementsMessages = {
    errorTitle : "Error : \r\n",
    msgSeparator : "\r\n",
    chars : "La contraseña debe contener al menos $$ caracteres.",
    numericChars : "La contraseña debe tener al menos $$ caracteres numéricos.",
    lowerCase : "La contraseña debe tener al menos $$ caracteres en minúsculas.",
    upperCase : "La contraseña debe tener al menos caracteres en mayúsculas $$.",
    specialCase : "La contraseña debe tener al menos los caracteres especiales $$.",
    unsafeChars: "La contraseña no puede contener caracteres inseguros de la URL: $$",
    recentPass: "La contraseña no puede ser una de sus contraseñas recientes.",
    notAllowedErrorMsg : "Not Permitido"
};

localizations.ItemsPerPageText = "Elementos a mostrar por página : ";
localizations.LayoutChangeLabelText = "Diseño de página : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "El archivo es demasiado grande",
            "minFileSize": "El archivo es demasiado pequeño",
            "acceptFileTypes": "No se permite el tipo de archivo",
            "maxNumberOfFiles": "Número máximo de archivos excedido",
            "uploadedBytes": "Los bytes cargados exceden el tamaño del archivo",
            "emptyResult": "Resultado de la carga de archivos vacíos - nulo",
            "fileAvailableInSelectedFolder": "Archivo ya agregado para subir en la misma carpeta",
            "hasReachedQuota": "El tamaño del archivo es mayor que su cuota",
            "fileExistOnServer": "El archivo existe en el servidor",
            "fileBiggerThanAllowed": "El archivo es más grande que el tamaño permitido",
            "dirNoWritable": "No puede subir a este directorio",
            "blockUploadingDirs": "No se permite subir el directorio",
            "true": "verdadero"
        },
        "error": "Error",
        "start": "Comenzar",
        "waiting": "Esperando...",
        "uploading": "Subiendo : ",
        "reupload": "volver a subir",
        "share": "Compartir",
        "cancel": "Cancelar",
        "destroy": "Borrar",
        "overwrite": "Sobrescribir",
        "uploadTo": "Subir a : ",
        "pause": "Pausar",
        "errorLabel": "Error : ",
        "details": "Detalles",
        "uploadedInLabelText": "Subido en : ",
        "atAvgSpeedOfLabelText": "velocidad media : ",
        "uploadCompletedText": "Subida Completada",
        "uploadedFileText": "Fichero cargado en el servidor",
        "uploadedMultipleFilesText": "Todos los ficheros están cargados."
    }
};

localizations.buttons = {
    "admin": "Admin",
    "delete": "Borrar",
    "rename": "Cambiar nombre",
    "download": "Descarga",
    "advanced download": "Descarga avanzada",
    "zipdownload": "Descarga-Zip",
    "unzip": "Descomprimir-Zip",
    "zip selected": "Zip Seleccionado",
    "explore zip contents": "Explorar el contenido del zip",
    "create folder": "Crear Carpeta",
    "upload": "Subir",
    "search": "Buscar",
    "user options": "Opciones del usuario",
    "cut": "Cortar",
    "copy": "Copiar",
    "paste": "Pegar",
    "slideshow": "Presentación de diapositivas",
    "quickview": "Vista rápida",
    "download low-res": "Descarga en baja resolución",
    "preview": "Vista previa",
    "batchcomplete": "Lote Completado",
    "share": "Compartir",
    "quick share": "modo compartir rápido",
    "manage shares": "Gestionar acciones compartir",
    "show basket": "Mostrar la cesta",
    "add to basket": "Añadir a la cesta",
    "edit keywords": "Editar palabras clave",
    "change icon": "Cambiar Icono",
    "download crushtunnel": "Descargar CrushTunnel",
    "help": "Ayuda",
    "login": "Iniciar sesión",
    "logout": "Cierre de sesión",
    "download sync app": "Descarga Sync App",
    "download crushftpdrive": "Descarga CrushFTPDrive",
    "sync manager": "Gestor de Sincronización"
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
localizations.refreshListingButtonTooltipText = "Actualizar";
localizations.FilterText = localizations.FilterTextBasket = "Filtro:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Borrar";
localizations.FileCounterItemsText = "Artículos";
localizations.FileCounterFoldersText = "Carpetas";
localizations.FileCounterFilesText = "Archivos";
localizations.FileCounterHiddenItemsText = "Artículos Ocultos";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Vista en miniatura";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Vista de árbol";
localizations.DownloadResumeTextLabelBasket = "Reanudar"
localizations.BackToTopLinkText = "Volver al inicio";
localizations.FilesNotAvailableMessage = "No hay archivos disponibles";
localizations.CopyNoFilesSelectedMessage = "Por favor, seleccione los archivos-carpetas a copiar";
localizations.CopyOnlyFilesMessage = "Puede cortar/copiar sólo archivos, las carpetas seleccionadas serán ignoradas";
localizations.DeleteNoFilesSelectedMessage = "Por favor, seleccione los archivos/carpetas que desea eliminar";
localizations.UnzipNoFilesSelectedMessage = "Por favor, seleccione el archivo a descomprimir";
localizations.ZipExploreNoFilesSelectedMessage = "Por favor seleccione el archivo zip para explorar";
localizations.CutNoFilesSelectedMessage = "Por favor, seleccione los archivos-carpetas a cortar";
localizations.pagingPrevText = "Anterior";
localizations.pagingNextText = "Siguiente";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Artículos con  \"{filterVal}\" : {totalItems} , Carpetas: {folders} Archivos: {files})";
localizations.TotalItemsInDirMsgText = " (Total de elementos en el directorio {count}) ";
localizations.CurrentFileSizeText = " (Tamaño total en lista {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} archivos) ";
localizations.quotaAvailableLabelText = "disponible";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Error: Problema al guardar los datos";
localizations.TreeviewSpecificActionMsgTitleText = "Sólo para la vista de árbol";
localizations.TreeviewSpecificActionMsgDescText = "Esto es específico sólo para la vista de árbol";
localizations.PasswordExpiringMsgText = "Contraseña caduca en breve<br/>Utilice el botón de Opciones de Usuario para cambiarla.";
localizations.PasswordNotMatchingMsgText = "Las nuevas contraseñas no coinciden.";
localizations.PasswordMustBeComplexMsgText = "La contraseña debe ser más compleja.";
localizations.PasswordChangedMsgText = "Contraseña cambiada.  Por favor, inicie sesión con la nueva contraseña.";
localizations.AppletLoadingFailedMsgText = "el Applet Java ha fallado durante la carga";
localizations.DownloadStartedAlertTitleText = "La descarga ha comenzado";
localizations.DownloadCompletedText = "[Descarga completada]";
localizations.DownloadCompletedPathText = " Descargado en : ";
localizations.DownloadStartedAlertDescText = "Por favor, seleccione la ubicación para guardar su(s) archivo(s) para proceder";
localizations.LogoutButtonText = "Cierre de sesión";
localizations.browserUploaderNativeUploadTipSetTitle = "Subir archivos usando el cargador del navegador.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Sube los archivos usando el cargador avanzado, <br>permite carpetas y puede acelerar la transferencia.";
localizations.browserUploaderDragDropHoverLabelText = "Arrastre y suelte la carpeta con sus archivos aquí para subirlos";
localizations.readOnlyFolderBannerText = "Esta carpeta es de sólo lectura.";
localizations.appletUploaderDropPanelLabelText = "&darr; Suelte los archivos aquí para subirlos &darr;";
localizations.browserUploaderDragDropLabelText = "Arrastre y suelte los archivos aquí para subirlos";
localizations.browserUploaderChromeDragDropLabelText = "Arrastre y suelte la carpeta con sus archivos aquí para subirlos";
localizations.advancedUploadOptionsDialogSaveButtonText = "Guardar";
localizations.advancedUploadOptionsDialogCancelButtonText = "Cancelar";

//Sharing Window
localizations.ShareWindowHeaderText = "Compartir archivos";
localizations.ShareWindowFilesSharingLabelText = "Compartir :";
localizations.ShareWindowShareTypeLabelText = "Tipo de acción :";
localizations.ShareWindowShareTypeLabelCopyText = "Copiar";
localizations.ShareWindowShareTypeLabelMoveText = "Mover";
localizations.ShareWindowShareTypeLabelReferenceText = "Referencia";
localizations.ShareWindowShareToInternalUserLabelText = "Acción interna";
localizations.ShareWindowShareToExternalUserLabelText = "Acción externa";
localizations.ShareWindowDownloadLabelText = "Descarga";
localizations.ShareWindowExpiresInDaysLabelText = "días";
localizations.ShareWindowExpiresInDaysValidationErrorText = "La caducidad no pueden ser más de {days} días";
localizations.ShareWindowMaxUsesLabelText = "Número máximo de usos :";
localizations.ShareWindowUploadLabelText = "Cargar";
localizations.ShareWindowDeleteLabelText = "Borrar";
localizations.ShareWindowSendEmailLabelText = "Envíe un correo electrónico :";
localizations.ShareWindowDirectLinkLabelText = "¿Vínculo directo al archivo?";
localizations.ShareWindowExpiresLabelText = "Caduca :";
localizations.ShareWindowFromLabelText = "De : ";
localizations.ShareWindowToLabelText = "A : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "BCC : ";
localizations.ShareWindowReplyToLabelText = "Responder a : ";
localizations.ShareWindowSubjectLabelText = "Asunto : ";
localizations.ShareWindowBodyLabelText = "Cuerpo : ";
localizations.ShareWindowAdvancedLabelText = "Avanzado";
localizations.ShareWindowAttachThumbsLabelText = "Adjuntar miniatura";
localizations.ShareWindowAttachFileLabelText = "Adjuntar archivos";
localizations.ShareWindowCommentsLabelText = "Comentarios : ";
localizations.ShareWindowKeywordsLabelText = "Palabras clave : ";
localizations.ShareWindowAccessLabelText = "Acceso completo ";
localizations.ShareWindowSendButtonText = "Enviar";
localizations.ShareWindowAlternateTempAccountLabelText = "Cuenta temporal alternativa :";
localizations.ShareWindowCancelButtonText = "Cancelar";
localizations.ShareWindowUsernameMethodLabelText = "Metodo para compartir : ";
localizations.ShareWindowUsernameLabelText = "Compartir a usuario interno";
localizations.ShareWindowUsernamesLabelText = "Nombres de usuario : ";
localizations.ShareWindowUsernamesLabelHelpText = "(Separe los múltiples nombres de usuario con comas.)";
localizations.ShareActionCompleteShareUsernamesText = "Los siguientes usuarios tienen ahora acceso a los elementos compartidos.";
localizations.ShareActionCompleteUsernameText = "Nombre de usuario: ";
localizations.ShareActionCompletePasswordText = "Contraseña: ";
localizations.ShareActionCompleteLinkText = "Enlace";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Por favor, introduzca una dirección de correo electrónico válida. Puede introducir varias direcciones de correo electrónico a la vez separadas por una coma. ejemplo: <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Artículo inválido";
localizations.SharFoldersCantBeSharedGrowlText = "Las carpetas no pueden ser compartidas";
localizations.SharFilesCantBeSharedGrowlText = "Los archivos no pueden ser compartidos";
localizations.ShareLinkCopyToClipboardText = "Copiar el enlace al portapapeles";
localizations.ShareLinkCopiedToClipboardText = "Enlace copiado al portapapeles";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "metodo compartir interno no acepta dirección de correo electrónico, por favor use el nombre de usuario";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copiar el enlace directo.";
localizations.CopyLinkText = "Copiar enlace";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Crear una nueva carpeta.";
localizations.CreateFolderInputDefaultFolderName = "Nueva Carpeta";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Ir a la carpeta tras la creación ";
localizations.CreateFolderButtonText = "Crear";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Subir archivo";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Detalles";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Subir archivos";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Busqueda avanzada..";
localizations.BrowserUploaderStartUploadingLinkText = "Iniciar la carga";
localizations.BrowserUploaderClearCompletedLinkText = "Borrardo Completo";
localizations.BrowserUploaderResumeCheckboxText = "Continuar";
localizations.BrowserUploaderFormResetButtonText = "Reiniciar";
localizations.BrowserUploaderFormNextButtonText = "Siguiente";
localizations.BrowserUploaderFileAddedAlreadyText = "Este archivo ya ha sido añadido.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} ya se ha añadido.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Estos archivos ya se han añadido.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} ya se han añadido.";
localizations.BrowserUploaderSelectedFilesGroupText = "Grupo de archivos : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Eliminar";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Será subido a";
localizations.BrowserUploaderSelectedFileOverwriteText = "Sobrescribir";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "se sobrescribirá";
localizations.BrowserUploaderSelectedFileExistsText = "El archivo existe";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Atención requerida";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorar";
localizations.BrowserUploaderSelectedFileDoneText = "Hecho";
localizations.BrowserUploaderSelectedFileUploadedText = "Subido a";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "re-subir";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "Volver a descargar";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Descartar";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Cancelar";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pausar";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Pausado";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Reanudar";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Total {0} Archivo(s)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} de {1} artículo(s) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Subiendo a : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Velocidad actual : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Velocidad media : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Tiempo Transcurrido: <span class='elapsed'>{0}</span> <span class='remained'>, Pendiente : {1}</span></div>";
localizations.BatchCompleteText = "Resultado";
localizations.BatchComplete = "Transferencias aceptadas.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Calculando..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problema durante la transferencia";
localizations.BrowserUploaderCancelledUploadMsgText = "Carga cancelada";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Su(s) archivo(s) se está(n) cargando actualmente.  Si navegas fuera de esta página los perderás.  ¿Estás seguro de que quieres salir de esta página?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Sus archivos se están descargando actualmente. Si navegas fuera de esta página los perderás.  ¿Estás seguro de que quieres salir de esta página?";
localizations.NoUploadInDirGrowlText = "Carga no permitida";
localizations.NoUploadInDirGrowlDesc = "No se permite subir elementos al directorio seleccionado";
localizations.AdvancedUploadDirNotAllowedText = "Carga de directorio no permitida";
localizations.AdvancedUploadDirNotAllowedDescText = "Las carpetas - no pueden ser cargadas , seleccione solo archivos";
localizations.uploadConfirmCancelUploadText = "¿Estás seguro de que deseas cancelar esta subida?";
localizations.uploadConfirmCancelUploadAfterFormText = "¿Está seguro de que desea cancelar la carga del último {count} archivo(s) seleccionado(s)?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Añadir archivos...";
localizations.advancedUploadResumeLabelByClass = "Reanudar";
localizations.filesToUploadQueueWindowHeader = "Archivos para subir";
localizations.uploadWindowStartUploadingByClass = "Iniciar la carga";
localizations.uploadWindowCancelUploadingByClass = "Cancelar la carga";
localizations.uploadWindowShowCommonUploadFormByClass = "Detalles";
localizations.uploadWindowClearUploadedByClass = "Borrar cargados";
localizations.uploadWindowOverwriteAllByClass = "Sobrescribir todo";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Eliminar todo lo que contenga errores";
localizations.uploadWindowSummaryFilesByClass = "Archivos : ";
localizations.uploadWindowSummarySizeByClass = ", Tamaño de la carga : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Mostrar/Ocultar el panel de carga";
localizations.uploadBarAttentionTitle = "Ahora agregue archivos desde la barra de subida";
localizations.uploadBarAttentionText = "Utilice la barra de subida para añadir archivos para subir. Haga clic en \"" + localizations.browseFileLabelByClass + "\" botón para añadir archivos";
localizations.uploadBiggerFileNoticeTitleText = "Para archivos más grandes utilice la subida avanzada";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>Se aconseja el uso de la subida avanzada para archivos más grandes, permite subir archivos fácilmente y tiene la característica <em>reanudación automática</em>. <br><br> (Puede cambiar el modo de carga en la barra de carga)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='Cómo cambiar el modo de carga'>";

localizations.globalProgressbarSkipLabelByClass = "Saltar";
localizations.globalProgressbarPauseLabelByClass = "Pausar";
localizations.globalProgressbarStopLabelByClass = "Parar";

localizations.popupOpenInSeparateWindowText = "Abrir en una ventana separada";
localizations.customFormPasswordMatchValidationFailedText = "La contraseña no coincide";
localizations.customFormCompareValueMatchValidationFailedText = "Los valores no coinciden";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Cambiar a carga normal";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Cambie a la carga avanzada.<div style='font-size:11px;width:500px;margin:5px 0px;'>El modo avanzado acelerará las transferencias. Puede reanudar automáticamente si una transferencia falla, y puede cargar carpetas enteras de una sola vez.<br><br>Es la forma más rápida de subir archivos.<br>(El modo avanzado requiere que tenga instalado Java en su sistema ( www.java.com )</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Buscar";
localizations.SearchWindowKeywordsLabelText = "Palabras clave :";
localizations.SearchWindowExactLabelText = "¿Exactamente?";
localizations.SearchWindowByClassModifiedLabelText = "Modificado";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelByClassText = "El tamaño es ";
localizations.SearchWindowTypeLabelText = "El tipo es";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Iniciar la búsqueda";
localizations.SearchWindowCancelButtonText = "Cancelar";
localizations.SearchResultDisplayText = "Resultado de la búsqueda:";
localizations.SearchResultClearLinkText = "(Borrar el filtro de búsqueda)";
localizations.SearchFormModifiedOptionAfterText = "Después de";
localizations.SearchFormModifiedOptionBeforeText = "Antes de";
localizations.SearchFormSizeOptionBiggerThanText = "Mayor que";
localizations.SearchFormSizeOptionSmallerThanText = "Menor que";
localizations.SearchFormItemTypeOptionFileText = "Archivo";
localizations.SearchFormItemTypeOptionFolderText = "Carpeta";
localizations.SearchProcessNotificationText = "Procesando... ";
localizations.SearchProcessCancelText = "Cancelar";
localizations.SearchItemsContextGoToParentText = "Ir a Carpeta Raiz";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = " <strong>{count}</strong> elementos seleccionados en esta página.";
localizations.ItemsSelectionSelectAllItemsInDir = "Seleccionar todo <strong>{total_items}</strong> elementos en <strong>{list_type}</strong> (incluyendo elementos ocultos)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = " <strong>{total_items}</strong> elementos en <strong>{list_type}</strong> (incluyendo elementos ocultos) seleccionados";
localizations.ItemsSelectionClearSelection = "Borrar selección";
localizations.ItemsSelectionShowingFolderText = "Carpeta actual";
localizations.ItemsSelectionShowingFilteredItemsText = "Lista actual de filtrado";
localizations.ItemsSelectionShowingSearchedItemsText = "Resultado de la búsqueda";
//User options window
localizations.UserOptionsWindowHeaderText = "Preferencias";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Archivos '.' Ocultos ";
localizations.UserOptionsWindowHideCheckboxLabelText = "Ocultar la columna de la casilla de verificación ";
localizations.UserOptionsWindowHideFilterLabelText = "Ocultar Filtro de Selección ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Al seleccionar archivo, iniciar carga automatica. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Cuando cargue la interfaz, cargar el applet de Java.";
localizations.UserOptionsWindowDisableWaveformLabelText = "Desactivar la reproducción de audio en línea";
localizations.UserOptionsWindowDisableCompressionLabelText = "Deshabilitar la compresión en el applet de Java. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Cambie su contraseña ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Contraseña actual: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nueva Contraseña: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Confirm Password:";
localizations.UserOptionsWindowChangePasswordButtonText = "Confirme la contraseña:";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Generar una contraseña aleatoria";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Utilice esta";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Cancelar";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "No ha introducido la contraseña actual correcta.";
localizations.ChangePasswordResetLinkExpiredText = "El enlace no es válido o ha caducado.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Conmutar";
localizations.MainCheckboxContextMenuCheckAllText = "Marcar todo";
localizations.MainCheckboxContextMenuUncheckAllText = "Des marcar todo";
//Keywords window
localizations.KeywordsWindowHeaderText = "Palabras clave";
localizations.KeywordsWindowUpdateLinkText = "Actualizar";
localizations.KeywordsWindowCancelLinkText = "Cancelar";
//File basket
localizations.BasketHeaderText = "Archivos en el carrito";
localizations.BasketClearAllLinkText = "Borrar todo";
localizations.BasketDownloadLinkText = "Descargar carrito";
localizations.BasketDownloadAdvancedLinkText = "carrito - Descarga Avanzada";
localizations.BasketNoFilesAvailableText = "No hay archivos disponibles";
localizations.BasketRemoveLinkText = "Quitar";
localizations.BasketTotalItemText = "{0} Archivos ";
localizations.BasketFileAddedAlreadyText = "Archivo ya añadido al carrito";
localizations.BasketFileAddedAlreadyDetailsText = "El archivo seleccionado ya está disponible en el carrito";
localizations.BasketNothingSelectedToAddText = "Nada seleccionado para añadir al carrito";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "¿Está seguro de que desea borrar todos los archivos seleccionados en el carrito?";
//Paste form panel
localizations.PasteFormHeaderText = "Pegar";
localizations.PasteFormResetButtonText = "Reiniciar";
localizations.PasteFormPasteButtonText = "Pegar";
localizations.PasteFormErrorHeaderText = "Problema al pegar";
localizations.PasteFormErrorDetailsText = "Hubo un problema al pegar los archivos.<br />Error : {0}";
localizations.PasteFormErrorNothingToPasteText = "No hay nada que pegar";
localizations.PasteSelectDirectoryWarning = "Por favor, seleccione un destino para pegar los elementos copiados";
localizations.PasteSelectSingleDirectoryWarning = "Por favor, seleccione un solo destino para pegar los elementos copiados";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Bienvenido";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "Subir detalles";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Cancelar";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Presentación de diapositivas";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Administrar Opciones Compartir";
localizations.ManageShareWindowRefreshLinkText = "Actualizar";
localizations.ManageShareWindowDeleteSelectedLinkText = "Borrar archivos seleccionados";
localizations.ManageShareWindowDeleteLinkText = "Borrar";
localizations.ManageShareWindowGridLinkLabelText = "Enlace";
localizations.ManageShareWindowGridFromLabelText = "De";
localizations.ManageShareWindowGridToLabelText = "A";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridReplyToLabelText = "Contestar a";
localizations.ManageShareWindowGridSubjectLabelText = "Asunto";
localizations.ManageShareWindowGridBodyLabelText = "Cuerpo";
localizations.ManageShareWindowGridShareTypeLabelText = "Tipo de acción";
localizations.ManageShareWindowGridUserNameLabelText = "Usuario";
localizations.ManageShareWindowGridPasswordLabelText = "Contraseña";
localizations.ManageShareWindowGridAttachedLabelText = "Adjuntar en Email?";
localizations.ManageShareWindowGridUploadLabelText = "¿Carga - subida permitida?";
localizations.ManageShareWindowGridPathsLabelText = "Ruta";
localizations.ManageShareWindowGridCreatedLabelText = "Creado";
localizations.ManageShareWindowGridExpiresLabelText = "Caduca";
localizations.ManageShareWindowGridSharedItemsLabelText = "Artículos compartidos";
localizations.ManageShareWindowGridDownloadsLabelText = "Descargas";
localizations.ManageShareWindowNothingToShowMessageText = "Nada que mostrar";
localizations.ManageShareWindowDeleteAccountConfirmationText = "¿Está seguro que quiere eliminar {count} cuenta(s) ?";
localizations.ManageShareWindowFilterText = "Filtro :";
localizations.ManageShareWindowClearFilterText = "Borrar";
localizations.ManageShareWindowNextItemText = "Siguiente";
localizations.ManageShareWindowPrevItemText = "Anterior";
localizations.ManageShareWindowSelectSimilarText = "Seleccione Similar";
localizations.ManageShareWindowPageTitle = "Servidor - Administrar compartir";
localizations.ManageShareWindowEditDialogTitle = "Editar compartir";
localizations.ManageShareWindowShareDetailsDialogTitle = "Detalles compartir";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Cambiar nombre";
localizations.RenamePanelSaveLinkText = "Salvar";
localizations.RenamePanelCancelLinkText = "Cancelar";

localizations.ZipNameWindowHeaderText = "Nombre del archivo Zip";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Cancelar";

localizations.SyncAppNameWindowHeaderText = "Sync descarga de aplicación Sync";
localizations.SyncAppDownloadYourPassText = "Su Contraseña : ";
localizations.SyncAppDownloadAdminPassText = "Contraseña del administrador : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Cancelar";

//Tooltip info
localizations.TooltipNameLabelText = "Nombre";
localizations.TooltipPathLabelText = "Ruta";
localizations.TooltipSizeLabelText = "Tamaño";
localizations.TooltipModifiedLabelText = "Modificado";
localizations.TooltipKeywordsLabelText = "Palabras clave";

//Form alerts and notifications
localizations.FormValidationFailText = "Uno o más artículos requeridos no se introducen o no se introducen correctamente. Introduzca el valor adecuado para los artículos con * en el siguiente formulario";
localizations.FormEmailValidationFailText = "<br> - Introduzca una dirección de correo electrónico para el campo de correo electrónico(s)";
localizations.DeleteConfirmationMessageText = "{0} carpeta(s) y {1} archivo(s) será eliminado.\n\nItems: {2} Una vez borrado no se puede revertir.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Todos los archivos de la carpeta \"{folder_name}\" serán eliminados.\n\n {count} Archivos serán eliminados.\n\nAcción no reversible";
localizations.CopyActionGrowlText = "Total {0} carpeta(s) y {1} archivo(s) copiado(s).";
localizations.CutActionGrowlText = "Total {0} carpeta(s) y {1} archivos(s) cortado(s).";
localizations.NothingSelectedGrowlText = "Nada seleccionado";
localizations.ShareNothingSelectedGrowlText = "Nada seleccionado para compartir";
localizations.DownloadNothingSelectedGrowlText = "Nada seleccionado para descargar";
localizations.RenameNothingSelectedGrowlText = "Nada seleccionado para renombrar";
localizations.PreviewNothingSelectedGrowlText = "Nada seleccionado para previsualizr";
localizations.NoPreviewGrowlText = "Previsualizar";
localizations.NoPreviewGrowlDesc = "No hay vista previa disponible para el elemento seleccionado";
localizations.ProblemWhileRenamingGrowlText = "Problema al renombrar";
localizations.ProblemWhileRenamingDescGrowlText = "Error: Hubo un problema al cambiar el nombre. Por favor, vuelva a intentarlo.";
localizations.ProblemWhileSharingGrowlText = "Problema al compartir";
localizations.ProblemWhileSharingDescGrowlText = "Hubo un problema al compartir un archivo. Por favor, vuelva a intentarlo";
localizations.DirectLinkDescGrowlText = "Haga clic con el botón derecho del ratón en el elemento y haga clic en el enlace directo de copia";
localizations.UpdateKeywordDescGrowlText = "Haga clic con el botón derecho del ratón en el artículo y haga clic en actualizar palabras clave";
localizations.QuickViewNothingToShowGrowlText = "Error : No hay nada que mostrar en la vista rápida";
localizations.QuickViewNoItemsAvailableGrowlText = "No hay archivos disponibles";
localizations.QuickViewRotateClockwiseTooltipText = "Gire en el sentido de las agujas del reloj";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Girar en sentido contrario a las agujas del reloj";
localizations.QuickViewCurrentImagePositionText = "Archivo {current} de {total}";
localizations.ProblemWhileDeletingGrowlText = "Problema al borrar";
localizations.ProblemWhileDeletingDescGrowlText = "Error: Hubo un problema al borrar. Por favor, vuelva a intentarlo. ";
localizations.ProblemWhileUnzipGrowlText = "Problema al descomprimir archivo(s)";
localizations.ProblemWhileUnzipDescGrowlText = "Error: Hubo un problema al descomprimir. Por favor, vuelva a intentarlo ";
localizations.ProblemWhileZipGrowlText = "Problema al comprimir archivo(s)";
localizations.ProblemWhileZipDescGrowlText = "Error: Hubo un problema al comprimir . Por favor, vulva a intentarlo.";
localizations.ProblemWhileCreatingFolderGrowlText = "Problema al crear una nueva carpeta";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Error: Hubo un problema al crear la carpeta. Por favor, vuelva a intentarlo.";
localizations.JavaRequiredGrowlText = "Se requiere Java";
localizations.JavaRequiredDescGrowlText = "Java debe estar instalado para que las funciones avanzadas funcionen.<br/><br/>Por favor, ve a: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Problema al cargar Java";
localizations.JavaLoadingProblemDescGrowlText = "Hubo un problema al cargar Java, si Java está deshabilitado en el navegador, por favor habilítelo e inténtelo de nuevo.";
localizations.JavaAppletNotLoadedGrowlText = "Applet de Java no cargado";
localizations.JavaAppletNotLoadedDescGrowlText = "Primero debes hacer clic en el botón 'Navegación Avanzada...' antes de que se habilite la función de arrastrar y soltar.";
localizations.NoFilesFoundGrowlTitle = "Almacenamiento no disponible";
localizations.NoFilesFoundGrowlText = "Error : El almacenamiento del backend no está disponible para su ubicación:";
localizations.AutoLogOutConfirmationTitle = "Cierre de sesión automático";
localizations.AutoLogOutConfirmationDesc = "Se va a cerrar la sesión por inactividad";
localizations.AutoLogOutButtonText = "Mantener la sesión activa";
localizations.AutoLogOutMsg = "Se ha cerrado la sesión por inactividad";
localizations.AutoLogOutLoginButtonText = "Iniciando sesión de nuevo ....";
//Treeview header items
localizations.TreeviewHeaderNameText = "Nombre";
localizations.TreeviewHeaderPathText = "Ruta";
localizations.TreeviewHeaderSizeText = "Tamaño";
localizations.TreeviewHeaderModifiedText = "Modificado";
localizations.TreeviewHeaderKeywordsText = "Palabras Clave";
//Selection menu items
localizations.SelectItemOptionLinkText = "Selección";
localizations.SelectCheckboxContextMenuToggleText = "Conmutar";
localizations.SelectCheckboxContextMenuCheckAllText = "Todos los elementos";
localizations.SelectCheckboxContextMenuUncheckAllText = "Ninguno";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Todos los archivos";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Todas las carpetas";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Archivos que comienzan con \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Modificado hoy";
localizations.SelectCheckboxContextMenuCheckWeekText = "Modificado esta semana";
localizations.SelectCheckboxContextMenuCheckMonthText = "Modificado este mes";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Modificado en los últimos 60 días";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Modificado en los últimos 90 días";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Mostrar {0} archivos por página";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Seleccione archivos a cargar...";
localizations.advancedDownloadPathSelectionWindowTitle = "Elija la ruta de descarga..";
localizations.advancedOperationsDownloadStatus = "Descargando";
localizations.advancedOperationsUploadStatus = "Cargando";

localizations.maxAllowedDownloadSizeReached = "El tamaño de la descarga excedió el tamaño máximo permitido"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Tamaño máximo permitido para descargar : {size}. <br />Utilice la descarga avanzada, o añada al carrito en su lugar"; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "Reproducir";
localizations.AudioPlayerPauseText = "Pausa";
localizations.AudioPlayerStopText = "Parar";
localizations.AudioPlayerMuteText = "Silenciar";
localizations.AudioPlayerUnmuteText = "Activar Audio";
localizations.AudioPlayerDownloadText = "Descargar";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Cambiar Icono ";
localizations.ChangeIconWindowInstructionsText = "Elija una imagen pequeña para establecerla como el icono del elemento seleccionado:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Archivo seleccionado : ";
localizations.ChangeIconWindowCancelLinkText = "Cancelar";
localizations.ChangeIconWindowUpdateLinkText = "Salvar";
localizations.ChangeIconFileSelectAlertText = "Por favor, seleccione el archivo de imagen para continuar.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "La descompresión ha comenzado";
localizations.UnzipStartedAlertDescText = "Se ha iniciado la operación de descompresión de los archivos seleccionados";
localizations.UnzipCompletedAlertTitleText = "Descomprimir ha completado";
localizations.UnzipCompletedAlertDescText = "La operación de descompresión ha finalizado para los archivos seleccionados";

//zip operation
localizations.ZipStartedAlertTitleText = "Compresión Zip iniciada";
localizations.ZipStartedAlertDescText = "Se ha iniciado la compresión Zip para los archivos seleccionados";
localizations.ZipCompletedAlertTitleText = "Compresión Zip completada";
localizations.ZipCompletedAlertDescText = "Se ha completado la compresión Zip para los archivos seleccionados";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Registro completado : ";
localizations.RegisterWindowProcessCompleteMessage = "Puede iniciar la sesión como usuario registrado una vez que el administrador lo haya habilitado.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Algunas razones por las que el registro puede fallar: </strong><br><br>- El nombre de usuario ya está en uso. <br> - El servidor no permite temporalmente los registros.  <br><br> Por favor, inténtalo de nuevo o ponte en contacto con tu administrador.";

//Data size format items
localizations.dataByClassFormatBytes = "bytes";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "Por favor, espere...";

localizations.bytesSentLabelTextByClass = "Enviado :";
localizations.bytesReceivedLabelTextByClass = "Recibido :";
localizations.dirInfoDownloadLabelTextByClass = "Descargar : ";
localizations.dirInfoUploadLabelTextByClass = "Cargar : ";
localizations.maxAndAvailableAmountLabelTextByClass = "Disponible/Máximo :";
localizations.maxAmountPerDayLabelTextByClass = "Por día :";
localizations.quotaAvailableTextByClass = "Disponible";
localizations.maxAmountPerMonthLabelTextByClass = "Por mes";
localizations.quotaAvailableTextByClass = "disponible";
localizations.maxAmountPerMonthLabelTextByClass = "Por mes :";

//Server message localized
localizations.share_complete = "Publicación completada.";
localizations.share_email_sent = "Mensaje de correo electrónico enviado.";
localizations.share_open_in_email_client = "Abrir en su programa de correo electrónico";
localizations.email_failed = "<div class='errorMessage'>SMTP no pudo enviar el correo electrónico.  Compruebe los registros del servidor.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Carga fallida : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "ERROR: Acceso denegado. (No tiene permiso o la extensión del archivo no está permitida).";
localizations.FileUploadContentNotAllowedErrorMsgText = "ERROR:550  Error: No se permite la extensión del archivo.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "ERROR: No se puede sobrescribir un archivo.";

localizations.CustomEventCallSuccessTitle = "Correcto";
localizations.CustomEventCallSuccessDesc = "Evento personalizado iniciado";
localizations.CustomEventCallFailureTitle = "Fallo";
localizations.CustomEventCallFailureDesc = "Hubo un problema mientras se ejecutaba el evento personalizado";

localizations.ProblemEventCallSuccessTitle = "Correcto";
localizations.ProblemEventCallSuccessDesc = "Problema notificado";
localizations.ProblemEventCallFailureTitle = "Fallo";
localizations.ProblemEventCallFailureDesc = "Hubo un problema al reportar un fallo";


//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Opciones Avanzadas";
localizations.advancedDownloadOptionsButtonText = "Opciones Avanzadas de descarga";
localizations.advancedUploadOptionsDialogSaveButtonText = "Salvar";
localizations.advancedUploadOptionsItemAvailableLabel = "Cuando se encuentra un elemento existente :";
localizations.advancedUploadOptionsUseCompressionLabel = "Use comprensión :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Por favor, confirme su acción";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Por favor, confirme su acción para el archivo :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Acción :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Sobre-escribir";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Sobre-escribir todo";
localizations.advancedUploadActionResumeSelectOptionText = "Resumir";
localizations.advancedUploadActionResumeAllSelectOptionText = "Resumir-todo";
localizations.advancedUploadActionSkipSelectOptionText = "Saltar";
localizations.advancedUploadActionSkilAllSelectOptionText = "Saltar todo";
localizations.advancedUploadActionAskSelectOptionText = "Preguntar";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Si";
localizations.advancedUploadActionCompressionNoSelectOptionText = "No";
localizations.MaxUploadFilesCountReachedGrowlText = "Número máximo de archivos excedido";
localizations.MaxUploadFilesCountReachedGrowlDesc = "Se ha superado el número máximo de archivos que se pueden subir, el máximo de archivos que se pueden subir:";

localizations.OTPDialogHeaderText = "Ingrese aquí su OTP";

localizations.LoggedInAsLabelText = "Inicio sesión como: ";
localizations.AccountExpiresOnLabelText = "Expira : ";
localizations.maxListItemsWarningMessage = "Los grandes listados de directorios causan problemas de rendimiento significativos. Sugerimos organizar los elementos en subcarpetas para evitar problemas de rendimiento.";
if (typeof $.sessionChecker != "no definido")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Cierre de sesión en %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "Por favor, espere...",
    playSlideshow : "Reproducir presentación",
    pauseSlideshow : "Pausar representación",
    refresh : "Actualizar",
    fullscreen : "Pantalla completa",
    download : "Descargar",
    upload : "Cargar",
    deleteText : "Borrar",
    rotateClockwise : "Girar en el sentido de las agujas del reloj",
    rotateCounterClockwise : "Girar en sentido contrario a las agujas del relo",
    previousItem : "Archivo anterior",
    nextItem : "Siguiente archivo",
    delayText : "(Retrasar {x} segundos)",
    nextPageText : "Siguiente &rsaquo;",
    prevPageText : "&lsaquo; Anterior",
    itemCountText : "(Archivo {x} de {y})",
    noItemMessage : "<h3 style='text-align:center;'>No hay elementos disponibles, o hay un problema al buscar los registros.</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "Archivos para subir",
    dragDropMsg : "Arrastrar y soltar el archivo aquí",
    remove : "Eliminar",
    removeAllSelected : "Todo seleccionado",
    removeAllWithError : "Todo con error",
    removeAllUploaded : "Todos cargados",
    removeAllCancelled : "Todos Cancelados",
    removeAllSkipped : "Todo Saltado",
    removeAll : "Todo",
    addFiles : "Añadir archivos...",
    upload : "Cargar",
    uploadSelected : "Subida seleccionada",
    reuploadAll : "Volver a cargar todo",
    cancel : "Cancelar",
    uploadDetails : "Detalles de carga",
    overwriteAll : "Sobre-escribir todo",
    resumeAll : "Reanudar todo",
    shareUploaded : "Compartir Cargados",
    quickFilterSubtext : "Filtro rápido...",
    total : "Total",
    filesFailed : "archivo(s) fallido(s).",
    selectedFiles : "Archivo(s) seleccionado(s) :",
    size : "Tamaño :",
    filtered : "(Filtrado)",
    totalFiles : "Total Archivo(s) :",
    scrollWithActivity : "Desplazamiento con actividad",
    writingFile : "Escribiendo el archivo...",
    decompressingFile : "Descomprimiendo el archivo...",
    pleaseWait : "Por favor, espere...",
    uploadedIn : "Cargado en",
    aMoment: "un momento",
    atAvgSpeedOf : "a una velocidad media de",
    uploadingFailed : "La carga falló",
    canceled : "Cancelado",
    skipped : "Saltados",
    currentSpeed : "Velocidad actual :",
    averageSpeed : "Velocidad media :",
    "de" : "de",
    elapsed : "Transcurrido",
    remaining : "Lo que queda",
    waiting : "Esperando...",
    details : "Detalles",
    overwrite : "Sobre-escribir",
    resume : "Reanudar",
    reupload : "volver a subir",
    pause : "Pausar",
    paused : "Pausado",
    uploading : "Cargando",
    items : "archivo(s)",
    skip : "Saltar",
    cancelAll : "Cancelar todo",
    OK : 'Si',
    CANCEL : 'No',
    CONFIRM : "Si",
    reuploadConfirmation : "Volverá a cargar todos los archivos que ya han sido cargados, cancelados, omitidos o fallados durante la carga y sobrescribirá los archivos existentes. ¿Está seguro de que desea continuar?",
    folderUploadNotSupported : "La carga de carpetas no está soportada en este navegador",
    fileAlreadySelected : "Archivo ya agregado para cargar en el mismo lugar.",
    fileExistsOnServer : "Archivo con el mismo nombre en el servidor.",
    fileSizeExceed : "El tamaño del archivo excede el límite.",
    fileTypeNotAllowed : "Extensión de archivo no permitida.",
    filterApplied : "Filtro Aplicado",
    noMatchingItemAvailable : "No hay ningún artículo disponible que coincida.",
    addFilesToUpload : "Agregar archivos para subir...",
    file : "Archivo",
    reason : "Razón",
    failedItems : "Archivos con error",
    ignoreAll : "Ignorar todo",
    retryAll : "Reintentar todo",
    failedOpeningFile : "El almacenamiento del backend no está disponible.",
    cancelConfirmation : "¿Está seguro de que desea cancelar la carga?",
    failedClosingFile : "Fallo al cerrar el fichero",
    failedWileRetryingChunk : "Falló mientras reintentaba la subida por tramos.",
    retryingFile : "Reintentar carga de archivo",
    "en" : "En",
    seconds : "segundo(s)",
    skipFile : "Saltar archivo",
    retryNow : "Reintentar ahora",
    retryingClosingFile : "Reintento de cierre de archivo",
    fileExistConfirmation : "El archivo [1] con el mismo tamaño existe, ¿quieres reenviar el archivo?",
    bigFileOverwriteConfirmation : "El archivo [1] en el servidor es más grande que el que se está subiendo, ¿quieres sobrescribirlo?",
    fileExistsOnServerConfirmation : "El archivo [1] existe del servidor",
    fileActionTitle : "Por favor, seleccione lo que quiere hacer con este archivo.",
    applyToAll : "Aplicar a todo",
    retryingOpeningFile : "Reintentar abrir el archivo",
    secondsAbbr : "segundos",
    minutesAbbr : "minutos",
    hoursAbbr : "horas"
};