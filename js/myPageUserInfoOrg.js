$(document).one('pageinit', '#myPageUserInfo_page', function () {
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

        pri.getBankListArgs = {
            url: CONSTANTS.MEMBER.BANKLIST,
            type: CONSTANTS.METHOD.POST
        };

        pri.updateUserInfoArgs = {
            url: CONSTANTS.MEMBER.EDIT,
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

        pub.getBankListArgs = pri.getBankListArgs;
        pub.updateUserInfoArgs = pri.updateUserInfoArgs;

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
        pri.emailAddr = $('#email_addr', page.dom);
        pri.emailDomain = $('#email_domain', page.dom);
        pri.bankNames = $('#bank_name', page.dom);
        pri.bankAccount = $('#bank_account', page.dom);
        pri.tel1 = $('#tel_num1', page.dom);
        pri.tel2 = $('#tel_num2', page.dom);
        pri.tel3 = $('#tel_num3', page.dom);
        pri.memberPw1 = $('#member_pw1', page.dom);
        pri.memberPw2 = $('#member_pw2', page.dom);

        pri.save = $('#save', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadBankListCallback = function (data) {
            for (var key in data.result)
                pri.bankNames.append($('<option>').val(key).text(data.result[key]));

            pri.bankNames.selectmenu('refresh');
        };

        pri.loadUserInfoCallback = function (data) {
            pri.memberId.text(data.member_id);
            pri.emailAddr.val(data.email_addr);
            pri.emailDomain.val(data.email_domain);

            pri.bankNames.val(data.bank_name).selectmenu('refresh');
            pri.bankAccount.val(data.bank_account);

            var pos = (data.mobile_num.length > 10 ? 4 : 3);
            var tel1 = data.mobile_num.substr(0, 3);
            var tel2 = data.mobile_num.substr(3, pos);
            var tel3 = data.mobile_num.substr(3 + pos, 4);

            pri.tel1.val(tel1);
            pri.tel2.val(tel2);
            pri.tel3.val(tel3);
        };

        pri.saveUserInfoCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                alertLayer('회원정보가 수정되었습니다.');
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.emailAddr = pri.emailAddr
        pub.emailDomain = pri.emailDomain;
        pub.bankNames = pri.bankNames;
        pub.bankAccount = pri.bankAccount;
        pub.tel1 = pri.tel1;
        pub.tel2 = pri.tel2;
        pub.tel3 = pri.tel3;
        pub.memberPw1 = pri.memberPw1;
        pub.memberPw2 = pri.memberPw2;

        pub.save = pri.save;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadBankListCallback = pri.loadBankListCallback;
        pub.loadUserInfoCallback = pri.loadUserInfoCallback;
        pub.saveUserInfoCallback = pri.saveUserInfoCallback;

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

            if(memberPw1.length == 0) {
            	alertLayer('비밀번호를 입력해주세요.');
                return;
            }

            if(memberPw1 != memberPw2) {
            	alertLayer('비밀번호를 다시 확인해주세요.');
                return;
            }

            return true;
        };

        pri.loadBankList = function () {
            pri.getBankList(page.view.loadBankListCallback);
        };

        pri.getBankList = function (callback) {
            var args = page.model.getBankListArgs;

            this.doRequest(callback, args);
        };

        pri.loadUserInfo = function () {
            getUser(page.view.loadUserInfoCallback);
        };

        pri.saveUserInfo = function () {
            if (!this.validation())
                return;

            pri.updateUserInfo(page.view.saveUserInfoCallback);
        };

        pri.updateUserInfo = function (callback) {
            var args = page.model.updateUserInfoArgs;

            args.param = {
                'email_addr' : page.view.emailAddr.val(),
                'email_domain' : page.view.emailDomain.val(),
                'hp1' : page.view.tel1.val(),
                'hp2' : page.view.tel2.val(),
                'hp3' : page.view.tel3.val(),
                'bank_name' : page.view.bankNames.val(),
                'bank_account' : page.view.bankAccount.val(),
            };

            var memberPw = page.view.memberPw1.val();
            if(memberPw.length > 0) {
                args.param.mpass = memberPw;
            }

            this.doRequest(callback, args);
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
            page.view.save.on('click', function (event, ui) {
                pri.saveUserInfo();
            });
        };

        pub.loadBankList = pri.loadBankList;
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

        page.controller.loadBankList();
        page.controller.loadUserInfo();
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