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
        $(".input_search").click(function () {
            if ($(".input_class").val() == '') {
                alertLayer('프로그램을 입력해주세요');
                return false;
            }
            addProgram(CONSTANTS.PMS.ADDPROGRAM, gup("type"), $('.input_class').val());
        });
        $(document).on('click', '.list_group .program_edit', function () {
            var programNameObj = $(this).parents('.list_group').find('.programName');
            var programName = programNameObj.html();
            if ($(this).find('span').html() == '수정') {
                $(this).find('span').empty();
                $(this).find('span').append('저장');
                programNameObj.empty();
                programNameObj.append('<input type="text" style="width:160px;height:25px;vertical-align: top;font-size: 12px;" class="textval" value="' + programName + '">');
            } else {
                var programName = $(this).parents('.list_group').find('.textval').val();
                if(programName == ''){
                    alertLayer('프로그램을 입력해주세요');
                    return false;
                }
                var programNum = $(this).parents('.list_group').find('.programNum').html();
                updateProgram(CONSTANTS.PMS.UPDATEPROGRAM, programNum, programName, gup("type"));
            }
        });
        $(document).on('click', '.list_group .program_delete', function () {
            if (confirm("삭제하시겠습니까?")) {
                var programNum = $(this).parents('.list_group').find('.programNum').html();
                deleteProgram(CONSTANTS.PMS.DELETEPROGRAM, programNum);
                $(this).parents('.list_group').remove();
            }
        });
    });
    bindProgramList();
}

function deleteProgram(url, num) {
    var param = {
        num: num
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

function updateProgram(url, num, val, type) {
    var param = {
        num: num
        , val: val
        , type: type
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                ONPANEL.Ajax.Result.LoadingHide();
                alertLayer('수정되었습니다.');
                location.reload();
            }else{
                ONPANEL.Ajax.Result.LoadingHide();
                alertLayer(data.resultMsg);
                return false;
            }
        },
        null,
        true);
}

function bindProgramList() {
    $(document).on('pageinit', '#program_list', function () {
        getSurvey(CONSTANTS.PMS.PROGRAMLIST, 1, appendProgram, gup("pms_num"), gup("type"));
        bindMoreEvent();

        onsolMoreList.init(function () {
            var data = $('.program-more').data();
            if ($.isEmptyObject(data)) {
                $('.program-more').data({url: CONSTANTS.PMS.PROGRAMLIST, page: 0});
                var data = $('.program-more').data();
            }
            var now_page = parseInt(data.page) + 1;

            if (now_page > 1) {
                if (onsolMoreList.scroll_mode == false) {
                    return false;
                }
                getSurvey(data.url, parseInt(data.page) + 1, appendProgram, gup("pms_num"), gup("type"));
            }
        });
    });
}

function addProgram(url, type, val) {
    var param = {
        type: type
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
                alertLayer('추가되었습니다.');
            } else {
                alertLayer(data.resultMsg);
                return false;
            }
        },
        null,
        true);
}

function getSurvey(url, page, callback, num, type) {
    if (!page)
        page = 1;
    $('.program-more').data({url: url, page: page});

    var param = {
        num: num,
        type: type,
        page: page,
        list_cnt: 10
    };

    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            try {
                if (ONPANEL.Ajax.Result.isSucess(data)) {
                    callback(ONPANEL.Ajax.Result.getData(data));
                }
                onsolMoreList.scroll_mode = true;
            }
            catch (e) {
                onsolMoreList.scroll_mode = true;
            }
        },
        null,
        true);
}
function bindMoreEvent() {
    $('.program-more').bind('click', function () {
        var data = $(this).data();
        getSurvey(data.url, parseInt(data.page) + 1, appendProgram, gup("pms_num"), gup("type"));
    });
}
function appendProgram(data) {
    var programList = $('.program-list');
    if (data.page == 1) {
        programList.empty();
    }
    appendProgramList(programList, data);
}

function appendProgramList(content, data) {
    var href = 'main_edit.html?pms_num=' + gup('pms_num');
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    $("#programType").empty();
    $("#programType").append(decodeURI(gup('type')));
    var htmlArr = []
        ;
    if (data.program_data.length == 0) {
        //alertLayer('해당하는 내용이 없습니다.');
        return false;
    }
    for (var i = 0; i < data.program_data.length; i++) {
        var program = data.program_data[i];
        htmlArr.push('<div class="list_group">');
        htmlArr.push('           <img src="images/img4.png"><font class="programName">' + program.name + '</font><font class="programNum" style="display: none;">' + program.program_num + '</font>');
        htmlArr.push('            <div class="btn_group">');
        htmlArr.push('                      <a href="#" class="program_edit"><img src="images/btn_edit.png"><span>수정</span></a>');
        htmlArr.push('                      <a href="#" class="program_delete"><img src="images/btn_del.png">삭제</a>');
        htmlArr.push('            </div>');
        htmlArr.push('</div>');
    }
    $("#programct").empty();
    $("#programct").append(data.program_ct.length);
    content.append(htmlArr.join(""));
}
