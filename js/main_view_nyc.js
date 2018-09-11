/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {
        $("#viewbutton2").click(function () {
            $(".layer_pop_bg").show();
            $("#layer_pop_pro_add").show();
        });
        $("#pop_close").click(function () {
            $(".layer_pop_bg").hide();
            $("#layer_pop_pro_add").hide();
        });
        $("#viewbutton3").click(function () {
            var type = '';
            if ($(this).find('span').html() == '조사시작') {
                if (!confirm('조사를 시작하시겠습니까?')) {
                    return false;
                }
                type = 'I';
            } else if ($(this).find('span').html() == '조사마감') {
                if (!confirm('조사를 마감하시겠습니까?')) {
                    return false;
                }
                type = 'E';
            } else if ($(this).find('span').html() == '조사완료') {
                return false;
            }
            changeSurveyType(CONSTANTS.PMS.UPDATETYPE, changeType, gup("pms_num"), type);
        });
    });

    getSurvey(CONSTANTS.PMS.MAINVEW, appendMakeViewList, gup("pms_num"));
}

function changeSurveyType(url, callback, num, type) {
    var param = {
        num: num
        , type: type
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
    var v_endDate = $('#v_endDate');
    v_endDate.empty();
    var v_pcnt = $('#v_pcnt');
    v_pcnt.empty();
    var v_kang = $('#v_kang');
    v_kang.empty();
    var v_gua = $('#v_gua');
    v_gua.empty();
    var v_question = $('#v_question');
    v_question.empty();
    var v_password = $('#v_password');
    v_password.empty();
    var v_manage = $('#v_manage');
    v_manage.empty();
    var v_onsol = $('#v_onsol');
    v_onsol.empty();
    var kang = viewdata.kang.slice(0, -1);
    kang = kang.split('|');
    if (viewdata.businessType == '보수교육') {
        var gua = viewdata.gua.slice(0, -1);
        gua = gua.split('|');
    }
    var password = viewdata.password.slice(0, -1);
    password = password.split('|');
    //추가하기
    v_businessType.append(viewdata.businessType);
    v_code.append(viewdata.code);
    v_businessName.append(viewdata.businessName);
    var opdate = '시작 : ' + viewdata.opDate1.replace(/-/g, '.') + '<br>    마감 : ' + viewdata.opDate2.replace(/-/g, '.');
    v_opDate.append(opdate);
    var endDate = viewdata.endDate.replace(/-/g, '.') + ' (' + viewdata.endTime + ')';
    v_endDate.append(endDate);

    //설문 종류 및 대상 설정
    for (var i = 0; i < kang.length; i++) {
        v_pcnt.append('강의평가 - ' + kang[i] + ': ' + questiondata[i].set_value + '명<br/>');
    }
    if(viewdata.password_bosuct_3 > 0){
        v_pcnt.append('문화교류: ' + viewdata.password_bosuct_3 + '명<br/>');
    }
    if(viewdata.password_bosuct_4 > 0){
        v_pcnt.append('강사모니터링: ' + viewdata.password_bosuct_4 + '명<br/>');
    }
    v_pcnt.append('종합만족도: ' + questiondata[50].set_value + '명');

    //추가질문
    var questiondata_q = questiondata;
    questiondata_q = questiondata_q.slice(51);
    console.log(questiondata_q);
    if (questiondata_q.length > 0) {
        for (var i = 0; i < questiondata_q.length; i++) {
            var questiondata_title = questiondata_q[i].set_name.split('_');
            var questiondata_data1 = questiondata_title[0].replace('questionpop', '');
            if (questiondata_title[2] == 'question1' && parseInt(questiondata_data1) != 100) {
                if (kang[questiondata_data1 - 1] != undefined) {
                    var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;">강의평가 - ' + kang[questiondata_data1 - 1] + ':</div>';
                    v_question.append(typeVal);
                    v_question.append(questiondata_q[i].set_value + '<br/>');
                }
            } else if (questiondata_title[2] == 'question1' && questiondata_data1 == '100') {
                var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">종합만족도:</div>';
                v_question.append(questiondata_q[i].set_value);
            }
        }
    } else {
        v_question.empty();
        v_question.append('없음');
    }

    if (viewdata.businessType == '보수교육') {
        if (viewdata.gua == '') {
            v_gua.append('없음');
        } else {
            for (var i = 0; i < gua.length; i++) {
                v_gua.append((i + 1) + '. ' + gua[i] + '<br/>');
            }
        }
    } else {
        $("#bosu").hide();
    }
    if (viewdata.kang == '') {
        v_kang.empty();
        v_kang.append('없음');
    } else {
        for (var i = 0; i < kang.length; i++) {
            v_kang.append((i + 1) + '. ' + kang[i] + '<br/>');
        }
    }

    if (viewdata.password == '') {
        if(viewdata.password_bosuct_3 > 0){
            v_password.append('문화교류: ' + viewdata.password_bosu3 + '<br/>');
        }
        if(viewdata.password_bosuct_4 > 0){
            v_password.append('강사모니터링: ' + viewdata.password_bosu4 + '<br/>');
        }
        if (viewdata.password_a == '') {
            v_password.empty();
            v_password.append('없음');
        } else {
            v_password.append('종합만족도: ' + viewdata.password_a);
        }
    } else {
        for (var i = 0; i < password.length; i++) {
            v_password.append('강의평가 – ' + kang[i] + ': ' + password[i] + '<br/>');
        }
        if(viewdata.password_bosuct_3 > 0){
            v_password.append('문화교류: ' + viewdata.password_bosu3 + '<br/>');
        }
        if(viewdata.password_bosuct_4 > 0){
            v_password.append('강사모니터링: ' + viewdata.password_bosu4 + '<br/>');
        }
        v_password.append('종합만족도: ' + viewdata.password_a + '<br/>');
    }
    if (viewdata.kang != '') {
        for (var i = 0; i < kang.length; i++) {
            $("#menu_pop").append('<span><a href="#" data-ajax="false" class="openUrl' + (i + 1) + '">강의평가 – ' + kang[i] + '</a> </span>');
        }
    }
    $("#menu_pop").append('<span><a href="#" data-ajax="false" class="openUrl100">종합만족도</a> </span>');
    if(viewdata.manage_name == null && viewdata.manage_tel == null && viewdata.manage_email == null ){
        v_manage.append('-');
    }else{
        v_manage.append(viewdata.manage_name + ' / '+ viewdata.manage_tel + ' / ' + viewdata.manage_email);
    }

    if(viewdata.onsol_name == null && viewdata.onsol_tel == null && viewdata.onsol_email == null ){
        v_onsol.append('-');
    }else{
        v_onsol.append(viewdata.onsol_name + ' / '+ viewdata.onsol_tel + ' / ' + viewdata.onsol_email);
    }
    var href_status = '';
    //버튼 설정
    if (viewdata.businessType == '전문연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num') + '&btype=1';
        for (var i = 0; i < kang.length; i++) {
            var k = i + 1;
            $(".openUrl"+k).attr({
                "href": "#",
                "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/"+k+"/?mode=test','_system')"
            });
        }
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a1/" + viewdata.num + "/100/?mode=test','_system')"
        });
    } else if (viewdata.businessType == '직무연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num') + '&btype=2';
        for (var i = 0; i < kang.length; i++) {
            var k = i + 1;
            $(".openUrl"+k).attr({
                "href": "#",
                "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/"+k+"/?mode=test','_system')"
            });
        }
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a2/" + viewdata.num + "/100/?mode=test','_system')"
        });
    } else if (viewdata.businessType == '자격연수') {
        href_status = 'status_view_yeonsu_type2.html?pms_num=' + gup('pms_num') + '&btype=3';
        for (var i = 0; i < kang.length; i++) {
            var k = i + 1;
            $(".openUrl"+k).attr({
                "href": "#",
                "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/"+k+"/?mode=test','_system')"
            });
        }
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a3/" + viewdata.num + "/100?status=" + viewdata.yeonsu_yn + "&mode=test','_system')"
        });
    } else if (viewdata.businessType == '위탁연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num') + '&btype=4';
        for (var i = 0; i < kang.length; i++) {
            var k = i + 1;
            $(".openUrl"+k).attr({
                "href": "#",
                "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/"+k+"/?mode=test','_system')"
            });
        }
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a4/" + viewdata.num + "/100/?mode=test','_system')"
        });
    } else if (viewdata.businessType == '보수교육') {
        href_status = 'status_view_yeonsu_type3.html?pms_num=' + gup('pms_num') + '&btype=5';
        for (var i = 0; i < kang.length; i++) {
            var k = i + 1;
            $(".openUrl"+k).attr({
                "href": "#",
                "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/"+k+"/?mode=test','_system')"
            });
        }
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a5/" + viewdata.num + "/100/?mode=test','_system')"
        });
    }
    var type = '';
    if (viewdata.modeType == 'D') {
        type = '조사시작';
    } else if (viewdata.modeType == 'I') {
        type = '조사마감';
    } else if (viewdata.modeType == 'E') {
        type = '조사완료';
    }
    $("#viewbutton3 span").append(type);
    var href = 'main_edit_nyc.html?pms_num=' + gup('pms_num');
    if (viewdata.modeType == 'E') {
        $("#viewbutton1").attr('onclick', "alertLayer('해당설문이 완료되어 편집할수없습니다.');").removeAttr('href');
    } else {
        $("#viewbutton1").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    }
    $("#viewbutton4").attr('onclick', "location.href='" + href_status + "'").removeAttr('href');
}
function changeType(data) {
    var type = '';
    if ($('#viewbutton3').find('span').html() == '조사시작') {
        type = '조사마감';
    } else if ($('#viewbutton3').find('span').html() == '조사마감') {
        type = '조사완료';
    }
    $("#viewbutton3 span").empty();
    $("#viewbutton3 span").append(type);
}
function returnType(num) {
    var textVal = '단일선택';
    if (num == 1) {
        textVal = '단일선택';
    } else if (num == 2) {
        textVal = '다중선택';
    } else if (num == 3) {
        textVal = '주관식';
    }
    return textVal;
}
