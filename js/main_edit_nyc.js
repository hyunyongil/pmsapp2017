/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {

        $(document).on('click', '.edit_group', function () {
            var karr = $(this).attr('id').split('_');
            var k = karr[1];
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt'+k).html();
                $('#pcnt'+k).empty();
                $('#pcnt'+k).append('<input type="number"  style="width:60px;height:30px;vertical-align: top;font-size: 16px;"   id="textval'+k+'" value="' + tempVal + '">');
            } else {
                var textval = $('#textval'+k).val();
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType(k), gup("pms_num"), k, textval);
            }
        });

        $(document).on('click', '.edit_group100', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt100').html();
                $('#pcnt100').empty();
                $('#pcnt100').append('<input type="number" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval100" value="' + tempVal + '">');
            } else {
                var textval = $('#textval100').val();
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType100, gup("pms_num"), 100, textval);
            }
        });

        $(document).on('click', '.del_group', function () {
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
            var karr = $(this).attr('id').split('_');
            var k = karr[1];
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), k);
                $('.list_group'+k).remove();
            }
        });

        $(document).on('click', '.del_group100', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 100);
                $('.list_group100').remove();
            }
        });

        $("#viewbutton2").click(function () {
            var dis = 0;
            $(".list_group").each(function () {
                if($(this).css("display") == 'block'){
                    dis++;
                }
            });
            if($(".daesang_list .list_group").length > 6){
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
            var type = 0;
            type = $(".daesang_list .list_group").length;
            if($("#kang_select").val() == ''){
                alertLayer('강으명을 선택해주세요.');
                return false;
            }
            addSurveyType(CONSTANTS.PMS.ADDTYPENYC, gup("pms_num"), type, $(".input_class").val(), $("#kang_select").val());
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
                location.reload();
            }else{
                alertLayer('업데이트 실패');
                location.reload();
            }
        },
        null,
        true);
}

function addSurveyType(url, num, type, val, name) {
    var param = {
        num: num
        , type: type
        , val: val
        , name: name
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

function changeType(k) {
    var type = $('#textval'+k).val();
    $("#pcnt"+k).empty();
    $("#pcnt"+k).append(type);
    $('.edit_group'+k).find('span').empty();
    $('.edit_group'+k).find('span').append('수정');
}

function changeType100() {
    var type = $('#textval100').val();
    $("#pcnt100").empty();
    $("#pcnt100").append(type);
    $('.edit_group100').find('span').empty();
    $('.edit_group100').find('span').append('수정');
}
function appendMakeViewList(data) {
    if (data.mainview_data.length == 0) {
        alertLayer('해당된 내용이 없습니다.');
        return false;
    }

    var maindata = data.mainview_data[0];
    var kangdata = data.kang_data;
    var questiondata = data.question_data;
    var v_daesang_list = $('.daesang_list');
    v_daesang_list.empty();
    var kang = maindata.kang.slice(0, -1);
    kang = kang.split('|');
    var daesang = maindata.deasang.split('|');

    if(maindata.businessType != '보수교육'){
        $(".menuUrl2").hide();
    }else{
        $(".menuUrl2").show();
        $(".menuUrl").css("width","33%");
        $(".menuUrl1").css("width","33%");
        $(".menuUrl2").css("width","33%");
    }
    for (var i = 0; i < kang.length; i++) {
       var k = i+1;
        if(questiondata[daesang[i]-1].set_value > 0) {
            var html_deasang = '<div class="list_group list_group' + k + '" style="display: none;"> <div class="left_img"><img src="images/img1.png"></div> <div class="text_group"> <span>' + kang[i] + '</span> <p><font id="pcnt' + k + '"></font><em>명</em></p></div><div class="btn_group"> <a href="javascript:;"  id="edit_' + k + '" data-ajax="false" class="edit_group edit_group' + k + '"><img src="images/btn_edit.png"><span>수정</span></a> <a href="javascript:;" id="del_' + k + '" data-ajax="false" class="del_group del_group' + k + '"><img src="images/btn_del.png"><span>삭제</span></a> </div></div>';
            v_daesang_list.append(html_deasang);
        }
    }
    var html_deasang = '<div class="list_group list_group100" style="display: none;"> <div class="left_img"><img src="images/img1.png"></div> <div class="text_group"> <span>종합설문지</span> <p><font id="pcnt100"></font><em>명</em></p></div><div class="btn_group"> <a href="javascript:;"  data-ajax="false" class="edit_group100"><img src="images/btn_edit.png"><span>수정</span></a> <!--<a href="javascript:;"  data-ajax="false" class="del_group100"><img src="images/btn_del.png"><span>삭제</span></a> --></div></div>';
    v_daesang_list.append(html_deasang);


    var v_add_list = $('#add_list');
    v_add_list.empty();
    v_add_list.append('<select id="kang_select" style="height:30px;width:90%;"></select>');
    for (var i = 0; i < kangdata.length; i++) {
        if(maindata.kang.indexOf(kangdata[i].name+'|') < 0) {
            var html_kang = '<option value="' + kangdata[i].name + '">' + kangdata[i].name + '</option>';
            $("#kang_select").append(html_kang);
        }
    }



    var v_pcnt100 = $('#pcnt100');
    v_pcnt100.empty();
    //추가하기
    if (kang.length > 0) {
        for (var i = 0; i < kang.length; i++) {
            var k = i+1;
            $(".list_group"+k).show();
            if ($(".edit_group"+k).find('span').html() == '수정') {
                $("#pcnt"+k).append(questiondata[daesang[i]-1].set_value);
            }
        }

        $(".list_group100").show();
        if ($(".edit_group100").find('span').html() == '수정') {
            v_pcnt100.append(questiondata[50].set_value);
        }
    }
    var href = 'main_edit_nyc.html?pms_num=' + gup('pms_num');
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href='kang_edit.html?pms_num='+gup('pms_num')+'&type='+maindata.businessType;
    $(".menuUrl1").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href='gua_edit.html?pms_num='+gup('pms_num')+'&type='+maindata.businessType;
    $(".menuUrl2").attr('onclick', "location.href='" + href + "'").removeAttr('href');
}
