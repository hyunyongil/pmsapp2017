/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $( document ).ready(function() {
        $("#viewbutton2").click(function(){
            $(".layer_pop_bg").show();
            $("#layer_pop_pro_add").show();
        });
        $("#pop_close").click(function(){
            $(".layer_pop_bg").hide();
            $("#layer_pop_pro_add").hide();
        });
        $("#viewbutton3").click(function(){
            if(!confirm('상태를 변경하시겠습니까?')){
                return false;
            }
            var type = '';
            if($(this).find('span').html() == '조사시작'){
                type = 'I';
            }else if($(this).find('span').html() == '조사진행중'){
                type = 'E';
            }else if($(this).find('span').html() == '조사완료'){
                type = 'D';
            }
            changeSurveyType(CONSTANTS.PMS.UPDATETYPE, changeType, gup("pms_num"),type);
        });
    });

    getSurvey(CONSTANTS.PMS.MAINVEW, appendMakeViewList, gup("pms_num"));
}

function changeSurveyType(url, callback, num, type) {
    var param = {
        num: num
        ,type: type
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                ONPANEL.Ajax.Result.LoadingHide();
                callback(ONPANEL.Ajax.Result.getData(data));
            }
        },
        null,
        true);
}

function getSurvey(url, callback, num) {
    var param = {
        num: num
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
    if (data.mainview_data.length == 0) {
        alertLayer('해당된 내용이 없습니다.');
        return false;
    }
    var viewdata = data.mainview_data[0];
    var questiondata = data.question_data;
    var v_businessType = $('#v_businessType');
    v_businessType.empty();
    var v_code = $('#v_code');
    v_code.empty();
    var v_businessName = $('#v_businessName');
    v_businessName.empty();
    var v_opDate = $('#v_opDate');
    v_opDate.empty();
    var v_pcnt = $('#v_pcnt');
    v_pcnt.empty();
    var v_program = $('#v_program');
    v_program.empty();
    var v_question = $('#v_question');
    v_question.empty();
    var v_password = $('#v_password');
    v_password.empty();
    var v_manage = $('#v_manage');
    v_manage.empty();

    //추가하기
    v_businessType.append(viewdata.businessType);
    v_code.append(viewdata.code);
    v_businessName.append(viewdata.businessName);
    var opdate = '시작 : ' + viewdata.opDate1.replace(/-/g,'.') + '<br>    마감 : ' + viewdata.opDate2.replace(/-/g,'.');
    v_opDate.append(opdate);
    if(questiondata.length >= 1) {
        var pcnt = questiondata[0].set_name;
        var pcnt2 = questiondata[1].set_name;
        var pcnt3 = '';
        try{
            var pcnt3 = questiondata[2].set_name;
        }catch (e){

        }
        if (pcnt == 'pcnt1' && questiondata[0].set_value > 0) {
            v_pcnt.append('청소년: ' + questiondata[0].set_value + '명<br/>');
        }
        if (pcnt2 == 'pcnt2' && questiondata[1].set_value > 0) {
            v_pcnt.append('인솔교사: ' + questiondata[1].set_value + '명<br/>');
        }
        if (pcnt3 == 'pcnt3' && questiondata[2].set_value > 0) {
            v_pcnt.append('성인: ' + questiondata[2].set_value + '명');
        }
    }

    if(questiondata.length > 3) {
        var numth = 1;
        var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;">청소년:</div>';
        v_question.append(typeVal);
        for (var i = 0; i < questiondata.length - 1; i++) {
            if(questiondata[i].set_name == 'questionpop1_write1_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop1_write2_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop1_write3_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop1_write4_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop1_write5_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }
        }
        var numth = 1;
        var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">인솔교사:</div>';
        v_question.append(typeVal);
        for (var i = 0; i < questiondata.length - 1; i++) {
            if(questiondata[i].set_name == 'questionpop2_write1_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop2_write2_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop2_write3_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop2_write4_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop2_write5_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }
        }
        var numth = 1;
        var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">성인:</div>';
        v_question.append(typeVal);
        for (var i = 0; i < questiondata.length - 1; i++) {
            if(questiondata[i].set_name == 'questionpop3_write1_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop3_write2_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop3_write3_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop3_write4_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }else if(questiondata[i].set_name == 'questionpop3_write5_question1'){
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }
        }
    }else{
        v_question.append('없음');
    }
    var program = viewdata.program.split('|');
    if(viewdata.program == ''){
        v_program.append('없음');
    }else{
        for (var i = 0; i < program.length - 1; i++) {
            v_program.append((i + 1) + '. ' + program[i] + '<br/>');
        }
    }
    v_manage.append(viewdata.write_id);
    v_password.append(viewdata.password);
    //버튼 설정
    $(".openUrl1").attr({"href": "#", "onclick": "window.open('"+CONNECTION_URL+"/pms/survey/t/"+viewdata.num+"/1/?mode=test','_system')"});
    $(".openUrl2").attr({"href": "#", "onclick": "window.open('"+CONNECTION_URL+"/pms/survey/i/"+viewdata.num+"/?mode=test','_system')"});
    $(".openUrl3").attr({"href": "#", "onclick": "window.open('"+CONNECTION_URL+"/pms/survey/t/"+viewdata.num+"/2/?mode=test','_system')"});
    var type = '';
    if(viewdata.modeType == 'D'){
        type = '조사시작';
    }else if(viewdata.modeType == 'I'){
        type = '조사진행중';
    }else if(viewdata.modeType == 'E'){
        type = '조사완료';
    }
    $("#viewbutton3 span").append(type);
    var href='main_edit.html?pms_num='+gup('pms_num');
    var href_status='status_viewt.html?pms_num='+gup('pms_num');
    $("#viewbutton1").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    $("#viewbutton4").attr('onclick', "location.href='" + href_status + "'").removeAttr('href');
}
function changeType(data){
    var type = '';
    if($('#viewbutton3').find('span').html() == '조사시작'){
        type = '조사진행중';
    }else if($('#viewbutton3').find('span').html() == '조사진행중'){
        type = '조사완료';
    }else if($('#viewbutton3').find('span').html() == '조사완료'){
        type = '조사시작';
    }
    $("#viewbutton3 span").empty();
    $("#viewbutton3 span").append(type);
}
function returnType(num){
    var textVal = '단일선택';
    if(num == 1){
        textVal = '단일선택';
    }else if(num == 2){
        textVal = '다중선택';
    }else if(num == 3){
        textVal = '주관식';
    }
    return textVal;
}
