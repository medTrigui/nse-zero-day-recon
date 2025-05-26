/*!
 * CrushFTP Web GUI interface methods for Manage Shares
 *
 * http://crushFTP.com/
 *
 * Copyright @ CrushFTP
 *
 * Date: Mon, Jan 28 2013
 *
 * Author: Vipul Limbachiya
 *
 * http://vipullimbachiya.com
 */
$(document).ready(function() {
    crushFTP.UI.initLoadingIndicator();
    crushFTP.userLogin.bindUserName(function(response, username) {
        crushFTP.UI.showLoadingIndicator({});
        $("#tempAccounts").form();
        css_browser_selector(navigator.userAgent);
        $(".button").button();
        if (response == "failure") {
            window.location = "/WebInterface/login.html?link=/WebInterface/ManageShares/index.html";
        } else {
            var curLang = crushFTP.methods.queryString("lang") || $.cookie("_i18n");
            if (curLang) {
                $.getScript("/WebInterface/localizations/" + curLang + ".js", function() {
                    manageShares.init();
                });
            } else
                manageShares.init();
        }
    });
});
var _toclm = localizations.ManageShareWindowGridToLabelText || "To";
var _pathClm = localizations.ManageShareWindowGridPathsLabelText || "Paths";
var _CreatedClm = localizations.ManageShareWindowGridCreatedLabelText || "Created";
var _ExpiresClm = localizations.ManageShareWindowGridExpiresLabelText || "Expires";
var _ItemsClm = localizations.ManageShareWindowGridSharedItemsLabelText || "Items";
var _DownloadsClm = localizations.ManageShareWindowGridDownloadsLabelText || "Downloads";
var _RemainingUsesClm = localizations.ManageShareWindowGridRemainingUsesLabelText || "Remaining Uses";
var _CommentsClm = localizations.ManageShareWindowGridCommentsLabelText || "Comments";
var _editShareTitle = localizations.ManageShareWindowEditDialogTitle || "Edit Share";
var _showDetailsTitle = localizations.ManageShareWindowShareDetailsDialogTitle || "Share details";

var manageSharesManageDatatable;
var manageShares = {
    ajaxCallURL: "/WebInterface/function/",
    ajaxCallURLBase: "/WebInterface/function/",
    columnNames: {

    },
    resetTable: function(){
        $("#manageShareslist_info, #manageShareslist_paginate, #manageShareslist_filter, #manageShareslist_length").remove();
        $("#manageShareslist").replaceWith($('<table id="manageShareslist" class="display" cellspacing="0" width="100%"><thead><tr><th style="width: 2%;background-image: none !important;"><input name="select_all" value="1" type="checkbox"></th><th _column="created" _loc="ManageShareWindowGridCreatedLabelText">Created</th><th _column="expire" _loc="ManageShareWindowGridExpiresLabelText">Expires</th><th _column="emailTo" _loc="ManageShareWindowGridToLabelText">To</th><th _column="paths" _loc="ManageShareWindowGridPathsLabelText">Shared Items</th><th _column="Remaining Uses" _loc="ManageShareWindowGridRemainingUsesLabelText">Remaining Uses</th><th _column="downloads" _loc="ManageShareWindowGridDownloadsLabelText">Downloads</th><th _column="comments" _loc="ManageShareWindowGridCommentsLabelText">Comments</th></tr></thead></table>'));
    },
    init: function() {
        var detailsPopupWidth = window.manageShareDetailspopupWidth || "70%";
        manageShares.editPopup = $("#edit-dialog").dialog({
            title: _editShareTitle,
            width: 500,
            buttons: {
                "OK": function() {
                    if (manageShares.afterEdit) {
                        manageShares.afterEdit();
                        delete manageShares.afterEdit;
                    }
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            },
            appendTo: "body",
            modal: true,
            autoOpen: false,
            resizable: false
        });
        var _nowDate = new Date();
        _nowDate.setDate(_nowDate.getDate() + 1);
        var dtFormat = "mm/dd/yy hh:nn a/p";
        if ((window.localizations && window.localizations.ManageShareDateFormatDDMMYYYY) || window.Shareddmmyyyy) {
            dtFormat = "dd/mm/yy hh:nn a/p";
        }
        if(window.manageSharesDateFormat)
            dtFormat = window.manageSharesDateFormat;
        manageShares.editPopup.find("#expiresDate").datepicker({ //For date fields which accepts future dates
            dateFormat: dtFormat,
            showOn: 'both',
            buttonImage: '/WebInterface/Resources/images/calendar.png',
            buttonImageOnly: true,
            minDate: _nowDate
        }).attr("readonly", "readonly");

        manageShares.externalShareItemDetails = $("#externalShareItemDetails").dialog({
            title: _showDetailsTitle + " : ",
            width: detailsPopupWidth,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            },
            appendTo: "body",
            modal: true,
            autoOpen: false,
            resizable: false,
            open: function() {
                manageShares.externalShareItemDetails.dialog({
                    closeOnEscape: true
                }).dialog("moveToTop");
                var emailpnlHeight = $(this).find("#emailInfoPanel").height();
                if (emailpnlHeight > 400)
                    $("#pathList").find("ul").css("max-height", emailpnlHeight - 200 + "px");
                else
                    $("#pathList").find("ul").css("max-height", "250px");
                showNextPrevOnPopup();
            }
        });

        var selectSimilarTitle = "Select Matching Accounts : ";
        var comfirmOk = "OK";
        var confirmCancel = "Cancel";
        if (window.localizations) {
            if (localizations.ManageShareWindowSelectSimilarTitleText)
                selectSimilarTitle = localizations.ManageShareWindowSelectSimilarTitleText;
            if (localizations.ManageShareWindowRemoveConfirmOkText)
                comfirmOk = localizations.ManageShareWindowRemoveConfirmOkText;
            if (localizations.ManageShareWindowRemoveConfirmCancelText)
                confirmCancel = localizations.ManageShareWindowRemoveConfirmCancelText;
            if (localizations.ManageShareWindowPageTitle)
                document.title = localizations.ManageShareWindowPageTitle;
            else
                document.title = "CrushFTP - Manage Shares";
        } else {
            document.title = "CrushFTP - Manage Shares";
        }
        manageShares.selectSimilarPopup = $("#selectSimilar").dialog({
            title: selectSimilarTitle,
            width: "400px",
            buttons: [{
                text: comfirmOk,
                click: function() {
                    var column = manageShares.selectSimilarPopup.find("#columnToSelect").attr("_column");
                    var text = manageShares.selectSimilarPopup.find("#matchColumnData").val();
                    if (column == "emailTo")
                        text = text.split("\n").join(",");
                    else if (column == "paths")
                        text = text.split("\n").join(",");
                    manageShares.findSimilar(column, text.toLowerCase(), manageShares.selectSimilarPopup.find("#exactMatch").is(":checked"));
                }
            }, {
                text: confirmCancel,
                click: function() {
                    $(this).dialog("close");
                }
            }],
            modal: true,
            autoOpen: false,
            resizable: false,
            open: function() {

            },
            close: function() {
                setTimeout(function() {
                    if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                        manageShares.internalShareItemDetails.dialog({
                            closeOnEscape: true
                        });
                    } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                        manageShares.externalShareItemDetails.dialog({
                            closeOnEscape: true
                        });
                    }
                }, 300);
            }
        });

        manageShares.externalShareItemDetails.find("div.shareItem").hover(function() {
            $(this).addClass("highlight");
        }, function() {
            $(this).removeClass("highlight");
        });

        manageShares.externalShareItemDetails.find("a.nextShare, a.prevShare").on('click', function() {
            if ($(this).hasClass("disabled"))
                return false;
            if ($(this).is(".nextShare")) {
                if (manageShares.curShownItem.next().is(":visible"))
                    manageShares.showDetails(manageShares.curShownItem.next());
                else
                    manageShares.showDetails(manageShares.curShownItem.nextAll(":visible:first"));
            } else {
                if (manageShares.curShownItem.prev().is(":visible"))
                    manageShares.showDetails(manageShares.curShownItem.prev());
                else
                    manageShares.showDetails(manageShares.curShownItem.prevAll(":visible:first"));
            }
            return false;
        });

        manageShares.externalShareItemDetails.find(".findSimilar").remove();
        manageShares.externalShareItemDetails.find(".shareItem").each(function() {
            $(this).prepend('<a tabindex="-1" class="findSimilar" title="Find Similar" href="#"></a>');
        });

        manageShares.externalShareItemDetails.on('click', '.findSimilar', function() {
            manageShares.selectSimilarFromTable($(this));
            return false;
        });

        function showNextPrevOnPopup(isInternal) {
            var parentElem;
            if (isInternal)
                parentElem = manageShares.internalShareItemDetails;
            else
                parentElem = manageShares.externalShareItemDetails;

            var curElem = manageShares.curShownItem;
            if (curElem && curElem.length > 0) {
                if (curElem.prevAll(":visible:first").length > 0)
                    parentElem.find("a.prevShare").removeClass("disabled");
                else
                    parentElem.find("a.prevShare").addClass("disabled");

                if (curElem.nextAll(":visible:first").length > 0)
                    parentElem.find("a.nextShare").removeClass("disabled");
                else
                    parentElem.find("a.nextShare").addClass("disabled");
            }
        }
        var _title = "Share details : ";
        if (localizations.ManageShareShareDetailsDialogTitle)
            _title = localizations.ManageShareShareDetailsDialogTitle;
        else
            _title = _showDetailsTitle + " : ";
        manageShares.internalShareItemDetails = $("#internalShareItemDetails").dialog({
            title: _title,
            width: "40%",
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            },
            appendTo: "body",
            modal: true,
            autoOpen: false,
            resizable: false,
            open: function() {
                showNextPrevOnPopup(true);
                manageShares.internalShareItemDetails.dialog({
                    closeOnEscape: true
                }).dialog("moveToTop");
            }
        });

        manageShares.internalShareItemDetails.find("div.shareItem").hover(function() {
            $(this).addClass("highlight");
        }, function() {
            $(this).removeClass("highlight");
        });

        manageShares.internalShareItemDetails.find("a.nextShare, a.prevShare").on('click', function() {
            if ($(this).hasClass("disabled"))
                return false;
            if ($(this).is(".nextShare")) {
                manageShares.showDetails(manageShares.curShownItem.next());
            } else
                manageShares.showDetails(manageShares.curShownItem.prev());
            return false;
        });

        manageShares.internalShareItemDetails.find(".findSimilar").remove();
        manageShares.internalShareItemDetails.find(".shareItem").each(function() {
            $(this).prepend('<a tabindex="-1" class="findSimilar" title="Find Similar" href="#"></a>');
        });

        manageShares.internalShareItemDetails.on('click', '.findSimilar', function(e) {
            manageShares.selectSimilarFromTable($(this));
            return false;
        });

        manageShares.applyCustomizations(function() {
            $("#GUIAdmin").fadeIn("fast");
            manageShares.fetchShareRecords();
        });

        $(document).bind('keydown', 'left', function(evt) {
            if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                manageShares.internalShareItemDetails.find("a.prevShare:first").trigger("click");
            } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                manageShares.externalShareItemDetails.find("a.prevShare:first").trigger("click");
            }
        });

        $(document).bind('keydown', 'right', function(evt) {
            if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                manageShares.internalShareItemDetails.find("a.nextShare:first").trigger("click");
            } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                manageShares.externalShareItemDetails.find("a.nextShare:first").trigger("click");
            }
        });

        //Delayed call of repeatative method, it will ignore all events untill specified event has completed
        var delay = (function() {
            var timer = 0;
            return function(callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        var filterAvailableShares = $("#filterShares").unbind("keyup").keyup(function(evt) {
            var evt = (evt) ? evt : ((event) ? event : null);
            var keyCode = evt.keyCode || evt.which;
            if (keyCode == 27)
                $(this).val("");
            var phrase = $.trim(this.value);
            if (manageShares.last_searched && manageShares.last_searched === phrase) {
                return false;
            }
            delay(function() {
                manageShares.last_searched = phrase;
                manageShares.filterShares(phrase);
            }, 500);
        });

        $("#clearFilter").click(function() {
            filterAvailableShares.val("").trigger("keyup");
            return false;
        });

        $("#refreshBtn").click(function() {
            var pageSize = $("select[name='manageShareslist_length']").val();
            var pagenumber = $(".paginate_button.current").html();
            var sortedCol = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][0];
            var sortedType = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][1];
            var searchText = $("input[type='search'][aria-controls='manageShareslist']").val();
            searchText = "";
            $("#manageShareslist").hide();
            // manageShares.ManageDatatable.destroy();
            manageShares.resetTable();
            manageShares.fetchShareRecords(pageSize, pagenumber);
        });

        var deleteSelectedShares = $("#deleteSelectedShares").on('click', function(evt, data) {
            var deleteIds = "";
            var totalItems = 0;
            if (!data) {
                $("#manageShareslist").find("tbody").find("input[type=checkbox]:checked:visible").each(function() {
                    var dataItem = $(manageShares.shareData[$(this).val().split("-")[0]]);
                    if (dataItem && dataItem.length > 0) {
                        if (dataItem.find("usernameShare").text() == "true") deleteIds += dataItem.find("username").text() + ":" + dataItem.find("paths").text() + ";";
                        else deleteIds += dataItem.find("username").text() + ";";
                        totalItems += 1;
                    }
                });
            } else {
                totalItems = 1;
                deleteIds = data;
            }
            if (totalItems > 0) {

                var confirmMsg = "Are you sure you wish to delete selected " + totalItems + " share account(s)?";
                if (data)
                    confirmMsg = "Are you sure you wish to delete this share account?";
                var confirmTitle = "Confirm";
                var comfirmOk = "OK";
                var confirmCancel = "Cancel";
                if (window.localizations) {
                    confirmMsg = localizations.ManageShareWindowDeleteAccountConfirmationText.replace("{count}", totalItems);
                    if (localizations.ManageShareWindowRemoveConfirmTitleText)
                        confirmTitle = localizations.ManageShareWindowRemoveConfirmTitleText;
                    if (localizations.ManageShareWindowRemoveConfirmOkText)
                        comfirmOk = localizations.ManageShareWindowRemoveConfirmOkText;
                    if (localizations.ManageShareWindowRemoveConfirmCancelText)
                        confirmCancel = localizations.ManageShareWindowRemoveConfirmCancelText;
                }
                jConfirm(confirmMsg, confirmTitle, function(flag) {
                    if (flag) {
                        var obj = {
                            command: "deleteTempAccount",
                            tempUsername: crushFTP.methods.htmlEncode(deleteIds),
                            random: Math.random()
                        };
                        obj.c2f = crushFTP.getCrushAuth();
                        $.ajax({
                            type: "POST",
                            url: "/WebInterface/function/",
                            data: obj,
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                errorThrown = errorThrown || "deleteTempAccount failed";
                                //manageShareAlert("(Error : " + errorThrown + ")", "red");
                            },
                            success: function(msg) {
                                var items = $.xml2json(msg, true);
                                if (items.tempUsername && items.tempUsername.length > 0) {
                                    var curItem = items.tempUsername[0];
                                    var curItemsStr = "";
                                    for (var x = 0; x < curItem.text.split(";").length; x++) {
                                        curItemsStr += curItem.text.split(";")[x] + " ";
                                    }
                                }
                                if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                                    manageShares.internalShareItemDetails.dialog("close");
                                } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                                    manageShares.externalShareItemDetails.dialog("close");
                                }
                                if (data) {
                                    crushFTP.UI.growl("Message : ", "Total " + totalItems + " account(s) deleted!", false, 3000);
                                }

                                var pageSize = $("select[name='manageShareslist_length']").val();
                                var pagenumber = $(".paginate_button.current").html();
                                var sortedCol = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][0];
                                var sortedType = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][1];
                                var searchText = $("input[type='search'][aria-controls='manageShareslist']").val();

                                $("#manageShareslist").hide();
                                // manageShares.ManageDatatable.destroy();
                                manageShares.resetTable();
                                manageShares.fetchShareRecords(pageSize, pagenumber, sortedCol, sortedType, searchText);
                            }
                        });
                    }
                }, {
                    okButtonText: comfirmOk,
                    cancelButtonText: confirmCancel
                });
            }
            return false;
        });

        $(".deleteShareItem").on('click', function() {
            var name = manageShares.curShownItem.find("input[type=checkbox]").val();
            deleteSelectedShares.trigger("click", name.substr(name.indexOf("-")+1));
            return false;
        });

        $(".editShareItem").on('click', function() {
            var dataElem = manageShares.curShownItemData;
            var dtFormat = "mm/dd/yyyy hh:nn a/p";
            if ((window.localizations && window.localizations.ManageShareDateFormatDDMMYYYY) || window.Shareddmmyyyy) {
                dtFormat = "dd/mm/yyyy hh:nn a/p";
            }
            if(window.manageSharesDateFormat)
                dtFormat = window.manageSharesDateFormat;
            var dt = new Date(parseInt(manageShares.getColumnText(dataElem, "expire" + "Millis")));
            if (!crushFTP.methods.isValidDate(dt)) {
                dt = manageShares.getColumnText(dataElem, "expire");
                if (dt.indexOf("/") >= 0) {
                    var splitDate = dt.split(' ')[0].split("/");
                    if (splitDate.length == 3)
                        dt = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                }
            } else {
                dt = dt.format(dtFormat);
            }
            manageShares.editPopup.find("#expiresDate").val(dt);
            manageShares.editPopup.find("#login_allowance").val(manageShares.getColumnText(dataElem, "login_allowance"));
            manageShares.editPopup.dialog("open").dialog("moveToTop");

            manageShares.afterEdit = function() {
                var name = manageShares.curShownItem.closest("tr").find("input[type=checkbox]").val();
                var updateIds = name.substr(name.indexOf("-")+1);
                var expDt = manageShares.editPopup.find("#expiresDate").datepicker("getDate").format("mm/dd/yyyy hh:nn a/p");
                var allowance = manageShares.editPopup.find("#login_allowance").val();
                var obj = {
                    command: "editTempAccount",
                    tempUsername: crushFTP.methods.htmlEncode(updateIds),
                    expire: crushFTP.methods.htmlEncode(expDt),
                    logins: crushFTP.methods.htmlEncode(allowance),
                    random: Math.random()
                };
                obj.c2f = crushFTP.getCrushAuth();
                $.ajax({
                    type: "POST",
                    url: "/WebInterface/function/",
                    data: obj,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        errorThrown = errorThrown || "editTempAccount failed";
                        alert(errorThrown);
                    },
                    success: function(msg) {
                        manageShares.editPopup.dialog("close");
                        if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                            manageShares.internalShareItemDetails.dialog("close");
                        } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                            manageShares.externalShareItemDetails.dialog("close");
                        }
                        var pageSize = $("select[name='manageShareslist_length']").val();
                        var pagenumber = $(".paginate_button.current").html();
                        var sortedCol = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][0];
                        var sortedType = $('#manageShareslist').dataTable().fnSettings().aaSorting[0][1];
                        var searchText = $("input[type='search'][aria-controls='manageShareslist']").val();

                        $("#manageShareslist").hide();
                        // manageShares.ManageDatatable.destroy();
                        manageShares.resetTable();
                        manageShares.fetchShareRecords(pageSize, pagenumber, sortedCol, sortedType, searchText);

                    }
                });
            };
            return false;
        });
        manageShares.applyLocalizations();
    },
    applyLocalizations: function() {
        if (window.localizations) {
            if (typeof window.persistentLocalizationStrings != "undefined") {
                window.localizations = $.extend(window.localizations, window.persistentLocalizationStrings);
            }
            $("[_loc]").each(function() {
                if (window.localizations[$(this).attr("_loc")]) {
                    $(this).text(window.localizations[$(this).attr("_loc")]);
                }
            });
        }
        $(".shareItem").find("[rel]").each(function() {
            manageShares.columnNames[$(this).attr("rel")] = $(this).closest(".shareItem").find("label").text();
        });
        var title;
        if (window.localizations) {
            title = localizations.ManageShareWindowShareDetailsLabelText;
            if (title)
                manageShares.externalShareItemDetails.dialog({
                    title: title
                });
        }
    },
    selectSimilarFromTable: function(el) {
        var _index1 = manageShares.curShownItem.find("input[type=checkbox]").val().split("-"); // elem.attr("_index");
        var _index = _index1[0];
        var dataItem = $(manageShares.shareData[_index]);
        manageShares.selectSimilarPopup.find("#matchColumnData").val("");
        if (dataItem && dataItem.length > 0) {
            var column = el.parent().find("[rel]").attr("rel");
            var columnName = column;
            if (manageShares.columnNames[column])
                columnName = manageShares.columnNames[column];
            var text = dataItem.find(column).text();
            if (column == "emailTo")
                text = text.split(",").join("\n");
            else if (column == "paths")
                text = text.split("\r\n").join("\n");
            manageShares.selectSimilarPopup.find("#columnToSelect").text(columnName).attr("_column", column);
            manageShares.selectSimilarPopup.find("#matchColumnData").val(text);
            manageShares.selectSimilarPopup.dialog("open");

            if (manageShares.internalShareItemDetails.dialog("isOpen")) {
                manageShares.internalShareItemDetails.dialog({
                    closeOnEscape: false
                });
            } else if (manageShares.externalShareItemDetails.dialog("isOpen")) {
                manageShares.externalShareItemDetails.dialog({
                    closeOnEscape: false
                });
            }
        }
    },
    findSimilar: function(column, text, exact) {
        var sharesTable = $("#manageShareslist");
        var matchingElems = [];
        var data = manageShares.shareData;
        for (var i = 0; i < data.length; i++) {
            if (column == "paths") {
                if (exact) {
                    if ($(data[i]).find(column).text().toLowerCase().split("\r\n").join(",") == text)
                        matchingElems.push(i + "-" + $(data[i]).find("username").text());
                } else {
                    if ($(data[i]).find(column).text().toLowerCase().split("\r\n").join(",").indexOf(text) >= 0)
                        matchingElems.push(i + "-" + $(data[i]).find("username").text());
                }
            } else {
                if (exact) {
                    if ($(data[i]).find(column).text().toLowerCase() == text)
                        matchingElems.push(i + "-" + $(data[i]).find("username").text());
                } else {
                    if ($(data[i]).find(column).text().toLowerCase().indexOf(text) >= 0)
                        matchingElems.push(i + "-" + $(data[i]).find("username").text());
                }
            }
        }
        sharesTable.find("tbody").find("tr").show().find("input.chkBox").removeAttr("checked").trigger("change");
        $("#filterMatch").text("");
        if (matchingElems.length > 0) {
            sharesTable.find("tbody").find("tr").show().find("input[type=checkbox]").prop('checked', false);
            for (var i = 0; i < matchingElems.length; i++) {
                sharesTable.find("tr").find("input[type=checkbox][value='" + matchingElems[i] + ";']").attr("checked", "checked").trigger("change");
            }
            crushFTP.UI.growl("Message : ", "Total " + sharesTable.find("tbody").find("tr").show().find('input:checked').length + " matching accounts found and selected", false, 3000); //matchingElems.length

            manageShares.selectSimilarPopup.dialog("close");
            manageShares.internalShareItemDetails.dialog("close");
            manageShares.externalShareItemDetails.dialog("close");
        } else {
            crushFTP.UI.growl("Message : ", "No matching accounts found", true, 3000);
        }
    },
    showDetails: function(elem) {
        var _index1 = elem.find("input[type=checkbox]").val().split("-"); // elem.attr("_index");
        var _index = _index1[0];
        if (manageShares.shareData && manageShares.shareData.length > _index) {
            var dataElem = $(manageShares.shareData[_index]);
            var dtFormat = "mm" + window.dateSeparator + "dd" + window.dateSeparator + "yyyy hh:nn a/p";
            if ((window.localizations && window.localizations.ManageShareDateFormatDDMMYYYY) || window.Shareddmmyyyy) {
                dtFormat = "dd" + window.dateSeparator + "mm" + window.dateSeparator + "yyyy hh:nn a/p";
            }
            if(window.manageSharesDateFormat)
                dtFormat = window.manageSharesDateFormat;
            var isInternalShare = manageShares.getColumnText(dataElem, "usernameShare") == "true";
            if (isInternalShare) {
                manageShares.internalShareItemDetails.find("[rel]").each(function() {
                    var key = $(this).attr("rel");
                    if (key == "paths") {
                        var paths = manageShares.getColumnText(dataElem, key).split("\r\n");
                        var items = [];
                        for (var i = 0; i < paths.length; i++) {
                            var curFile = $.trim(paths[i]);
                            if (curFile.length > 0)
                                items.push("<li>" + unescape(curFile) + "</li>");
                        }
                        if (items.length > 0) {
                            $(this).empty().append("<ul class='pathlist'>" + items.join("") + "</ul>");
                        } else
                            $(this).empty().append("-");
                    } else if (key == "created" || key == "expire") {
                        var dt = new Date((manageShares.getColumnText(dataElem, key + "")));
                        if (!crushFTP.methods.isValidDate(dt)) {
                            dt = manageShares.getColumnText(dataElem, key);
                            if (dt.indexOf("/") >= 0) {
                                var splitDate = dt.split(' ')[0].split("/");
                                if (splitDate.length == 3)
                                    dt = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                            }
                        } else {
                            dt = dt.format(dtFormat);
                        }
                        $(this).empty().html(dt);
                    } else
                        $(this).empty().html(manageShares.getColumnText(dataElem, key, true));
                });
                manageShares.curShownItem = elem;
                manageShares.externalShareItemDetails.dialog("close");
                manageShares.internalShareItemDetails.dialog("close");
                manageShares.internalShareItemDetails.dialog("open");
            } else {
                manageShares.externalShareItemDetails.find("[rel]").each(function() {
                    var key = $(this).attr("rel");
                    if (key == "paths") {
                        var paths = manageShares.getColumnText(dataElem, key).split("\r\n");
                        var items = [];
                        for (var i = 0; i < paths.length; i++) {
                            var curFile = $.trim(paths[i]);
                            if (curFile.length > 0)
                                items.push("<li>" + unescape(curFile) + "</li>");
                        }
                        if (items.length > 0) {
                            $(this).empty().append("<ul class='pathlist'>" + items.join("") + "</ul>");
                        } else
                            $(this).empty().append("-");
                    } else if (key == "login_allowance") {
                        var login_allowance = manageShares.getColumnText(dataElem, "login_allowance");
                        if (login_allowance.toString().length == 0)
                            login_allowance = "NA";
                        else {
                            login_allowance = parseInt(login_allowance);
                            if (login_allowance == -1)
                                login_allowance = localizations.ManageShareMaximumUsesUnlimitedLabelText || "Unlimited";
                            else if (login_allowance == 0)
                                login_allowance = "Expired";
                        }
                        $(this).empty().html(login_allowance);
                    } else if (key == "emailTo" || key == "emailCc" || key == "emailBcc" || key == "emailFrom" || key == "emailReplyTo") {
                        var emails = manageShares.getColumnText(dataElem, key).split(",");
                        var items = [];
                        for (var i = 0; i < emails.length; i++) {
                            4;
                            var curItem = $.trim(emails[i]);
                            if (curItem.length > 0)
                                items.push("<li>" + unescape(curItem) + "</li>");
                        }
                        if (items.length > 0) {
                            $(this).empty().append("<ul class='emailList'>" + items.join("") + "</ul>");
                        } else
                            $(this).empty().append("-");
                    } else if (key == "created" || key == "expire") {
                        var dt = new Date(parseInt(manageShares.getColumnText(dataElem, key + "Millis")));
                        if (!crushFTP.methods.isValidDate(dt)) {
                            dt = manageShares.getColumnText(dataElem, key);
                            if (dt.indexOf("/") >= 0) {
                                var splitDate = dt.split(' ')[0].split("/");
                                if (splitDate.length == 3)
                                    dt = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                            }
                        } else {
                            dt = dt.format(dtFormat);
                        }
                        $(this).empty().html(dt);
                    } else {
                        if(window.manageSharesHideLinkPass && (key == "web_link" || key == "password")){
                            $(this).parent().remove();
                        }
                        else{
                            $(this).empty().html(manageShares.getColumnText(dataElem, key, true));
                        }
                    }
                });
                manageShares.curShownItem = elem;
                manageShares.internalShareItemDetails.dialog("close");
                manageShares.externalShareItemDetails.dialog("close");
                manageShares.externalShareItemDetails.dialog("open");
            }
            manageShares.curShownItemData = dataElem;
        }
    },
    applyCustomizations: function(callback) {
        crushFTP.UI.showLoadingIndicator({});
        crushFTP.data.serverRequest({
            command: "getUserInfo",
            random: Math.random()
        }, function(data) {
            var items = [];
            if (data && $(data).find("customizations_subitem")) {
                setTimeout(function() {
                    if (callback)
                        callback();
                }, 300);
                var toConsider = ["manageShare_HeaderBGColor", "manageShare_HeaderTextColor", "manageShare_HeaderBorderColor", "manageShare_BGColor", "manageShare_Color", "manageShare_TableHeaderBgColor", "manageShare_TableHeaderColor", "manageShare_TableHeaderBorderColor", "manageShare_TableRowBGColor", "manageShare_TableRowColor", "manageShare_TableRowHoverBGColor", "manageShare_TableRowHoverColor", "manageShare_TableRowHoverBorderColor", "manageShare_TableHiddenColumns", "shareyyyymmdd", "shareddmmyyyy", "manageShare_DateFormat", "manageShare_DetailsHideLinkPass"];
                crushFTP.UI.hideLoadingIndicator({});
                $(data).find("customizations_subitem").each(function(index) {
                    var curRow = $(this);
                    var key = manageShares.getColumnText(curRow, "key");
                    var val = manageShares.getColumnText(curRow, "value");
                    if (toConsider.has(key)) {
                        switch (key) {
                            case "manageShare_HeaderBGColor":

                                $.cssRule({
                                    "div.ui-widget-header": [
                                        ["background", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_HeaderTextColor":

                                $.cssRule({
                                    "#GUIAdmin .ui-widget-header, #GUIAdmin div.ui-widget-header span": [
                                        ["color", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_HeaderBorderColor":
                                $.cssRule({
                                    "#GUIAdmin div.ui-widget-header": [
                                        ["border-color", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_BGColor":
                                $.cssRule({
                                    "#GUIAdmin, #externalShareItemDetails, .ui-dialog, div.ui-widget-content, button.ui-state-default": [
                                        ["background", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_Color":
                                $.cssRule({
                                    "#GUIAdmin, #GUIAdmin a, #GUIAdmin label, #GUIAdmin span, #GUIAdmin p, #externalShareItemDetails, .ui-dialog, button.ui-state-hover, #GUIAdmin #manageShareslist_info": [
                                        ["color", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_TableHeaderBgColor":
                                $.cssRule({
                                    "#manageShareslist th": [
                                        ["background-color", val]
                                    ]
                                });
                                break;
                            case "manageShare_TableHeaderColor":
                                $.cssRule({
                                    "#manageShareslist th": [
                                        ["color", val]
                                    ]
                                });
                                break;
                            case "manageShare_TableHeaderBorderColor":
                                $.cssRule({
                                    "#manageShareslist th": [
                                        ["border-color", val]
                                    ]
                                });
                                break;
                            case "manageShare_TableRowBGColor":
                                $.cssRule({
                                    "#manageShareslist tbody tr td": [
                                        ["background", val + ""]
                                    ]
                                });
                                break;
                            case "manageShare_TableRowColor":
                                $.cssRule({
                                    "#manageShareslist tbody td": [
                                        ["color", val + ""]
                                    ]
                                });
                                break;
                            case "manageShare_TableRowHoverBGColor":
                                $.cssRule({
                                    "#manageShareslist tbody .clickable:hover": [
                                        ["background", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_TableRowHoverColor":
                                $.cssRule({
                                    "#manageShareslist tbody .clickable:hover": [
                                        ["color", val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_TableRowHoverBorderColor":
                                $.cssRule({
                                    "#manageShareslist tbody .clickable:hover": [
                                        ["border", "1px solid " + val + " !important"]
                                    ]
                                });
                                break;
                            case "manageShare_TableHiddenColumns":
                                var cols = val.split(",");
                                var colsToHide = [];
                                for (var i = cols.length - 1; i >= 0; i--) {
                                    if ($.trim(cols[i]).length > 0) {
                                        var _col = parseInt(cols[i]);
                                        _col += 1;
                                        colsToHide.push(".shareColumn" + _col + "");
                                    }
                                }
                                var rule = {};
                                rule[colsToHide.join(",")] = [
                                    ["display", "none !important"]
                                ];
                                $.cssRule(rule);
                                break;
                            case "shareyyyymmdd":
                                // If share window to yse yyyymmdd format
                                window.Shareyyyymmdd = val.toString() == "true";
                                break;
                            case "shareddmmyyyy":
                                // If share window to yse ddmmyyyy format
                                window.Shareddmmyyyy = val.toString() == "true";
                                break;
                            case "manageShare_DateFormat":
                                window.manageSharesDateFormat = val.toString();
                                break;
                            case "manageShare_DetailsHideLinkPass":
                                window.manageSharesHideLinkPass = val.toString() == "true";
                                break;
                            default:
                                break;
                        }
                    }
                });
            } else {
                if (callback)
                    callback();
            }
        });
    },
    managedtable: function(items, _pageSize, _pagenumber, sortedCol, sortedType, searchText, hasNonZeroDownloads) {
        $("#manageShareslist").show();
        var pageLength = _pageSize || 25;
        var page = _pagenumber || 1;
        var iDisplayStart = (page * pageLength) - pageLength;

        var dataTableLoc = localizations.dataTableLoc || {
            "sEmptyTable": "No data available in table",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
            "sInfoEmpty": "Showing 0 to 0 of 0 entries",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "Show _MENU_ entries",
            "sLoadingRecords": "Loading...",
            "sProcessing": "Processing...",
            "sSearch": "Search:",
            "sZeroRecords": "No matching records found",
            "oPaginate": {
                "sFirst": "First",
                "sLast": "Last",
                "sNext": "Next",
                "sPrevious": "Previous"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        };

        var dtFormat = "mm" + window.dateSeparator + "dd" + window.dateSeparator + "yyyy hh:nn a/p";
        if ((window.localizations && window.localizations.ManageShareDateFormatDDMMYYYY) || window.Shareddmmyyyy) {
            dtFormat = "dd" + window.dateSeparator + "mm" + window.dateSeparator + "yyyy hh:nn a/p";
        }
        if(window.manageSharesDateFormat)
            dtFormat = window.manageSharesDateFormat;

        var columns = [{
            'width': "2%",
            data: 'ind_delid_',
            orderable: false,
            ordering: false,
            sortable: false
        }, {
            data: 'createdDate_',
            visible: false
        },
        {
            'width': "10%",
            'className': "shareColumn2 clickable",
            data: 'createdDate_',
            "orderData": 1,
            render: function(data, vis, row) {
                date = new Date(parseInt(row.createdDate_));
                if (!crushFTP.methods.isValidDate(date)) {
                    date = row.createdDate_;
                    if (date.indexOf("/") >= 0) {
                        var splitDate = date.split(' ')[0].split("/");
                        if (splitDate.length == 3) {
                            date = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                        }
                    }
                }
                else
                    date = date.format(dtFormat);
                return date;
            }
        }, {
            data: 'expireDate_',
            visible: false
        },{
            'width': "10%",
            'className': "shareColumn3 clickable",
            data: 'expireDate_',
            "orderData": 3,
            render: function(data, vis, row) {
                date = new Date(parseInt(row.expireDate_));
                if (!crushFTP.methods.isValidDate(date)) {
                    date = row.expireDate_;
                    if (date.indexOf("/") >= 0) {
                        var splitDate = date.split(' ')[0].split("/");
                        if (splitDate.length == 3) {
                            date = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                        }
                    }
                }
                else
                    date = date.format(dtFormat);
                return date;
            }
        }, {
            'width': "15%",
            'className': "shareColumn4 clickable",
            data: 'emailTo_'
        }, {
            'width': "25%",
            'className': "shareColumn5 clickable",
            data: 'pathsText_'
        }, {
            'width': "15%",
            'className': "shareColumn6 clickable",
            data: 'login_allowance_'
        }, {
            'width': "8%",
            'className': "shareColumn7 clickable",
            data: 'downloads_'
        }, {
            'width': "15%",
            'className': "shareColumn8 clickable",
            data: 'commnets_'
        }];
        if(!hasNonZeroDownloads){
            $('#manageShareslist').find('th[_column="downloads"]').remove();
            columns = [{
                'width': "2%",
                data: 'ind_delid_',
                orderable: false,
                ordering: false,
                sortable: false
            }, {
                data: 'createdDate_',
                visible: false
            },{
                'width': "10%",
                'className': "shareColumn2 clickable",
                data: 'createdDate_',
                "orderData": 1,
                render: function(data, vis, row) {
                    date = new Date(parseInt(row.createdDate_));
                    if (!crushFTP.methods.isValidDate(date)) {
                        date = row.createdDate_;
                        if (date.indexOf("/") >= 0) {
                            var splitDate = date.split(' ')[0].split("/");
                            if (splitDate.length == 3) {
                                date = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                            }
                        }
                    }
                    else
                        date = date.format(dtFormat);
                    return date;
                }
            }, {
                data: 'expireDate_',
                visible: false
            },{
                'width': "10%",
                'className': "shareColumn3 clickable",
                data: 'expireDate_',
                "orderData": 3,
                render: function(data, vis, row) {
                    date = new Date(parseInt(row.expireDate_));
                    if (!crushFTP.methods.isValidDate(date)) {
                        date = row.expireDate_;
                        if (date.indexOf("/") >= 0) {
                            var splitDate = date.split(' ')[0].split("/");
                            if (splitDate.length == 3) {
                                date = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                            }
                        }
                    }
                    else
                        date = date.format(dtFormat);
                    return date;
                }
            }, {
                'width': "15%",
                'className': "shareColumn4 clickable",
                data: 'emailTo_'
            }, {
                'width': "25%",
                'className': "shareColumn5 clickable",
                data: 'pathsText_'
            }, {
                'width': "15%",
                'className': "shareColumn6 clickable",
                data: 'login_allowance_'
            }, {
                'width': "15%",
                'className': "shareColumn8 clickable",
                data: 'commnets_'
            }];
        }
        manageShares.ManageDatatable = $('#manageShareslist').DataTable({
            processing: true,
            data: items,
            autoWidth: false,
            pageLength: pageLength,
            iDisplayStart: iDisplayStart,
            order: [
                [sortedCol, sortedType]
            ],
            oSearch: {
                "sSearch": searchText
            },
            "language": dataTableLoc,
            //page:page,
            fnDrawCallback: function() {
                manageShares.contextMenu();
                setTimeout(function() {
                    manageShares.applyLocalizations();
                }, 100);
            },
            columnDefs: [{
                'targets': 0,
                'searchable': false,
                'Sortable': false,
                'className': 'dt-body-center shareColumn1 clickable',
                'render': function(data, type, full, meta) {
                    return '<input type="checkbox" name="id[0]" value="' + $('<div/>').text(data).html() + '">';
                }
            }],
            columns:columns
        });

        $("#manageShareslist thead th[_column='created']").text(_CreatedClm);
        $("#manageShareslist thead th[_column='expire']").text(_ExpiresClm);
        $("#manageShareslist thead th[_column='emailTo']").text(_toclm);
        $("#manageShareslist thead th[_column='paths']").text(_pathClm);
        $("#manageShareslist thead th[_column='Remaining Uses']").text(_RemainingUsesClm);
        $("#manageShareslist thead th[_column='downloads']").text(_DownloadsClm);
        $("#manageShareslist thead th[_column='comments']").text(_CommentsClm);

    },


    fetchShareRecords: function(_pageSize, _pagenumber, sortedCol, sortedType, searchText) {
        crushFTP.UI.showLoadingIndicator({});
        crushFTP.data.serverRequest({
            command: "manageShares",
            random: Math.random()
        }, function(data) {
            var items = [];
            if (data && $(data).find("listingInfo_subitem")) {
                var _items = $.xml2json(data);
                var alterItem = [];
                if (typeof _items.listingInfo == "undefined")
                    crushFTP.methods.rebuildSubItems(_items, "listingInfo");
                else
                    crushFTP.methods.rebuildSubItems(_items.listingInfo, "listingInfo_subitem");
                var hasNonZeroDownloads;
                for (var i = 0; i < _items.listingInfo_subitem.length; i++) {
                    var curItem = _items.listingInfo_subitem[i];
                    if (curItem) {
                        var curRow = $(this);
                        var isInternalShare = curItem.usernameShare == "true";
                        var deleteIds = "";
                        if (curItem.usernameShare == "true")
                            deleteIds += curItem.username + ":" + curItem.paths + ";";
                        else
                            deleteIds += curItem.username + ";";

                        var index_ = i;
                        var deleteIds_ = crushFTP.methods.htmlEncode(deleteIds);

                        var dtFormat = "mm" + window.dateSeparator + "dd" + window.dateSeparator + "yyyy hh:nn a/p";
                        if ((window.localizations && window.localizations.ManageShareDateFormatDDMMYYYY) || window.Shareddmmyyyy) {
                            dtFormat = "dd" + window.dateSeparator + "mm" + window.dateSeparator + "yyyy hh:nn a/p";
                        }
                        if(window.manageSharesDateFormat)
                            dtFormat = window.manageSharesDateFormat;
                        var createdDate = "-";
                        if (curItem.createdMillis) {
                            createdDate = new Date(parseInt(curItem.createdMillis));
                            if (!crushFTP.methods.isValidDate(createdDate)) {
                                createdDate = curItem.created;
                                if (createdDate.indexOf("/") >= 0) {
                                    var splitDate = createdDate.split(' ')[0].split("/");
                                    if (splitDate.length == 3)
                                        createdDate = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                                }
                            } else {
                                createdDate = createdDate.getTime();//.format(dtFormat);
                            }
                        }
                        var expireDate = "-";
                        if (curItem.expireMillis) {
                            expireDate = new Date(parseInt(curItem.expireMillis));
                            if (!crushFTP.methods.isValidDate(expireDate)) {

                                expireDate = curItem.expire;
                                if (expireDate.indexOf("/") >= 0) {
                                    var splitDate = expireDate.split(' ')[0].split("/");
                                    if (splitDate.length == 3) {
                                        expireDate = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                                    }
                                }
                            } else {
                                expireDate = expireDate.getTime();//.format(dtFormat);
                            }
                        } else if (curItem.expire) {
                            try{
                                expireDate = new Date(curItem.expire);
                            }catch(ex){}
                            if (!crushFTP.methods.isValidDate(expireDate)) {
                                expireDate = curItem.expire;
                                if (expireDate.indexOf("/") >= 0) {
                                    var splitDate = expireDate.split(' ')[0].split("/");
                                    if (splitDate.length == 3) {
                                        expireDate = splitDate[1] + window.dateSeparator + splitDate[0] + window.dateSeparator + splitDate[2];
                                    }
                                }
                            } else {
                                expireDate = expireDate.getTime();//.format(dtFormat);
                            }
                        }

                        var createdDate_ = createdDate;
                        var expireDate_ = expireDate;

                        var emailTo = "";
                        var emails = ["-"];
                        if (curItem.emailTo)
                            emails = curItem.emailTo.split(",");
                        if (emails.length > 3) {
                            var remained = emails.length - 3;
                            emailTo = unescape(emails[0]) + "<br>" + unescape(emails[1]) + "<br>" + unescape(emails[2]) + " <span class='fewMore'> ... and <strong>" + remained + "</strong> more...</span>";
                        } else
                            emailTo = unescape(emails.join("<br>"));

                        var emailTo_ = emailTo;
                        var pathsText = "";
                        var paths = [];
                        curItem.paths = curItem.paths || "-";
                        if ($.browser.msie) {
                            paths = curItem.paths.split("\n");
                            if (paths.length == 1 && paths[0].indexOf("\n") >= 0)
                                paths = paths[0].split("\n");
                        } else
                            paths = curItem.paths.split("\r\n");
                        if (paths.length > 3) {
                            var remained = paths.length - 3;
                            pathsText = unescape(paths[0]) + "<br>" + unescape(paths[1]) + "<br>" + unescape(paths[2]) + " <span class='fewMore'> ... and <strong>" + remained + "</strong> more...</span>";
                        } else
                            pathsText = unescape(paths.join("<br>"));
                        var pathsText_ = pathsText;
                        var login_allowance = curItem.login_allowance;
                        if (!login_allowance || login_allowance.toString().length == 0)
                            login_allowance = "NA";
                        else {
                            login_allowance = parseInt(login_allowance);
                            if (login_allowance == -1)
                                login_allowance = localizations.ManageShareMaximumUsesUnlimitedLabelText || "Unlimited";
                            else if (login_allowance == 0)
                                login_allowance = "Expired";
                        }
                        var login_allowance_ = login_allowance;
                        var downloads_ = curItem.downloads || "-";
                        var commnets_ = curItem.share_comments || "";
                        var ind_delid = index_ + '-' + deleteIds_;
                        if(downloads_ +"" != "0")
                            hasNonZeroDownloads = true;
                        items.push({
                            "index_": crushFTPTools.textEncode(index_),
                            "deleteIds_": crushFTPTools.textEncode(deleteIds_),
                            "ind_delid_": crushFTPTools.textEncode(ind_delid),
                            "createdDate_": crushFTPTools.textEncode(createdDate_),
                            "expireDate_": crushFTPTools.textEncode(expireDate_),
                            "emailTo_": crushFTPTools.textEncode(emailTo_),
                            "pathsText_": crushFTPTools.textEncode(pathsText_),
                            "login_allowance_": crushFTPTools.textEncode(login_allowance_),
                            "downloads_": crushFTPTools.textEncode(downloads_),
                            "commnets_": crushFTPTools.textEncode(commnets_)
                        });
                        alterItem.push(curItem);
                    }
                }
                var selected = [];
                manageShares.DataTableItems = items;
                if (typeof _pageSize === "undefined" || _pageSize === null) {
                    _pageSize = 25;
                } else {
                    _pageSize = parseInt(_pageSize);
                }
                if (typeof _pagenumber === "undefined" || _pagenumber === null) {
                    _pagenumber = 1;
                } else {
                    _pagenumber = parseInt(_pagenumber);
                }
                if (typeof sortedCol === "undefined" || _pagenumber === null) {
                    sortedCol = 0;
                } else {
                    sortedCol = parseInt(sortedCol);
                }
                manageShares.managedtable(items, _pageSize, _pagenumber, sortedCol, sortedType, searchText, hasNonZeroDownloads);
                // Handle click on "Select all" control
                $('#manageShareslist thead input[name="select_all"]').on('click', function(e) {
                    if (this.checked) {
                        $('#manageShareslist tbody input[type="checkbox"]:not(:checked)').trigger('click');
                    } else {
                        $('#manageShareslist tbody input[type="checkbox"]:checked').trigger('click');
                    }
                    // Prevent click event from propagating to parent
                    e.stopPropagation();
                });

                $('#manageShareslist').on('click', 'td', function(evt) {
                    if ($(this).find("input[type=checkbox]").length == 0) {
                        var Managesharetr = $(this).closest("tr");
                        manageShares.showDetails(Managesharetr);
                    }
                });
                manageShares.shareData = $(data).find("listingInfo_subitem");
                $(data).find("listingInfo_subitem").each(function(index) {});
            } else
                manageShares.shareData = false;

            crushFTP.UI.hideLoadingIndicator({});
        });
        manageShares.contextMenu();

        function handleServerItemEvent(evt, type) {
            if (!evt)
                return;
            var target = $(evt.target);
            var targetElem = target.hasClass('server-item-row') ? target : target.closest('.server-item-row');
            listPanel.focus();
            if (type == "context") {
                evt.preventDefault();
                evt.stopPropagation();
            } else if (type == "dblClick") {
                var dataRow;
                if (targetElem.length > 0) {
                    dataRow = target.closest('.server-item-row').data("dataRow");
                }
                if (dataRow) {
                    if (dataRow.type == "dir") {
                        navigateToDir(dataRow.name, clientName, prefix);
                    }
                }
            } else if (type == "click") {
                // var start = parseInt(targetElem.attr("_index"));
                var _index1 = targetElem.find("input[type=checkbox]").val().split("-"); // elem.attr("_index");
                var start = _index1[0];
                var end;
                if (evt.shiftKey) {
                    end = serverData.lastSelectedIndex;
                    if (typeof end != "undefined") {
                        if (end < start) {
                            var hold = start;
                            start = end;
                            end = hold;
                        }
                    }
                }
                makeItemSelection({
                    start: start,
                    end: end
                }, clientName, prefix, evt.shiftKey, evt.ctrlKey || evt.metaKey);
            } else if (type == "keyup") {
                if (evt.which) {
                    if (evt.which == 27 || evt.metaKey || evt.ctrlKey || listPanel.data("selectAll")) {
                        serverData.filterWord = false;
                        listPanel.find(".word-suggest").remove();
                        return false;
                    }
                    var word = serverData.filterWord || "";
                    var varKey = $.getChar(evt);
                    if (evt.which == 8) {
                        varKey = -1;
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                    if (varKey) {
                        if (varKey == -1) {
                            if (word.length == 1)
                                word = "";
                            else
                                word = word.substr(0, word.length - 1);
                        } else {
                            var c = String.fromCharCode(varKey);
                            word += c + "";
                        }
                        word = word.ltrim();
                        listPanel.find(".word-suggest").remove();
                        if (word && $.trim(word).length > 0) {
                            listPanel.append('<span class="word-suggest">' + word + '</span>');
                            serverData.filterWord = word;
                        }
                        if (word) {
                            var dataTable = listPanel.data("dataTable");
                            var dataSource = dataTable.options.dataSource;
                            var i = 0;
                            var found = "no-match";
                            while (i < dataSource.length) {
                                if (dataSource[i].name.toLowerCase().indexOf(word.toLowerCase()) == 0) {
                                    makeItemSelection({
                                        start: i
                                    }, clientName, prefix, evt.shiftKey, evt.shiftKey);
                                    dataTable.scrollToIndex(i);
                                    found = "found-match";
                                    i = dataSource.length;
                                }
                                i++;
                            }
                            listPanel.find(".word-suggest").addClass(found);
                        }
                        delay(function() {
                            serverData.filterWord = false;
                            listPanel.find(".word-suggest").remove();
                        }, 2000);
                        evt.preventDefault();
                        evt.stopPropagation();
                        return false;
                    }
                }
            } else if (type == "keydown") {
                if (evt.which == 8) {
                    varKey = -1;
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                }
                if (evt.which == 65 && (evt.metaKey || evt.ctrlKey)) {
                    var dataTable = listPanel.data("dataTable");
                    var dataSource = dataTable.options.dataSource;
                    makeItemSelection({
                        start: 0,
                        end: dataSource.length
                    }, clientName, prefix);
                    serverData.lastSelectedIndex = 0;
                    listPanel.data("selectAll", true);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.which == 13 || (evt.which == 40 && (evt.ctrlKey || evt.metaKey))) // On enter or Cmd + right arrow
                {
                    listPanel.removeData("selectAll");
                    var item = serverData.lastSelectedIndex;
                    if (typeof item !== "undefined") {
                        item = parseInt(item);
                        var dataTable = listPanel.data("dataTable");
                        var dataSource = dataTable.options.dataSource;
                        var dataRow = dataSource[item];
                        if (dataRow && dataRow.type == "dir") {
                            serverData.filterWord = false;
                            listPanel.find(".word-suggest").remove();
                            navigateToDir(dataRow.name, clientName, prefix, false, true);
                        }
                        evt.preventDefault();
                        evt.stopPropagation();
                        return false;
                    }
                } else if (evt.which == 38 && (evt.ctrlKey || evt.metaKey)) // On Cmd + left arrow
                {
                    listPanel.removeData("selectAll");
                    navigateToDir(false, clientName, prefix, true, true);
                    serverData.lastSelectedIndex = 0;
                    serverData.filterWord = false;
                    listPanel.find(".word-suggest").remove();
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.which == 38 || evt.which == 40) // On up/down arrows
                {
                    listPanel.removeData("selectAll");
                    var item = serverData.lastSelectedIndex || 0;
                    if (typeof item !== "undefined") {
                        var dataTable = listPanel.data("dataTable");
                        var dataSource = dataTable.options.dataSource;
                        var toSelect;
                        if (evt.which == 38) {
                            if (item - 1 >= 0)
                                toSelect = item - 1;
                        } else {
                            if (item + 2 <= dataSource.length)
                                toSelect = item + 1;
                        }
                        if (typeof toSelect != "undefined") {
                            serverData.filterWord = false;
                            listPanel.find(".word-suggest").remove();
                            makeItemSelection({
                                start: toSelect
                            }, clientName, prefix, evt.shiftKey, evt.shiftKey);
                            dataTable.scrollToIndex(item);
                        }
                    }
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else if (evt.which == 32) // spcebar scroll stop
                {
                    listPanel.removeData("selectAll");
                    evt.preventDefault();
                    evt.stopPropagation();
                    return false;
                } else {
                    listPanel.removeData("selectAll");
                }
            }
        }
    },
    contextMenu: function() {
        $("#manageShareslist").find("td").contextMenu({
                menu: "rowContextMenu",
                inSpeed: 0,
                outSpeed: 0
            },
            function(action, el, pos) {
                if (action == "similar") {
                    var dataItem = $(manageShares.shareData[$(el).closest("tr").find("input[type=checkbox]").val().split("-")[0]]);
                    manageShares.selectSimilarPopup.find("#matchColumnData").val("");
                    if (dataItem && dataItem.length > 0) {
                        var column = $(el).closest('table').find('th').eq($(el).index()).attr("_column"); //el.attr("_column");
                        var columnName = manageShares.columnNames[column];
                        var text = dataItem.find(column).text();
                        if (column == "emailTo")
                            text = text.split(",").join("\n");
                        else if (column == "paths")
                            text = text.split("\r\n").join("\n");
                        manageShares.selectSimilarPopup.find("#columnToSelect").text(columnName).attr("_column", column);
                        manageShares.selectSimilarPopup.find("#matchColumnData").val(text);
                        manageShares.selectSimilarPopup.dialog("open");
                    }
                } else if (action == "delete") {
                    var name = el.closest("tr").find("input[type=checkbox]").val();
                    $("#deleteSelectedShares").trigger("click", [name.substr(name.indexOf("-")+1)]);

                }
            }
        );
    },
    getColumnText: function(row, column, flag) {
        var text = row.find("" + column).text();
        if (flag) {
            if (text == "true") text = "Yes";
            if (text == "false") text = "No";
        }
        if (column == "paths")
            return crushFTPTools.textEncode(text);
        else
            return crushFTPTools.textEncode(text);
    }
};

window.applyLocalizations = function() {};