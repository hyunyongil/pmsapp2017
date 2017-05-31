

/*
 // 변수
 COMMON.PAGE : 페이징 관련 변수
 COMMON.CONFIG : request 관련 변수
 COMMON.OPTIONS : common 관련 변수
 COMMON.GLOBALDATA : 공통 GLOBAL DATA 관련변수

 // 함수모음
 COMMON.logger : 로그 관련 메서드 모음
 COMMON.device : DEVICE 관련 메서드 모음
 COMMON.html : HTML 관련 메서드 모음
 COMMON.validate : 유효성 검사 관련 메서드 모음
 COMMON.date : 날짜 관련 메서드 모음
 COMMON.formatter : 형식 변경 관련 메서드 모음
 COMMON.plugin : SDS HYBRID PLUGIN 메서드 모음
 COMMON.util : UTIL 관련 메서드 모음
 COMMON.locale : 다국어 메서드 모음
 COMMON.regExp : 정규식 관련 메서드 모음
 COMMON.navigation : 페이지 이동 관련 메서드 모음
 COMMON.global : global data 관련 메소드 함수
 COMMON.token : Token 관련 메소드 함수
 COMMON.storage : Local Storage 관련 메소드 함수
 */

var COMMON;
if (!COMMON) {
    COMMON = {};
    COMMON.PAGE = {
        'PAGE_LIST_COUNT' : 10,
        'PAGE_START_NUM' : 1,
        'PAGE_END_NUM' : 10,
        'PAGE_MAX_NUM' : 300,
        'TITLE' : 'SDI MOBILE',
        'MAIN_PAGE' : 'punctualityIndex'
    };

    COMMON.OPTIONS = {
        home: '',
        logLev: 4,
        currentTime: new Date(),
        orientation: null,
        agent: navigator.userAgent,
        initWidth: 0,
        initHeight: 0,
        isProcMobileBack: false, // Android에서만 유효한 옵션
        disableMobileBack: false // Android에서만 유효한 옵션
    };

    COMMON.GLOBALDATA = {
        'loaderTitle': '',
        'loaderContent': '잠시만 기다려주세요.'
    };
}

(function ($, COMMON) {
    // //////////////////////
    // 로그 관련 메서드 모음
    // //////////////////////
    COMMON.logger = {
        lv: {
            'error': 1,
            'warn': 2,
            'info': 3,
            'debug': 4
        },
        error: function(msg){
            if (this.lv.error <= COMMON.OPTIONS.logLev) {
                var err = new Error(msg);
                if (!err.message)
                    err.message = msg;
                err.name = "Common CustomError";
                return err;
            }
        },
        warn: function(msg){
            if (this.lv.warn <= COMMON.OPTIONS.logLev) {
                console.warn(msg);
            }
        },
        info: function(msg){
            if (this.lv.info <= COMMON.OPTIONS.logLev) {
                console.info(msg);
            }
        },
        debug: function(msg){
            if (this.lv.debug <= COMMON.OPTIONS.logLev) {
                console.debug(msg);
            }
        }
    };

    // //////////////////////
    // DEVICE 관련 메서드 모음
    // //////////////////////
    COMMON.device = {
        /**
         * 현재 접속 환경이 안드로이드인지 아닌지를 반환합니다.
         *
         * @returns {Boolean} : 안드로이드 여부
         */
        isAndroid : function(){
            return (/Android/.test(COMMON.OPTIONS.agent));
        },
        /**
         *
         * 현재 접속 환경이 아이폰이지를 반환합니다.
         *
         * @returns { Boolean } : 아이폰 여부
         */
        isIphone : function(){
            return (/iPhone/.test(COMMON.OPTIONS.agent));
        },
        /**
         *
         * 현재 접속 환경이 아이패드인지를 반환합니다.
         *
         * @returns { Boolean } : 아이폰 여부
         */
        isIpad : function(){
            return (/iPad/.test(COMMON.OPTIONS.agent));
        },
        /**
         * 현재 접속 환경이 모바일인지 아닌지를 반환합니다.
         *
         * @returns {Boolean} : 모바일 여부
         */
        isMobile : function(){
            return (/Mobile/.test(COMMON.OPTIONS.agent) ||
            this.isIphone() ||
            this.isAndroid());
        },
        /**
         * 현재 방향을 얻음 ( 가로 / 세로 여부 )
         *
         * @returns {String} : landscape | portrait
         */
        getOrientation : function(){
            var objWindow = $(window);

            if (objWindow.width() > objWindow.height()) {
                objWindow = null;
                return "landscape";
            }
            else {
                objWindow = null;
                return "portrait";
            }
        }
    };


    // //////////////////////
    // HTML 관련 메서드 모음
    // //////////////////////
    COMMON.html = {
        /**
         * 해당 객체의 스타일값을 얻는 메서드
         *
         * @param elm : {Dom Element} : 스타일값을 찾을 객체
         * @param prop : {String} : 스타일 이름
         * @returns {String} : 스타일 값
         */
        getStyle : function(elm, prop){
            var returnVal, computedStyle;
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var defaultView = elm.ownerDocument.defaultView;
                computedStyle = defaultView.getComputedStyle(elm, null);
                defaultView = null;
            }
            else {
                computedStyle = window.getComputedStyle(elm, null);
            }
            returnVal = computedStyle.getPropertyValue(prop);
            computedStyle = null;

            return returnVal;
        },
        /**
         * selectbox 에 option을 생성해주는 메서드
         *
         * @param pagedom : {object} : select box를 찾을 페이지
         * @param objId : {STRING} : SELECTBOX ID
         * @param data : {JSON} : SELECTBOX에 값을 넣을 데이터
         * @param keyMap : {JSON} : SELECTBOX에 값을 넣을 value, text keymap( ex. {value:'SHOPID', text:'SHOPNAME'} )
         * @param all : {BOOLEAN} : OPTION ALL 사용여부( 생략가능 )
         * @param allText : {STRING} : OPTION ALL 사용할 문구( 생략가능 )
         * @param selectindex : {INT} : SELECT BOX 세팅 후 선택될 값. ( 생략가능, default 0 )
         * @returns
         */
        selectboxSetData : function( pagedom, objId, data, keyMap, all, allText, selectindex ){
            var idx = 0 ;
            var _allText = 'ALL';
            $("#" + objId, pagedom).empty();
            if(all){
                if(COMMON.validate.isValidStr(allText)) _allText = allText;
                $("#" + objId, pagedom).append(new Option(_allText, '_all_', false, false));
            }
            if(data && $.isArray(data)){
                for(var i=0; i < data.length; i++){
                    $("#" + objId, pagedom).append(new Option(data[i][keyMap.text], data[i][keyMap.value], false, false));
                }
            } else if(data){
                $("#" + objId, pagedom).append(new Option(data[keyMap.text], data[keyMap.value], false, false));
            }
            if(selectindex && selectindex > 0) idx = selectindex;
            $("#" + objId + " option:eq(" + idx + ")", pagedom).attr("selected", "selected");
            $("#" + objId, pagedom).selectmenu("refresh");
        },
        /**
         * selectbox 에 선택된 option의 값을 조회하는 메서드
         *
         * @param pagedom : {object} : select box를 찾을 페이지
         * @param objId : {STRING} : SELECTBOX ID
         * @returns {STRING} : SELECTBOX value
         */
        getSelectboxValue : function( pagedom, objId ){
            var result = '' ;

            result = $("#" + objId, pagedom).val();

            // 필수선택이 아닌 select box에 전체를 선택했을 경우 임의의 값을 지운다.
            if(result && result == '_all_'){
                result = '';
            }
            return result;
        },
        /**
         * selectbox 에 선택된 option의 text를 조회하는 메서드
         *
         * @param pagedom : {object} : select box를 찾을 페이지
         * @param objId : {STRING} : SELECTBOX ID
         * @returns {STRING} : SELECTBOX TEXT
         */
        getSelectboxText : function( pagedom, objId ){
            var result = '' ;

            result = $("#" + objId, pagedom).text();

//			// 필수선택이 아닌 select box에 전체를 선택했을 경우 임의의 값을 지운다.
//			if(result && result == '_all_'){
//				result = '';
//			}
            return result;
        },
        /**
         * checkbox가 선택되었을 경우 value 값을 리턴
         *
         * @param pagedom : {object} : RADIO를 찾을 페이지
         * @param objId : {object} : CHECKTBOX OBJ
         * @returns {STRING} : CHECKTBOX value
         */
        getCheckboxValue : function( pagedom, obj ) {
            if($(obj, pagedom).is(':checked')){
                return $(obj, pagedom).val();
            } else {
                return '';
            }
        },
        /**
         * RADIO가 선택되었을 경우 value 값을 리턴
         *
         * @param pagedom : {object} : RADIO를 찾을 페이지
         * @param objId : {STRING} : RADIO OBJ NAME
         * @returns {STRING} : RADIO value
         */
        getRadioValue : function( pagedom, objName ) {
            return $(':radio[name="' + objName + '"]:checked', pagedom).val();
        },
        /**
         * selectbox에 선택된 option을 지정하는 메서드
         *
         * @param pagedom : {object} : select box를 찾을 페이지
         * @param objId : {STRING} : RADIO OBJ NAME
         * @param objId : {STRING} : selectbox selected value
         * @returns
         */
        setSelectboxSelected : function( pagedom, objId, val ) {
            if($("#" + objId, pagedom) != undefined){
                $("#" + objId + " option", pagedom).each(function () {
                    console.log('[' + $(this).val() + '][' + val + ']');
                    if($(this).val() == val){
                        $(this).attr("selected", "selected");
                        $("#" + objId, pagedom).selectmenu("refresh");
                        return;
                    }
                });
            }
        }
    };


    // //////////////////////
    // 유효성 검사 관련 메서드 모음
    // //////////////////////
    COMMON.validate = {
        /**
         * 입력된 객체가 유효한 값인지를 반환함
         *
         * @param obj : {Object} : 유효성을 판단할 객체
         * @returns {Boolean} : true ( 유효함 ) / false ( 유효하지 않음 )
         */
        isValid: function(obj){
            return ('undefined' != typeof obj && null != obj);
        },
        /**
         * 입력된 객체가 유효하지 않은 값인지를 반환함
         *
         * @param obj : {Object} : 유효성을 판단할 객체
         * @returns {Boolean} : true ( 유효하지 않음 ) / false ( 유효함 )
         */
        isInvalid: function(obj){
            return ('undefined' == typeof obj || null == obj);
        },
        /**
         * 입력된 문자열이 유효한 값인지를 반환함
         *
         * @param str : {Object} : 유효성을 판단할 문자열
         * @returns {Boolean} : true ( 유효함 ) / false ( 유효하지 않음 )
         */
        isValidStr: function(str){
            return (this.isValid(str) && '' != str);
        },
        /**
         * 입력된 문자열이 유효하지 않은 값인지를 반환함
         *
         * @param str : {Object} : 유효성을 판단할 문자열
         * @returns {Boolean} : true ( 유효하지 않음 ) / false ( 유효함 )
         */
        isInvalidStr: function(str){
            return (this.isInvalid(str) || '' == str);
        },
        /**
         * 입력된 문자열이 숫자로만 이루어져 있는지 체크함
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 숫자형 문자열 ) / false ( 다른 문자가 포함된 문자열 )
         */
        isOnlyNum: function(str){
            return new RegExp(COMMON.regExp.number).test(str);
        },
        /**
         * 입력된 문자열에 숫자가 없는 문자로만 이루어져 있는지를 체크함
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 숫자가 없는 문자열 ) / false ( 숫자가 있는 문자열 )
         */
        isOnlyStr: function(str){
            return new RegExp(COMMON.regExp.string).test(str);
        },
        /**
         * 입력된 오브젝트가 숫자 객체인지 아닌지를 반환함
         *
         * @param obj : {Object} : 체크할 오브젝트
         * @returns {Boolean} : true ( 숫자 객체 ) / false ( 그 외 객체 )
         */
        isNumber: function(obj){
            return ('number' == typeof obj && isFinite(obj));
        },
        /**
         * 입력된 오브젝트가 문자 객체인지 아닌지를 반환함
         *
         * @param obj : {Object} : 체크할 오브젝트
         * @returns {Boolean} : true ( 문자 객체 ) / false ( 그 외 객체 )
         */
        isString: function(obj){
            return ('string' == typeof obj);
        },
        /**
         * 입력된 문자열이 공백을 포함하고 있는지 체크합니다.
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 공백이 포함된 문자열 ) / false ( 공백이 없는 문자열 )
         */
        hasBlank: function(str){
            return new RegExp(COMMON.regExp.hasBlank).test(str);
        },
        /**
         * 입력된 문자열이 4자리의 양수인지를 체크함 ( YYYY 형식 체크에 사용 )
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 4자리 양수 ) / false ( 그외 문자 )
         */
        is4Num: function(str){
            return new RegExp(COMMON.regExp.num4).test(str);
        },
        /**
         * 입력된 문자열이 6자리의 양수인지를 체크함 ( YYYYMM 형식 체크에 사용 )
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 6자리 양수 ) / false ( 그외 문자 )
         */
        is6Num: function(str){
            return new RegExp(COMMON.regExp.num6).test(str);
        },
        /**
         * 입력된 문자열이 8자리의 양수인지를 체크함 ( YYYYMMDD 형식 체크에 사용 )
         *
         * @param str : {String} : 체크할 문자열
         * @returns {Boolean} : true ( 8자리 양수 ) / false ( 그외 문자 )
         */
        is8Num: function(str){
            return new RegExp(COMMON.regExp.num8).test(str);
        }
    };

    // //////////////////////
    // 날짜 관련 메서드 모음
    // //////////////////////
    COMMON.date = {
        /**
         * 현재 년도를 얻음
         *
         * @returns { Integer } : 현재 연도
         */
        getYear: function(){
            return COMMON.OPTIONS.currentTime.getFullYear();
        },
        /**
         * 현재 월수를 얻음
         *
         * @returns { Integer } : 현재 월
         */
        getMonth: function(){
            return COMMON.OPTIONS.currentTime.getMonth() + 1;
        },
        /**
         * 현재 일수를 얻음
         *
         * @returns { Integer } : 현재 일
         */
        getDay: function(){
            return COMMON.OPTIONS.currentTime.getDate();
        },
        /**
         * 날자 Object String으로 변환
         *
         * @param date : {Date} :
         * @returns { string } : "YYYYMMDD"
         */
        getDateObjToStr : function(date){
            var str = new Array();

            var _year = date.getFullYear();
            str[str.length] = _year;

            var _month = date.getMonth()+1;
            if(_month < 10) _month = "0"+_month;
            str[str.length] = _month;

            var _day = date.getDate();
            if(_day < 10) _day = "0"+_day;
            str[str.length] = _day
            var getDateObjToStr = str.join("");

            return getDateObjToStr;
        },
        /**
         * 현재일자
         *
         * @returns { String } : "YYYYMMDD"
         */
        getToday: function(date,period, period_kind){
            var d = new Date();
            var getToday = COMMON.date.getDateObjToStr(d);
            return getToday;
        },
        /**
         * 년도 가감 함수
         *
         * @param date : {String} : 연산할 일자( "yyyymmdd" )
         * @param period : {int} : 가감할 값( 1, 2, 3)
         * @param period_kind : {String} : 연산할 일자( "Y","M","D" )
         * @usage calcDate("20080205", 30, "D")
         * @returns { Integer } : 가감된 년도
         */
        calcDate: function(date,period, period_kind){

            var today = COMMON.date.getToday();

            var in_year = date.substr(0,4);
            var in_month = date.substr(4,2);
            var in_day = date.substr(6,2);

            var nd = new Date(in_year, in_month-1, in_day);
            if(period_kind == "D"){
                nd.setDate(nd.getDate()+period);
            }
            if(period_kind == "M"){
                nd.setMonth(nd.getMonth()+period);
            }
            if(period_kind == "Y"){
                nd.setFullYear(nd.getFullYear()+period);
            }
            var new_date = new Date(nd);
            var calcDate = COMMON.date.getDateObjToStr(new_date);
            return calcDate;
        }
    };

    COMMON.time = {
        getTimeToStr: function(time) {
            return time.substr(0,2) + time.substr(3,2);
        },

        getStrToTime: function(time) {
            return time.substr(0,2) + ':' + time.substr(2,2);
        },

        getMinuteToHour: function(minute) {
            return minute / 60;
        }
    };

    // //////////////////////
    // 형식 변경 관련 메서드 모음
    // //////////////////////
    COMMON.formatter = {
        /**
         * 픽셀 문자열을 숫자로 변경해준다.
         * ex ) 30px ---> 30
         *
         * @param strPixcel : {String} : 픽셀 문자열
         * @returns { Number } : 픽셀 숫자
         */
        pixelToNum: function(strPixel){
            return Number(strPixel.replace(COMMON.regExp.pixelStr, ''));
        },
        /**
         * 입력 데이터가 null 혹은 undefined일 경우 두번째 인자를 반환합니다.
         * 아닐 경우에는 첫번째 인자 ( 입력 데이터 ) 를 반환합니다.
         *
         * @param org : {String} : 원본 데이터 ( 체크 대상 )
         * @param chn : {String} : 원본 데이터가 유효하지 않을 때의 대체 데이터
         * @returns {String} : 유효 데이터
         */
        nvl: function(org, chn){
            if (COMMON.validate.isInvalidStr(org)) {
                return chn;
            }
            else {
                return org;
            }
        },
        addComma: function(nStr){
            if (COMMON.validate.isInvalid(nStr))
                return "0";
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        removeComma: function(nStr){
            return nStr.replace(/,/g, "");
        },
        getDigitString: function(str, digit, fillStr){
            /*
             * str : 원본
             * digit : 자릿수(정수)
             * fillStr : 빈 자리에 채울 문자
             */
            var result = str + '';
            for (var i = result.length; i < digit; i++) {
                result = fillStr + result;
            }
            return result;
        },
        round: function(number, exp){
            return Math.round(Number(number) * Math.pow(10, exp)) / Math.pow(10, exp);
        },
        date: {
            addSlash: function(dateStr, delimeter){
                if (COMMON.validate.isInvalidStr(dateStr))
                    return "";
                var ret = dateStr.replace(/[^0-9]/g, "");

                if (delimeter == undefined || delimeter == null) {
                    delimeter = '-';
                }

                if (ret.length < 6) {
                    return dateStr;
                } else {
                    if (ret.length < 8) {
                        return ret.replace(/(.{6})(.+)/, '$1').replace(/(\d{4})(\d{2})/, '$1' + delimeter + '$2');
                    }
                    else {
                        return ret.replace(/(.{8})(.+)/, '$1').replace(/(\d{4})(\d{2})(\d{2})/, '$1' + delimeter + '$2' + delimeter + '$3');
                    }
                }
                return dateStr;
            },
            getYYYY: function(dateStr){
                return dateStr.replace(/[^0-9]/g, "").replace(/(\d{4})(\d+)/, '$1');
            },
            getYYYYMM: function(dateStr, delimeter){
                return this.addSlash(dateStr.replace(/[^0-9]/g, "").replace(/(\d{6})(.+)/, '$1'), delimeter);
            },
            getYYYYMMDD: function(dateStr, delimeter){
                return this.addSlash(dateStr, delimeter);
            },
            getMM: function(dateStr){
                return dateStr.replace(/[^0-9]/g, "").replace(/(\d{4})(\d+)(\d{2})/, '$2');
            },
            getMMDD: function(dateStr, delimeter){
                if (COMMON.validate.isInvalidStr(dateStr))
                    return "";
                var ret = dateStr.replace(/[^0-9]/g, "");

                if (delimeter == undefined || delimeter == null) {
                    delimeter = '-';
                }

                if (ret.length < 4) {
                    return dateStr;
                } else if(ret.length > 4) {
                    ret = ret.substr( ret.length-4, 4);
                }
                return ret.replace(/(.{4})(.+)/, '$1').replace(/(\d{2})(\d{2})/, '$1' + delimeter + '$2');
            }
        },
        time: {
            addSlash: function(timeStr, delimeter){
                if (COMMON.validate.isInvalidStr(timeStr))
                    return "";
                var ret = timeStr.replace(/[^0-9]/g, "");

                if (delimeter == undefined || delimeter == null) {
                    delimeter = '-';
                }

                if (ret.length < 6) {
                    return timeStr;
                } else {
                    return ret.replace(/(.{6})(.+)/, '$1').replace(/(\d{2})(\d{2})(\d{2})/, '$1' + delimeter + '$2' + delimeter + '$3');
                }

                return timeStr;
            }
        }
    };

    COMMON.list = {
        indexOf: function(list, key, value) {
            for(var i=0; i<list.length; i++) {
                var item = list[i];

                if(item[key] == value)
                    return item;
            }
        }
    };

    // //////////////////////
    // 공통코드 리스트
    // //////////////////////
    COMMON.codeList = {
        'PUNCTUALITY_ECGRP' : 'punctuality_popup_ecGrp',
        'SHIP_TO' : 'punctuality_popup_shipTo',
        'SET_NAME' : 'punctuality_popup_setName',
        'MATERIAL' : 'punctuality_popup_material'
    };

    // //////////////////////
    // 공통 팝업 관련 메서드 모음
    // //////////////////////
    COMMON.fnPopup = function(setting){

        var config = {
            sType: '',
            sCode: '',		// 검색 코드
            vCode: '',
            title: null, 	// CodeHelper Title ( String )
            param: '', 		// 검색 파라메터
            sparam: '',
            fn: null		// 검색 결과 실행시의 콜백함수
        };

        // 설정값 적용 ( 외부 설정이 없을 시, 기본 설정값 사용 )
        if (setting) {
            $.extend(config, setting);
        }

        // 외부 파라메터 설정
        var strParam = "";
        if (null != config.sparam && 0 < config.sparam.length) {

            for (var idx in config.sparam) {
                if (/^#/.test(config.sparam[idx].val)) {
                    // 엘레멘트의 아이디로 시작할 경우
                    if ('' != $(config.sparam[idx].val).val()) {
                        strParam += config.sparam[idx].vname + "=";
                        strParam += $(config.sparam[idx].val).val() + "&";
                    }
                }

            }
        }
        config.param += strParam;

        COMMON.plugin.showLoader();
        var popupCallback = function(resData) {
            //console.log(resData);
            jms.page.startActivity("punctualityPopup.html", {"config" : config, "listData" : resData});
        };

        var reqSetting = COMMON.util.makeReqParam(config);
        COMMON.plugin.doRequest(reqSetting, popupCallback);
    };

    // //////////////////////
    // SDS HYBRID PLUGIN 메서드 모음
    // //////////////////////
    COMMON.plugin = {
        showLoader : function(config){
            var opt = {
                title: COMMON.GLOBALDATA.loaderTitle,
                content: COMMON.GLOBALDATA.loaderContent
            };
            if (config)
                $.extend(opt, config);
            // 로딩바 표시
            if (COMMON.device.isMobile()) {
                JMSUtil.Browser.startLoadingBar(opt);
            }
        },
        hideLoader : function(){
            if (COMMON.device.isMobile())
                JMSUtil.Browser.stopLoadingBar();
        },
        datePicker : function(id, type){
            if (COMMON.validate.isInvalidStr(id)) {
                alertLayer("DatePicker id를 입력해주세요.");
                return;
            }
            if (!COMMON.device.isMobile()){
                $("#"+id).removeAttr("readonly");
                return;
            }
            var date = $('#' + id).val();
            $('#' + id).val("");
            if (COMMON.validate.isInvalidStr(date)) {
                date = COMMON.date.getYear() + "/" + (COMMON.date.getMonth() + '').lpad(2, '0') + "/" + (COMMON.date.getDay() + '').lpad(2, '0');
            }
            JMSMgr.exec("DatePicker.createView", function(outputDate){
                $('#' + id).val(outputDate);
            }, function(error){
                //				alertUtil("", "", {'message':error,'label':'확인'});
            }, {
                'date': date,
                'type': type
            });
        },
        /**
         * request sending
         *
         * @param param : {object json} : request parameter
         * @param successFn : {function} : request success function
         * @param errorFn : {function} : request error function
         * @param startLoadingFlag : {boolean} : start lodaing bar use flag
         * @param stopLoadingFlag : {boolean} : stop lodaing bar use flag
         * @returns callback
         */
        doRequest : function(param, successFn, errorFn, startLoadingFlag, stopLoadingFlag) {
            if(COMMON.validate.isValid(startLoadingFlag) && startLoadingFlag == true ) JMSUtil.Browser.startLoadingBar({content:"데이터를 요청중입니다."});
            JMSUtil.Browser.startLoadingBar({content:"데이터를 요청중입니다."});

            console.log("TEST:"+JSON.stringify(param));

            param.invoke(param.url,
                param.param,
                function(data) {
                    JMSUtil.Browser.stopLoadingBar();

                    successFn(data);
                },
                function(error) {
                    JMSUtil.Browser.stopLoadingBar();
                    if($.isFunction(errorFn)){
                        errorFn(error);
                    } else {
                        console.log("TEST:"+JSON.stringify(error));
                        // alertLayer(error);
                        alertLayer("네트워크 오류가 발생하였습니다.");
                    }

                    try{
                        onsolMoreList.scroll_mode = true;
                    }
                    catch(e) { }
                },
                true
            );
        },
        /**
         * android 에서 device back 키를 눌렀을 경우 이벤트 실행
         *
         */
        onBack : function() {
            COMMON.navigation.back();
        },
        /**
         * header refrash
         *
         */
        headerRefrash : function(obj) {
            obj.find('div[data-role="header"] .refrash').each(function() {
                $(this).refreshElement();
            });
        },
        /**
         * footer refrash
         *
         */
        footerRefrash : function(obj) {
            obj.find('div[data-role="footer"] .refrash').each(function() {
                $(this).refreshElement();
            });
        },
    };

    // //////////////////////
    // UTIL 메서드 모음
    // //////////////////////
    COMMON.util = {
        objectCopy : function (obj) {
            if ( obj != null && obj != undefined ) return JSON.parse(JSON.stringify(obj));
            else return null;
        },
        // request make parameter
        makeReqParam : function(args) {
            var config = {}
            config.url = args.url;
            config.param = args.param;

            if(args.type == CONSTANTS.METHOD.GET)
                config.invoke = ONPANEL.Ajax.Request.invokeGet;
            else
                config.invoke = ONPANEL.Ajax.Request.invokePostByJSON;

            return config;
        },
        /**
         * composite result data를 1건, 다건에 따라 loop를 돌릴 수 있도록 변환
         *
         * @param resData : composite result data
         * @param key : composite service name(ex. 'TOTAL_CNT', 'LIST' ..)
         * @returns json
         */
        compositeConversion : function(resData, key){
            var result = [] ;
            if(resData && resData[key]){
                if(resData[key].result.item){
                    result[0] = resData[key].result.item;
                } else {
                    result = resData[key].result;
                }
            }
            return result;
        },
        getLocaleFileName : function(){
            var sLoc = location.href;
            var cssName = '';
            if(sLoc != null && sLoc != ''){
                var aLoc = sLoc.split('/www/');
                if(aLoc.length == 2){
                    var aNum = aLoc[1].split('Index.html');
                    if(aNum.length>0) cssName = aNum[0];
                }
            }
            return cssName;
        }
    };

    // //////////////////////
    // 다국어 메서드 모음
    // //////////////////////
    COMMON.locale = {
        // GET LOCALE STATUS
        get : function(){
            var lang = '';

            lang = 'ko_KR';

            // locale 가져오는 로직
            //lang = SUI.config({locale: lang, localePath:'lang/'});

            return lang;
        },
        // SET LOCALE STATUS
        set : function(lang){
            // locale set
            var locale = localStorage.getItem("locale");

            if (locale && typeof (locale) != "undefined") {
                // 저장된 locale가 있을 경우 가져와서 리턴한다.
                return locale;
            } else {
                // 저장된 locale이 없을 경우 기본 locale을 지정한다.
                return defaultConfig.locale;
            }
        }
    };


    // //////////////////////
    // 정규식 관련 메서드 모음
    // //////////////////////
    COMMON.regExp = {
        number: /^(-|)\d+$/, // 숫자인지 판별
        string: /^\D$/g, // 문자인지 판별
        pixelStr: /px$/g, // px 단위인지 판별 ( 마지막이 px인지 )
        blank: /\s/g, // 공백인지 판별
        hasBlank: /^.+\s.+$/g, // 공백을 가지고 있는지 판별
        num4: /^\d{4}$/g, // 4자리의 양수인지 판별 ( YYYY )
        num6: /^\d{6}$/g, // 6자리의 양수인지 판별 ( YYYYMM )
        num8: /^\d{8}$/g // 8자리의 양수인지 판별 ( YYYYMMDD )
    };

    // //////////////////////
    // page navigation 관련 메소드 함수
    // //////////////////////
    COMMON.navigation = {
        back : function(){
            if (($.mobile.firstPage.attr('id') == $.mobile.activePage.attr('id')) || (2 > $.mobile.urlHistory.stack.length)) {
                if (confirm('종료하시겠습니까?')) {
                    JMSUtil.Browser.terminateApp(JMSUtil.Browser.START_LAUNCHER);
                    return;
                }
            }
            else {
                jms.page.finish();
            }
        },
        home : function(){
            var sLoc = location.href;
            var indexPage = COMMON.PAGE.MAIN_PAGE + ".html";
            window.location.href = indexPage;
        },
        tab : function(id) {
            setTimeout(function() {
                var tabFlag = false
                $('[data-role=page]').each(function(){
                    if(tabFlag){
                        $('[data-role=header]', $(this)).hide();
                        $('[data-role=footer]', $(this)).hide();
                    }
                    if($(this).attr('id') == id){
                        tabFlag = true;
                        $('[data-role=header]', $(this)).show();
                        $('[data-role=footer]', $(this)).show();
                    }
                })
                if(tabFlag){
                    jms.page.backTrace(id);
                } else {
                    if(id == 'myRoute_page') jms.page.startActivity("myRoute.html");
                    else if(id == 'routeMapSearch_page') jms.page.startActivity('routeMapSearch.html');
                    else if(id == 'routeSearch_page') jms.page.startActivity('routeSearch.html');
                }
            }, 2000);
        }
    };

    // //////////////////////
    // global data 관련 메소드 함수
    // //////////////////////
    COMMON.globalData = {
        set : function(jsonData){
            if(jsonData){
                for (var key in jsonData) {
                    if (jsonData.hasOwnProperty(key)) {
                        COMMON.GLOBALDATA[key] = jsonData[key];
                    }
                }
            }
        },
        get : function(key){
            return COMMON.GLOBALDATA[key];
        }
    };

    COMMON.storage = {
        put : function(key, data) {
            window.localStorage.setItem(key, data)
        },

        get : function(key) {
            return window.localStorage.getItem(key);
        },

        remove : function(key) {
            window.localStorage.removeItem(key);
        }
    };

    COMMON.token = {
        put : function(token) {
            COMMON.storage.put(CONSTANTS.TOKEN_KEY, token);
        },

        get : function() {
            return COMMON.storage.get(CONSTANTS.TOKEN_KEY);
        },

        clear : function() {
            COMMON.storage.remove(CONSTANTS.TOKEN_KEY);
        }
    };

    /**
     * android 에서 device back 키를 눌렀을 경우 이벤트 실행
     *
     */
    //JMSBasic.Event.addListener('backKey', COMMON.plugin.onBack);

}(window.jQuery, COMMON));

function getUUID() {
    return 'tmep';
}

function signJWT(jsonObject) {
    var sJsonObject = JSON.stringify(jsonObject);

    var sHeader = JSON.stringify(CONSTANTS.JWT.HEADER);
    var signedJsonObject = KJUR.jws.JWS.sign(null, sHeader, sJsonObject, CONSTANTS.JWT.KEY, CONSTANTS.JWT.PASS);

    return signedJsonObject;
}

(function ($) {
    "use strict";

    $.fn.getInputType = function () {

        return this[0].tagName.toString().toLowerCase() === "input" ?
            $(this[0]).prop("type").toLowerCase() :
            this[0].tagName.toLowerCase();

    }; // getInputType

}(jQuery));

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

function validationCheckPassword(passwd1, passwd2) {
    var errorMessage = '';
    if (passwd1.length == 0) {
        errorMessage = '비밀번호를 입력해주세요.';
    } else {
        if(!/^[a-zA-Z0-9~!@#$%^&*]{8,16}$/.test(passwd1)){
            errorMessage = "숫자와 영문,특수문자 조합으로 8~16자리를 사용해야 합니다.";
        } else {
            var chk_num = passwd1.search(/[0-9]/g);
            var chk_eng = passwd1.search(/[a-z]/ig);
            if(chk_num < 0 || chk_eng < 0) {
                errorMessage =  "비밀번호는 숫자와 영문,특수문자를 혼용하여야 합니다.";
            } else {
                if(passwd1 != passwd2) {
                    errorMessage = '비밀번호를 확인해주세요.';
                }
            }
        }
    }
    return {result:errorMessage.length == 0, message:errorMessage};
}

function alertLayer(con) {

    try{
        navigator.notification.alert(con, alertCallback, "알림", "확인");
    }
    catch(e) {
        alert(con);
    }

    return false;
    //$("#alertLyer").remove();
    //
	//var output = '';
	//
	//output +="<div data-role='dialog' id='alertLyer' data-close-btn='none' data-corners='false' style='z-index:9999;' >";
	//output +="<div class='padding15 bg_w box_shadow'>";
	////output +="<div class=''box_title'>버전 정보</div>";
	//output +="<p style='text-align:center'>"+con+"</p>";
	//output +="<div>";
	//output +="<a id='' href='javascript:;' data-role='button' data-rel='back' data-theme='a'>확인</a>";
	//output +="</div>";
	//output +="</div>";
	//output +="</div>";
    //
    //$(output).prependTo('body');
    //
	//$.mobile.changePage('#alertLyer');
}


function confirmLayer(con) {

    $("#alertLyer").remove();

	var output =''; 	
	
	output +="<div data-role='dialog' id='alertLyer' data-close-btn='none' data-corners='false' >";
	output +="<div class='padding15 bg_w box_shadow'>";
	//output +="<div class=''box_title'>버전 정보</div>";
	output +="<p style='text-align:center'>"+con+"</p>";
	output +="<div>";	
	output +="<fieldset class='ui-grid-a'>";
	output +="<div class='ui-block-a'><a href='javascript:;' data-role='button' data-rel='back' data-theme='a'>종료</a></div>";
	output +="<div class='ui-block-b'><a href='javascript:;' data-role='button' data-rel='back' data-theme='c'>취소</a></div>";
	output +="</fieldset>";
	output +="</div>";
	output +="</div>";    
	output +="</div>";

    $(output).prependTo('body');
    
	$.mobile.changePage('#alertLyer');

}

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// 쿠키 입력
function set_cookie(name, value, expirehours, domain)
{
    var today = new Date();
    today.setTime(today.getTime() + (60*60*1000*expirehours));
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";";
    if (domain) {
        document.cookie += "domain=" + domain + ";";
    }
}

// 쿠키 얻음
function get_cookie(name)
{
    var find_sw = false;
    var start, end;
    var i = 0;

    for (i=0; i<= document.cookie.length; i++)
    {
        start = i;
        end = start + name.length;

        if(document.cookie.substring(start, end) == name)
        {
            find_sw = true
            break
        }
    }

    if (find_sw == true)
    {
        start = end + 1;
        end = document.cookie.indexOf(";", start);

        if(end < start)
            end = document.cookie.length;

        return unescape(document.cookie.substring(start, end));
    }
    return "";
}

function isNumeric(num, opt) {
    // 좌우 trim(공백제거)을 해준다.
    num = String(num).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
        // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
    }

    if (regex.test(num)) {
        num = num.replace(/,/g, "");

        return isNaN(num) ? false : true;
    } else {
        return false;
    }
}

var onsolModal = {
    /**
     * 모달창 띄움.
     */
    show : function(selector) {
        var width = $(document).width()
            , height = $(document).height()
            ;

        $(selector).css({"width":width-80}).show();
        $(".modal_root_bg").css({"height":height}).show();
    }
    /**
     * 모달창 띄움.
     */
    , show2 : function(selector) {
        $(selector).show();
    }
    /**
     * 숨김
     */
    , hide : function() {
        $(".modal_root").hide();
        $(".modal_root_bg").hide();
    }
};

// 더보기
var onsolMoreList = {
    page : 1
    , scroll_mode : true
    , last_page : false
    , init : function(moreFun) {

        $(window).scroll(function () {

            try{
                var scrolltop = parseInt($(window).scrollTop())+20;
                var minus = $(document).height() - $(window).height();

                if (scrolltop >= $(document).height() - $(window).height()) {

                    if(onsolMoreList.last_page == false) {
                        moreFun();
                    }
                    onsolMoreList.scroll_mode = false;
                }
            }
            catch(e) { }
        });
    }
};

$(document).on('click','.modal_root_bg',function() {

    onsolModal.hide();
});

$(document).ready(function() {

    // ios 계열 상단 높여줌.
    if(COMMON.device.isIpad() || COMMON.device.isIphone()) {
/*
        $(".ui-header.ui-header-fixed,.first_poll_header").css({"padding-top":"10px"});
        setTimeout(function(){
            $(".ui-header.ui-header-fixed,.first_poll_header").css({"padding-top":"10px"});
        },10);
        // $(".ui-btn-left.top_back_btn").css({"margin-top":"5px"});
        // $(".ui-btn-right.top_menu_btn").css({"margin-top":"5px"});
        $(".ui-panel-content-wrap").css({"margin-top":"10px"});
        $(".ios_top_login_btn").css({"margin-top":"15px"});
        $(".m_template_wrapper").css({"margin-top":"68px"});
        //$("#rightpanel1").css({"margin-top":"-10px"});
*/        
    }
    



});