//Japanese
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP Web インターフェース :: ログイン";
localizations.BadLoginInfoText = "ユーザー名、またはパスワードが間違っているか、アカウントの有効期限が切れている可能性があります。";
localizations.ServerErrorInfoText = "サーバーが利用できないか、IPが禁止されています。";
localizations.PasswordsDoNotMatchAlertText = "新しいパスワードが一致しません。";
localizations.LoginAgainTitleText = "もう一度ログインしてください";
localizations.LoginWithNewPassText = "新しいパスワードでログインする";
localizations.AuthenticatingMsgText = "認証中…";
localizations.LoginSuccessText = "成功しました";
localizations.LoadingWebInterfaceText = "WebInterfaceを読み込んでいます…";
localizations.LoginWarningText = "警告";
localizations.MultipleBadLoginsAlertDescText = "試行回数が多すぎてIPが禁止されます。\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'><a style='color:white;' href='/WebInterface/jQuery/reset.html'>こちら</a>をクリックしてパスワードをリセットください。</div>";
localizations.LoginFailedText = "ログインに失敗しました";
localizations.ChangePasswordGrowlTitleText = "パスワードの変更";
localizations.UserNameText = "ユーザー名";
localizations.ResetUserNameText = "ユーザー名";
localizations.PasswordText = "パスワード";
localizations.RememberMeText = "覚えていますか";
localizations.LoginButtonText = "ログイン";
localizations.ForgotPasswordLinkText = "パスワードを忘れました";
localizations.ResetPasswordButtonText = "パスワードを再設定する";
localizations.BackToLoginButtonText = "ログインに戻る";
localizations.ValidUserNameAlertText = "有効なユーザー名を入力してください";
localizations.RequestPasswordHeaderText = "パスワードの要求";
localizations.ChangePasswordHeaderText = "パスワードを変更してください";
localizations.ChangePasswordNoteText = "続行するにはパスワードを変更する必要があります";
localizations.CurrentPasswordText = "現在のパスワード： ";
localizations.NewPasswordText = "新しいパスワード： ";
localizations.ConfirmPasswordText = "パスワードの認証： ";
localizations.CancelButtonText = "キャンセル";
localizations.ChanngePasswordButtonText = "パスワードの変更";
localizations.GeneratePasswordButtonText = "パスワードの発行";
localizations.GeneratePasswordUseButtonText = "これを使って";
localizations.GeneratePasswordCancelButtonText = "キャンセル";
localizations.OldBrowserNoticeHTMLAsText = 'Your browser is out of date, it was released almost a decade ago! As a result it is very slow, full of bugs, and this WebInterface may or may not even work with IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Proceed Anyway Cautiously</button> or get a better browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';
localizations.serverNotConfiguredForEmailError = "本サーバーは、電子メールパスワードリマインダを送信するように設定されていません。";
localizations.RecaptchaValidationRequiredText = "ログインするためにキャプチャを確認してください";
localizations.UserOptionsWindowUpdateButtonText = "保存";
localizations.InvalidPasswordCharacterMsgText = "パスワードに無効な文字が含まれています。パスワードから削除してください。無効な文字 ";
localizations.CookiePolicyNotificationText = "本サイトでは、技術的な理由からユーザーがログインできるようにするため、クッキーを使用しています。";
localizations.CookiePolicyLinkText = "クッキー・ポリシー";
localizations.CookiePolicyAcceptButtonText = "承認";
localizations.CookiePolicyDismissButtonText = "却下";
/*Reset pass page specific*/
localizations.resetPageUserName = "ユーザー名またはEメール： ";
localizations.resetPagePassword = "パスワード： ";
localizations.resetPagePasswordConfirm = "パスワード確認： ";
localizations.resetPageSubmit = "提出";
localizations.resetPageLoginPage = "ログインページ";
localizations.resetPageStartOver = "やり直す";

localizations.passwordRequirementsMessages = {
    errorTitle : "エラー：\r\n",
    msgSeparator : "\r\n",
    chars : "パスワードは少なくとも$$文字でなければなりません。",
    numericChars : "パスワードには少なくとも$$数字が含まれている必要があります。",
    lowerCase : "パスワードは少なくとも$$小文字が含まれている必要があります。",
    upperCase : "パスワードは少なくとも$$大文字が含まれている必要があります。",
    specialCase : "パスワードには少なくとも$$特殊文字が含まれている必要があります。",
    unsafeChars: "パスワードには以下のURL上で安全でない文字を含めることはできません：$$",
    recentPass: "パスワードを最近のパスワードにすることはできません。",
    notAllowedErrorMsg : "許可されていません"
};

localizations.ItemsPerPageText = "ページごとに表示する項目： ";
localizations.LayoutChangeLabelText = "レイアウト： ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "最大ファイルサイズ",
            "minFileSize": "最小ファイルサイズ",
            "acceptFileTypes": "受入ファイル対ぴ",
            "maxNumberOfFiles": "ファイルの最大数",
            "uploadedBytes": "アップロードされたバイト数",
            "emptyResult": "空の結果",
            "fileAvailableInSelectedFolder": "選択フォルダ内の入手可能なファイル",
            "hasReachedQuota": "クォーターに達しました",
            "fileExistOnServer": "サーバーにファイルが存在します",
            "fileBiggerThanAllowed": "受入より大きいファイル",
            "dirNoWritable": "ディレクトリの書き込み不可",
            "blockUploadingDirs": "ディレクトリのアップロードをブロック",
            "true": "正しい"
        },
        "error": "エラー",
        "start": "スタート",
        "waiting": "待機中",
        "uploading": "アップロード中",
        "reupload": "再アップロード",
        "share": "シェア",
        "cancel": "キャンセル",
        "destroy": "破壊する",
        "overwrite": "上書きする",
        "uploadTo": "へアップロードする",
        "pause": "一時停止",
        "errorLabel": "エラーラベル",
        "details": "詳細",
        "uploadedInLabelText": "ラベルテキストにアップロード",
        "atAvgSpeedOfLabelText": "ラベルテキストの平均速度",
        "uploadCompletedText": "全テキストのアップロード",
        "uploadedFileText": "アップロードされたファイルテキスト",
        "uploadedMultipleFilesText": "アップロードされたマルチファイルテキスト"
    }
};

localizations.buttons = {
    "admin": "管理者",
    "delete": "削除する",
    "rename": "リネーム",
    "download": "ダウンロード",
    "advanced download": "詳細なダウンロード",
    "zipdownload": "zipダウンロード",
    "unzip": "zip解凍する",
    "zip selected": "選択されたzip",
    "explore zip contents": "zipコンテンツをエクスプローラ",
    "create folder": "フォルダ作成",
    "upload": "アップロードする",
    "search": "サーチ",
    "user options": "ユーザーオプション",
    "cut": "カット",
    "copy": "コピー",
    "paste": "ペースト",
    "slideshow": "スライドショー",
    "quickview": "クイックビュー",
    "download low-res": "低解像度のダウンロード",
    "preview": "プレビュー",
    "batchcomplete": "バッチ完了",
    "share": "シェア",
    "quick share": "クイックシェア",
    "manage shares": "共有の管理",
    "show basket": "バスケットの表示",
    "add to basket": "バスケットに追加",
    "edit keywords": "キーワードを編集",
    "change icon": "アイコンの変更",
    "download crushtunnel": "crushtunnelのダウンロード",
    "help": "ヘルプ",
    "login": "ログイン",
    "logout": "ログアウト",
    "download sync app": "同期アプリをダウンロード",
    "download crushftpdrive": "crushftpdriveをダウンロード",
    "sync manager": "同期マネージャ"
};

localizations.currentLanguageName = "英語";
localizations.languageNameEnglish = "英語";
localizations.languageNameCzech = "チェコ語 (ÄŒeÅ¡tina)";
localizations.languageNameDanish = "デンマーク語 (Danske)";
localizations.languageNameDutch = "オランダ語 (Nederlands)";
localizations.languageNameFrench = "フランス語 (FranÃ§ais)";
localizations.languageNameGerman = "ドイツ語 (Deutsch)";
localizations.languageNameHungarian = "ハンガリー語 (Magyar)";
localizations.languageNameItalian = "イタリア語 (Italiano)";
localizations.languageNamePolish = "ポーランド語 (Polskie)";
localizations.languageNameSpanish = "スペイン語 (EspaÃ±ol)";
localizations.languageNameSlovak = "スロバキア語 (SlovenskÃ½)";
localizations.languageNameChinese = "中国語 (ä¸­åœ‹)";
localizations.languageNameSwedish = "スウェーデン語 (Svenska)";
localizations.languageNameJapanese = "日本語";

//WebInterface
localizations.refreshListingButtonTooltipText = "更新";
localizations.FilterText = localizations.FilterTextBasket = "フィルタ:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "クリア";
localizations.FileCounterItemsText = "アイテム";
localizations.FileCounterFoldersText = "フォルダ";
localizations.FileCounterFilesText = "ファイル";
localizations.FileCounterHiddenItemsText = "隠しアイテム";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "サムネイル表示";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "ツリー表示";
localizations.DownloadResumeTextLabelBasket = "再開";
localizations.BackToTopLinkText = "トップに戻る";
localizations.FilesNotAvailableMessage = "ファイルがありません";
localizations.CopyNoFilesSelectedMessage = "コピーするファイル/フォルダを選択してください";
localizations.CopyOnlyFilesMessage = "ファイルのみをカット/コピーすることができ、選択されたフォルダは無視されます";
localizations.DeleteNoFilesSelectedMessage = "削除するファイル/フォルダを選択してください";
localizations.UnzipNoFilesSelectedMessage = "zip解凍するファイルを選択してください";
localizations.ZipExploreNoFilesSelectedMessage = "エクスプローラするzipを選択してください";
localizations.CutNoFilesSelectedMessage = "カットするファイル/フォルダを選択してください";
localizations.pagingPrevText = "前の";
localizations.pagingNextText = "次の";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "（フレーズ付きアイテム\\";
localizations.TotalItemsInDirMsgText = "（ディレクト内の全項目{数}）";
localizations.CurrentFileSizeText = "（リスト内の合計ファイルサイズ{サイズ}）";
localizations.TotalItemsInDirInlineText = " （{数}アイテム） ";
localizations.quotaAvailableLabelText = "利用可能";

localizations.WelcomeNoteSubmitFormFailureMsgText = "エラー：データ保存中の問題";
localizations.TreeviewSpecificActionMsgTitleText = "ツリービュー専用";
localizations.TreeviewSpecificActionMsgDescText = "これはツリービューのみに特有のものです。";
localizations.PasswordExpiringMsgText = "パスワードの有効期限がもうすぐ切れます。<br/>ユーザーオプションボタンを使用して変更してください。";
localizations.PasswordNotMatchingMsgText = "新しいパスワードが一致しません。";
localizations.PasswordMustBeComplexMsgText = "パスワードはもっと複雑なものでなければなりません。";
localizations.PasswordChangedMsgText = "パスワードは変更されました。  新しいパスワードでログインしてください。";
localizations.AppletLoadingFailedMsgText = "アップロード中にアプレットが失敗しました";
localizations.DownloadStartedAlertTitleText = "ダウンロードが開始されました";
localizations.DownloadCompletedText = "[ダウンロード完了]";
localizations.DownloadCompletedPathText = " ダウンロード先： ";
localizations.DownloadStartedAlertDescText = "続行するにはファイルを保存する場所を選択してください";
localizations.LogoutButtonText = "ログアウト";
localizations.browserUploaderNativeUploadTipSetTitle = "ブラウザアップローダを使用してファイルをアップロードします。";
localizations.browserUploaderAdvancedUploadTipSetTitle = "アドバンスアップローダを使用してファイルをアップロードします。<br>フォルダを許可し、転送を高速化できます。";
localizations.browserUploaderDragDropHoverLabelText = "ここにファイルをドロップしてアップロードします";
localizations.appletUploaderDropPanelLabelText = "＆darr; ここにファイルをドロップしてアップロードします＆darr;";
localizations.browserUploaderDragDropLabelText = "ここにファイルをドラッグ＆ドロップしてアップロードします";
localizations.browserUploaderChromeDragDropLabelText = "ファイルとフォルダをここにドラッグ＆ドロップしてアップロードします";
localizations.advancedUploadOptionsDialogSaveButtonText = "保存";
localizations.advancedUploadOptionsDialogCancelButtonText = "キャンセル";

//Sharing Window
localizations.ShareWindowHeaderText = "ファイルを共有する";
localizations.ShareWindowFilesSharingLabelText = "共有する";
localizations.ShareWindowShareTypeLabelText = "共有タイプ：";
localizations.ShareWindowShareTypeLabelCopyText = "コピー";
localizations.ShareWindowShareTypeLabelMoveText = "移動";
localizations.ShareWindowShareTypeLabelReferenceText = "リファレンス";
localizations.ShareWindowShareToInternalUserLabelText = "内部シェア";
localizations.ShareWindowShareToExternalUserLabelText = "外部シェア";
localizations.ShareWindowDownloadLabelText = "ダウンロード";
localizations.ShareWindowExpiresInDaysLabelText = "日";
localizations.ShareWindowExpiresInDaysValidationErrorText = "有効期限は{日数}日を超えてはいけません";
localizations.ShareWindowMaxUsesLabelText = "最大使用回数";
localizations.ShareWindowUploadLabelText = "アップロード";
localizations.ShareWindowDeleteLabelText = "削除";
localizations.ShareWindowSendEmailLabelText = "メールを送る ：";
localizations.ShareWindowDirectLinkLabelText = "ファイルへ直接リンク？";
localizations.ShareWindowExpiresLabelText = "有効期限：";
localizations.ShareWindowFromLabelText = "送信者： ";
localizations.ShareWindowToLabelText = "送信先： ";
localizations.ShareWindowCCLabelText = "CC： ";
localizations.ShareWindowBCCLabelText = "BCC： ";
localizations.ShareWindowReplyToLabelText = "返信先 ： ";
localizations.ShareWindowSubjectLabelText = "件名： ";
localizations.ShareWindowBodyLabelText = "内容： ";
localizations.ShareWindowAdvancedLabelText = "詳細";
localizations.ShareWindowAttachThumbsLabelText = "サムネイルを添付";
localizations.ShareWindowAttachFileLabelText = "ファイルを添付する";
localizations.ShareWindowCommentsLabelText = "コメント： ";
localizations.ShareWindowKeywordsLabelText = "キーワード： ";
localizations.ShareWindowAccessLabelText = "全権アクセス ";
localizations.ShareWindowSendButtonText = "送信";
localizations.ShareWindowAlternateTempAccountLabelText = "代替仮アカウント :";
localizations.ShareWindowCancelButtonText = "キャンセル";
localizations.ShareWindowUsernameMethodLabelText = "シェア方法： ";
localizations.ShareWindowUsernameLabelText = "内部ユーザーと共有";
localizations.ShareWindowUsernamesLabelText = "ユーザー名： ";
localizations.ShareWindowUsernamesLabelHelpText = "（複数のユーザー名はカンマで区切ります）";
localizations.ShareActionCompleteShareUsernamesText = "次のユーザーに、共有アイテムへのアクセス権が付与されました。";
localizations.ShareActionCompleteUsernameText = "ユーザー名： ";
localizations.ShareActionCompletePasswordText = "パスワード: ";
localizations.ShareActionCompleteLinkText = "リンク";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "有効なメールアドレスを入力してください。複数のEメールアドレスを一度にコンマで区切って入力できます。例）<strong> bob@email.com, john@email.com,... </strong>";
localizations.ShareInvalidItemSelectedGrowlText = "無効なアイテム";
localizations.SharFoldersCantBeSharedGrowlText = "フォルダを共有できません";
localizations.SharFilesCantBeSharedGrowlText = "ファイルを共有できません";
localizations.ShareLinkCopyToClipboardText = "リンクをクリップボードにコピーする";
localizations.ShareLinkCopiedToClipboardText = "リンクをクリップボードにコピーする";
localizations.ShareWindowUsernamesLabelEmailNotAllowedText = "内部共有はメールアドレスを受け付けません。ユーザー名を使用してください";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "直接リンクをコピーする";
localizations.CopyLinkText = "リンクをコピーする";
//Create folder window
localizations.CreateFolderWindowHeaderText = "新しいフォルダを作成する。";
localizations.CreateFolderInputDefaultFolderName = "新しいフォルダ";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "作成後にフォルダに移動する ";
localizations.CreateFolderButtonText = "作成";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "ファイルをアップロードする";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "詳細をアップロードする";
localizations.BrowserUploaderUploadFilesTabHeaderText = "ファイルをアップロードする";
localizations.BrowserUploaderAdvancedBrowseButtonText = "詳細ブラウズ..";
localizations.BrowserUploaderStartUploadingLinkText = "アップロードを開始";
localizations.BrowserUploaderClearCompletedLinkText = "クリア完了";
localizations.BrowserUploaderResumeCheckboxText = "再開";
localizations.BrowserUploaderFormResetButtonText = "リセット";
localizations.BrowserUploaderFormNextButtonText = "次の";
localizations.BrowserUploaderFileAddedAlreadyText = "このファイルは既に追加されています。";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0}は既に追加されています。";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "これらのファイルは既に追加されています。";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0}は既に追加されています。";
localizations.BrowserUploaderSelectedFilesGroupText = "ファイルグループ： ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "削除";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "にアップロードされます";
localizations.BrowserUploaderSelectedFileOverwriteText = "上書きする";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "上書きされます";
localizations.BrowserUploaderSelectedFileExistsText = "ファイルが存在します";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "要注意";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "無視する";
localizations.BrowserUploaderSelectedFileDoneText = "完了";
localizations.BrowserUploaderSelectedFileUploadedText = "にアップロード";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "再アップロード";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "再ダウンロード";
localizations.BrowserUploaderSelectedFileDismissLinkText = "やめる";
localizations.BrowserUploaderSelectedFileCancelLinkText = "キャンセル";
localizations.BrowserUploaderSelectedFilePauseLinkText = "一時停止";
localizations.BrowserUploaderSelectedFilePausedStatusText = "一時停止";
localizations.BrowserUploaderSelectedFileResumeLinkText = "再開";
localizations.BrowserUploaderAdvancedUploadingFilesText = "合計{0}ファイル";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} / {1}アイテム ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "にアップロード： ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "現在の速度： ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "平均速度： ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'>時間：経過：<span class='elapsed'>{0}</span> <span class='remained'>,残り: {1}</span></div>";
localizations.BatchCompleteText = "結果";
localizations.BatchComplete = "承認された転送";
localizations.BrowserUploaderSpeedTimeCalculatingText = "計算中..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "転送中に問題";
localizations.BrowserUploaderCancelledUploadMsgText = "アップロードをキャンセルしました";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "あなたのファイルは現在アップロード中です。  このページから移動すると、それらを失うことになります。  このページを終了してよろしいですか？";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "ファイルは現在ダウンロード中です。このページから移動すると、それらを失うことになります。  このページを終了してよろしいですか？";
localizations.NoUploadInDirGrowlText = "アップロードは許可されていません";
localizations.NoUploadInDirGrowlDesc = "選択したディレクトリにアイテムをアップロードすることはできません";
localizations.AdvancedUploadDirNotAllowedText = "ディレクトリのアップロードは許可されていません";
localizations.AdvancedUploadDirNotAllowedDescText = "ディレクトリをアップロードできません。ファイルのみを選択してください";
localizations.uploadConfirmCancelUploadText = "このアップロードをキャンセルしてよろしいですか？";
localizations.uploadConfirmCancelUploadAfterFormText = "最後に選択した{数}個のアイテムのアップロードをキャンセルしてよろしいですか？";

//New upload bar localizations
localizations.browseFileLabelByClass = "追加ファイル...";
localizations.advancedUploadResumeLabelByClass = "再開";
localizations.filesToUploadQueueWindowHeader = "アップロードするファイル";
localizations.uploadWindowStartUploadingByClass = "アップロードを開始";
localizations.uploadWindowCancelUploadingByClass = "アップロードをキャンセル";
localizations.uploadWindowShowCommonUploadFormByClass = "詳細";
localizations.uploadWindowClearUploadedByClass = "アップロードをクリア";
localizations.uploadWindowOverwriteAllByClass = "すべて上書き";
localizations.uploadWindowRemoveAllWithErrorsByClass = "エラーと共にすべて削除";
localizations.uploadWindowSummaryFilesByClass = "ファイル： ";
localizations.uploadWindowSummarySizeByClass = "、アップロードサイズ： ";
localizations.uploadBarShowHideFilesSetTitleClass = "アップロードパネルの表示/非表示";
localizations.uploadBarAttentionTitle = "アップロードバーからファイルを追加する";
localizations.uploadBarAttentionText = localizations.browseFileLabelByClass + "アップロードするファイルを追加するには、アップロードバーを使用してください。クリック \\";
localizations.uploadBiggerFileNoticeTitleText = "より大きなファイルの場合は、アドバンストアップロードを使用してください。";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>大きなファイルにはアドバンストアップロードを使用することをお勧めします。ファイルを簡単にアップロードでき、<em>自動再開</em>機能があります。<br><br> (アップロードバーでアップロードモードを切り替えることができます)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='アップロードモードを切り替える方法'>";

localizations.globalProgressbarSkipLabelByClass = "スキップ";
localizations.globalProgressbarPauseLabelByClass = "一時停止";
localizations.globalProgressbarStopLabelByClass = "停止";

localizations.popupOpenInSeparateWindowText = "別ウィンドウで開きます";
localizations.customFormPasswordMatchValidationFailedText = "パスワードが一致しません";
localizations.customFormCompareValueMatchValidationFailedText = "値が一致しません";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined"){
    window.locale.fileupload.SwitchToNormalUpload = "通常アップロードに切り替える";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "アドバンストアップロードに切り替える。<div style='font-size:11px;width:500px;margin:5px;0px;'>アドバンストモードは転送を高速化します。転送に失敗した場合は自動的に再開し、フォルダ全体を一度にアップロードできます。<br><br>ファイルをアップロードするための最速の方法です。<br>(アドバンストモードでは、www.java.comのJava Appletプラグインをインストールする必要があります。)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "検索";
localizations.SearchWindowKeywordsLabelText = "キーワード：";
localizations.SearchWindowExactLabelText = "正確？";
localizations.SearchWindowByClassModifiedLabelText = "変更済";
localizations.SearchWindowByClassDateFormatLabelText = "（月/日/年） ";
localizations.SearchWindowSizeLabelByClassText = "サイズは ";
localizations.SearchWindowTypeLabelText = "タイプは";
localizations.SearchWindowSizeUnitLabelTextByClass = "（キロバイト）";
localizations.SearchWindowSearchButtonText = "サーチを開始";
localizations.SearchWindowCancelButtonText = "キャンセル";
localizations.SearchResultDisplayText = "検索結果：";
localizations.SearchResultClearLinkText = "（検索フィルタをクリア）";
localizations.SearchFormModifiedOptionAfterText = "後";
localizations.SearchFormModifiedOptionBeforeText = "前";
localizations.SearchFormSizeOptionBiggerThanText = "より大きい";
localizations.SearchFormSizeOptionSmallerThanText = "より小さい";
localizations.SearchFormItemTypeOptionFileText = "ファイル";
localizations.SearchFormItemTypeOptionFolderText = "フォルダ";
localizations.SearchProcessNotificationText = "処理中... ";
localizations.SearchProcessCancelText = "キャンセル";
localizations.SearchItemsContextGoToParentText = "親フォルダに移動";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "このページのすべての<strong> {count} </strong>アイテムが選択されています。";
localizations.ItemsSelectionSelectAllItemsInDir = "<strong> {list_type} </strong>内のすべての<strong> {total_items} </strong>アイテム（非表示のアイテムを含む）を選択します。</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "<strong> {list_type} </strong>内のすべての<strong> {total_items} </strong>アイテム（非表示のアイテムを含む）が選択されています";
localizations.ItemsSelectionClearSelection = "明確な選択";
localizations.ItemsSelectionShowingFolderText = "現在のフォルダ";
localizations.ItemsSelectionShowingFilteredItemsText = "現在のフィルタリスト";
localizations.ItemsSelectionShowingSearchedItemsText = "検索結果";
//User options window
localizations.UserOptionsWindowHeaderText = "設定";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "' 'を隠すアイテム ";
localizations.UserOptionsWindowHideCheckboxLabelText = "チェックボックス列を非表示 ";
localizations.UserOptionsWindowHideFilterLabelText = "フィルタセクションを非表示 ";
localizations.UserOptionsWindowAutostartUploadLabelText = "アップロードするファイルを選択すると、アップロードが自動的に開始されます。 ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "インターフェースをロードするときは、Javaアプレットをロードしてください。";
localizations.UserOptionsWindowDisableWaveformLabelText = "インラインオーディオ再生を無効にする";
localizations.UserOptionsWindowDisableCompressionLabelText = "Javaアプレットで圧縮を無効にします。 ";
localizations.UserOptionsWindowChangePasswordHeaderText = "パスワードを変更してください ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "現在のパスワード: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "新しいパスワード: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "パスワードを確認:";
localizations.UserOptionsWindowChangePasswordButtonText = "パスワードを変更する";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "ランダムパスワードを生成する";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "これを使って";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "キャンセル";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "正しい現在のパスワードが入力されませんでした。";
localizations.ChangePasswordResetLinkExpiredText = "リンクが無効または期限切れです。";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "トグル";
localizations.MainCheckboxContextMenuCheckAllText = "すべてチェックする";
localizations.MainCheckboxContextMenuUncheckAllText = "すべてチェックを外す";
//Keywords window
localizations.KeywordsWindowHeaderText = "キーワード";
localizations.KeywordsWindowUpdateLinkText = "更新";
localizations.KeywordsWindowCancelLinkText = "キャンセル";
//File basket
localizations.BasketHeaderText = "バスケット内のファイル";
localizations.BasketClearAllLinkText = "すべてクリア";
localizations.BasketDownloadLinkText = "バスケットをダウンロードする";
localizations.BasketDownloadAdvancedLinkText = "バスケットの詳細をダウンロード";
localizations.BasketNoFilesAvailableText = "ファイルがありません";
localizations.BasketRemoveLinkText = "削除";
localizations.BasketTotalItemText = "{0}アイテム ";
localizations.BasketFileAddedAlreadyText = "ファイルはすでにバスケットに追加されています";
localizations.BasketFileAddedAlreadyDetailsText = "選択したファイルは既にバスケットに入っています";
localizations.BasketNothingSelectedToAddText = "バスケットに追加するものが選択されていません";
localizations.BasketNothingSelectedToAddDetailsText = "＆nbsp;";
localizations.BasketClearAllConfirmMessage = "バスケットで選択したファイルをすべて消去してよろしいですか？";
//Paste form panel
localizations.PasteFormHeaderText = "ペースト";
localizations.PasteFormResetButtonText = "リセット";
localizations.PasteFormPasteButtonText = "ペースト";
localizations.PasteFormErrorHeaderText = "ペースト中の問題";
localizations.PasteFormErrorDetailsText = "アイテムのペースト中に問題が発生しました。<br />エラー：{0}";
localizations.PasteFormErrorNothingToPasteText = "ペーストされたものは何もありません";
localizations.PasteSelectDirectoryWarning = "コピーしたアイテムをペーストする対象を選択してください";
localizations.PasteSelectSingleDirectoryWarning = "コピーしたアイテムをペーストする対象を1つ選択してください";
//Welcome form panel
localizations.WelcomeFormHeaderText = "ようこそ";
localizations.WelcomeFormOkButtonText = "OK";
//upload form panel
localizations.UploadFormHeaderText = "詳細をアップロード";
localizations.UploadFormOkButtonText = "OK";
localizations.UploadFormCancelButtonText = "キャンセル";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "スライドショー";
//Manage Share window
localizations.ManageShareWindowHeaderText = "共有を管理する";
localizations.ManageShareWindowRefreshLinkText = "更新";
localizations.ManageShareWindowDeleteSelectedLinkText = "選択したアイテムを削除する";
localizations.ManageShareWindowDeleteLinkText = "削除";
localizations.ManageShareWindowGridLinkLabelText = "リンク";
localizations.ManageShareWindowGridFromLabelText = "始めの日付";
localizations.ManageShareWindowGridToLabelText = "To";
localizations.ManageShareWindowGridCCLabelText = "CC";
localizations.ManageShareWindowGridBCCLabelText = "BCC";
localizations.ManageShareWindowGridReplyToLabelText = "返信先";
localizations.ManageShareWindowGridSubjectLabelText = "件名";
localizations.ManageShareWindowGridBodyLabelText = "内容";
localizations.ManageShareWindowGridShareTypeLabelText = "共有タイプ";
localizations.ManageShareWindowGridUserNameLabelText = "ユーザー名";
localizations.ManageShareWindowGridPasswordLabelText = "パスワード";
localizations.ManageShareWindowGridAttachedLabelText = "Eメールで添付？";
localizations.ManageShareWindowGridUploadLabelText = "アップロード許可？";
localizations.ManageShareWindowGridPathsLabelText = "パス";
localizations.ManageShareWindowGridCreatedLabelText = "作成済";
localizations.ManageShareWindowGridExpiresLabelText = "有効期限";
localizations.ManageShareWindowGridSharedItemsLabelText = "共有アイテム";
localizations.ManageShareWindowGridDownloadsLabelText = "ダウンロード";
localizations.ManageShareWindowNothingToShowMessageText = "何も表示されていない";
localizations.ManageShareWindowDeleteAccountConfirmationText = "選択した{数}アカウントを削除してもよろしいですか？";
localizations.ManageShareWindowFilterText = "フィルタ：";
localizations.ManageShareWindowClearFilterText = "クリア";
localizations.ManageShareWindowNextItemText = "次の";
localizations.ManageShareWindowPrevItemText = "前の";
localizations.ManageShareWindowSelectSimilarText = "類似を選択";
localizations.ManageShareWindowPageTitle = "CrushFTP  - 共有を管理する";
localizations.ManageShareWindowEditDialogTitle = "共有を編集する";
localizations.ManageShareWindowShareDetailsDialogTitle = "詳細を共有する";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "リネーム";
localizations.RenamePanelSaveLinkText = "保存";
localizations.RenamePanelCancelLinkText = "キャンセル";

localizations.ZipNameWindowHeaderText = "Zipファイル名";
localizations.ZipNamePanelSaveLinkText = "OK";
localizations.ZipNamePanelCancelLinkText = "キャンセル";

localizations.SyncAppNameWindowHeaderText = "同期アプリケーションのダウンロード";
localizations.SyncAppDownloadYourPassText = "ユーザーパスワード ： ";
localizations.SyncAppDownloadAdminPassText = "管理者パスワード ： ";
localizations.SyncAppNamePanelSaveLinkText = "OK";
localizations.SyncAppNamePanelCancelLinkText = "キャンセル";

//Tooltip info
localizations.TooltipNameLabelText = "名前";
localizations.TooltipPathLabelText = "パス";
localizations.TooltipSizeLabelText = "サイズ";
localizations.TooltipModifiedLabelText = "変更済";
localizations.TooltipKeywordsLabelText = "キーワード";

//Form alerts and notifications
localizations.FormValidationFailText = "1つ以上の必須項目が入力されていないか、正しく入力されていません。下の形式で、*で項目の適切な値を入力してください";
localizations.FormEmailValidationFailText = "<br>  - メールフィールドに有効なEメールアドレスを入力してください";
localizations.DeleteConfirmationMessageText = "{0}フォルダと{1}ファイルが削除されます。\n\nアイテム：{2}一度削除すると元に戻すことはできません。";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "フォルダ内のすべてのアイテム";
localizations.CopyActionGrowlText = "コピーされた{0}フォルダと{1}ファイルの合計。";
localizations.CutActionGrowlText = "合計{0}フォルダと{1}ファイルがカットされました。";
localizations.NothingSelectedGrowlText = "何も選択されていません";
localizations.ShareNothingSelectedGrowlText = "共有するものはありません";
localizations.DownloadNothingSelectedGrowlText = "ダウンロードするものが選択されていません";
localizations.RenameNothingSelectedGrowlText = "名前を変更するものが選択されていません";
localizations.PreviewNothingSelectedGrowlText = "プレビュー用に何も選択されていません";
localizations.NoPreviewGrowlText = "プレビュー";
localizations.NoPreviewGrowlDesc = "選択されたアイテムのプレビューはありません";
localizations.ProblemWhileRenamingGrowlText = "名前変更中の問題";
localizations.ProblemWhileRenamingDescGrowlText = "名前変更中に問題が発生しました。再試行してください。エラー ";
localizations.ProblemWhileSharingGrowlText = "共有中の問題";
localizations.ProblemWhileSharingDescGrowlText = "ファイルを共有中に問題が発生しました。再試行してください";
localizations.DirectLinkDescGrowlText = "アイテムを右クリックして、コピーダイレクトリンクをクリック";
localizations.UpdateKeywordDescGrowlText = "アイテムを右クリックして、更新キーワードをクリック";
localizations.QuickViewNothingToShowGrowlText = "エラー：クイックビューに表示するものはありません";
localizations.QuickViewNoItemsAvailableGrowlText = "利用可能なアイテムはありません";
localizations.QuickViewRotateClockwiseTooltipText = "時計回りに回転する";
localizations.QuickViewRotateCounterClockwiseTooltipText = "反時計回りに回転する";
localizations.QuickViewCurrentImagePositionText = "{合計}のアイテム{現在}";
localizations.ProblemWhileDeletingGrowlText = "削除中の問題";
localizations.ProblemWhileDeletingDescGrowlText = "削除中に問題が発生しました。再試行してください。エラー： ";
localizations.ProblemWhileUnzipGrowlText = "ファイルzip解凍中の問題";
localizations.ProblemWhileUnzipDescGrowlText = "zip解凍中に問題が発生しました。再試行してください。エラー： ";
localizations.ProblemWhileZipGrowlText = "ファイルzip圧縮中の問題";
localizations.ProblemWhileZipDescGrowlText = "zip圧縮中に問題が発生しました。再試行してください。エラー： ";
localizations.ProblemWhileCreatingFolderGrowlText = "新しいフォルダ作成中の問題";
localizations.ProblemWhileCreatingFolderDescGrowlText = "新しいフォルダを作成中に問題が発生しました。再試行してください。エラー： ";
localizations.JavaRequiredGrowlText = "必要なJava";
localizations.JavaRequiredDescGrowlText = "Java must be installed for the advanced functions to work.<br/><br/>Please go to: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "Javaロード中の問題";
localizations.JavaLoadingProblemDescGrowlText = "Java読み込み中に問題が発生しました。ブラウザでJavaが無効になっている場合は、有効にしてからもう一度お試しください。";
localizations.JavaAppletNotLoadedGrowlText = "ロードされていないJavaアプレット";
localizations.JavaAppletNotLoadedDescGrowlText = "ドラッグアンドドロップを有効にするには、まず[詳細参照]ボタンをクリックする必要があります。";
localizations.NoFilesFoundGrowlTitle = "バックエンドストレージが利用できません";
localizations.NoFilesFoundGrowlText = "エラー：ロケーションでバックエンドストレージを利用できません：";
localizations.AutoLogOutConfirmationTitle = "自動ログアウト";
localizations.AutoLogOutConfirmationDesc = "非アクティブ状態のためにログアウトしようとしています";
localizations.AutoLogOutButtonText = "ログイン中";
localizations.AutoLogOutMsg = "非アクティブ状態のためにログアウトされています";
localizations.AutoLogOutLoginButtonText = "もう一度ログインしてください。";
//Treeview header items
localizations.TreeviewHeaderNameText = "名前";
localizations.TreeviewHeaderPathText = "パス";
localizations.TreeviewHeaderSizeText = "サイズ";
localizations.TreeviewHeaderModifiedText = "変更済";
localizations.TreeviewHeaderKeywordsText = "キーワード";
//Selection menu items
localizations.SelectItemOptionLinkText = "選択";
localizations.SelectCheckboxContextMenuToggleText = "トグル";
localizations.SelectCheckboxContextMenuCheckAllText = "全てのアイテム";
localizations.SelectCheckboxContextMenuUncheckAllText = "該当なし";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "すべてのファイル";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "すべてのフォルダ";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "\で始まるアイテム";
localizations.SelectCheckboxContextMenuCheckTodayText = "本日の修正";
localizations.SelectCheckboxContextMenuCheckWeekText = "今週の修正";
localizations.SelectCheckboxContextMenuCheckMonthText = "今月の修正";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "過去60日間の変更";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "過去90日間の変更";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "ページに{0}アイテムを表示";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "アップロードするアイテムを選択してください。";
localizations.advancedDownloadPathSelectionWindowTitle = "ダウンロード先のパスを選択してください。";
localizations.advancedOperationsDownloadStatus = "ダウンロード中";
localizations.advancedOperationsUploadStatus = "アップロード中";

localizations.maxAllowedDownloadSizeReached = "ダウンロードサイズが最大許容サイズを超えました";
localizations.maxAllowedDownloadSizeReachedText = "ダウンロード可能な最大サイズ{サイズ}。<br />アドバンストダウンローダーを使用するか、代わりにバスケットに追加してください。";

//Audio player
localizations.AudioPlayerPlayText = "再生";
localizations.AudioPlayerPauseText = "一時停止";
localizations.AudioPlayerStopText = "停止";
localizations.AudioPlayerMuteText = "ミュート";
localizations.AudioPlayerUnmuteText = "ミュートを解除";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "アイコンを変更 ";
localizations.ChangeIconWindowInstructionsText = "選択したアイテムのアイコンとして設定する小さな画像を選択します。";
localizations.ChangeIconWindowSelectedFilesLabelText = "選択ファイル： ";
localizations.ChangeIconWindowCancelLinkText = "キャンセル";
localizations.ChangeIconWindowUpdateLinkText = "保存";
localizations.ChangeIconFileSelectAlertText = "続行するには画像ファイルを選択してください。";

//unzip operation
localizations.UnzipStartedAlertTitleText = "zip解凍が始まりました";
localizations.UnzipStartedAlertDescText = "選択したファイルのzip解凍が開始されました";
localizations.UnzipCompletedAlertTitleText = "zip解凍が完了しました";
localizations.UnzipCompletedAlertDescText = "選択したファイルのzip解凍が完了しました";

//zip operation
localizations.ZipStartedAlertTitleText = "圧縮が始まりました";
localizations.ZipStartedAlertDescText = "選択ファイルに対してzip圧縮が開始されました";
localizations.ZipCompletedAlertTitleText = "zip圧縮が完了しました";
localizations.ZipCompletedAlertDescText = "選択ファイルのzip圧縮が完了しました";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "登録完了： ";
localizations.RegisterWindowProcessCompleteMessage = "管理者によって有効となったら、登録ユーザーを使用してログインできます。";
localizations.RegisterWindowProcessFailedMessage = "<strong>登録が失敗する理由はいくつかあります。</strong> <br> <br>  - ユーザー名は既に使用されています。<br>  - サーバーは一時的に登録を許可していません。  <br> <br>もう一度やり直すか、管理者に連絡してください。";

//Data size format items
localizations.dataByClassFormatBytes = "バイト";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "お待ちください...";

localizations.bytesSentLabelTextByClass = "送信：";
localizations.bytesReceivedLabelTextByClass = "受信：";
localizations.dirInfoDownloadLabelTextByClass = "ダウンロード： ";
localizations.dirInfoUploadLabelTextByClass = "アップロード： ";
localizations.maxAndAvailableAmountLabelTextByClass = "利用可能/最大：";
localizations.maxAmountPerDayLabelTextByClass = "1日あたり：";
localizations.quotaAvailableTextByClass = "利用可能";
localizations.maxAmountPerMonthLabelTextByClass = "月あたり：";

//Server message localized
localizations.share_complete = "公開が完了しました。";
localizations.share_email_sent = "メールメッセージを送信しました。";
localizations.share_open_in_email_client = "メールクライアントで開く";
localizations.email_failed = "<div class = 'errorMessage'> SMTPはEメールを送信できませんでした。  サーバーログを確認してください。</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "読み込みに失敗しました： ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "エラー：アクセスが拒否されました。（権限がないか、ファイル拡張子が許可されていません。）";
localizations.FileUploadContentNotAllowedErrorMsgText = "エラー：550エラー：ファイルの内容は許可されていません。";
localizations.FileUploadCanNotOverwriteErrorMsgText = "エラー：ファイルを上書きできません。";

localizations.CustomEventCallSuccessTitle = "成功";
localizations.CustomEventCallSuccessDesc = "カスタムイベント開始";
localizations.CustomEventCallFailureTitle = "失敗";
localizations.CustomEventCallFailureDesc = "カスタムイベントの実行中に問題が発生しました";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "詳細オプション";
localizations.advancedDownloadOptionsButtonText = "詳細なダウンロードオプション";
localizations.advancedUploadOptionsDialogSaveButtonText = "保存";
localizations.advancedUploadOptionsItemAvailableLabel = "既存アイテムが見つかった場合";
localizations.advancedUploadOptionsUseCompressionLabel = "圧縮を使う：";
localizations.advancedUploadOptionsAskActionDialogTitle = "アクションを確認してください";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "ファイルに対するアクションを確認してください。";
localizations.advancedUploadOptionsAskActionLabelByClass = "アクション：";
localizations.advancedUploadOptionsAskActionDialogBtnText = "OK";
localizations.advancedUploadActionOverWriteSelectOptionText = "上書きする";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "すべて上書き";
localizations.advancedUploadActionResumeSelectOptionText = "再開";
localizations.advancedUploadActionResumeAllSelectOptionText = "すべて再開";
localizations.advancedUploadActionSkipSelectOptionText = "スキップ";
localizations.advancedUploadActionSkilAllSelectOptionText = "すべてスキップ";
localizations.advancedUploadActionAskSelectOptionText = "尋ねる";
localizations.advancedUploadActionCompressionYesSelectOptionText = "はい";
localizations.advancedUploadActionCompressionNoSelectOptionText = "いいえ";
localizations.MaxUploadFilesCountReachedGrowlText = "最大ファイル数を超えました";
localizations.MaxUploadFilesCountReachedGrowlDesc = "アップロードが許可されているファイルの最大数を超えました。アップロードが許可されているファイル最大数：";

localizations.LoggedInAsLabelText = "ログイン： ";
localizations.AccountExpiresOnLabelText = "有効期限： ";
localizations.maxListItemsWarningMessage = "大規模なディレクトリリストは、重大なパフォーマンス問題を引き起こします。パフォーマンスの問題を防ぐために、アイテムをサブフォルダに整理することをお勧めします。";
if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "（セッションタイムアウト、%time%）";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "お待ちください...",
    playSlideshow : "スライドショーを再生する",
    pauseSlideshow : "スライドショーを一時停止",
    refresh : "更新",
    fullscreen : "全画面表示",
    download : "ダウンロード",
    upload : "アップロード",
    deleteText : "削除",
    rotateClockwise : "時計回りに回転する",
    rotateCounterClockwise : "反時計回りに回転する",
    previousItem : "前のアイテム",
    nextItem : "次のアイテム",
    delayText : "（遅延{x}秒）",
    nextPageText : "次へ＆rsaquo;",
    prevPageText : "＆lsaquo; 前の",
    itemCountText : "（{y}の{x}アイテム）",
    noItemMessage : "<h3 style = 'text-align：center;'>利用可能なアイテムがないか、レコードを取得中に問題が発生しました。</h3>"
};

localizations.uploadPanel = {
    uploadWindowTitle : "アップロードするファイル",
    dragDropMsg : "ここにファイルをドラッグ＆ドロップする",
    remove : "削除",
    removeAllSelected : "すべて選択",
    removeAllWithError : "すべてエラーあり",
    removeAllUploaded : "すべてアップロード済み",
    removeAllCancelled : "すべてキャンセル",
    removeAllSkipped : "すべてスキップ",
    removeAll : "すべて",
    addFiles : "追加ファイル...",
    upload : "アップロード",
    uploadSelected : "選択したアップロード",
    reuploadAll : "すべて再アップロード",
    cancel : "キャンセル",
    uploadDetails : "詳細をアップロード",
    overwriteAll : "すべて上書き",
    resumeAll : "すべて再開",
    shareUploaded : "アップロードされた共有",
    quickFilterSubtext : "クイックフィルター...",
    total : "合計",
    filesFailed : "ファイルが失敗しました。",
    selectedFiles : "選択ファイル",
    size : "サイズ：",
    filtered : "（フィルタリング）",
    totalFiles : "合計ファイル数",
    scrollWithActivity : "活動をスクロール",
    writingFile : "ファイルを書き込んでいます...",
    decompressingFile : "ファイルを解凍しています...",
    pleaseWait : "お待ちください...",
    uploadedIn : "アップロード",
    aMoment: "モーメント",
    atAvgSpeedOf : "平均速度",
    uploadingFailed : "アップロードに失敗しました",
    canceled : "キャンセル",
    skipped : "スキップしました",
    currentSpeed : "現在の速度：",
    averageSpeed : "平均速度 ：",
    of: "の",
    elapsed : "経過",
    remaining : "残り",
    waiting : "待機中…",
    details : "詳細",
    overwrite : "上書き",
    resume : "再開",
    reupload : "再アップロード",
    pause : "一時停止",
    paused : "一時停止",
    uploading : "アップロード中",
    items : "アイテム",
    skip : "スキップ",
    cancelAll : "すべてキャンセル",
    OK : 'Yes',
    CANCEL : 'No',
    CONFIRM : "はい",
    reuploadConfirmation : "アップロード中にアップロード済み、キャンセル済み、スキップ済み、または失敗したすべてのファイルを再アップロードし、既存のファイルを上書きします。続けますか？",
    folderUploadNotSupported : "このブラウザではフォルダのアップロードはサポートされていません",
    fileAlreadySelected : "同じ場所にアップロードするファイルが既に追加されています。",
    fileExistsOnServer : "サーバー上で使用可能な同じ名前のファイル。",
    fileSizeExceed : "ファイルサイズを超えています。",
    fileTypeNotAllowed : "ファイルタイプは許可されていません。",
    filterApplied : "適用フィルタ",
    noMatchingItemAvailable : "該当アイテムはありません。",
    addFilesToUpload : "アップロードするファイルを追加しています...",
    file : "ファイル",
    reason : "理由",
    failedItems : "失敗したアイテム",
    ignoreAll : "すべて無視",
    retryAll : "すべて再試行",
    failedOpeningFile : "バックエンドストレージが利用できません。",
    cancelConfirmation : "アップロードをキャンセルしてよろしいですか？",
    failedClosingFile : "ファイルのクローズに失敗しました",
    failedWileRetryingChunk : "チャンクのアップロードを再試行中に失敗しました。",
    retryingFile : "アップロードファイルの再試行",
    In: "に",
    seconds : "秒",
    skipFile : "ファイルをスキップ",
    retryNow : "今すぐ再試行",
    retryingClosingFile : "クローズファイルの再試行",
    fileExistConfirmation : "同じサイズのファイル[1]が存在します。ファイルを再送信しますか？",
    bigFileOverwriteConfirmation : "サーバー上のファイル[1]がアップロードされているファイルよりも大きい場合、上書きしますか？",
    fileExistsOnServerConfirmation : "サーバーにファイル[1]が存在します",
    fileActionTitle : "このファイルをどうするかを選択してください。",
    applyToAll : "すべてに適用",
    retryingOpeningFile : "オープニングファイルの再試行",
    secondsAbbr : "秒",
    minutesAbbr : "分",
    hoursAbbr : "時間",
};