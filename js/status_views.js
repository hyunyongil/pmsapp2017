/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {
        $(document).on('click', '.survey_tr', function () {
            //$(".survery_content").hide();
            var id = 'content' + $(this).attr('id');
            $("#" + id).slideToggle(100);
            $(".survey_tr").removeClass('on');
            $(this).addClass('on');
        });

        $(document).on('click', '.deleteNum', function () {
            if (confirm("해당 데이터를 삭제하시겠습니까?")) {
                deleteStatus(CONSTANTS.PMS.STATUSDELETE, $(this).attr('id'), 3);
            }
        });
    });
    bindSurveyList();
}

function deleteStatus(url, muid, type) {
    var param = {
        muid: muid
        , type: type
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


function bindSurveyList() {
    $(document).on('pageinit', '#survey_list', function () {
        getSurvey(CONSTANTS.PMS.STATUSVIEW, 1, appendSurvey, gup("pms_num"), 3);
        bindMoreEvent();

        onsolMoreList.init(function () {
            var data = $('.survey-more').data();
            if ($.isEmptyObject(data)) {
                $('.survey-more').data({url: CONSTANTS.PMS.PROGRAMLIST, page: 0});
                var data = $('.survey-more').data();
            }
            var now_page = parseInt(data.page) + 1;

            if (now_page > 1) {
                if (onsolMoreList.scroll_mode == false) {
                    return false;
                }
                getSurvey(data.url, parseInt(data.page) + 1, appendSurvey, gup("pms_num"), 3);
            }
        });
    });
}


function getSurvey(url, page, callback, num, type) {
    if (!page)
        page = 1;
    $('.survey-more').data({url: url, page: page});

    var param = {
        num: num,
        type: type,
        page: page,
        list_cnt: 100
    };
    ONPANEL.Ajax.Result.LoadingShow();
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
    $('.survey-more').bind('click', function () {
        var data = $(this).data();
        getSurvey(data.url, parseInt(data.page) + 1, appendSurvey, gup("pms_num"), gup("type"));
    });
}
function appendSurvey(data) {
    var surveyList = $('.list_table_ok > tbody:last-child');
    if (data.page == 1) {
        surveyList.empty();
    }
    appendSurveyList(surveyList, data);
}

function appendSurveyList(content, data) {
    var href = 'status_viewt.html?pms_num=' + gup('pms_num');
    $(".viewt").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href = 'status_viewi.html?pms_num=' + gup('pms_num');
    $(".viewi").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    var href = 'status_views.html?pms_num=' + gup('pms_num');
    $(".views").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    ONPANEL.Ajax.Result.LoadingHide();
    var htmlArr = []
        ;
    if (data.survey_data.length == 0 && data.page <= 1) {
        $(".graph_div").empty();
        $(".graph_div").append('참여대상이 아니거나 참여한 인원이 없습니다.');
        $(".padding_group").show();
        return false;
    }
    if(data.survey_ct.length > 0){
        $(".padding_group").show();
    }else{
        $(".list_table_title").hide();
    }

    for (var i = 0; i < data.survey_data.length; i++) {
        var survey = data.survey_data[i].muid;
        var survey_detail = data.survey_detail_data[survey];
        var sexval = '남';
        if (survey_detail[3].select_num == 2) {
            sexval = '여';
        }

        htmlArr.push('<tr id="' + (i + 1) + '" class="survey_tr">');
        htmlArr.push('           <td>' + survey_detail[2].select_text.slice(0, -1) + '</td>');
        htmlArr.push('            <td>' + sexval + '</td>');
        htmlArr.push('</tr>');

        htmlArr.push('<tr class="survery_content" id="content' + (i + 1) + '" style="display: none;">');
        htmlArr.push('         <td colspan="3" class="on_content">');
        htmlArr.push('           <div><img src="images/img5.png">설문완료 : ' + survey_detail[2].regDate + '<a href="#" class="deleteNum" id="' + survey_detail[2].muid + '"><img src="images/btn_del.png">삭제</a></div>');
        htmlArr.push('         </td>');
        htmlArr.push('</tr>');
    }

    var nowjoinct = data.survey_ct.length;
    var totaljoinct = data.survey_join_ct[0].set_value;
    $(".graph_div span").empty();
    $(".graph_div span").append('(' + nowjoinct + '/' + totaljoinct + ')');
    $(".graph_num").empty();
    $(".graph_num").append(parseInt(nowjoinct / totaljoinct * 100) + '%');
    $(".graph_num").css('width', parseInt(nowjoinct / totaljoinct * 100) + '%');
    if(data.survey_ct.length > 0) {
        content.append(htmlArr.join(""));
    }
}
