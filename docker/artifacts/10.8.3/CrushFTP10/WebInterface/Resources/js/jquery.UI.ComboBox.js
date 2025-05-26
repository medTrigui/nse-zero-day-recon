(function($) {
    $.widget("ui.combobox", {
        _create: function() {
            var self = this,
                width = this.element.attr("_width"),
                select = this.element.hide(),
                selected = select.children(":selected"),
                value = selected.val() ? selected.text() : "";
            var input = this.input = $("<input>");
            select.after(input);
            input.val(value);
            input.autocomplete({
                delay: 0,
                minLength: 0,
                source: function(request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(select.children("option").map(function() {
                        var text = $(this).text();
                        if (this.value && (!request.term || matcher.test(text)))
                            return {
                                label: text.replace(
                                    new RegExp(
                                        "(?![^&;]+;)(?!<[^<>]*)(" +
                                        $.ui.autocomplete.escapeRegex(request.term) +
                                        ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                    ), "<strong>$1</strong>"),
                                value: text,
                                option: this
                            };
                    }));
                },
                select: function(event, ui) {
                    ui.item.option.selected = true;
                    self._trigger("selected", event, {
                        item: ui.item.option
                    });
                    try {
                        var val = ui.item.value;
                        if (val) {
                            select.trigger("change.local");
                        }
                    } catch (ex) {}
                },
                change: function(event, ui) {
                    if (!ui.item) {
                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                            valid = false;
                        select.children("option").each(function() {
                            if ($(this).text().match(matcher)) {
                                this.selected = valid = true;
                                return false;
                            }
                        });
                        if ($(this).val() == "") {
                            $(this).val("/");
                        }
                        doSelection();
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                }
            });

            input.addClass("ui-corner-left ui-corner-top ui-corner-bottom ignoreBind").removeClass("ui-corner-all");

            input.keyup(function(evt) {
                var evt = (evt) ? evt : ((event) ? event : null);
                if (evt.keyCode == 13) {
                    doSelection();
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            });

            select.bind("change.combo", function() {
                var _selected = select.children(":selected");
                var _value = _selected.val() ? _selected.text() : "";
                input.val(_value);
            });

            select.bind("change.doselect", function() {
                doSelection();
            });

            var autoComplete = input.data("ui-autocomplete");
            var key = "ui-autocomplete-item";
			if(typeof(autoComplete) == "undefined")
			{
			    autoComplete = input.data("autocomplete");
				key = "item.autocomplete";
			}
            autoComplete._renderItem = function(ul, item) {
                ul.addClass("autocompleteListBox");
                return $("<li style='width:" + width + ";'></li>")
                    .data(key, item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };

            this.button = $("<button type='button'>&nbsp;</button>")
                .attr("tabIndex", -1)
                .attr("title", "Show All Items")
                .insertAfter(input)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-button-icon");
                if($(this.element).hasClass('browse-panel'))
                {
                    this.button.attr("style", "right: 20px;height: 20px;top: 2px !important;border: 0px;outline:none;position:relative;")
                }
                else{
                    this.button.attr("style", "right: 30px;height: 18px;top: 2px !important;border: 0px;outline:none;position:absolute;")
                }
                this.button.click(function() {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }

                    $(this).blur();
                    // pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                    input.focus();
                });

            function doSelection() {
                var curVal = input.val();
                $(".autocompleteListBox").hide();
                var valFound = false;
                select.find("option").each(function() {
                    if ($(this).text().toLowerCase() == curVal.toLowerCase()) {
                        $(this).attr("selected", "selected");
                        select.trigger("change.local");
                        valFound = true;
                        return false;
                    }
                });
                if (!valFound) {
                    if(select.attr('justEnter'))
                    {
                        select.val(curVal).trigger("change.local2");
                        return;
                    }
                    curVal = curVal.replace(/\\\\/g, "////");
                    curVal = curVal.replace(/\\/g, "/");
                    if (curVal.lastIndexOf("/") != curVal.length - 1) {
                        curVal = curVal + "/";
                    }
                    input.val(curVal);
                    if (select.find("option[value='" + escape(curVal) + "']").length == 0) {
                        select.empty();
                        select.append("<option value='/'>/</option>");
                        var pathToUse = curVal;
                        var isNwItem = curVal.indexOf("////") == 0;
                        if (isNwItem) {
                            pathToUse = curVal.replace("////", "");
                        } else if (curVal.indexOf("/") == 0) {
                            pathToUse = curVal.substr(1);
                        }
                        items = pathToUse.split("/");
                        var basePath = "";
                        for (var i = 0; i < items.length; i++) {
                            var curPath = items[i];
                            if (curPath && curPath.length > 0) {
                                if (i == 0) {
                                    if (isNwItem)
                                        basePath = "////" + curPath + "/";
                                    else
                                        basePath = "/" + curPath + "/";
                                } else {
                                    basePath = basePath + curPath + "/";
                                }
                                select.append("<option value='" + escape(basePath) + "'>" + basePath + "</option>");
                            }
                        }
                    }
                    select.val(escape(curVal)).trigger("change.local");
                }
            }
        },
        destroy: function() {
            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);