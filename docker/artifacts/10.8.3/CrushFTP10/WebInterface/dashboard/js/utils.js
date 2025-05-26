/*Common Utilities*/

crushDashboard.utils = {
    /*
    Usage: Position.ellipse(n, rx, ry, so, wh, idd, cls, cw);

    where n = number of divs,
          rx = radius along X-axis,
          ry = radius along Y-axis,
          so = startOffset,
          cw = clockwise(true/false)
    */
    ellipsify: function(elems, rx, so, cw) {
        if (!elems || elems.length == 0)
            return;
        var ss = document.styleSheets;
        so = so || 0;
        var parentId = elems.filter(":first").parent().attr("id");
        this.addedCSSRules = this.addedCSSRules || [];
        var ry = rx;
        if (this.addedCSSRules.indexOf(parentId) <= 0) {
            var wh = $(elems.get(0)).width();
            this.addedCSSRules.push(parentId);
            var cls = elems.get(0).className.split(" ").join(".");
            ss[0].insertRule('#' + parentId + ' { position: absolute; left: 50%; top: 50%; transform: translate(-50%, 0%); border-radius: 50%;width: ' + String((rx * 2) + wh) + 'px; height: ' + String((ry * 2) + wh) + 'px; }', 1);
            console.log('#' + parentId + ' { position: absolute; left: 50%; top: 50%; transform: translate(-50%, 0%); border-radius: 50%;width: ' + String((rx * 2) + wh) + 'px; height: ' + String((ry * 2) + wh) + 'px; }');
            ss[0].insertRule('#' + parentId + ' .' + cls + '{ position: absolute;border-radius: 50%; transition: transform 0.2s ease; width: ' + wh + 'px; height: ' + wh + 'px; line-height: ' + wh + 'px;}', 1);
            ss[0].insertRule('#' + parentId + ' .' + cls + ':hover { cursor: pointer; }', 1); //transform: scale(1.2);
        }
        var n = elems.length;
        for (var i = 0; i < n; i++) {
            var c = elems.get(i);
            $(c).attr("_index", i);
            c.className = cls;
            c.style.top = String(ry + -ry * Math.cos((360 / n / 180) * (i + so) * Math.PI)) + 'px';
            c.style.left = String(rx + rx * (cw ? Math.sin((360 / n / 180) * (i + so) * Math.PI) : -Math.sin((360 / n / 180) * (i + so) * Math.PI))) + 'px';
        }
    },
    findNewPoint: function(index, total, distance, offset, reverse) {
        distance = distance || 200;
        offset = offset || 0;
        var result = {};
        result.x = (Math.sin((360 / total / 180) * (index + offset) * Math.PI) * distance);
        result.y = (Math.cos((360 / total / 180) * (index + offset) * Math.PI) * distance);
        if (reverse) {
            result.x = -result.x;
            result.y = -result.y;
        }
        return result;
    },
    drawJsPlumbLine: function(params) {
        try {
            return jsPlumb.connect(params);
        } catch (ex) {
            setTimeout(function() {
                if (params.source.length > 0 && params.target.length > 0)
                    jsPlumb.connect(params)
            }, 100);
        }
        return false;
    },
    drawline: function(div1, div2, _color, dashstyle, label, canvas) {
        var that = this;
        canvas = canvas || $("#bubble-tree");
        if (div1.length == 0 || div2.length == 0) return;
        var sourceID = div1.attr("id");
        var targetID = div2.attr("id");
        if (sourceID == targetID) {
            return false;
        }
        var color = "#3299FF";
        if (_color) {
            color = _color;
        }
        var arrowCommon = {
            foldback: 0.5,
            fillStyle: color,
            width: 15
        };
        var overlays = [
            ["Arrow", {
                location: 0.5
            }, arrowCommon]
        ];

        if (label) {
            overlays.push(["Label", {
                label: "" + label.toString(),
                id: "loop-label",
                cssClass: "loop-label"
            }]);
        }
        jsPlumb.Defaults.Container = canvas;
        var connection = that.drawJsPlumbLine({
            source: div1,
            target: div2,
            container: canvas,
            anchor: "Center",
            connector: ["StateMachine", {
                margin: 0,
                curviness: 10,
                proximityLimit: 200
            }],
            paintStyle: {
                lineWidth: 4,
                strokeStyle: color,
                dashstyle: dashstyle
            },
            endpoint: ["Blank", {
                radius: 0,
                color: "transparent"
            }],
            overlays: overlays
        });
        connection._sourceID = sourceID;
        connection._targetID = targetID;
        return connection;
    },
    animateConnection: function(connection, flag) {
        var curInterval = setInterval(function() {
            connection.removeOverlay("progressLabel");
            if (connection._isDeleted) {
                clearInterval(curInterval);
                return
            }
            // var arrowCommon = { foldback:0.5, fillStyle:color, width:15 };
            // connection.addOverlay([ "Label", { label: " <strong>Users :</strong> " + connection._timer.toString() + ", <br> <strong>Connections :</strong> 30", id:"progressLabel", cssClass: "progressLabel", location : 0.5 } ], [ "Arrow", { location:0.1 }, arrowCommon ]);
            // connection._timer++;
            // var color = flag == "failure" ? "red" : "green";
            // if(flag=="start")
            //     color = "#33b5e5";
            // if(!connection._altColor)
            // {
            //     connection.setPaintStyle({ lineWidth:4, strokeStyle: color, dashstyle: "2 3"});
            //     connection._altColor = true;
            // }
            // else
            // {
            //     connection.setPaintStyle({ lineWidth:4, strokeStyle: color, dashstyle:"4 3" });
            //     connection._altColor = false;
            // }
        }, 500);
        return curInterval;
    },
    formatBytes: function(bytes) {
        if ((bytes / 1024).toFixed(0) == 0) return bytes + " bytes";
        else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
        else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
        else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
        else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
    },
    formatTime: function(secs) {
        var remaining = "";
        if (!secs) return "";
        if (secs.indexOf(".") < 0)
            secs = secs + ".0";
        secs = secs.substring(0, secs.indexOf(".")) * 1;
        var mins = (secs / 60) + ".0";
        mins = mins.substring(0, mins.indexOf(".")) * 1;
        if (mins > 0) {
            secs -= (mins * 60);
            remaining = mins + " min, " + secs + " secs";
        } else {
            if (secs < 0) {
                remaining = "Calculating";
            } else {
                remaining = secs + " secs";
            }
        }
        return remaining;
    },
    getConfig: function(name, defaultVal) {
        if (!isEmbed)
            return defaultVal || true;
        return $(parent.document).find("#reportConfiguration").find(".reportConfig:visible").find("#" + name).is(":checked");
    },
    deparam: function(query) {
        var pairs, i, keyValuePair, key, value, map = {};
        // remove leading question mark if its there
        if (query.slice(0, 1) === '?') {
            query = query.slice(1);
        }
        if (query !== '') {
            pairs = query.split('&');
            for (i = 0; i < pairs.length; i += 1) {
                keyValuePair = pairs[i].split('=');
                key = decodeURIComponent(keyValuePair[0]);
                value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
                map[key] = value;
            }
        }
        return map;
    },
    getCrushAuth: function() {
        return $.cookie("currentAuth");
    },
    getFileExtension: function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1].toLowerCase();
    },
    getPerc: function(val, total) {
        if (total == 0)
            return 100;
        return Math.round((100 * val) / total);
    },
    data: {
        ajax: function(dataToSubmit, params, url) {
            url = url || crushFTP.ajaxCallURL;
            var obj = {
                type: crushFTP.defaultRequestType,
                url: url,
                data: dataToSubmit
            };
            var c2f = crushDashboard.utils.getCrushAuth();
            if (c2f)
                obj.data.c2f = c2f;
            if (params)
                $.extend(obj, params);
            return $.ajax(obj);
        },
        getValueFromJson: function(item, node) {
            if (item && item[node]) {
                return item[node];
            } else {
                return "";
            }
        }
    }
};