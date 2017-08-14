/**
 * Created by yong on 2017. 08. 10
 */

function readyMain() {
    $( document ).ready(function() {
        bindTabEvent();
    });
    makeCountList();
    bindMainList(1);
}
function makeCountList() {
    $(document).on('pageinit', '#main_list', function () {
        getSurvey(CONSTANTS.PMS.MAKE, 1, appendMakeCountList, 1);
    });
}
function bindMainList(num) {
    $(document).on('pageinit', '#main_list', function () {
        getSurvey(CONSTANTS.PMS.MAIN , 1, appendMain, num);
        bindMoreEvent();

        onsolMoreList.init(function(){
            var data = $('.main-more').data();
            if($.isEmptyObject(data)) {
                $('.main-more').data({url: CONSTANTS.PMS.MAIN, page: 0});
                var data = $('.main-more').data();
            }
            var now_page = parseInt(data.page) + 1;
            if(now_page > 1) {
                if(onsolMoreList.scroll_mode == false){
                    return false;
                }
                var indexnum = 0;
                $('.topNavbars li').each(function (index) {
                    if($(this).hasClass('ui-btn-active')){
                        indexnum = index+1;
                    }
                });
                getSurvey(data.url, parseInt(data.page) + 1, appendMain, indexnum);
            }
        });
    });
}


function showPmsAllList() {
    getSurvey(CONSTANTS.PMS.MAIN , 1, appendMain, 1);
    $('.poll-list').attr('type','list');
}

function showPmsDList() {
    getSurvey(CONSTANTS.PMS.MAIN , 1, appendMain, 2);
    $('.poll-list').attr('type','list')
}

function showPmsIList() {
    getSurvey(CONSTANTS.PMS.MAIN , 1, appendMain, 3);
    $('.poll-list').attr('type','list')
}

function showPmsEList() {
    getSurvey(CONSTANTS.PMS.MAIN , 1, appendMain, 4);
    $('.poll-list').attr('type','list')
}

function bindTabEvent() {
    $('.topNavbars li').bind('click', function () {
        $('.topNavbars li').removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');
        if ($(this).hasClass('main_click_all')){
            showPmsAllList();
        } else if ($(this).hasClass('main_click_d')){
            showPmsDList();
        } else if ($(this).hasClass('main_click_i')){
            showPmsIList();
        } else if ($(this).hasClass('main_click_e')){
            showPmsEList();
        }
    });
}


function getSurvey(url, page, callback, num) {
    if (!page)
        page = 1;
    $('.main-more').data({url: url, page: page});

    var param = {
        num : num,
        page: page,
        list_cnt:6
    };

    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            try{
                if (ONPANEL.Ajax.Result.isSucess(data)) {
                    callback(ONPANEL.Ajax.Result.getData(data));
                }
                onsolMoreList.scroll_mode = true;
            }
            catch(e) {
                onsolMoreList.scroll_mode = true;
            }
        },
        null,
        true);
}


function appendMain(data) {
    var mainList = $('.main-list');
    if (data.page == 1) {
        mainList.empty();
    }
    appendMainList(mainList, data);
}

function bindMoreEvent() {
    $('.main-more').bind('click', function () {
        var data = $(this).data();
        getSurvey(data.url, parseInt(data.page) + 1, appendMain, 1);
    });
}
//메인 리스트
function appendMainList(content, data) {
    var htmlArr = []
        ;
    htmlArr.push('<table class="c_table">');
    htmlArr.push('            <col width="95px">');
    htmlArr.push('                    <col width="">');
    htmlArr.push('                       <col width="60px">');
    if(data.main_data.length == 0){
        //alertLayer('해당하는 내용이 없습니다.');
        return false;
    }
    for (var i = 0; i < data.main_data.length; i++) {
        var survey = data.main_data[i];
        var mode = '대기';
        var cssval = 'btn_w';
        if(survey.modeType == 'I'){
            mode = '진행중';
            cssval = 'btn_g';
        }else if(survey.modeType == 'E'){
            mode = '완료';
            cssval = 'btn_s';
        }
        htmlArr.push('<tr>');
        htmlArr.push('<td> <a data-ajax="false" href="main_view.html?pms_num='+survey.num+'" class="'+cssval+' mumu"><p>'+mode+'</p>'+survey.code+'</a></td>');
        htmlArr.push('<td>기간 : <b>'+survey.opDate1.replace(/-/g,'.')+'~'+survey.opDate2.replace(/-/g,'.')+'</b><br>사업명 : <b>'+survey.businessName+'</b>');
        htmlArr.push('<td><img src="images/btn_listview.jpg" style="cursor: pointer;" class="mumu" onclick="location.href=\'main_view.html?pms_num='+survey.num+'\'"></td>');
        htmlArr.push('</tr>');
    }
    htmlArr.push('</table>');
    content.append(htmlArr.join(""));
}

function appendMakeCountList(data) {
    var main_all = $('.main_all');
    var main_d = $('.main_d');
    var main_i = $('.main_i');
    var main_e = $('.main_e');
    main_all.append('('+data.main_all+')');
    main_d.append('('+data.main_d+')');
    main_i.append('('+data.main_i+')');
    main_e.append('('+data.main_e+')');
}