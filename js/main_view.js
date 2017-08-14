/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    getSurvey(CONSTANTS.PMS.MAINVEW, appendMakeViewList, gup("pms_num"));
}

function getSurvey(url,  callback, num) {
    var param = {
        num : num
    };

    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                callback(ONPANEL.Ajax.Result.getData(data));
            }
        },
        null,
        true);
}

function appendMakeViewList(data) {
    if(data.mainview_data.length == 0){
        alertLayer('해당된 내용이 없습니다.');
        return false;
    }
    var data = data.mainview_data[0];
    var v_businessType = $('.v_businessType');
    var v_code = $('.v_code');
    var v_businessName = $('.v_businessName');
    var v_opDate = $('.v_opDate');
    var v_pcnt = $('.v_pcnt');
    var v_program = $('.v_program');
    var v_question = $('.v_question');
    var v_password = $('.v_password');
    var v_manage = $('.v_manage');
    v_businessType.append(data.businessType);
    v_code.append(data.code);
    v_businessName.append(data.businessName);
    var opdate = '시작 : '+data.opDate1+'<br>    마감 :'+data.opDate2;
    v_opDate.append(opdate);
    v_password.append(data.password);
}