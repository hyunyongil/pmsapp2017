$(document).one('pageinit', '#login_page', function () {
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

        pri.loginArgs = {
            url: CONSTANTS.MEMBER.LOGIN,
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

        pub.loginArgs = pri.loginArgs;

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

        pri.memberId = $('#member_id', page.dom);
        pri.memberPw = $('#member_pw', page.dom);

        pri.keepLogin = $('#keep_login', page.dom);

        pri.login = $('#login', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadKeepLoginInfoCallback = function (data) {
            pri.keepLogin.val(data).slider('refresh')
        };

        pri.loginCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                var result = ONPANEL.Ajax.Result.getData(data);
                COMMON.token.put(result.token);

                page.controller.saveKeepLoginInfo(pri.keepLogin.val());

                COMMON.storage.put("my_info_name",data.result.name);


                console.log('data.result: '+data.result);
                console.log('data.result.survey_cnt: '+data.result.survey_cnt);

                COMMON.storage.put("my_level",data.result.member_level);
                COMMON.storage.put("my_survey_cnt",data.result.survey_cnt);
                COMMON.storage.put("my_info_id",data.result.member_id);


                //jms.page.startActivity('home.html');
                location.href = 'home.html';
            } else {
                alertLayer(ONPANEL.Ajax.Result.getMessage(data));
                //$('#loginFailDialog .ui-title').html(ONPANEL.Ajax.Result.getMessage(data));
                //$.mobile.changePage("#loginFailDialog", {transition: 'pop', role: 'dialog'});
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.memberId = pri.memberId;
        pub.memberPw = pri.memberPw;
        pub.login = pri.login;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadKeepLoginInfoCallback = pri.loadKeepLoginInfoCallback;
        pub.loginCallback = pri.loginCallback;

        // initial View
        pub.init = function () {
        };

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
            var memberPw1 = page.view.memberPw1.val();
            var memberPw2 = page.view.memberPw2.val();

            if (memberPw1.length > 0) {
                if (memberPw1 != memberPw2)
                    alertLayer('비밀번호를 다시 확인해주세요.');
            }

            return true;
        };

        pri.loadKeepLoginInfo = function () {
            page.view.loadKeepLoginInfoCallback(pri.getKeepLoginInfo());
        };

        pri.saveKeepLoginInfo = function(keepLogin) {
            pri.setKeepLoginInfo(keepLogin);
        };

        pri.getKeepLoginInfo = function () {
            return (COMMON.storage.get('onpanel.keep.login') == 'Y' ? 'Y' : "N");
        };

        pri.setKeepLoginInfo = function (keepLogin) {
            COMMON.storage.put('onpanel.keep.login', keepLogin);
        };

        pri.login = function () {
            var args = page.model.loginArgs;
            var app_type = "web";
            var push_token = 'temp';

            try{
                app_type = device.platform.toLowerCase();

                if(app_type != "browser"){
                    push_token = COMMON.globalData.get('push_token');
                }
            }
            catch(e) { }

            var member_id = $('#member_id', page.dom).val();
            var member_pw = $('#member_pw', page.dom).val();

            if(member_id == "") {
                alertLayer("아이디를 입력해주세요");
                return false;
            }

            if(member_pw == "") {
                alertLayer("비밀번호를 입력해주세요");
                return false;
            }


            args.param = {
                'member_id': page.view.memberId.val(),
                'member_pw': signJWT(
                    {'member_pw': page.view.memberPw.val()}
                ),
                'push_token' : push_token,
                'app_type' : app_type
            };

            console.log(JSON.stringify(args));
            this.doRequest(page.view.loginCallback, args);
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
            page.view.login.on('click', function (event, ui) {
                event.preventDefault();

                pri.login();
            });

            document.addEventListener('backbutton', function() {
                navigator.notification.confirm('앱을 종료하시겠습니까?', function(index) {
                    if(index == 1)
                        navigator.app.exitApp();
                }, '종료');

            }, true);
        };

        pub.loadKeepLoginInfo = pri.loadKeepLoginInfo;
        pub.saveKeepLoginInfo = pri.saveKeepLoginInfo;

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

        page.controller.loadKeepLoginInfo();
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

/**
 * Created by yong on 8-8용일.
 */
