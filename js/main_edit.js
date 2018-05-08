/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    var keys = 0;
    var type = 0;
    $(document).ready(function () {
        $(".edit_group1").bind('click', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt1').html();
                $('#pcnt1').empty();
                $('#pcnt1').append('<input type="number"  style="width:60px;height:30px;vertical-align: top;font-size: 16px;"   id="textval1" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType1, gup("pms_num"), 1, $('#textval1').val());
            }
        });
        $(".edit_group2").bind('click', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt2').html();
                $('#pcnt2').empty();
                $('#pcnt2').append('<input type="number" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval2" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType2, gup("pms_num"), 2, $('#textval2').val());
            }
        });
        $(".edit_group3").bind('click', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt3').html();
                $('#pcnt3').empty();
                $('#pcnt3').append('<input type="number" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval3" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType3, gup("pms_num"), 3, $('#textval3').val());
            }
        });
        $(".edit_group4").bind('click', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt4').html();
                $('#pcnt4').empty();
                $('#pcnt4').append('<input type="number" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval4" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType4, gup("pms_num"), 4, $('#textval4').val());
            }
        });
        $(".del_group1").bind('click', function () {
            var dis = 0;
            $(".list_group").each(function () {
                if($(this).css("display") == 'block'){
                    dis++;
                }
            });
            if (dis == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 1);
                $('.list_group1').remove();
            }
        });

        $(".del_group2").bind('click', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 2);
                $('.list_group2').remove();
            }
        });

        $(".del_group3").bind('click', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 3);
                $('.list_group3').remove();
            }
        });

        $(".del_group4").bind('click', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 4);
                $('.list_group4').remove();
            }
        });


        $("#viewbutton2").click(function () {
            var dis = 0;
            $(".list_group").each(function () {
                if($(this).css("display") != 'block'){
                    dis = 1;
                }
            });
            if(dis == 0){
                alertLayer('설문대상을 모두 추가하였습니다.');
                return false;
            }
            $(".layer_pop_bg").show();
            $("#layer_pop_pro_add").show();
        });
        $("#pop_close").click(function () {
            $(".layer_pop_bg").hide();
            $("#layer_pop_pro_add").hide();
        });

        $(".input_search").bind('click', function () {
            if ($(".input_class").val() == '') {
                alertLayer('인원수를 입력해주세요.');
                $(".input_class").focus();
                return false;
            }

            $(".pop_tab span").each(function () {
                if($(this).hasClass('on')){
                    keys = 1;
                    if($(this).text() == '청소년-만족도'){
                        type = 1;
                    }else if($(this).text() == '인솔교사-만족도'){
                        type = 2;
                    }else if($(this).text() == '성인-만족도'){
                        type = 3;
                    }else if($(this).text() == '효과성(사전+사후)'){
                        type = 4;
                    }
                }
            });
            if(keys != 1){
                alertLayer('설문대상을 선택해주세요.');
                return false;
            }
            addSurveyType(CONSTANTS.PMS.ADDTYPE, gup("pms_num"), type, $(".input_class").val());
        });
        $(document).on('click', '.pop_tab span', function () {
            $(".pop_tab span").removeClass('on');
            $(this).addClass('on');
        });
    });
    getSurvey(CONSTANTS.PMS.MAINVEW, appendMakeViewList, gup("pms_num"));
}

function changeSurveyType(url, callback, num, type, val) {
    var param = {
        num: num
        , type: type
        , val: val
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

function addSurveyType(url, num, type, val) {
    var param = {
        num: num
        , type: type
        , val: val
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                ONPANEL.Ajax.Result.LoadingHide();
                location.reload();
            }
        },
        null,
        true);
}

function deleteSurveyType(url, num, type) {
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
                location.reload();
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

function changeType1(data) {
    var type = $('#textval1').val();
    $("#pcnt1").empty();
    $("#pcnt1").append(type);
    $('.edit_group1').find('span').empty();
    $('.edit_group1').find('span').append('수정');
}
function changeType2(data) {
    var type = $('#textval2').val();
    $("#pcnt2").empty();
    $("#pcnt2").append(type);
    $('.edit_group2').find('span').empty();
    $('.edit_group2').find('span').append('수정');
}
function changeType3(data) {
    var type = $('#textval3').val();
    $("#pcnt3").empty();
    $("#pcnt3").append(type);
    $('.edit_group3').find('span').empty();
    $('.edit_group3').find('span').append('수정');
}
function changeType4(data) {
    var type = $('#textval4').val();
    $("#pcnt4").empty();
    $("#pcnt4").append(type);
    $('.edit_group4').find('span').empty();
    $('.edit_group4').find('span').append('수정');
}
function appendMakeViewList(data) {
    if (data.mainview_data.length == 0) {
        alertLayer('해당된 내용이 없습니다.');
        return false;
    }
    var maindata = data.mainview_data[0];
    var questiondata = data.question_data;
    var v_pcnt1 = $('#pcnt1');
    v_pcnt1.empty();
    var v_pcnt2 = $('#pcnt2');
    v_pcnt2.empty();
    var v_pcnt3 = $('#pcnt3');
    v_pcnt3.empty();
    var v_pcnt4 = $('#pcnt4');
    v_pcnt4.empty();
    //추가하기
    var key1=0;
    var key2=0;
    var key3=0;
    var key4=0;
    if (questiondata.length >= 1) {
        var pcnt = questiondata[0].set_name;
        var pcnt2 = questiondata[1].set_name;
        var pcnt3 = questiondata[2].set_name;
        var pcnt4 = questiondata[3].set_name;
        if (pcnt == 'pcnt1' && questiondata[0].set_value > 0) {
            $(".list_group1").show();
            if ($(".edit_group1").find('span').html() == '수정') {
                v_pcnt1.append(questiondata[0].set_value);
            }
            key1 = 1;
        }

        if (pcnt2 == 'pcnt2' && questiondata[1].set_value > 0) {
            $(".list_group2").show();
            if ($(".edit_group2").find('span').html() == '수정') {
                v_pcnt2.append(questiondata[1].set_value);
            }
            key2 = 1;
        }

        if (pcnt3 == 'pcnt3' && questiondata[2].set_value > 0) {
            $(".list_group3").show();
            if ($(".edit_group3").find('span').html() == '수정') {
                v_pcnt3.append(questiondata[2].set_value);
            }
            key3 = 1;
        }

        if (pcnt4 == 'pcnt4' && questiondata[3].set_value > 0) {
            $(".list_group4").show();
            if ($(".edit_group4").find('span').html() == '수정') {
                v_pcnt4.append(questiondata[3].set_value);
            }
            key4 = 1;
        }
    }
    var href='program_edit.html?pms_num='+gup('pms_num')+'&type='+maindata.businessType;
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var html = '';

    if(key1 == 0){
        html += '<span style="width:auto;">청소년-만족도</span>';
    }
    if(key2 == 0){
        html += '<span style="width:auto;">인솔교사-만족도</span>';
    }
    if(key3 == 0){
        html += '<span style="width:auto;">성인-만족도</span>';
    }
    if(key4 == 0){
        html += '<span style="width:auto;">효과성(사전+사후)</span>';
    }
    $(".pop_tab").empty();
    $(".pop_tab").append(html);
}
