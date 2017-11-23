/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {
        $(document).on('click', '.edit_group1', function () {
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
        $(document).on('click', '.edit_group2', function () {
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
        $(document).on('click', '.edit_group3', function () {
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
        $(document).on('click', '.edit_group4', function () {
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
        $(document).on('click', '.edit_group5', function () {
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                var tempVal = $('#pcnt5').html();
                $('#pcnt5').empty();
                $('#pcnt5').append('<input type="number" style="width:60px;width:60px;height:30px;vertical-align: top;" id="textval5" value="' + tempVal + '">');
            } else {
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType5, gup("pms_num"), 5, $('#textval5').val());
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
                changeSurveyType(CONSTANTS.PMS.UPDATEPCNT, changeType100, gup("pms_num"), 100, $('#textval100').val());
            }
        });
        $(document).on('click', '.del_group1', function () {
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
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 1);
                $('.list_group1').remove();
            }
        });

        $(document).on('click', '.del_group2', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 2);
                $('.list_group2').remove();
            }
        });

        $(document).on('click', '.del_group3', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 3);
                $('.list_group3').remove();
            }
        });

        $(document).on('click', '.del_group4', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 4);
                $('.list_group4').remove();
            }
        });

        $(document).on('click', '.del_group5', function () {
            if ($(".list_group").length == 1) {
                alertLayer('설문대상은 적어도 한개는 있어야합니다.');
                return false;
            }
            if (confirm("삭제하시겠습니까?")) {
                deleteSurveyType(CONSTANTS.PMS.DELETETYPENYC, gup("pms_num"), 5);
                $('.list_group5').remove();
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
    var type = $('#textval43').val();
    $("#pcnt4").empty();
    $("#pcnt4").append(type);
    $('.edit_group4').find('span').empty();
    $('.edit_group4').find('span').append('수정');
}
function changeType5(data) {
    var type = $('#textval3').val();
    $("#pcnt5").empty();
    $("#pcnt5").append(type);
    $('.edit_group5').find('span').empty();
    $('.edit_group5').find('span').append('수정');
}
function changeType100(data) {
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
    for (var i = 0; i < kang.length; i++) {
       var k = i+1;
       var html_deasang = '<div class="list_group list_group'+k+'" style="display: none;"> <div class="left_img"><img src="images/img1.png"></div> <div class="text_group"> <span>'+kang[i]+'</span> <p><font id="pcnt'+k+'"></font><em>명</em></p></div><div class="btn_group"> <a href="javascript:;"  data-ajax="false" class="edit_group'+k+'"><img src="images/btn_edit.png"><span>수정</span></a> <a href="javascript:;"  data-ajax="false" class="del_group'+k+'"><img src="images/btn_del.png"><span>삭제</span></a> </div></div>';
       v_daesang_list.append(html_deasang);
    }
    var html_deasang = '<div class="list_group list_group100" style="display: none;"> <div class="left_img"><img src="images/img1.png"></div> <div class="text_group"> <span>종합설문지</span> <p><font id="pcnt100"></font><em>명</em></p></div><div class="btn_group"> <a href="javascript:;"  data-ajax="false" class="edit_group100"><img src="images/btn_edit.png"><span>수정</span></a> <!--<a href="javascript:;"  data-ajax="false" class="del_group100"><img src="images/btn_del.png"><span>삭제</span></a> --></div></div>';
    v_daesang_list.append(html_deasang);


    var v_add_list = $('#add_list');
    v_add_list.empty();
    v_add_list.append('<select id="kang_select" style="height:30px;"></select>');
    for (var i = 0; i < kangdata.length; i++) {
        if(maindata.kang.indexOf(kangdata[i].name+'|') < 0) {
            var html_kang = '<option value="' + kangdata[i].name + '">' + kangdata[i].name + '</option>';
            $("#kang_select").append(html_kang);
        }
    }


    var v_pcnt1 = $('#pcnt1');
    v_pcnt1.empty();
    var v_pcnt2 = $('#pcnt2');
    v_pcnt2.empty();
    var v_pcnt3 = $('#pcnt3');
    v_pcnt3.empty();
    var v_pcnt4 = $('#pcnt4');
    v_pcnt4.empty();
    var v_pcnt5 = $('#pcnt5');
    v_pcnt5.empty();
    var v_pcnt100 = $('#pcnt100');
    v_pcnt100.empty();
    //추가하기
    var key1=0;
    var key2=0;
    var key3=0;
    var key4=0;
    var key5=0;
    var key100=0;
    if (questiondata.length >= 1) {
        var pcnt = questiondata[0].set_name;
        var pcnt2 = questiondata[1].set_name;
        var pcnt3 = questiondata[2].set_name;
        var pcnt4 = questiondata[3].set_name;
        var pcnt5 = questiondata[4].set_name;
        var pcnt100 = questiondata[5].set_name;
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

        if (pcnt5 == 'pcnt5' && questiondata[4].set_value > 0) {
            $(".list_group5").show();
            if ($(".edit_group5").find('span').html() == '수정') {
                v_pcnt5.append(questiondata[4].set_value);
            }
            key5 = 1;
        }


        if (pcnt100 == 'pcnt100' && questiondata[5].set_value > 0) {
            $(".list_group100").show();
            if ($(".edit_group100").find('span').html() == '수정') {
                v_pcnt100.append(questiondata[5].set_value);
            }
            key100 = 1;
        }
    }
    var href = 'main_edit_nyc.html?pms_num=' + gup('pms_num');
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href='kang_edit.html?pms_num='+gup('pms_num')+'&type='+maindata.businessType;
    $(".menuUrl1").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href='gua_edit.html?pms_num='+gup('pms_num')+'&type='+maindata.businessType;
    $(".menuUrl2").attr('onclick', "location.href='" + href + "'").removeAttr('href');
}
