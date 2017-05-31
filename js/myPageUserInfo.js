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

        pri.checkMobileCodeArgs = {
            url: CONSTANTS.MEMBER.FIND_MOBILE_CODE,
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
        pub.checkMobileCodeArgs = pri.checkMobileCodeArgs;

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
        pri.memberName = $('#member_name', page.dom);
        pri.emailAddr = $('#email_addr', page.dom);
        pri.emailAddrFrm = $('#frm_email_addr', page.dom);
        pri.emailDomain = $('#email_domain', page.dom);
        pri.bankNames = $('#bank_name', page.dom);
        pri.bankAccount = $('#bank_account', page.dom);
        pri.tel1 = $('#tel_num1', page.dom);
        pri.tel2 = $('#tel_num2', page.dom);
        pri.tel3 = $('#tel_num3', page.dom);
        pri.member_oldpw = $('#member_oldpw', page.dom);
        pri.memberPw1 = $('#member_pw1', page.dom);
        pri.memberPw2 = $('#member_pw2', page.dom);

        pri.numberAuthCode = $('#frm_number_auth_code', page.dom);
        pri.mobile_code = $('#mobile_code', page.dom);
        pri.mobileNumber = $('#frm_mobile_num', page.dom);

        pri.clickMobileCode = $('#clickMobileCode', page.dom);


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
            pri.memberName.text(data.name);
            pri.memberId.text(data.member_id);
            pri.emailAddr.val(data.email_addr);
            pri.emailDomain.val(data.email_domain);

            pri.bankNames.val(data.bank_name).selectmenu('refresh');
            pri.bankAccount.val(data.bank_account);
			var pos = '';
			var tel1 = '';
			var tel2 = '';
			var tel3 = '';
			if(data.mobile_num){
				pos = (data.mobile_num.length > 10 ? 4 : 3);
				tel1 = data.mobile_num.substr(0, 3);
				tel2 = data.mobile_num.substr(3, pos);
				tel3 = data.mobile_num.substr(3 + pos, 4);
			}
            pri.tel1.val(tel1);
            pri.tel2.val(tel2);
            pri.tel3.val(tel3);

            pri.emailAddrFrm.val(data.email_addr+"@"+data.email_domain);
            pri.mobileNumber.val(data.mobile_num);

            page.controller.memberAuthChk(data.dupinfo_yn);
        };

        pri.saveUserInfoCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                alertLayer('회원정보가 수정되었습니다.');
            }
            else {
                alertLayer(data.resultMsg);
            }
        };

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

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.memberName = pri.member_name;
        pub.emailAddr = pri.emailAddr;
        pub.emailAddrFrm = pri.emailAddrFrm;
        pub.emailDomain = pri.emailDomain;
        pub.bankNames = pri.bankNames;
        pub.bankAccount = pri.bankAccount;
        pub.tel1 = pri.tel1;
        pub.tel2 = pri.tel2;
        pub.tel3 = pri.tel3;
        pub.member_oldpw = pri.member_oldpw;
        pub.memberPw1 = pri.memberPw1;
        pub.memberPw2 = pri.memberPw2;

        pub.checkMobileNum = pri.checkMobileNum;
        pub.mobile_code = pri.mobile_code;
        pub.numberAuthCode = pri.numberAuthCode;
        pub.mobileNumber = pri.mobileNumber;


        pub.save = pri.save;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.clickMobileCode = pri.clickMobileCode;
        pub.checkMobileCodeCallback = pri.checkMobileCodeCallback;
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
            var member_oldpw = page.view.member_oldpw.val();
            var memberPw1 = page.view.memberPw1.val();
            var memberPw2 = page.view.memberPw2.val();
            var emailAddrFrm = page.view.emailAddrFrm.val();
            if (member_oldpw.length == 0 || member_oldpw == ''){
                alertLayer('현재 비밀번호를 입력해주세요.');
                page.view.member_oldpw.focus();
                return false;
            }
            if (memberPw1.length > 0){
                var passwordValidation = validationCheckPassword(memberPw1, memberPw2);
                if (passwordValidation.result == false) {
                    alertLayer(passwordValidation.message);
                    return false;
                }
             }
            if(emailAddrFrm.length == 0) {
                alertLayer('이메일 주소를 입력해주세요.');
                return false;
            }

            return true;
        };

        pri.loadBankList = function () {
            //pri.getBankList(page.view.loadBankListCallback);
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
                'email_addr' : page.view.emailAddrFrm.val()
                , 'check_mobile_num' : $('#check_mobile_num', page.dom).val()
                , 'numberAuthCode' : page.view.numberAuthCode.val()
                , 'mobile_code' : page.view.mobile_code.val()
                , 'mobileNumber' : page.view.mobileNumber.val()
            };


            var memberPw = page.view.memberPw1.val();
            if(memberPw.length > 0) {
                args.param.mpass = memberPw;
            }
            var memberOldPw = page.view.member_oldpw.val();
            if(memberOldPw.length > 0) {
                args.param.oldmpass = memberOldPw;
            }
            this.doRequest(callback, args);
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

        pub.memberAuthChk = function(dupinfo_yn) {

            if(dupinfo_yn == "Y") {
                $("#member_auth_chk .span_text").text("본인인증완료");
                $("#member_auth_chk").attr("href","#");
            }
            else {
                $("#member_auth_chk .span_text").text("본인인증하기");
                $("#member_auth_chk").attr("href","certifyUserByMobileNew.html?returnUrl="+encodeURIComponent("myPageUserInfo.html"));
            }
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

            page.view.clickMobileCode.on('click', function (event, ui) {
                event.preventDefault();
                pri.checkMobileCodeAddr();
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