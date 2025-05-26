//French
/*Login page specific*/
localizations.BadLoginInfoText = "Votre code d&rsquo;usager et/ou votre mot de passe ne sont pas valides, ou votre compte a expir&eacute;.";
localizations.ServerErrorInfoText = "Le serveur n&rsquo;est pas disponible, ou votre adresse IP a &eacute;t&eacute; bloqu&eacute;e.";
localizations.PasswordsDoNotMatchAlertText = "Les nouveaux mots de passe ne correspondent pas.";
localizations.LoginAgainTitleText = "Authentifiez-vous de nouveau";
localizations.LoginWithNewPassText = "Authentifiez-vous avec votre nouveau mot de passe";
localizations.AuthenticatingMsgText = "Authentification en cours...";
localizations.LoginSuccessText = "Authentification r&eacute;ussie";
localizations.LoadingWebInterfaceText = "Pr&eacute;paration de l&rsquo;interface...";
localizations.LoginWarningText = "Avertissement";
/*
* Original line replaced because the reset page is not accessible for ldap users.

localizations.MultipleBadLoginsAlertDescText = "Trop de tentatives de connexion manquées et votre adresse IP sera exclue.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Cliquer<a style='color:white;' href='/WebInterface/jQuery/reset.html'>ici</a> pour réinitialiser le mot de passe.</div>";
*/
localizations.MultipleBadLoginsAlertDescText = "<p>Votre adresse IP sera bloqué si vous avez des échecs d'authentification trop fréquents.</p><p>{msg}</p>";
localizations.LoginFailedText = "L&rsquo;authentification a &eacute;chou&eacute;";
localizations.ChangePasswordGrowlTitleText = "Changer votre mot de passe";
localizations.UserNameText = "Code d&rsquo;usager";
localizations.PasswordText = "Mot de passe";
localizations.RememberMeText = "M&eacute;moriser mon code d&rsquo;usager";
localizations.LoginButtonText = "Authentifier";
localizations.ForgotPasswordLinkText = "Changer mon mot de passe.";
localizations.ChangePasswordHeaderText = "Changer votre mot de passe";
localizations.ChangePasswordNoteText = "Vous devez changer votre mot de passe avant de pouvoir continuer.";
localizations.CurrentPasswordText = "Mot de passe actuel : ";
localizations.NewPasswordText = "Nouveau mot de passe : ";
localizations.ConfirmPasswordText = "Confirmer le mot de passe : ";
localizations.CancelButtonText = "Annuler";
localizations.ChanngePasswordButtonText = "Modifier le mot de passe.";
localizations.GeneratePasswordButtonText = "Générer un mot de passe.";
localizations.GeneratePasswordUseButtonText = "Utiliser celui-ci.";
localizations.GeneratePasswordCancelButtonText = "Annuler";
localizations.OldBrowserNoticeHTMLAsText = 'Votre fureteur est p&eacute;rim&eacute; et n&rswuo;est pas support&eacute; par notre site!<br><br><div style="text-align:right;"><button id="proceedAnyway">Poursuivre</button> ou utiliser un autre fureteur:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
/*Reset pass page specific*/
localizations.resetPageUserName = "Code d&rsquo;usager ou adresse courriel";
localizations.resetPagePassword = "Mot de passe";
localizations.resetPagePasswordConfirm = "Confirmer le mot de passe";
localizations.resetPageSubmit = "Soumettre";
localizations.resetPageLoginPage = "Page d'accueil";
localizations.resetPageStartOver = "Recommencer";
localizations.resetPagePleaseWait = "Un moment svp...";
localizations.resetPagePasswordDonotMatchErrorTitle = "Les mots de passe ne sont pas identiques.";
localizations.resetPagePasswordDonotMatchErrorDesc = "Le mot de passe et le mot de passe de confirmation doivent &ecirc;tre identiques.";
localizations.ResetPasswordUserNotFoundMsgText = "Le code d&rsquo;usager correspondant n&rsquo;existe pas ou n&rsquo;a pas de courriel associ&eacute;.";

localizations.passwordRequirementsMessages = {
    unsafeChars: "Le mot de passe ne doit pas contenir de caract&egrave;re(s) utilis&eacute; pour les URL: $$",
    errorTitle : "Erreur : \r\n",
    msgSeparator : "\r\n",
    chars : "Le mot de passe doit contenir au moins $$ caractère(s).",
    numericChars : "Le mot de passe doit contenir au moins $$ caractère(s) numérique(s).",
    lowerCase : "Le mot de passe doit contenir au moins $$ minuscule(s).",
    upperCase : "Le mot de passe doit contenir au moins $$ majuscule(s).",
    specialCase : "Le mot de passe doit contenir au moins $$ caractère(s) spécial(aux).",
    notAllowedErrorMsg : "Vous devez définir un mot de passe qui rencontre les exigences minimales."
};

localizations.ItemsPerPageText = "Nombre d&rsquo;items affich&eacute;s par page : ";
localizations.LayoutChangeLabelText = "Mise en page : ";

/*File uploading specific*/

window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "Le fichier est trop gros",
            "minFileSize": "Le fichier est trop petit",
            "acceptFileTypes": "Ce type de fichier ne peut pas être téléversé",
            "maxNumberOfFiles": "Le nombre de fichiers dépasse le maximum permis",
            "uploadedBytes": "Grosseur du téléversement dépasse la grosseur du fichier",
            "emptyResult": "Le résultat du téléversement est vide.",
            "fileAvailableInSelectedFolder": "Ce fichier a déjà été ajouté pour ce répertoire!",
            "hasReachedQuota": "La grosseur du fichier dépasse l'espace qui vous est alloué",
            "fileExistOnServer": "Ce fichier existe déjà sur le serveur!",
            "fileBiggerThanAllowed": "Le fichier dépasse la grandeur permise!",
            "dirNoWritable": "Vous ne pouvez pas téléverser dans ce répertoire!",
            "blockUploadingDirs": "Le téléversement de répertoires est refusé!",
            "true": "Vrai"
        },
        "error": "Erreur",
        "start": "Commencer",
        "waiting": "En attente...",
        "uploading": "En téléversement : ",
        "reupload": "Recommencer",
        "share": "Partager",
        "cancel": "Annuler",
        "destroy": "Supprimer",
        "overwrite": "Écraser",
        "uploadTo": "Téléverser vers : ",
        "pause": "Pause",
        "errorLabel": "Erreur : ",
        "details": "Détails",
        "uploadedInLabelText": "Téléverser dans : ",
        "atAvgSpeedOfLabelText": "Débit moyen : ",
        "uploadCompletedText": "Téléversement complété.",
        "uploadedFileText": "Le fichier a été téléverser au serveur.<br>Le traitement commencera après la fermeture de votre session.",
        "uploadedMultipleFilesText": "Tous les fichiers ont été téléversés.<br>Le traitement commencera après la fermeture de votre session."
    }
};

localizations.buttons = {
    "admin": "Administration",
    "delete": "Supprimer",
    "rename": "Renommer",
    "download": "Télécharger",
    "advanced download": "Téléchargement Avancé",
    "zipdownload": "Téléchargement en format compressé",
    "unzip": "Décompresser",
    "zip selected": "Compression sélectionnée",
    "explore zip contents": "Parcourir les contenus compressés",
    "create folder": "Créer un répertoire",
    "upload": "Téléverser",
    "search": "Rechercher",
    "user options": "Pr&eacute;f&eacute;rences",
    "cut": "Couper",
    "copy": "Copier",
    "paste": "Coller",
    "slideshow": "Diaporama",
    "quickview": "Affichage Rapide",
    "download low-res": "Télécharger la version en faible résolution",
    "preview": "Aperçu",
    "batchcomplete": "Lot complet",
    "share": "Partager",
    "quick share": "Partage rapide",
    "manage shares": "Gérer les partages",
    "show basket": "Contenu du panier",
    "add to basket": "Ajouter au panier",
    "edit keywords": "Modifier les mots clés",
    "change icon": "Changer l'icône",
    "download crushtunnel": "Télécharger CrushTunnel",
    "help": "Aide",
    "login": "Authentification",
    "logout": "D&eacute;connexion",
    "download sync app": "Télécharger Sync App",
    "download crushftpdrive": "Télécharger CrushFTPDrive",
    "sync manager": "Gestionnaire de sychro"
};

localizations.currentLanguageName = "French"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "Anglais (English)";
localizations.languageNameCzech = "Tchèque (Čeština)";
localizations.languageNameDanish = "Danois (Danske)";
localizations.languageNameDutch = "Néerlandais (Nederlands)";
localizations.languageNameFrench = "Français";
localizations.languageNameGerman = "Allemand (Deutsch)";
localizations.languageNameHungarian = "Hongrois (Magyar)";
localizations.languageNameItalian = "Italien (Italiano)";
localizations.languageNamePolish = "Polonais (Polskie)";
localizations.languageNameSpanish = "Espanol (Español)";
localizations.languageNameSlovak = "Slovaque (Slovenský)";
localizations.languageNameChinese = "Chinois (ä¸­åœ‹)";
localizations.languageNameSwedish = "Suédois (Svenska)";
localizations.languageNameJapanese = "Japanese (日本語)";


//WebInterface
localizations.refreshListingButtonTooltipText = "Actualiser";
localizations.FilterText = localizations.FilterTextBasket = "Filtre:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Effacer";
localizations.FileCounterItemsText = "Items";
localizations.FileCounterFoldersText = "R&eacute;pertoires";
localizations.FileCounterFilesText = "Fichiers";
localizations.FileCounterHiddenItemsText = "Items cach&eacute;s";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Vue en Vignette";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Vue en Arborescence";
localizations.DownloadResumeTextLabelBasket = "Recommencer"
localizations.BackToTopLinkText = "Haut de la page";
localizations.FilesNotAvailableMessage = "Aucun fichier n&rsquo;est disponible";
localizations.CopyNoFilesSelectedMessage = "Choisir les fichiers/r&eacute;pertoires &agrave; copier";
localizations.CopyOnlyFilesMessage = "Seulement les fichiers peuvent &ecirc;tre copi&eacute;s/coll&eacute;s, les r&eacute;pertoires seront ignor&eacute;s";
localizations.CopyActionGrowlTitleText = "Copier";
localizations.DeleteNoFilesSelectedMessage = "Choisir les fichier et dossiers &agrave; supprimer";
localizations.UnzipNoFilesSelectedMessage = "Choisir le fichier &agrave; d&eacute;compresser";
localizations.ZipExploreNoFilesSelectedMessage = "Choisir le fichier zip &agrave; explorer";
localizations.CutNoFilesSelectedMessage = "Choisir les fichiers et dossiers &agrave; couper";
localizations.CutActionGrowlTitleText = "Couper";
localizations.pagingPrevText = "Pr&eacute;c&eacute;dent";
localizations.pagingNextText = "Suivant";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Items avec phrase \"{filterVal}\" : {totalItems} , R&eacute;pertoires: {folders} Fichiers: {files})";
localizations.TotalItemsInDirMsgText = " (Nombre d&rsquo;items dans le r&eacute;pertoire {count}) ";
localizations.CurrentFileSizeText = " (Grandeur Totale de la liste de fichiers {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} items) ";
localizations.quotaAvailableLabelText = "disponible";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Erreur: La sauvegarde a &eacute;chou&eacute;";
localizations.TreeviewSpecificActionMsgTitleText = "Pour la vue en arborescence seulement";
localizations.TreeviewSpecificActionMsgDescText = "Seulement pour la vue en arborescence";
localizations.PasswordExpiringMsgText = "Votre mot de passe expirera bient&ocirc;t<br/>Utilisez l&rsquo;option Pr&eacute;f&eacute;rences pour le changer.";
localizations.PasswordNotMatchingMsgText = "Les nouveaux mots de passe ne correspondent pas.";
localizations.PasswordMustBeComplexMsgText = "Votre mot de passe doit &ecirc;tre plus complexe";
localizations.PasswordChangedMsgText = "Votre mot de passe a été changé.  Authentifiez-vous avec votre nouveau mot de passe.";
localizations.passwordChangePreviousPasswordErrorMessage = "Vous ne pouvez pas utiliser un mot de passe que vous avez utilisé récemment.";
localizations.AppletLoadingFailedMsgText = "Applet a &eacute;chou&eacute; pendant le t&eacute;l&eacutechargement";
localizations.DownloadStartedAlertTitleText = "T&eacute;l&eacutechargement en cours";
localizations.DownloadCompletedText = "[T&eacute;l&eacutechargement termin&eacute;]";
localizations.DownloadCompletedPathText = " T&eacute;l&eacutecharger vers : ";
localizations.DownloadStartedAlertDescText = "Choisir la destination de sauvegarde pour poursuivre.";
localizations.LogoutButtonText = "Déconnexion";
localizations.browserUploaderNativeUploadTipSetTitle = "T&eacute;l&eacuteverser en utilisant le t&eacute;l&eacuteverseur du fureteur.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "T&eacute;l&eacuteverser en utilisant le mode avanc&eacute;, <br>qui permet de t&eacute;l&eacuteverser les r&eacute;pertoires, et est plus rapide.";
localizations.browserUploaderDragDropHoverLabelText = "D&eacute;poser les fichiers ici pour les t&eacute;l&eacute;verser au serveur.";
localizations.appletUploaderDropPanelLabelText = "&darr; D&eacute;poser les fichiers ici &agrave; t&eacute;l&eacuteverser &darr;";
localizations.browserUploaderDragDropLabelText = "D&eacute;poser les fichiers ici pour les t&eacute;l&eacute;verser au serveur";
localizations.browserUploaderChromeDragDropLabelText = "D&eacute;poser les fichiers et répertoires ici pour les t&eacute;l&eacute;verser au serveur";
localizations.advancedUploadOptionsDialogSaveButtonText = "Sauvegarder";
localizations.advancedUploadOptionsDialogCancelButtonText = "Annuler";

//Sharing Window
localizations.ShareWindowHeaderText = "Partage de fichiers";
localizations.ShareWindowFilesSharingLabelText = "En partage :";
localizations.ShareWindowShareTypeLabelText = "Mode de partage:";
localizations.ShareWindowShareTypeLabelCopyText = "Copier";
localizations.ShareWindowShareTypeLabelMoveText = "D&eacute;placer";
localizations.ShareWindowShareTypeLabelReferenceText = "R&eacute;f&eacute;rence";
localizations.ShareWindowShareToInternalUserLabelText = "Partage interne";
localizations.ShareWindowShareToExternalUserLabelText = "Partage externe";
localizations.ShareWindowDownloadLabelText = "T&eacute;l&eacutechargement";
localizations.ShareWindowUploadLabelText = "T&eacute;l&eacuteversement";
localizations.ShareWindowDeleteLabelText = "Supprimer";
localizations.ShareWindowSendEmailLabelText = "Envoyer un courriel :";
localizations.ShareWindowDirectLinkLabelText = "Hyperlien direct au fichier?";
localizations.ShareWindowExpiresLabelText = "Expire dans :";
localizations.ShareWindowExpiresInDaysLabelText = "jours, le ";
localizations.ShareWindowMaxUsesLabelText = "Nombre maximum d&rsquo;utilisations : ";
localizations.ShareWindowMaxUsesUnlimitedText = "Illimit&eacute;es";
localizations.ShareWindowFromLabelText = "De : ";
localizations.ShareWindowToLabelText = "&Agrave; : ";
localizations.ShareWindowCCLabelText = "CC : ";
localizations.ShareWindowBCCLabelText = "CCi : ";
localizations.ShareWindowReplyToLabelText = "R&eacute;pondre &agrave; : ";
localizations.ShareWindowSubjectLabelText = "Sujet : ";
localizations.ShareWindowBodyLabelText = "Message : ";
localizations.ShareWindowAdvancedLabelText = "Advanc&eacute";
localizations.ShareWindowAttachThumbsLabelText = "Attacher une vignette";
localizations.ShareWindowAttachFileLabelText = "Attacher les fichiers";
localizations.ShareWindowCommentsLabelText = "Commentaires :";
localizations.ShareWindowKeywordsLabelText = "Mots clés : ";
localizations.ShareWindowAccessLabelText = "Acc&egrave;s sans restrictions ";
localizations.ShareWindowSendButtonText = "Envoyer";
localizations.ShareWindowCancelButtonText = "Annuler";
localizations.ShareWindowUsernameMethodLabelText = "M&eacute;thode de partage : ";
localizations.ShareWindowUsernameLabelText = "Partager avec un usager interne";
localizations.ShareWindowUsernamesLabelText = "Usagers : ";
localizations.ShareWindowUsernamesLabelHelpText = "(S&eacute;parer les usagers avec des virgules.)";
localizations.ShareActionCompleteShareUsernamesText = "Les usagers suivants ont maintenant acc&egrave;s aux items partag&eacute;s.";
localizations.ShareActionCompleteUsernameText = "Nom d'usagers: ";
localizations.ShareActionCompletePasswordText = "Mot de passe: ";
localizations.ShareActionCompleteLinkText = "Lien";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Entrer une adresse de courriel valide.  Vous pouvez entrer plusieurs adresses en les s&ecaute;parant par des virgules. ie. <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareWindowUserPassLabelText = "Code d&rsquo;usager / mot de passe :";
localizations.ShareWindowByClassUserPassAutoLabelText = "Automatique";
localizations.ShareWindowByClassUserPassGenerateLabelText = "G&eacute;n&eacute;rer";
localizations.ShareInvalidItemSelectedGrowlText = "Item est invalide";
localizations.SharFoldersCantBeSharedGrowlText = "Les répertoires ne peuvent pas être partag&eacute;s!";
localizations.SharFilesCantBeSharedGrowlText = "Les fichiers ne peuvent pas être partag&eacute;s!";

//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copier l&rsquo;hyperlien direct";
localizations.CopyLinkText = "Copier la référence";
//Create folder window
localizations.CreateFolderWindowHeaderText = "Cr&eacute;er un nouveau r&eacute;pertoire.";
localizations.CreateFolderInputDefaultFolderName = "Nouveau répertoire";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Naviguer au r&eacute;pertoire apr&egrave;s sa cr&eacute;ation. ";
localizations.CreateFolderButtonText = "Créer";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "T&eacute;l&eacute;versement";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "D&eacutetails du t&eacute;l&eacute;versement";
localizations.BrowserUploaderUploadFilesTabHeaderText = "T&eacute;l&eacute;verser les fichiers";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Navigation avanc&eacute;e...";
localizations.BrowserUploaderStartUploadingLinkText = "Commencer le t&eacute;l&eacute;versement";
localizations.BrowserUploaderClearCompletedLinkText = "D&eacute;gager les t&eacute;l&eacute;versement compl&eacute;t&eacute;s";
localizations.BrowserUploaderResumeCheckboxText = "Recommencer";
localizations.BrowserUploaderFormResetButtonText = "R&eacuteinitialiser";
localizations.BrowserUploaderFormNextButtonText = "Suivant";
localizations.BrowserUploaderFileAddedAlreadyText = "Ce fichier a d&eacute;j&agrave; &eacute;t&eacute; ajout&eacute;.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} a d&eacute;j&agrave; &eacute;t&eacute; ajout&eacute;.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Ces fichiers ont d&eacute;j&agrave; &eacute;t&eacute; ajout&eacute;s.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} ont d&eacute;j&agrave; &eacute;t&eacute; ajout&eacute;s.";
localizations.BrowserUploaderSelectedFilesGroupText = "Groupe de fichiers : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Supprimer";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Sera t&eacute;l&eacutevers&eacute vers";
localizations.BrowserUploaderSelectedFileOverwriteText = "&E&acute;craser";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "sera &eacute;cras&eacute;";
localizations.BrowserUploaderSelectedFileExistsText = "Le fichier existe";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Votre attention est requise";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorer";
localizations.BrowserUploaderSelectedFileDoneText = "Terminer";
localizations.BrowserUploaderSelectedFileUploadedText = "T&eacute;l&eacute;verser vers";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "recommencer";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "recommencer";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Rejeter";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Annuler";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Arr&ecirc;ter";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Arr&ecirc;t&eacute;";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Recommencer";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Un total de {0} fichier(s)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} de {1} item(s) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "T&eacute;l&eacuteverser vers : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Vitesse actuelle : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Vitesse moyenne : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Temps : encouru: <span class='elapsed'>{0}</span> <span class='remained'>, restant : {1}</span></div>";
localizations.BatchCompleteText = "R&eacute;sultat";
localizations.BatchComplete = "T&eacute;l&eacute;versement  confirm&eacute;.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Calcul..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Il y a eu un probl&egrave;me pendant la transmission";
localizations.BrowserUploaderCancelledUploadMsgText = "T&eacute;l&eacute;versement annul&eacute;";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Vous t&eacute;l&eacute;versez des fichiers vers le serveur.  Si vous quittez cette page, le t&eacute;l&eacute;versement sera interrompu.  Voulez-vous vraiment quitter cette page?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Vous t&eacute;l&eacute;chargez des fichiers du serveur.  Si vous quittez cette page, le t&eacute;l&eacute;chargement sera interrompu.  Voulez-vous vraiment quitter cette page?";
localizations.NoUploadInDirGrowlText = "Le t&eacute;l&eacute;versement vers le serveur est interdit.";
localizations.NoUploadInDirGrowlDesc = "Vous ne pouvez pas t&eacute;l&eacute;verser vers ce r&eacute;pertoire.";
localizations.AdvancedUploadDirNotAllowedText = "Le t&eacute;l&eacute;versement d&rsquo;un r&eacute;pertoire n&rsquo;est pas permis.";
localizations.AdvancedUploadDirNotAllowedDescText = "Les r&eacute;pertoires ne peuvent pas &ecirc;tre t&eacute;l&eacute;verser, vous devez seulement choisir des fichiers.";
localizations.uploadConfirmCancelUploadText = "Êtes-vous certain de vouloir annuler le téléversement?";
localizations.uploadConfirmCancelUploadAfterFormText = "&Ecirc;tes-vous certain de vouloir annuler le t&eacute;l&eacute;versement pour les {count} derniers item(s)?";
localizations.FileUploadCanNotOverwriteErrorMsgText = "Erreur: Le fichier existe d&eacute;j&agrave; vous ne pouvez pas l&rsquo;&eacute;craser!";

//New upload bar localizations
localizations.browseFileLabelByClass = "Ajouter des fichiers à téléverser...";
localizations.advancedUploadResumeLabelByClass = "Recommencer";
localizations.filesToUploadQueueWindowHeader = "Liste de fichiers &agrave; t&eacute;l&eacute;verser au serveur.";
localizations.uploadWindowStartUploadingByClass = "Commencer le t&eacute;l&eacute;versement";
localizations.uploadWindowCancelUploadingByClass = "Annuler le t&eacute;l&eacute;versement";
localizations.uploadWindowShowCommonUploadFormByClass = "Détails";
localizations.uploadWindowClearUploadedByClass = "Supprimer les fichiers t&eacute;l&eacute;vers&eacute;s de la liste";
localizations.uploadWindowOverwriteAllByClass = "&Eacute;crase tous les fichiers";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Supprimer ceux qui sont en erreur";
localizations.uploadWindowSummaryFilesByClass = "Nombre de fichiers : ";
localizations.uploadWindowSummarySizeByClass = ", Grandeur totale : ";
localizations.uploadBarShowHideFilesSetTitleClass = "Afficher/Cacher les fichiers choisis.";
localizations.uploadBarAttentionTitle = "Vous devez ajouter des fichier avant t&eacute;l&eacuteverser vers le serveur!";
localizations.uploadBarAttentionText = "Utiliser la barre de t&eacute;l&eacute;versement pour ajouter des fichiers ou appuyer sur le bouton \"" + localizations.browseFileLabelByClass + "\" pour ajouter des fichiers.";
localizations.uploadBiggerFileNoticeTitleText = "Pour les gros fichiers vous devez choisir le mode de t&eacute;l&eacute;versement avanc&eacute.";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>Nous vous sugg&egrave;rons d&rsquo;utiliser le mode de t&eacute;l&eacute;versement avanc&eacute; pour les gros fichiers.  Ce mode permet, de <em>poursuivre automatiquement</em> le t&eacute;l&eacute;versement apr&egrave;s une interruption. <br><br> (Vous pouvez changer le mode sur la barre de t&eacute;l&eacute;versement)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:-45px;' title='Comment changer le mode de t&eacute;l&eacute;versement'>";

localizations.globalProgressbarSkipLabelByClass = "Suivant";
localizations.globalProgressbarPauseLabelByClass = "Pause";
localizations.globalProgressbarStopLabelByClass = "Arr&ecirc;ter";

localizations.popupOpenInSeparateWindowText = "Ouvrir dans une fen&ecirc;tre ind&eacute;pendante";
localizations.customFormPasswordMatchValidationFailedText = "Les mots de passe ne correspondent pas";
localizations.customFormCompareValueMatchValidationFailedText = "Les valeurs ne correspondent pas";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "Utiliser le mode de t&eacute;l&eacute;versement r&eacute;gulier";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Utiliser le téléversement avancé.<div style='font-size:11px;width:500px;margin:5px 0px;'>Le mode avanc&eacute; acc&eacute;l&eacute;reras le t&eacute;l&eacute;versement.  Ce mode peut poursuivre le t&eacute;l&eacute;versement lors d&rsquo;&eacute;chec, et permet le t&eacute;l&eacute;versement de r&eacute;pertoire.<br><br>C&rsquo;est la m&eacute;thode la plus rapide de t&eacute;l&eacute;verser.<br>(Le mode avanc&eacute; requiers le Applet plugin Java disponible de www.java.com.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Recherche";
localizations.SearchWindowKeywordsLabelText = "Mots cl&eacute;s :";
localizations.SearchWindowExactLabelText = "Exacte?";
localizations.SearchWindowKeywordsOnlyLabelText = "Chercher les mots cl&eacute;s seulement.";
localizations.SearchWindowByClassModifiedLabelText = "Modifi&eacute;";
localizations.SearchWindowByClassDateFormatLabelText = "(aaaa-mmm-jj) ";
localizations.SearchWindowSizeLabelByClassText = "Grandeur ";
localizations.SearchWindowTypeLabelText = "De type";
localizations.SearchWindowSizeUnitLabelTextByClass = "(KiloOctets)";
localizations.SearchWindowSearchButtonText = "Chercher";
localizations.SearchWindowCancelButtonText = "Annuler";
localizations.SearchResultDisplayText = "R&eacute;sultats:";
localizations.SearchResultClearLinkText = "(Annuler les crit&egrave;res de recherche)";
localizations.SearchFormModifiedOptionAfterText = "Apr&egrave;s";
localizations.SearchFormModifiedOptionBeforeText = "Avant";
localizations.SearchFormSizeOptionBiggerThanText = "Plus grand";
localizations.SearchFormSizeOptionSmallerThanText = "Plus petit";
localizations.SearchFormItemTypeOptionFileText = "Fichier";
localizations.SearchFormItemTypeOptionFolderText = "Dossier";
localizations.SearchProcessNotificationText = "En traitement... ";
localizations.SearchProcessCancelText = "Annuler";
localizations.SearchItemsContextGoToParentText = "Afficher son r&eacute;pertoire";
localizations.SearchWindowOptionTypeOrLabelText = " ou ";
localizations.SearchWindowOptionTypeAndLabelText = " et ";

//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Les <strong>{count}</strong> items sur cette page ont tous &eacute;t&eacute; choisis.";
localizations.ItemsSelectionSelectAllItemsInDir = "Choisir tous les <strong>{total_items}</strong> items dans la liste <strong>{list_type}</strong> (incluant les items cach&eacute;s)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "Tous les <strong>{total_items}</strong> items dans la liste <strong>{list_type}</strong> (incluant les items cach&eacute;s) ont &eacute;t&eacute; choisis.";
localizations.ItemsSelectionClearSelection = "Vider la s&eacute;lection";
localizations.ItemsSelectionShowingFolderText = "R&eacute;pertoire actuel";
localizations.ItemsSelectionShowingFilteredItemsText = "List filt&eacute;e actuelle";
localizations.ItemsSelectionShowingSearchedItemsText = "R&eacute;sultat de recherche";
//User options window
localizations.UserOptionsWindowHeaderText = "Pr&eacute;f&eacute;rences";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Cacher les items qui commencent par un '.'";
localizations.UserOptionsWindowHideCheckboxLabelText = "Cacher la colonne de s&eacute;lection ";
localizations.UserOptionsWindowHideFilterLabelText = "Cacher la section pour filtrer ";
localizations.UserOptionsWindowAutostartUploadLabelText = "Partir automatiquement le t&eacute;l&eacute;versement. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Partir automatiquement l&rsquo;applet Java. ";
localizations.UserOptionsWindowDisableCompressionLabelText = "D&eacute;activer la compression pour l&rsquo;applet Java. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "Changer votre mot de passe";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Mot de passe actuel: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nouveau mot de passe: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Confirmer votre mdp:";
localizations.UserOptionsWindowChangePasswordButtonText = "Changer le mot de passe";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Générer un mot de passe";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Utiliser celui-ci";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Annuler";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "Le mot de passe actuel que vous avez entré n'est pas le bon mot de passe.";
localizations.ChangePasswordResetLinkExpiredText = "La p&eacute;riode d&rsquo;acc&egrave;s &agrave; cette page est expir&eacute;e.";
localizations.UserOptionsWindowCancelButtonText = "Annuler";
localizations.UserOptionsWindowUpdateButtonText = "Sauvegarder";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Basculer";
localizations.MainCheckboxContextMenuCheckAllText = "Choisir tous";
localizations.MainCheckboxContextMenuUncheckAllText = "Choisir aucun";
//Keywords window
localizations.KeywordsWindowHeaderText = "Mots cl&eacute;s";
localizations.KeywordsWindowUpdateLinkText = "Modifier";
localizations.KeywordsWindowCancelLinkText = "Annuler";
//File basket
localizations.BasketHeaderText = "Contenu du panier";
localizations.BasketClearAllLinkText = "Vider le panier";
localizations.BasketDownloadLinkText = "T&eacute;l&eacute;chargement du panier";
localizations.BasketDownloadAdvancedLinkText = "T&eacute;l&eacute;chargement avanc&eacute; du panier";
localizations.BasketShareItemsLinkText = "Partager le panier";
localizations.BasketNoFilesAvailableText = "Le panier contient aucun fichier";
localizations.BasketRemoveLinkText = "Supprimer";
localizations.BasketTotalItemText = "{0} Items ";
localizations.BasketFileAddedAlreadyText = "Ce fichier est d&eacute;j&agrave; dans le panier!";
localizations.BasketFileAddedAlreadyDetailsText = "Ce fichier a d&eacute;j&agrave; &eacute;&eacute; ajouter au panier.";
localizations.BasketNothingSelectedToAddText = "Vous devez choisir les items avant de pouvoir les ajouter au panier!";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Voulez-vous vraiment vider le contenu du panier?";
//Paste form panel
localizations.PasteFormHeaderText = "Coller";
localizations.PasteFormResetButtonText = "R&eacute;initizliser";
localizations.PasteFormPasteButtonText = "Coller";
localizations.PasteFormErrorHeaderText = "Erreur pendant l&rsquo;op&eacute;ration de collage!";
localizations.PasteFormErrorDetailsText = "Une erreur a &eacute;t&eacute; d&eacute;tect&eacute;e pendant l&rsquo;op&eacute;ration de collage.<br />Erreur : {0}";
localizations.PasteFormErrorNothingToPasteText = "In n&rsquo;y a rien &agrave; coller!";
localizations.PasteSelectDirectoryWarning = "Choisir une cible pour les items &agrave; copier";
localizations.PasteSelectSingleDirectoryWarning = "Choisir seulement une cible pour les items &agrave; copier";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Bienvenu";
localizations.WelcomeFormOkButtonText = "OK";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Diaporama";
//Manage Share window
localizations.ManageShareWindowHeaderText = "G&eacute;rer le Partage";
localizations.ManageShareWindowRefreshLinkText = "Rafraichir";
localizations.ManageShareWindowDeleteSelectedLinkText = "Supprimer les items s&eacute;lectionn&eacutes";
localizations.ManageShareWindowDeleteLinkText = "Supprimer";
localizations.ManageShareWindowGridLinkLabelText = "Lien";
localizations.ManageShareWindowGridFromLabelText = "De";
localizations.ManageShareWindowGridToLabelText = "&Agrave;";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "CCi";
localizations.ManageShareWindowGridReplyToLabelText = "Répondre à";
localizations.ManageShareWindowGridSubjectLabelText = "Suj&egrave;t";
localizations.ManageShareWindowGridBodyLabelText = "Message";
localizations.ManageShareWindowGridShareTypeLabelText = "Type de partage";
localizations.ManageShareWindowGridUserNameLabelText = "Code d&rsquo;usager";
localizations.ManageShareWindowGridPasswordLabelText = "Mot de passe";
localizations.ManageShareWindowGridAttachedLabelText = "Attacher au courriel?";
localizations.ManageShareWindowGridUploadLabelText = "T&eacute;l&eacuteversement au serveur permis?";
localizations.ManageShareWindowGridPathsLabelText = "Chemin d&rsquo;acc*egrave;s";
localizations.ManageShareWindowGridCreatedLabelText = "Cr&eacute;&eacute;";
localizations.ManageShareWindowGridExpiresLabelText = "Expire";
localizations.ManageShareWindowGridSharedItemsLabelText = "Items partag&eacute;s";
localizations.ManageShareWindowGridDownloadsLabelText = "T&eacute;l&eacute;charger";
localizations.ManageShareWindowNothingToShowMessageText = "Rien &agrave; afficher";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Voulez-vous vraiment suppimer le(s) {count} compte(s) choisi(s) ?";
localizations.ManageShareWindowFilterText = "Filtre :";
localizations.ManageShareWindowClearFilterText = "Effacer";
localizations.ManageShareWindowNextItemText = "Suivant";
localizations.ManageShareWindowPrevItemText = "Pr&eacute;c&eacutedent";
localizations.ManageShareWindowSelectSimilarText = "Choisir similaire";
localizations.ManageShareWindowPageTitle = "CrushFTP - G&eacute;rer le partage";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Renommer";
localizations.RenamePanelSaveLinkText = "Sauvegarder";
localizations.RenamePanelCancelLinkText = "Annuler";

localizations.ZipNameWindowHeaderText = "Nom du zip";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Annuler";

localizations.SyncAppNameWindowHeaderText = "T&eacute;leacute;chargement de l&rsquo;application Sync";
localizations.SyncAppDownloadYourPassText = "Votre mot de passe : ";
localizations.SyncAppDownloadAdminPassText = "Mot de passe d&rsquo;administration : ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Annuler";

//Tooltip info
localizations.TooltipNameLabelText = "Nom";
localizations.TooltipPathLabelText = "Chemin d&rsquo;acc&egrave;s";
localizations.TooltipSizeLabelText = "Grandeur";
localizations.TooltipModifiedLabelText = "Modifi&eacute;";
localizations.TooltipKeywordsLabelText = "Mots cl&eacute;s";

//Form alerts and notifications
localizations.FormValidationFailText = "La valeur fournie pour certains items est invalide ou manquante.  Corrigez les erreurs indiqu&eacute;es avec un * dans le formulaire ci-dessus.";
localizations.FormEmailValidationFailText = "<br> - Vous devez fournir des adresses courriel valides dans les champs courriel.";
localizations.DeleteConfirmationMessageText = "{0} répertoire(s) et {1} fichiers(s) seront supprimés.\n\nLes items suivants ne pourront plus être récupérés après la suppression:\n{2}";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Tous les items dans le r&eacutepertoire \"{folder_name}\" seront supprim&eacute;s.\n\nUn total de {count} items sera supprim&eacute;.\n\nUne fois supprim&eacute;s il ne pourront plus &etre r&eacute;p&eacuter&eacute;s";
localizations.CopyActionGrowlText = "{0} r&eacute;pertoire(s) et {1} fichier(s) &agrave; copi&eacute;(s).";
localizations.CutActionGrowlText = "{0} r&eacute;pertoire(s) et {1} fichier(s) coup&eacute;(s).";
localizations.NothingSelectedGrowlText = "Rien n&rsquo;a &eacute;t&eacute; choisi";
localizations.ShareNothingSelectedGrowlText = "Rien n&rsquo;a &eacute;t&eacute; choisi pour partager";
localizations.DownloadNothingSelectedGrowlText = "Vous n&rsquo;avez rien de choisi pour t&eacute;l&eacute;charger!";
localizations.RenameNothingSelectedGrowlText = "Rien n&rsquo;a &eacute;t&eacute; choisi pour &ecirc;tre renomm&eacute;.";
localizations.PreviewNothingSelectedGrowlText = "Rien n&rsquo;a &eacute;t&eacute; choisi pour &ecirc;tre pr&eacute;visionn&eacute;";
localizations.NoPreviewGrowlText = "Pr&eacute;visionnement";
localizations.NoPreviewGrowlDesc = "Il n&rsquo;y a pas d&rsquo;aperc&ccedil;u pour l&rsquo;item choisi.";
localizations.ProblemWhileRenamingGrowlText = "Erreur d&eacute;cel&eacute;e lors du chagement de nom.";
localizations.ProblemWhileRenamingDescGrowlText = "Une erreur a e&eacute;t&eacute; d&eacute;cel&eacute;e lors du chagement de nom. SVP essayez de nouveau. Erreur : ";
localizations.ProblemWhileSharingGrowlText = "Erreur d&eacute;cel&eacute;e lors du partage";
localizations.ProblemWhileSharingDescGrowlText = "Une erreur a &eacute;t&eacute d&eacute;cel&eacute;e lors du partage. SVP essayez de nouveau.";
localizations.DirectLinkDescGrowlText = "Cliquez sur l'item avec le bouton de droite, et choisir l&rsquo;option copier le lien direct.";
localizations.UpdateKeywordDescGrowlText = "Cliquez sur l'item avec le bouton de droite, et choisir l&rsquo;option mise &agrave; des mots cl&eacute;s.";
localizations.QuickViewNothingToShowGrowlText = "Erreur : Rien &agrave; afficher pour le visionnement rapide.";
localizations.QuickViewNoItemsAvailableGrowlText = "Aucun item est disponible";
localizations.QuickViewRotateClockwiseTooltipText = "Pivoter dans le sens des aiguilles d&rsquo;une montre";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Pivoter sans le sens invers des aiguilles d&rsquo;une montre.";
localizations.QuickViewCurrentImagePositionText = "Item {current} de {total}";
localizations.ProblemWhileDeletingGrowlText = "Erreur d&eacute;cel&eacute;e lors de la suppression.";
localizations.ProblemWhileDeletingDescGrowlText = "Une erreur a &eacute;t&eacute d&eacute;cel&eacute;e lors de la suppression. SVP essayez de nouveau. Erreur : ";
localizations.ProblemWhileUnzipGrowlText = "Erreur d&eacute;cel&eacute;e de la d&eacutecompression(unzip) de fichiers";
localizations.ProblemWhileUnzipDescGrowlText = "Une erreur a &eacute;t&eacute d&eacute;cel&eacute;e lors de la d&eacute;compression (unzip). SVP essayez de nouveau. Erreur : ";
localizations.ProblemWhileZipGrowlText = "Erreur d&eacute;cel&eacute;e de la compression(zip) de fichiers";
localizations.ProblemWhileZipDescGrowlText = "Une erreur a &eacute;t&eacute d&eacute;cel&eacute;e lors de la compression (zip). SVP essayez de nouveau. Erreur : ";
localizations.ProblemWhileCreatingFolderGrowlText = "Erreur d&eacute;cel&eacute;e pendant la cr&eacute;ation d&rsquo;un nouveau r&eacute;pertoire";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Une erreur a &eacute;t&eacute d&eacute;cel&eacute;e lors de la cr&eacute;ation d&rsquo;un nouveau r&eacute;pertoire. SVP essayez de nouveau. Erreur : ";
localizations.JavaRequiredGrowlText = "L&rsquo;environnement Java est n&eacute;cessaire";
localizations.JavaRequiredDescGrowlText = "L&rsquo;environnement Java doit &ecirc;tre install&eacute pour utiliser le mode avanc&eacute;.<br/><br/>Java est disponible au: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Une erreur a été décelée avec l'environnement Java";
localizations.JavaLoadingProblemDescGrowlText = "Si le fureteur ne permet pas l'utilisation de Java, modifier la permission pour Java et essayez de nouveau.";
localizations.JavaAppletNotLoadedGrowlText = "L&rsquo;applet Java ne peut pas &ecirc;tre ex&eacute;cut&eacute;.";
localizations.JavaAppletNotLoadedDescGrowlText = "Vous devez appuyer sur le bouton 'Navigation avanc&eacute;e...' pour activer le mode glisser-d&eacute;poser.";
localizations.NoFilesFoundGrowlTitle = "Aucun fichier disponible";
localizations.NoFilesFoundGrowlText = "Erreur : Aucun fichier n&rsquo;est disponible pour ";
localizations.AutoLogOutConfirmationTitle = "D&eacute;connexion automatique";
localizations.AutoLogOutConfirmationDesc = "Votre connexion au serveur est inactive, et sera bient&ocirc;t termin&eacute;e.";
localizations.AutoLogOutButtonText = "Activer la connexion";
localizations.AutoLogOutMsg = "Votre connexion au serveur est échu à cause d'inactivit&eacute;";
localizations.AutoLogOutLoginButtonText = "Établir une nouvelle connexion..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Nom";
localizations.TreeviewHeaderPathText = "Chemin";
localizations.TreeviewHeaderSizeText = "Grandeur";
localizations.TreeviewHeaderModifiedText = "Date de Modification";
localizations.TreeviewHeaderKeywordsText = "Mots cl&eacute;s";
//Selection menu items
localizations.SelectItemOptionLinkText = "Choisir";
localizations.SelectCheckboxContextMenuToggleText = "Basculer";
localizations.SelectCheckboxContextMenuCheckAllText = "Tous";
localizations.SelectCheckboxContextMenuUncheckAllText = "Aucun";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Tous les fichiers";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Tous les r&eacute;pertoires.";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Ce qui commence par un \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Modifi&eacute; aujourd&rsquo;hui";
localizations.SelectCheckboxContextMenuCheckWeekText = "Modifi&eacute; cette semaine";
localizations.SelectCheckboxContextMenuCheckMonthText = "Modifi&eacute; ce mois-ci";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Modifi&eacute; depuis 60 jours";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Modifi&eacute; depuis 90 jours";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Afficher {0} items par page";
localizations.pagingSizeAllText = "Tous (peut &ecirc;tre lent)";
//Webinterface labels
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Choisir les items &agrave; t&eacute;l&eacute;verser au serveur...";
localizations.advancedDownloadPathSelectionWindowTitle = "Choisir le chemin d&rsquo;acc&egrave;s o&ugrave; vous voulez t&eacute;l&eacute;charger les fichiers du serveur...";
localizations.advancedOperationsDownloadStatus = "En t&eacute;l&eacute;chargement du serveur";
localizations.advancedOperationsUploadStatus = "En t&eacute;l&eacute;versement vers le serveur";

localizations.maxAllowedDownloadSizeReached = "La grosseur du t&eacute;l&eacute;chargement d&eacute;passe la limite permise"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "La grosseur maximale de t&eacute;l&eacute;chargement permise &agrave; partir du serveur est de {size}. <br />Utilisez le mode de t&eacute;l&eacute;chargement avanc&eacute;, ou ajoutez les fichiers au panier."; //Text of growl to display when download reaches maximum allowed size
//Audio player
localizations.AudioPlayerPlayText = "Jouer";
localizations.AudioPlayerPauseText = "Pause";
localizations.AudioPlayerStopText = "Arrêter";
localizations.AudioPlayerMuteText = "Sourdine";
localizations.AudioPlayerUnmuteText = "Réactiver";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Changer l&rsquo;ic&ocirc;ne ";
localizations.ChangeIconWindowInstructionsText = "Choisissez une petite image pour repr&eacute;senter cet item:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Fichier choisi : ";
localizations.ChangeIconWindowCancelLinkText = "Annuler";
localizations.ChangeIconWindowUpdateLinkText = "Sauvegarder";
localizations.ChangeIconFileSelectAlertText = "Choisissez une image pour continuer.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "La d&eacute;compression (Unzip) a commenc&eacute;";
localizations.UnzipStartedAlertDescText = "La d&eacute;compression (Unzip) a commenc&eacute; pour les fichiers que vous avez choisis";
localizations.UnzipCompletedAlertTitleText = "La d&eacute;compression (Unzip) est termin&eacute;e";
localizations.UnzipCompletedAlertDescText = "La d&eacute;compression (Unzip) des fichiers choisis est termin&eacute;e";

//zip operation
localizations.ZipStartedAlertTitleText = "La compression (Zip) a commenc&eacute;";
localizations.ZipStartedAlertDescText = "La compression (Zip) a commenc&eacute; pour les fichiers que vous avez choisis";
localizations.ZipCompletedAlertTitleText = "La compression (Zip) est termin&eacute;e";
localizations.ZipCompletedAlertDescText = "La compression (Zip) des fichiers choisis est termin&eacute;e";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Vous avez compl&eacute;t&eacute; votre inscription : ";
localizations.RegisterWindowProcessCompleteMessage = "Vous pourrez vous authentifier en utilisant votre code d&rsquo;usager lorsqu&rsquo'il aura &eacute;t&eacute; activ&eacute; par l&rsquo;administrateur.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Voici quelques raisons qui m&egrave;nent &agrave; un &eacute;chec lors de l&rsquo;inscription: </strong><br><br>- Le code d&rsquo;usage est d&eacute;j&agrave; utilis&eacute;. <br> - Le serveur ne permet pas les inscriptions pour le moment.  <br><br> Vous pouvez essayer de nouveau, ou rejoindre le support &agrave; la client&egravele.";

//Data size format items
localizations.dataByClassFormatBytes = "octet(s)";
localizations.dataByClassFormatKiloBytes = "Ko";
localizations.dataByClassFormatMegaBytes = "Mo";
localizations.dataByClassFormatGigaBytes = "Go";
localizations.dataByClassFormatTeraBytes = "To";

localizations.loadingIndicatorText = "Un moment svp...";

localizations.bytesSentLabelTextByClass = "Envoyé :";
localizations.bytesReceivedLabelTextByClass = "Reçu :";
localizations.dirInfoDownloadLabelTextByClass = "Télécharger : ";
localizations.dirInfoUploadLabelTextByClass = "Téléverser : ";
localizations.maxAndAvailableAmountLabelTextByClass = "Disponible/Max :";
localizations.maxAmountPerDayLabelTextByClass = "Par Jour :";
localizations.quotaAvailableTextByClass = "disponible";
localizations.maxAmountPerMonthLabelTextByClass = "Par Mois :";

//Server message localized
localizations.share_complete = "L&rsquo;op&eacute;ration de publication est termin&eacute;e.";
localizations.share_email_sent = "Un courriel a &eacute;t&eacute; &eacute;mis.";
localizations.share_open_in_email_client = "Ouvrir avec votre logiciel de courriel";
localizations.email_failed = "<div class='errorMessage'>L&rsquo;envoi du courriel a &eacute;chou&eacute;.  V&eacute;rifiez le journal du serveur..</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Le chargement du formulaire a &eacute;chou&eacute; : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "Erreur: Acc&egrave;s refus&eacute;. (Vous n&rsquo;avez pas les droits requis, le nom du fichier et/ou son suffixe ne sont pas accept&eacute;s.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "Erreur:550 Erreur: Le contenu du fichier n&rsquo;est pas accept&eacute;.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "Erreur: Le fichier existe d&eacute;j&agrave; vous ne pouvez pas l&rsquo;&eacute;craser!";

localizations.CustomEventCallSuccessTitle = "Succès";
localizations.CustomEventCallSuccessDesc = "Exécution de l'événement";
localizations.CustomEventCallFailureTitle = "Échec";
localizations.CustomEventCallFailureDesc = "Erreur détectée pendant le traitement de l'événement";
//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Options avancées";
localizations.advancedDownloadOptionsButtonText = "Options de téléchargement avancées";
localizations.advancedUploadOptionsDialogSaveButtonText = "Sauvegarder";
localizations.advancedUploadOptionsItemAvailableLabel = "Lorsque le fichier existe déjà :";
localizations.advancedUploadOptionsUseCompressionLabel = "Utiliser la compression :";
localizations.advancedUploadOptionsAskActionDialogTitle = "Confirmer vos choix";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Confirmer vos choix pour le fichier :";
localizations.advancedUploadOptionsAskActionLabelByClass = "Choix :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Remplacer";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Remplacer tous";
localizations.advancedUploadActionResumeSelectOptionText = "Reprendre";
localizations.advancedUploadActionResumeAllSelectOptionText = "Reprendre pour tous";
localizations.advancedUploadActionSkipSelectOptionText = "Sauter";
localizations.advancedUploadActionSkilAllSelectOptionText = "Souter tous";
localizations.advancedUploadActionAskSelectOptionText = "Confirmer";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Oui";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Non";

localizations.LoggedInAsLabelText = "Code d&rsquo;usager : ";
localizations.AccountExpiresOnLabelText = "Expire : ";

localizations.ResetUserNameText = "Code d&rsquo;usager";
localizations.ResetPasswordButtonText = "R&eacute;-initialiser";
localizations.BackToLoginButtonText = "Retour &agrave; l&rsquo;authentification";
localizations.ValidUserNameAlertText = "SVP entrer un nom d&rsquo;usager valide";
localizations.RequestPasswordHeaderText = "Demande de mot de passe";
localizations.serverNotConfiguredForEmailError = "Ce serveur n&rsquo;est pas configur&eacute; pour envoyer des rappels par courriel.";
localizations.RecaptchaValidationRequiredText = "SVP valider le captcha pour vous authentifier";
localizations.InvalidPasswordCharacterMsgText = "Le mot de passe contient des caract&egrave;res invalides. SVP retirer les caract&egrave;res. Caract&egrave;res invalides ";
localizations.CookiePolicyNotificationText = "Nous utilisons des cookies sur ce site pour faciliter votre authentification pour des raisons techniques.";
localizations.CookiePolicyLinkText = "Politique des t&eacute;moins";
localizations.CookiePolicyAcceptButtonText = "Accepter";
localizations.CookiePolicyDismissButtonText = "Rejeter";
localizations.readOnlyFolderBannerText = "Ce dossier est en lecture seule.";
localizations.ShareWindowExpiresInDaysValidationErrorText = "Le nombre de jours d&rsquo;expiration ne peut &ecirc;tre plus de {days} jours";
localizations.ShareWindowAlternateTempAccountLabelText = "Alternate TempAccount :";
localizations.ShareLinkCopyToClipboardText = "Copier le lien dans le presse-papier";
localizations.ShareLinkCopiedToClipboardText = "Lien copi&eacute; dans le presse-papier";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "Le partage interne n&rsquo;accepte pas d&rsquo;adresse courriel, SVP utiliser le nom d&rsquo;usager";
//New upload bar localizations
localizations.UserOptionsWindowDisableWaveformLabelText = "D&eacute;sactiver la lecture audio en-ligne";
localizations.UploadFormHeaderText = "D&eacute;tails du t&eacute;l&eacute;versement";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Annuler";
localizations.ManageShareWindowEditDialogTitle = "&Eacute;dition du Partage";
localizations.ManageShareWindowShareDetailsDialogTitle = "D&eacute;tails du Partage";
localizations.AudioPlayerDownloadText = "T&Eacute;l&Eacute;charger";
localizations.bytesAvailableLabelTextByClass = "Disponible:";
localizations.ratioTextByClass = "Ratio:";
localizations.ProblemEventCallSuccessTitle = "Succ&egrave;s";
localizations.ProblemEventCallSuccessDesc = "Probl&egrave;me rapport&eacute;";
localizations.ProblemEventCallFailureTitle = "&Eacute;chec";
localizations.ProblemEventCallFailureDesc = "Probl&egrave;me encouru lors de la soumission du probl&egrave;me";
localizations.MaxUploadFilesCountReachedGrowlText = "Quantit&eacute; maximum de fichiers d&eacute;pass&eacute;";
localizations.MaxUploadFilesCountReachedGrowlDesc = "Quantit&eacute; maximum de fichiers &agrave; t&eacute;l&eacute;verser atteinte, le maximum permis est:";
localizations.OTPDialogHeaderText = "Entrer votre OTP ici";
localizations.maxListItemsWarningMessage = "Une large liste de r&eacute;pertoire cause un probl&egrave;me significatif de performance. Nous sugg&eacute;rons de subdiviser en sous-dossiers pour r&eacute;duire les cas";

if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(Session timeout in %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "SVP attendre...",
    playSlideshow : "Jouer Diaporama",
    pauseSlideshow : "Pause Diaporama",
    refresh : "Rafra&icirc;chir",
    fullscreen : "Plein &eacute;cran",
    download : "T&eacute;l&eacute;charger",
    upload : "T&eacute;l&eacute;verser",
    deleteText : "Supprimer",
    rotateClockwise : "Rotation Horaire",
    rotateCounterClockwise : "Rotation Anti-Horaire",
    previousItem : "Item Pr&eacute;c&eacute;dent",
    nextItem : "Prochain Item",
    delayText : "(Delai {x} secondes)",
    nextPageText : "Prochain &rsaquo;",
    prevPageText : "&lsaquo; Pr&eacute;c&eacute;dent",
    itemCountText : "(Item {x} de {y})",
    noItemMessage : "<h3 style='text-align:center;'>Aucun item disponible, ou probl&egrave;me de r&eacute;cup&eacute;ration de records.</h3>"
};

/*Date picker language translation*/
/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au),
Stéphane Nahmani (sholby@sholby.net),
Stéphane Raimbault <stephane.raimbault@gmail.com> */
(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define([ "../jquery.ui.datepicker" ], factory );
    } else {
        // Browser globals
        factory( jQuery.datepicker );
    }
}(function( datepicker ) {
    datepicker.regional['fr'] = {
        closeText: 'Fermer',
        prevText: 'Précédent',
        nextText: 'Suivant',
        currentText: 'Aujourd\'hui',
        monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        monthNamesShort: ['jan', 'fév', 'mar', 'avr', 'mai', 'juin',
            'juil', 'août', 'sep', 'oct', 'nov', 'déc'],
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
        dayNamesMin: ['D','L','M','M','J','V','S'],
        weekHeader: 'Sem.',
        dateFormat: 'yyyy-mm-dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    datepicker.setDefaults(datepicker.regional['fr']);
    return datepicker.regional['fr'];
}));

if($.sessionChecker)
    $.sessionChecker.defaultOptions.noteTextTemplate = "(La session expire dans %time%.)";


/* Upload panel */
localizations.uploadPanel = {
    uploadWindowTitle : "Fichiers à téléverser",
    filesToUploadQueueWindowHeader : "Liste de fichiers à téléverser au serveur.",
    dragDropMsg : "Déposer les fichiers ici pour les téléverser au serveur.",
    remove : "Supprimer",
    removeAllSelected : "Les sélections",
    removeAllWithError : "En erreur",
    removeAllUploaded : "Les fichiers téléversés",
    removeAllCancelled : "Téléversements annulés",
    removeAllSkipped : "Les fichiers ignorés",
    removeAll : "Tous",
    addFiles : "Ajouter...",
    upload : "Téléverser",
    uploadSelected : "Téléverser les sélections",
    reuploadAll : "Tout téléverser",
    cancel : "Annuler",
    uploadDetails : "Détail du téléversement.",
    overwriteAll : "Tout écraser",
    resumeAll : "Tout reprendre",
    shareUploaded : "Partager le téléversement",
    quickFilterSubtext : "Filtre...",
    total : " ",
    filesFailed : "fichier(s) a(ont) échoué(s). Cliquer pour le détail.",
    selectedFiles : "Fichier(s) sélectionné(s) :",
    size : "Grandeur :",
    filtered : "(Filtré)",
    filter : "Filtre",
    totalFiles : "Nombre de fichiers :",
    scrollWithActivity : "faites défiler avec l'activité",
    writingFile : "Écriture du fichier...",
    pleaseWait : "En traitement...",
    uploadedIn : "Téléverser en",
    aMoment: "moins d'une secondes",
    atAvgSpeedOf : "à une vitesse moyenne de",
    uploadingFailed : "Le téléversement a échoué",
    canceled : "Annulé",
    skipped : "ignoré",
    currentSpeed : "Vitesse actuelle :",
    averageSpeed : "Vitesse moyenne :",
    "of" : "de",
    elapsed : "Écoulé",
    remaining : "Restant",
    waiting : "En attente..",
    details : "Détails",
    overwrite : "Remplacer",
    resume : "Relancer",
    reupload : "Téléverser de nouveau",
    pause : "Suspendre",
    paused : "Suspendu",
    uploading : "En téléversement",
    items : "item(s)",
    skip : "ignoré",
    cancelAll : "Tout annuler",
    OK : 'Oui',
    CANCEL : 'Non',
    CONFIRM : "Oui",
    reuploadConfirmation : "Ceci va reprendre le téléversement de tous les fichiers qui ont déjà été téléversés, annulés, ignoré, ou qui ont échoués, durant le téléversement, et écrasera tous les fichiers qui existent déjà.  Êtes-vous certain de vouloir continuer?",
    folderUploadNotSupported : "Le téléversement de répertoires n'est pas supporté par ce fureteur.",
    fileAlreadySelected : "Ce fichier a déjà été sélectionné.",
    fileExistsOnServer : "Ce fichier existe déjà sur le serveur.",
    fileSizeExceed : "La taille de ce fichier dépasses la taille maximale pour le téléversement.",
    fileTypeNotAllowed : "Le téléversement de ce type de fichier n'est pas permis.",
    filterApplied : "Le filtre est en fonction",
    noMatchingItemAvailable : "Aucun fichiers ne correspondent au critère de sélection.",
    addFilesToUpload : "Ajouter les fichiers à téléverser...",
    file : "Fichier",
    reason : "Cause",
    failedItems : "Items qui ont échoué",
    ignoreAll : "Tout ignorer",
    retryAll : "Tout reprendre",
    failedOpeningFile : "Échec lors de l'ouverture du fichier.",
    cancelConfirmation : "Voulez-vous vraiment annuler le téléversement?",
    failedClosingFile : "Échec lors de la fermeture du fichier, le nom ne doit pas contenirs d'espace ou de caractères spéciaux.",
    failedWileRetryingChunk : "Échec lors de la reprise du fragment de téléversement.",
    retryingFile : "Reprise du téléversement du fichier",
    "in" : "Dans",
    seconds : "seconde(s)",
    skipFile : "Ignoré le fichier",
    retryNow : "Réessayer maintenant",
    retryingClosingFile : "Réessayer la fermeture du fichier",
    fileExistConfirmation : "Le fichier [1] de la même grandeur existe, voulez-vous le téléversé de nouveau?",
    bigFileOverwriteConfirmation : "Le fichier [1] qui existe sur le serveur est plus grand que celui que vous voulez téléverser, voulez-vous le remplacer?",
    fileExistsOnServerConfirmation : "Le fichier [1] existe déjà sur le serveur",
    fileActionTitle : "Choisissez l'action à prendre pour ce fichier.",
    applyToAll : "Appliquer mon choix pour tous",
    retryingOpeningFile : "Reprise de l'ouverture du fichier",
    secondsAbbr : "secondes",
    minutesAbbr : "minutes",
    hoursAbbr : "heures"
};