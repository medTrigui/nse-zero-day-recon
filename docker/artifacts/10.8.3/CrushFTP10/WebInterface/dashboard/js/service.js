/*All API calls*/
crushDashboard.service = {
    getUserName: function(callBack) {
        var username = "anonymous";
        $.when(crushDashboard.utils.data.ajax({
            command: "getUsername"
        })).done(function(msg) {
            var responseText = msg;
            try {
                var response = $(msg).find("response").text();
                if (response == "success") {
                    username = $(msg).find("username").text();
                }
                if (username == "anonymous" || username == "") {
                    callBack(false);
                    return false;
                }
            } catch (ex) {
                if (callBack) {
                    callBack(false);
                    return false;
                }
            }
            if (callBack) {
                callBack(true, username);
            }
        }).fail(function(err) {

        });
    },
    adminAction: function(action, index, callback) {
        $.when(crushDashboard.utils.data.ajax({
            command: "adminAction",
            action : action,
            index : index
        })).done(function(msg) {
            if (callback) {
                callback(msg);
            }
        }).fail(function(err) {
            if (callback) {
                callback();
            }
        });
    },
    fetchServerDetails: function(callback) {
        $.when(crushDashboard.utils.data.ajax({
            command: "getDashboardItems"
        })).done(function(data) {
            var servers = $(data).find("server_list_subitem");
            var serversData = {};
            servers.each(function(index) {
                var curServer = $(this);
                var type = curServer.find("serverType").text();
                var ip = curServer.find("ip").text();
                var name = curServer.find("server_item_name").text() || ip;
                var users = curServer.find("connected_users").text();
                var connections = curServer.find("connection_number").text();
                var running = curServer.find("running").text() == "true";
                var port = curServer.find("port").text();
                serversData[type] = serversData[type] || [];
                serversData[type].push({
                    name: name,
                    users: users,
                    connections : connections,
                    running: running,
                    ip: ip,
                    port: port,
                    rowData : curServer,
                    itemIndex : index
                });
            });
            if (callback)
                callback(serversData);
        }).fail(function(err) {

        });
    },
    diagnoseServer : function(data, callback){
        $.when(crushDashboard.utils.data.ajax(data, {}, "http://crushftp.com/d.jsp")).done(function(msg) {
            if (callback) {
                callback(msg);
            }
        }).fail(function(err) {
            if (callback) {
                callback();
            }
        });
    }
};