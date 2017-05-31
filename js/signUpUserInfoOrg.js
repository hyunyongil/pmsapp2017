$(document).one('pageinit', '#signUpUserInfo_page', function () {
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

        pri.checkDuplicateMemeberIdArgs = {
            url: CONSTANTS.MEMBER.CHECK_ID,
            type: CONSTANTS.METHOD.POST
        };

        pri.signUpArgs = {
            url: CONSTANTS.MEMBER.REGISTER,
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

        pub.checkDuplicateMemeberIdArgs = pri.checkDuplicateMemeberIdArgs;
        pub.signUpArgs = pri.signUpArgs;

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
        pri.memberPw1 = $('#member_pw1', page.dom);
        pri.memberPw2 = $('#member_pw2', page.dom);
        pri.emailAddr = $('#email_addr', page.dom);
        pri.emailDomain = $('#email_domain', page.dom);

        pri.checkDuplicateMemeberId = $('#check_duplicate_memeber_id', page.dom);
        pri.signUp = $('#sign_up', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.checkDuplicateMemeberIdCallback = function (data) {
            console.log(data);
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                alertLayer('사용 가능한 아이디입니다.');

                page.model.config.checkMemberId = pri.memberId.val();
            } else {
                alertLayer('이미 사용중인 아이디입니다');

                pri.memberId.focus();
            }
        };

        pri.signUpCallback = function (data) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                COMMON.token.put(data.result.token);

                jms.page.startActivity('signUpComplete.html');
            } else {
                alertLayer(ONPANEL.Ajax.Result.getMessage(data));
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.memberId = pri.memberId;
        pub.memberPw1 = pri.memberPw1;
        pub.memberPw2 = pri.memberPw2;
        pub.emailAddr = pri.emailAddr
        pub.emailDomain = pri.emailDomain;

        pub.checkDuplicateMemeberId = pri.checkDuplicateMemeberId;
        pub.signUp = pri.signUp;

        // ////////////////////////////
        // public functions
        // ////////////////////////////

        // initial View
        pub.init = function () {
        };

        pub.checkDuplicateMemeberIdCallback = pri.checkDuplicateMemeberIdCallback;
        pub.signUpCallback = pri.signUpCallback;

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
            var memberId = page.view.memberId.val();
            var memberPw1 = page.view.memberPw1.val();
            var memberPw2 = page.view.memberPw2.val();

            if(memberId.length == 0) {
                alertLayer('아이디를 입력해주세요.');

                page.view.memberId.focus();
                return false;
            }

            if(memberId != page.model.config.checkMemberId) {
                alertLayer('아이디 중복확인을 해주세요.');

                return false;
            }

            if(memberPw1.length == 0) {
                alertLayer('비밀번호를 입력해주세요.');

                page.view.memberPw1.focus();
                return false;
            }

            if(memberPw1 != memberPw2) {
                alertLayer('비밀번호를 확인해주세요.');

                page.view.memberPw2.focus();
                return false;
            }

            if(page.view.emailAddr.val().length == 0) {
                alertLayer('이메일 주소를 입력해주세요.');

                page.view.emailAddr.focus();
                return false;
            }
            if(page.view.emailDomain.val().length == 0) {
                alertLayer('이메일 주소를 입력해주세요.');

                page.view.emailDomain.focus();
                return false;
            }

            return true;
        };

        pri.checkDuplicateMemeberId = function () {
            var args = page.model.checkDuplicateMemeberIdArgs;
            args.param = {
                'member_id': page.view.memberId.val()
            };

            this.doRequest(page.view.checkDuplicateMemeberIdCallback, args);
        };

        pri.getMemeberId = function (callback) {
            var args = page.model.getMemberIdArgs;
            args.param = {
                DI: page.model.config.certInfo.DI
            };

            this.doRequest(callback, args);
        };

        pri.signUp = function () {
            if(!this.validation()) {
                return;
            }

            var certInfo = page.model.config.certInfo;

            var args = page.model.signUpArgs;
            args.param = {
                member_info: certInfo.member_info,
                DI: certInfo.DI,
                CI: certInfo.CI,
                member_id: page.view.memberId.val(),
                member_pw: page.view.memberPw1.val(),
                email_addr: page.view.emailAddr.val(),
                email_domain: page.view.emailDomain.val(),
                uuid: getUUID(),
                push_token: 'temp'
            };

            this.doRequest(page.view.signUpCallback, args);
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
            page.view.checkDuplicateMemeberId.on('click', function (event, ui) {
                event.preventDefault();

                pri.checkDuplicateMemeberId();
            });

            page.view.signUp.on('click', function (event, ui) {
                event.preventDefault();

                pri.signUp();
            });

            $('#use_member_id').on('click', function (event, ui) {
                event.preventDefault();

                jms.page.finish(true);
            });
        };

        pub.loadMemeberId = pri.loadMemeberId;

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
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);

        if ('not_exist_member_id' == prevPageId) {
            if (data) {
                console.log('use member id : ' + page.view.memberId.val());
                page.model.config.checkMemberId = page.view.memberId.val();
            }
        }
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});