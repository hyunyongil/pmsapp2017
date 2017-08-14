/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {
        $(".edit_group1").bind('click', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt1').html();
                $('#pcnt1').empty();
                $('#pcnt1').append('<input type="text" style="width:60px;height:30px;vertical-align: top;font-size: 16px;" id="textval1" value="' + tempVal + '">');
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
                $('#pcnt2').append('<input type="text" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval2" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType2, gup("pms_num"), 2, $('#textval2').val());
            }
        });
        $(".del_group1").bind('click', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제 하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 1);
                $('.list_group1').remove();
            }
        });

        $(".del_group2").bind('click', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제 하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPE, gup("pms_num"), 2);
                $('.list_group2').remove();
            }
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
function appendMakeViewList(data) {
    if (data.mainview_data.length == 0) {
        alertLayer('해당된 내용이 없습니다.');
        return false;
    }
    var questiondata = data.mainview_data[1];
    var v_pcnt1 = $('#pcnt1');
    v_pcnt1.empty();
    var v_pcnt2 = $('#pcnt2');
    v_pcnt2.empty();
    //추가하기
    if (questiondata.length >= 1) {
        var pcnt = questiondata[0].set_name;
        var pcnt2 = questiondata[1].set_name;
        if (pcnt == 'pcnt1' && questiondata[0].set_value > 0) {
            $(".list_group1").show();
            if ($(".edit_group1").find('span').html() == '수정') {
                v_pcnt1.append(questiondata[0].set_value);
            }
        }
        if (pcnt2 == 'pcnt2' && questiondata[1].set_value > 0) {
            $(".list_group2").show();
            if ($(".edit_group2").find('span').html() == '수정') {
                v_pcnt2.append(questiondata[1].set_value);
            }
        }
    }
    var href='program_edit.html?pms_num='+gup('pms_num');
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
}
