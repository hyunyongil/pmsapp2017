$(document).bind("mobileinit", function() {
    // DOM Cache 사용
    $.mobile.page.prototype.options.domCache = true;

    // transition 효과 삭제
    $.mobile.defaultPageTransition = "none";
    $.mobile.defaultDialogTransition = "none";

    $.mobile.allowCrossDomainPages = true;
    $.support.cors                 = true;
    $.mobile.pushStateEnabled      = false;

    jms.page._base_directory = $.mobile.path.parseUrl(location.href).directory;
});

( function($) {
    if(undefined === window.ems) {
        window.ems = {};
    }

    // 로그 설정: jms.util.log 를 사용하지 않더라도 독립적으로 사용하기 위함.
    var log = {};
    var TAG = "jms.page";
    if(window.jms.util) {
        log = window.jms.util.log;
    } else {
        log.a = log.e = log.w = log.d = log.i = log.v = function() {
            $.noop();
        };
    }

    // private functions
    var _setMVC = function(page_id, type, data) {
        if("string" !== typeof (page_id)) {
            log.a(TAG, "jms.page.get" + type + "()의 파라메터로 입력받은 page_id가 string type이 아닙니다.");
        } else {
            window.jms.page._mvc_data[type][page_id] = data;
        }
    };
    var _getMVC = function(page_id, type) {
        if("string" !== typeof (page_id)) {
            log.a(TAG, "jms.page.get" + type + "()의 파라메터로 입력받은 page_id가 string type이 아닙니다.");
        } else {
            return window.jms.page._mvc_data[type][page_id];
        }
        return undefined;
    };
    // global 영역에 ems 객체 생성
    window.jms.page = {
        "_base_directory" : null,
        "_backtrace_target" : null,
        "_param" : undefined,
        "_result" : undefined,
        "_page_map" : {},
        "_mvc_data" : {
            "model" : {},
            "view" : {},
            "controller" : {}
        },
        "_active_page_id" : "",
        "_flag_setResult" : false,
        "_prev_page_id" : undefined,
        "_refresh_data" : {},
        "getVersion" : function() {
            return "1.0.6";
        },
        "startActivity" : function(url, param) {
            if("string" === typeof (url)) {
                this._param = param;
                $.mobile.changePage(url);
            } else {
                log.a(TAG, "jms.page.startActivity(url, param) : url 파라메터는 문자열 타입이어야 합니다.");
            }
        },
        "openDialog" : function(url, param) {
            if("string" === typeof (url)) {
                var $dialog = $('#ems-dialog');
                if(1 > $dialog.length) {
                    $dialog = $('<a id="ems-dialog" data-rel="dialog"></a>').appendTo('body');
                }
                $dialog.attr('href', url);
                this._param = param;
                $dialog.trigger('click');
            } else {
                log.a(TAG, "jms.page.startActivity(url, param) : url 파라메터는 문자열 타입이어야 합니다.");
            }
        },
        "finish" : function(result) {
            if(undefined !== result) {
                this._result = result;
            } else if(true !== this._flag_setResult) {
                this._result = undefined;
            }
            history.back();
        },
        "backTrace" : function(page_id, result) {
            if(undefined !== result) {
                this._result = result;
            } else if(true !== this._flag_setResult) {
                this._result = undefined;
            }
            // A 페이지에서 backTrace(A)페이지를 호출할 경우: 페이지 이동 없이 onRestart()만 호출된다.
            if(this._active_page_id === page_id) {
                log.i(TAG, page_id + " -> Event::onRestart()");
                log.v(TAG, "onRestart() parameter -> ", this._result);
                $("#" + page_id).trigger("onRestart", [this._result, this._prev_page_id, false]);
            } else {
                this._backtrace_target = page_id;
                history.back();
            }
        },
        "setResult" : function(result) {
            log.w(TAG, "deprecated", "jms.page.setResult(result): 이 API는 3.0.0 정식 버전에서 폐지될 예정입니다. Getter 와 setter가 구현된 jms.page.result()를 사용해 주세요. ");
            this._flag_setResult = true;
            this._result = result;
        },
        "result" : function(result) {
            if(undefined !== result) {
                this._flag_setResult = true;
                this._result = result;
            }
            return this._result;
        },
        "setPageMapping" : function(object_id_by_url) {
            // ex) object_id_by_url = {"page1_id": "page1_url", "page2_id": "page2_url"}
            if($.isPlainObject(object_id_by_url)) {
                this._page_map = object_id_by_url;
            } else {
                log.a(TAG, "jms.page.setPageMapping(object_id_by_url) : object_id_by_url 파라메터는 object 타입이어야 합니다.");
            }
        },
        "getPageUrlById" : function(page_id) {
            if("string" !== typeof (page_id)) {
                log.a(TAG, "jms.page.getPageUrlById(page_id) : page_id 파라메터는 string 타입이어야 합니다.");
                return undefined;
            }
            var result = this._page_map[page_id];
            if(undefined === result) {
                log.w(TAG, "jms.page.getPageUrlById(page_id) : page_id가 '" + page_id + "'인 페이지에 대한 정보가 없습니다. jms.page.setPageMapping() 함수를 이용하여 페이지를 등록할 수 있습니다. 현재 등록된 page mapping 정보는 다음과 같습니다.", this._page_map);
            }
            return this._base_directory + result;
        },
        "getPageIdByUrl" : function(page_url) {
            if("string" !== typeof (page_url)) {
                log.a(TAG, "jms.page.getPageIdByUrl(page_url) : page_url 파라메터는 string 타입이어야 합니다.");
                return undefined;
            }
            var url;
            var each;
            for(each in this._page_map) {
                if(this._page_map.hasOwnProperty(each)) {
                    url = this._page_map[each];
                    if(page_url === url) {
                        return each;
                    }
                }
            }
            log.w(TAG, "jms.page.getPageIdByUrl(page_url) : page_url이 '" + page_url + "'인 페이지에 대한 정보가 없습니다. jms.page.setPageMapping() 함수를 이용하여 페이지를 등록할 수 있습니다. 현재 등록된 page mapping 정보는 다음과 같습니다.", this._page_map);
            return undefined;
        },
        "setModel" : function(page_id, data) {
            _setMVC(page_id, "model", data);
        },
        "setView" : function(page_id, data) {
            _setMVC(page_id, "view", data);
        },
        "setController" : function(page_id, data) {
            _setMVC(page_id, "controller", data);
        },
        "getModel" : function(page_id) {
            return _getMVC(page_id, "model");
        },
        "getView" : function(page_id) {
            return _getMVC(page_id, "view");
        },
        "getController" : function(page_id) {
            return _getMVC(page_id, "controller");
        },
        "refresh" : function(restart) {
            if(restart) {
                log.i(TAG, this._active_page_id + " -> Event::onRestart()");
                $.mobile.activePage.trigger("onRestart");
                return;
            }
            // 첫페이지에서는 새로고침 즉시 수행
            if($.mobile.firstPage.attr("id") === this._active_page_id) {
                location.reload();
            } else {
                var current_page_url = $.mobile.urlHistory.getActive().pageUrl;
                this._refresh_data.param = this._param;
                this._refresh_data.page_url = current_page_url;
                this._refresh_data.page_id = this._active_page_id;
                this._refresh_data.is_refresh = true;
                jms.page.finish();
            }
        }
    };

    $(document).on("pagebeforeshow", 'div[data-role=page], div[data-role=dialog]', function(event, data) {
        $('div[jms-data-role=load]', this).each(function () {
            var page = $(this).attr('jms-data-page');
            if(!page)
                return;

            $(this).load(page, function(){
                var value = $(this).attr('jms-data-value');
                if(value)
                    $('.' + value + ' a', this).addClass("ui-btn-active");

                $ (this).trigger("create");
            });
        });
    });

    $(document).on("pagebeforeshow", 'div[data-role=page], div[data-role=dialog]', function(event, data) {
        var $this = $(this);
        var page_id = $(this).attr("id");
        if(undefined !== data.prevPage) {
            this._prev_page_id = data.prevPage.attr("id");
        }
        if(undefined === $.mobile.urlHistory.getNext()) {
            jms.page._result = undefined;
            log.i(TAG, page_id + " -> Event::onCreate()");
            $this.trigger("onCreate");
            log.i(TAG, page_id + " -> Event::onStart()");
            log.v(TAG, "onStart() parameter -> ", jms.page._param);
            $this.trigger("onStart", [jms.page._param, this._prev_page_id]);
            jms.page._refresh_data.is_refresh = false;
        } else {
            if(true !== jms.page._refresh_data.is_refresh) {
                log.i(TAG, page_id + " -> Event::onRestart()");
                log.v(TAG, "onRestart() parameter -> ", jms.page._result);
                if(null !== window.jms.page._backtrace_target) {
                    if($this.attr("id") !== window.jms.page._backtrace_target) {
                        $('div[data-role=content]', $this).remove();
                        $this.trigger("onRestart", [jms.page._result, this._prev_page_id, true]);
                        window.jms.page.finish(jms.page._result);
                        return;
                    } else {
                        window.jms.page._backtrace_target = null;
                        $("body").show();
                    }
                }
                var result = jms.page._result;
                jms.page._result = undefined;
                $this.trigger("onRestart", [result, this._prev_page_id, false]);
            } else {
                setTimeout(function() {
                    jms.page.startActivity(jms.page._refresh_data.page_url, jms.page._refresh_data.param);
                }, 1);
            }
        }
        jms.page._active_page_id = page_id;
    });
    $(document).on("pagebeforehide", 'div[data-role=page], div[data-role=dialog]', function(event, data) {
        var $this = $(this);
        var page_id = $(this).attr("id");
        if(undefined === $.mobile.urlHistory.getNext()) {
            if(true !== jms.page._refresh_data.is_refresh) {
                log.i(TAG, page_id + " -> Event::onStop()");
                $this.trigger("onStop");
            }
        } else {
            if(true !== jms.page._refresh_data.is_refresh) {
                log.i(TAG, page_id + " -> Event::onDestroy()");
                $this.trigger("onDestroy");
            }
            // 페이지 DOM에서 삭제
            setTimeout(function() {
                //$("#" + page_id).off('pagebeforecreate pagecreate pageinit pageremove pagebeforeshow pageshow pagebeforehide pagehide').off('onCreate onStart onRestart onStop onDestroy').remove();
            }, 1);
            jms.page._flag_setResult = false;
        }
    });

    log.i(TAG, "library version: " + window.jms.page.getVersion());
}(window.jQuery));
