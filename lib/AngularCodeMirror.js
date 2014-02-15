

'use strict';

angular.module('AngularCodeMirrorModule', [])

    .factory('AngularCodeMirror', [ function() {
        return function() {
            var fn = function() {
               
                this.show = function(params) {
                    
                    var scope = params.scope,
                        target = (typeof params.container === "string") ? document.getElementById(params.container) : params.container,
                        mode = params.mode,
                        model = params.model,
                        title = params.title || 'Code Editor',
                        modes = this.modes,
                        myCodeMirror;

                    this.html = "<div id=\"af-code-editor-modal\"><div id=\"af-code\"></div>\n</div>\n";
                    if ($('#af-code-editor-modal').length === 0) {
                        $(target).append(this.html);
                    }
                    else {
                        $('#af-code-editor-modal').remove();
                        $(target).append(this.html);
                    }

                    $('#af-code-editor-modal').dialog({
                        title: title,
                        resizable: true,
                        width: Math.ceil($(window).width() * 0.9),
                        height: Math.ceil($(window).height() * 0.8),
                        position: "center",
                        show: true,
                        closeOnEscape: true,
                        modal: true,
                        autoOpen: true,
                        buttons: [
                            { text: "Cancel", id: "af-code-edit-cancel", click: function() { $(this).dialog('close'); } },
                            { text: "OK", id: "af-code-edit-ok", click:
                                function() {
                                    scope.$apply(function() { scope[model] = myCodeMirror.getValue(); });
                                    $(this).dialog('close');
                                }
                            }
                        ],
                        open: function() {
                             // fix buttons- make them more twittery
                            $('.ui-dialog[aria-describedby="af-code-editor-modal"]').find('.ui-dialog-titlebar button')
                                .empty().attr({'class': 'close'}).text('x');
                            $('#af-code-edit-cancel').attr({ "class": "btn btn-default" }).empty().html("<i class=\"fa fa-times\"></i> Cancel");
                            $('#af-code-edit-ok').attr({ "class": "btn btn-primary" }).empty().html("<i class=\"fa fa-check\"></i> Save");

                            var options = modes[mode];
                            options.value = scope[model];
                            myCodeMirror = CodeMirror(document.getElementById('af-code'), options);
                        }
                    });
                };

                // Don't maintain modes here. Use this.addModes() to set/override available modes
                this.modes = {};
                
                // Add or override available modes.
                this.addModes = function(obj) {
                    for (var key in obj) {
                        if (this.modes[key]) {
                            delete this.modes[key];
                        }
                        this.modes[key] = angular.copy(obj[key]);
                    }
                };
            };
            return new fn();
        };
    }]);