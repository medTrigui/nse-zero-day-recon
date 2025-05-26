/*Report interface*/

crushReports.reports.UploadFormsSearch = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;
    var icon = "fa-list-alt";
    var title = "Upload Forms Search";
    var desc = "Search items in upload forms submitted by users.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var searches = $(x).find("metas_subitem");

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var date = $(this).find(" > date:first").text();
            var username = $(this).find(" > username:first").text();
            var metaInfo = $(this).find("metaInfo");
            var transfers = $(this).find("transfers");
            var formInfo = {};
            var transferredItems = [];
            metaInfo.each(function(){
                $(this).find("*").each(function(){
                    formInfo[$(this).get(0).tagName] = crushFTPTools.xmlEncode($(this).text());
                });
            });
            transfers.each(function(){
                var curItem = {};
                $(this).find("*").each(function(){
                    curItem[$(this).get(0).tagName] = crushFTPTools.xmlEncode($(this).text());
                });
                transferredItems.push(curItem);
            });
            items.push({
                username : crushFTPTools.xmlEncode(username),
                date : crushReports.getTimestamp(date),
                meta : formInfo,
                transfers : transferredItems
            });
        });
        return {
            items : items
        }
    };
    var searchData = processData(searches);

    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "searches"));
    tables.append(shareContent);
    var columns = [{
        "data": "username"
    }, {
        "data": "date",
        render : function(d){
            return crushReports.formatDate(d, true)
        },
        orederData : [4]
    }, {
        "className": 'details-control text-center',
        "orderable": false,
        "data": null,
        "defaultContent": '<a href="javascript:void(0);">Show Form Info</a>'
    }, {
        "className": 'transfers-control text-center',
        "orderable": false,
        "data": null,
        "defaultContent": '<a href="javascript:void(0);">Show Transfers</a>'
    },{
        data : "date",
        visible : false
    }];

    function showFormInfo(data){
        var formInfo = data.meta;
        var html = "";
        for(var item in formInfo)
        {
            html += '<div class="row"><div class="col-md-4 text-right"><strong>'+item+' :</strong></div><div class="col-md-8">'+crushFTPTools.decodeXML(formInfo[item]).replace(/\+/g,' ')+'</div></div><hr />'
        }
        var dialog = bootbox.dialog({
            title : 'Form Info : ' + data.username + " (" + crushReports.formatDate(data.date, true) + ")",
            message : html,
            onEscape : true
        });
    }

     function showTransfers(data){
        var transfers = data.transfers || [];
        var html = "";
        transfers.forEach(function(transfer){
            for(var item in transfer)
            {
                html += '<div class="row"><div class="col-md-4 text-right"><strong>'+item+' :</strong></div><div class="col-md-8">'+crushFTPTools.decodeXML(formInfo[item]).replace(/\+/g,' ')+'</div></div><hr />'
            }
        })
        var dialog = bootbox.dialog({
            title : 'Transfers : ' + data.username + " (" + crushReports.formatDate(data.date, true) + ")",
            message : html,
            onEscape : true
        });
    }

    var usersTable = $('#searches_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var usersTableDT = usersTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: searchData.items,
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
            var x = nRow;
            $(x).find('td').each(function() {
                $(this).addClass('reports-td');
                $(this).css("max-width", maxwidth);
                $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
            });
            return nRow;
        },
        "columns": columns,
        "order": [
            [0, 'asc']
        ]
    });
    $('#searches_dataRecord tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = usersTableDT.row(tr);
        showFormInfo(row.data());
    });

    $('#searches_dataRecord tbody').on('click', 'td.transfers-control', function() {
        var tr = $(this).closest('tr');
        var row = usersTableDT.row(tr);
        showTransfers(row.data());
    });

    var hasData = searchData.items.length;
    if (hasData) {
        $('#exportAsXLS').unbind().click(function() {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            var wb = new Workbook();
            /* add worksheet to  */
            function addType(data, type) {
                var sheetName = "" + type;
                if (!wb.SheetNames.has(sheetName))
                    wb.SheetNames.push(sheetName);
                var tableRecords = [];
                var defaultRow = ["Username", "Date", "Form Info"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    var form = [];
                    for(var item in curFile.meta){
                        form.push(item + "=" + crushFTPTools.decodeXML(curFile.meta[item]).replace(/\+/g,' '));
                    }
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(crushReports.formatDate(curFile.date));
                    row.push(form.join("\n"));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(searchData, "FormInfo");
            var wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], {
                type: "application/octet-stream"
            }), "UploadFormsSearch.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}