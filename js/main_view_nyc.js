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
    if (questiondata.length >= 1) {
        var pcnt = questiondata[0].set_name;
        var pcnt2 = questiondata[1].set_name;
        var pcnt3 = '';
        var pcnt4 = '';
        var pcnt5 = '';
        var pcnt100 = '';
        try {
            var pcnt3 = questiondata[2].set_name;
            var pcnt4 = questiondata[3].set_name;
            var pcnt5 = questiondata[4].set_name;
            var pcnt100 = questiondata[5].set_name;
        } catch (e) {

        }
        if (pcnt == 'pcnt1' && questiondata[0].set_value > 0) {
            v_pcnt.append('강의평가 - ' + kang[0] + ': ' + questiondata[0].set_value + '명<br/>');
        }
        if (pcnt2 == 'pcnt2' && questiondata[1].set_value > 0) {
            v_pcnt.append('강의평가 - ' + kang[1] + ': ' + questiondata[1].set_value + '명<br/>');
        }
        if (pcnt3 == 'pcnt3' && questiondata[2].set_value > 0) {
            v_pcnt.append('강의평가 - ' + kang[2] + ': ' + questiondata[2].set_value + '명<br/>');
        }
        if (pcnt4 == 'pcnt4' && questiondata[3].set_value > 0) {
            v_pcnt.append('강의평가 - ' + kang[3] + ': ' + questiondata[3].set_value + '명<br/>');
        }
        if (pcnt5 == 'pcnt5' && questiondata[4].set_value > 0) {
            v_pcnt.append('강의평가 - ' + kang[4] + ': ' + questiondata[4].set_value + '명<br/>');
        }
        if (pcnt100 == 'pcnt100' && questiondata[5].set_value > 0) {
            v_pcnt.append('종합만족도: ' + questiondata[5].set_value + '명');
        }
    }
    var keych = 0;
    if (questiondata.length > 3) {
        if (kang[0]) {
            var numth = 1;
            var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;">강의평가 - ' + kang[0] + ':</div>';
            v_question.prepend(typeVal);
            for (var i = 0; i < questiondata.length - 1; i++) {
                if (questiondata[i].set_name == 'questionpop1_write1_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop1_write2_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop1_write3_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop1_write4_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop1_write5_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                }
            }
            if (numth > 1) {
                keych = 1;
            }
        }
        if (kang[1]) {
            var numth = 1;
            var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">강의평가 - ' + kang[1] + ':</div>';
            v_question.prepend(typeVal);
            for (var i = 0; i < questiondata.length - 1; i++) {
                if (questiondata[i].set_name == 'questionpop2_write1_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop2_write2_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop2_write3_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop2_write4_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop2_write5_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                }
            }
            if (numth > 1) {
                keych = 1;
            }
        }
        if (kang[2]) {
            var numth = 1;
            var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">강의평가 - ' + kang[2] + ':</div>';
            v_question.prepend(typeVal);
            for (var i = 0; i < questiondata.length - 1; i++) {
                if (questiondata[i].set_name == 'questionpop3_write1_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop3_write2_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop3_write3_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop3_write4_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop3_write5_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                }
            }
            if (numth > 1) {
                keych = 1;
            }
        }
        if (kang[3]) {
            var numth = 1;
            var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">강의평가 - ' + kang[3] + ':</div>';
            v_question.prepend(typeVal);
            for (var i = 0; i < questiondata.length - 1; i++) {
                if (questiondata[i].set_name == 'questionpop4_write1_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop4_write2_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop4_write3_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop4_write4_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop4_write5_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                }
            }
            if (numth > 1) {
                keych = 1;
            }
        }
        if (kang[4]) {
            var numth = 1;
            var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">강의평가 - ' + kang[4] + ':</div>';
            v_question.prepend(typeVal);
            for (var i = 0; i < questiondata.length - 1; i++) {
                if (questiondata[i].set_name == 'questionpop5_write1_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop5_write2_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop5_write3_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop5_write4_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                } else if (questiondata[i].set_name == 'questionpop5_write5_question1') {
                    v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                    numth++;
                }
            }
            if (numth > 1) {
                keych = 1;
            }
        }
        var numth = 1;
        var typeVal = '<div style="margin-bottom: 5px;border-bottom: 1px solid #333;font-weight: bold;margin-top: 10px;">종합만족도:</div>';
        v_question.append(typeVal);
        for (var i = 0; i < questiondata.length - 1; i++) {
            if (questiondata[i].set_name == 'questionpop100_write1_question1') {
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            } else if (questiondata[i].set_name == 'questionpop100_write2_question1') {
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            } else if (questiondata[i].set_name == 'questionpop100_write3_question1') {
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            } else if (questiondata[i].set_name == 'questionpop100_write4_question1') {
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            } else if (questiondata[i].set_name == 'questionpop100_write5_question1') {
                v_question.append((numth) + '. ' + questiondata[i].set_value + '<br/>');
                numth++;
            }
        }
        if (numth > 1) {
            keych = 1;
        }
    } else {
        v_question.append('없음');
    }
    if (keych == 0) {
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
    }else{
        for (var i = 0; i < kang.length; i++) {
            v_kang.append((i + 1) + '. ' + kang[i] + '<br/>');
        }
    }

    if (viewdata.password == '') {
        if(viewdata.password_a == ''){
            v_password.empty();
            v_password.append('없음');
        }else{
            v_password.append('종합만족도: ' + viewdata.password_a);
        }
    } else {
        for (var i = 0; i < password.length; i++) {
            v_password.append('강의평가 – ' + kang[i] + ': ' + password[i] + '<br/>');
        }
        v_password.append('종합만족도: ' + viewdata.password_a + '<br/>');
    }
    if (viewdata.kang != '') {
        for (var i = 0; i < kang.length; i++) {
            $("#menu_pop").append('<span><a href="#" data-ajax="false" class="openUrl' + (i + 1) + '">강의평가 – ' + kang[i] + '</a> </span>');
        }
    }
    $("#menu_pop").append('<span><a href="#" data-ajax="false" class="openUrl100">종합만족도</a> </span>');
    v_manage.append(viewdata.manage_name + ' / ' + viewdata.manage_tel + ' / ' + viewdata.manage_email);
    var href_status = '';
    //버튼 설정
    if (viewdata.businessType == '전문연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num')+'&btype=1';
        $(".openUrl1").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/1/?mode=test','_system')"
        });
        $(".openUrl2").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/2/?mode=test','_system')"
        });
        $(".openUrl3").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/3/?mode=test','_system')"
        });
        $(".openUrl4").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/4/?mode=test','_system')"
        });
        $(".openUrl5").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b1/" + viewdata.num + "/5/?mode=test','_system')"
        });
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a1/" + viewdata.num + "/100/?mode=test','_system')"
        });
    }else if (viewdata.businessType == '직무연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num')+'&btype=2';
        $(".openUrl1").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/1/?mode=test','_system')"
        });
        $(".openUrl2").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/2/?mode=test','_system')"
        });
        $(".openUrl3").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/3/?mode=test','_system')"
        });
        $(".openUrl4").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/4/?mode=test','_system')"
        });
        $(".openUrl5").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b2/" + viewdata.num + "/5/?mode=test','_system')"
        });
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a2/" + viewdata.num + "/100/?mode=test','_system')"
        });
    }else if (viewdata.businessType == '자격연수') {
        href_status = 'status_view_yeonsu_type2.html?pms_num=' + gup('pms_num')+'&btype=3';
        $(".openUrl1").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/1?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
        $(".openUrl2").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/2?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
        $(".openUrl3").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/3?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
        $(".openUrl4").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/4?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
        $(".openUrl5").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b3/" + viewdata.num + "/5?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a3/" + viewdata.num + "/100?status="+viewdata.yeonsu_yn+"&mode=test','_system')"
        });
    }else if (viewdata.businessType == '위탁연수') {
        href_status = 'status_view_yeonsu_type1.html?pms_num=' + gup('pms_num')+'&btype=4';
        $(".openUrl1").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/1/?mode=test','_system')"
        });
        $(".openUrl2").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/2/?mode=test','_system')"
        });
        $(".openUrl3").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/3/?mode=test','_system')"
        });
        $(".openUrl4").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/4/?mode=test','_system')"
        });
        $(".openUrl5").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b4/" + viewdata.num + "/5/?mode=test','_system')"
        });
        $(".openUrl100").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/a4/" + viewdata.num + "/100/?mode=test','_system')"
        });
    }else if (viewdata.businessType == '보수교육') {
        href_status = 'status_view_yeonsu_type3.html?pms_num=' + gup('pms_num')+'&btype=5';
        $(".openUrl1").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/1/?mode=test','_system')"
        });
        $(".openUrl2").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/2/?mode=test','_system')"
        });
        $(".openUrl3").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/3/?mode=test','_system')"
        });
        $(".openUrl4").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/4/?mode=test','_system')"
        });
        $(".openUrl5").attr({
            "href": "#",
            "onclick": "window.open('" + CONNECTION_URL + "/pms/yeonsu/b5/" + viewdata.num + "/5/?mode=test','_system')"
        });
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
    if(viewdata.modeType == 'E'){
        $("#viewbutton1").attr('onclick', "alertLayer('해당설문이 완료되어 편집할수없습니다.');").removeAttr('href');
    }else{
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
