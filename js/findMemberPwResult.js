$(document).one('pageinit', '#findMemberPwResult_page', function () {
    // initial log for global variable of page
    var page = {
        "dom": $(this),
        "id": $(this).attr("id")
    };
    var log = jms.util.log;
    var TAG = page.id;

    log.d(TAG, "pageinit");

    // ////////////////////////////
    // Start MVC configuration
    // ////////////////////////////

    // MVC::model codes
    page.model = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};
        pri.config = {};

        pri.getTempMemberPwArgs = {
            url: CONSTANTS.MEMBER.FIND_PW,
            type: CONSTANTS.METHOD.POST
        };
        pri.getMemberPwArgs = {
            url: CONSTANTS.MEMBER.CHANGE_PWD,
            type: CONSTANTS.METHOD.POST
        };

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            var reqSetting = COMMON.util.makeReqParam(args);

            COMMON.plugin.doRequest(reqSetting, callback);
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};
        pub.config = pri.config;

        pub.getTempMemberPwArgs = pri.getTempMemberPwArgs;
        pub.getMemberPwArgs = pri.getMemberPwArgs;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        // initial Model
        pub.init = function () {
            // TODO::
        };
        // return public functions
        return pub;
    }());

    // MVC::view codes
    page.view = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};

        pri.tempMemeberPw = $('#temp_member_pw', page.dom);
        pri.message = $('#message', page.dom);

        pri.new_pwd = $('#frm_member_pwd', page.dom);
        pri.new_pwd_c = $('#frm_member_pwd_c', page.dom);

        pri.clickFindBack = $('#clickFindBack', page.dom);
        pri.clickFindAction = $('#clickFindAction', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadTempMemeberPwCallback = function (data) {

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                pri.tempMemeberPw.text(data.result.new_passwd);
            } else {
                pri.message.text(ONPANEL.Ajax.Result.getMessage(data));
            }
        };
        pri.pwdChangeCallback = function (data) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                alertLayer("암호가 정상적으로 변경되었습니다.");
                setTimeout(function() {
                    location.href = "loginNew.html";
                },1000);

                COMMON.storage.put("member_id","");
                COMMON.storage.put("new_password","");

            } else {
                alertLayer(data.resultMsg);
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};


        // ////////////////////////////
        // public functions
        // ////////////////////////////

        // initial View
        pub.init = function () {};

        pub.loadTempMemeberPwCallback = pri.loadTempMemeberPwCallback;
        pub.new_pwd = pri.new_pwd;
        pub.new_pwd_c = pri.new_pwd_c;

        pub.clickFindBack = pri.clickFindBack;
        pub.clickFindAction = pri.clickFindAction;
        pub.pwdChangeCallback = pri.pwdChangeCallback;

        // return public functions
        return pub;
    }());

    // MVC::controller codes
    page.controller = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            page.model.doRequest(callback, args);
        };

        pri.validation = function () {
            return true;
        };

        pri.loadTempMemeberPw = function () {
            pri.getTempMemeberPw(page.view.loadTempMemeberPwCallback);
        };

        pri.getTempMemeberPw = function (callback) {
            var args = page.model.getTempMemberPwArgs;
            args.param = {
                DI: page.model.config.certInfo.DI,
                member_id: page.model.config.callback.member_id
            };

            this.doRequest(callback, args);
        };

        pri.pwdChange = function () {
            var args = page.model.getMemberPwArgs;
            args.param = {
                member_id: COMMON.storage.get("member_id")
                , key: COMMON.storage.get("new_password")
                , new_pwd: page.view.new_pwd_c.val()
            };

            if(COMMON.storage.get("member_id") == "" || COMMON.storage.get("new_password") == "") {
                alertLayer("잘못된 접근입니다.");
                location.href = 'loginNew.html';
                return false;
            }

            var memberPw1 = page.view.new_pwd.val();
            var memberPw2 = page.view.new_pwd_c.val();
            var passwordValidation = validationCheckPassword(memberPw1, memberPw2);
            if (passwordValidation.result == false) {
                alertLayer(passwordValidation.message);
                return false;
            }

            this.doRequest(page.view.pwdChangeCallback, args);
        };


        // ////////////////////////////
        // public functions
        // ////////////////////////////
        var pub = {};

        // request
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        pub.validation = function () {
            return pri.validation();
        };

        // initial Controller
        pub.init = function () {
            // initial Model&View
            page.model.init();
            page.view.init();

            // ///////////////////
            // page event handler
            // ///////////////////

            page.view.clickFindAction.on('click', function (event, ui) {
                event.preventDefault();
                pri.pwdChange();
            });

            page.view.clickFindBack.on('click', function (event, ui) {
                event.preventDefault();
                history.go(-1);
            });
        };

        pub.loadTempMemeberPw = pri.loadTempMemeberPw;

        // return public functions
        return pub;
    }());

    // registration the 'jms.page' making MVC in current page
    jms.page.setModel(page.id, page.model);
    jms.page.setView(page.id, page.view);
    jms.page.setController(page.id, page.controller);


    // ////////////////////////////
    // page life cycle events...
    // ////////////////////////////

    /* @Annotation Don't Delete Me: page.dom.bind:onCreate */
    page.dom.bind('onCreate', function () {
        // do initializing function.
        page.controller.init();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStart */
    page.dom.bind('onStart', function (event, data, prevPageId) {
        if ($.isPlainObject(data))
            $.extend(page.model.config, data);

        //page.controller.loadTempMemeberPw();

        if(COMMON.storage.get("member_id") == "" || COMMON.storage.get("new_password") == "") {
            alertLayer('잘못된 접근입니다.');
            location.href = 'loginNew.html';
        }
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});