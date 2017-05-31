$(document).one('pageinit', '#findMemberId_page', function () {
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

        pri.checkMobileCodeArgs = {
            url: CONSTANTS.MEMBER.FIND_MOBILE_CODE,
            type: CONSTANTS.METHOD.POST
        };
        pri.findPwdArgs = {
            url: CONSTANTS.MEMBER.FIND_ID_NEW,
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
        pub.checkMobileCodeArgs = pri.checkMobileCodeArgs;
        pub.findPwdArgs = pri.findPwdArgs;

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
        pri.certifyUserByMobile = $('#certifyUserByMobile', page.dom);

        pri.memberId = $('#frm_member_id', page.dom);
        pri.mobileNumber = $('#frm_mobile_num', page.dom);
        pri.numberAuthCode = $('#frm_number_auth_code', page.dom);
        pri.mobile_code = $('#mobile_code', page.dom);

        pri.clickFindBack = $('#clickFindBack', page.dom);
        pri.clickMobileCode = $('#clickMobileCode', page.dom);
        pri.clickFindAction = $('#clickFindAction', page.dom);
        pri.checkMobileNum = $('#check_mobile_num', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////

        pri.checkMobileCodeCallback = function (data) {

            if (ONPANEL.Ajax.Result.isSucess(data)) {

                $('#check_mobile_num', page.dom).val('Y');
                $('#mobile_code', page.dom).val(data.result.mobile_code);
            }
            else {
                $('#check_mobile_num', page.dom).val('N');
                alertLayer(data.resultMsg);
            }
        };
        pri.findCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                COMMON.storage.put('find_member_id',data.result.member_id);
                location.href = "findMemberIdResultNew.html"
            }
            else {

                alertLayer(data.resultMsg);
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.memberId = pri.memberId;
        pub.certifyUserByMobile = pri.certifyUserByMobile;

        pub.mobileNumber = pri.mobileNumber;
        pub.numberAuthCode = pri.numberAuthCode;
        pub.clickMobileCode = pri.clickMobileCode;
        pub.clickFindAction = pri.clickFindAction;
        pub.clickFindBack = pri.clickFindBack;
        pub.checkMobileNum = pri.checkMobileNum;
        pub.mobile_code = pri.mobile_code;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.checkMobileCodeCallback = pri.checkMobileCodeCallback;
        pub.findCallback = pri.findCallback;

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
            var memberId = page.view.memberId.val();

            if (memberId.length == 0) {
                alertLayer('아이디를 입력해주세요.');

                return false;
            }

            return true;
        };

        pri.goCertifyUserByMobile = function () {
            if(!this.validation())
                return;

            jms.page.startActivity('certifyUserByMobile.html', {callback: {member_id: page.view.memberId.val(), page: 'findMemberPwResult.html'}});
        };

        pri.checkMobileCodeAddr = function () {
            var args = page.model.checkMobileCodeArgs;
            args.param = {
                'phone_number': page.view.mobileNumber.val()
            };

            if(page.view.mobileNumber.val() == "") {
                alertLayer("핸드폰 번호를 입력해주세요.");
                page.view.mobileNumber.focus();
                return false;
            }
            var rgEx = /(01[016789])-?(\d{4}|\d{3})-?\d{4}$/g;
            if(!rgEx.test(page.view.mobileNumber.val())){
                alertLayer("핸드폰 번호를 정상적으로 입력하여주세요.");
                return false
            }

            this.doRequest(page.view.checkMobileCodeCallback, args);
        };
        pri.findAddr = function () {
            var args = page.model.findPwdArgs;
            args.param = {
                'mobile_num': page.view.mobileNumber.val()
                , 'auth_code': page.view.numberAuthCode.val()
                , 'mobile_code': page.view.mobile_code.val()
            };

            if(page.view.mobileNumber.val() == "") {
                alertLayer("핸드폰 번호를 입력해주세요.");
                page.view.mobileNumber.focus();
                return false;
            }
            var rgEx = /(01[016789])-?(\d{4}|\d{3})-?\d{4}$/g;
            if(!rgEx.test(page.view.mobileNumber.val())){
                alertLayer("핸드폰 번호를 정상적으로 입력하여주세요.");
                return false
            }            
            if(page.view.numberAuthCode.val() == "") {
                alertLayer("인증번호를 입력해주세요.");
                page.view.numberAuthCode.focus();
                return false;
            }

            this.doRequest(page.view.findCallback, args);
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
            page.view.certifyUserByMobile.on('click', function (event, ui) {
                event.preventDefault();
                pri.goCertifyUserByMobile();
            });

            page.view.clickMobileCode.on('click', function (event, ui) {
                event.preventDefault();
                pri.checkMobileCodeAddr();
            });
            page.view.clickFindAction.on('click', function (event, ui) {
                event.preventDefault();
                pri.findAddr();
            });
            page.view.clickFindBack.on('click', function (event, ui) {
                event.preventDefault();
                history.go(-1);
            });
        };

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
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});