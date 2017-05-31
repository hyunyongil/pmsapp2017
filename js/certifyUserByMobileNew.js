$(document).one('pageinit', '#certifyUserByMobile_page', function () {
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

        pri.requestCertNumberArgs = {
            url: CONSTANTS.MEMBER.AUTH,
            type: CONSTANTS.METHOD.POST
        };

        pri.certifyUserArgs = {
            url: CONSTANTS.MEMBER.AUTH_CONFIRM,
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

        pub.requestCertNumberArgs = pri.requestCertNumberArgs;
        pub.certifyUserArgs = pri.certifyUserArgs;

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

        pri.name = $('#name', page.dom);
        pri.birthday = $('#birthday', page.dom);
        pri.gender = $(':radio[name="gender"]', page.dom);
        pri.nation = $(':radio[name="nation"]', page.dom);
        pri.mobileProvider = $('#tel_com_cd', page.dom);
        pri.mobileNumber = $('#mbphn_no', page.dom);
        pri.certNumber = $('#cert_num', page.dom);

        pri.requestCertNumber = $('#request_cert_num', page.dom);
        pri.certify = $('#certify', page.dom);

        pri.agree = $('#frm_agree', page.dom);
        pri.agree2 = $('#frm_agree2', page.dom);
        pri.agree3 = $('#frm_agree3', page.dom);
        pri.agree4 = $('#frm_agree4', page.dom);
        pri.agree_all = $('#frm_agree_all', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.requestCertNumberCallback = function (data) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                var result = ONPANEL.Ajax.Result.getData(data);

                page.model.config.certInfo = result;
            }
            else {
                alertLayer(data.resultMsg);
            }

            page.view.requestCertNumber.removeClass('ui-disabled');
            pri.certify.button('enable');
        };

        pri.certifyUserCallback = function (data) {
            var returnUrl = gup("returnUrl");

            if(returnUrl) {
                returnUrl = decodeURIComponent(returnUrl);
            }


            if (ONPANEL.Ajax.Result.isSucess(data)) {
                var result = ONPANEL.Ajax.Result.getData(data);

                location.href = returnUrl;

                //var callback = page.model.config.callback;
                //
                //if (callback && callback.page)
                //    jms.page.startActivity(callback.page, {certInfo: result, callback: callback});
                //else
                //    jms.page.finish({certInfo: result, callback: callback});
            } else {
                alertLayer(ONPANEL.Ajax.Result.getMessage(data));
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.name = pri.name;
        pub.birthday = pri.birthday;
        pub.gender = pri.gender;
        pub.nation = pri.nation;
        pub.mobileProvider = pri.mobileProvider;
        pub.mobileNumber = pri.mobileNumber;
        pub.certNumber = pri.certNumber;

        pub.requestCertNumber = pri.requestCertNumber;
        pub.certify = pri.certify;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.requestCertNumberCallback = pri.requestCertNumberCallback;
        pub.certifyUserCallback = pri.certifyUserCallback;

        pub.agree_all = pri.agree_all;
        pub.agree = pri.agree;
        pub.agree2 = pri.agree2;
        pub.agree3 = pri.agree3;
        pub.agree4 = pri.agree4;

        // initial View
        pub.init = function() {
            pri.certify.button('disable');
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
            if (page.view.name.val().length == 0) {
                alertLayer('이름을 입력해주세요.');
                page.view.name.focus();

                return false;
            }

            if (page.view.birthday.val().length == 0) {
                alertLayer('생년월일을 입력해주세요.');
                page.view.birthday.focus();

                return false;
            }

            if (page.view.mobileNumber.val().length == 0) {
                alertLayer('휴대폰 번호를 입력해주세요.');
                page.view.mobileNumber.focus();

                return false;
            }

            return true;
        };

        pri.requestCertNumber = function () {
            if (!this.validation())
                return;

            page.view.requestCertNumber.addClass('ui-disabled');

            var args = page.model.requestCertNumberArgs;
            args.param = {
                name: page.view.name.val(),
                birthday: page.view.birthday.val(),
                gender: page.view.gender.filter(':checked').val(),
                nation: page.view.nation.filter(':checked').val(),
                tel_com_cd: page.view.mobileProvider.val(),
                mbphn_no: page.view.mobileNumber.val(),
                rqst_caus_cd: ''
            };

            this.doRequest(page.view.requestCertNumberCallback, args);
        };

        pri.certifyUser = function () {
            var args = page.model.certifyUserArgs;
            args.param = {
                svc_tx_seqno: page.model.config.certInfo.svc_tx_seqno,
                member_token: page.model.config.certInfo.member_token,
                gender: page.view.gender.filter(':checked').val(),
                birthday: page.view.birthday.val(),
                mbphn_no: page.view.mobileNumber.val(),
                sms_cert_no: page.view.certNumber.val()
            };

            this.doRequest(page.view.certifyUserCallback, args);
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
            page.view.requestCertNumber.on('click', function (event, ui) {
                event.preventDefault();

                //if(!$('#frm_agree', page.dom).is(":checked")) {
                //    alertLayer("개인정보 이용에 동의 해주세요.");
                //    return false;
                //}
                //if(!$('#frm_agree2', page.dom).is(":checked")) {
                //    alertLayer("개인정보 수집/이용/취급위탁에 동의 해주세요.");
                //    return false;
                //}
                //if(!$('#frm_agree3', page.dom).is(":checked")) {
                //    alertLayer("고유식별 정보처리에 동의 해주세요.");
                //    return false;
                //}
                //if(!$('#frm_agree4', page.dom).is(":checked")) {
                //    alertLayer("통신사 본인확인 서비스 이용에 동의 해주세요.");
                //    return false;
                //}

                if(!$('#frm_agree', page.dom).hasClass("on")) {
                    alertLayer("개인정보 이용에 동의 해주세요.");
                    return false;
                }
                if(!$('#frm_agree2', page.dom).hasClass("on")) {
                    alertLayer("개인정보 수집/이용/취급위탁에 동의 해주세요.");
                    return false;
                }
                if(!$('#frm_agree3', page.dom).hasClass("on")) {
                    alertLayer("고유식별 정보처리에 동의 해주세요.");
                    return false;
                }
                if(!$('#frm_agree4', page.dom).hasClass("on")) {
                    alertLayer("통신사 본인확인 서비스 이용에 동의 해주세요.");
                    return false;
                }

                pri.requestCertNumber();
            });

            page.view.certify.on('click', function (event, ui) {
                event.preventDefault();

                pri.certifyUser();
            });

            page.view.agree_all.on('click', function (event, ui) {
                if(!$(this).is(":checked")) {
                    $('#frm_agree', page.dom).prop('checked', false).checkboxradio('refresh');
                    $('#frm_agree2', page.dom).prop('checked', false).checkboxradio('refresh');
                    $('#frm_agree3', page.dom).prop('checked', false).checkboxradio('refresh');
                    $('#frm_agree4', page.dom).prop('checked', false).checkboxradio('refresh');
                }
                else {
                    $('#frm_agree', page.dom).prop('checked', true).checkboxradio('refresh');
                    $('#frm_agree2', page.dom).prop('checked', true).checkboxradio('refresh');
                    $('#frm_agree3', page.dom).prop('checked', true).checkboxradio('refresh');
                    $('#frm_agree4', page.dom).prop('checked', true).checkboxradio('refresh');
                }
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