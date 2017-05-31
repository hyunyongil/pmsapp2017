$(document).one('pageinit', '#deleteAccount_page', function () {
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

        pri.deleteAccountArgs = {
            url: CONSTANTS.MEMBER.OUT,
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

        pub.deleteAccountArgs = pri.deleteAccountArgs;

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

        pri.deleteAccountReason = $('.delete_account_reason', page.dom);
        //pri.deleteAccountReason = $('#delete_account_reason', page.dom);
        pri.memberName = $('#member_name', page.dom);
        pri.memberPw = $('#member_pw', page.dom);

        pri.certifyUserByMobile = $('#certifyUserByMobile', page.dom);
        pri.deleteAccount = $('#delete_account', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadUserInfoCallback = function (data) {
            pri.memberName.text(data.name);

            page.model.config.userInfo = data;
        };

        pri.deleteAccountCallback = function (data) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                COMMON.token.clear();

                jms.page.startActivity('index.html');
            } else {
                alertLayer(ONPANEL.Ajax.Result.getMessage(data));
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.deleteAccountReason = pri.deleteAccountReason;
        pub.memberPw = pri.memberPw;

        pub.certifyUserByMobile = pri.certifyUserByMobile;
        pub.deleteAccount = pri.deleteAccount;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadUserInfoCallback = pri.loadUserInfoCallback;
        pub.deleteAccountCallback = pri.deleteAccountCallback;

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
            if (page.view.deleteAccountReason.is(":checked") == false) {
            //if (page.view.deleteAccountReason.val() == '0' || page.view.deleteAccountReason.val() == '') {
                alertLayer('탈퇴사유를 선택해주세요.');

                return false;
            }

            if (page.view.memberPw.val().length == 0) {
                alertLayer('비밀번호를 입력해주세요.');

                return false;
            }

            return true;
        };

        pri.loadUserInfo = function () {
            getUser(page.view.loadUserInfoCallback);
        };

        pri.deleteAccount = function () {
            if (!this.validation())
                return;

            var args = page.model.deleteAccountArgs;
            args.param = {
                outbigo: page.view.deleteAccountReason.val(),
                //outbigo: page.view.deleteAccountReason.text(),
                mpass: page.view.memberPw.val(),
                outbigo_etc:$("#outbigo_etc").val(),
                note:$("#note").val()
            };


            this.doRequest(page.view.deleteAccountCallback, args);
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
            page.view.deleteAccount.on('click', function (event, ui) {
                event.preventDefault();

                pri.deleteAccount();
            });
        };

        pub.loadUserInfo = pri.loadUserInfo;

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

        page.controller.loadUserInfo();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);

        if ('certifyUserByMobile_page' == prevPageId) {
            if ($.isPlainObject(data)) {
                $.extend(page.model.config, data);

                page.view.certifyUserByMobile.text('휴대폰 인증됨').addClass('ui-disabled');
            }
        }
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});