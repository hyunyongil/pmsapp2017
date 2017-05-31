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
        pri.checkDuplicateEmailAddrArgs = {
            url: CONSTANTS.MEMBER.CHECK_EMAIL,
            type: CONSTANTS.METHOD.POST
        };
        pri.checkMobileCodeArgs = {
            url: CONSTANTS.MEMBER.CHECK_MOBILE_CODE,
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
        pub.checkDuplicateEmailAddrArgs = pri.checkDuplicateEmailAddrArgs;
        pub.checkMobileCodeArgs = pri.checkMobileCodeArgs;
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

        pri.memberId = $('#frm_member_id', page.dom);
        pri.memberName = $('#frm_member_name', page.dom);
        pri.recommend_id = $('#frm_recommend_id', page.dom);
        pri.memberPw1 = $('#frm_member_pw1', page.dom);
        pri.memberPw2 = $('#frm_member_pw2', page.dom);
        pri.emailAddr = $('#frm_email_addr', page.dom);
        pri.mobileNumber = $('#frm_mobile_num', page.dom);
        pri.numberAuthCode = $('#frm_number_auth_code', page.dom);
        pri.agree = $('#frm_agree', page.dom);
        pri.agree2 = $('#frm_agree2', page.dom);
        pri.agree_all = $('#frm_agree_all', page.dom);

        pri.checkDuplicateMemeberId = $('#check_duplicate_memeber_id', page.dom);
        pri.checkDuplicateEmail = $('#check_duplicate_email', page.dom);
        pri.checkMobileNum = $('#check_mobile_num', page.dom);

        pri.signUp = $('.sign_up_step', page.dom);
        //pri.signUp = $('#sign_up', page.dom);
        pri.clickMobileCode = $('#clickMobileCode', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.checkDuplicateMemeberIdCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                //$('.li_form_validate.chk_member_id span').text('');
                $('#check_duplicate_memeber_id', page.dom).val('Y');
            }
            else {
                $('#check_duplicate_memeber_id', page.dom).val('N');
                alertLayer("이미 사용중인 아이디 입니다.");
                //$('.li_form_validate.chk_member_id span').text('이미 사용중인 아이디 입니다.').css({"font-size":"0.8em","color":"#ff0000"});
            }
        };
        pri.checkDuplicateEmailAddrCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                //$('.li_form_validate.chk_email_addr span').text('');
                $('#check_duplicate_email', page.dom).val('Y');
            }
            else {
                $('#check_duplicate_email', page.dom).val('N');
                //alertLayer("이미 사용중인 이메일 입니다.");
                //$('.li_form_validate.chk_email_addr span').text('이미 사용중인 이메일 입니다.').css({"font-size":"0.8em","color":"#ff0000"});
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

        pri.signUpCallback = function (data) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                COMMON.token.put(data.result.token);

                //jms.page.startActivity('signUpComplete.html');
                location.hash = "step5";
            } else {
                alertLayer(ONPANEL.Ajax.Result.getMessage(data));
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.memberId = pri.memberId;
        pub.memberName = pri.memberName;
        pub.recommend_id = pri.recommend_id;
        pub.memberPw1 = pri.memberPw1;
        pub.memberPw2 = pri.memberPw2;
        pub.emailAddr = pri.emailAddr;
        pub.mobileNumber = pri.mobileNumber;
        pub.numberAuthCode = pri.numberAuthCode;
        pub.agree = pri.agree;
        pub.agree2 = pri.agree2;
        pub.agree_all = pri.agree_all;
        pub.checkDuplicateMemeberId = pri.checkDuplicateMemeberId;
        pub.checkDuplicateEmail = pri.checkDuplicateEmail;
        pub.checkMobileNum = pri.checkMobileNum;

        pub.checkDuplicateMemeberId = pri.checkDuplicateMemeberId;
        pub.signUp = pri.signUp;
        pub.clickMobileCode = pri.clickMobileCode;

        // ////////////////////////////
        // public functions
        // ////////////////////////////

        // initial View
        pub.init = function () {
        };

        pub.checkDuplicateMemeberIdCallback = pri.checkDuplicateMemeberIdCallback;
        pub.checkDuplicateEmailAddrCallback = pri.checkDuplicateEmailAddrCallback;
        pub.checkMobileCodeCallback = pri.checkMobileCodeCallback;
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

        /**
         * 회원 암호 체크
         */
        pri.mpassChk = function (mpass,mpass2) 
        {

    
            if(!/^[a-zA-Z0-9~!@#$%^&*]{8,16}$/.test(mpass)){
                return "숫자와 영문,특수문자 조합으로 8~16자리를 사용해야 합니다.";
            }

            var chk_num = mpass.search(/[0-9]/g);
            var chk_eng = mpass.search(/[a-z]/ig);
            if(chk_num < 0 || chk_eng < 0)
            {
                return "비밀번호는 숫자와 영문,특수문자를 혼용하여야 합니다.";
            }
    
            return true;
        };

        /**
         * 회원아이디 NULL 체크
         */
        pri.midChk = function (mid)
        {
            if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(mid)) {
                return "아이디에 한글이 포함될 수 없습니다.";
            }

            return true;
        };
        
            
        pri.validation = function () {
            var memberId = page.view.memberId.val();
            var memberPw1 = page.view.memberPw1.val();
            var memberPw2 = page.view.memberPw2.val();
            var recommend_id = page.view.recommend_id.val();
            var memberName = page.view.memberName.val();
            var emailAddr = page.view.emailAddr.val();
            var mobileNumber = page.view.mobileNumber.val();
            var numberAuthCode = page.view.numberAuthCode.val();
            var agree = page.view.agree;
            var agree2 = page.view.agree2;
            var checkDuplicateMemeberId = page.view.checkDuplicateMemeberId.val();
            var checkDuplicateEmail = page.view.checkDuplicateEmail.val();
            var checkMobileNum = page.view.checkMobileNum.val();

            var hash = location.hash;

            // Set the page title based on the hash.
            var step_id =  hash.replace( /^#/, '' );


            if(step_id == "step2") {
                if(memberId.length == 0) {
                    alertLayer('아이디를 입력해주세요.');
                    page.view.memberId.focus();
                    return false;
                }
                else {
                    var member_id_chk = pri.midChk(memberId);

                    if(member_id_chk !== true) {
                        alertLayer(member_id_chk);
                        return false;
                    }
                }

                if(memberName.length == 0) {
                    alertLayer('이름을 입력해주세요.');
                    page.view.memberName.focus();
                    return false;
                }

                if(page.view.emailAddr.val().length == 0) {
                    alertLayer('이메일 주소를 입력해주세요.');
                    page.view.emailAddr.focus();
                    return false;
                }
                else {
                    var pattern = /([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)\.([0-9a-zA-Z_-]+)/;
                    if (!pattern.test(page.view.emailAddr.val()))
                    {
                        alertLayer('이메일 주소형식이 맞지 않습니다.');
                        page.view.emailAddr.focus();
                        return false;
                    }
                }

                if($('#check_duplicate_memeber_id', page.dom).val() == "N") {
                    alertLayer("이미 가입된 아이디입니다");
                    return false;
                }

                if($('#check_duplicate_email', page.dom).val() == "N") {
                    alertLayer("이미 가입된 이메일입니다");
                    return false;
                }

                location.hash = "step3";

                return false;
            }

            if(step_id == "step3") {
                if(memberPw1.length == 0) {
                    alertLayer('비밀번호를 입력해주세요.');
                    page.view.memberPw1.focus();
                    return false;
                }
                else {
                    var member_pw_chk = pri.mpassChk(memberPw1,memberPw2);

                    if(member_pw_chk !== true) {
                        alertLayer(member_pw_chk);
                        return false;
                    }
                }

                if(memberPw1 != memberPw2) {
                    alertLayer('비밀번호를 확인해주세요.');
                    page.view.memberPw2.focus();
                    return false;
                }

                location.hash = "step4";

                return false;
            }


            if(step_id == "step4") {

                if(mobileNumber.length == 0) {
                    alertLayer('휴대폰 번호를 입력해주세요.');
                    page.view.mobileNumber.focus();
                    return false;
                }
                if(numberAuthCode.length == 0) {
                    alertLayer('인증번호를 입력해주세요.');
                    page.view.numberAuthCode.focus();
                    return false;
                }
            }


            //if(agree.is(":checked") == false) {
            //    alertLayer('이용약관 내용에 동의 해주세요.');
            //    page.view.agree.focus();
            //    return false;
            //}
            //if(agree2.is(":checked") == false) {
            //    alertLayer('개인보호정책 내용에 동의 해주세요.');
            //    page.view.agree.focus();
            //    return false;
            //}

            if(checkDuplicateMemeberId == "N") {
                alertLayer("이미 사용중인 아이디가 있습니다.");
                return false;
            }
            if(checkDuplicateEmail == "N") {
                alertLayer("이미 사용중인 이메일이 있습니다.");
                return false;
            }
            if(checkMobileNum == "N") {
                alertLayer("인증번호가 잘못되었습니다.");
                page.view.numberAuthCode.focus();
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

        pri.checkDuplicateEmailAddr = function () {
            var args = page.model.checkDuplicateEmailAddrArgs;
            args.param = {
                'email_addr': page.view.emailAddr.val()
            };

            this.doRequest(page.view.checkDuplicateEmailAddrCallback, args);
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

            //var certInfo = page.model.config.certInfo;

            var args = page.model.signUpArgs;
            args.param = {
                member_id: page.view.memberId.val(),
                member_pw: page.view.memberPw1.val(),
                member_name: page.view.memberName.val(),
                recommend_id: page.view.recommend_id.val(),
                email_addr: page.view.emailAddr.val(),
                mobile_num: page.view.mobileNumber.val(),
                mobile_auth_code: page.view.numberAuthCode.val(),
                mobile_code : $('#mobile_code', page.dom).val() ,
                uuid: 'temp',
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
            page.view.memberId.on('blur', function (event, ui) {
                if($(this).val() != "") {
                    pri.checkDuplicateMemeberId();
                }
            });
            page.view.emailAddr.on('blur keypress keyup', function (event, ui) {
                if($(this).val() != "") {
                    pri.checkDuplicateEmailAddr();
                }
            });

            page.view.checkDuplicateMemeberId.on('click', function (event, ui) {
                event.preventDefault();

                pri.checkDuplicateMemeberId();
            });

            page.view.signUp.on('click', function (event, ui) {
                event.preventDefault();
                pri.signUp();
            });
            page.view.clickMobileCode.on('click', function (event, ui) {
                event.preventDefault();
                pri.checkMobileCodeAddr();
            });
            page.view.agree_all.on('click', function (event, ui) {
                if(!$(this).is(":checked")) {
                    $('#frm_agree', page.dom).prop('checked', false).checkboxradio('refresh');
                    $('#frm_agree2', page.dom).prop('checked', false).checkboxradio('refresh');
                }
                else {
                    $('#frm_agree', page.dom).prop('checked', true).checkboxradio('refresh');
                    $('#frm_agree2', page.dom).prop('checked', true).checkboxradio('refresh');
                }
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