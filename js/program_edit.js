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
            if ($(this).find('.program_e').html() == '수정') {
                $(this).find('.program_e').empty();
                $(this).find('.program_e').append('저장');
                $(this).parents('.btn_group').find('.program_d').empty();
                $(this).parents('.btn_group').find('.program_d').append('취소');
                programNameObj.empty();
                programNameObj.append('<textarea rows="3" cols="17" class="textval">'+ programName +'</textarea>');
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
            if($(this).find('.program_d').html() == '삭제') {
                if (confirm("삭제하시겠습니까?")) {
                    var programNum = $(this).parents('.list_group').find('.programNum').html();
                    deleteProgram(CONSTANTS.PMS.DELETEPROGRAM, programNum);
                    $(this).parents('.list_group').remove();
                }
            }else{
                $(this).parents('.btn_group').find('.program_e').empty();
                $(this).parents('.btn_group').find('.program_e').append('수정');
                $(this).parents('.btn_group').find('.program_d').empty();
                $(this).parents('.btn_group').find('.program_d').append('삭제');
                var programNameObj = $(this).parents('.list_group').find('.textval');
                var programName = programNameObj.val();
                $(this).parents('.list_group').find('.programName').empty();
                $(this).parents('.list_group').find('.programName').append(programName);
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
                alertLayer('삭제되었습니다.');
                location.reload();
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
        list_cnt: 100
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
    var getPname = decodeURI(gup('type'));
    $("#programType").empty();
    $("#programType").append(getPname);
    $("#pname").empty();
    $("#pname").append('['+getPname+']');
    $('.topNavbars li').removeClass('ui-btn-active');
    if(getPname == '학교단체'){
        $('.topNavbars li:eq(0)').addClass('ui-btn-active');
    }else if(getPname == '취약계층'){
        $('.topNavbars li:eq(1)').addClass('ui-btn-active');
    }else if(getPname == '특성화캠프'){
        $('.topNavbars li:eq(2)').addClass('ui-btn-active');
    }else if(getPname == '가족캠프'){
        $('.topNavbars li:eq(3)').addClass('ui-btn-active');
    }else if(getPname == '전문연수'){
        $('.topNavbars li:eq(4)').addClass('ui-btn-active');
    }else if(getPname == '기타'){
        $('.topNavbars li:eq(5)').addClass('ui-btn-active');
    }
    $('.topNavbars li').each(function (index) {
        var href = 'program_edit.html?pms_num=' + gup('pms_num')+'&type=';
        if(index == 0){
            href += '학교단체';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }else if(index == 1){
            href += '취약계층';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }else if(index == 2){
            href += '특성화캠프';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }else if(index == 3){
            href += '가족캠프';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }else if(index == 4){
            href += '전문연수';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }else if(index == 5){
            href += '기타';
            $(this).attr('onclick', "location.href='" + href + "'").removeAttr('href');
        }
    });
    var htmlArr = []
        ;
    if (data.program_ct.length == 0) {
        $(".program-list").empty();
        $(".program-list").append('추가된 프로그램이 없습니다.');
        return false;
    }
    if (data.program_data.length == 0) {
        //alertLayer('해당하는 내용이 없습니다.');
        return false;
    }
    for (var i = 0; i < data.program_data.length; i++) {
        var program = data.program_data[i];
        htmlArr.push('<div class="list_group">');
        htmlArr.push('           <img src="images/img4.png" class="program_list_icon"><span class="programName">' + program.name + '</span><font class="programNum" style="display: none;">' + program.program_num + '</font>');
        htmlArr.push('            <div class="btn_group">');
        htmlArr.push('                      <a href="#" class="program_edit"><img src="images/btn_edit.png"><span class="program_e">수정</span></a>');
        htmlArr.push('                      <a href="#" class="program_delete"><img src="images/btn_del.png"><span class="program_d">삭제</span></a>');
        htmlArr.push('            </div>');
        htmlArr.push('</div>');
    }
    $("#programct").empty();
    $("#programct").append(data.program_ct.length);
    content.append(htmlArr.join(""));
}
