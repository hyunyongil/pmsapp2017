/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    bindProgramList();
    $(document).ready(function () {
        $(".sc_btn2").click(function () {
            $("#layer_pop_pro_add").show();
        });
        $(".pop_btn").click(function () {
            $("#layer_pop_pro_add").hide();
        });
        $(".input_search").click(function () {
            if($(".input_class").val() == ''){
                alertLayer('강의명을 입력해주세요.');
                return false;
            }
            $(".program-list .list_group").each(function(){
                if($(this).find('.programName').html() == $(".input_class").val()){
                    alertLayer('강의명이 중복되었습니다.');
                    return false;
                }
            });
            addProgram(CONSTANTS.PMS.ADDGUA, $(".input_class").val());
        });
        $(document).on('click', '.list_group .program_delete', function () {
            if ($(this).find('.program_d').html() == '삭제') {
                if (confirm("삭제하시겠습니까?")) {
                    if ($('.program-list').find('.list_group').length == 1) {
                        alertLayer('최소 한개의 프로그램은 존재해야합니다.');
                        return false;
                    }
                    var programNum = $(this).parents('.list_group').find('.programName').html();
                    deleteProgram(CONSTANTS.PMS.DELETEGUA, programNum);
                    $(this).parents('.list_group').remove();
                }
            } else {
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

function searchProgram(url, type, val) {
    var param = {
        val: val
        , type: type
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                ONPANEL.Ajax.Result.LoadingHide();
                var htmlArrSearchProgram = []
                    ;
                alertLayer(data.result.program_search_data.length)
                if (data.result.program_search_data.length == 0) {
                    htmlArrSearchProgram.push('<li>검색한 강의명이 존재하지 않습니다.</li>');
                } else {

                    for (var i = 0; i < data.result.program_search_data.length; i++) {
                        var allName = '';
                        $('.program-list .list_group .programName').each(function (index) {
                            allName += $(this).html() + '|';
                        });
                        var program = data.result.program_search_data[i];
                        if (allName.indexOf(program.name) < 0 && allName != '') {
                            htmlArrSearchProgram.push('<li class="programAdd">' + program.name + '</li>');
                        }
                    }
                }
                $(".showProgram").empty();
                $(".showProgram").append(htmlArrSearchProgram.join(""));
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
            } else {
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
        getSurvey(CONSTANTS.PMS.GUALIST, 1, appendProgram, gup("pms_num"), gup("type"));
        bindMoreEvent();

        onsolMoreList.init(function () {
            var data = $('.program-more').data();
            if ($.isEmptyObject(data)) {
                $('.program-more').data({url: CONSTANTS.PMS.GUALIST, page: 0});
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

function addProgram(url, val) {
    var param = {
        val: val
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
    var href = 'main_edit_nyc.html?pms_num=' + gup('pms_num');
    $(".menuUrl").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href = 'kang_edit.html?pms_num=' + gup('pms_num')+'&type='+ gup('type');
    $(".menuUrl1").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href = 'gua_edit.html?pms_num=' + gup('pms_num')+'&type='+ gup('type');
    $(".menuUrl2").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var getPname = decodeURI(gup('type'));
    $("#programType").empty();
    $("#programType").append(getPname);
    $("#pname").empty();
    $("#pname").append('[' + getPname + ']');

    if(getPname != '보수교육'){
        $(".menuUrl2").hide();
    }else{
        $(".menuUrl2").show();
        $(".menuUrl").css("width","33%");
        $(".menuUrl1").css("width","33%");
        $(".menuUrl2").css("width","33%");
    }
    var htmlArr = []
        ;
    var htmlArrShowProgram = []
        ;
    if (data.program_ct.length == 0) {
        $(".program-list").empty();
        $(".program-list").append('추가된 강의명이 없습니다.');
        return false;
    }
    if (data.program_data.length == 0) {
        //alertLayer('해당하는 내용이 없습니다.');
        return false;
    }

    for (var i = 0; i < data.program_show_data.length; i++) {
        var program = data.program_show_data[i];
        htmlArr.push('<div class="list_group">');
        htmlArr.push('           <img src="images/img4.png" class="program_list_icon"><span class="programName">' + program.name + '</span>');
        htmlArr.push('            <div class="btn_group">');
        //htmlArr.push('                      <a href="#" class="program_edit"><img src="images/btn_edit.png"><span class="program_e">수정</span></a>');
        htmlArr.push('                      <a href="#" class="program_delete"><img src="images/btn_del.png"><span class="program_d">삭제</span></a>');
        htmlArr.push('            </div>');
        htmlArr.push('</div>');
    }


    $(".showProgram").empty();
    $(".showProgram").append(htmlArrShowProgram.join(""));
    $("#programct").empty();
    $("#programct").append(data.program_show_data.length);
    content.empty();
    content.append(htmlArr.join(""));
}
