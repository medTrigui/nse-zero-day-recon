//English
/*Login page specific*/
localizations.BadLoginInfoText = "用户名、密码错误，或您的账户已经过期.";
localizations.ServerErrorInfoText = "该服务已停止，或者您的IP被禁止访问，请联系管理员";
localizations.PasswordsDoNotMatchAlertText = "新密码不匹配";
localizations.LoginAgainTitleText = "请重新登陆";
localizations.LoginWithNewPassText = "请用旧密码登陆";
localizations.AuthenticatingMsgText = "认证中.....";
localizations.LoginSuccessText = "登陆成功";
localizations.LoadingWebInterfaceText = "加载web页面...";
localizations.LoginWarningText = "警告";
localizations.MultipleBadLoginsAlertDescText = "因多次错误登陆您的IP已被禁止.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'>请点击 <a style='color:white;' href='/WebInterface/jQuery/reset.html'>这里</a> 重置密码.</div>";
localizations.LoginFailedText = "登陆失败";
localizations.ChangePasswordGrowlTitleText = "更改密码";
localizations.UserNameText = "用户名";
localizations.PasswordText = "密码";
localizations.LoginButtonText = "登陆";
localizations.ForgotPasswordLinkText = "忘记密码，请发邮件给我.";
localizations.ChangePasswordHeaderText = "更改您的密码";
localizations.ChangePasswordNoteText = "请更改密码后继续";
localizations.CurrentPasswordText = "原密码 : ";
localizations.NewPasswordText = "新密码 : ";
localizations.ConfirmPasswordText = "确认新密码 : ";
localizations.CancelButtonText = "取消";
localizations.ChanngePasswordButtonText = "更改密码";
localizations.GeneratePasswordButtonText = "生成随机密码";
localizations.GeneratePasswordUseButtonText = "使用";
localizations.GeneratePasswordCancelButtonText = "取消";
localizations.OldBrowserNoticeHTMLAsText = 'Your browser is out of date, it was released almost a decade ago! As a result it is very slow, full of bugs, and this WebInterface may or may not even work with IE6.<br><br><div style="text-align:right;"><button id="proceedAnyway">Proceed Anyway Cautiously</button> or get a better browser:<a href="http://chrome.google.com/">Chrome</a> | <a href="http://www.getfirefox.com/">FireFox</a></div>';


localizations.ItemsPerPageText = "每页显示条目数 : ";
localizations.LayoutChangeLabelText = "布局 : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "文件超出系统最大限制",
            "minFileSize": "文件低于系统最小限制",
            "acceptFileTypes": "系统不允许上传此类文件",
            "maxNumberOfFiles": "超出文件最大上传输量",
            "uploadedBytes": "Uploaded bytes exceed file size",
            "emptyResult": "Empty file upload result",
            "fileAvailableInSelectedFolder": "该目录下已有同名文件",
            "fileExistOnServer": "服务器上已存在该文件",
            "fileBiggerThanAllowed": "文件超出系统允许大小",
            "dirNoWritable": "该目录不允许上传文件",
            "blockUploadingDirs": "系统不允许上传文件夹",
            "true": "true"
        },
        "error": "错误",
        "start": "开始",
        "waiting": "等待...",
        "uploading": "上传 : ",
        "reupload": "重新上传",
        "share": "共享",
        "cancel": "取消",
        "destroy": "删除",
        "overwrite": "覆盖",
        "uploadTo": "上传到 : ",
        "pause": "暂停",
        "errorLabel": "错误 : ",
        "details": "详情",
        "uploadedInLabelText": "Uploaded in : ",
        "atAvgSpeedOfLabelText": "上传平均速度 : ",
        "uploadCompletedText": "上传结束",
        "uploadedFileText": "文件已上传到服务器",
        "uploadedMultipleFilesText": "所有文件上传完毕."
    }
};

localizations.buttons = {
    "admin": "后台管理",
    "delete": "删除",
    "rename": "修改名称",
    "download": "下载",
    "advanced download": "下载高级选项",
    "zipdownload": "压缩下载",
    "unzip": "解压缩",
    "zip selected": "Zip Selected",
    "explore zip contents": "Explore zip contents",
    "create folder": "创建文件夹",
    "upload": "上传",
    "search": "查找",
    "user options": "用户属性",
    "cut": "剪切",
    "copy": "复制",
    "paste": "粘贴",
    "slideshow": "幻灯片",
    "quickview": "快速查看",
    "download low-res": "Download Low-Res",
    "preview": "预览",
    "batchcomplete": "BatchComplete",
    "share": "Share",
    "quick share": "Quick Share",
    "manage shares": "Manage Shares",
    "show basket": "Show Basket",
    "add to basket": "Add To Basket",
    "edit keywords": "Edit Keywords",
    "change icon": "Change Icon",
    "download crushtunnel": "Download CrushTunnel",
    "help": "帮助",
    "login": "登陆",
    "logout": "注销",
    "download sync app": "下载同步工具",
    "download crushftpdrive": "下载 CrushFTPDrive",
    "sync manager": "同步管理器"
};

localizations.currentLanguageName = "Chinese"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "英语 (English)";
localizations.languageNameCzech = "捷克语 (Čeština)";
localizations.languageNameDanish = "丹麦语 (Danske)";
localizations.languageNameDutch = "荷兰语 (Nederlands)";
localizations.languageNameFrench = "法语 (Français)";
localizations.languageNameGerman = "德语 (Deutsch)";
localizations.languageNameHungarian = "匈牙利语 (Magyar)";
localizations.languageNameItalian = "意大利语 (Italiano)";
localizations.languageNamePolish = "波兰语 (Polskie)";
localizations.languageNameSpanish = "西班牙语 (Español)";
localizations.languageNameSlovak = "斯洛法克的 (Slovenský)";
localizations.languageNameSwedish = "Swedish (Svenska)";
localizations.languageNameChinese = "英语";
localizations.languageNameJapanese = "Japanese (日本語)";

//WebInterface
localizations.FilterText = localizations.FilterTextBasket = "检索项:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "清除";
localizations.FileCounterItemsText = "条目";
localizations.FileCounterFoldersText = "文件夹";
localizations.FileCounterFilesText = "文件";
localizations.FileCounterHiddenItemsText = "隐藏条目";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "图标视图";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "目录视图";
localizations.DownloadResumeTextLabelBasket = "继续"
localizations.BackToTopLinkText = "回到顶部";
localizations.FilesNotAvailableMessage = "无可用文件";
localizations.CopyNoFilesSelectedMessage = "请选择您要复制的文件或文件夹";
localizations.CopyOnlyFilesMessage = "您只能剪切或拷贝文件，文件夹将无法进行操作";
localizations.DeleteNoFilesSelectedMessage = "请选择您要删除的文件或文件夹";
localizations.UnzipNoFilesSelectedMessage = "请选择您要压缩的文件";
localizations.ZipExploreNoFilesSelectedMessage = "Please select zip to explore";
localizations.CutNoFilesSelectedMessage = "请选择您要剪贴的文件或文件夹";
localizations.pagingPrevText = "上一页";
localizations.pagingNextText = "下一页";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(符合 \"{filterVal}\"的条目数量 : {totalItems} , 文件夹: {folders} 文件: {files})";
localizations.TotalItemsInDirMsgText = " (该目录内条目总数 {count}) ";
localizations.quotaAvailableLabelText = "可用";

localizations.WelcomeNoteSubmitFormFailureMsgText = "警告：保存数据时发生错误";
localizations.TreeviewSpecificActionMsgTitleText = "只适用于目录视图";
localizations.TreeviewSpecificActionMsgDescText = "这个只适于用目录视图";
localizations.PasswordExpiringMsgText = "密码即将过期<br/>请及时更改.";
localizations.PasswordNotMatchingMsgText = "新密码不匹配.";
localizations.PasswordMustBeComplexMsgText = "请提高密码的复杂度.";
localizations.PasswordChangedMsgText = "密码已变更，请使用新密码登陆系统.";
localizations.AppletLoadingFailedMsgText = "Applet装载错误";
localizations.DownloadStartedAlertTitleText = "下载已经开始";
localizations.DownloadCompletedText = "[下载完成]";
localizations.DownloadCompletedPathText = " 下载到 : ";
localizations.DownloadStartedAlertDescText = "请选择本地文件存放位置";
localizations.LogoutButtonText = "注销";
localizations.browserUploaderNativeUploadTipSetTitle = "使用浏览器上传工具进行删除.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "使用高级上传工具上传, <br>该工具允许上传文件夹，并提高了上传速度.";
localizations.browserUploaderDragDropHoverLabelText = "请将文件拖曳到此处，即可上传";
localizations.appletUploaderDropPanelLabelText = "&darr; 请将文件拖到此处 &darr;";

//Sharing Window
localizations.ShareWindowHeaderText = "Sharing Files";
localizations.ShareWindowFilesSharingLabelText = "Sharing :";
localizations.ShareWindowShareTypeLabelText = "Share Type :";
localizations.ShareWindowShareTypeLabelCopyText = "复制";
localizations.ShareWindowShareTypeLabelMoveText = "移动";
localizations.ShareWindowShareTypeLabelReferenceText = "Reference";
localizations.ShareWindowShareToInternalUserLabelText = "Internal Share";
localizations.ShareWindowShareToExternalUserLabelText = "External Share";
localizations.ShareWindowDownloadLabelText = "下载";
localizations.ShareWindowUploadLabelText = "上传";
localizations.ShareWindowDeleteLabelText = "删除";
localizations.ShareWindowSendEmailLabelText = "发送邮件 :";
localizations.ShareWindowDirectLinkLabelText = "Direct link to file?";
localizations.ShareWindowExpiresLabelText = "过期时间 :";
localizations.ShareWindowFromLabelText = "从 : ";
localizations.ShareWindowToLabelText = "到 : ";
localizations.ShareWindowCCLabelText = "抄送 : ";
localizations.ShareWindowBCCLabelText = "暗送 : ";
localizations.ShareWindowSubjectLabelText = "主题 : ";
localizations.ShareWindowBodyLabelText = "内容 : ";
localizations.ShareWindowAdvancedLabelText = "高级";
localizations.ShareWindowAttachThumbsLabelText = "添加图标";
localizations.ShareWindowAttachFileLabelText = "添加文件";
localizations.ShareWindowAccessLabelText = "Full Access ";
localizations.ShareWindowSendButtonText = "发送";
localizations.ShareWindowCancelButtonText = "取消";
localizations.ShareWindowUsernameMethodLabelText = "Share Method : ";
localizations.ShareWindowUsernameLabelText = "Share to Internal User";
localizations.ShareWindowUsernamesLabelText = "用户名 : ";
localizations.ShareWindowUsernamesLabelHelpText = "(多用户之间请用逗号隔开.)";
localizations.ShareActionCompleteShareUsernamesText = "The following users have now been granted access to the shared items.";
localizations.ShareActionCompleteUsernameText = "用户名: ";
localizations.ShareActionCompletePasswordText = "密码: ";
localizations.ShareActionCompleteLinkText = "链接";
localizations.ShareActionCompleteOkButtonText = "OK";
localizations.ShareActionEmailValidationFailureHelpToolTip = "请输入有效地邮件地址，如果是多邮件地址，请用逗号隔开 ie. <strong>yanzhang.gao@hirain.com, chao.meng@hirain.com,...</strong>";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "Copy direct link.";
localizations.CopyLinkText = "复制链接";
//Create folder window
localizations.CreateFolderWindowHeaderText = "创建文件夹.";
localizations.CreateFolderInputDefaultFolderName = "新文件夹";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "创建后转到该文件夹 ";
localizations.CreateFolderButtonText = "创建";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "上传文件";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "上传详情";
localizations.BrowserUploaderUploadFilesTabHeaderText = "上传文件";
localizations.BrowserUploaderAdvancedBrowseButtonText = "高级选项..";
localizations.BrowserUploaderStartUploadingLinkText = "开始上传";
localizations.BrowserUploaderClearCompletedLinkText = "Clear Completed";
localizations.BrowserUploaderResumeCheckboxText = "继续";
localizations.BrowserUploaderFormResetButtonText = "重置";
localizations.BrowserUploaderFormNextButtonText = "下一个";
localizations.BrowserUploaderFileAddedAlreadyText = "该文件已被添加.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} 文件已被添加.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "这些文件已被添加.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} 文件已被添加.";
localizations.BrowserUploaderSelectedFilesGroupText = "File Group : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "移除";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "将上传到";
localizations.BrowserUploaderSelectedFileOverwriteText = "覆盖";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "将被覆盖";
localizations.BrowserUploaderSelectedFileExistsText = "文件已存在";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "请注意";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "忽略";
localizations.BrowserUploaderSelectedFileDoneText = "完成";
localizations.BrowserUploaderSelectedFileUploadedText = "上传到";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "重新上传";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "重新下载";
localizations.BrowserUploaderSelectedFileDismissLinkText = "Dismiss";
localizations.BrowserUploaderSelectedFileCancelLinkText = "取消";
localizations.BrowserUploaderSelectedFilePauseLinkText = "暂停";
localizations.BrowserUploaderSelectedFilePausedStatusText = "已暂停";
localizations.BrowserUploaderSelectedFileResumeLinkText = "继续";
localizations.BrowserUploaderAdvancedUploadingFilesText = "共 {0} 文件";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{0} of {1} item(s) ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "正在上传到 : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "当前速率 : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "平均速率 : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> 时间: 已用: <span class='elapsed'>{0}</span> <span class='remained'>, 剩余 : {1}</span></div>";
localizations.BatchCompleteText = "结果";
localizations.BatchComplete = "Transfers Acknowledged.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "计算中..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "传输失败";
localizations.BrowserUploaderCancelledUploadMsgText = "取消上传";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "您目前有正在上传中的文件，离开此页面将取消上传，请确认是否离开？";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "您目前有正在下载中的文件，离开此页面将取消下载，请确认是否离开？";
localizations.NoUploadInDirGrowlText = "不允许上传";
localizations.NoUploadInDirGrowlDesc = "您选择的目录不允许上传";
localizations.AdvancedUploadDirNotAllowedText = "不允许上传文件夹";
localizations.AdvancedUploadDirNotAllowedDescText = "无法上传文件夹，请选择文件进行上传";
localizations.uploadConfirmCancelUploadText = "确定取消上传?";
localizations.uploadConfirmCancelUploadAfterFormText = "Are you sure you wish to cancel upload for last selected {count} item(s)?";

//New upload bar localizations
localizations.browseFileLabelByClass = "添加文件...";
localizations.advancedUploadResumeLabelByClass = "继续";
localizations.filesToUploadQueueWindowHeader = "Files to upload";
localizations.uploadWindowStartUploadingByClass = "开始上传";
localizations.uploadWindowCancelUploadingByClass = "取消上传";
localizations.uploadWindowClearUploadedByClass = "清除已上传文件";
localizations.uploadWindowOverwriteAllByClass = "全部覆盖";
localizations.uploadWindowRemoveAllWithErrorsByClass = "删除所有错误文件";
localizations.uploadWindowSummaryFilesByClass = "文件 : ";
localizations.uploadWindowSummarySizeByClass = ", 上传大小 : ";
localizations.uploadBarShowHideFilesSetTitleClass = "显示/隐藏所选文件";
localizations.uploadBarAttentionTitle = "Now add files from upload bar";
localizations.uploadBarAttentionText = "Use upload bar to add files to upload. Click on \"" + localizations.browseFileLabelByClass + "\" button to add files";
localizations.uploadBiggerFileNoticeTitleText = "For bigger files use advanced upload";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>It is advised to use advanced upload for bigger files, it allows to upload files easily and has <em>auto resume</em> feature. <br><br> (You can switch upload mode in Upload Bar)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='How to switch upload mode'>";

localizations.globalProgressbarSkipLabelByClass = "跳过";
localizations.globalProgressbarPauseLabelByClass = "暂停";
localizations.globalProgressbarStopLabelByClass = "停止";

localizations.popupOpenInSeparateWindowText = "新窗口打开";
localizations.customFormPasswordMatchValidationFailedText = "密码不匹配";
localizations.customFormCompareValueMatchValidationFailedText = "Values does not match";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "切换到普通上传";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "切换到高级上传.<div style='font-size:11px;width:500px;margin:5px 0px;'>该传输模式将提高传输速率.可断点续传,并且可以上传文件夹.<br><br>It is the fastest way to upload files.<br>(Advanced mode requires the Java Applet plugin from www.java.com to be installed.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "查找";
localizations.SearchWindowKeywordsLabelText = "关键词 :";
localizations.SearchWindowExactLabelText = "准确查询?";
localizations.SearchWindowByClassModifiedLabelText = "已更新";
localizations.SearchWindowByClassDateFormatLabelText = "(mm/dd/yyyy) ";
localizations.SearchWindowSizeLabelText = "大小 ";
localizations.SearchWindowTypeLabelText = "类型";
localizations.SearchWindowSizeLabelText = "大小 ";
localizations.SearchWindowSizeUnitLabelTextByClass = "(Kilobytes)";
localizations.SearchWindowSearchButtonText = "开始查找";
localizations.SearchWindowCancelButtonText = "取消";
localizations.SearchResultDisplayText = "查找结果:";
localizations.SearchResultClearLinkText = "(清除查找条件)";
localizations.SearchFormModifiedOptionAfterText = "之后";
localizations.SearchFormModifiedOptionBeforeText = "之前";
localizations.SearchFormSizeOptionBiggerThanText = "大于";
localizations.SearchFormSizeOptionSmallerThanText = "小于";
localizations.SearchFormItemTypeOptionFileText = "文件";
localizations.SearchFormItemTypeOptionFolderText = "文件夹";
localizations.SearchProcessNotificationText = "处理中... ";
localizations.SearchProcessCancelText = "取消";
localizations.SearchItemsContextGoToParentText = "回上级目录";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "此页面共选择了 <strong>{count}</strong> 个条目.";
localizations.ItemsSelectionSelectAllItemsInDir = "Select all <strong>{total_items}</strong> items in <strong>{list_type}</strong> (including hidden items)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "All <strong>{total_items}</strong> items in <strong>{list_type}</strong> (including hidden items) are selected";
localizations.ItemsSelectionClearSelection = "清除选择";
localizations.ItemsSelectionShowingFolderText = "当前目录";
localizations.ItemsSelectionShowingFilteredItemsText = "当前过滤条件";
localizations.ItemsSelectionShowingSearchedItemsText = "查找结果";
//User options window
localizations.UserOptionsWindowHeaderText = "选项";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "隐藏 '.' 条目 ";
localizations.UserOptionsWindowHideCheckboxLabelText = "隐藏复选框列 ";
localizations.UserOptionsWindowHideFilterLabelText = "Hide Filter Section ";
localizations.UserOptionsWindowAutostartUploadLabelText = "当传中上传文件，自动启动上传. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "When loading the interface, load the Java applet.";
localizations.UserOptionsWindowDisableCompressionLabelText = "Disable compression on the Java applet. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "更改您的密码 ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "当前密码: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "新密码: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "重复新密码:";
localizations.UserOptionsWindowChangePasswordButtonText = "更改密码";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "生成随机密码";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "确定使用";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "取消";
//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "Toggle";
localizations.MainCheckboxContextMenuCheckAllText = "全选";
localizations.MainCheckboxContextMenuUncheckAllText = "取消全选";
//Keywords window
localizations.KeywordsWindowHeaderText = "关键词";
localizations.KeywordsWindowUpdateLinkText = "更新";
localizations.KeywordsWindowCancelLinkText = "取消";
//File basket
localizations.BasketHeaderText = "管理器中的文件";
localizations.BasketClearAllLinkText = "清除所有";
localizations.BasketDownloadLinkText = "下载管理器";
localizations.BasketDownloadAdvancedLinkText = "高级下载管理器";
localizations.BasketNoFilesAvailableText = "无可用文件";
localizations.BasketRemoveLinkText = "移除";
localizations.BasketTotalItemText = "{0} 条目 ";
localizations.BasketFileAddedAlreadyText = "文件已被添加到管理器";
localizations.BasketFileAddedAlreadyDetailsText = "所选文件已在管理器中";
localizations.BasketNothingSelectedToAddText = "请选择文件添加到管理器";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "您是否确认清除管理器中所有文件？";
//Paste form panel
localizations.PasteFormHeaderText = "粘贴";
localizations.PasteFormResetButtonText = "重置";
localizations.PasteFormPasteButtonText = "粘贴";
localizations.PasteFormErrorHeaderText = "粘贴出现未知错误";
localizations.PasteFormErrorDetailsText = "在粘贴过程中出现错误.<br />详情 : {0}";
localizations.PasteFormErrorNothingToPasteText = "粘贴对象不存在";
localizations.PasteSelectDirectoryWarning = "请选择需要复制的文件";
localizations.PasteSelectSingleDirectoryWarning = "请选择单个文件进行复制";
//Welcome form panel
localizations.WelcomeFormHeaderText = "欢迎";
localizations.WelcomeFormOkButtonText = "OK";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "幻灯片";
//Manage Share window
localizations.ManageShareWindowHeaderText = "Manage Shares";
localizations.ManageShareWindowRefreshLinkText = "刷新";
localizations.ManageShareWindowDeleteSelectedLinkText = "删除选中项目";
localizations.ManageShareWindowDeleteLinkText = "删除";
localizations.ManageShareWindowGridLinkLabelText = "链接";
localizations.ManageShareWindowGridFromLabelText = "从";
localizations.ManageShareWindowGridToLabelText = "到";
localizations.ManageShareWindowGridCCLabelText = "抄送";
localizations.ManageShareWindowGridBCCLabelText = "暗送";
localizations.ManageShareWindowGridSubjectLabelText = "主题";
localizations.ManageShareWindowGridBodyLabelText = "内容";
localizations.ManageShareWindowGridShareTypeLabelText = "Share Type";
localizations.ManageShareWindowGridUserNameLabelText = "用户名";
localizations.ManageShareWindowGridPasswordLabelText = "密码";
localizations.ManageShareWindowGridAttachedLabelText = "分享内容是否作为邮件附件发送?";
localizations.ManageShareWindowGridUploadLabelText = "是否允许上传?";
localizations.ManageShareWindowGridPathsLabelText = "路径";
localizations.ManageShareWindowGridCreatedLabelText = "已创建";
localizations.ManageShareWindowGridExpiresLabelText = "过期时间";
localizations.ManageShareWindowGridSharedItemsLabelText = "分享条目";
localizations.ManageShareWindowGridDownloadsLabelText = "下载";
localizations.ManageShareWindowNothingToShowMessageText = "无显示内容";
localizations.ManageShareWindowDeleteAccountConfirmationText = "你是否确认删除选中共 {count} 个账户 ?";
localizations.ManageShareWindowFilterText = "过滤条件 :";
localizations.ManageShareWindowClearFilterText = "清除";
localizations.ManageShareWindowNextItemText = "下一个";
localizations.ManageShareWindowPrevItemText = "上一个";
localizations.ManageShareWindowSelectSimilarText = "Select Similar";
localizations.ManageShareWindowPageTitle = "CrushFTP - Manage Shares";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "重命名";
localizations.RenamePanelSaveLinkText = "保存";
localizations.RenamePanelCancelLinkText = "取消";

localizations.ZipNameWindowHeaderText = "压缩文件名称";
localizations.ZipNamePanelSaveLinkText = "完成";
localizations.ZipNamePanelCancelLinkText = "取消";

localizations.SyncAppNameWindowHeaderText = "同步小工具下载";
localizations.SyncAppDownloadYourPassText = "您的密码 : ";
localizations.SyncAppDownloadAdminPassText = "管理密码 : ";
localizations.SyncAppNamePanelSaveLinkText = "完成";
localizations.SyncAppNamePanelCancelLinkText = "取消";

//Tooltip info
localizations.TooltipNameLabelText = "名称";
localizations.TooltipPathLabelText = "路径";
localizations.TooltipSizeLabelText = "大小";
localizations.TooltipModifiedLabelText = "更新";
localizations.TooltipKeywordsLabelText = "关键词";

//Form alerts and notifications
localizations.FormValidationFailText = "下表中标有*的项目为必填项，请正确填写";
localizations.FormEmailValidationFailText = "<br> - 请在邮件一栏中填写有效的邮件地址";
localizations.DeleteConfirmationMessageText = "{0} 文件夹和 {1} 文件将被删除.\n\n条目: {2} 一旦被删除，将无法恢复.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "文件夹 \"{folder_name}\" 中的所有条目将被删除.\n\n共删除 {count} 条.\n\n一旦删除将无法恢复";
localizations.CopyActionGrowlText = "共 {0} 文件夹和 {1} 文件被复制.";
localizations.CutActionGrowlText = "共 {0} 文件夹和 {1} 文件被剪切.";
localizations.NothingSelectedGrowlText = "您没有选择条目";
localizations.ShareNothingSelectedGrowlText = "请选择需分享文件";
localizations.DownloadNothingSelectedGrowlText = "请选择需下载的文件";
localizations.RenameNothingSelectedGrowlText = "请选择需重命名的文件";
localizations.PreviewNothingSelectedGrowlText = "请选择需预览的文件";
localizations.NoPreviewGrowlText = "预览";
localizations.NoPreviewGrowlDesc = "您选择的项目不能提供预览";
localizations.ProblemWhileRenamingGrowlText = "文件重命名错误";
localizations.ProblemWhileRenamingDescGrowlText = "重命名文件时发生错误，请重试. 详情 : ";
localizations.ProblemWhileSharingGrowlText = "文件分享错误";
localizations.ProblemWhileSharingDescGrowlText = "分享文件时发生错误，请重试";
localizations.DirectLinkDescGrowlText = "Right click on item and click on copy direct link";
localizations.UpdateKeywordDescGrowlText = "在选中文件上点击右键更新关键词";
localizations.QuickViewNothingToShowGrowlText = "错误 : 无文件供快速查看";
localizations.QuickViewNoItemsAvailableGrowlText = "无此文件";
localizations.QuickViewRotateClockwiseTooltipText = "顺时针旋转";
localizations.QuickViewRotateCounterClockwiseTooltipText = "逆时针旋转";
localizations.QuickViewCurrentImagePositionText = "Item {current} of {total}";
localizations.ProblemWhileDeletingGrowlText = "文件删除错误";
localizations.ProblemWhileDeletingDescGrowlText = "删除文件时发生错误，请重试. 详情 : ";
localizations.ProblemWhileUnzipGrowlText = "文件解压错误";
localizations.ProblemWhileUnzipDescGrowlText = "解压文件时发生错误，请重试. 详情 ";
localizations.ProblemWhileZipGrowlText = "文件压缩错误";
localizations.ProblemWhileZipDescGrowlText = "压缩文件时发生错误，请重试. 详情 : ";
localizations.ProblemWhileCreatingFolderGrowlText = "创建文件夹错误";
localizations.ProblemWhileCreatingFolderDescGrowlText = "创建文件夹时发生错误，请重试. 详情 : ";
localizations.JavaRequiredGrowlText = "需要Java环境";
localizations.JavaRequiredDescGrowlText = "系统高级功能依赖于Java环境.<br/><br/>请点击链接下载: <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "加载Java错误";
localizations.JavaLoadingProblemDescGrowlText = "系统加载Java错误，如果您的浏览器禁用Java，请启用然后重试.";
localizations.JavaAppletNotLoadedGrowlText = "Java Applet未加载";
localizations.JavaAppletNotLoadedDescGrowlText = "You must first click the 'Advanced Browse...' button before drag and drop will be enabled.";
localizations.NoFilesFoundGrowlTitle = "无数据";
localizations.NoFilesFoundGrowlText = "错误 : 没有发现数据 ";
localizations.AutoLogOutConfirmationTitle = "自动注销";
localizations.AutoLogOutConfirmationDesc = "您因长时间无操作，将被系统注销";
localizations.AutoLogOutButtonText = "保持登陆";
//Treeview header items
localizations.TreeviewHeaderNameText = "名称";
localizations.TreeviewHeaderPathText = "路径";
localizations.TreeviewHeaderSizeText = "大小";
localizations.TreeviewHeaderModifiedText = "已更新";
localizations.TreeviewHeaderKeywordsText = "关键词";
//Selection menu items
localizations.SelectItemOptionLinkText = "选择";
localizations.SelectCheckboxContextMenuToggleText = "Toggle";
localizations.SelectCheckboxContextMenuCheckAllText = "所有项目";
localizations.SelectCheckboxContextMenuUncheckAllText = "无项目";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "所有文件";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "所有文件夹";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "Items starting with \".\"";
localizations.SelectCheckboxContextMenuCheckTodayText = "今天更新";
localizations.SelectCheckboxContextMenuCheckWeekText = "7天内全部更新";
localizations.SelectCheckboxContextMenuCheckMonthText = "30天内全部更新";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "60天内全部更新";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "90天内全部更新";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "页面上显示 {0} 个条目";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "请选择需上传文件..";
localizations.advancedDownloadPathSelectionWindowTitle = "请选择下载文件本地保存地址..";
localizations.advancedOperationsDownloadStatus = "正在下载";
localizations.advancedOperationsUploadStatus = "正在上传";

localizations.maxAllowedDownloadSizeReached = "下载数据两超过系统允许大小"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "下载数据量最大不能超过 : {size}. <br />请使用高级下载工具，或者将下载暂时添加到管理器."; //Text of growl to display when download reaches maximum allowed size

// Change icon window items
localizations.ChangeIconWindowHeaderText = "更换图标 ";
localizations.ChangeIconWindowInstructionsText = "请为选中项目分配一个小图片作为它的图标:";
localizations.ChangeIconWindowSelectedFilesLabelText = "选中的文件 : ";
localizations.ChangeIconWindowCancelLinkText = "取消";
localizations.ChangeIconWindowUpdateLinkText = "保存";
localizations.ChangeIconFileSelectAlertText = "请选择图片完成后续操作.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "解压开始";
localizations.UnzipStartedAlertDescText = "您选取的文件即将开始解压";
localizations.UnzipCompletedAlertTitleText = "解压完成";
localizations.UnzipCompletedAlertDescText = "您选取的文件已完成解压缩";

//zip operation
localizations.ZipStartedAlertTitleText = "压缩开始";
localizations.ZipStartedAlertDescText = "您选取的文件即将开始压缩";
localizations.ZipCompletedAlertTitleText = "压缩完成";
localizations.ZipCompletedAlertDescText = "您选取的文件已完成压缩";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "注册成功 : ";
localizations.RegisterWindowProcessCompleteMessage = "在您登陆系统之前，请确认管理员已经开放您的账户.";
localizations.RegisterWindowProcessFailedMessage = "<strong>注册失败的原因一般有 : </strong><br><br>- 用户名已经存在. <br> - 服务器目前不开放注册.  <br><br> 请重新注册或联系系统管理员.";

//Data size format items
localizations.dataFormatBytes = "bytes";
localizations.dataFormatKiloBytes = "KB";
localizations.dataFormatMegaBytes = "MB";
localizations.dataFormatGigaBytes = "GB";
localizations.dataFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "请稍等...";

//Server message localized
localizations.share_complete = "发布完成.";
localizations.share_email_sent = "邮件已发出.";
localizations.share_open_in_email_client = "在邮件客户端中打开";
localizations.email_failed = "<div class='errorMessage'>SMTP发送邮件失败，请查看服务器日志以查找错误.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "加载失败 : ";