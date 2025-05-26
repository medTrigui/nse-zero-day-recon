//Português Brasileiro
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP WebInterface :: Login";
localizations.BadLoginInfoText = "Seu nome de usuário, senha ou conta podem estar incorretos, ou a conta pode ter expirado.";
localizations.ServerErrorInfoText = "O servidor não está disponível ou seu IP foi bloqueado.";
localizations.PasswordsDoNotMatchAlertText = "As novas senhas não coincidem.";
localizations.LoginAgainTitleText = "Faça login novamente";
localizations.LoginWithNewPassText = "Faça login com a nova senha";
localizations.AuthenticatingMsgText = "Autenticando...";
localizations.LoginSuccessText = "Sucesso";
localizations.LoadingWebInterfaceText = "Carregando WebInterface...";
localizations.LoginWarningText = "Aviso";
localizations.MultipleBadLoginsAlertDescText = "Muitas tentativas falhadas e seu IP será bloqueado.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>Clique <a style='color:white;' href='/WebInterface/jQuery/reset.html'>aqui</a> para redefinir a senha.</div>";
localizations.LoginFailedText = "Falha no login";
localizations.ChangePasswordGrowlTitleText = "Alterar senha";
localizations.UserNameText = "Nome de usuário";
localizations.ResetUserNameText = "Nome de usuário";
localizations.PasswordText = "Senha";
localizations.RememberMeText = "Lembrar de mim";
localizations.LoginButtonText = "Entrar";
localizations.ForgotPasswordLinkText = "Esqueci minha senha";
localizations.ResetPasswordButtonText = "Redefinir senha";
localizations.BackToLoginButtonText = "Voltar ao login";
localizations.ValidUserNameAlertText = "Por favor, digite um nome de usuário válido";
localizations.RequestPasswordHeaderText = "Solicitar senha";
localizations.ChangePasswordHeaderText = "Alterar sua senha";
localizations.ChangePasswordNoteText = "Você precisa alterar sua senha para continuar";
localizations.CurrentPasswordText = "Senha atual : ";
localizations.NewPasswordText = "Nova senha : ";
localizations.ConfirmPasswordText = "Confirmar senha : ";
localizations.CancelButtonText = "Cancelar";
localizations.ChanngePasswordButtonText = "Alterar senha";
localizations.GeneratePasswordButtonText = "Gerar senha";
localizations.GeneratePasswordUseButtonText = "Usar esta";
localizations.GeneratePasswordCancelButtonText = "Cancelar";
localizations.OldBrowserNoticeHTMLAsText = 'Seu navegador está desatualizado, foi lançado há quase uma década! Como resultado, é muito lento, cheio de bugs e esta WebInterface pode ou não funcionar com o IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Prosseguir de qualquer maneira com cautela</button> ou obtenha um navegador melhor:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "Este servidor não está configurado para enviar lembretes de senha por e-mail.";
localizations.RecaptchaValidationRequiredText = "Valide o captcha para fazer login";
localizations.UserOptionsWindowUpdateButtonText = "Salvar";
localizations.InvalidPasswordCharacterMsgText = "A senha possui caracteres inválidos. Remova-os da senha. Caracteres inválidos ";
localizations.CookiePolicyNotificationText = "Usamos cookies neste site para facilitar o login por motivos técnicos.";
localizations.CookiePolicyLinkText = "Política de Cookies";
localizations.CookiePolicyAcceptButtonText = "Aceitar";
localizations.CookiePolicyDismissButtonText = "Fechar";
/*Reset pass page specific*/
localizations.resetPageUserName = "Nome de usuário ou e-mail : ";
localizations.resetPagePassword = "Senha : ";
localizations.resetPagePasswordConfirm = "Confirmar senha : ";
localizations.resetPageSubmit = "Enviar";
localizations.resetPageLoginPage = "Página de login";
localizations.resetPageStartOver = "Recomeçar";

localizations.passwordRequirementsMessages = {
  errorTitle: "Erro: \r\n",
  msgSeparator: "\r\n",
  chars: "A senha deve ter pelo menos $$ caracteres.",
  numericChars: "A senha deve conter pelo menos $$ caracteres numéricos.",
  lowerCase: "A senha deve conter pelo menos $$ caracteres minúsculos.",
  upperCase: "A senha deve conter pelo menos $$ caracteres maiúsculos.",
  specialCase: "A senha deve conter pelo menos $$ caracteres especiais.",
  unsafeChars: "A senha não pode conter caracteres inválidos para URL: $$",
  recentPass: "A senha não pode ser uma de suas senhas recentes.",
  notAllowedErrorMsg: "Não permitido"
};

localizations.ItemsPerPageText = "Itens para mostrar por página : ";
localizations.LayoutChangeLabelText = "Layout : ";

/*File uploading specific*/
window.locale = {
  "fileupload": {
    "errors": {
      "maxFileSize": "Arquivo muito grande",
      "minFileSize": "Arquivo muito pequeno",
      "acceptFileTypes": "Tipo de arquivo não permitido",
      "maxNumberOfFiles": "Número máximo de arquivos excedido",
      "uploadedBytes": "Bytes enviados excedem o tamanho do arquivo",
      "emptyResult": "Resultado do envio vazio",
      "fileAvailableInSelectedFolder": "Arquivo já adicionado para upload na mesma pasta",
      "hasReachedQuota": "O tamanho do arquivo é maior que sua cota",
      "fileExistOnServer": "Arquivo existe no servidor",
      "fileBiggerThanAllowed": "Arquivo é maior que o tamanho permitido",
      "dirNoWritable": "Você não pode enviar para este diretório",
      "blockUploadingDirs": "O upload para este diretório não é permitido",
      "true": "verdadeiro"
    },
    "error": "Erro",
    "start": "Iniciar",
    "waiting": "Aguardando...",
    "uploading": "Enviando : ",
    "reupload": "Enviar Novamente",
    "share": "Compartilhar",
    "cancel": "Cancelar",
    "destroy": "Excluir",
    "overwrite": "Substituir",
    "uploadTo": "Enviar para : ",
    "pause": "Pausar",
    "errorLabel": "Erro : ",
    "details": "Detalhes",
    "uploadedInLabelText": "Enviado em : ",
    "atAvgSpeedOfLabelText": "à Velocidade Média de : ",
    "uploadCompletedText": "Envio Concluído",
    "uploadedFileText": "Arquivo enviado ao servidor",
    "uploadedMultipleFilesText": "Todos os arquivos enviados."
  }
};

localizations.buttons = {
  "admin": "Admin",
  "delete": "Excluir",
  "rename": "Renomear",
  "download": "Baixar",
  "advanced download": "Download Avançado",
  "zipdownload": "Download em ZIP",
  "unzip": "Descompactar",
  "zip selected": "Compactar Selecionados",
  "explore zip contents": "Explorar conteúdo do ZIP",
  "create folder": "Criar Pasta",
  "upload": "Enviar",
  "search": "Buscar",
  "user options": "Opções do Usuário",
  "cut": "Recortar",
  "copy": "Copiar",
  "paste": "Colar",
  "slideshow": "Slideshow",
  "quickview": "Visualização Rápida",
  "download low-res": "Baixar Baixa Resolução",
  "preview": "Pré-visualizar",
  "batchcomplete": "Processamento em Lote",
  "share": "Compartilhar",
  "quick share": "Compartilhamento Rápido",
  "manage shares": "Gerenciar Compartilhamentos",
  "show basket": "Mostrar Cesta",
  "add to basket": "Adicionar à Cesta",
  "edit keywords": "Editar Palavras-chave",
  "change icon": "Alterar Ícone",
  "download crushtunnel": "Baixar CrushTunnel",
  "help": "Ajuda",
  "login": "Entrar",
  "logout": "Sair",
  "download sync app": "Baixar Aplicativo de Sincronização",
  "download crushftpdrive": "Baixar CrushFTPDrive",
  "sync manager": "Gerenciador de Sincronização"
};


localizations.currentLanguageName = "English"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "English";
localizations.languageNamePortuguese = "Portuguese (Português)";
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

// WebInterface
localizations.refreshListingButtonTooltipText = "Atualizar";
localizations.FilterText = localizations.FilterTextBasket = "Filtro:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "Limpar";
localizations.FileCounterItemsText = "Itens";
localizations.FileCounterFoldersText = "Pastas";
localizations.FileCounterFilesText = "Arquivos";
localizations.FileCounterHiddenItemsText = "Itens Ocultos";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "Visualização em miniatura";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "Visualização em árvore";
localizations.DownloadResumeTextLabelBasket = "Retomar";
localizations.BackToTopLinkText = "Voltar ao topo";
localizations.FilesNotAvailableMessage = "Nenhum arquivo disponível";
localizations.CopyNoFilesSelectedMessage = "Selecione arquivos/pastas para copiar";
localizations.CopyOnlyFilesMessage = "Você só pode cortar/copiar arquivos, as pastas selecionadas serão ignoradas";
localizations.DeleteNoFilesSelectedMessage = "Selecione arquivos/pastas para excluir";
localizations.UnzipNoFilesSelectedMessage = "Selecione o arquivo para descompactar";
localizations.ZipExploreNoFilesSelectedMessage = "Selecione o zip para explorar";
localizations.CutNoFilesSelectedMessage = "Selecione arquivos/pastas para recortar";
localizations.pagingPrevText = "Anterior";
localizations.pagingNextText = "Próximo";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(Itens com a frase \"{filterVal}\" : {totalItems} , Pastas: {folders} Arquivos: {files})";
localizations.TotalItemsInDirMsgText = " (Total de itens no diretório {count}) ";
localizations.CurrentFileSizeText = " (Tamanho total dos arquivos na lista {size}) ";
localizations.TotalItemsInDirInlineText = " ({count} itens) ";
localizations.quotaAvailableLabelText = "disponível";

localizations.WelcomeNoteSubmitFormFailureMsgText = "Erro: Problema ao salvar dados";
localizations.TreeviewSpecificActionMsgTitleText = "Somente para visualização em árvore";
localizations.TreeviewSpecificActionMsgDescText = "Esta ação é específica para a visualização em árvore";
localizations.PasswordExpiringMsgText = "Senha expirando em breve<br/>Use o botão Opções do Usuário para alterar.";
localizations.PasswordNotMatchingMsgText = "Novas senhas não coincidem.";
localizations.PasswordMustBeComplexMsgText = "A senha deve ser mais complexa.";
localizations.PasswordChangedMsgText = "Senha alterada. Faça login usando a nova senha.";
localizations.AppletLoadingFailedMsgText = "O applet falhou durante o envio";
localizations.DownloadStartedAlertTitleText = "Download iniciado";
localizations.DownloadCompletedText = "[Download Concluído]";
localizations.DownloadCompletedPathText = " Baixado para: ";
localizations.DownloadStartedAlertDescText = "Selecione o local para salvar seu(s) arquivo(s) para prosseguir";
localizations.LogoutButtonText = "Sair";
localizations.browserUploaderNativeUploadTipSetTitle = "Envie arquivos usando o uploader do navegador.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "Envie arquivos usando o uploader avançado, <br>ele permite pastas e pode acelerar a transferência.";
localizations.browserUploaderDragDropHoverLabelText = "Solte os arquivos aqui para enviar";
localizations.readOnlyFolderBannerText = "Esta pasta é somente leitura.";
localizations.appletUploaderDropPanelLabelText = "&darr; Solte os arquivos aqui para enviar &darr;";
localizations.browserUploaderDragDropLabelText = "Arraste e solte os arquivos aqui para enviar";
localizations.browserUploaderChromeDragDropLabelText = "Arraste e solte arquivos e pastas aqui para enviar";
localizations.advancedUploadOptionsDialogSaveButtonText = "Salvar";
localizations.advancedUploadOptionsDialogCancelButtonText = "Cancelar";

// Sharing Window
localizations.ShareWindowHeaderText = "Compartilhando Arquivos";
localizations.ShareWindowFilesSharingLabelText = "Compartilhando:";
localizations.ShareWindowShareTypeLabelText = "Tipo de Compartilhamento:";
localizations.ShareWindowShareTypeLabelCopyText = "Copiar";
localizations.ShareWindowShareTypeLabelMoveText = "Mover";
localizations.ShareWindowShareTypeLabelReferenceText = "Referência";
localizations.ShareWindowShareToInternalUserLabelText = "Compartilhamento Interno";
localizations.ShareWindowShareToExternalUserLabelText = "Compartilhamento Externo";
localizations.ShareWindowDownloadLabelText = "Download";
localizations.ShareWindowExpiresInDaysLabelText = "Dias";
localizations.ShareWindowExpiresInDaysValidationErrorText = "Dias de expiração não podem ser mais que {days} dias";
localizations.ShareWindowMaxUsesLabelText = "Número máximo de usos:";
localizations.ShareWindowUploadLabelText = "Enviar";
localizations.ShareWindowDeleteLabelText = "Excluir";
localizations.ShareWindowSendEmailLabelText = "Enviar Email:";
localizations.ShareWindowDirectLinkLabelText = "Link direto para o arquivo?";
localizations.ShareWindowExpiresLabelText = "Expira:";
localizations.ShareWindowFromLabelText = "De: ";
localizations.ShareWindowToLabelText = "Para: ";
localizations.ShareWindowCCLabelText = "CC: ";
localizations.ShareWindowBCCLabelText = "BCC: ";
localizations.ShareWindowReplyToLabelText = "Responder Para: ";
localizations.ShareWindowSubjectLabelText = "Assunto: ";
localizations.ShareWindowBodyLabelText = "Corpo: ";
localizations.ShareWindowAdvancedLabelText = "Avançado";
localizations.ShareWindowAttachThumbsLabelText = "Anexar Miniatura";
localizations.ShareWindowAttachFileLabelText = "Anexar Arquivos";
localizations.ShareWindowCommentsLabelText = "Comentários: ";
localizations.ShareWindowKeywordsLabelText = "Palavras-chave: ";
localizations.ShareWindowAccessLabelText = "Acesso Total ";
localizations.ShareWindowSendButtonText = "Enviar";
localizations.ShareWindowAlternateTempAccountLabelText = "Conta Temporária Alternativa:";
localizations.ShareWindowCancelButtonText = "Cancelar";
localizations.ShareWindowUsernameMethodLabelText = "Método de Compartilhamento: ";
localizations.ShareWindowUsernameLabelText = "Compartilhar com Usuário Interno";
localizations.ShareWindowUsernamesLabelText = "Nomes de Usuário: ";
localizations.ShareWindowUsernamesLabelHelpText = "(Separe múltiplos nomes de usuário com vírgulas.)";
localizations.ShareActionCompleteShareUsernamesText = "Os seguintes usuários agora têm acesso aos itens compartilhados.";
localizations.ShareActionCompleteUsernameText = "Nome de Usuário: ";
localizations.ShareActionCompletePasswordText = "Senha: ";
localizations.ShareActionCompleteLinkText = "Link";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "Por favor, digite um endereço de email válido. Você pode digitar múltiplos endereços de email ao mesmo tempo, separados por vírgula. Ex.: <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "Item Inválido";
localizations.SharFoldersCantBeSharedGrowlText = "Pastas não podem ser compartilhadas";
localizations.SharFilesCantBeSharedGrowlText = "Arquivos não podem ser compartilhados";
localizations.ShareLinkCopyToClipboardText = "Copiar link para a área de transferência";
localizations.ShareLinkCopiedToClipboardText = "Link copiado para a área de transferência";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "Compartilhamento interno não aceita endereço de email, por favor use nome de usuário";
// Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copiar link direto.";
localizations.CopyLinkText = "Copiar link";
// Create folder window
localizations.CreateFolderWindowHeaderText = "Criar nova pasta.";
localizations.CreateFolderInputDefaultFolderName = "Nova Pasta";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "Navegar para a pasta após a criação";
localizations.CreateFolderButtonText = "Criar";
// Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "Enviar arquivo";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "Detalhes do Envio";
localizations.BrowserUploaderUploadFilesTabHeaderText = "Enviar Arquivos";
localizations.BrowserUploaderAdvancedBrowseButtonText = "Navegação Avançada...";
localizations.BrowserUploaderStartUploadingLinkText = "Iniciar Envio";
localizations.BrowserUploaderClearCompletedLinkText = "Limpar Concluídos";
localizations.BrowserUploaderResumeCheckboxText = "Retomar";
localizations.BrowserUploaderFormResetButtonText = "Redefinir";
localizations.BrowserUploaderFormNextButtonText = "Próximo";
localizations.BrowserUploaderFileAddedAlreadyText = "Este arquivo já foi adicionado.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} já foi adicionado.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "Esses arquivos já foram adicionados.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} já foram adicionados.";
localizations.BrowserUploaderSelectedFilesGroupText = "Grupo de Arquivos: ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "Remover";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "Será enviado para";
localizations.BrowserUploaderSelectedFileOverwriteText = "Substituir";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "será substituído";
localizations.BrowserUploaderSelectedFileExistsText = "Arquivo existe";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "Atenção Requerida";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "Ignorar";
localizations.BrowserUploaderSelectedFileDoneText = "Concluído";
localizations.BrowserUploaderSelectedFileUploadedText = "Enviado para";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "reenviar";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "rebaixar";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Dispensar";
localizations.BrowserUploaderSelectedFileCancelLinkText = "Cancelar";
localizations.BrowserUploaderSelectedFilePauseLinkText = "Pausar";
localizations.BrowserUploaderSelectedFilePausedStatusText = "Pausado";
localizations.BrowserUploaderSelectedFileResumeLinkText = "Retomar";
localizations.BrowserUploaderAdvancedUploadingFilesText = "Total de {0} Arquivo(s)";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} de {1} item(ns)";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "Enviando para: ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "Velocidade Atual: ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "Velocidade Média: ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> Tempo: Decorrido: <span class='elapsed'>{0}</span> <span class='remained'>, Restante: {1}</span></div>";
localizations.BatchCompleteText = "Resultado";
localizations.BatchComplete = "Transferências Confirmadas.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "Calculando...";
localizations.BrowserUploaderProblemWhileTransferMsgText = "Problema durante a transferência";
localizations.BrowserUploaderCancelledUploadMsgText = "Envio cancelado";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "Seus arquivos estão sendo enviados no momento. Se você sair desta página, irá perdê-los. Tem certeza de que deseja sair desta página?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "Seus arquivos estão sendo baixados no momento. Se você sair desta página, irá perdê-los. Tem certeza de que deseja sair desta página?";
localizations.NoUploadInDirGrowlText = "Envio não permitido";
localizations.NoUploadInDirGrowlDesc = "Não é permitido enviar itens para o diretório selecionado";
localizations.AdvancedUploadDirNotAllowedText = "Envio de diretório não permitido";
localizations.AdvancedUploadDirNotAllowedDescText = "Diretórios não podem ser enviados, selecione apenas arquivos";
localizations.uploadConfirmCancelUploadText = "Tem certeza de que deseja cancelar este envio?";
localizations.uploadConfirmCancelUploadAfterFormText = "Tem certeza de que deseja cancelar o envio dos últimos {count} item(ns) selecionados?";

//New upload bar localizations
localizations.browseFileLabelByClass = "Adicionar arquivos...";
localizations.advancedUploadResumeLabelByClass = "Retomar";
localizations.filesToUploadQueueWindowHeader = "Arquivos para enviar";
localizations.uploadWindowStartUploadingByClass = "Iniciar Envio";
localizations.uploadWindowCancelUploadingByClass = "Cancelar Envio";
localizations.uploadWindowShowCommonUploadFormByClass = "Detalhes";
localizations.uploadWindowClearUploadedByClass = "Limpar enviados";
localizations.uploadWindowOverwriteAllByClass = "Substituir todos";
localizations.uploadWindowRemoveAllWithErrorsByClass = "Remover todos com erros";
localizations.uploadWindowSummaryFilesByClass = "Arquivos: ";
localizations.uploadWindowSummarySizeByClass = ", Tamanho do envio: ";
localizations.uploadBarShowHideFilesSetTitleClass = "Mostrar/Ocultar painel de envio";
localizations.uploadBarAttentionTitle = "Agora adicione arquivos da barra de envio";
localizations.uploadBarAttentionText = "Use a barra de envio para adicionar arquivos. Clique no botão \"" + localizations.browseFileLabelByClass + "\" para adicionar arquivos";
localizations.uploadBiggerFileNoticeTitleText = "Use o envio avançado para arquivos maiores";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>É recomendado usar o envio avançado para arquivos maiores, pois permite enviar arquivos facilmente e possui o recurso de <em>reinício automático</em>. <br><br> (Você pode alternar o modo de envio na Barra de Envio)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='Como alternar o modo de envio'>";

localizations.globalProgressbarSkipLabelByClass = "Pular";
localizations.globalProgressbarPauseLabelByClass = "Pausar";
localizations.globalProgressbarStopLabelByClass = "Parar";

localizations.popupOpenInSeparateWindowText = "Abrir em uma janela separada";
localizations.customFormPasswordMatchValidationFailedText = "A senha não confere";
localizations.customFormCompareValueMatchValidationFailedText = "Os valores não conferem";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
  window.locale.fileupload.SwitchToNormalUpload = "Mudar para Upload Normal";
  localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "Mudar para Upload Avançado.<div style='font-size:11px;width:500px;margin:5px 0px;'>O modo avançado irá acelerar as transferências. Ele pode retomar automaticamente se uma transferência falhar e pode enviar pastas inteiras de uma só vez. <br><br> É a maneira mais rápida de enviar arquivos.<br> (O modo avançado requer a instalação do plugin Java Applet em www.java.com.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "Busca";
localizations.SearchWindowKeywordsLabelText = "Palavras-chave: ";
localizations.SearchWindowExactLabelText = "Exato?";
localizations.SearchWindowByClassModifiedLabelText = "Modificado";
localizations.SearchWindowByClassDateFormatLabelText = "(dd/mm/aaaa) ";
localizations.SearchWindowSizeLabelByClassText = "Tamanho é ";
localizations.SearchWindowTypeLabelText = "Tipo é um";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "Iniciar Busca";
localizations.SearchWindowCancelButtonText = "Cancelar";
localizations.SearchResultDisplayText = "Resultado da Busca:";
localizations.SearchResultClearLinkText = "(Limpar Filtro de Busca)";
localizations.SearchFormModifiedOptionAfterText = "Depois";
localizations.SearchFormModifiedOptionBeforeText = "Antes";
localizations.SearchFormSizeOptionBiggerThanText = "Maior que";
localizations.SearchFormSizeOptionSmallerThanText = "Menor que";
localizations.SearchFormItemTypeOptionFileText = "Arquivo";
localizations.SearchFormItemTypeOptionFolderText = "Pasta";
localizations.SearchProcessNotificationText = "Processando... ";
localizations.SearchProcessCancelText = "Cancelar";
localizations.SearchItemsContextGoToParentText = "Ir para a Pasta Pai";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "Todos os <strong>{count}</strong> itens nesta página estão selecionados.";
localizations.ItemsSelectionSelectAllItemsInDir = "Selecionar todos os <strong>{total_items}</strong> itens em <strong>{list_type}</strong> (incluindo itens ocultos)";
localizations.ItemsSelectionSelectedAllItemsInDir = "Todos os <strong>{total_items}</strong> itens em <strong>{list_type}</strong> (incluindo itens ocultos) estão selecionados";
localizations.ItemsSelectionClearSelection = "Limpar seleção";
localizations.ItemsSelectionShowingFolderText = "Pasta Atual";
localizations.ItemsSelectionShowingFilteredItemsText = "Lista filtrada atual";
localizations.ItemsSelectionShowingSearchedItemsText = "Resultado da busca";
//User options window
localizations.UserOptionsWindowHeaderText = "Preferências";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "Ocultar itens que começam com ponto (.)";
localizations.UserOptionsWindowHideCheckboxLabelText = "Ocultar Coluna de Seleção";
localizations.UserOptionsWindowHideFilterLabelText = "Ocultar Seção de Filtro";
localizations.UserOptionsWindowAutostartUploadLabelText = "Iniciar upload automaticamente ao selecionar um arquivo para upload.";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "Carregar o applet Java ao carregar a interface.";
localizations.UserOptionsWindowDisableWaveformLabelText = "Desativar reprodução de áudio inline";
localizations.UserOptionsWindowDisableCompressionLabelText = "Desativar compressão no applet Java.";
localizations.UserOptionsWindowChangePasswordHeaderText = "Alterar sua senha";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "Senha Atual: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "Nova Senha: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "Confirmar Senha:";
localizations.UserOptionsWindowChangePasswordButtonText = "Alterar Senha";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "Gerar senha aleatória";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "Usar esta";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "Cancelar";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "Você não digitou a senha atual correta.";
localizations.ChangePasswordResetLinkExpiredText = "O link é inválido ou expirou.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Selecionar/Desmarcar";
localizations.MainCheckboxContextMenuCheckAllText = "Marcar Todos";
localizations.MainCheckboxContextMenuUncheckAllText = "Desmarcar Todos";
//Keywords window
localizations.KeywordsWindowHeaderText = "Palavras-chave";
localizations.KeywordsWindowUpdateLinkText = "Atualizar";
localizations.KeywordsWindowCancelLinkText = "Cancelar";
//File basket
localizations.BasketHeaderText = "Arquivos na cesta";
localizations.BasketClearAllLinkText = "Limpar tudo";
localizations.BasketDownloadLinkText = "Baixar cesta";
localizations.BasketDownloadAdvancedLinkText = "Download avançado da cesta";
localizations.BasketNoFilesAvailableText = "Nenhum arquivo disponível";
localizations.BasketRemoveLinkText = "Remover";
localizations.BasketTotalItemText = "{0} Itens";
localizations.BasketFileAddedAlreadyText = "Arquivo já adicionado à cesta";
localizations.BasketFileAddedAlreadyDetailsText = "O arquivo selecionado já está disponível na cesta";
localizations.BasketNothingSelectedToAddText = "Nada selecionado para adicionar à cesta";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "Tem certeza de que deseja limpar todos os arquivos selecionados na cesta?";
//Paste form panel
localizations.PasteFormHeaderText = "Colar";
localizations.PasteFormResetButtonText = "Redefinir";
localizations.PasteFormPasteButtonText = "Colar";
localizations.PasteFormErrorHeaderText = "Problema ao colar";
localizations.PasteFormErrorDetailsText = "Ocorreu um problema ao colar itens.<br />Erro: {0}";
localizations.PasteFormErrorNothingToPasteText = "Não há nada para colar";
localizations.PasteSelectDirectoryWarning = "Selecione um destino para colar os itens copiados";
localizations.PasteSelectSingleDirectoryWarning = "Selecione um único destino para colar os itens copiados";
//Welcome form panel
localizations.WelcomeFormHeaderText = "Bem-vindo";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "Detalhes do Envio";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "Cancelar";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "Slideshow";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Gerenciar Compartilhamentos";
localizations.ManageShareWindowRefreshLinkText = "Atualizar";
localizations.ManageShareWindowDeleteSelectedLinkText = "Excluir Itens Selecionados";
localizations.ManageShareWindowDeleteLinkText = "Excluir";
localizations.ManageShareWindowGridLinkLabelText = "Link";
localizations.ManageShareWindowGridFromLabelText = "De";
localizations.ManageShareWindowGridToLabelText = "Para";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "CCO";
localizations.ManageShareWindowGridReplyToLabelText = "Responder para";
localizations.ManageShareWindowGridSubjectLabelText = "Assunto";
localizations.ManageShareWindowGridBodyLabelText = "Corpo";
localizations.ManageShareWindowGridShareTypeLabelText = "Tipo de Compartilhamento";
localizations.ManageShareWindowGridUserNameLabelText = "Nome de usuário";
localizations.ManageShareWindowGridPasswordLabelText = "Senha";
localizations.ManageShareWindowGridAttachedLabelText = "Anexado no e-mail?";
localizations.ManageShareWindowGridUploadLabelText = "Envio permitido?";
localizations.ManageShareWindowGridPathsLabelText = "Caminhos";
localizations.ManageShareWindowGridCreatedLabelText = "Criado";
localizations.ManageShareWindowGridExpiresLabelText = "Expira";
localizations.ManageShareWindowGridSharedItemsLabelText = "Itens Compartilhados";
localizations.ManageShareWindowGridDownloadsLabelText = "Downloads";
localizations.ManageShareWindowNothingToShowMessageText = "Nada para exibir";
localizations.ManageShareWindowDeleteAccountConfirmationText = "Tem certeza de que deseja excluir {count} conta(s) selecionada(s)?";
localizations.ManageShareWindowFilterText = "Filtro :";
localizations.ManageShareWindowClearFilterText = "Limpar";
localizations.ManageShareWindowNextItemText = "Próximo";
localizations.ManageShareWindowPrevItemText = "Anterior";
localizations.ManageShareWindowSelectSimilarText = "Selecionar Semelhantes";
localizations.ManageShareWindowPageTitle = "CrushFTP - Gerenciar Compartilhamentos";
localizations.ManageShareWindowEditDialogTitle = "Editar Compartilhamento";
localizations.ManageShareWindowShareDetailsDialogTitle = "Detalhes do Compartilhamento";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "Renomear";
localizations.RenamePanelSaveLinkText = "Salvar";
localizations.RenamePanelCancelLinkText = "Cancelar";

localizations.ZipNameWindowHeaderText = "Nome do arquivo zip";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "Cancelar";

localizations.SyncAppNameWindowHeaderText = "Download do aplicativo de sincronização";
localizations.SyncAppDownloadYourPassText = "Sua Senha: ";
localizations.SyncAppDownloadAdminPassText = "Senha do Administrador: ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "Cancelar";

//Tooltip info
localizations.TooltipNameLabelText = "Nome";
localizations.TooltipPathLabelText = "Caminho";
localizations.TooltipSizeLabelText = "Tamanho";
localizations.TooltipModifiedLabelText = "Modificado";
localizations.TooltipKeywordsLabelText = "Palavras-chave";

//Form alerts and notifications
localizations.FormValidationFailText = "Um ou mais itens obrigatórios não foram preenchidos ou foram preenchidos incorretamente. Insira o valor adequado para os itens com * no formulário abaixo";
localizations.FormEmailValidationFailText = "<br> - Digite um endereço de e-mail válido para o(s) campo(s) de e-mail";
localizations.DeleteConfirmationMessageText = "{0} pasta(s) e {1} arquivo(s) serão excluídos.\n\nItens: {2} Uma vez excluído, não pode ser revertido.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "Todos os itens da pasta \"{folder_name}\" serão excluídos.\n\nUm total de {count} itens serão excluídos.\n\nUma vez excluído, não pode ser revertido.";
localizations.CopyActionGrowlText = "Total de {0} pasta(s) e {1} arquivo(s) copiados.";
localizations.CutActionGrowlText = "Total de {0} pasta(s) e {1} arquivo(s) cortados.";
localizations.NothingSelectedGrowlText = "Nada selecionado";
localizations.ShareNothingSelectedGrowlText = "Nada selecionado para compartilhar";
localizations.DownloadNothingSelectedGrowlText = "Nada selecionado para baixar";
localizations.RenameNothingSelectedGrowlText = "Nada selecionado para renomear";
localizations.PreviewNothingSelectedGrowlText = "Nada selecionado para visualizar";
localizations.NoPreviewGrowlText = "Visualizar";
localizations.NoPreviewGrowlDesc = "Visualização indisponível para o item selecionado";
localizations.ProblemWhileRenamingGrowlText = "Problema ao renomear";
localizations.ProblemWhileRenamingDescGrowlText = "Ocorreu um problema ao renomear. Por favor, tente novamente. Erro: ";
localizations.ProblemWhileSharingGrowlText = "Problema ao compartilhar";
localizations.ProblemWhileSharingDescGrowlText = "Ocorreu um problema ao compartilhar um arquivo. Por favor, tente novamente.";
localizations.DirectLinkDescGrowlText = "Clique com o botão direito do mouse no item e clique em copiar link direto";
localizations.UpdateKeywordDescGrowlText = "Clique com o botão direito do mouse no item e clique em atualizar palavras-chave";
localizations.QuickViewNothingToShowGrowlText = "Erro: Nada para mostrar na visualização rápida";
localizations.QuickViewNoItemsAvailableGrowlText = "Nenhum item disponível";
localizations.QuickViewRotateClockwiseTooltipText = "Girar no sentido horário";
localizations.QuickViewRotateCounterClockwiseTooltipText = "Girar no sentido anti-horário";
localizations.QuickViewCurrentImagePositionText = "Item {current} de {total}";
localizations.ProblemWhileDeletingGrowlText = "Problema ao excluir";
localizations.ProblemWhileDeletingDescGrowlText = "Ocorreu um problema ao excluir. Por favor, tente novamente. Erro: ";
localizations.ProblemWhileUnzipGrowlText = "Problema ao descompactar arquivo(s)";
localizations.ProblemWhileUnzipDescGrowlText = "Ocorreu um problema ao descompactar. Por favor, tente novamente. Erro: ";
localizations.ProblemWhileZipGrowlText = "Problema ao compactar arquivo(s)";
localizations.ProblemWhileZipDescGrowlText = "Ocorreu um problema ao compactar. Por favor, tente novamente. Erro: ";
localizations.ProblemWhileCreatingFolderGrowlText = "Problema ao criar nova pasta";
localizations.ProblemWhileCreatingFolderDescGrowlText = "Ocorreu um problema ao criar nova pasta. Por favor, tente novamente. Erro: ";
localizations.JavaRequiredGrowlText = "Java Requerido";
localizations.JavaRequiredDescGrowlText = "Java deve estar instalado para que as funções avançadas funcionem.<br/><br/>Por favor, acesse: <a target=\"_blank\" href=\"https://www.oracle.com/java/technologies/downloads/\">https://www.oracle.com/java/technologies/downloads/</a>";
localizations.JavaLoadingProblemGrowlText = "Problema ao carregar Java";
localizations.JavaLoadingProblemDescGrowlText = "Ocorreu um problema ao carregar o Java. Se o Java estiver desativado no navegador, por favor, habilite-o e tente novamente.";
localizations.JavaAppletNotLoadedGrowlText = "Applet Java não carregado";
localizations.JavaAppletNotLoadedDescGrowlText = "Você deve primeiro clicar no botão 'Navegação Avançada...' para ativar o recurso de arrastar e soltar.";
localizations.NoFilesFoundGrowlTitle = "Armazenamento de back-end indisponível";
localizations.NoFilesFoundGrowlText = "Erro: Armazenamento de back-end indisponível para a localização:";
localizations.AutoLogOutConfirmationTitle = "Sair automaticamente";
localizations.AutoLogOutConfirmationDesc = "Você está prestes a ser desconectado devido à inatividade";
localizations.AutoLogOutButtonText = "Manter conectado";
localizations.AutoLogOutMsg = "Você foi desconectado devido à inatividade";
localizations.AutoLogOutLoginButtonText = "Entrar novamente..";
//Treeview header items
localizations.TreeviewHeaderNameText = "Nome";
localizations.TreeviewHeaderPathText = "Caminho";
localizations.TreeviewHeaderSizeText = "Tamanho";
localizations.TreeviewHeaderModifiedText = "Modificado";
localizations.TreeviewHeaderKeywordsText = "Palavras-chave";
//Selection menu items
localizations.SelectItemOptionLinkText = "Selecionar";
localizations.SelectCheckboxContextMenuToggleText = "Selecionar/Desmarcar";
localizations.SelectCheckboxContextMenuCheckAllText = "Todos os itens";
localizations.SelectCheckboxContextMenuUncheckAllText = "Nenhum";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "Todos os arquivos";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "Todas as pastas";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Itens começando com \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "Modificado hoje";
localizations.SelectCheckboxContextMenuCheckWeekText = "Modificado nesta semana";
localizations.SelectCheckboxContextMenuCheckMonthText = "Modificado neste mês";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "Modificado nos últimos 60 dias";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "Modificado nos últimos 90 dias";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "Mostrar {0} itens por página";
//Webinterface labels
l
localizations.CopyrightText = "&copy; 2021 <a target=\"_blank\" href=\"https://www.crushftp.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"https://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "Escolha os itens para enviar..";
localizations.advancedDownloadPathSelectionWindowTitle = "Escolha o caminho onde baixar..";
localizations.advancedOperationsDownloadStatus = "Baixando";
localizations.advancedOperationsUploadStatus = "Enviando";

localizations.maxAllowedDownloadSizeReached = "Tamanho de download excedeu o máximo permitido"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "Tamanho máximo permitido para download: {size}. <br />Utilize o downloader avançado ou adicione à cesta.";

//Audio player
localizations.AudioPlayerPlayText = "Reproduzir";
localizations.AudioPlayerPauseText = "Pausar";
localizations.AudioPlayerStopText = "Parar";
localizations.AudioPlayerMuteText = "Silenciar";
localizations.AudioPlayerUnmuteText = "Reativar som";
localizations.AudioPlayerDownloadText = "Baixar";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "Alterar ícone ";
localizations.ChangeIconWindowInstructionsText = "Escolha uma pequena imagem para definir como o ícone do item selecionado:";
localizations.ChangeIconWindowSelectedFilesLabelText = "Arquivo selecionado: ";
localizations.ChangeIconWindowCancelLinkText = "Cancelar";
localizations.ChangeIconWindowUpdateLinkText = "Salvar";
localizations.ChangeIconFileSelectAlertText = "Selecione o arquivo de imagem para continuar.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "Descompactando iniciado";
localizations.UnzipStartedAlertDescText = "A operação de descompactação foi iniciada para os arquivos selecionados";
localizations.UnzipCompletedAlertTitleText = "Descompactando concluído";
localizations.UnzipCompletedAlertDescText = "A operação de descompactação foi concluída para os arquivos selecionados";

//zip operation
localizations.ZipStartedAlertTitleText = "Compactando iniciado";
localizations.ZipStartedAlertDescText = "A operação de compactação foi iniciada para os arquivos selecionados";
localizations.ZipCompletedAlertTitleText = "Compactando concluído";
localizations.ZipCompletedAlertDescText = "A operação de compactação foi concluída para os arquivos selecionados";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "Registro concluído: ";
localizations.RegisterWindowProcessCompleteMessage = "Você pode fazer login usando o usuário registrado assim que for habilitado pelo administrador.";
localizations.RegisterWindowProcessFailedMessage = "<strong>Alguns motivos pelos quais o registro pode falhar: <strong><br><br>- O nome de usuário já está em uso. <br> - O servidor está temporariamente impedindo o registro. <br><br> Por favor, tente novamente ou entre em contato com o administrador.";

//Data size format items
localizations.dataByClassFormatBytes = "bytes";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "Por favor, espere...";

localizations.bytesSentLabelTextByClass = "Enviado:";
localizations.bytesReceivedLabelTextByClass = "Recebido:";
localizations.bytesAvailableLabelTextByClass = "Disponível:";
localizations.ratioTextByClass = "Taxa:";
localizations.dirInfoDownloadLabelTextByClass = "Download: ";
localizations.dirInfoUploadLabelTextByClass = "Envio: ";
localizations.maxAndAvailableAmountLabelTextByClass = "Disponível/Máx.:";
localizations.maxAmountPerDayLabelTextByClass = "Por Dia: ";
localizations.quotaAvailableTextByClass = "disponível";
localizations.maxAmountPerMonthLabelTextByClass = "Por Mês: ";

//Server message localized
localizations.share_complete = "Publicação concluída.";
localizations.share_email_sent = "Mensagem de e-mail enviada.";
localizations.share_open_in_email_client = "Abrir no cliente de e-mail";
localizations.email_failed = "<div class='errorMessage'>Erro ao enviar o e-mail via SMTP. Verifique os logs do servidor.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "Carregamento falhou: ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "ERRO: Acesso negado. (Você não tem permissão ou a extensão do arquivo não é permitida.)";
localizations.FileUploadContentNotAllowedErrorMsgText = "ERRO:550 Erro: Conteúdo do arquivo não permitido.";
localizations.FileUploadCanNotOverwriteErrorMsgText = "ERRO: Não é possível sobrescrever um arquivo.";

localizations.CustomEventCallSuccessTitle = "Sucesso";
localizations.CustomEventCallSuccessDesc = "Evento personalizado iniciado";
localizations.CustomEventCallFailureTitle = "Falha";
localizations.CustomEventCallFailureDesc = "Ocorreu um problema ao executar o evento personalizado";

localizations.ProblemEventCallSuccessTitle = "Sucesso";
localizations.ProblemEventCallSuccessDesc = "Problema relatado";
localizations.ProblemEventCallFailureTitle = "Falha";
localizations.ProblemEventCallFailureDesc = "Ocorreu um problema ao relatar o problema";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "Opções Avançadas";
localizations.advancedDownloadOptionsButtonText = "Opções Avançadas de Download";
localizations.advancedUploadOptionsDialogSaveButtonText = "Salvar";
localizations.advancedUploadOptionsItemAvailableLabel = "Quando um item existente for encontrado:";
localizations.advancedUploadOptionsUseCompressionLabel = "Usar compactação:";
localizations.advancedUploadOptionsAskActionDialogTitle = "Por favor, confirme sua ação";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "Por favor, confirme sua ação para o arquivo:";
localizations.advancedUploadOptionsAskActionLabelByClass = "Ação:";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "Substituir";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "Substituir Todos";
localizations.advancedUploadActionResumeSelectOptionText = "Continuar";
localizations.advancedUploadActionResumeAllSelectOptionText = "Continuar Todos";
localizations.advancedUploadActionSkipSelectOptionText = "Pular";
localizations.advancedUploadActionSkilAllSelectOptionText = "Pular Todos";
localizations.advancedUploadActionAskSelectOptionText = "Perguntar";
localizations.advancedUploadActionCompressionYesSelectOptionText = "Sim";
localizations.advancedUploadActionCompressionNoSelectOptionText = "Não";
localizations.MaxUploadFilesCountReachedGrowlText = "Número máximo de arquivos excedido";
localizations.MaxUploadFilesCountReachedGrowlDesc = "O número máximo de arquivos permitidos para upload foi excedido. Número máximo de arquivos permitidos para upload:";

localizations.OTPDialogHeaderText = "Digite seu OTP aqui";

localizations.LoggedInAsLabelText = "Logado como: ";
localizations.AccountExpiresOnLabelText = "Expira em: ";
localizations.maxListItemsWarningMessage = "Listas de diretórios grandes causam problemas significativos de desempenho. Sugerimos organizar os itens em subpastas para evitar problemas de desempenho.";

if (typeof $.sessionChecker != "undefined") 
  $.sessionChecker.defaultOptions.noteTextTemplate = "(Sessão expira em %time%.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
  waitMessage: "Por favor, espere...",
  playSlideshow: "Iniciar apresentação de slides",
  pauseSlideshow: "Pausar apresentação de slides",
  refresh: "Atualizar",
  fullscreen: "Tela cheia",
  download: "Baixar",
  upload: "Enviar",
  deleteText: "Excluir",
  rotateClockwise: "Girar no sentido horário",
  rotateCounterClockwise: "Girar no sentido anti-horário",
  previousItem: "Item anterior",
  nextItem: "Próximo item",
  delayText: "(Atraso {x} segundos)",
  nextPageText: "Próxima &rsaquo;",
  prevPageText: "&lsaquo; Anterior",
  itemCountText: "(Item {x} de {y})",
  noItemMessage: "<h3 style='text-align:center;'>Nenhum item disponível ou problema ao buscar registros.</h3>"
};

localizations.uploadPanel = {
  uploadWindowTitle: "Arquivos para upload",
  dragDropMsg: "Arraste e solte o arquivo aqui",
  remove: "Remover",
  removeAllSelected: "Todos Selecionados",
  removeAllWithError: "Todos com Erro",
  removeAllUploaded: "Todos Enviados",
  removeAllCancelled: "Todos Cancelados",
  removeAllSkipped: "Todos Pulados",
  removeAll: "Todos",
  addFiles: "Adicionar arquivos...",
  upload: "Enviar",
  uploadSelected: "Enviar Selecionados",
  reuploadAll: "Reenviar Todos",
  cancel: "Cancelar",
  uploadDetails: "Detalhes do Upload",
  overwriteAll: "Substituir Todos",
  resumeAll: "Continuar Todos",
  shareUploaded: "Compartilhar Enviados",
  quickFilterSubtext: "Filtro Rápido...",
  total: "Total",
  filesFailed: "arquivo(s) falharam.",
  selectedFiles: "Arquivo(s) Selecionado(s):",
  size: "Tamanho:",
  filtered: "(Filtrado)",
  totalFiles: "Total de Arquivo(s):",
  scrollWithActivity: "Scroll com atividade",
  writingFile: "Gravando arquivo...",
  decompressingFile: "Descompactando arquivo...",
  pleaseWait: "Por favor, espere...",
  uploadedIn: "Enviado em",
  aMoment: "um momento",
  atAvgSpeedOf: "à velocidade média de",
  uploadingFailed: "Envio falhou",
  canceled: "Cancelado",
  skipped: "Pulado",
  currentSpeed: "Velocidade Atual:",
  averageSpeed: "Velocidade Média:",
  "of": "de",
  elapsed: "Decorrido",
  remaining: "Restante",
  waiting: "Aguardando..",
  details: "Detalhes",
  overwrite: "Substituir",
  resume: "Continuar",
  reupload: "Reenviar",
  pause: "Pausar",
  paused: "Pausado",
  uploading: "Enviando",
  items: "item(ns)",
  skip: "Pular",
  cancelAll: "Cancelar Todos",
  OK: 'Sim',
  CANCEL: 'Não',
  CONFIRM: "Sim",
  reuploadConfirmation: "Isso irá reenviar todos os arquivos que já foram enviados, cancelados, pulados ou falharam durante o envio e substituirá os arquivos existentes. Tem certeza de que deseja continuar?",
  folderUploadNotSupported: "Envio de pastas não é suportado neste navegador",
  fileAlreadySelected: "Arquivo já adicionado ao upload no mesmo local.",
  fileExistsOnServer: "Arquivo com o mesmo nome disponível no servidor.",
  fileSizeExceed: "Tamanho do arquivo excede o limite.",
  fileTypeNotAllowed: "Tipo de arquivo não permitido.",
  filterApplied: "Filtro aplicado",
  noMatchingItemAvailable: "Nenhum item correspondente disponível.",
  addFilesToUpload: "Adicionar arquivos para upload...",
  file: "Arquivo",
  reason: "Motivo",
  failedItems: "Itens falhados",
  ignoreAll: "Ignorar Todos",
  retryAll: "Tentar Novamente Todos",
  failedOpeningFile: "Armazenamento de back-end indisponível.",
  cancelConfirmation: "Tem certeza que deseja cancelar o upload?",
  failedClosingFile: "Falha ao fechar o arquivo",
  failedWileRetryingChunk: "Falha ao tentar novamente o upload do chunk.",
  retryingFile: "Tentando novamente enviar o arquivo",
  "in": "Em",
  seconds: "segundo(s)",
  skipFile: "Pular arquivo",
  retryNow: "Tentar novamente agora",
  retryingClosingFile: "Tentando novamente fechar o arquivo",
  fileExistConfirmation: "O arquivo [1] com o mesmo tamanho existe. Deseja reenviar o arquivo?",
  bigFileOverwriteConfirmation: "O arquivo [1] no servidor é maior do que o que está sendo enviado. Deseja sobrescrever?",
  fileExistsOnServerConfirmation: "O arquivo [1] existe no servidor",
  fileActionTitle: "Selecione o que deseja fazer com este arquivo.",
  applyToAll: "Aplicar a todos",
  retryingOpeningFile: "Tentando novamente abrir o arquivo",
  secondsAbbr: "seg",  
  minutesAbbr : "mins",
  hoursAbbr : "horas"
};