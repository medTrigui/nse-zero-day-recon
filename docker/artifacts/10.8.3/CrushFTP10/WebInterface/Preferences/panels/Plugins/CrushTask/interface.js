/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginCrushTask = {};
pluginCrushTask.localization = {};
/****************************/

// Plugin details
var pluginName = "CrushTask";
var _plugin = $("#pnlPlugin" + pluginName);
var tasksList = $("#tasksList", _plugin);

// Localizations
pluginCrushTask.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version: ",
	btnAddTaskText : " Add Task",
	btnEditTaskText : " Edit Selected ",
	btnRemoveTaskText : " Remove Selected ",
	btnMoveUpText : " Move Up ",
	btnMoveDownText : " Move Down ",
	lblSourceFilterText : "Source Filter :",
	lblMultiThreadedText : "Multi Threaded",
	lblOnErrorJumpToTaskNamedText : "On error, jump to task named: ",
	lblConfigTabText : "Config",
	lblVariablesTabText : "Variables",
	lblLoggingTabText : "Logging",
	lblHelpTabText : "Help",
	lblAs2TabOptionsText : "Options",
	lblAs2SigningTabText : "Signing",
	lblAs2EncryptingTabText : "Encrypting",
	lblAs2AsyncMDNText : "Async MDN",
	lblAs2UseCompressionText : "Use compression",
	lblmdnWaitSecondsText : "MDN Wait Timeout: ",
	lblmdnWaitSecondsNoteText : "(In Seconds)",
	lblAs2SignMessageText : "Sign Message: ",
	lblAs2EncryptMessageText : "Encrypt Message: ",
	lblAs2FromPartnerText : "From Partner: ",
	lblAs2ToPartnerText : "To Partner: ",
	lblAs2FromEmailText : "From Email: ",
	lblAs2SubjectText : "Subject: ",
	lblAs2RecipientURLText : "Recipient URL: ",
	lblAs2ResponseURLText : "Response URL: ",
	lblAs2KeystorePathText : "Keystore Path: ",
	lblAs2KeystoreFormatText : "Keystore Format: ",
	lblAs2KeystorePasswordText : "Keystore Password: ",
	lblAs2KeyPasswordText : "Key Password: ",
	lblAs2KeyNameText : "Key name (alias): ",
	lblDestinationText : "Destination: ",
	lblWaitXSecondsText : "Wait x seconds to see if the file has changed: ",
	lblGiveUpAfterXSecondsText : "Give up after x seconds: ",
	lblRetryFailedCopiesXTimesText : "Retry failed copies x times: ",
	lblRetryFailedMovesXTimesText : "Retry failed moves x times: ",
	lblResumeCopyText : "Resume",
	lblResumeOnFailureCopyText : "Resume only on failure",
	lblAsciiConvertText : "Convert Line Endings (Warning: only use on ASCII files): ",
	lblAsciiText : "ASCII Transfer",
	lblSimpleText : "Simple Mode",
	lblAfterCopyingAddToListText : "After copying, add to list for future tasks.",
	lblDeleteTaskWarningText : " Be especially careful when using delete task as you could delete the original and copy. ",
	lblKeepTryingForXSecondsText : "Keep trying for x seconds: ",
	lblFromText : "From: ",
	lblToText : "To: ",
	lblCCText : "CC: ",
	lblBCCText : "BCC: ",
	lblSubjectText : "Subject: ",
	lblBodyText : "Body: ",
	lblAttachFilesText : "Attach Files?",
	lblCommandText : "Command: ",
	lblExamplesText : "Examples: ",
	lblArgumentText : "Argument: ",
	lblSeparatorText : "Separator: ",
	lblWorkingDirectoryText : "Working Directory: ",
	lblEnvironmentVarsText : "Environment Variables :",
	lblExecuteActionInstructionsText : '<div> Example: If the command was "cp" and the argument was "{real_path};/archive/{name}" </div><div> Then, if a file was uploaded to "/uploads/stuff.zip", it would be copied to "/Archive/stuff.zip"</div><div> Note the purpose of the ";" (semicolon) in that, it separates arguments to the command.</div>',
	lblExcludeActionHelpText : " If an item matches the filter, it will be excluded from the future task processing. ",
	lblFindURLText : "Find URL: ",
	lblFindFilterText : "Find Filter: ",
	lblVerifyFilesAreNotChangingText : "Verify files are not changing",
	lblChangingAllText : "Wait for all files to stop changing",
	lblDepthText : "Depth: ",
	lblUseAbsolutePathsText : "Use absolute paths",
	lblLastModifiedText : "Last modified: ",
	lblFindCacheNameToUseText : "FindCache name to use: ",
	lblModifiedComparisonNewText : " Newer",
	lblModifiedComparisonOldText : " Older",
	lblDaysText : "Days: ",
	lblHoursText : "Hours: ",
	lblMinutesText : "Minutes: ",
	lblKeepCheckingForUpToXMinutesText : "Keep checking for up to x minutes: ",
	lblSecondsDelayBetweenScansText : "Seconds delay between scans: ",
	lblFailIfNoFilesFoundText : "Fail if no files are found",
	lblForceCWDText : "Force CWD before doing listings",
	lblJumpToTaskText : "Jump to task: ",
	lblJumpToJobText : "Jump to job: ",
	lblFilterNoteText : "Leave both fields blank to always be a true condition.",
	lblContinueAfterJumpText : "Continue after jump",
	lblFindCacheNameText : "Cache Name: ",
	lblFindCachePathText : "Path to store cache file: ",
	lblFindCacheModeLabelText : "Mode: ",
	lblFindCacheReadText : "Read",
	lblFindCacheWriteText : "Write",
	lblFeatureNoteText : "This feature is only available in enterprise licenses.",
	lblHTTPUrlText : "URL: ",
	lblHTTPMethodText : "HTTP Method: ",
	lblHTTPUsernameText : "HTTP Username: ",
	lblHTTPPasswordText : "HTTP Password: ",
	lblHTTPRetryText : "Retry x times on failure: ",
	lblHTTPMaximumFileText : "Maximum files per event that post without delay: ",
	lblHTTPDelayText : "Delay between event posts: ",
	lblHTTPPostDataText : "POST Data: ",
	lblHTTPOnlyRecentText : "Only use most recent item.",
	lblDirectoryNameText : "Directory Name: ",
	lblDestinationText : "Destination: ",
	lblPGPKeyFileText : "Key file: ",
	lblPGPKeyPasswordText : "Key password (if any): ",
	lblPGPEncryptionMethodText : "Method: ",
	lblPGPAsciiArmorText : "ASCII Armor?",
	lblPGPDeleteOriginalText : "Delete Original?",
	lblPreserveModifiedDateText : "Preserve modified date",
	lblPreviewActionHelpText : " Request this file be processed by the Preview function in the CrushFTP prefs. ",
	lblNewNameText : "New Name: ",
	lblKeepTryingForXSecondsText : "Keep trying for x seconds: ",
	lblSkipSubItemsIfParentIsRenamedText : "Skip sub items if parent is renamed.",
	lblVariableNameText : "Variable Name: ",
	lblVariableValueText : "Variable Value: ",
	lblDeleteOriginalZipText : "Delete original .zip",
	lblInternalUnzippingText : "Internal Unzipping",
	lblUnzipIntoOwnFolderText : "Unzip into its own folder.",
	lblExternalUnzipText : "External 'unzip' Unzipping",
	lblDestPathText : "Output Location: ",
	lblWaitXSecondsText : "Wait x seconds: ",
	lblWaitForPreviousThreadsToFinishText : "Wait for previous threads to finish.",
	lblFilePathText : "File Path: ",
	lblOverwriteText : "Overwrite?",
	lblLoopText : "Loop through items?",
	lblContentsText : "Contents: ",
	lblInternalZippingText : "Internal Zipping",
	lblExternalZipText : "External 'zip' Zipping",
	btnApplyText : "Apply",
	lblLogSuccessText : "Log Success?",
	lblFileText : "File :",
	lblLineText : "Line :",
	lblLogFailureText : "Log Failure?",
	lblUserConnectionGroupText : "User Connection Group: ",
	lblFindUserFiltersText : "Find Username Filter: ",
	lblExcludeUserFiltersText : "Exclude Username Filter: ",
	lblTaskToCallText : "Task to call with user info: ",
	lblMailProtocolText : "Mail Protocol: ",
	lblMailHostText : "Mail Host: ",
	lblMailPortText : "Mail Port: ",
	lblMailUsernameText : "Mail Username: ",
	lblMailPassText : "Mail Password: ",
	lblMailInboxText : "Mail Inbox: ",
	lblProcessUnreadMsgsText : "Only process unread messages? ",
	lblMarkAsReadText : "Mark messages as read after processing? ",
	lblDeleteMailText : "Delete messages after processing? ",
	lblSubjectFilterText : "Subject Filter: ",
	lblFromFilterText : "From Filter: ",
	lblMailPathText : "Download files to here: ",
	lblMailFileNameText : "File Name: ",
	lblSaveAttachmentsText : "Save attachments? ",
	lblMinimumSizeText : "Minimum file size in bytes: ",
	lblFileFilterText : "Filename Filter: ",
	lblSaveEmailAsFileText : "Save body of email as file? "
};

// Assign localizations
if(localizations.panels["Plugins"])
	localizations.panels["Plugins"][pluginName] = $.extend(pluginCrushTask.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginCrushTask.init = function(pluginID, returnXML, index){
	pluginCrushTask.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	index = index || 0;
	pluginCrushTask.bindData(index, pluginID);
	if(!$(document).data("app_enterprise"))
	{
		$(".enterpriseFeature", _panel).hide();
	}
}

pluginCrushTask.defaultValues = {
	as2Action : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "As2"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "As2"}],
		key_path : [{text : ""}],
		as2EncryptKeyPassword : [{text : ""}],
		as2EncryptKeystorePath : [{text : ""}],
		as2EncryptKeystorePassword : [{text : ""}],
		as2EncryptKeystoreFormat : [{text : "JKS"}],
		as2EncryptKeyAlias : [{text : ""}],
		as2EncryptType : [{text : "none"}],
		as2SignKeyAlias : [{text : ""}],
		as2SignKeyPassword : [{text : ""}],
		as2SignKeystoreFormat : [{text : "JKS"}],
		as2SignKeystorePassword : [{text : ""}],
		as2SignType : [{text : "none"}],
		as2SignKeystorePath : [{text : ""}],
		as2RecipientUrl : [{text : ""}],
		as2ToPartner : [{text : ""}],
		as2AsyncMdn : [{text : "false"}],
		as2Compress : [{text : "false"}],
		as2FromPartner : [{text : ""}],
		as2Subject : [{text : ""}],
		as2From : [{text : ""}],
		as2ResponseUrl : [{text : ""}],
		mdnWaitSeconds : [{text : ""}],
		delay_interval : [{text : ""}]
	},
	copyAction : {
		addAfterCopy : [{text : "false"}],
		changed : [{text : "2"}],
		changedTimeout : [{text : "60"}],
		destPath : [{text : "{path}{stem}{ext}"}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		threads : [{text : "1"}],
		name : [{text : "Copy"}],
		preserveModifiedDate : [{text : "true"}],
		retry : [{text : "0"}],
		sourceFilter : [{text : "*"}],
		ssh_private_key : [{text : ""}],
		ssh_private_key_pass : [{text : ""}],
		ssh_two_factor : [{text : "false"}],
		ascii : [{text : "false"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Copy"}],
		pasv : [{text : "true"}],
		resume : [{text : "false"}],
		resume_failure : [{text : "false"}],
		ascii_convert : [{text : "none"}],
		ascii : [{text : "false"}],
		simple : [{text : "false"}],
		addAfterCopy : [{text : "false"}],
		keystore : [{text : ""}],
		keystore_pass : [{text : ""}],
		key_pass : [{text : ""}],
		copyUnique : [{text : "false"}],
		copyUniqueName : [{text : ""}],
		secure : [{text : "false"}],
		send_compressed : [{text : "false"}],
		receive_compressed : [{text : "false"}]
	},
	deleteAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Delete"}],
		retry : [{text : "10"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Delete"}]
	},
	emailAction : {
		attachFiles : [{text : "false"}],
		emailBcc : [{text : ""}],
		emailBody : [{text : ""}],
		emailCc : [{text : ""}],
		emailFrom : [{text : ""}],
		emailSubject : [{text : ""}],
		emailTo : [{text : ""}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Email"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Email"}]
	},
	executeAction : {
		argument : [{text : ""}],
		command : [{text : ""}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Execute"}],
		separator : [{text : ";"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		workingDirectory : [{text : "{real_path}"}],
		type : [{text : "Execute"}],
		environment_vars : [{text : ""}],
		ignore_error : [{text : "false"}]
	},
	excludeAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Exclude"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Exclude"}]
	},
	findAction : {
		absolute_paths : [{ text : "false"}],
		changing : [{ text : "true"}],
		changingAll : [{ text : "true"}],
		days : [{ text : "0"}],
		depth : [{ text : "1"}],
		cache_name : [{ text : ""}],
		fail_jump : [{text : ""}],
		fail_no_files : [{ text : "true"}],
		failure_log : [{ text : "false"}],
		failure_log_file : [{ text : "./failure.log"}],
		failure_log_line : [{ text : "FAIL : {taskName}{r}{n}"}],
		findFilter : [{ text : "*"}],
		findUrl : [{ text : "{path}"}],
		hours : [{ text : "0"}],
		minutes : [{ text : "0"}],
		multiThreaded : [{ text : "false"}],
		name : [{ text : "Find"}],
		retry_delay : [{ text : "0"}],
		retry_minutes : [{ text : "0"}],
		sourceFilter : [{ text : "*"}],
		ssh_private_key : [{text : ""}],
		ssh_private_key_pass : [{text : ""}],
		ssh_two_factor : [{ text : "false"}],
		success_log : [{ text : "false"}],
		success_log_file : [{ text : "./success.log"}],
		success_log_line : [{ text : "OK : {taskName}{r}{n}"}],
		type : [{ text : "Find"}],
		modified_comparison : [{ text : "new"}],
		find_deleted : [{text : "false"}],
		pasv : [{text : "true"}],
		secure : [{text : "false"}],
		ignore_folders : [{text : "false"}],
		max_items : [{text : ""}],
		config_cwd_list : [{text : "false"}],
		no_stat : [{text : "false"}]
	},
	findcacheAction : {
		fail_jump : [{text : ""}],
		fail_no_files : [{ text : "false"}],
		failure_log : [{ text : "false"}],
		failure_log_file : [{ text : "./failure.log"}],
		failure_log_line : [{ text : "FAIL : {taskName}{r}{n}"}],
		cache_folder : [{ text : ""}],
		cache_mode : [{ text : "read"}],
		cache_name : [{ text : "CacheItem"}],
		multiThreaded : [{ text : "false"}],
		name : [{ text : "Find"}],
		sourceFilter : [{ text : "*"}],
		success_log : [{ text : "false"}],
		success_log_file : [{ text : "./success.log"}],
		success_log_line : [{ text : "OK : {taskName}{r}{n}"}],
		type : [{ text : "FindCache"}]
	},
	jumpAction : {
		fail_jump : [{text : ""}],
		failure_log : [{ text : "false"}],
		failure_log_file : [{ text : "./failure.log"}],
		failure_log_line : [{ text : "FAIL : {taskName}{r}{n}"}],
		jump_job : [{text : ""}],
		jump_task : [{text : ""}],
		multiThreaded : [{ text : "false"}],
		name : [{ text : "Jump"}],
		sourceFilter : [{ text : "*"}],
		success_log : [{ text : "false"}],
		success_log_file : [{ text : "./success.log"}],
		success_log_line : [{ text : "OK : {taskName}{r}{n}"}],
		continueJump : [{ text : "true"}],
		variable2 : [{ text : ""}],
		variable1 : [{ text : ""}],
		variableCondition : [{ text : "contains"}],
		type : [{ text : "Jump"}]
	},
	httpAction : {
		fail_jump : [{text : ""}],
		failure_log : [{ text : "false"}],
		failure_log_file : [{ text : "./failure.log"}],
		failure_log_line : [{ text : "FAIL : {taskName}{r}{n}"}],
		destUrl : [{text : "http://domain.com/?file={path}"}],
		recent : [{text : "false"}],
		httpMethod : [{ text : "POST"}],
		name : [{ text : "Http"}],
		sourceFilter : [{ text : "*"}],
		success_log : [{ text : "false"}],
		success_log_file : [{ text : "./success.log"}],
		success_log_line : [{ text : "OK : {taskName}{r}{n}"}],
		retries : [{ text : "0"}],
		maxFiles : [{ text : "100"}],
		maxFilesSeconds : [{ text : "1"}],
		delay : [{ text : "1000"}],
		post : [{ text : ""}],
		type : [{ text : "Http"}],
		username : [{ text : ""}],
		password : [{ text : ""}]
	},
	tunnelAction : {
		fail_jump : [{text : ""}],
		failure_log : [{ text : "false"}],
		failure_log_file : [{ text : "./failure.log"}],
		failure_log_line : [{ text : "FAIL : {taskName}{r}{n}"}],
		destUrl : [{text : "http://domain.com/"}],
		name : [{ text : "Tunnel"}],
		sourceFilter : [{ text : "*"}],
		success_log : [{ text : "false"}],
		success_log_file : [{ text : "./success.log"}],
		success_log_line : [{ text : "OK : {taskName}{r}{n}"}],
		type : [{ text : "Tunnel"}],
		tunnel_action : [{ text : "Start"}],
		tunnel_name : [{ text : ""}],
		username : [{ text : ""}],
		password : [{ text : ""}]
	},
	makedirectoryAction : {
		destPath : [{text : "{path}new_folder"}],
		fail_jump : [{text  :  ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "MakeDirectory"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "MakeDirectory"}],
		pasv : [{text : "true"}],
		secure : [{ text : "false"}],
		ssh_private_key : [{ text : ""}],
		ssh_private_key_pass : [{ text : ""}],
		ssh_two_factor : [{ text : "false"}],
		keystore : [{ text : ""}],
		keystore_pass : [{ text : ""}],
		key_pass : [{ text : ""}],
		ascii : [{ text : "false"}],
		simple : [{ text : "false"}]
	},
	moveAction : {
		destPath : [{text : "{path}{stem}{ext}"}],
		changed : [{text : "2"}],
		changedTimeout : [{text : "60"}],
		retry : [{text : "0"}],
		fail_jump : [{text  :  ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		threads : [{text : "1"}],
		name : [{text : "Move"}],
		preserveModifiedDate : [{text : "true"}],
		sourceFilter : [{text : "*"}],
		ssh_private_key : [{text  :  ""}],
		ssh_private_key_pass : [{text  :  ""}],
		ssh_two_factor : [{text : "false"}],
		ascii : [{text : "false"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Move"}],
		pasv : [{text : "true"}],
		secure : [{ text : "false"}],
		send_compressed : [{ text : "false"}],
		receive_compressed : [{ text : "false"}],
		keystore : [{ text : ""}],
		keystore_pass : [{ text : ""}],
		key_pass : [{ text : ""}],
		copyUnique : [{ text : "false"}],
		copyUniqueName : [{text : ""}],
		resume : [{ text : "false"}],
		resume_failure : [{ text : "false"}],
		ascii_convert : [{ text : "none"}],
		simple : [{ text : "false"}]
	},
	pgpAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Pgp"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Pgp"}],
		key_path : [{text : ""}],
		ascii_armor : [{text : "false"}],
		key_password : [{text : ""}],
		encryption_method : [{text : "Encrypt"}],
		delete_original : [{ text : "false"}]
	},
	popimapAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "PopImap"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "PopImap"}],
		destPath : [{text : ""}],
		findUrl : [{text : ""}],
		mail_attachments : [{text : "true"}],
		mail_body : [{text : "false"}],
		mail_delete : [{text : "false"}],
		mail_file_filter : [{text : "*"}],
		mail_from_filter : [{text : "*"}],
		mail_to_filter : [{text : "*"}],
		mail_host : [{text : "imap.gmail.com"}],
		mail_name : [{text : "msg_{mail_index}.{mail_type}"}],
		mail_pass : [{text : ""}],
		mail_path : [{text : ""}],
		mail_port : [{text : "993"}],
		mail_protocol : [{text : "imaps"}],
		mail_read : [{text : "true"}],
		mail_size : [{text : "0"}],
		mail_subject_filter : [{text : "*"}],
		mail_unread : [{text : "true"}],
		mail_user : [{text : ""}],
    	mail_inbox : [{text : "Inbox"}]
	},
	previewAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Preview"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Preview"}]
	},
	renameAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Rename"}],
		newName : [{text : "{stem}{ext}"}],
		retry : [{text : "10"}],
		skipSubitems : [{text : "true"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Rename"}]
	},
	userslistAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "UserVariable"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "UsersList"}],
		destPath: [{text : ""}],
		excludeUserFilters: [{text : "default,TempAccount,anonymous"}],
		findUrl: [{text : ""}],
		findUserFilters: [{text : "*"}],
		taskToCall: [{text : ""}],
		userConnectionGroup: [{text : "MainUsers"}]
	},
	uservariableAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "UserVariable"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "UserVariable"}],
		varName : [{text : "myVariable"}],
		varValue : [{text : "10"}]
	},
	unzipAction : {
		delete_zip : [{text : "false"}],
		external_zip : [{text : "false"}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		internal_zip : [{text : "true"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Unzip"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Unzip"}],
		unzip_in_folder : [{text : "false"}],
		destPath : [{ text : ""}]
	},
	waitAction : {
		delay : [{text : "1"}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Wait"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Wait"}],
		variable2 : [{ text : ""}],
		variable1 : [{ text : ""}],
		variableCondition : [{ text : "contains"}],
		wait_time_unit : [{ text : "seconds"}],
		waitThreads : [{text : "false"}],
		conditional_enabled : [{text : "false"}]
	},
	writefileAction : {
		afterContent : [{text : ""}],
		beforeContent : [{text : "<LINE><item> <title>{name}</title> <description>{path}</description> <link>{url}</link> </item>{r}{n}</LINE>"}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		fileContents : [{text : "<?xml version=\"1.0\" ?>\r\n<rss version=\"2.0\">\r\n<channel>\r\n<title>New Files</title>\r\n<description>Incoming files...</description>\r\n<link>http : //www.crushftp.com</link>\r\n</channel>\r\n</rss>"}],
		filePath : [{text : ""}],
		findAfter : [{text : ""}],
		findBefore : [{text : "</channel>"}],
		findText : [{text : ""}],
		replaceText : [{text : ""}],
		multiThreaded : [{text : "false"}],
		name : [{text : "WriteFile"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "WriteFile"}],
		overwrite : [{text : "false"}],
		loop_items : [{text : "false"}]
	},
	zipAction : {
		external_zip : [{text : "false"}],
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		filePath : [{text : "/archives/newArchive.zip"}],
		internal_zip : [{text : "true"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Zip"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Zip"}]
	},
	sqlAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		db_driver : [{text : "org.gjt.mm.mysql.Driver"}],
		db_driver_file : [{text : "./mysql-connector-java-5.0.4-bin.jar"}],
		db_url : [{text : "jdbc:mysql://127.0.0.1:3306/crushftp?autoReconnect=true"}],
		db_user : [{text : "CrushSQL"}],
		db_pass : [{text : ""}],
		db_query : [{text : "select * from users\nwhere userName=?\nand userPass=?\nand (expireDate is null or expireDate > ?)"}],
		name : [{text : "SQL"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "SQL"}],
		rollback : [{text : "false"}]
	},
	fileparserAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		column_headers : [{text : "true"}],
		delimiter : [{text : "comma"}],
		column_override : [{text : ""}],
		name : [{text : "FileParser"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "FileParser"}],
		read_as_text_blob : [{ text : "false"}]
	},
	customAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		multiThreaded : [{text : "false"}],
		name : [{text : "Custom"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Custom"}]
	},
	compressAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		name : [{text : "Compress"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Compress"}]
	},
	decompressAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		name : [{text : "Decompress"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Decompress"}]
	},
	killAction : {
		fail_jump : [{text : ""}],
		failure_log : [{text : "false"}],
		failure_log_file : [{text : "./failure.log"}],
		failure_log_line : [{text : "FAIL : {taskName}{r}{n}"}],
		name : [{text : "Kill"}],
		sourceFilter : [{text : "*"}],
		success_log : [{text : "false"}],
		success_log_file : [{text : "./success.log"}],
		success_log_line : [{text : "OK : {taskName}{r}{n}"}],
		type : [{text : "Kill"}]
	}
};

pluginCrushTask.bindData = function(index, pluginID)
{
	_panel.find(".maskPasswordOnURL").each(function () {
		$(this).removeData("originalURL realURL url");
		var rel = $(this).attr("rel");
		if (rel) {
		  var refElem = $("#" + rel, _plugin);
		  refElem.removeData("urlParams");
		}
	});
	$("div.pluginDetails, div.actionConfigPanel").hide();
	window.taskLoaded = false;
	index = index || 0;
	var pluginPrefs = [];
	if(pluginID)
	{
		var data = $(document).data("PluginBindData" + pluginID);
		pluginPrefs = data.dataItem;
		$(".nonEmbed", _plugin).hide();
	}
	else
	{
		pluginPrefs = common.data.getPluginPrefs(pluginName);
	}
	if(pluginPrefs)
	{
		var curPlugin = pluginPrefs;
		if(!pluginID && pluginPrefs.length)
		{
			curPlugin = pluginPrefs[index];
		}
		var loadedPlugin;
		if(curPlugin && curPlugin.subItem && curPlugin.subItem.length>0){
			_plugin.attr("subPluginName", curPlugin.subItem[0].text || "");
			loadedPlugin = curPlugin.subItem[0].text;
		}
		var hasChanges =  pluginPlaceHolder.data("hasChanged");
		var readyListenChanges = false;
		var taskDesignerPanel = $("#taskDesignerPanel");
		var spanTop = $(document).scrollTop();
		$("#copyToJobs", _panel).hide();
		crushFTP.kioskJobData = {
			initCallback : function(taskDesigner){
				pluginCrushTask.taskDesigner = taskDesigner;
				taskDesigner.loadedPlugin = loadedPlugin;
				taskDesigner.init(curPlugin);
				setTimeout(function(){
					window.taskLoaded = true;
					if(!hasChanges)
						pluginPlaceHolder.removeData("hasChanged");
					pluginPlaceHolder.find("#enabled, #debug, #save_state,#log_enabled, #save_history").bind("change", function(){
						panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
					});
					if(window.panelEvents)
					{
						window.panelEvents.updatePluginControlData();
					}
					if(typeof window.afterDesignerLoads !="undefined")
					{
						window.afterDesignerLoads();
						delete window.afterDesignerLoads;
					}
					if(!hasChanges)
						pluginPlaceHolder.removeData("hasChanged");
					setTimeout(function(){
						readyListenChanges = true;
						crushFTP.kioskJobData.readyListenChanges = true;
					}, 100);
				}, 100);
				$('body').removeClass('stop-scrolling');
                $('html,body').animate({
                    scrollTop: spanTop
                }, 0, false);
                $("#copyToJobs", _panel).show();
			},
			resizeFrame : function(width, height){
				if(width && height)
					$("#taskDesignerIframe").width(width + 50).height(height);
					if(taskDesignerPanel.hasClass('miniatureTaskDesigner'))
					{
						$("#taskDesignerPanelContainer").width(800).height(500).css("overflow", "hidden");
						$("#taskDesignerPanelContainer").scrollTo(0,0);
					}
					else
					{
						setTimeout(function(){
							$("#taskDesignerPanelContainer").height($("#pnlPluginCrushTask").height() - 60).width($("#pnlPluginCrushTask").width() - 10).css("overflow", "scroll");
						}, 100);
					}
			},
			dataChangeCallback : function(flag){
				if(readyListenChanges)
				{
					panelPlugins.itemsChanged(flag, pluginCrushTask.returnXML, pluginName, pluginID);
					if(window.panelEvents)
					{
						window.panelEvents.updatePluginControlData();
					}
					pluginPlaceHolder.data("hasChanged", true);
				}
			}
		}
		if(window.panelEvents)
		{
			taskDesignerPanel.addClass('miniatureTaskDesigner');
			$(".enterpriseFeature", _panel).hide();
		}
		var width = $(document).width() - $("#menu").width() - 200;
		taskDesignerPanel.html('<iframe id="taskDesignerIframe" onload="$(\'#taskDesignerPanel\').unblock()" width="'+width+'" height="900" src="/WebInterface/Jobs/index.html?kiosk=true" style="margin:0px;padding:0px;" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no"></iframe>');
		taskDesignerPanel.block({
            message:  'Please Wait..',
            css: {
                width:100,
                border: 'none',
                padding: '10px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff',
                'text-align':'left'
            }
        });
		if(window.panelEvents)
		{
			taskDesignerPanel.before("<div class='popOutButton'></div>");
			taskDesignerPanel.before('<div class="miniatureOverLay"></div>');
			taskDesignerPanel.parent().find(".popOutButton, .miniatureOverLay").click(function(event) {
				try{
					taskDesignerPanel.removeClass('miniatureTaskDesigner');
					taskDesignerPanel.parent().find(".popOutButton, .miniatureOverLay").hide();
					parent.panelEvents.zoomInTaskDesigner();
					setTimeout(function(){
						$("#taskDesignerPanelContainer").height($("#pnlPluginCrushTask").height() - 60).width($("#pnlPluginCrushTask").width() - 10).css("overflow", "scroll");
						var op = {
							width : $("#taskDesignerPanelContainer").width() - 70,
							height : $("#taskDesignerPanelContainer").height() - 70
						};
						if(pluginCrushTask && pluginCrushTask.taskDesigner && pluginCrushTask.taskDesigner.resizeCanvas)
							pluginCrushTask.taskDesigner.resizeCanvas(op, true);
					}, 100);
				}catch(ex){}
			});

			_plugin.find(".zoomOutTaskDesginer").click(function(event) {
				try{
					taskDesignerPanel.addClass('miniatureTaskDesigner');
					taskDesignerPanel.parent().find(".popOutButton, .miniatureOverLay").show();
					parent.panelEvents.zoomOutTaskDesigner();
					setTimeout(function(){
						$("#taskDesignerPanelContainer").width(800).height(500).css("overflow", "hidden");
					}, 100);
				}catch(ex){}
				return false;
			});
		}
		if(typeof curPlugin.save_state == "undefined")
            curPlugin.save_state = [{"text" : "true"}];
        if(typeof curPlugin.save_history == "undefined")
            curPlugin.save_history = [{"text" : "true"}];
        if(typeof curPlugin.log_enabled == "undefined")
            curPlugin.log_enabled = [{"text" : "true"}];
		bindValuesFromXML(_plugin, curPlugin);
	}
	else
	{
		if(window.panelEvents)
		{
			setTimeout(function(){
				$("#pluginsAvailable").trigger("change")
			},100);
		}
	}
	$("#copyToJobs", _panel).unbind().click(function(){
		jPrompt("Enter job name :", "New Job", "Job Name", function(value){
			if(value!=null)
			{
				var availableJobs = $(document).data("AvailableJobs");
				if(availableJobs.has(value))
				{
					jAlert("Job name is already in use, please use another name", "Error", function(){
                        $("#copyToJobs", _panel).click();
                    });
                    return false;
				}
				else
				{
					if(pluginCrushTask.taskDesigner)
					{
						pluginCrushTask.taskDesigner.copyLoadedJob(value, function(flag){
							if(flag)
							{
								availableJobs.push(value);
								$(document).data("AvailableJobs", availableJobs);
								if(typeof window.panelEvents != "undefined")
								{
									setTimeout(function(){
										panelEvents.bindPluginsList(false, true);
									}, 100);
								}
							}
						});
					}
				}
			}
		});
		return false;
	});
}

pluginCrushTask.bindEvents = function()
{
	if(this.eventAdded)return;
	/*var prefs = common.data.ServerPrefs();
	if(prefs["tunnels"])
	{
		var tunnels = prefs["tunnels"];
		if(tunnels.length>0)
		{
			tunnels = tunnels[0]["tunnels_subitem"];
			if(tunnels && tunnels.length>0)
			{
				var tunnel_name = $("#tunnel_name").empty();
				for(var i=0;i<tunnels.length;i++)
				{
					var curItem = tunnels[i];
					if(curItem)
					{
						var name = crushFTP.data.getTextValueFromXMLNode(curItem.name, "");
						var newControl = $("<option value='"+name+"'>"+name+"</option>");
						tunnel_name.append(newControl);
					}
				}
			}
		}
	}*/
	tasksList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			tasksList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			pluginCrushTask.bindPluginDetails(selected);
			pluginCrushTask.bindTextChangeEvents();
			return false;
		}
	});

	_plugin.find("#mail_protocol").change(function(){
		var protocol = $(this).val();
		if(protocol=="imaps")
		{
			$("#mail_port", _plugin).val("993").trigger("change");
		}
		else if(protocol=="imap")
		{
			$("#mail_port", _plugin).val("143").trigger("change");
		}
		else if(protocol=="pop3s")
		{
			$("#mail_port", _plugin).val("995").trigger("change");
		}
		else if(protocol=="pop3")
		{
			$("#mail_port", _plugin).val("110").trigger("change");
		}
	})

	_plugin.find("#example").change(function(){
		var val = $(this).val();
		if(val == "1")
		{
			$("#command", _plugin).val("cp");
			$("#argument", _plugin).val("{real_path};/archive/{name}");
		}
		else if(val == "2")
		{
			$("#command", _plugin).val("mv");
			$("#argument", _plugin).val("{real_path};/processing/new files/{name}");
		}
		else if(val == "3")
		{
			$("#command", _plugin).val("/Applications/MyApp.app/Contents/MacOS/MyApp");
			$("#argument", _plugin).val("{real_path}");
		}
		else if(val == "4")
		{
			$("#command", _plugin).val("open");
			$("#argument", _plugin).val("{real_path}");
		}
		else
		{
			$("#command, #argument", _plugin).val("");
		}
		$("#command, #argument", _plugin).trigger("change");
	});

	$("a#moveTaskUp, a#moveTaskDown", _plugin).click(function(){
		if(tasksList.find("li.ui-widget-header").length>0)
		{
			var selected = tasksList.find("li.ui-widget-header");
			if($(this).is("#moveTaskUp") && selected.prev("li").length>0)
			{
				selected.prev("li").before(selected);
				panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
				pluginCrushTask.bindPluginDetails(selected);
			}
			else if($(this).is("#moveTaskDown") && selected.next("li").length>0)
			{
				selected.next("li").after(selected);
				panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
				pluginCrushTask.bindPluginDetails(selected);
			}
		}
		return false;
	});

	$("a#removeTask", _plugin).click(function(){
		crushFTP.UI.removeItem(tasksList, function(selected){
			panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
			pluginCrushTask.bindPluginDetails(selected);
		});
		return false;
	});

	$("a#addNewTask", _plugin).click(function(control){
			var actionType =  "";
			var actionName = "";
			if(control)
			{
				actionType = crushFTP.data.getTextValueFromXMLNode(control.type, "");
				actionName = crushFTP.data.getTextValueFromXMLNode(control.name, "");
			}
			jPrompt("Choose a task type:", actionType, "Tasks", function(value){
				actionType = value;
				if(actionType!=null)
				{
					if(actionType.length == 0)
					{
						$("#addNewLabel", _panel).trigger("click");
						return;
					}
					actionName = actionName || actionType;
					jPrompt("Enter a name for this task:", actionName, "Name", function(value){
						actionName = value;
						if(actionName)
						{
							var newControl = $("<li class='ui-widget-content' pluginType='"+crushFTP.methods.htmlEncode(actionType.toString().toLowerCase()) +"'>" + crushFTP.methods.htmlEncode(actionName) + " : " + crushFTP.methods.htmlEncode(actionType) +"</li>");
							tasksList.append(newControl);
							newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
							newControl.addClass("ui-widget-header").addClass("ui-selected");
							var data = pluginCrushTask.defaultValues[actionType.toString().toLowerCase() + "Action"];
							data = $.extend(true, {}, data);
							if(data)
							{
								data.name = [{text:actionName}];
								newControl.data("controlData", data);
							}
							pluginCrushTask.bindPluginDetails(newControl);
						}
						panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
					});
				}
			}, ['As2',
					'Copy',
					'Delete',
					'Email',
					'Execute',
					'Exclude',
					'FileParser',
					'Find',
					'FindCache',
					'Jump',
					'HTTP',
					'MakeDirectory',
					'Move',
					'Pgp',
					'PopImap',
					'Preview',
					'Rename',
					'SQL',
					'Tunnel',
					'UsersList',
					'UserVariable',
					'Unzip',
					'Wait',
					'WriteFile',
					'Zip',
					'Custom']
			);
		return false;
	});

	$("a#editTask", _plugin).click(function(){
			var control = tasksList.find("li.ui-widget-header");
			var actionName = "";
			var actionType = "";
			var controlData = false;
			if(control)
			{
				controlData = control.data("controlData");
				actionName = crushFTP.data.getTextValueFromXMLNode(controlData.name, "");
				actionType = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
			}
			else
			{
				return false;
			}
			jPrompt("Enter a name for this task: ", actionName, "Name", function(value){
				actionName = value;
				if(actionName)
				{
					var newControl = $("<li class='ui-widget-content' pluginType='"+actionType.toString().toLowerCase() +"'>" + actionName + " : " + actionType +"</li>");
					control.replaceWith(newControl);
					if(controlData && controlData.name)
					{
						controlData.name[0].text = actionName;
					}
					newControl.data("controlData", controlData);
					pluginCrushTask.bindPluginDetails(newControl);
				}
				panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
			});
		return false;
	});

	pluginCrushTask.bindTextChangeEvents();

	_plugin.find(".SSHOptionsHandle").each(function(){
		$(this).bind("textchange", function(){
			var text = $(this).val().toLowerCase();
			var elem = $(this);
			elem.closest("div.actionConfigPanel").find(".smbOption, .smbOnlyOption").hide();
			if(text.indexOf("file://")>=0)
            {
                elem.closest("div.actionConfigPanel").find(".nonFileOption").hide();
            }
            else
            {
                elem.closest("div.actionConfigPanel").find(".nonFileOption").show();
            }
			if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
			{
				elem.closest("div.actionConfigPanel").find(".httpOptions").show();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".httpOptions").hide();
			}
			if(text.indexOf("sftp://")>=0)
			{
				elem.closest("div.actionConfigPanel").find(".sftpOptions").show();
				elem.closest("div.actionConfigPanel").find(".nonSftpOptions").hide();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".sftpOptions").hide();
			}
			if(text.indexOf("ftps://")>=0 || text.indexOf("https://")>=0)
			{
				elem.closest("div.actionConfigPanel").find(".sslOptions").show();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".sslOptions").hide();
			}
			if(text.indexOf("ftp://")==0)
			{
				elem.closest("div.actionConfigPanel").find(".ftpOptions").show();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".ftpOptions").hide();
			}
			if(text.indexOf("smb://")==0)
            {
            	elem.closest("div.actionConfigPanel").find(".smbOnlyOption").show();
            	elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
			if(text.indexOf("smb")==0)
            {
            	elem.closest("div.actionConfigPanel").find(".smbOption").show();
            	elem.closest("div.actionConfigPanel").find("div.advanced-options").show();
            }
			if(text.indexOf("smb://")==0 || text.indexOf("smb3://")==0  || text.indexOf("file:")==0)
			{
				elem.closest("div.actionConfigPanel").find(".dmzOption").hide();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".dmzOption").show();
			}
			if(text.indexOf("ftp://")==0 || text.indexOf("ftps://")==0 || text.indexOf("ftpes://")==0)
			{
				elem.closest("div.actionConfigPanel").find(".ftpSOptions").show();
				if(text.indexOf("ftpes://")==0)
					elem.closest("div.actionConfigPanel").find(".sslOptions").show();
			}
			else
			{
				elem.closest("div.actionConfigPanel").find(".ftpSOptions").hide();
			}
			if(elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").length>0)
				elem.closest("div.actionConfigPanel").find(".encryptionMode:visible").trigger("change");
		});
	});

	_plugin.find(".httpOnly").each(function(){
		$(this).bind("textchange", function(){
			var text = $(this).val().toLowerCase();
			if(text.indexOf("http://")>=0 || text.indexOf("https://")>=0)
			{
				$(this).removeClass("ui-state-error").closest("p").find(".errorMsg").hide();
			}
			else
			{
				$(this).addClass("ui-state-error").closest("p").find(".errorMsg").show();
			}
		});
	});

	_plugin.find(".maskPasswordOnURL").each(function(){
		$(this).unbind("blur.form").bind("blur.form", function(){
			var item = tasksList.find("li.ui-widget-header");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			var elem = $(this);
			var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
			if(url && elem.val().substr(8, 1) != ":")
			{
				var pass = url.password();
				var mask = false;
				var existingPass = elem.data("password");
				if(pass != existingPass)
				{
					if(existingPass)
					{
						mask = new Array(existingPass.length+1).join('*');
					}
					if(existingPass && pass == mask)
						pass = existingPass;
					else
						mask = new Array(pass.length+1).join('*');
					if(pass)
					{
						elem.data("password", pass);
						url.password(mask);
						elem.val(unescape(url.toString()));
					}
				}
				else
				{
					pass = existingPass;
					mask = new Array(pass.length+1).join('*');
					url.password(mask);
					elem.val(unescape(url.toString()));
				}
				url.password(pass);
				data[$(this).attr("id")] = [{text: unescape(url.toString())}];
			}
		});
	});

	_plugin.find("#findUrl").change(function(){
		var path = $(this).val();
		if(path=="{path}" || path=="")
			return;
		if(path[path.length-1] != "/" && path[path.length-1] != "\\")
		{
			path += "/";
		}
		$(this).val(path);
	});

	_plugin.find(".encryptionMode").each(function(){
		$(this).bind("change", function(){
			var text = $(this).val().toLowerCase();
			if(text == "true")
			{
				$(this).closest("div.actionConfigPanel").find("div.sslOptions").show();
			}
			else
			{
				$(this).closest("div.actionConfigPanel").find("div.sslOptions").hide();
			}
		});
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
            var rel = curElem.attr("rel");
            var pickingFor = curElem.parent().parent().parent().find("label[for='"+rel+"']").text() || "";
            pickingFor = $.trim($.trim(pickingFor).replace(":", ""));
			var obj = {
				type : curElem.attr("PickType") || 'dir',
				pickingFor: pickingFor,
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				callback : function(selectedPath, ftpServerInfo){
					if(ftpServerInfo)
					{
						var _data = {};
						for(var item in ftpServerInfo)
						{
							var curItem = ftpServerInfo[item];
							if(typeof curItem != "undefined" && item != "url")
							{
								if(!$.isArray(curItem))
									_data[item] = [{text : curItem}];
							}
						}
						selectedPath = selectedPath.replace("/home", "");
						var isUNC = ftpServerInfo.path.indexOf("//") == 0;
						if(ftpServerInfo.url.lastIndexOf("/") == ftpServerInfo.url.length-1 && selectedPath.indexOf("/")==0)
						{
							selectedPath = selectedPath.substr(1, selectedPath.length);
						}
						var path = ftpServerInfo.url;
						if(isUNC)
							path = "FILE:///" + ftpServerInfo.path;
						ftpServerInfo[curElem.attr("rel")] = path;
						_data[curElem.attr("rel")] = [{text : path}];
						var controlData = $("#tasksList", _plugin).find("li.ui-widget-header").data("controlData");
						for(var item in controlData)
						{
							var curItem = controlData[item];
							if(typeof curItem != "undefined" && item != "url")
							{
								if(!$.isArray(curItem))
									controlData[item] = [{text : curItem}];
							}
						}
						controlData = $.extend(controlData, _data);
						var selected = $("#tasksList", _plugin).find("li.ui-widget-header").data("controlData", controlData);
						pluginCrushTask.bindPluginDetails(selected);
						setTimeout(function(){
							$("#" + curElem.attr("rel"), _plugin).trigger("textchange.form");
						}, 100);
					}
					else
						$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("textchange");
				}
			};
			if($(this).hasClass("ftpBrowse") && $(this).closest(".actionConfigPanel").length>0)
			{
				obj.isFTPBrowse = true;
				var pluginDetails = curElem.closest("div.actionConfigPanel");
        		function generateFormData(){
            		var openFormCrushTask = pluginDetails;
					var data = $("#tasksList", _plugin).find("li.ui-widget-header").data("controlData");
					pluginDetails.find("input, select, textarea").each(function(){
						if(data)
						{
							if($(this).attr("id") == "modified_comparison_newer" && $(this).is(":checked"))
							{
								data["modified_comparison"] = [{text:"new"}];
							}
							else if($(this).attr("id") == "modified_comparison_older" && $(this).is(":checked"))
							{
								data["modified_comparison"] = [{text:"old"}];
							}
							else if($(this).attr("id") == "cache_mode_read" && $(this).is(":checked"))
							{
								data["cache_mode"] = [{text:"read"}];
							}
							else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
							{
								data["cache_mode"] = [{text:"write"}];
							}
							else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
							{
								data["cache_mode"] = [{text:"write"}];
							}
							else if($(this).hasClass("maskPasswordOnURL"))
							{
								var elem = $(this);
								var curVal = elem.val();
								var attrID = elem.attr("id");
								var isFILE = curVal.toLowerCase().indexOf("file:/") == 0;
								if(curVal && curVal.indexOf(":")<0)
									isFILE = true;
								if(!isFILE)
								{
									var value = $(this).val();
					                var url = value;
					                try{
					                    url = URI(value);
					                }catch(ex){
					                    url = URI(encodeURI(value));
					                }
									if(url)
									{
										var pass = elem.data("password");
										if(pass)
										{
											url.password(pass);
											data[attrID] = unescape(url.toString());
										}
									}
								}
								else
								{
									var url = elem.val();
									if(url && url.indexOf(":")<0)
									{
										url = "FILE:/" + elem.val();
									}
									data[attrID] = unescape(url);
								}
							}
							else
							{
								var recName = $(this).attr("recName");
								if(data.type == "FileParser" && (recName == "column_name" || recName == "column_size" || recName == "column_index"))
								{
									pluginCrushTask.buildFileParserColumns(pluginDetails);
								}
								else
								{
									var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
									data[$(this).attr("id")] = isBool ? $(this).is(":checked").toString() : $(this).val();
								}
							}
						}
					});
					var _data = {};
					for(var item in data)
					{
						var curItem = data[item];
						if(curItem && curItem.length>0)
						{
							if(!$.isArray(curItem))
								_data[item] = curItem;
							else
								_data[item] = curItem[0].text;
						}
					}
					obj.existingData = _data;
					curElem.crushFtpLocalFileBrowserPopup(obj);
        		}
        		if(pluginDetails.find(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						generateFormData();
					};
					pluginDetails.find(".hasPendingCall").trigger("blur");
				}
				else
				{
					generateFormData();
				}
			}
			else
			{
				curElem.crushFtpLocalFileBrowserPopup(obj);
			}
			return false;
		});
	});

	$("a#testSettings", _panel).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		if(_panel.find(".hasPendingCall").length>0)
		{
			window.pendingEncryptionCall = function(){
				link.trigger("click");
			};
			_panel.find(".hasPendingCall").trigger("blur");
		}
		else
		{
			var obj = {
				command : "testDB",
				db_driver_file : encodeURIComponent($("#db_driver_file", _panel).val()) || "",
				db_driver : encodeURIComponent($("#db_driver", _panel).val()) || "",
				db_url : encodeURIComponent($("#db_url", _panel).val()) || "",
				db_user : encodeURIComponent($("#db_user", _panel).val()) || "",
				db_pass : encodeURIComponent($("#db_pass", _panel).val()) || ""
			};
			$("a#testDBSearch", _panel).block({
				message:  'Wait..',
				css: {
					border: 'none',
					padding: '0px 10px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			}).attr("disabled", "disabled");

			crushFTP.data.serverRequest(obj, function(msg){
				$("a#testDBSearch", _panel).unblock().removeAttr("disabled");
				crushFTP.UI.growl("Testing Database", DOMPurify.sanitize(decodeURIComponent($(msg).text())), false, false);
			});
		}
		return false;
	});

	var delimiter = $("#delimiter", _panel).change(function(){
		if($(this).val() == "fixed")
		{
			$("#fileparserActionConfig").find(".fixedTypeOptions").show();
			$("#fileparserActionConfig").find(".otherTypeOptions").hide().find("#header_names").val("").trigger("change");
			crushFTP.UI.checkUnchekInput($("#column_headers"), false);
			$("#column_headers").trigger("change").attr("disabled", "disabled").closest("p").addClass("ui-state-disabled");
		}
		else
		{
			$("#fileparserActionConfig").find(".fixedTypeOptions").hide();
			$("#fileparserActionConfig").find(".otherTypeOptions").show();
			$("#column_headers").trigger("change").removeAttr("disabled").closest("p").removeClass("ui-state-disabled");
		}
	});

	$("#column_headers", _panel).change(function(){
		if($(this).is(":checked"))
		{
			$(".multipleColumnOptions", _panel).find(".indexOfColumn").hide().end().find(".column_index").show().end().find(".moveItemUp, .moveItemDown").hide();
			pluginCrushTask.showIndexForFileParserColumns();
		}
		else
		{
			$(".multipleColumnOptions", _panel).find(".indexOfColumn").show().end().find(".column_index").hide().end().find(".moveItemUp, .moveItemDown").show();
			pluginCrushTask.showIndexForFileParserColumns();
		}
		setTimeout(function(){
			pluginCrushTask.buildFileParserColumns();
		},100);
	});

	$("#conditional_enabled", _panel).change(function(){
		if($(this).is(":checked"))
		{
			$(".conditionalItems", _panel).show().find("input:first").focus();
		}
		else
		{
			$(".conditionalItems", _panel).hide();
		}
	});

	_panel.find(".remoteURLWithVariable").each(function(){
		$(this).unbind("textchange.vaidation").bind("textchange.vaidation", function(){
			var text = $.trim($(this).val());
			if(text.lastIndexOf("/") == text.length-1)
			{
				$(this).addClass("ui-state-error").closest("div").find(".errorMsg").show();
			}
			else
			{
				$(this).removeClass("ui-state-error").closest("div").find(".errorMsg").hide();
			}
		});
	});

	var encryption_method = $("#encryption_method", _panel).change(function(){
		if($(this).val() == "encrypt")
		{
			$("#pgpActionConfig").find(".decryptPanel").hide();
		}
		else
		{
			$("#pgpActionConfig").find(".decryptPanel").show();
		}
	});

	pluginCrushTask.bindFileParserEvents();
	this.eventAdded = true;
}

pluginCrushTask.buildFileParserColumns = function()
{
	var delimiter = $("#delimiter", _panel);
	var columns =[];
	var isFixed = delimiter.val() == "fixed";
	var column_headers = $("#column_headers", _panel).is(":checked");

	$(".ui-state-error", $(".multipleColumnOptions", _panel)).removeClass("ui-state-error");
	$(".multipleColumnOptions:visible", _panel).each(function(_index){
		var column_name = $(".column_name", $(this)).val();
		var index = _index + 1;
		if(column_name && column_name.length>0)
		{
			if(isFixed)
			{
				var column_size = $.trim($(".column_size", $(this)).val());
				if(!crushFTP.methods.isNumeric(column_size) || column_size.length==0)
				{
					$(".column_size", $(this)).addClass("ui-state-error");
				}
				else
					columns.push(index+":"+column_name+":"+column_size);
			}
			else
			{
				if(column_headers)
				{
					index = $.trim($(this).find(".column_index").val());
					if(!crushFTP.methods.isNumeric(index) || index.length==0)
					{
						$(".column_index", $(this)).addClass("ui-state-error");
					}
					else
						columns.push(index+":"+column_name);
				}
				else
					columns.push(index+":"+column_name);
			}
		}
	});
	if(columns && columns.length>0)
		$("#column_override", _panel).val(columns.join(",")).trigger("change");
	else
		$("#column_override", _panel).val("").trigger("change");
	if(!column_headers && $("#column_override", _panel).val().length==0)
    {
        $("#fileParserColumnError", _panel).show();
    }
    else
        $("#fileParserColumnError", _panel).hide();
}

pluginCrushTask.bindFileParserEvents = function(data)
{
	var delimiter = $("#delimiter", _panel);
	if($("#column_headers", _panel).is(":checked"))
	{
		$(".multipleColumnOptions", _panel).find(".indexOfColumn").hide().end().find(".column_index").show();
	}
	else
	{
		$(".multipleColumnOptions", _panel).find(".indexOfColumn").show().end().find(".column_index").hide();
	}
	var columnsFileParser = $(".multipleColumnOptions", _panel).EnableMultiField({
        confirmOnRemove: false,
        linkText : "",
        linkClass : "addItemFileParser",
        removeLinkText : "",
        removeLinkClass : "removeItemFileParser",
        data: data,
        addEventCallback : function(newElem, clonnedFrom){
        	pluginCrushTask.bindFileParserInputEvents(newElem);
        	newElem.form();
        	delimiter.trigger("change");
        	pluginCrushTask.showIndexForFileParserColumns();
        	pluginCrushTask.buildFileParserColumns();
        },
        removeEventCallback : function(prev, self, uid){
        	delimiter.trigger("change");
        	pluginCrushTask.showIndexForFileParserColumns();
        	pluginCrushTask.buildFileParserColumns();
        }
    });

	pluginCrushTask.bindFileParserInputEvents(columnsFileParser);
    columnsFileParser.append('<a href="#" class="removeItemFileParser"></a>');
    columnsFileParser.find('.removeItemFileParser').unbind().click(function(){
    	columnsFileParser.hide();
    	pluginCrushTask.showIndexForFileParserColumns();
    	return false;
    })

    $(".moveItemUp, .moveItemDown").unbind().bind("click", function(){
    	var curTR = $(this).closest("tr");
    	if($(this).is(".moveItemUp"))
    	{
    		if(!curTR.prev().hasClass("ui-priority-primary"))
    		{
    			curTR.prev().before(curTR);
    			pluginCrushTask.buildFileParserColumns();
    		}
    	}
    	else
    	{
    		curTR.next().after(curTR);
    		pluginCrushTask.buildFileParserColumns();
    	}
		pluginCrushTask.showIndexForFileParserColumns();
		return false;
    });

    $(".addMoreColumn").unbind().bind("click", function(){
    	columnsFileParser.closest("table").find(".addItemFileParser:first").trigger("click");
    	return false;
    });

}

pluginCrushTask.bindFileParserInputEvents = function(elem)
{
	if(!elem)return;
	$(elem).find("input").unbind("textchange").bind("textchange", function(){
		pluginCrushTask.buildFileParserColumns();
	});
}

pluginCrushTask.showIndexForFileParserColumns = function()
{
	var visibleCols = $(".multipleColumnOptions:visible", _panel).each(function(index){
		var _index = index+1;
		$(this).find(".indexOfColumn").text(_index);
		if($(this).find(".column_index").val().length==0)
			$(this).find(".column_index").val(_index);
	});
	visibleCols.find(".moveItemUp.disabled, .moveItemDown.disabled").removeClass("disabled");
	$(".multipleColumnOptions:visible:first", _panel).find(".moveItemUp").addClass("disabled");
	$(".multipleColumnOptions:visible:last", _panel).find(".moveItemDown").addClass("disabled");
	if($(".multipleColumnOptions:visible", _panel).length==0)
		$(".multipleColumnOptions", _panel).show().find("input").val("");

	var column_headers = $("#column_headers", _panel).is(":checked");
	if(!column_headers && $("#column_override", _panel).val().length==0)
    {
        $("#fileParserColumnError", _panel).show();
    }
    else
        $("#fileParserColumnError", _panel).hide();
}

pluginCrushTask.bindTextChangeEvents = function()
{
	var pluginDetails = $("div#taskDetails");
	pluginDetails.find("input, select, textarea").bind("change", function(){
		var item = tasksList.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			if($(this).attr("id") == "modified_comparison_newer" && $(this).is(":checked"))
			{
				data["modified_comparison"] = [{text:"new"}];
			}
			else if($(this).attr("id") == "modified_comparison_older" && $(this).is(":checked"))
			{
				data["modified_comparison"] = [{text:"old"}];
			}
			else if($(this).attr("id") == "cache_mode_read" && $(this).is(":checked"))
			{
				data["cache_mode"] = [{text:"read"}];
			}
			else if($(this).attr("id") == "cache_mode_write" && $(this).is(":checked"))
			{
				data["cache_mode"] = [{text:"write"}];
			}
			else
			{
				var recName = $(this).attr("recName");
				if(item.attr("pluginType") == "fileparser" && (recName == "column_name" || recName == "column_size" || recName == "column_index"))
				{
					pluginCrushTask.buildFileParserColumns();
				}
				else
				{
					var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
					data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
					if($(this).attr("id") == "type")
					{
						item.text($(this).val());
					}
				}
			}
		}
		item.data("controlData", data);
		panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
	});

	pluginDetails.parent().find("#enabled, #debug,#log_enabled, #save_state,#save_history").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
	});

	pluginDetails.find("input.maskPasswordOnURL").unbind("rebuild").bind("rebuild", function(){
		var item = tasksList.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var elem = $(this);
			var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
			if(url && elem.val().substr(8, 1) != ":")
			{
				var pass = url.password();
				var mask = false;
				var existingPass = elem.data("password");
				if(pass != existingPass)
				{
					if(existingPass)
					{
						mask = new Array(existingPass.length+1).join('*');
					}
					if(existingPass && pass == mask)
						pass = existingPass;
					else
						mask = new Array(pass.length+1).join('*');
					if(pass)
					{
						elem.data("password", pass);
						url.password(mask);
					}
					else
					{
						elem.removeData("password");
					}
				}
				else
					pass = existingPass;
				url.password(pass);
				data[$(this).attr("id")] = [{text: unescape(url.toString())}];
			}
		}
		item.data("controlData", data);
	});

	pluginDetails.find("input[type='text'], textarea").unbind("textchange.form").bind("textchange.form", function(){
		var item = tasksList.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var recName = $(this).attr("recName");
			if(item.attr("pluginType") == "fileparser" && (recName == "column_name" || recName == "column_size" || recName == "column_index"))
			{
				pluginCrushTask.buildFileParserColumns();
			}
			else
			{
				if($(this).hasClass("maskPasswordOnURL"))
				{
					var elem = $(this);
					var value = $(this).val();
	                var url = value;
	                try{
	                    url = URI(value);
	                }catch(ex){
	                    url = URI(encodeURI(value));
	                }
					if(url && elem.val().substr(8, 1) != ":")
					{
						var pass = url.password();
						var mask = false;
						var existingPass = elem.data("password");
						if(pass != existingPass)
						{
							if(existingPass)
							{
								mask = new Array(existingPass.length+1).join('*');
							}
							if(existingPass && pass == mask)
								pass = existingPass;
							else
								mask = new Array(pass.length+1).join('*');
							if(pass)
							{
								elem.data("password", pass);
								url.password(mask);
							}
							else
							{
								elem.removeData("password");
							}
						}
						else
							pass = existingPass;
						url.password(pass);
						data[$(this).attr("id")] = [{text: unescape(url.toString())}];
					}
					else
					{
						data[$(this).attr("id")] = [{text: $(this).val()}];
					}
				}
				else
				{
					if(item.attr("pluginType") == "http" && $(this).attr("id") == "maxFilesSeconds")
					{
						$(this).val($.trim($(this).val()));
						if($(this).val() != "" && !crushFTP.methods.isNumeric($(this).val()))
							$(this).val("1");
					}
					var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
					data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
					if($(this).attr("id") == "type")
					{
						item.text($(this).val());
					}
				}
			}
		}
		item.data("controlData", data);
		panelPlugins.itemsChanged(true, pluginCrushTask.returnXML, pluginName, pluginID);
	});
}

pluginCrushTask.bindPluginDetails = function(task)
{
	$("div.pluginDetails, div.actionConfigPanel").hide();
	if(!task)
	{
		return;
	}
	task = $(task);
	if(!task.attr || !task.attr("pluginType"))
		return;
	var controlData = $(task).data("controlData");
	var curPluginPanel = $("div#" + task.attr("pluginType") + "ActionConfig").show();
	$("div.pluginDetails").show();
	var pluginDetails = $("div#taskDetails");
	var inputs = pluginDetails.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	window.loadingTaskData = true;
	bindValuesFromXML(pluginDetails, controlData);
	if(task.attr("pluginType") == "zip")
	{
		if(controlData.internal_zip[0].text == "true")
		{
			crushFTP.UI.checkUnchekInput(curPluginPanel.find("#internal_zip"), true);
		}
		else if(controlData.external_zip[0].text == "true")
		{
			crushFTP.UI.checkUnchekInput(curPluginPanel.find("#external_zip"), true);
		}
	}
	else if(task.attr("pluginType") == "unzip")
	{
		if(controlData.internal_zip[0].text == "true")
		{
			crushFTP.UI.checkUnchekInput(curPluginPanel.find("#internal_unzip"), true);
		}
		else if(controlData.external_zip[0].text == "true")
		{
			crushFTP.UI.checkUnchekInput(curPluginPanel.find("#external_unzip"), true);
		}
	}
	else if(task.attr("pluginType") == "find")
	{
		if(controlData && controlData.modified_comparison)
		{
			if(controlData.modified_comparison[0].text == "new")
			{
				crushFTP.UI.checkUnchekInput(curPluginPanel.find("#modified_comparison_newer"), true);
			}
			else
			{
				crushFTP.UI.checkUnchekInput(curPluginPanel.find("#modified_comparison_older"), true);
			}
		}
	}
	else if(task.attr("pluginType") == "findcache")
	{
		if(controlData && controlData.cache_mode)
		{
			if(controlData.cache_mode[0].text == "write")
			{
				crushFTP.UI.checkUnchekInput(curPluginPanel.find("#cache_mode_write"), true);
			}
			else
			{
				crushFTP.UI.checkUnchekInput(curPluginPanel.find("#cache_mode_read"), true);
			}
		}
	}
	else if(task.attr("pluginType") == "wait")
	{
		$("#conditional_enabled", _panel).trigger("change");
	}
	else if(task.attr("pluginType") == "pgp")
	{
		$("#encryption_method", _panel).trigger("change");
	}
	else if(task.attr("pluginType") == "fileparser")
	{
		if(controlData)
		{
			var delimiter = $("#delimiter", curPluginPanel).trigger("change");
			var column_override = $("#column_override", curPluginPanel).val();
			var columnData = column_override.split(",");
			var existingData = [];
			if(columnData && columnData.length>0)
			{
				for(var i=0;i<columnData.length;i++)
				{
					var curColDetails = columnData[i].split(":");
					if(curColDetails && curColDetails.length>0)
					{
						var colInd, colSize, colName;
						if(curColDetails.length==3)
						{
							colInd = curColDetails[0];
							colName = curColDetails[1];
							colSize = curColDetails[2];
							existingData.push({
								column_name : colName,
								column_size : colSize,
								column_index : colInd
							});
						}
						else if(curColDetails.length==2)
						{
							colInd = curColDetails[0];
							colName = curColDetails[1];
							existingData.push({
								column_name : colName,
								column_index : colInd
							});
						}
					}
				}
			}
			$(".removeItemFileParser").trigger("click");
			pluginCrushTask.bindFileParserEvents(existingData);
			if(existingData && existingData.length>0)
			{
				$(".fileParserColumns").find(".removeItemFileParser:last").trigger("click");
			}
		}
	}
	else if(task.attr("pluginType") == "http")
	{
		if(!controlData.maxFilesSeconds || controlData.maxFilesSeconds[0].text == "")
		{
			$("#maxFilesSeconds", curPluginPanel).val("1").trigger("change");
		}
	}
	pluginDetails.find(".SSHOptionsHandle").trigger("textchange");
	pluginDetails.find(".encryptionMode").trigger("change");
	inputs.addClass("ignoreBind");
	setTimeout(function(){
		pluginDetails.find(".SSHOptionsHandle").trigger("textchange");
		pluginDetails.find(".maskPasswordOnURL").removeData("password").trigger("blur");
		window.loadingTaskData = false;
	}, 100);
}

pluginCrushTask.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	if(isNaN(saveByIndex))
		saveByIndex = 0;
	$("#fileParserColumnError", _panel).hide();
	removeByIndex = removeByIndex || 0;
	var noEncode = false;//pluginCrushTask.returnXML && typeof window.panelEvents != "undefined";
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginCrushTask.returnXML)
	{
		if(!pluginCrushTask.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		var hasError = false;
        var taskErrorIndex = -1;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<debug>"+$("#debug", _plugin).is(":checked")+"</debug>");
			xmlString.push("<enabled>"+$("#enabled", _plugin).is(":checked")+"</enabled>");
			xmlString.push("<replicate>"+$("#replicate", container).is(":checked")+"</replicate>");
			xmlString.push("<save_state>"+$("#save_state", _plugin).is(":checked")+"</save_state>");
			xmlString.push("<log_enabled>"+$("#log_enabled", _plugin).is(":checked")+"</log_enabled>");
			xmlString.push("<save_history>"+$("#save_history", _plugin).is(":checked")+"</save_history>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			try{
				if(pluginCrushTask.taskDesigner)
					xmlString.push(pluginCrushTask.taskDesigner.generateXML(true));
			}
			catch(ex){}
			if(typeof saveByIndex != "undefined")
			{
				if(typeof cloneName == "undefined" || cloneName == "undefined" || cloneName == "false" || cloneName == pluginName)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"), false, noEncode);
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
					xmlString.push("<subItem>"+crushFTP.methods.htmlEncode(cloneName)+"</subItem>");
			}
			else
			{
				if(container.attr("subPluginName") && this.subItem>0)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"), false, noEncode);
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
				{
					xmlString.push("<subItem></subItem>");
				}
			}
		}
		var formSubItem = xmlString.join("\n");
		if(formSubItem.indexOf('<tasks type="vector"><tasks_subitem type="properties">')<0)
		{
			if(formSubItem.indexOf('<plugins_subitem type="properties">')<0)
			{
				xmlString.push('<plugins_subitem type="properties">');
			}
			xmlString.push('<tasks type="vector"><tasks_subitem type="properties"></tasks_subitem></tasks>');
		}
		xmlString.push("</plugins_subitem>");
		formSubItem = xmlString.join("\n");
		if(hasError)
        {
        	if(pluginCrushTask.returnXML)
        		return formSubItem;
        	else
        	{
	            $("#tasksList", _panel).find(".ui-widget-header, .ui-selected").removeClass("ui-widget-header").removeClass("ui-selected");
	            var selected = $("#tasksList", _panel).find("li").eq(taskErrorIndex).addClass("ui-widget-header ui-selected");
	            pluginCrushTask.bindPluginDetails(selected);
	            crushFTP.UI.hideIndicator();
	            $("#fileParserColumnError", _panel).show();
	            return false;
	        }
        }

		if(pluginCrushTask.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}