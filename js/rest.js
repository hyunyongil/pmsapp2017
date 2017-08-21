/**
 * Created by somehow on 2015. 3. 25..
 */

///////////////////////////////////////
// Variable Define
///////////////////////////////////////
CONSTANTS.MEMBER = {};
CONSTANTS.MEMBER.LOGIN = '/api/member/login';

CONSTANTS.PMS = {};
CONSTANTS.PMS.MAIN = '/api/pms/mainList';
CONSTANTS.PMS.MAKE = '/api/pms/makeTop';
CONSTANTS.PMS.MAINVEW = '/api/pms/mainView';
CONSTANTS.PMS.ADDTYPE = '/api/pms/addType';
CONSTANTS.PMS.UPDATETYPE = '/api/pms/updateType';
CONSTANTS.PMS.UPDATEPCNT = '/api/pms/updatePcnt';
CONSTANTS.PMS.DELETETYPE = '/api/pms/deleteType';
CONSTANTS.PMS.PROGRAMLIST = '/api/pms/programList';
CONSTANTS.PMS.ADDPROGRAM = '/api/pms/addProgram';
CONSTANTS.PMS.UPDATEPROGRAM = '/api/pms/updateProgram';
CONSTANTS.PMS.DELETEPROGRAM = '/api/pms/deleteProgram';
CONSTANTS.PMS.STATUSVIEW = '/api/pms/statusView';
CONSTANTS.PMS.STATUSDELETE = '/api/pms/statusDelete';



CONSTANTS.FIRST_SURVEY = {};
CONSTANTS.FIRST_SURVEY.INFO = '/api/first_survey/info';
CONSTANTS.FIRST_SURVEY.REGISTER = '/api/first_survey/register';
CONSTANTS.FIRST_SURVEY.EDIT = '/api/first_survey/edit';

//파워패널-주부
CONSTANTS.POWER_HW = {};
CONSTANTS.POWER_HW.INFO = '/api/power_survey/housewifeInfo';
CONSTANTS.POWER_HW.REGISTER = '/api/power_survey/housewifeRegister';
CONSTANTS.POWER_HW.EDIT = '/api/power_survey/housewifeModify';
//파워패널-스마트
CONSTANTS.POWER_SM = {};
CONSTANTS.POWER_SM.INFO = '/api/power_survey/smartInfo';
CONSTANTS.POWER_SM.REGISTER = '/api/power_survey/smartRegister';
CONSTANTS.POWER_SM.EDIT = '/api/power_survey/smartModify';
//파워패널-전문
CONSTANTS.POWER_SP = {};
CONSTANTS.POWER_SP.INFO = '/api/power_survey/specialtyInfo';
CONSTANTS.POWER_SP.REGISTER = '/api/power_survey/specialtyRegister';
CONSTANTS.POWER_SP.EDIT = '/api/power_survey/specialtyModify';
//파워패널-독신
CONSTANTS.POWER_SG = {};
CONSTANTS.POWER_SG.INFO = '/api/power_survey/singleInfo';
CONSTANTS.POWER_SG.REGISTER = '/api/power_survey/singleRegister';
CONSTANTS.POWER_SG.EDIT = '/api/power_survey/singleModify';
//파워패널-다문화
CONSTANTS.POWER_MC = {};
CONSTANTS.POWER_MC.INFO = '/api/power_survey/multiculturalInfo';
CONSTANTS.POWER_MC.REGISTER = '/api/power_survey/multiculturalRegister';
CONSTANTS.POWER_MC.EDIT = '/api/power_survey/multiculturalModify';
//파워패널-공무원
CONSTANTS.POWER_CS = {};
CONSTANTS.POWER_CS.INFO = '/api/power_survey/civilservantInfo';
CONSTANTS.POWER_CS.REGISTER = '/api/power_survey/civilservantRegister';
CONSTANTS.POWER_CS.EDIT = '/api/power_survey/civilservantModify';
//파워패널-청소년
CONSTANTS.POWER_YO = {};
CONSTANTS.POWER_YO.INFO = '/api/power_survey/youngInfo';
CONSTANTS.POWER_YO.REGISTER = '/api/power_survey/youngRegister';
CONSTANTS.POWER_YO.EDIT = '/api/power_survey/youngModify';
//파워패널-라이프
CONSTANTS.POWER_LI = {};
CONSTANTS.POWER_LI.INFO = '/api/power_survey/lifeInfo';
CONSTANTS.POWER_LI.REGISTER = '/api/power_survey/lifeRegister';
CONSTANTS.POWER_LI.EDIT = '/api/power_survey/lifeModify';

//파워패널-자동차

CONSTANTS.SURVEY = {};
CONSTANTS.SURVEY.LIST = '/api/survey/surveyList';
CONSTANTS.SURVEY.UPDATE_INFO = '/api/survey/responseUpdateInfo';
CONSTANTS.SURVEY.ENDLIST = '/api/survey/surveyEnd';
CONSTANTS.SURVEY.ABLE_JOIN_SURVEY = '/api/surveyActionMobile/setMyResponseData';
CONSTANTS.SURVEY.ASK_DATA = '/api/surveyActionMobile/setAskData';
CONSTANTS.SURVEY.CREATE_SURVEY_MOBILE_COUNT = '/api/survey/createSurveyMobileCount';

CONSTANTS.ONPOLL = {};
CONSTANTS.ONPOLL.REPORT = '/api/onpoll/onpollReport';
CONSTANTS.ONPOLL.LIST = '/api/onpoll/onpollList';
CONSTANTS.ONPOLL.JOIN = '/api/onpoll/join';
CONSTANTS.ONPOLL.RESULT = '/api/onpoll/result';
CONSTANTS.ONPOLL.CATEGORYLIST = '/api/onpoll/categoryList';
CONSTANTS.ONPOLL.OPINIONLIST = '/api/onpoll/opinionList';
CONSTANTS.ONPOLL.OPINION = '/api/onpoll/opinion';
CONSTANTS.ONPOLL.OPINIONDEL = '/api/onpoll/opinionDel';
CONSTANTS.ONPOLL.GOODCOMMENT = '/api/onpoll/goodComment';

CONSTANTS.MYPAGE = {};
CONSTANTS.MYPAGE.MAIN = '/api/mypage/main';
CONSTANTS.MYPAGE.ACTIVITY = '/api/mypage/activity';
CONSTANTS.MYPAGE.POINT_USE = '/api/mypage/point_use';
CONSTANTS.MYPAGE.POINT = '/api/mypage/point';
CONSTANTS.MYPAGE.TOKEN_CHK = '/api/mypage/token_chk';

CONSTANTS.MEMBER.BANKLIST = '/api/mypage/bank_name';
CONSTANTS.CONFIG = {};
CONSTANTS.CONFIG.INFO = '/api/config/info';
CONSTANTS.CONFIG.VERSION = '/api/config/version';
CONSTANTS.CONFIG.PUSHEDIT = '/api/config/push_edit';

CONSTANTS.POINTMALL = {};
CONSTANTS.POINTMALL.MAIN = '/api/pointmall/main';
CONSTANTS.POINTMALL.DONATION = '/api/pointmall/donation';
CONSTANTS.POINTMALL.DONATION_PROC = '/api/pointmall/donationProc';
CONSTANTS.POINTMALL.ITEM = {};
CONSTANTS.POINTMALL.ITEM.LIST = '/api/pointmall/item_list';
CONSTANTS.POINTMALL.ITEM.INFO = '/api/pointmall/item_info';
CONSTANTS.POINTMALL.ITEM.PAYMENT = '/api/pointmall/payment';
CONSTANTS.POINTMALL.ITEM.PAYMENTCANCEL = '/api/pointmall/paymentCancel';

CONSTANTS.BOARD = {};
CONSTANTS.BOARD.NOTICE = {};
CONSTANTS.BOARD.NOTICE.LIST = '/mergeboard/mobile/boardList ';

CONSTANTS.SUCESS = 'SUCCESS';

var ONPANEL = {};
ONPANEL.Ajax = {};
ONPANEL.Ajax.Result = {};
ONPANEL.Ajax.Result.isSucess = function (data) {
    return (CONSTANTS.SUCESS == data.resultType);
}

ONPANEL.Ajax.Result.getData = function (data) {
    return data.result;
}

ONPANEL.Ajax.Result.getMessage = function (data) {
    return data.resultMsg;
}
ONPANEL.Ajax.Result.LoadingShow = function () {
    $.mobile.loading("show", {
        text: "",
        textVisible: true,
        theme: "pms",
        html: ""
    });
}
ONPANEL.Ajax.Result.LoadingHide = function () {
    $.mobile.loading("hide");
}
ONPANEL.Ajax.Request = new (function () {

    /**
     * HTTP GET Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 응답을 주고 받는다.
     *
     * @param httpUrl GET로 호출할 URL
     * @param map 파라미터로 전달할 Key Value 형식의 Map
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    this.invokeGet = function (url, body, onSuccess, onFailure) {
        $.ajax({
            async: true,
            crossDomain: true,
            url: CONNECTION_AJ_URL + url,
            type: 'GET',
            dataType: "json",
            data: body,
            success: onSuccess,
            error: onFailure
        });
    },

        /**
         * HTTP POST Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 요청하고 JSON 형식으로 응답을 받는다.
         *
         * @param httpUrl POST로 호출할 URL
         * @param params 요청으로 전달할 파라미터
         * @param body 요청으로 전달할 JSON
         * @param onSuccess 성공시 호출하는 이벤트 콜백
         * @param onFailure 실패시 호출하는 이벤트 콜백
         */
        this.invokePostByJSON = function (url, body, onSuccess, onFailure, useToken) {
            console.log("TEST:invokePostByJSON:"+CONNECTION_AJ_URL + url);

            if (!body)
                body = {};

            if (useToken) {
                body.token = COMMON.token.get();
            }

            console.log("TEST:"+JSON.stringify(body));

            $.ajax({
                async: true,
                crossDomain: true,
                url: CONNECTION_AJ_URL + url,
                type: 'POST',
                dataType: "json",
                data: body,
                success: onSuccess,
                error: onFailure
            });
        }
});

function getUser(callback) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.MEMBER.INFO,
        null,
        function (data, textStatus, jqXHR) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data))
                callback(ONPANEL.Ajax.Result.getData(data));
            else
                callback();
        },
        null,
        true
    );
}

function getSurveyCount(callback) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.SURVEY.CREATE_SURVEY_MOBILE_COUNT,
        null,
        function (data, textStatus, jqXHR) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data))
                callback(data.result.survey_cnt);
            else
                callback();
        },
        null,
        true
    );
}

updateMemberLastLogin();
function updateMemberLastLogin(){
	var member_id = COMMON.storage.get("my_info_id");
	if(member_id){
		 ONPANEL.Ajax.Request.invokePostByJSON(
			CONSTANTS.MEMBER.UPDATELASTLOGIN
			, {
                member_id: member_id
            }
			, function (data) {
				console.log("Update Data:"+data.resultMsg);	
			}
			, function (e,e2) {
				console.log(e);
				console.log(e2);
			}
			, true
		);
	}
}