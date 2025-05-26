/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelDashboard = {};
panelDashboard.localization = {};
/****************************/

// Panel details
panelDashboard.panelName = "Dashboard";
panelDashboard._panel = $("#pnl" + panelDashboard.panelName);

// Graphs Vars
panelDashboard.Graphs = {
  height: "115px",
  width: "115px",
};

// Localizations
panelDashboard.localization = {};

// Assign localizations
localizations.panels[panelDashboard.panelName] = $.extend(
  panelDashboard.localization,
  localizations.panels[panelDashboard.panelName]
);

// Interface methods
panelDashboard.init = function () {
  panelDashboard.showHistoricData(false);
  applyLocalizations(panelDashboard.panelName, localizations.panels);
  panelDashboard.bindEvents();
};

panelDashboard.showHistoricData = function (date) {
  var dashboardStatus = $("#dashboardStatus");
  if (!date) {
    panelDashboard.isLive = true;
    delete panelDashboard.loadedDate;
    dashboardStatus.addClass("online");
    dashboardStatus.find(".next").addClass("disabled");
    dashboardStatus.find(".prev").removeClass("disabled");
    return false;
  }
  panelDashboard.loadedDate = date;
  dashboardStatus.removeClass("online");
  var dt = moment(date, "YYMMDD HHmm");
  dashboardStatus.find(".date > .value").text(dt.format("YYYY-MM-DD HH:mm"));
  dt = dt.add(5, "minutes");
  var curDate = moment();
  if (dt.isAfter(curDate) || dt.isSame(curDate)) {
    dashboardStatus.find(".next").addClass("disabled");
  } else {
    dashboardStatus.find(".next").removeClass("disabled");
  }
  dt = dt.subtract(10, "minutes");
  if (
    dt.isAfter(panelDashboard.lastSnapshotDate) ||
    dt.isSame(panelDashboard.lastSnapshotDate)
  ) {
    dashboardStatus.find(".prev").removeClass("disabled");
  } else {
    dashboardStatus.find(".prev").addClass("disabled");
  }
  panelDashboard.isLive = false;
};

panelDashboard.bindEvents = function () {
  $(".resetStat", panelDashboard._panel)
    .contextMenu(
      {
        topPadding: 110,
        leftPadding: 20,
        menu: "serverResetStatsContextMenu",
      },
      function (action, el, pos, command) {
        jConfirm(
          "Are you sure you want to : " + command + "?",
          "Confirm",
          function (flag) {
            if (flag) {
              panelDashboard.serverStatResetAction(action);
            }
          }
        );
        return false;
      }
    )
    .click(function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    });

  $("#changeSnapshotTime").datetimepicker({
    timeFormat: "hh:mm",
    dateFormat: "ymmdd",
    // showOn: "both",
    // buttonImage: "/WebInterface/Resources/images/calendar.png",
    // buttonImageOnly: false,
    maxDate: new Date(),
    stepMinute: 5,
    onClose: function (date) {
      if (date == moment().format("YYMMDD HH:mm")) {
        panelDashboard.showHistoricData(false);
        return false;
      }
      panelDashboard.gethistoricalData(date);
    },
  });
  var dashboardStatus = $("#dashboardStatus");
  dashboardStatus.find(".cancel").click(function () {
    panelDashboard.showHistoricData(false);
    crushFTP.methods.removeTextRangeSelection();
    return false;
  });

  dashboardStatus.find(".prev, .next").click(function () {
    var curTime = moment();
    var minute = curTime.minute();
    var closest = Math.round(minute / 5) * 5;
    curTime.minute(closest);
    var useDate = panelDashboard.loadedDate || curTime;
    if ($(this).hasClass("disabled")) return false;
    if (useDate) {
      var dt = panelDashboard.loadedDate
        ? moment(panelDashboard.loadedDate, "YYMMDD HHmm")
        : useDate;
      if ($(this).is(".prev")) {
        dt = dt.subtract(5, "minutes");
      } else if ($(this).is(".next")) {
        dt = dt.add(5, "minutes");
        var curDate = moment();
        if (dt.isSame(curDate) || dt.isAfter(curDate)) {
          panelDashboard.showHistoricData(false);
          crushFTP.methods.removeTextRangeSelection();
          return false;
        }
      }
      panelDashboard.gethistoricalData(dt.format("YYMMDD HHmm"));
    }
    crushFTP.methods.removeTextRangeSelection();
    return false;
  });
  $("#lastSnapshotTime").click(function () {
    if ($(this).attr("date")) {
      panelDashboard.gethistoricalData($(this).attr("date"));
    }
    crushFTP.methods.removeTextRangeSelection();
    return false;
  });

  var refreshDataFlow = $("#refreshDataFlow").click(function () {
    if ($(this).attr("disabled")) return false;
    $(this).attr("disabled", "disabled");
    panelDashboard.refreshDataFlow(function () {
      refreshDataFlow.removeAttr("disabled");
    });
    return false;
  });

  var refreshDataFlowOptions = $("#refreshDataFlowOptions").change(function () {
    var val = $(this).val();
    if (val === "0") {
      refreshDataFlow.show();
    } else {
      refreshDataFlow.hide();
    }
    localStorage["refreshDataFlowInterval"] = val;
    panelDashboard.refreshDataFlow(function () {
      panelDashboard.scheduleDataFlowInterval();
    });
  });
  var interval = localStorage["refreshDataFlowInterval"] || "10";
  refreshDataFlowOptions.val(interval).trigger("change");
  $(".expand").unbind().click(function(){
    var that = $(this);
    var modalBody = that.parent().find("#"+that.attr("rel"));
    // console.log(modalBody);
    var chartBody = modalBody.find(".chart-body");
    var _modalBody = chartBody.clone("true");
    _modalBody.find("input").remove();
    modalBody.append(_modalBody);
    var oldStyle= "";
    var curDialog = chartBody.dialog({
      title: that.text(),
      width:"60%",
      height: 600,
      zIndex: 10002,
      modal:true,
      open: function(evt, ui){
        oldStyle = chartBody.find("canvas").attr("style");
        chartBody.find("canvas").attr("style", 'height: 233px');
      },
      beforeClose: function(){
        chartBody.removeAttr("style");
        chartBody.removeClass("ui-dialog-content ui-widget-content");
        modalBody.empty().append(chartBody);
        chartBody.find("canvas").attr("style", oldStyle);
      },
      close: function(evt, ui){
        curDialog.dialog("destroy");
        chartBody.show(10);
      },
      resize: function(evt, ui){
        console.log(evt, ui);
      }
    });
  });
};

panelDashboard.scheduleDataFlowInterval = function () {
  var interval = localStorage["refreshDataFlowInterval"] || "10";
  clearTimeout(panelDashboard.scheduledInterval);
  if (interval !== "0") {
    var ms = parseInt(interval) * 1000;
    panelDashboard.scheduledInterval = setTimeout(function () {
      if($("#mapcontainer").is(":visible"))
        panelDashboard.refreshDataFlow();
      panelDashboard.scheduleDataFlowInterval();
    }, ms);
  }
};

panelDashboard.getServerTime = function(cb){
    if(crushFTP.storage("currentServerTime"))
    {
        cb(crushFTP.storage("currentServerTime"));
        return;
    }
    crushFTP.data.serverRequest(
        {
            command: 'getServerItem',
            key: "server_info/current_datetime_ddmmyyhhmmss",
            random: Math.random()
        },
        function(msg){
            var time = $(msg).find("response_status").text() || "";
            var myDate = new Date();
            if(time)
            {
                var mm = parseInt(time.substr(0, 2), 0);
                var dd = parseInt(time.substr(2, 2), 0);
                var yyyy = parseInt(time.substr(4, 4), 0);
                var hh = parseInt(time.substr(8, 2), 0);
                var mmm = parseInt(time.substr(10, 2), 0);
                var ss = parseInt(time.substr(12, 2), 0);
                myDate = new Date(yyyy, mm-1, dd, hh, mmm, ss);
            }
            crushFTP.storage("currentServerTime", myDate);
            setTimeout(function(){
                crushFTP.removeStorage("currentServerTime");
            }, 10000);
            cb(myDate);
        }
    );
};

panelDashboard.gethistoricalData = function (date) {
  if (!date || date.split(" ").length < 2) {
    panelDashboard.showHistoricData(false);
    return;
  }
  var dt = date.split(" ")[0];
  var tm = date.split(" ")[1].split(":").join("");
  if (dt && tm) {
    var loadedDate = panelDashboard.loadedDate
      ? panelDashboard.loadedDate + ""
      : "";
    panelDashboard.getServerTime(function(serverDT){
      var dt = moment(date, "YYMMDD HHmm");
      var serverDt = moment(serverDT);
      var curDt = moment();
      var offset = curDt
      var duration = moment.duration(serverDt.diff(curDt));
      var mins = Math.round(duration.asMinutes());
      dt.add(mins, "minutes");
      var _date = dt.format("YYMMDD HHmm");
      dt = _date.split(" ")[0];
      tm = _date.split(" ")[1].split(":").join("");
      panelDashboard.showHistoricData(date);
      crushFTP.data.serverRequest(
        {
          command: "getDashboardHistory",
          history_date: dt,
          history_time: tm,
        },
        function (data) {
          if(data && data.getElementsByTagName)
          {
            var xml = data.getElementsByTagName("result_value")[0];
            var status = $(data).find("response_status").text();
            if (status.toLowerCase() === "ok") {
              var items = $.xml2json(xml);
              $('[_id="connected_users"]', "#speedInformation").text("-");
              panelDashboard.bindData(
                items.getDashboardItems,
                xml.getElementsByTagName("getDashboardItems")[0],
                true
              );
              var statInfo = $.xml2json(
                $.xml2json(xml.getElementsByTagName("getStatHistory")[0])
              );
              if (statInfo) {
                panelGraphs.bindGraphsData(statInfo, true);
              }
            } else {
              // if(!loadedDate){
              // 	panelDashboard.showHistoricData(false);
              // }
              // else{
              // 	panelDashboard.showHistoricData(loadedDate);
              // }
              crushFTP.UI.growl("Failure", crushFTP.methods.htmlEncode(status), true, 3000);
            }
          }
          else {
            // if(!loadedDate){
            //   panelDashboard.showHistoricData(false);
            // }
            // else{
            //   panelDashboard.showHistoricData(loadedDate);
            // }
            crushFTP.UI.growl("Failure", crushFTP.methods.htmlEncode(status), true, 3000);
          }
        }
      );
    });
  }
};

panelDashboard.serverStatResetAction = function (action) {
  var cmdObj = {
    command: "adminAction",
    action: action,
  };
  crushFTP.data.serverRequest(cmdObj, function (data) {
    var success = false;
    if (data) {
      var usersData = $.xml2json(data);
      if (
        usersData &&
        usersData["response_status"] &&
        usersData["response_status"] == "OK"
      ) {
        success = true;
      }
    }
    if (!success) {
      crushFTP.UI.growl("Failure", "Admin action " + crushFTP.methods.htmlEncode(action), true, true);
    } else {
      var msg = " Stats reset completed..";
      if (action == "allStats") msg = "All" + msg;
      else if (action == "loginStats") msg = "Login" + msg;
      else if (action == "transferStats")
        msg = "Transfer : Server Bytes (in, out)" + msg;
      else if (action == "uploadDownloadStats") msg = "Upload/Download" + msg;
      crushFTP.UI.growl("Success", crushFTP.methods.htmlEncode(msg), false, 2000);
    }
  });
};

panelDashboard.formatDataFlowData = function (data) {
  var _lat = [
    -0.59228,
    35.66394,
    -15.87137,
    71.64489,
    29.36460
  ];

  var _lng = [
    -51.42247,
    -21.01011,
    12.59518,
    -12.22438,
    -49.66612
  ];

  function getRandomLatLong() {
      var ind = Math.floor(Math.random() * 6);
      return {lat: _lat[ind], lng: _lng[ind]};
  }
  var ignoreKeys = ["server_lon", "server_lat", "type", "items"];
  if (data) {
    var plots = {};
    var links = {};
    var serverLat = data.server_lat;
    var serverLong = data.server_lon;
    plots.Server = {
      latitude: serverLat,
      longitude: serverLong,
      size: 6,
      text: { content: "Server" },
      toFront: true,
    };
    data.items = {};
    /*var ltlng = getRandomLatLong();
    data = {
      "server_lon": "0",
      "HTTPS": {
        "HTTPS_subitem": [
          {
            "user_protocol": "HTTPS",
            "the_file_size": "67108864",
            "user_name": "vipul",
            "lon": "0",
            "the_file_start": "1620822292151",
            "now": "1620822319139",
            "modified": "1618936055749",
            "lat": "0",
            "direction": "incoming",
            "current_loc": "2097152",
            "user_ip": "127.0.0.1",
            "ip": "127.0.0.1",
            "the_file_speed": "251",
            "t": "1620822320890",
            "size": "67108864",
            "name": "MB64.txt",
            "transfer_type": "user",
            "type": "properties"
          },
          {
            "current_loc": "0",
            "user_ip": "127.0.0.1",
            "user_protocol": "HTTPS",
            "the_file_size": "134217728",
            "user_name": "vipul",
            "ip": "127.0.0.1",
            "lon": "0",
            "the_file_speed": "0",
            "the_file_start": "1620822298679",
            "t": "1620822320890",
            "size": "134217728",
            "name": "MB128.txt",
            "modified": "1618936055749",
            "transfer_type": "user",
            "lat": "0",
            "direction": "incoming",
            "type": "properties"
          }
        ],
        "type": "vector"
      },
      "FTP": {
        "FTP_subitem": [
          {
            "user_protocol": "FTP",
            "the_file_size": "67108864",
            "user_name": "vipul",
            "lon": ltlng.lng,
            "the_file_start": "1620822292151",
            "now": "1620822319139",
            "modified": "1618936055749",
            "lat": ltlng.lat,
            "direction": "incoming",
            "current_loc": "2097152",
            "user_ip": "127.0.0.1",
            "ip": "127.0.0.1",
            "the_file_speed": "251",
            "t": "1620822320890",
            "size": "67108864",
            "name": "MB64.txt",
            "transfer_type": "user",
            "type": "properties"
          },
          {
            "current_loc": "0",
            "user_ip": "127.0.0.1",
            "user_protocol": "FTP",
            "the_file_size": "134217728",
            "user_name": "vipul",
            "ip": "127.0.0.1",
            "lon": ltlng.lng,
            "the_file_speed": "0",
            "the_file_start": "1620822298679",
            "t": "1620822320890",
            "size": "134217728",
            "name": "MB128.txt",
            "modified": "1618936055749",
            "transfer_type": "user",
            "lat": ltlng.lat,
            "direction": "incoming",
            "type": "properties"
          }
        ],
        "type": "vector"
      },
      "FTP": {
        "FTP_subitem": [
          {
            "user_protocol": "FTP",
            "the_file_size": "67108864",
            "user_name": "vipul",
            "lon": ltlng.lng,
            "the_file_start": "1620822292151",
            "now": "1620822319139",
            "modified": "1618936055749",
            "lat": ltlng.lat,
            "direction": "incoming",
            "current_loc": "2097152",
            "user_ip": "127.0.0.1",
            "ip": "127.0.0.1",
            "the_file_speed": "251",
            "t": "1620822320890",
            "size": "67108864",
            "name": "MB64.txt",
            "transfer_type": "user",
            "type": "properties"
          },
          {
            "current_loc": "0",
            "user_ip": "127.0.0.1",
            "user_protocol": "FTP",
            "the_file_size": "134217728",
            "user_name": "vipul",
            "ip": "127.0.0.1",
            "lon": ltlng.lng,
            "the_file_speed": "0",
            "the_file_start": "1620822298679",
            "t": "1620822320890",
            "size": "134217728",
            "name": "MB128.txt",
            "modified": "1618936055749",
            "transfer_type": "user",
            "lat": ltlng.lat,
            "direction": "incoming",
            "type": "properties"
          }
        ],
        "type": "vector"
      },
      "SFTP": {
        "SFTP_subitem": [
          {
            "user_protocol": "SFTP",
            "the_file_size": "67108864",
            "user_name": "vipul",
            "lon": ltlng.lng,
            "the_file_start": "1620822292151",
            "now": "1620822319139",
            "modified": "1618936055749",
            "lat": ltlng.lat,
            "direction": "incoming",
            "current_loc": "2097152",
            "user_ip": "127.0.0.1",
            "ip": "127.0.0.1",
            "the_file_speed": "251",
            "t": "1620822320890",
            "size": "67108864",
            "name": "MB64.txt",
            "transfer_type": "user",
            "type": "properties"
          },
          {
            "current_loc": "0",
            "user_ip": "127.0.0.1",
            "user_protocol": "SFTP",
            "the_file_size": "134217728",
            "user_name": "vipul",
            "ip": "127.0.0.1",
            "lon": ltlng.lng,
            "the_file_speed": "0",
            "the_file_start": "1620822298679",
            "t": "1620822320890",
            "size": "134217728",
            "name": "MB128.txt",
            "modified": "1618936055749",
            "transfer_type": "user",
            "lat": ltlng.lat,
            "direction": "incoming",
            "type": "properties"
          }
        ],
        "type": "vector"
      },
      "server_lat": "0",
      "type": "properties"
    }
    */
    // data.items = {};
    for (var key in data) {
      var latlonKeys = {};
      if (ignoreKeys.indexOf(key) < 0) {
        crushFTP.methods.rebuildSubItems(data[key], key);
        data.items[key] = data[key][key + "_subitem"];
        delete data[key];
        var curItems = data.items[key];
        for (var i = 0; i < curItems.length; i++) {
          var curItem = curItems[i];
          var user_protocol = curItem.user_protocol || key;
          var user_name = curItem.user_name || "";
          var transfer_type = curItem.transfer_type || "";
          var name = curItem.name || "";
          var speed = curItem.the_file_speed || 0;
          speed = speed * 1024;
          var size = curItem.the_file_size || 0;
          var current_loc = curItem.current_loc || 0;
          var direction = curItem.direction || "";
          var curLat = curItem.lat;
          var curLong = curItem.lon;

          if(curLat == serverLat && curLong == serverLong){
            plots.Server = {};
            user_protocol = "Server";
          }

          speed = crushFTP.methods.formatBytes(speed) + "/s";
          size = crushFTP.methods.formatBytes(size);
          current_loc = crushFTP.methods.formatBytes(current_loc);
          var label =
            direction == "outgoing"
              ? "<strong>Downloading</strong>"
              : "<strong>Uploading</strong>";

          var pfix = "";
          if (latlonKeys[curLat + "-" + curLong]) {
            latlonKeys[curLat + "-" + curLong] += 1;
            pfix = " (" + latlonKeys[curLat + "-" + curLong] + ")";
          } else latlonKeys[curLat + "-" + curLong] = 1;

          if (plots[curLat + "-" + curLong]) {
            plots[curLat + "-" + curLong].tooltip.content =
              plots[curLat + "-" + curLong].tooltip.content +
              "<br>" +
              "" +
              label +
              " " +
              user_protocol +
              " <small>" +
              name +
              "</small> User:" +
              user_name +
              " Speed:" +
              speed;
            if(user_protocol !== "Server")
              plots[curLat + "-" + curLong].text.content = pfix ? "Transfers " + pfix : "" + user_protocol + pfix;
            else
              plots[curLat + "-" + curLong].text.content = user_protocol + pfix;
          } else {
            plots[curLat + "-" + curLong] = {
              latitude: curLat,
              longitude: curLong,
              tooltip: {
                content:
                  "" +
                  label +
                  " " +
                  user_protocol +
                  " <small>" +
                  name +
                  "</small> User:" +
                  user_name +
                  " Speed:" +
                  speed,
              },
              text: { content: pfix ? "" + pfix : user_protocol},
            };
          }
          if (links["link" + curLat + "-" + curLong]) {
            links["link" + curLat + "-" + curLong].tooltip.content =
              links["link" + curLat + "-" + curLong].tooltip.content +
              "<br>" +
              "" +
              label +
              " " +
              user_protocol +
              " <small>" +
              name +
              "</small> User:" +
              user_name +
              " Speed:" +
              speed;
            var clr = "outgoing" ? "#eb7d52" : "#19bf50";
            if (links["link" + curLat + "-" + curLong].attrs.stroke != clr) {
              links["link" + curLat + "-" + curLong].attrs.stroke = "#276db3";
            }
          } else {
            links["link" + curLat + "-" + curLong] = {
              between: [
                { latitude: serverLat, longitude: serverLong },
                { latitude: curLat, longitude: curLong },
              ],
              attrs: {
                "stroke-width": 2,
                stroke: direction === "outgoing" ? "#eb7d52" : "#19bf50",
              },
              tooltip: {
                content:
                  "" +
                  label +
                  " " +
                  user_protocol +
                  " <small>" +
                  name +
                  "</small> User:" +
                  user_name +
                  " Speed:" +
                  speed,
              },
            };
          }
        }
      }
    }
  }
  var deletedPlots = [];
  var deletedLinks = [];
  if (panelDashboard.currentFlowData) {
    var _plots = panelDashboard.currentFlowData.plots;
    var _links = panelDashboard.currentFlowData.links;
    for (var key in _plots) {
      if (typeof plots[key] === "undefined") deletedPlots.push(key);
    }
    for (var key in _links) {
      if (typeof links[key] === "undefined") {
        deletedLinks.push(key);
        panelDashboard.dataFlowMap.find("path[data-id='" + key + "']").remove();
      }
    }
  }
  data.plots = plots;
  data.links = links;
  delete data.type;
  panelDashboard.currentFlowData = $.extend(true, {}, data);

  data.deletedPlots = deletedPlots;
  data.deletedLinks = deletedLinks;

  return data;
};

panelDashboard.refreshDataFlow = function (cb) {
  crushFTP.data.serverRequest(
    {
      command: "getDataFlowItems",
    },
    function (data) {
      if (cb) {
        cb();
      }
      var xml = $(data).find("result_value:first");
      var status = $(data).find("response_status").text() || $(data).find("response").text();
      if (status.toLowerCase() === "ok") {
        var items = $.xml2json(data);
        if(items && items.response_data && items.response_data.result_value)
        {
          var data = panelDashboard.formatDataFlowData(items.response_data.result_value);
          if (data) {
            panelDashboard.renderDataFlow(data);
          }
        }
      } else {
        crushFTP.UI.growl("Failure: getDataFlowItems ", crushFTP.methods.htmlEncode(status), true, 3000);
      }
    }
  );
};

panelDashboard.renderDataFlow = function (data) {
  var prefs = crushFTP.storage("GUIXMLPrefs");
  var serverLat = data.server_lat;
  if(!serverLat || serverLat + "" == "null")
    serverLat = 0;
  var serverLong = data.server_lon;
  if(!serverLong || serverLong + "" == "null")
    serverLong = 0;
  if(!prefs.geoip_access_key || (!serverLong && !serverLat)){
    $("#no-geo-access-key").show();
    return false;
  }
  else{
    $("#geo-enabled").show();
  }
  if (panelDashboard.dataFlowMap) {
    panelDashboard.dataFlowMap.trigger("update", [
      {
        deletePlotKeys: "all",
        deleteLinkKeys: data.deletedLinks,
        newPlots: data.plots,
        newLinks: data.links,
        animDuration: 1000,
      },
    ]);
    return;
  }
  panelDashboard.dataFlowMap = $("#mapcontainer").mapael({
    map: {
      name: "world_countries",
      zoom: {
        enabled: true,
        maxLevel: 10,
        mousewheel: false
      },
      defaultArea: {
        attrs: {
          fill: "#f4f4e8",
          stroke: "#4a4747",
          "stroke-width": 0.3,
        },
        attrsHover: {
          animDuration: 0,
        },
      },
      defaultPlot: {
        size: 3,
        text: {
          attrs: {
            fill: "#000000",
            "font-weight": "normal",
            "font-size": "8px",
            "font-family": "Nunito, Tahoma, Verdana, Arial, sans-serif",
          },
          attrsHover: {
            fill: "#000000",
            "font-weight": "bold",
            "font-size": "8px",
            "font-family": "Nunito, Tahoma, Verdana, Arial, sans-serif",
          },
        },
      },
      defaultLink: {
        factor: 0.2,
        attrsHover: {
          stroke: "#a4e100",
          cursor: "pointer",
        },
        eventHandlers: {
          click: function (e, id, mapElem, textElem) {
            // alert(id)
            console.log(id);
          },
        },
      },
    },
    plots: data.plots,
    links: data.links,
  });
};

panelDashboard.renderGraph = function(name, data, options, type){
    var theme = localStorage["theme"] || "light";
    var fontColor = theme == "light" ? '#67757c' : '#bfc2c5';
    var oldData = panelDashboard[name + '_data'];
    var curData = data.datasets[0].data;
    options = options || {};
    var defaultOptions = {
        animation: {
            duration: 0
        },
        responsive: false,
        title: {
            display: false
        },
        legend: {
            fontColor: fontColor,
            usePointStyle: true,
            position: "bottom",
            labels:{
                fontFamily: "Nunito",
                fontSize: 13,
                boxWidth: 10,
                fontColor: fontColor
            }
        }
    };
    defaultOptions = $.extend(true, defaultOptions, options);
    if(type == "bar"){
        defaultOptions.scales = {
            yAxes: [{
                display: false,
                gridLines: {
                    drawBorder: true,
                    display: false
                }
            }],
            xAxes: [{
                ticks:{
                    fontColor: fontColor
                }
            }]
        };
    }
    if(!_.isEqual(oldData, curData))
    {
        var config = {
            type: type,
            data: data,
            options: defaultOptions
        };
        panelDashboard[name + '_data'] = curData;
        var ctx = panelDashboard._panel.find("#" + name)[0].getContext("2d");
        if(!panelDashboard[name])
            panelDashboard[name] = new Chart(ctx, config);
        else{
            panelDashboard[name].data = config.data;
            panelDashboard[name].update();
        }
        if(options.legend.dynamicLegends){
            var legendPanel = panelDashboard._panel.find("#" + name + "Legends");
            legendPanel.html(panelDashboard[name].generateLegend().replace(/\$n/g, '<br>'))
        }
        if(options.legend.dynamicTheme){
            $(document).on("theme-change", function(){
                var theme = localStorage["theme"] || "light";
                var fontColor = theme == "light" ? '#67757c' : '#bfc2c5';
                defaultOptions.legend.fontColor = fontColor;
                defaultOptions.legend.labels.fontColor = fontColor;
                if(type === "bar"){
                    defaultOptions.scales.xAxes[0].ticks.fontColor = fontColor;
                }
                panelDashboard[name].options = defaultOptions;
                panelDashboard[name].update();
            })
        }
    }
}

panelDashboard.renderGraphFromData = function(options){
    var name = options.name;
    var data = options.data;
    var items = options.items;
    var colors = options.colors;
    var labels = options.labels;
    var dataType = options.dataType;
    var full = typeof options.full != "undefined" ? options.full : false;
    var type = options.type;
    var convertKB = options.convertKB;
    var formatBytes = options.formatBytes;
    var isSpeed = options.isSpeed;
    var dynamicLegends = options.dynamicLegends;
    var dynamicTheme = options.dynamicTheme;

    var opt1, opt2, lopt1, lopt2;
    if(dataType == "int"){
        opt1 = (parseInt(data[items[0]]) || 0);
        opt2 = (parseInt(data[items[1]]) || 0);

    }
    else if(dataType == "float"){
        opt1 = parseFloat(data[items[0]]) || 0;
        opt2 = parseFloat(data[items[1]]) || 0;
    }
    else{
        opt1 = (data[items[0]]) || 0;
        opt2 = (data[items[1]]) || 0;
    }

    if(convertKB){
        opt1 = opt1 * 1024;
        opt2 = opt2 * 1024;
    }

    if(formatBytes){
        lopt1 = crushFTP.methods.formatBytes(opt1).replace(/ /g, '');
        lopt2 = crushFTP.methods.formatBytes(opt2).replace(/ /g, '');
    }

    labels[0] = labels[0].replace(/\$1/g, lopt1 || opt1);
    labels[1] = labels[1].replace(/\$2/g, lopt2 || opt2);
    var chartData = [opt1, opt2];

    var legend = {};

    if(!full)
        legend.position = 'right';

    if(dynamicLegends){
        legend.display = false;
        legend.dynamicLegends = true;
    }
    if(dynamicTheme){
        legend.dynamicTheme = true;
    }
    panelDashboard.renderGraph(name, {
        datasets: [{
            data: chartData,
            backgroundColor: colors || [
                window.chartColors.yellow,
                window.chartColors.blue
            ],
            label: ''
        }],
            labels: labels
        }, {
        legend: legend,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var index = tooltipItem.index;
                    var graphData = data.datasets[0].data;
                    var value = graphData[index];
                    if(formatBytes){
                        var val = (parseInt(value) || 0);
                        value = crushFTP.methods.formatBytes(val);
                        if(isSpeed)
                            value = value + "/sec";
                    }
                    return " " +value;
                }
            }
        }
    }, type || 'doughnut');
}

panelDashboard.bindData = function (items, xml, historic) {
  if (!items) return false;
  if (
    $(xml).find("jce_installed").length == 0 ||
    $(xml).find("jce_installed").text() == "false"
  ) {
    if (!panelDashboard.JCEAlertShown) {
      panelDashboard.JCEAlertShown = true;
      crushFTP.UI.growl(
        "Message :",
        "Your server is limited to weak encryption due to Java policy files and bureaucracy limitations.  As a result, your server uses weak encryption that doesn't meet today's standards.  Click <a href='http://www.crushftp.com/crush9wiki/Wiki.jsp?page=JCEInstall' target='_blank'>here</a> to read more on how to resolve this issue :  <a href='http://www.crushftp.com/crush9wiki/Wiki.jsp?page=JCEInstall' target='_blank'>http://www.crushftp.com/crush9wiki/Wiki.jsp?page=JCEInstall</a><br><strong>Java Information :</strong> <br>" +
          $(xml)
            .find("java_info")
            .text()
            .replace("bin/java", "lib/security")
            .replace("bin\\java", "lib\\security") +
          ""
      );
      $("#growlContainer")
        .unbind("click")
        .find("div")
        .unbind("click")
        .find(".ui-notify-close")
        .click(function () {
          $("#growlContainer").find("div").fadeOut(300);
          return false;
        });
    }
  }
  var lowMemoryText = $(xml).find("low_memory").text();
  if (lowMemoryText) {
    if (!panelDashboard.LowMemoryAlertShown) {
      panelDashboard.LowMemoryAlertShown = true;
      crushFTP.UI.growl("Message :", crushFTP.methods.htmlEncode(lowMemoryText), true);
    }
  }
  if ($(xml).find("recent_drives").length > 0) {
    var drives = [];
    $(xml)
      .find("recent_drives")
      .find("item")
      .each(function () {
        drives.push({ name: $(this).attr("name"), val: $(this).text() });
      });
    drives.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    var drivespaceAlerts = $(
      "#drivespaceAlerts",
      panelDashboard._panel
    ).empty();
    if (drives.length > 0) {
      for (var i = 0; i < drives.length; i++) {
        var curData = drives[i];
        drivespaceAlerts.append(
          '<li class="ui-widget-content bottomborder nobg" style="padding:3px;"><div class="ui-priority-primary wrapword" style="margin:0px 5px 0px 0px;float:left;max-width:190px;font-size:11px;">' +
            curData.name +
            '</div><div style="float:right;">' +
            curData.val +
            '</div><div style="clear:both;"></div></li>'
        );
      }
    } else
      drivespaceAlerts.append(
        '<li style="text-align:center;">Nothing to show</li>'
      );
  } else {
    var drivespaceAlerts = $(
      "#drivespaceAlerts",
      panelDashboard._panel
    ).empty();
    drivespaceAlerts.append(
      '<li style="text-align:center;">Nothing to show</li>'
    );
  }
  if ($(xml).find("recent_hammering").length > 0) {
    var logins = [];
    $(xml)
      .find("recent_hammering")
      .find("*")
      .each(function () {
        logins.push({ name: this.nodeName, val: $(this).text() });
      });
    logins.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    var hammeringAlerts = $("#hammeringAlerts", panelDashboard._panel).empty();
    if (logins.length > 0) {
      for (var i = 0; i < logins.length; i++) {
        var curData = logins[i];
        hammeringAlerts.append(
          '<li class="ui-widget-content bottomborder nobg" style="padding:3px;"><div class="ui-priority-primary wrapword" style="margin:0px 5px 0px 0px;float:left;max-width:80px;font-size:12px;">' +
            curData.name +
            '</div><div style="float:right;">' +
            curData.val +
            '</div><div style="clear:both;"></div></li>'
        );
      }
    } else
      hammeringAlerts.append(
        '<li style="text-align:center;">Nothing to show</li>'
      );
  } else {
    var hammeringAlerts = $("#hammeringAlerts", panelDashboard._panel).empty();
    hammeringAlerts.append(
      '<li style="text-align:center;">Nothing to show</li>'
    );
  }
  if ($(xml).find("last_logins_subitem").length > 0) {
    var logins = [];
    $(xml)
      .find("last_logins_subitem")
      .each(function () {
        logins.push({
          date: $(this).find("login_date_formatted").text(),
          user_name: $(this).find("user_name").text(),
          ip: $(this).find("ip").text(),
          dns: $(this).find("dns").text(),
        });
      });
    // if($("#lastLogins", panelDashboard._panel).find(".listItem").length == 0){
    var lastLogins = $("#lastLogins", panelDashboard._panel).empty();
    if (logins.length > 0) {
      for (var i = 0; i < logins.length; i++) {
        var curData = logins[i];
        lastLogins.prepend(
          '<div class="listItem"><span class="name">' +
            curData.user_name +
            '</span>  <span class="date">' +
            curData.date +
            ' </span><div><span class="ip"> ' +
            curData.ip +
            '</span></div><div><span class="dns"> ' +
            curData.dns +
            '</span></div><div style="clear:both;"></div></div>'
        );
      }
    } else lastLogins.append("Nothing to show");}
  // } else {
  //   var lastLogins = $("#lastLogins", panelDashboard._panel).empty();
  //   lastLogins.append("Nothing to show");
  // }
  items.connected_users = 0;
  if ($(xml).find("connected_users").length > 0) {
    $(xml)
      .find("connected_users")
      .each(function () {
        var curUser = $(this).text();
        if (curUser) {
          curUser = parseInt(curUser);
          if (!isNaN(curUser)) {
            items.connected_users += curUser;
          }
        }
      });
  }
  items.connected_users = items.connected_users.toString();
  var max = parseInt(items.ram_max);
  var free = parseInt(items.ram_free);
  var used = max - free;
  var max_f = crushFTP.methods.formatBytes(max);
  var free_f = crushFTP.methods.formatBytes(free);
  var used_f = crushFTP.methods.formatBytes(used);

  items.ram_max_f = max_f;
  items.ram_free_f = free_f;
  items.ram_used_f = used_f;
  items.ram_used = used;
  items.ram_free = free;

  adminPanel.data.bindValuesFromJson(panelDashboard._panel, items, "_id");
  if ($(document).data("app_enterprise")) {
    if (!historic) {
      var serverInfo = crushFTP.storage("serverInfo");
      serverInfo.connected_users = items.connected_users;
      adminPanel.data.bindValuesFromJson(
        panelDashboard._panel,
        serverInfo,
        "_id"
      );
      $(".replication-panel", panelDashboard._panel).show();
    }
  } else {
    $(".replication-panel", panelDashboard._panel).hide();
  }
  panelDashboard._panel.find(".formatData, .hideZero").each(function () {
    var val = $(this).text();
    if ($(this).hasClass("hideZero")) {
      val = adminPanel.methods.hideZero(val);
      $(this).text(val);
    }
    if ($(this).hasClass("formatData")) {
      if (val && crushFTP.methods.isNumeric(val)) {
        if ($(this).hasClass("inKBs")) {
          val = parseFloat(val) * 1024;
        }
        $(this).text(crushFTP.methods.formatBytes(val));
        if ($(this).hasClass("speedInSecond")) {
          $(this).text($(this).text() + " /sec");
        }
      }
    }
  });

  /* Server Status */
    var server_list = items.server_list;
    crushFTP.methods.rebuildSubItems(server_list, "server_list");
    if (server_list && server_list.server_list_subitem) {
        server_list = server_list.server_list_subitem;
        var up = 0,
          down = 0;
        for (var i = 0; i < server_list.length; i++) {
          var curItem = server_list[i];
          if (curItem.running == "true") up++;
          else down++;
        }
        panelDashboard.renderGraphFromData({
            name:'liveServersGraph',
            data: {up: up, down: down},
            items: ['up','down'],
            colors:[
                window.chartColors.green,
                window.chartColors.red
            ],
            dynamicLegends: true,
            labels:["Live ($1)", "Stopped ($2)"],
            full:true
        });
    }

    /* Session information */
    if(items.concurrent_users == "-1"){
      panelDashboard.renderGraphFromData({
          name:'sessionGraph',
          data:items,
          items:['connected_users', 0],
          colors:[
              window.chartColors.blue
          ],
          dynamicLegends: true,
          labels:["Sockets ($1)", ""]
      });
    }
    else{
      panelDashboard.renderGraphFromData({
          name:'sessionGraph',
          data:items,
          items:['concurrent_users','connected_users'],
          colors:[
              window.chartColors.yellow,
              window.chartColors.blue
          ],
          dynamicLegends: true,
          labels:["Concurrent ($1)", "Sockets ($2)"]
      });
    }

    /* Login information */
    panelDashboard.renderGraphFromData({
        name:'loginGraph',
        data:items,
        items:['successful_logins','failed_logins'],
        colors:[
            window.chartColors.green,
            window.chartColors.red
        ],
        dynamicLegends: true,
        labels:["Successful ($1)", "Failed ($2)"]
    });

    /* Download/Upload */
    panelDashboard.renderGraphFromData({
        name:'downloadUploadGraph',
        data:items,
        items:['downloaded_files','uploaded_files'],
        colors:[
            window.chartColors.orange,
            window.chartColors.purple
        ],
        dynamicLegends: true,
        labels:["Downloads ($1)", "Uploads ($2)"]
    });

    /* Bytes transferred */
    panelDashboard.renderGraphFromData({
        name:'byteTransferredGraph',
        data:items,
        items:['total_server_bytes_sent','total_server_bytes_received'],
        colors:[
            window.chartColors.blue,
            window.chartColors.grey
        ],
        dynamicLegends: true,
        labels:["Sent ($1)", "Recd ($2)"],
        dataType: 'int',
        formatBytes: true
    });

    // /* Speed information */
    // panelDashboard.renderGraphFromData({
    //     name:'speedInfoGraph',
    //     data:items,
    //     items:['current_download_speed','current_upload_speed'],
    //     colors:[
    //         window.chartColors.forest,
    //         window.chartColors.blue
    //     ],
    //     labels:["Outgoing ($1)", "Incoming ($2)"],
    //     dataType: 'int',
    //     formatBytes: true,
    //     isSpeed: true,
    //     convertKB: true,
    //     dynamicLegends: true,
    //     dynamicTheme: true,
    //     type: 'bar'
    // });

  /* Job schedules */
  crushFTP.data.serverRequest(
    {
      command: "getJobsSummaryDashboard",
    },
    function (data) {
      var jobSummary = false;
      if (data) {
        if (
          data.getElementsByTagName &&
          data.getElementsByTagName("response_data") &&
          data.getElementsByTagName("response_data").length > 0
        ) {
          data = data.getElementsByTagName("response_data")[0];
          jobSummary = $.xml2json(data);
          var running = 0;
          if (
            jobSummary &&
            jobSummary.running_tasks &&
            jobSummary.running_tasks.running_tasks_subitem
          ) {
            crushFTP.methods.rebuildSubItems(
              jobSummary.running_tasks,
              "running_tasks"
            );
            running = jobSummary.running_tasks.running_tasks_subitem.length;
          }


          if (!panelDashboard.totalJobsFetched) {
            crushFTP.data.serverRequest(
              {
                command: "getJob",
                schedule_info: true,
              },
              function (data) {
                var jobSummary = false;
                if (data) {
                  if (
                    data.getElementsByTagName &&
                    data.getElementsByTagName("response_data") &&
                    data.getElementsByTagName("response_data").length > 0
                  ) {
                    data = data.getElementsByTagName("response_data")[0];
                    jobSummary = $.xml2json(data);
                    var total = 0;
                    if (
                      jobSummary &&
                      jobSummary.result_value &&
                      jobSummary.result_value.result_value_subitem
                    ) {
                      crushFTP.methods.rebuildSubItems(
                        jobSummary.result_value,
                        "result_value"
                      );
                      total = jobSummary.result_value.result_value_subitem.length;
                    }
                    var dataset = {
                        running: running,
                        stopped: total - running
                    }
                    panelDashboard.renderGraphFromData({
                        name:'jobSchedulesGraph',
                        data: dataset,
                        items:['running','stopped'],
                        colors:[
                            window.chartColors.green,
                            window.chartColors.red
                        ],
                        dynamicLegends: true,
                        full: true,
                        labels:["Running ($1)", "Stopped ($2)"],
                        type: 'doughnut'
                    });
                    panelDashboard.totalJobsFetched = true;
                  }
                }
              }
            );
          }
        }
      }
    }
  );

  /* Process Threads */
    panelDashboard.renderGraphFromData({
        name:'processThreadsGraph',
        data:items,
        items:['thread_pool_available','thread_pool_busy'],
        colors:[
            window.chartColors.blue,
            window.chartColors.yellow
        ],
        dynamicLegends: true,
        labels:["Free ($1)", "Busy ($2)"]
    });

   /* Memory Info */
   panelDashboard.renderGraphFromData({
        name:'memoryGraph',
        data:items,
        items:['ram_free','ram_used'],
        colors:[
            window.chartColors.blue,
            window.chartColors.yellow
        ],
        dataType: 'float',
        formatBytes: true,
        dynamicLegends: true,
        labels:["Free ($1)", "Used ($2)"]
    });

  crushFTP.data.serverRequest(
      {
        command: "getDashboardHistory",
      },
      function (data) {
        if (
          data &&
          data.getElementsByTagName &&
          data.getElementsByTagName("response_data") &&
          data.getElementsByTagName("response_data").length > 0
        ) {
          data = data.getElementsByTagName("response_data")[0];
          var dashboardHistory = $.xml2json(data);
          if (dashboardHistory && dashboardHistory.result_value) {
            var result_value = dashboardHistory.result_value;
            var lastSnapshotTime = $("#lastSnapshotTime");
            lastSnapshotTime.attr(
              "date",
              result_value.history_date + " " + result_value.history_time
            );
            var dateTime = moment(
              result_value.history_date + "" + result_value.history_time,
              "YYMMDDHHmm"
            );
            panelDashboard.lastSnapshotDate = dateTime;
            lastSnapshotTime.text(dateTime.format("YYYY-MM-DD hh:mm A"));
            $("#changeSnapshotTime").datetimepicker(
              "option",
              "minDate",
              dateTime.toDate()
            );
          }
        }
      }
    );
  var now = new Date();
  $("#lastDashboardTimestamp", panelDashboard._panel).text(
    dateFormat(now, "mediumTime")
  );
  $(".dashboardPanelLink", panelDashboard._panel)
    .unbind()
    .click(function () {
      if ($(this).hasClass("serverStatus")) {
        $("#configOptionTabs").tabs({active: 1});
        $("#statusPanelTabs").tabs({active: 0});
      } else if ($(this).hasClass("sessionInformation")) {
        $("#configOptionTabs").tabs({active: 1});
        $("#statusPanelTabs").tabs({active: 1});
      } else if ($(this).hasClass("serverInformation")) {
        $("#configOptionTabs").tabs({active: 3});
      } else if ($(this).hasClass("userInformation")) {
        $("#configOptionTabs").tabs({active: 1});
        $("#statusPanelTabs").tabs({active: 1});
      } else if ($(this).hasClass("jobsInformation")) {
        return true;
      }
      return false;
    });
};
