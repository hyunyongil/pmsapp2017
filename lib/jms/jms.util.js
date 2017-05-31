( function ($) {
    if (undefined === window.jms) {
        window.jms = {};
    }

    // private variables
    var _level = {
        "1": "ASSERT ",
        "2": "ERROR  ",
        "3": "WARN   ",
        "4": "INFO   ",
        "5": "DEBUG  ",
        "6": "VERBOSE"
    };

    // private functions.
    var _parseMsg = function (args) {
        // 메시지 기록
        var result = "";
        var i;
        var size = args.length;
        var msg;

        for (i = 0; i < size; ++i) {
            msg = args[i];
            if ("object" === typeof (msg)) {
                try {
                    result += "[" + JSON.stringify(msg) + "] ";
                } catch (e) {
                    result += "[OBJECT] ";
                }
            } else {
                result += "[" + msg + "] ";
            }
        }
        return result;
    };
    // 로그 기록..
    var _log = function (level, args) {
        var result = "";

        // Log Level 필터링
        if (window.jms.util.log._log_level < level) {
            return;
        }

        // 화이트 리스트 필터링
        var whitelist = jms.util.sessionStorage.get("tag_whitelist");
        if (true !== $.isEmptyObject(whitelist) && true !== whitelist[args[0]]) {
            return;
        }

        // 블랙 리스트 필터링
        var blacklist = jms.util.sessionStorage.get("tag_blacklist");
        if (true !== $.isEmptyObject(blacklist) && true === blacklist[args[0]]) {
            return;
        }

        // 로그를 기록하는 시각 기록
        result += "[" + (+new Date()) + "] ";

        // 로그 레벨 기록
        result += "[" + _level[level] + "] ";

        console.log("TEST:"+result + _parseMsg(args));
    };
    // ////////////////////
    // 로그 기록 라이브러리
    // ////////////////////
    window.jms.util = {
        "log": {
            "_log_level": 6,
            "level_assert": 1,
            "level_error": 2,
            "level_warn": 3,
            "level_info": 4,
            "level_debug": 5,
            "level_verbose": 6,
            "getVersion": function () {
                return "1.0.6";
            },
            "a": function () {
                _log(this.level_assert, arguments);
            },
            "e": function () {
                _log(this.level_error, arguments);
            },
            "w": function () {
                _log(this.level_warn, arguments);
            },
            "d": function () {
                _log(this.level_debug, arguments);
            },
            "i": function () {
                _log(this.level_info, arguments);
            },
            "v": function () {
                _log(this.level_verbose, arguments);
            },
            "setLogLevel": function (level) {
                this._log_level = level;
            },
            "setWhitelistTag": function (arrList) {
                if ($.isArray(arrList)) {
                    var i;
                    var size = arrList.length;
                    var result = {};
                    jms.util.sessionStorage.set("tag_whitelist", {});
                    for (i = 0; i < size; ++i) {
                        result[arrList[i]] = true;
                    }
                    jms.util.sessionStorage.set("tag_whitelist", result);
                    jms.util.sessionStorage.set("tag_blacklist", {});
                } else {
                    this.w("jms.util.log", "jms.util.log.setWhitelistTag(param) : param should be array type.");
                }
            },
            "clearWhitelistTag": function (arrList) {
                jms.util.sessionStorage.set("tag_whitelist", {});
            },
            "setBlacklistTag": function (arrList) {
                if ($.isArray(arrList)) {
                    var i;
                    var size = arrList.length;
                    var result = {};
                    jms.util.sessionStorage.set("tag_blacklist", {});
                    for (i = 0; i < size; ++i) {
                        result[arrList[i]] = true;
                        jms.util.sessionStorage.set("tag_blacklist", result);
                    }
                    jms.util.sessionStorage.set("tag_whitelist", {});
                } else {
                    this.w("jms.util.log", "jms.util.log.setBlacklistTag(param) : param should be array type.");
                }
            },
            "clearBlacklistTag": function (arrList) {
                jms.util.sessionStorage.set("tag_blacklist", {});
            }
        }
    };

    // /////////////////////////
    // sessionStorage 라이브러리
    // /////////////////////////
    window.jms.util.sessionStorage = ( function () {
        if (undefined === window.sessionStorage) {
            jms.util.log.w("jms.util.sessionStorage", "sessionStorage를 사용할 수 없습니다.");
            window.sessionStorage = {};
        }
        if (undefined === window.sessionStorage.ems) {
            window.sessionStorage.ems = "{}";
        }
        return {
            "set": function (key, value) {
                var storage_obj = JSON.parse(window.sessionStorage.ems);
                storage_obj[key] = value;
                window.sessionStorage.ems = JSON.stringify(storage_obj);
            },
            "get": function (key) {
                var storage_obj = JSON.parse(window.sessionStorage.ems);
                return storage_obj[key];
            },
            "clearAll": function () {
                window.sessionStorage.ems = "{}";
            }
        };
    }());

    window.jms.util.log.i("jms.util", "library version: " + window.jms.util.log.getVersion());
}(window.jQuery));
