// CrushFTP Korean Localization V1.0 <17.05.13> by lastname
// 개선된 사항이 있을 경우, 제작사를 통해 공유 부탁드립니다.
/*Login page specific*/
localizations.loginPageTitle = "CrushFTP 웹 인터페이스 :: 로그인";
localizations.BadLoginInfoText = "아이디 혹은 비밀번호가 일치하지 않거나, 계정이 만료되었습니다.";
localizations.ServerErrorInfoText = "서버가 동작 중이 아니거나, 차단되었습니다.";
localizations.PasswordsDoNotMatchAlertText = "비밀번호가 일치하지 않습니다.";
localizations.LoginAgainTitleText = "재로그인 해주세요.";
localizations.LoginWithNewPassText = "새로운 비밀번호로 로그인";
localizations.AuthenticatingMsgText = "인증 중...";
localizations.LoginSuccessText = "로그인 성공";
localizations.LoadingWebInterfaceText = "로딩 중...";
localizations.LoginWarningText = "경고";
localizations.MultipleBadLoginsAlertDescText = "여러번의 잘못된 접속 시도는 IP가 차단될 수 있습니다.\r\n\r\n{msg}<br><br><div style='font-size:13px;font-weight:normal;'><a style='color:white;' href='/WebInterface/jQuery/reset.html'>여기</a>를 클릭하시면 비밀번호를 초기화 할 수 있습니다.</div>";
localizations.LoginFailedText = "로그인 실패";
localizations.ChangePasswordGrowlTitleText = "비밀번호 변경";
localizations.UserNameText = "아이디";
localizations.PasswordText = "비밀번호";
localizations.RememberMeText = "로그인 유지" ;
localizations.LoginButtonText = "로그인";
localizations.ForgotPasswordLinkText = "비밀번호 찾기";
localizations.ChangePasswordHeaderText = "비밀번호 변경";
localizations.ChangePasswordNoteText = "비밀번호를 변경 후, 접속 가능합니다.";
localizations.CurrentPasswordText = "현재 비밀번호 : ";
localizations.NewPasswordText = "새 비밀번호 : ";
localizations.ConfirmPasswordText = "새 비밀번호 확인 : ";
localizations.CancelButtonText = "취소";
localizations.ChanngePasswordButtonText = "비밀번호 변경";
localizations.GeneratePasswordButtonText = "랜덤 비밀번호 생성";
localizations.GeneratePasswordUseButtonText = "비밀번호 변경";
localizations.GeneratePasswordCancelButtonText = "취소" ;
localizations.OldBrowserNoticeHTMLAsText = '오래된 버전의 웹 브라우저를 이용하여 접속했기 때문에, 속도가 느리고 문제가 발생할 수 있습니다. 웹 인터페이스는 IE6에서 정상동작을 보장하지 않습니다.<br><br><div style="text-align:right;"><button id="proceedAnyway">무시하고 진행하거나 </button> 새로운 웹 브라우저를 사용할 수 있습니다 :<a href="http://chrome.google.com/">크롬 브라우저</a> | <a href="http://www.getfirefox.com/">파이어폭스 브라우저</a></div>';
localizations.serverNotConfiguredForEmailError = "이 서버는 이메일을 통한 비밀번호 복구를 지원하지 않습니다. 관리자에게 요청하시기 바랍니다. ";

/*Reset pass page specific*/
localizations.resetPageUserName = "아이디 혹은 이메일 : ";
localizations.resetPagePassword = "비밀번호 : ";
localizations.resetPagePasswordConfirm = "비밀번호 확인 : ";
localizations.resetPageSubmit = "다음으로";
localizations.resetPageLoginPage = "로그인 페이지";
localizations.resetPageStartOver = "내용 초기화";

localizations.passwordRequirementsMessages = {
    errorTitle : "오류 : \r\n",
    msgSeparator : "\r\n",
    chars : "비밀번호는 최소 $$ 글자 이상이어야 합니다.",
    numericChars : "비밀번호는 최소 $$개의 숫자를 포함해야 합니다..",
    lowerCase : "비밀번호는 최소 $$개의 소문자를 포함해야 합니다.",
    upperCase : "비밀번호는 최소 $$개의 대문자를 포함해야 합니다.",
    specialCase : "비밀번호는 최소 $$개의 특수문자를 포함해야 합니다.",
    notAllowedErrorMsg : "비밀번호 변경이 허용되지 않습니다."
};

localizations.ItemsPerPageText = "한 페이지에 보여줄 항목 : ";
localizations.LayoutChangeLabelText = "레이아웃 : ";

/*File uploading specific*/
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "파일 용량이 너무 큽니다.",
            "minFileSize": "파일 용량이 너무 작습니다.",
            "acceptFileTypes": "허용되지 않는 파일 종류 입니다.",
            "maxNumberOfFiles": "최대 파일 갯수를 초과했습니다.",
            "uploadedBytes": "업로드 된 바이트가 파일 용량을 초과합니다.",
            "emptyResult": "빈 파일이 업로드 되었습니다.",
            "fileAvailableInSelectedFolder": "파일이 동일한 폴더의 업로드 항목에 추가되어 있습니다.",
            "hasReachedQuota": "파일 사이즈가 할당량보다 큽니다.",
            "fileExistOnServer": "파일이 서버에 존재합니다.",
            "fileBiggerThanAllowed": "허용된 용량보다 파일이 큽니다.",
            "dirNoWritable": "이 폴더에는 업로드 할 수 없습니다.",
            "blockUploadingDirs": "폴더를 업로드 하는 것은 허용되지 않습니다.",
            "true": "true"
        },
        "error": "오류",
        "start": "시작",
        "waiting": "대기 중...",
        "uploading": "업로드 중 : ",
        "reupload": "재 업로드",
        "share": "공유",
        "cancel": "취소",
        "destroy": "삭제",
        "overwrite": "덮어쓰기",
        "uploadTo": "업로드 대상 : ",
        "pause": "일시 중지",
        "errorLabel": "오류 : ",
        "details": "세부 정보",
        "uploadedInLabelText": "업로드 된 시간 : ",
        "atAvgSpeedOfLabelText": "동안 평균 전송 속도 : ",
        "uploadCompletedText": "업로드 완료",
        "uploadedFileText": "서버에 업로드 된 파일",
        "uploadedMultipleFilesText": "모든 파일 업로드 완료"
    }
};

localizations.buttons = {
    "admin": "관리",
    "delete": "삭제",
    "rename": "이름 변경",
    "download": "다운로드",
    "advanced download": "고급 다운로드",
    "zipdownload": "압축해서 다운로드",
    "unzip": "압축 해제",
    "zip selected": "압축",
    "explore zip contents": "압축 파일 보기",
    "create folder": "폴더 생성",
    "upload": "업로드",
    "search": "검색",
    "user options": "사용자 옵션",
    "cut": "이동",
    "copy": "복사",
    "paste": "붙여넣기",
    "slideshow": "슬라이드 쇼",
    "quickview": "퀵 뷰",
    "download low-res": "저해상도 다운로드",
    "preview": "미리보기",
    "batchcomplete": "BatchComplete",
    "share": "공유",
    "quick share": "빠른 공유",
    "manage shares": "공유 관리",
    "show basket": "장바구니",
    "add to basket": "장바구니로..",
    "edit keywords": "키워드 수정",
    "change icon": "아이콘 변경",
    "download crushtunnel": "CrushTunnel 다운로드",
    "help": "도움말",
    "login": "로그인",
    "logout": "로그아웃",
    "download sync app": "동기화 앱 다운로드",
    "download crushftpdrive": "CrushFTPDrive 다운로드",
    "sync manager": "동기화 매니저"
};

localizations.currentLanguageName = "Korean"; //It has to be in english for mapping, to change display text use option below
localizations.languageNameEnglish = "English";
localizations.languageNameKorean = "Korean (한국어)";
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
localizations.refreshListingButtonTooltipText = "새로고침";
localizations.FilterText = localizations.FilterTextBasket = "필터:";
localizations.ClearFilterLinkText = localizations.ClearFilterLinkTextBasket = "초기화";
localizations.FileCounterItemsText = "항목";
localizations.FileCounterFoldersText = "폴더";
localizations.FileCounterFilesText = "파일";
localizations.FileCounterHiddenItemsText = "숨겨진 항목";
localizations.ThumbnailViewLinkText = localizations.ThumbnailViewLinkTextBasket = "썸네일 뷰";
localizations.TreeViewLinkText = localizations.TreeViewLinkTextBasket = "트리 뷰";
localizations.DownloadResumeTextLabelBasket = "이어받기"
localizations.BackToTopLinkText = "최상단으로";
localizations.FilesNotAvailableMessage = "파일이 없습니다.";
localizations.CopyNoFilesSelectedMessage = "복사할 파일이나 폴더를 선택해주세요.";
localizations.CopyOnlyFilesMessage = "이동 및 복사는 파일만 가능합니다. 선택된 폴더는 무시됩니다.";
localizations.DeleteNoFilesSelectedMessage = "삭제될 파일이나 폴더를 선택해주세요.";
localizations.UnzipNoFilesSelectedMessage = "압축을 해제한 파일을 선택해주세요.";
localizations.ZipExploreNoFilesSelectedMessage = "탐색할 압축 파일을 선택해주세요.";
localizations.CutNoFilesSelectedMessage = "이동할 파일이나 폴더를 선택해주세요.";
localizations.pagingPrevText = "이전";
localizations.pagingNextText = "다음";
localizations.pagingEllipseText = "...";
localizations.FilterItemCountText = "(필터 조건 \"{filterVal}\"에 일치하는 항목 : {totalItems}개, 폴더:{folders} / 파일:{files})";
localizations.TotalItemsInDirMsgText = " (총 항목 수 : {count}) ";
localizations.TotalItemsInDirInlineText = " ({count} 항목) ";
localizations.quotaAvailableLabelText = "가능";

localizations.WelcomeNoteSubmitFormFailureMsgText = "오류: 데이터 저장 중, 문제가 발생했습니다.";
localizations.TreeviewSpecificActionMsgTitleText = "트리 뷰 전용";
localizations.TreeviewSpecificActionMsgDescText = "트리 뷰일 경우에만 가능합니다.";
localizations.PasswordExpiringMsgText = "비밀번호가 곧 만료됩니다. '사용자 옵션'을 변경해주세요.";
localizations.PasswordNotMatchingMsgText = "새로운 비밀번호가 일치하지 않습니다.";
localizations.PasswordMustBeComplexMsgText = "좀 더 복잡한 비밀번호를 사용하세요.";
localizations.PasswordChangedMsgText = "비밀번호 변경 완료. 새로운 비밀번호로 로그인해주세요.";
localizations.AppletLoadingFailedMsgText = "업로딩 중 자바 애플릿에 문제가 발생했습니다.";
localizations.DownloadStartedAlertTitleText = "다운로드가 시작되었습니다.";
localizations.DownloadCompletedText = "[다운로드 완료]";
localizations.DownloadCompletedPathText = " 다운로드 경로 : ";
localizations.DownloadStartedAlertDescText = "파일이 저장될 위치를 선택해주세요.";
localizations.LogoutButtonText = "로그아웃";
localizations.browserUploaderNativeUploadTipSetTitle = "브라우저를 통해 파일을 업로드.";
localizations.browserUploaderAdvancedUploadTipSetTitle = "고급 업로더를 통해 파일을 업로드, <br>폴더도 가능하며, 좀 더 빠릅니다.";
localizations.browserUploaderDragDropHoverLabelText = "이곳에 업로드 될 파일을 놓으세요.";
localizations.appletUploaderDropPanelLabelText = "&darr; 이곳에 업로드 될 파일을 놓으세요 &darr;";
localizations.browserUploaderDragDropLabelText = "이곳에 파일을 끌어다놓으면 업로드됩니다.";
localizations.browserUploaderChromeDragDropLabelText = "이곳에 파일 및 폴더를 끌어다놓으면 업로드됩니다.";
localizations.advancedUploadOptionsDialogSaveButtonText = "저장";
localizations.advancedUploadOptionsDialogCancelButtonText = "취소";

//Sharing Window
localizations.ShareWindowHeaderText = "파일 공유";
localizations.ShareWindowFilesSharingLabelText = "공유 :";
localizations.ShareWindowShareTypeLabelText = "공유 타입 :";
localizations.ShareWindowShareTypeLabelCopyText = "복사";
localizations.ShareWindowShareTypeLabelMoveText = "이동";
localizations.ShareWindowShareTypeLabelReferenceText = "참조";
localizations.ShareWindowShareToInternalUserLabelText = "내부 공유";
localizations.ShareWindowShareToExternalUserLabelText = "외부 공유";
localizations.ShareWindowDownloadLabelText = "다운로드";
localizations.ShareWindowUploadLabelText = "업로드";
localizations.ShareWindowDeleteLabelText = "삭제";
localizations.ShareWindowSendEmailLabelText = "이메일 전송 :";
localizations.ShareWindowDirectLinkLabelText = "파일을 직접 링크할까요?";
localizations.ShareWindowExpiresLabelText = "만료일 :";
localizations.ShareWindowFromLabelText = "발신 : ";
localizations.ShareWindowToLabelText = "수신 : ";
localizations.ShareWindowCCLabelText = "참조 : ";
localizations.ShareWindowBCCLabelText = "숨은 참조 : ";
localizations.ShareWindowReplyToLabelText = "회신 주소 : ";
localizations.ShareWindowSubjectLabelText = "제목 : ";
localizations.ShareWindowBodyLabelText = "내용 : ";
localizations.ShareWindowAdvancedLabelText = "고급 설정";
localizations.ShareWindowAttachThumbsLabelText = "썸네일 첨부";
localizations.ShareWindowAttachFileLabelText = "파일 첨부";
localizations.ShareWindowCommentsLabelText = "주석 : ";
localizations.ShareWindowKeywordsLabelText = "키워드 : ";
localizations.ShareWindowAccessLabelText = "모든 권한 ";
localizations.ShareWindowSendButtonText = "확인";
localizations.ShareWindowCancelButtonText = "취소";
localizations.ShareWindowUsernameMethodLabelText = "공유 방법 : ";
localizations.ShareWindowUsernameLabelText = "내부 사용자에게 공유";
localizations.ShareWindowUsernamesLabelText = "아이디 : ";
localizations.ShareWindowUsernamesLabelHelpText = "(다수의 아이디는 콤마를 이용하여 구분하세요.)";
localizations.ShareActionCompleteShareUsernamesText = "해당 사용자에게 공유 항목에 대한 접근 권한이 추가되었습니다.";
localizations.ShareActionCompleteUsernameText = "아이디: ";
localizations.ShareActionCompletePasswordText = "비밀번호: ";
localizations.ShareActionCompleteLinkText = "링크";
localizations.ShareActionCompleteOkButtonText = "확인";
localizations.ShareActionEmailValidationFailureHelpToolTip = "올바른 이메일 주소를 입력해주세요. 다수의 이메일 주소는 콤마를 이용하여 구분하세요. 예) <strong>bob@email.com, john@email.com,...</strong>";
localizations.ShareInvalidItemSelectedGrowlText = "잘못된 항목";
localizations.SharFoldersCantBeSharedGrowlText = "폴더는 공유 불가능합니다.";
localizations.SharFilesCantBeSharedGrowlText = "파일은 공유 불가능합니다.";
//Copy direct link window
localizations.CopyLinkWindowHeaderText = "링크 복사";
localizations.CopyLinkText = "링크 복사";
//Create folder window
localizations.CreateFolderWindowHeaderText = "폴더 생성.";
localizations.CreateFolderInputDefaultFolderName = "새폴더";
localizations.CreateFolderWindowNavigateToFolderCheckboxText = "생성 후, 폴더로 이동합니다.";
localizations.CreateFolderButtonText = "생성";
//Browser uploader window
localizations.BrowserUploaderWindowHeaderText = "파일 업로드";
localizations.BrowserUploaderUploadDetailsTabHeaderText = "업로드 세부사항";
localizations.BrowserUploaderUploadFilesTabHeaderText = "업로드 파일";
localizations.BrowserUploaderAdvancedBrowseButtonText = "고급 탐색..";
localizations.BrowserUploaderStartUploadingLinkText = "업로드 시작";
localizations.BrowserUploaderClearCompletedLinkText = "완료된 항목 제거";
localizations.BrowserUploaderResumeCheckboxText = "이어받기";
localizations.BrowserUploaderFormResetButtonText = "초기화";
localizations.BrowserUploaderFormNextButtonText = "다음";
localizations.BrowserUploaderFileAddedAlreadyText = "이미 추가된 파일입니다.";
localizations.BrowserUploaderFileAddedAlreadyDetailsText = "{0} 는 이미 추가되었습니다.";
localizations.BrowserUploaderMultiFileAddedAlreadyText = "이미 추가된 파일입니다.";
localizations.BrowserUploaderMultiFileAddedAlreadyDetailsText = "{0} 는 이미 추가되었습니다.";
localizations.BrowserUploaderSelectedFilesGroupText = "파일 그룹 : ";
localizations.BrowserUploaderSelectedFileRemoveLinkText = "제거";
localizations.BrowserUploaderSelectedFileWillBeUploadedText = "업로드 예정 경로 :";
localizations.BrowserUploaderSelectedFileOverwriteText = "덮어쓰기";
localizations.BrowserUploaderSelectedFileWillBeOverwrittenText = "덮어쓰기 될 예정입니다.";
localizations.BrowserUploaderSelectedFileExistsText = "파일이 존재합니다.";
localizations.BrowserUploaderSelectedFileAttentionRequiredText = "확인이 필요합니다.";
localizations.BrowserUploaderSelectedFileIgnoreLinkText = "무시";
localizations.BrowserUploaderSelectedFileDoneText = "완료";
localizations.BrowserUploaderSelectedFileUploadedText = "업로드 된 위치";
localizations.BrowserUploaderSelectedFileReUploadLinkText = "재 업로드";
localizations.BrowserUploaderSelectedFileReDownloadLinkText = "재 다운로드";
localizations.BrowserUploaderSelectedFileDismissLinkText = "제외";
localizations.BrowserUploaderSelectedFileCancelLinkText = "취소";
localizations.BrowserUploaderSelectedFilePauseLinkText = "일시 정지";
localizations.BrowserUploaderSelectedFilePausedStatusText = "일시 정지됨";
localizations.BrowserUploaderSelectedFileResumeLinkText = "이어받기";
localizations.BrowserUploaderAdvancedUploadingFilesText = "총 {0} 개의 파일";
localizations.BrowserUploaderAdvancedUploadingFilesStatusText = "{1} 개의 항목 중 {0} ";
localizations.BrowserUploaderAdvancedUploadingFilesToText = "업로드 위치 : ";
localizations.BrowserUploaderAdvancedUploadingSpeedText = "현재 속도 : ";
localizations.BrowserUploaderAdvancedUploadingAverageSpeedText = "평균 속도 : ";
localizations.BrowserUploaderAdvancedUploadingTimeText = "<div class='time'> 소요 시간 : <span class='elapsed'>{0}</span> <span class='remained'>, 남은 시간 : {1}</span></div>";
localizations.BatchCompleteText = "결과";
localizations.BatchComplete = "전송이 확인되었습니다.";
localizations.BrowserUploaderSpeedTimeCalculatingText = "계산 중..";
localizations.BrowserUploaderProblemWhileTransferMsgText = "전송 중 문제가 발생했습니다.";
localizations.BrowserUploaderCancelledUploadMsgText = "업로드가 취소되었습니다.";
localizations.BrowserUploaderAlertWhileNavigatingAwayMsgText = "파일이 업로드 중 입니다. 이 페이지를 나갈 경우, 업로드가 취소됩니다. 정말로 이 페이지를 나가시겠습니까?";
localizations.BrowserDownloadAlertWhileNavigatingAwayMsgText = "파일이 다운로드 중 입니다. 이 페이지를 나갈 경우, 업로드가 취소됩니다. 정말로 이 페이지를 나가시겠습니까?";
localizations.NoUploadInDirGrowlText = "업로드는 허용되지 않습니다.";
localizations.NoUploadInDirGrowlDesc = "선택된 폴더로의 업로드는 허용되지 않습니다.";
localizations.AdvancedUploadDirNotAllowedText = "폴더 업로드는 허용되지 않습니다.";
localizations.AdvancedUploadDirNotAllowedDescText = "폴더의 업로드는 불가능하므로, 파일만 선택해주세요.";
localizations.uploadConfirmCancelUploadText = "정말로 업로드를 취소하시겠습니까?";
localizations.uploadConfirmCancelUploadAfterFormText = "정말로 마지막에 선택된 {count}개 항목의 업로드를 취소하시겠습니까?";

//New upload bar localizations
localizations.browseFileLabelByClass = "파일 추가...";
localizations.advancedUploadResumeLabelByClass = "이어받기";
localizations.filesToUploadQueueWindowHeader = "업로드 될 파일";
localizations.uploadWindowStartUploadingByClass = "업로드 시작";
localizations.uploadWindowCancelUploadingByClass = "업로드 취소";
localizations.uploadWindowShowCommonUploadFormByClass = "세부 정보";
localizations.uploadWindowClearUploadedByClass = "완료된 항목 제거";
localizations.uploadWindowOverwriteAllByClass = "모든 항목 덮어쓰기";
localizations.uploadWindowRemoveAllWithErrorsByClass = "오류난 모든 항목 삭제";
localizations.uploadWindowSummaryFilesByClass = "파일 : ";
localizations.uploadWindowSummarySizeByClass = ", 업로드 용량 : ";
localizations.uploadBarShowHideFilesSetTitleClass = "선택된 파일 보이기/숨기기";
localizations.uploadBarAttentionTitle = "업로드 바를 통한 파일 추가";
localizations.uploadBarAttentionText = "업로드 바를 통해 업로드 될 파일을 추가합니다.. 파일을 추가하기 위해 \"" + localizations.browseFileLabelByClass + "\" 버튼을 누르세요.";
localizations.uploadBiggerFileNoticeTitleText = "대용량 파일은 고급 업로드를 사용";
localizations.uploadBiggerFileNoticeDescText = "<span class='growlNote'>대용량 파일은 고급 업로드 사용을 권장합니다. 이는 파일을 쉽게 올릴 수 있고, <em>자동 이어받기</em> 기능이 있습니다. <br><br> (업로드 바에서 업로드 모드를 변경할 수 있습니다)</span><br><img src='/WebInterface/jQuery/images/UploadBarGuide.png' style='padding-top:10px;margin-left:20px;' title='업로드 모드 변경 방법'>";

localizations.globalProgressbarSkipLabelByClass = "생략";
localizations.globalProgressbarPauseLabelByClass = "일시 정지";
localizations.globalProgressbarStopLabelByClass = "정지";

localizations.popupOpenInSeparateWindowText = "새 창으로 열기";
localizations.customFormPasswordMatchValidationFailedText = "비밀번호가 일치하지 않습니다.";
localizations.customFormCompareValueMatchValidationFailedText = "값이 일치하지 않습니다.";

localizations.syncAppName = "CrushSync";

if (typeof window.locale != "undefined") {
    window.locale.fileupload.SwitchToNormalUpload = "일반 업로드로 전환";
    localizations.uploadWindowUploadTypeSwitchSetTitleClass = window.locale.fileupload.SwitchToAdvancedUpload = "고급 업로드로 전환하기.<div style='font-size:11px;width:500px;margin:5px 0px;'>고급 모드는 속도가 빠르고, 전송 실패시 자동으로 이어받기가 가능하며, 폴더 전송이 가능합니다.<br><br>고급 모드는 파일을 업로드하는 가장 빠른 방법입니다.<br>(고급 모드는 자바 애플릿 플러그인(www.java.com)이 필요합니다.)</div>";
}

//Search window
localizations.SearchWindowHeaderText = "검색";
localizations.SearchWindowKeywordsLabelText = "키워드 :";
localizations.SearchWindowExactLabelText = "Exact?";
localizations.SearchWindowByClassModifiedLabelText = "수정된 날짜";
localizations.SearchWindowByClassDateFormatLabelText = "(월/일/연도) ";
localizations.SearchWindowSizeLabelByClassText = "용량 ";
localizations.SearchWindowTypeLabelText = "타입";
localizations.SearchWindowSizeUnitLabelTextByClass = "(KB)";
localizations.SearchWindowSearchButtonText = "검색 시작";
localizations.SearchWindowCancelButtonText = "취소";
localizations.SearchResultDisplayText = "검색 결과:";
localizations.SearchResultClearLinkText = "(검색 필터 초기화)";
localizations.SearchFormModifiedOptionAfterText = "이후";
localizations.SearchFormModifiedOptionBeforeText = "이전";
localizations.SearchFormSizeOptionBiggerThanText = "다음 용량보다 큰 :";
localizations.SearchFormSizeOptionSmallerThanText = "다음 용량보다 작은 :";
localizations.SearchFormItemTypeOptionFileText = "파일";
localizations.SearchFormItemTypeOptionFolderText = "폴더";
localizations.SearchProcessNotificationText = "처리 중... ";
localizations.SearchProcessCancelText = "취소";
localizations.SearchItemsContextGoToParentText = "상위 폴더로 이동";
//Multiple file selection options
localizations.ItemsSelectionDisplayText = "현재 페이지의 모든 항목(<strong>{count}</strong>)이 선택되었습니다.";
localizations.ItemsSelectionSelectAllItemsInDir = "<strong>{list_type}</strong> 에 포함된 모든 항목 (<strong>{total_items}</strong>) 선택 (숨겨진 항목 포함)</span>";
localizations.ItemsSelectionSelectedAllItemsInDir = "<strong>{list_type}</strong> 에 포함된 모든 항목(<strong>{total_items}</strong>)이 선택되었습니다. (숨겨진 항목 포함)";
localizations.ItemsSelectionClearSelection = "선택 취소";
localizations.ItemsSelectionShowingFolderText = "현재 폴더";
localizations.ItemsSelectionShowingFilteredItemsText = "현재 필터 목록";
localizations.ItemsSelectionShowingSearchedItemsText = "검색 결과";
//User options window
localizations.UserOptionsWindowHeaderText = "설정";
localizations.UserOptionsWindowHideItemsStartWithDotLabelText = "'.' 항목 숨기기 ";
localizations.UserOptionsWindowHideCheckboxLabelText = "체크박스 열 숨기기 ";
localizations.UserOptionsWindowHideFilterLabelText = "필터 섹션 숨기기 ";
localizations.UserOptionsWindowAutostartUploadLabelText = "업로드할 파일 선택시, 자동으로 업로드 시작하기. ";
localizations.UserOptionsWindowLoadJavaAppletLabelText = "인터페이스를 로딩할 때, 자바 애플릿도 로드하기.";
localizations.UserOptionsWindowDisableCompressionLabelText = "자바 애플릿에서 압축 기능 해제. ";
localizations.UserOptionsWindowChangePasswordHeaderText = "비밀번호 변경 ";
localizations.UserOptionsWindowChangePasswordCurPassLabelText = "현재 비밀번호: ";
localizations.UserOptionsWindowChangePasswordNewPassLabelText = "새로운 비밀번호: ";
localizations.UserOptionsWindowChangePasswordConfirmPassLabelText = "비밀번호 확인:";
localizations.UserOptionsWindowChangePasswordButtonText = "비밀번호 변경";
localizations.UserOptionsWindowChangePasswordGenerateRandomButtonText = "랜덤 비밀번호 생성";
localizations.UserOptionsWindowChangePasswordGenerateRandomUseItLinkText = "사용하기";
localizations.UserOptionsWindowChangePasswordGenerateRandomCancelLinkText = "취소";
localizations.ChangePasswordCurrentPasswordNotCorrectWarningText = "현재 비밀번호가 틀렸습니다.";
localizations.ChangePasswordResetLinkExpiredText = "이 경로는 잘못되었거나 만료되었습니다.";

//Main checkbox context menu options
localizations.MainCheckboxContextMenuToggleText = "반전";
localizations.MainCheckboxContextMenuCheckAllText = "모두 선택";
localizations.MainCheckboxContextMenuUncheckAllText = "모두 해제";
//Keywords window
localizations.KeywordsWindowHeaderText = "키워드";
localizations.KeywordsWindowUpdateLinkText = "업데이트";
localizations.KeywordsWindowCancelLinkText = "취소";
//File basket
localizations.BasketHeaderText = "장바구니의 파일";
localizations.BasketClearAllLinkText = "모두 제거";
localizations.BasketDownloadLinkText = "다운로드";
localizations.BasketDownloadAdvancedLinkText = "고급 다운로드";
localizations.BasketNoFilesAvailableText = "파일이 없습니다.";
localizations.BasketRemoveLinkText = "삭제";
localizations.BasketTotalItemText = "{0} 항목 ";
localizations.BasketFileAddedAlreadyText = "파일이 이미 장바구니에 추가되었습니다.";
localizations.BasketFileAddedAlreadyDetailsText = "선택된 파일이 이미 장바구니에 있습니다.";
localizations.BasketNothingSelectedToAddText = "장바구니에 추가할 항목이 선택되지 않았습니다.";
localizations.BasketNothingSelectedToAddDetailsText = "&nbsp;";
localizations.BasketClearAllConfirmMessage = "정말로 장바구니의 모든 선택된 파일을 제거하시겠습니까?";
//Paste form panel
localizations.PasteFormHeaderText = "붙여넣기";
localizations.PasteFormResetButtonText = "초기화";
localizations.PasteFormPasteButtonText = "붙여넣기";
localizations.PasteFormErrorHeaderText = "붙여넣기 중 오류 발생";
localizations.PasteFormErrorDetailsText = "항목을 붙여넣는 중에 오류가 발생했습니다.<br />오류 : {0}";
localizations.PasteFormErrorNothingToPasteText = "붙여넣기 할 항목이 없습니다.";
localizations.PasteSelectDirectoryWarning = "붙여넣기 할 폴더를 선택해주세요.";
localizations.PasteSelectSingleDirectoryWarning = "붙여넣기 할 폴더는 하나만 선택해주세요.";
//Welcome form panel
localizations.WelcomeFormHeaderText = "환영합니다";
localizations.WelcomeFormOkButtonText = "확인";
//Slideshow popup
localizations.SlideshowPopupHeaderText = "슬라이드 쇼";
//Manage Share window
localizations.ManageShareWindowHeaderText = "공유 관리";
localizations.ManageShareWindowRefreshLinkText = "새로고침";
localizations.ManageShareWindowDeleteSelectedLinkText = "선택된 항목을 삭제";
localizations.ManageShareWindowDeleteLinkText = "삭제";
localizations.ManageShareWindowGridLinkLabelText = "링크";
localizations.ManageShareWindowGridFromLabelText = "발신";
localizations.ManageShareWindowGridToLabelText = "수신";
localizations.ManageShareWindowGridCCLabelText = "참조";
localizations.ManageShareWindowGridBCCLabelText = "숨은 참조";
localizations.ManageShareWindowGridReplyToLabelText = "회신 주소";
localizations.ManageShareWindowGridSubjectLabelText = "제목";
localizations.ManageShareWindowGridBodyLabelText = "내용";
localizations.ManageShareWindowGridShareTypeLabelText = "공유 타입";
localizations.ManageShareWindowGridUserNameLabelText = "아이디";
localizations.ManageShareWindowGridPasswordLabelText = "비밀번호";
localizations.ManageShareWindowGridAttachedLabelText = "이메일에 첨부";
localizations.ManageShareWindowGridUploadLabelText = "업로드 허용";
localizations.ManageShareWindowGridPathsLabelText = "경로";
localizations.ManageShareWindowGridCreatedLabelText = "생성 시기";
localizations.ManageShareWindowGridExpiresLabelText = "만료";
localizations.ManageShareWindowGridSharedItemsLabelText = "공유된 아이템";
localizations.ManageShareWindowGridDownloadsLabelText = "다운로드";
localizations.ManageShareWindowNothingToShowMessageText = "보여줄 항목이 없습니다";
localizations.ManageShareWindowDeleteAccountConfirmationText = "정말로 선택된 {count}개의 항목을 삭제할까요?";
localizations.ManageShareWindowFilterText = "필터 :";
localizations.ManageShareWindowClearFilterText = "초기화";
localizations.ManageShareWindowNextItemText = "다음";
localizations.ManageShareWindowPrevItemText = "이전";
localizations.ManageShareWindowSelectSimilarText = "유사 항목 선택";
localizations.ManageShareWindowPageTitle = "CrushFTP - 공유 관리";

//Rename widndow and panel
localizations.RenameWindowHeaderText = "이름 변경";
localizations.RenamePanelSaveLinkText = "저장";
localizations.RenamePanelCancelLinkText = "취소";

localizations.ZipNameWindowHeaderText = "압축 파일명";
localizations.ZipNamePanelSaveLinkText = "확인";
localizations.ZipNamePanelCancelLinkText = "취소";

localizations.SyncAppNameWindowHeaderText = "동기화 어플리케이션 다운로드";
localizations.SyncAppDownloadYourPassText = "비밀번호 : ";
localizations.SyncAppDownloadAdminPassText = "관리자 비밀번호 : ";
localizations.SyncAppNamePanelSaveLinkText = "확인";
localizations.SyncAppNamePanelCancelLinkText = "취소";

//Tooltip info
localizations.TooltipNameLabelText = "이름";
localizations.TooltipPathLabelText = "경로";
localizations.TooltipSizeLabelText = "용량";
localizations.TooltipModifiedLabelText = "수정된 날짜";
localizations.TooltipKeywordsLabelText = "키워드";

//Form alerts and notifications
localizations.FormValidationFailText = "하나 이상의 항목이 올바르게 입력되지 않았습니다. '*' 표시가 있는 항목에 올바르게 입력해주세요.";
localizations.FormEmailValidationFailText = "<br> - 올바른 이메일 주소를 입력하세요.";
localizations.DeleteConfirmationMessageText = "{0}개 폴더 및 {1}개 파일이 삭제됩니다.\n\n삭제될 항목: {2} 삭제된 항목은 복구할 수 없습니다.";
localizations.DeleteConfirmationMessageRemoveAllItemsInDirText = "\"{folder_name}\"에 포함된 모든 항목이 삭제됩니다.\n\n총 {count}개의 항목이 삭제됩니다.\n\n삭제된 항목은 복구할 수 없습니다.";
localizations.CopyActionGrowlText = "Total {0}개 폴더 및 {1}개 파일이 복사되었습니다.";
localizations.CutActionGrowlText = "Total {0}개 폴더 및 {1}개 파일이 이동되었습니다.";
localizations.NothingSelectedGrowlText = "선택된 항목이 없습니다.";
localizations.ShareNothingSelectedGrowlText = "공유될 항목이 선택되지 않았습니다.";
localizations.DownloadNothingSelectedGrowlText = "다운로드될 항목이 선택되지 않았습니다.";
localizations.RenameNothingSelectedGrowlText = "이름이 변경될 항목이 선택되지 않았습니다.";
localizations.PreviewNothingSelectedGrowlText = "미리 보기 항목이 선택되지 않았습니다.";
localizations.NoPreviewGrowlText = "미리 보기";
localizations.NoPreviewGrowlDesc = "선택된 항목은 미리 보기가 불가능합니다.";
localizations.ProblemWhileRenamingGrowlText = "이름 변경 중 문제 발생";
localizations.ProblemWhileRenamingDescGrowlText = "이름 변경 중 문제가 발생했습니다. 다시 시도해주세요. 오류 : ";
localizations.ProblemWhileSharingGrowlText = "공유 중 문제 발생";
localizations.ProblemWhileSharingDescGrowlText = "파일 공유 중 문제가 발생했습니다. 다시 시도해주세요.";
localizations.DirectLinkDescGrowlText = "항목에서 오른쪽 클릭 후, 링크 복사를 클릭해주세요.";
localizations.UpdateKeywordDescGrowlText = "항목에서 오른쪽 클릭 후, 키워드 수정을 클릭해주세요.";
localizations.QuickViewNothingToShowGrowlText = "오류 : 퀵 뷰로 볼 수 있는 항목이 없음";
localizations.QuickViewNoItemsAvailableGrowlText = "사용 가능한 항목이 없음";
localizations.QuickViewRotateClockwiseTooltipText = "시계 방향으로 회전";
localizations.QuickViewRotateCounterClockwiseTooltipText = "반시계 방향으로 회전";
localizations.QuickViewCurrentImagePositionText = "총 {total}개 중 {current}개 항목";
localizations.ProblemWhileDeletingGrowlText = "삭제 중, 문제 발생";
localizations.ProblemWhileDeletingDescGrowlText = "삭제 중, 문제가 발생했습니다. 다시 시도해주세요. 오류 : ";
localizations.ProblemWhileUnzipGrowlText = "압축 해제 중, 문제 발생";
localizations.ProblemWhileUnzipDescGrowlText = "압축 해제 중, 문제가 발생했습니다. 다시 시도해주세요. 오류 : ";
localizations.ProblemWhileZipGrowlText = "압축 중, 문제 발생";
localizations.ProblemWhileZipDescGrowlText = "압축 중, 문제가 발생했습니다. 다시 시도해주세요. 오류 : ";
localizations.ProblemWhileCreatingFolderGrowlText = "새폴더를 만드는 중, 문제 발생";
localizations.ProblemWhileCreatingFolderDescGrowlText = "새폴더를 만드는 중, 문제가 발생했습니다. 다시 시도해주세요. 오류 : ";
localizations.JavaRequiredGrowlText = "자바가 필요함";
localizations.JavaRequiredDescGrowlText = "고급 기능이 동작하기 위해서는 자바가 설치되어 있어야 합니다.<br/><br/>다음 사이트에서 설치하세요 : <a target=\"_blank\" href=\"http://www.java.com/\" class=\"whiteError\">http://www.java.com/</a>";
localizations.JavaLoadingProblemGrowlText = "자바 로딩 중 문제 발생";
localizations.JavaLoadingProblemDescGrowlText = "자바를 로딩하는 중, 문제가 발생했습니다. 만약 웹 브라우저에서 자바가 비활성되어있다면, 활성화 후 다시 시도해주세요.";
localizations.JavaAppletNotLoadedGrowlText = "자바 애플릿이 로드되지 않음";
localizations.JavaAppletNotLoadedDescGrowlText = "끌어놓기' 활성화 전에, 고급 탐색' 버튼을 클릭하세요.";
localizations.NoFilesFoundGrowlTitle = "데이터를 찾지 못했습니다.";
localizations.NoFilesFoundGrowlText = "오류 : 데이터를 찾지 못했습니다.";
localizations.AutoLogOutConfirmationTitle = "자동 로그아웃";
localizations.AutoLogOutConfirmationDesc = "활동이 없어 로그아웃 되었습니다.";
localizations.AutoLogOutButtonText = "로그인 중";
localizations.AutoLogOutMsg = "활동이 없어 로그아웃 되었습니다.";
localizations.AutoLogOutLoginButtonText = "재로그인..";
//Treeview header items
localizations.TreeviewHeaderNameText = "이름";
localizations.TreeviewHeaderPathText = "경로";
localizations.TreeviewHeaderSizeText = "용량";
localizations.TreeviewHeaderModifiedText = "수정된 날짜";
localizations.TreeviewHeaderKeywordsText = "키워드";
//Selection menu items
localizations.SelectItemOptionLinkText = "선택";
localizations.SelectCheckboxContextMenuToggleText = "반전";
localizations.SelectCheckboxContextMenuCheckAllText = "모든 항목";
localizations.SelectCheckboxContextMenuUncheckAllText = "모두 해제";
localizations.SelectCheckboxContextMenuCheckAllFilesText = "모든 파일";
localizations.SelectCheckboxContextMenuCheckAllFoldersText = "모든 폴더";
localizations.SelectCheckboxContextMenuCheckItemsWithDotText = "\".\"으로 시작하는 항목";
localizations.SelectCheckboxContextMenuCheckTodayText = "오늘 수정된 항목";
localizations.SelectCheckboxContextMenuCheckWeekText = "이번 주에 수정된 항목";
localizations.SelectCheckboxContextMenuCheckMonthText = "이번 달에 수정된 항목";
localizations.SelectCheckboxContextMenuCheck2MonthsText = "60일 안에 수정된 항목";
localizations.SelectCheckboxContextMenuCheck3MonthsText = "90일 안에 수정된 항목";
// Page size selection menu item.
localizations.PageSizeSelectionLinkText = "한 페이지에 {0}개의 항목 표시";
//Webinterface labels
localizations.CopyrightText = "&copy; 2025 <a target=\"_blank\" href=\"http://www.CrushFTP.com/\">CrushFTP</a>";
localizations.PoweredByText = "Powered by <a target=\"_blank\" href=\"http://www.crushftp.com/\">CrushFTP</a>";
// Applet browse window title options
localizations.advancedUploadItemsSelectionWindowTitle = "업로드 될 항목 선택..";
localizations.advancedDownloadPathSelectionWindowTitle = "다운로드 될 경로 선택..";
localizations.advancedOperationsDownloadStatus = "다운로드 중";
localizations.advancedOperationsUploadStatus = "업로드 중";

localizations.maxAllowedDownloadSizeReached = "다운로드된 용량이 허용된 최대 용량을 초과"; //Header of growl to display when download reaches maximum allowed size
localizations.maxAllowedDownloadSizeReachedText = "허용된 최대 다운로드 용량 : {size}. <br />고급 다운로드를 이용하거나, 장바구니에 추가하세요."; //Text of growl to display when download reaches maximum allowed size

//Audio player
localizations.AudioPlayerPlayText = "재생";
localizations.AudioPlayerPauseText = "일시 중지";
localizations.AudioPlayerStopText = "중지";
localizations.AudioPlayerMuteText = "음소거";
localizations.AudioPlayerUnmuteText = "음소거 해제";

// Change icon window items
localizations.ChangeIconWindowHeaderText = "아이콘 변경 ";
localizations.ChangeIconWindowInstructionsText = "선택된 항목의 아이콘으로 사용될 이미지를 선택해 주세요:";
localizations.ChangeIconWindowSelectedFilesLabelText = "선택된 파일 : ";
localizations.ChangeIconWindowCancelLinkText = "취소";
localizations.ChangeIconWindowUpdateLinkText = "저장";
localizations.ChangeIconFileSelectAlertText = "이미지 파일을 선택해 주세요.";

//unzip operation
localizations.UnzipStartedAlertTitleText = "압축 해제 시작";
localizations.UnzipStartedAlertDescText = "선택된 파일에 대한 압축 해제가 시작되었습니다.";
localizations.UnzipCompletedAlertTitleText = "압축 해제 완료";
localizations.UnzipCompletedAlertDescText = "선택된 파일에 대한 압축 해제가 완료되었습니다.";

//zip operation
localizations.ZipStartedAlertTitleText = "압축 시작";
localizations.ZipStartedAlertDescText = "선택된 파일에 대한 압축이 시작되었습니다.";
localizations.ZipCompletedAlertTitleText = "압축 완료";
localizations.ZipCompletedAlertDescText = "선택된 파일에 대한 압축이 완료되었습니다.";

//Signup-Page
localizations.RegisterWindowProcessCompletedTitle = "등록 완료 : ";
localizations.RegisterWindowProcessCompleteMessage = "관리자의 활성화 이후, 등록한 아이디로 로그인 가능합니다.";
localizations.RegisterWindowProcessFailedMessage = "<strong>아래와 같은 이유로 등록에 실패할 수 있습니다 : </strong><br><br>- 아이디가 이미 사용 중일 경우. <br> - 서버가 일시적으로 등록이 불가능할 경우.  <br><br> 관리자에게 연락하거나, 재시도 해주세요.";

//Data size format items
localizations.dataByClassFormatBytes = "B";
localizations.dataByClassFormatKiloBytes = "KB";
localizations.dataByClassFormatMegaBytes = "MB";
localizations.dataByClassFormatGigaBytes = "GB";
localizations.dataByClassFormatTeraBytes = "TB";

localizations.loadingIndicatorText = "로딩 중...";

localizations.bytesSentLabelTextByClass = "전송 :";
localizations.bytesReceivedLabelTextByClass = "수신 :";
localizations.dirInfoDownloadLabelTextByClass = "다운로드 : ";
localizations.dirInfoUploadLabelTextByClass = "업로드 : ";
localizations.maxAndAvailableAmountLabelTextByClass = "가능/최대 :";
localizations.maxAmountPerDayLabelTextByClass = "하루 사용량 :";
localizations.quotaAvailableTextByClass = "가능";
localizations.maxAmountPerMonthLabelTextByClass = "한달 사용량 :";

//Server message localized
localizations.share_complete = "처리가 완료되었습니다.";
localizations.share_email_sent = "이메일이 전송되었습니다.";
localizations.share_open_in_email_client = "이메일 클라이언트로 열기";
localizations.email_failed = "<div class='errorMessage'>SMTP 문제로 이메일을 보낼 수 없습니다. 로그를 확인해주세요.</div>";

//Custom form
localizations.loadingPageInFormFailedTitle = "로딩 실패 : ";

//Upload runtime errors
localizations.FileUploadAccessDeniedErrorMsgText = "오류: 접근이 거부되었습니다.(권한이 없거나 허용되지 않는 파일 확장자 입니다)";
localizations.FileUploadContentNotAllowedErrorMsgText = "오류: 허용되지 않는 파일 내용입니다. (550 오류)";
localizations.FileUploadCanNotOverwriteErrorMsgText = "오류: 파일을 덮어쓸 수 없습니다.";

localizations.CustomEventCallSuccessTitle = "성공";
localizations.CustomEventCallSuccessDesc = "사용자 이벤트가 시작되었습니다.";
localizations.CustomEventCallFailureTitle = "실패";
localizations.CustomEventCallFailureDesc = "사용자 이벤트가 실행되는 중에 문제가 발생했습니다.";

//For Advanced Upload/Download Options
localizations.advancedUploadOptionsDialogTitle = "고급 옵션";
localizations.advancedDownloadOptionsButtonText = "고급 다운로드 옵션";
localizations.advancedUploadOptionsDialogSaveButtonText = "저장";
localizations.advancedUploadOptionsItemAvailableLabel = "기존에 존재하는 파일을 발견했을 경우 :";
localizations.advancedUploadOptionsUseCompressionLabel = "압축 사용하기 :";
localizations.advancedUploadOptionsAskActionDialogTitle = "원하는 동작을 선택해 주세요";
localizations.advancedUploadOptionsAskActionForFileDialogTitle = "파일에 대한 원하는 동작을 선택해 주세요 :";
localizations.advancedUploadOptionsAskActionLabelByClass = "동작 :";
localizations.advancedUploadOptionsAskActionDialogBtnText = "확인";
localizations.advancedUploadActionOverWriteSelectOptionText = "덮어쓰기";
localizations.advancedUploadActionOverWriteAllSelectOptionText = "모두 덮어쓰기";
localizations.advancedUploadActionResumeSelectOptionText = "이어받기";
localizations.advancedUploadActionResumeAllSelectOptionText = "모두 이어받기";
localizations.advancedUploadActionSkipSelectOptionText = "생략";
localizations.advancedUploadActionSkilAllSelectOptionText = "모두 생략";
localizations.advancedUploadActionAskSelectOptionText = "물어보기";
localizations.advancedUploadActionCompressionYesSelectOptionText = "예";
localizations.advancedUploadActionCompressionNoSelectOptionText = "아니요";

localizations.LoggedInAsLabelText = "로그인 정보 : ";
localizations.AccountExpiresOnLabelText = "만료 : ";

if (typeof $.sessionChecker != "undefined")
   $.sessionChecker.defaultOptions.noteTextTemplate = "(%time% 후, 세션이 종료됩니다.)";

//Slideshow labels
localizations.slideshow = localizations.slideshow || {};
localizations.slideshow = {
    waitMessage : "잠시 기다려주세요...",
    playSlideshow : "슬라이드 쇼 재생",
    pauseSlideshow : "슬라이드 쇼 일시 중지",
    refresh : "새로고침",
    fullscreen : "전체화면",
    download : "다운로드",
    upload : "업로드",
    deleteText : "삭제",
    rotateClockwise : "시계 방향으로 회전",
    rotateCounterClockwise : "반시계 방향으로 회전",
    previousItem : "이전 항목",
    nextItem : "다음 항목",
    delayText : "({x}초 지연)",
    nextPageText : "다음 &rsaquo;",
    prevPageText : "&lsaquo; 이전",
    itemCountText : "({x}/{y})",
    noItemMessage : "<h3 style='text-align:center;'>재생할 항목이 없거나, 오류가 발생했습니다.</h3>"
};