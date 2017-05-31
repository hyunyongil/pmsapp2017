/**
 * Created by songkiwon on 2016. 10. 26..
 */

var gCommentNum = 0;

function readyPoll() {

    $(document).ready(function () {
        bindTabEvent();
        bindSearchIconEvent();

        $(".comment_content").on("tap",function() {
            $('#comment_input_text').val('');
        });

        $('.textarea_comment').focus(function() {
            gCommentNum = 0;
        });

        setTimeout(function(){

            var poll_num = gup("poll_num");
            if (poll_num) {
                $('html, body').animate({
                    scrollTop: $('#onpoll_list'+poll_num).offset().top - $('.topNavbar').height() - 16
                },100);
            }

            var app_type = device.platform.toLowerCase();
            if(app_type == 'android') {
                window.addEventListener('native.showkeyboard', keyboardShowHandler);
                function keyboardShowHandler(e) {
                    console.log("keyboardShowHandler: "+app_type+" - "+e.keyboardHeight);
                    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    var scrollLimit = viewportHeight - (document.activeElement.offsetHeight + document.activeElement.offsetTop);
                    if (e.keyboardHeight > scrollLimit) {
                        $('.onpoll_report_pop').animate({"top":"-="+e.keyboardHeight+"px"},"fast");
                    }
                }
                window.addEventListener('native.hidekeyboard', keyboardHideHandler);
                function keyboardHideHandler() {
                    console.log("keyboardHideHandler: "+app_type);
                    document.activeElement.blur();
                    $('.onpoll_report_pop').animate({"top":"10%"},"fast");
                }
            }

        },1500);


    });

    bindOnPollList();
}

function showOnPollList() {
    $('.search_icon').hide();
    getSurvey(CONSTANTS.ONPOLL.LIST, 1, appendPoll,'','');
    $('.poll-list').attr('type','list');
}

function showOnPollReport() {
    $('.search_icon').show();
    getSurvey(CONSTANTS.ONPOLL.REPORT, 1, appendPoll,'','');
    $('.poll-list').attr('type','list')
}

function backButtonTabEvent() {
    console.log('backButtonTabEvent');
    var type = $('.poll-list').attr('type');
    if (type == 'result') {

        var activeID = $('.topNavbar').find('.ui-btn-active').attr('id');

        if (activeID == 'poll_survey_ing') {
            showOnPollList();
        } else if (activeID == 'poll_survey_end') {
            showOnPollReport();
        }
    } else {
        $(location).attr('href','home.html');
    }
}

function bindTabEvent() {
    $('.topNavbar li a').bind('click', function () {
        if ($(this).hasClass('end_list')){
            showOnPollReport();
        }
        else {
            showOnPollList();
        }
    });
}

function bindSearchIconEvent() {

    $('.search_icon').bind('click', function () {

        ONPANEL.Ajax.Request.invokePostByJSON(
            CONSTANTS.ONPOLL.CATEGORYLIST
            , {}
            , function (data) {
                if (ONPANEL.Ajax.Result.isSucess(data)) {
                    if (data.resultType == 'SUCCESS') {
                        appendCategoryList(data.result);
                    } else {
                        console.log(data.resultType+": "+data.resultMsg);
                    }
                }
                else {
                    console.log('WORRING: Request Fail');
                }
            }
            , function (e,e2) {
                console.log(e);
                console.log(e2);
            }
            , true
        );
    });

    $('.pop_title').bind('click', function () {
        onsolMoreList.scroll_mode = true;
        onsolModal.hide();
    });

    $('.top_title').bind('click', function () {
        onsolModal.hide();
    });
}

function bindOnPollList() {
    $(document).on('pageinit', '#poll_list', function () {
        getSurvey(CONSTANTS.ONPOLL.LIST, 1, appendPoll,'','');
        bindMoreEvent();

        onsolMoreList.init(function(){
            var data = $('.poll-more').data();
            if($.isEmptyObject(data)) {
                $('.poll-more').data({url: "/api/onpoll/onpollList", page: 0, category_num:'', search_txt:''});
                var data = $('.poll-more').data();
            }
            var now_page = parseInt(data.page) + 1;
            if(now_page > 1) {
                if(onsolMoreList.scroll_mode == false) return false;
                getSurvey(data.url, parseInt(data.page) + 1, appendPoll, data.category_num, data.search_txt);
            }
        });
    });
}

function getSurvey(url, page, callback, category_num, search_txt) {
    if (!page)
        page = 1;
    $('.poll-more').data({url: url, page: page, category_num: category_num, search_txt: search_txt});

    var param = {
        page: page,
        list_cnt: 30
    };

    if (category_num.length > 0) {
        param['category_num'] = category_num;
    }

    if (search_txt.length > 0) {
        param['search_txt'] = search_txt;
    }
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

function appendPollInit(data) {
    var pollList = $('.poll-list');

    if($("#poll_survey_ing").hasClass("ui-btn-active")) {
        appendOnPollTake(pollList, data);
    } else {
        appendOnPollReport(pollList, data);
    }
}

function appendPoll(data) {
    var pollList = $('.poll-list');
    if (data.page == 1) {
        pollList.empty();
    }
    appendPollInit(data);
}

function bindMoreEvent() {
    $('.poll-more').bind('click', function () {
        var data = $(this).data();
        getSurvey(data.url, parseInt(data.page) + 1, appendPoll, data.category_num, data.search_txt);
    });
}

//온폴 참여
function appendOnPollTake(content, data) {
    for (var i = 0; i < data.poll_data.length; i++) {
        var survey = data.poll_data[i];
        var row = $('<a>')
            .attr('data-ajax', 'false');

        var poll_num = survey.poll_num;
        var write_id = survey.write_id;

        var title_content = survey.survey_contents;

        row.append($('<div>').addClass('etc_group').html(
            "<div class='left_point'>" + survey.question_count + "P</div><div class='right_category'>" + survey.category_name + "</div>"
        ));
        row.append($('<div>').addClass('title_name').text(survey.survey_title));

        var divTitleContent = $('<div>').addClass('title_content');
        divTitleContent.html("<p>"+title_content+"</p>");
        if (survey.poll_img) {
            divTitleContent.append($('<div>').html(
                "<img src="+FILES_URL+survey.poll_img+"></div>"
            ));
        }
        row.append(divTitleContent);

        row.append($('<div>').addClass('etc_data').html(
            "<div class='left_user'>" + survey.personnel_count + "</div><div class='right_data'>" + survey.survey_sdate + "~" + survey.survey_edate + "</div>"
        ));

        if (survey.join_yn) {
            row.append($('<div>').addClass('onpoll_btn2').html(
                "<a href='javascript:;' onclick='javascript:getSurveyResult("+survey.poll_num+");'>결과보기</a></div>"
            ));
        } else {

            appendQuestionData(row,survey);

            row.append($('<div>').addClass('onpoll_btn').html(
                "<a href='javascript:;' onclick='javascript:saveOnPollJoin("+poll_num+");'>참여하기</a>"+
                "<a href='javascript:;' onclick='javascript:getSurveyResult("+poll_num+");'>결과보기</a>"
            ));
        }

        var onpollListID = 'onpoll_list'+survey.poll_num;
        $('<div>').attr('id', onpollListID).attr('class','onpoll_list').append(row).appendTo(content);


        $('#'+onpollListID).data({'poll_num': survey.poll_num, 'write_id': write_id, 'question_count': survey.question_count});

    }
	if(data.poll_data.length == 0 && data.page == 1){
		$('.poll-list').html("<img src='images/m_img/msg2.jpg' width='100%'>");
	}
}

function appendQuestionData(content, data) {
    for (var i = 0; i < data.question_data.length; i++) {
        var question = data.question_data[i];
        var onpollSurvey = $('<div>').addClass('onpoll_survey').attr({'id':'question'+question.question_num,'type':question.question_type});

/*/SSONG TEST
        question.question_title = '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
//*/

        onpollSurvey.append($('<div>').addClass('survey_title').html("<span>"+(i+1)+"</span>"+question.question_title));

        if (question.item_data.length > 0) {
            var ul = $('<ul>');
            appendItemData(ul,question);
            onpollSurvey.append(ul);
        }
        content.append(onpollSurvey);
    }
}

function appendItemData(content, data) {
    var divClassName = 'img_no';
    var spanClassName = '';

    switch (data.question_type) {
        case '1' :  // 단일선택
            spanClassName = 'radio_div';
            break;
        case '2' :  // 다중선택
            spanClassName = 'checkbox_div';
            break;
        case '3' :  // 순위형
            spanClassName = 'checkbox_div';
            break;
        case '4' :  // 찬반형
            divClassName = 'chanban';
            spanClassName = 'radio_div';
            break;
        default :
            console.log('undefined type : ' + question.question_type);
    }

    if (spanClassName.length == 0) {
        return;
    }

    content.addClass(divClassName);

    var isImgHave = false;
    for (var i = 0; i < data.item_data.length; i++) {
        var item = data.item_data[i];

        var li = $('<li>').addClass('item'+item.item_num);
        if (data.question_type == '3') {
            li.attr('rank_num', '0');
        }

        if (data.question_type == '4') {
            li.append($('<div>').addClass(item.item_title == '찬성' ? 'up_img_div' : 'up_down_div'));
        } else {
            if (item.item_img.length > 0) {
                li.append($('<div>').addClass('survey_img').html("<img src=" + FILES_URL + item.item_img + ">"));
                isImgHave = true;
            } else {

                if (isImgHave) {
                    li.append($('<div>').addClass('survey_img'));
                }
            }

        }

/*/SSONG TEST
        item.item_title = '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
//*/
        li.append($('<div>').addClass('survey_text').html("<span class=" + spanClassName + "></span>" + item.item_title));

        content.append($('<a>').attr({
            'href':'javascript:;',
            'onclick':'javascript:selectedQuestion('+item.question_num+','+item.item_num+');'
        }).append(li));
    }

    if (isImgHave) {
        content.removeClass(divClassName).addClass('img_have');
    }
}

function selectedQuestion(questionNum, itemNum) {
    var li = $('.item'+itemNum);
    var span = li.find('span');

    if (span.hasClass('checkbox_div')) {

        var attr = li.attr('rank_num');

        if (typeof attr !== typeof undefined && attr !== false) {

            if (li.find('div').hasClass('checkbox_layer')) {

                var rankNum = li.attr('rank_num');

                $('#'+'question'+questionNum).find('li').each(function (index) {
                    var selectedRankNum = $(this).attr('rank_num');
                    if (rankNum < selectedRankNum) {
                        selectedRankNum -= 1;
                        $(this).find('td').text(selectedRankNum);
                        $(this).attr('rank_num',selectedRankNum);
                    }
                });

                li.find('.checkbox_layer').remove();
                li.attr('rank_num','0');


            } else {
                var rankNum = 1;
                $('#'+'question'+questionNum).find('.checkbox_layer').each(function (index) {
                    rankNum += 1;
                });

                li.attr('rank_num',rankNum);

                li.prepend($('<div>').addClass('checkbox_layer').html(
                    "<table width='100%' border='0' cellspacing='0' cellpadding='0'><tr>" +
                    "<td valign='middle'>"+rankNum+"</td></tr></table>"
                ));
            }

        } else {
            if (span.hasClass('on')) {
                li.removeClass('on_background');
                span.removeClass('on');
                span.removeClass('addcon');
            } else {
                li.addClass('on_background');
                span.addClass('on'); 
				span.html('<span class="addcon"></span>');
            }
        }
    } else if (span.hasClass('radio_div')) {
        $('#question'+questionNum).find('li').removeClass('on_background');
        $('#question'+questionNum).find('span').removeClass('on');
        $('#question'+questionNum).find('span').removeClass('addcon');
        li.addClass('on_background');
        span.addClass('on');
        span.html('<span class="addcon"></span>');
    }
}

function saveOnPollJoin(num) {

    var onpollList = $('#'+'onpoll_list'+num);
    var data = onpollList.data();

    if($.isEmptyObject(data)) {
        return;
    }

    var paramData = {
        'poll_num': data.poll_num,
        'write_id': data.write_id,
        'question_count': data.question_count
    };

    var errMessage = '';
    $(onpollList).find('.onpoll_survey').each(function (index) {
        var question_num = $(this).attr('id');
        question_num = question_num.substr(8,question_num.length);
        var question_type = $(this).attr('type');

        var value = '';
        switch (question_type) {
            case '1' :  // 단일선택
            case '4' :  // 찬반형
                var selClass = $(this).find('.on_background');
                if(selClass.length == 0) {
                    errMessage = '문항'+(index+1)+'을 선택 해주세요.';
                    return false;
                }
                value = getparamDataVlue(selClass, (index+1))+'@'+question_num;
                break;
            case '2' :  // 다중선택
                $(this).find('li').each(function (index) {
                    if ($(this).hasClass('on_background')) {
                        value += getparamDataVlue($(this), (index+1), question_num)+'@';
                    }
                });
                if (value.length == 0) {
                    errMessage = '문항'+(index+1)+'을 선택 해주세요.';
                    return false;
                } else {
                    value += question_num;
                }
                break;
            case '3' :  // 순위형
                $(this).find('li').each(function (index) {
                    var rankNum = $(this).attr('rank_num');
                    if (rankNum > 0) {
                        value += getparamDataVlue($(this), rankNum, question_num)+'@';
                    }
                });
                if (value.length == 0) {
                    errMessage = '문항'+(index+1)+'을 선택 해주세요.';
                    return false;
                } else {
                    value += question_num;
                }
                break;
            default :
                console.log('undefined type : ' + question_type);
        }

        if (value.length == 0) {
            return false;
        }

        paramData['question_select'+(index+1)] = value;
    });

    if (errMessage.length > 0) {
        alertLayer(errMessage);
        return;
    }

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.ONPOLL.JOIN
        , paramData
        , function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                if (data.resultType == 'SUCCESS') {
                    onpollList.find('.onpoll_survey').remove();
                    onpollList.find('.onpoll_btn a:first-child').remove();
                    onpollList.find('.onpoll_btn').removeClass('onpoll_btn').addClass('onpoll_btn2');
					var join_point = parseInt(onpollList.find('.left_point').html());
                    alertLayer("온폴 참여 "+join_point+"포인트가 적립되었습니다.");

                } else {
                    if(data.resultMsg.indexOf("6개월 기준")){
						$(location).attr('href','firstPoll.html#first1');
					}else{
						console.log(data.resultType+": "+data.resultMsg);
						alertLayer(data.resultMsg);              
					}
                }
            }
            else {
				if(data.resultMsg.indexOf("6개월 기준")){           
					alertLayer(data.resultMsg);           
					$(location).attr('href','firstPoll.html#first1');
				}else{
					console.log(data);
					alertLayer(data.resultMsg);              
				}
            }
        }
        , function (e,e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );
}

function getparamDataVlue(selClass, index) {
    var selectedItem = selClass.attr('class').split(' ')[0];
    var item_num = selectedItem.substr(4,selectedItem.length);
    return (index)+'^'+item_num;
}

//온폴 리포트
function appendOnPollReport(content, data) {
    var div = $('<div>').addClass('onpoll_report');

    for (var i = 0; i < data.poll_data.length; i++) {
        var survey = data.poll_data[i];
        var row = $('<div>').addClass('padding_10');
        row.append($('<div>').addClass("category_div").text(survey.category_name));

        if (survey.poll_img) {
            row.append($('<div>').html("<img src="+FILES_URL+survey.poll_img+">"));
        } else {
            row.append($('<div>').html("<img src='./images/no_img.png' style='background-color: lightgrey;'>"));
        }
/*/SSONG TEST
        survey.survey_title = '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
//*/
        row.append($('<div>').addClass("title_name").text(survey.survey_title));
        var cell = $('<a>').attr({
            'data-ajax': 'false',
            'href':'javascript:;',
            'onclick':'javascript:getSurveyResult('+survey.poll_num+');'});
        cell.append(row);
        $('<div>').attr('id', survey.poll_num).attr('class',"report_group")/*.css('height','228px')*/.append(cell).appendTo(div);
    }
    content.append(div);
}

//온폴 카테고리 팝업
function appendCategoryList(data) {
    var box = $('.box_div');
    box.empty();

    var selectedCategoryNum = $('.poll-more').data().category_num;

    var ul = $('<ul>').addClass('box_category');
    for (var i=0; i<data.category_num.length; i++) {
        var category = data.category_num[i];
        var li = $('<li>').attr('category_num',category.category_num).html(
            "<span>"+category.category_name+"</span>"
        );

        if (selectedCategoryNum == category.category_num) {
            li.addClass('on');
        }

        ul.append(li);
    }

    if ((data.category_num.length % 2) == 0) {
        ul.append($('<li>').attr('category_num',-1).html(
            "<span></span>"
        ));
    }

    if (selectedCategoryNum == 0) {
        ul.prepend($('<li>').addClass('on').attr('category_num','0').html(
            "<span>전체</span>"
        ));
    } else {
        ul.prepend($('<li>').attr('category_num','0').html(
            "<span>전체</span>"
        ));
    }

    box.append(ul);

    $('ul.box_category li').click(function(e) {
        var caregoryNum = $(this).attr('category_num');
        if (caregoryNum >= 0) {
            $('.box_div').find('li').removeClass('on');
            $(this).addClass('on');
        }
    });

    setTimeout(function () {
        onsolModal.show('#modalOnpollReportPop');
    }, 100);
}

function searchOnpollReport() {
    var text = $('.input_search').val();
    // if (text.length == 0) {
    //     alertLayer('검색어를 입력하세요')
    //     return;
    // }

    var categoryNum = $('.box_div').find('li.on').attr('category_num');

    var url = CONSTANTS.ONPOLL.REPORT;
    var page = 1;

    var param = {
        page: page,
        list_cnt: 30,
        category_num: categoryNum,
        search_txt: text
    };

    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            try{
                if (ONPANEL.Ajax.Result.isSucess(data)) {

                    appendPoll(ONPANEL.Ajax.Result.getData(data));

                    $('.poll-more').data({url: url, page: 1, category_num: categoryNum, search_txt: text});
                }
                onsolMoreList.scroll_mode = true;
            }
            catch(e) {
                alertLayer('해당하는 내용이 없습니다.');
                onsolMoreList.scroll_mode = true;
            }
        },
        null,
        true);

    $('.input_search').val('');

    onsolMoreList.scroll_mode = true;
    onsolModal.hide();
}

//온폴 결과
function getSurveyResult(pollNum) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.ONPOLL.RESULT
        , {poll_num:pollNum}
        , function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                if (data.resultType == 'SUCCESS') {
                    appendOnPollResult(data.result);
                } else {
                    console.log(data.resultType+": "+data.resultMsg);
                }
            }
            else {
                console.log('WORRING: Request Fail');
            }
        }
        , function (e,e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );
}

function appendOnPollResult(data) {

    onsolMoreList.scroll_mode = false;
    $('.search_icon').hide();

    var pollList = $('.poll-list');
    pollList.empty();

    pollList.attr('type','result');
    if ($.isEmptyObject(data.poll_data)) {
        console.log('WORRING: onpoll result data is null');
        return;
    }

    for (var i = 0; i < data.poll_data.length; i++) {
        var survey = data.poll_data[i];
        var row = $('<a>')
            .attr('data-ajax', 'false');

        var title_content = survey.survey_contents;
        // title_content = title_content.replace(/(<([^>]+)>)/ig,"");

/*/SSONG TEST
        survey.survey_title = 'survey.survey_title: 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
        title_content = 'title_content 222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
//*/

        row.append($('<div>').addClass('etc_group').html(
            "<div class='left_point'>" + survey.question_count + "P</div><div class='right_category'>" + survey.category_name + "</div>"
        ));
        row.append($('<div>').addClass('title_name').text(survey.survey_title));

        var divTitleContent = $('<div>').addClass('title_content');
        divTitleContent.html("<p>"+title_content+"</p>");
        if (survey.poll_img) {
            divTitleContent.append($('<div>').html(
                "<img src="+FILES_URL+survey.poll_img+"></div>"
            ));
        }
        row.append(divTitleContent);

        row.append($('<div>').addClass('etc_data').html(
            "<div class='left_user'>" + survey.personnel_count + "</div><div class='right_data'>" + survey.survey_sdate + "~" + survey.survey_edate + "</div>"
        ));

        appendOnPollResultQuestionData(row, survey);
        appendOnPollReusltAnalysis(row, survey);

        row.append($('<div>').addClass('view_div_btn').html(
            "<div class='float_left_div'><a href='javascript:;' onclick='javascript:getOnpollCommentList("+survey.poll_num+")'>댓글보기</a></div>"+
            "<div class='float_right_div'>" +
            "<a onclick='javascript:facebookBtnTouchEvent("+survey.poll_num+");'><span class='fackbook_btn'></span></a>" +
            "<a onclick='javascript:shareBtnTouchEvent("+survey.poll_num+");'><span class='share_btn'></a></span></div>"
        ));

        $('<div>').attr('id', 'onpoll_list'+survey.poll_num).attr('class',"onpoll_list").append(row).appendTo(pollList);
    }

    for (var i=0; i<5; i++) {
        var dictDiv = $('#dictDiv_'+i);
        if (dictDiv.outerWidth() < 62) {
            dictDiv.children('p').remove();
        }
    }

    reinitSwiper();
    $("body").scrollTop(0);
}

function reinitSwiper() {
    setTimeout(function () {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 30
        });
    }, 500);
}

function appendOnPollResultQuestionData(content, data) {
    var div = $('<div>').addClass('swiper-container onpoll_survey end_survey_div').css('padding-bottom','20px');
    var wrapper = $('<div>').addClass('swiper-wrapper');
    for (var i=0; i<data.question_data.length; i++) {
        var question = data.question_data[i];

        var slide = $('<div>').addClass('swiper-slide').css('text-align','left');

        slide.append($('<div>').addClass('survey_title').html(
            "<span>"+(i+1)+"</span>"+question.question_title
        ));

        if ($.isEmptyObject(question.item_data) == false && question.item_data.length > 0) {

            //온폴조사문항타입 1-단일선택,2-다중선택,3-순위형,4-찬반형

            var sumCount = 0;
            for (var z=0; z<question.item_data.length; z++) {
                var item = question.item_data[z];
                sumCount += Number(item.join_ct);
            }

            if (question.question_type == 3) {
                question.item_data.sort(function (a, b) {
                    if (a.score < b.score) {
                        return 1;
                    }
                    if (a.score > b.score) {
                        return -1;
                    }
                    return 0;
                });
            }

            var ul = $('<ul>');
            for (var j=0; j<question.item_data.length; j++) {
                var item = question.item_data[j];
                var join_ct = item.join_ct, join = 0;
                if (data.response_count > 0 && join_ct > 0) {
                    join = join_ct / sumCount * 100;
                }

                //console.log(question.question_type);
                //console.log(item);

                var joinWidth = join > 100 ? 100 : join;

                //온폴의 순위형 문항의 결과 그래프에는 백분율(%) 값이 없고 (00점) 의 점수값만 표시 되어야함
                //단일선택/다중선택/찬반형은 현재 상태 그대로 유지
                //온폴조사문항타입 1-단일선택,2-다중선택,3-순위형,4-찬반형
                var rightText = (question.question_type == 3) ? "("+item.join_ct+"점)" : join.toFixed(1)+"% ("+item.join_ct+"명)";

                var li = $('<li>');
                li.append($('<div>').addClass('background_div1').html(
                    "<div class='float_left_text'>"+item.item_title+"</div>"+
                    //"<div class='float_right_text'>"+join.toFixed(1)+"% ("+item.join_ct+questionTypeString+")</div>"+
                    "<div class='float_right_text'>"+rightText+"</div>"+
                    "<div class='background_div2' style='background-color:"+getRandomColor(j)+"; width:"+joinWidth+"%'></div>"
                ));

                ul.append(li);
            }
            slide.append(ul);
        }
        wrapper.append(slide);
    }
    div.append(wrapper);
    div.append($('<div>').addClass('swiper-pagination').css('bottom','0px'));
    content.append(div);
}

function getRandomColor(index) {
    var letters = ['ffcc5c','aad8b1','bbd399','ffe2d4','fce478','9bb5c2','d5a496','df8875','d3c74d','8ba7bf','82c6fb','fb82e6'];
    var color = '#';
    color += letters[index];
    return color;
}

function appendOnPollReusltAnalysis(content, data) {

/*/SSONG TEST
    data.response_count = 10;
    data.poll_chart_data[0].male = 90;
    data.poll_chart_data[0].female = 10;
//*/

    var totalCount = parseInt(data.response_count);
    var male = 0, female = 0;

    var dictAgeAnalysis = [];

    if ($.isEmptyObject(data.poll_chart_data) == false) {
        var chartData = data.poll_chart_data[0];

        var realTotalCount = parseInt(chartData.male) + parseInt(chartData.female);
        if (totalCount < realTotalCount) {
            totalCount = realTotalCount;
        }

        if (totalCount > 0) {
            male = chartData.male / totalCount * 100;
            female = chartData.female / totalCount * 100;
        }

        dictAgeAnalysis = [
            {'type':'10','percent':data.poll_chart_data[0]["10th"] / totalCount * 100},
            {'type':'20','percent':data.poll_chart_data[0]["20th"] / totalCount * 100},
            {'type':'30','percent':data.poll_chart_data[0]["30th"] / totalCount * 100},
            {'type':'40','percent':data.poll_chart_data[0]["40th"] / totalCount * 100},
            {'type':'50~60','percent':(data.poll_chart_data[0]["50th"] / totalCount * 100) + (data.poll_chart_data[0]["60th"] / totalCount * 100)}
        ];
    }

    var div = $('<div>').addClass('gibon_jeongbo');
    div.append($('<div>').addClass('etc_title_name').text("투표에 참여한 사람들은? "));

    var ul = $('<ul>');

    var sli = $('<li>');
    var sdiv3 = $('<div>').addClass('background_div3');

    if (male+female > 0) {
        var maleT = (male > 0 ? male.toFixed(1) : '0') +'%';
        var femaleT = (female > 0 ? female.toFixed(1) : '0') +'%';
        sdiv3.html(
            "<div class='background_div2' style='background-color:#3963c6; width:"+male+"%; position:absolute; z-index:100; top:0px; left:0px; text-align:center;'>"+maleT+"</div>"+
            "<div class='background_div2' style='background-color:#e75349; width:"+female+"%; position:absolute; z-index:100; top:0px; left:"+male+"%; text-align:center;'>"+femaleT+"</div>"
        );
    }

    sli.append(sdiv3);
    sli.append($('<div>').html(
        "<div class='overflow_div'>"+
        "   <div class='float_left_text'>남</div>"+
        "   <div class='float_right_text'>여</div>"+
        "</div>"
    ));
    ul.append(sli);

    ul.append(appendAgeAnalysis(dictAgeAnalysis));

    div.append(ul);
    content.append(div);
}

function appendAgeAnalysis(dict) {

/*/SSONG TEST
    var dict = [
        {'type':'10','percent':0},
        {'type':'20','percent':80},
        {'type':'30','percent':0},
        {'type':'40','percent':20},
        {'type':'50~60','percent':0}
    ];
//*/

    var li = $('<li>');

    if (dict.length > 0) {

        var sortDict = dict.slice(0).sort(function(a, b) {
            return b.percent - a.percent;
        });

        var totalPercent = 0;
        var totalSize = 0;
        var firstDiv = 0;

        var isPerfect = false;

        for (var i=0; i<dict.length; i++) {
            totalPercent += dict[i].percent;

            dict[i].title = '';
            dict[i].color = '#cfcfcf';
            if (dict[i].type == sortDict[0].type) {
                dict[i].title = dict[i].percent.toFixed(1)+'%<br/>('+dict[i].type+'대)';
                dict[i].color = '#9abf60';

                firstDiv = i;

                if (dict[i].percent >= 100) {
                    isPerfect = true;
                }

            } else if (dict[i].type == sortDict[1].type) {
                dict[i].title = dict[i].percent.toFixed(1)+'%<br/>('+dict[i].type+'대)';
                dict[i].color = '#f2cc5d';
            }

            var sizeW = dict[i].percent;
            if (sizeW <= 0) {
                sizeW = 0.5;
            } else if (sizeW < 1) {
                sizeW = 1;
            }
            dict[i].sizeW =  sizeW;

            totalSize += sizeW;
        }

        if (totalSize >= 100) {
            var size = totalSize - 100;
            if (dict[firstDiv].sizeW > size) {
                dict[firstDiv].sizeW -= size;
            }
        }

        if (isPerfect) {
            for (var i=0; i<dict.length; i++) {
                if (firstDiv != i) {
                    dict[i].sizeW = 0;
                }
            }
        }

        var div3 = $('<div>').addClass('background_div3');
        var left = 0;
        if (totalPercent > 0) {
            for (var i = 0; i < dict.length; i++) {
                var dictDiv = $('<div>').addClass('background_div2').attr('id', 'dictDiv_' + i).css({
                    "position": "absolute",
                    "z-index": "100",
                    "top": "0px",
                    "bottom": "0px",
                    "text-align": "center",
                    "overflow-wrap": "break-word",

                    "-webkit-box-sizing": "border-box",
                    "-moz-box-sizing": "border-box",
                    "box-sizing": "border-box",
                });

                dictDiv.css('background-color', dict[i].color);

                if (isPerfect) {
                    if (firstDiv == i) {
                        dictDiv.css('width', '100%');
                        dictDiv.css('left', '0%');
                    } else {
                        dictDiv.css('width', '0%');
                        dictDiv.css('left', '0%');
                    }

                } else {
                    dictDiv.css('width', dict[i].sizeW + '%');
                    dictDiv.css('left', left + '%');

                    if (i > 0) {
                        dictDiv.css({
                            "border-left": "1px outset",
                            "border-left-color": "#ffffff"
                        });
                    }
                }

                var title = dict[i].title;
                if (title) {
                    dictDiv.html(
                        "<p>" + title + "</p>"
                    );
                }

                left += dict[i].sizeW;

                div3.append(dictDiv);
            }
        }
        li.append(div3);
    }

    li.append($('<div>').html(
        "<div class='overflow_div'>"+
        "   <div class='float_left_text'>10대</div>"+
        "   <div class='float_right_text'>50대 이상</div>"+
        "</div>"
    ));

    return li;
}

var facebookBtnTouchEvent = function(num) {

    var shareUrl = "https://onpanel.co.kr/onpoll/poll/result#poll_num:"+num+"&mtype:sns";

    FacebookInAppBrowser.login({
        send: function() {
            console.log('login opened');
        },
        success: function(access_token) {
            console.log('done, access token: ' + access_token);
        },
        denied: function() {
            console.log('user denied');
        },
        timeout: function(){
            console.log('a timeout has occurred, probably a bad internet connection');
        },
        complete: function(access_token) {
            console.log('window closed');
            if(access_token) {
                console.log(access_token);
            } else {
                console.log('no access token');
            }
        },
        userInfo: function(userInfo) {
            if(userInfo) {
                console.log(JSON.stringify(userInfo));

                FacebookInAppBrowser.share({
                    href: shareUrl
                }, function(response) {
                });

            } else {
                console.log('no user info');
            }
        }
    });
}

var shareBtnTouchEvent = function(num) {
    var shareUrl = "https://onpanel.co.kr/onpoll/poll/result?poll_num="+num+"&mtype=sns";
    console.log(shareUrl);
    cordova.plugins.clipboard.copy(shareUrl, function (success) {
        alertLayer("URL이 복사 되었습니다.");
    }, function (error) {
        console.log(error);
    });
}

//온폰 댓글
function getOnpollCommentList(pollNum) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.ONPOLL.OPINIONLIST
        , {poll_num:pollNum}
        , function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                if (data.resultType == 'SUCCESS') {
                    appendOnpollCommentList(data.result);
                } else {
                    console.log(data.resultType+": "+data.resultMsg);
                }
            }
            else {
                console.log('WORRING: Request Fail');
            }
        }
        , function (e,e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );
}

function appendOnpollCommentList(data) {
    var content = $('.comment_content').attr('id','range');
    content.empty();

    $('#modalOnpollCommentList').data({poll_num: data.poll_num});

    var my_info_id = COMMON.storage.get("my_info_id");

    for (var i=0; i<data.opinion_data.length; i++) {
        var opinion = data.opinion_data[i];

        var title = opinion.board_title;

        var span = my_info_id == opinion.write_id;
        if (opinion.del_flag == "Y") {
            title = '삭제된 댓글입니다.';
            span = false;
        }

        var group = $('<div>').addClass('comment_group').attr({
            'id':'commet'+opinion.write_seq,
            'flag':opinion.del_flag
        });

        var info = $('<div>').addClass('comment_info');
        if (span) info.append("<a href='javascript:;' onclick='deleteCommet("+opinion.write_seq+",0);'><span>삭제</span></a>");
        info.append("<em>"+opinion.write_id+"</em><strong>"+opinion.reg_datetime+"</strong>");
        group.append(info);

        group.append($('<div>').addClass('comment_text').text(title));

        var etc = ($('<div>').addClass('comment_etc').html(
            "<div class='reply_div' ct="+opinion.opinion_reply_ct+" onclick='input_reply("+opinion.write_seq+")'>" +
            "답글 "+opinion.opinion_reply_ct+"<span>▼</span>"+
            "</div>"
        ));

        appandChucheonBtn(etc,opinion.write_seq,opinion.etc1,opinion.etc2);

        group.append(etc);

        appendOnpollCommentListReply(group, opinion, my_info_id);

        content.append(group);
    }

    setTimeout(function () {
        onsolModal.show('#modalOnpollCommentList');
    }, 100);
}

var input_reply = function (num) {
    if($(".textarea_comment").is(":focus")) {
        $('.textarea_comment').focusout();
        $('#comment_input_text').val('');
        gCommentNum = 0;
    } else {
        $('.textarea_comment').focus();
        gCommentNum = num;
    }
}

function saveCommet() {
    var replyDepth = gCommentNum > 0 ? 1 : 0;
    var parentSeq = gCommentNum;

    $('.textarea_comment').focusout();
    gCommentNum = 0;

    var opinion = $('#modalOnpollCommentList').data();

    var inputText =  $('#comment_input_text');
    var title = inputText.val();
    if (title == '' || title.length == 0) {
        return;
    }

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.ONPOLL.OPINION
        , {
            poll_num:opinion.poll_num,
            reply_depth: replyDepth,
            parent_seq: parentSeq,
            opinion_title: title
        }
        , function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                if (data.resultType == 'SUCCESS') {
                    console.log(data);
                    var result = data.result;
                    if (replyDepth == 0) {
                        appendCommetGroup(result.opinion_id, title, result.opinion_date);
                    } else {

                        var reply_div = $('#commet'+parentSeq).find('.reply_div');

                        var ct = parseInt(reply_div.attr('ct')) + 1;
                        reply_div.attr({'ct':ct.toString()});
                        reply_div.text('답글 '+ct);

                        reply_div.append("<span>▼</span>");

                        appendReplyGroup(result.opinion_id, title, result.opinion_date, parentSeq);
                    }
                } else {
                    console.log(data.resultType+": "+data.resultMsg);
                }
            }
            else {
                console.log('WORRING: Request Fail');
            }
        }
        , function (e,e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );

    inputText.val('');
}

function appendCommetGroup(write_seq, title, reg_datetime) {
    var write_id = COMMON.storage.get("my_info_id");
    var group = $('<div>').addClass('comment_group').attr('id','commet'+write_seq);
    var info = $('<div>').addClass('comment_info');
    info.append("<a href='javascript:;' onclick='deleteCommet("+write_seq+",0);'><span>삭제</span></a>");
    info.append("<em>"+write_id+"</em><strong>"+reg_datetime+"</strong>");
    group.append(info);
    group.append($('<div>').addClass('comment_text').text(title));
    var etc = ($('<div>').addClass('comment_etc').html(
        "<div class='reply_div' ct='0' onclick='input_reply("+write_seq+")'>" +
        "답글 0<span>▼</span>"+
        "</div>"
    ));

    appandChucheonBtn(etc,write_seq,0,0);

    group.append(etc);
    $('.comment_content').append(group);
}

function appandChucheonBtn(etc,write_seq,up,down) {
    etc.append($('<div>').addClass('chucheon_btn').html(
        "<a href='javascript:;' onclick='goodCommet("+write_seq+",1);'><span class='up_btn'>"+up+"</span></a>"+
        "<a href='javascript:;' onclick='goodCommet("+write_seq+",2);'><span class='down_btn'>"+down+"</span></a>"
    ));
}

function appendReplyGroup(write_seq, title, reg_datetime, parent_seq) {
    var write_id = COMMON.storage.get("my_info_id");

    var replyGroup = $('<div>').addClass('reply_group_div').attr('id','reply'+write_seq);

    replyGroup.append("<span>ㄴ</span>");

    var replyWidth = $('<div>').addClass('replay_width');
    var info = $('<div>').addClass('comment_info');
    info.append("<a href='javascript:;' onclick='deleteCommet("+write_seq+",1);'><span>삭제</span></a>");
    info.append("<em>"+write_id+"</em><strong>"+reg_datetime+"</strong>");
    replyWidth.append(info);
    replyWidth.append($('<div>').addClass('comment_text').text(title));
    replyGroup.append(replyWidth);

    $('#commet'+parent_seq).append(replyGroup);
}

function deleteCommetAction(num, type) {

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.ONPOLL.OPINIONDEL
        , {
            write_seq: num,
            opinion_type: "0"
        }
        , function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                if (data.resultType == 'SUCCESS') {

                    if (type == 0) {

                        var commetGroup = $('#commet' + num);
                        commetGroup.attr('flag','Y');
                        commetGroup.find('.comment_info:first a').remove();
                        commetGroup.find('.comment_text:first').text('삭제된 댓글입니다.');

                    } else {

                        var replyGroup = $('#reply'+num);
                        replyGroup.attr('flag','Y');
                        replyGroup.find('a').remove();
                        replyGroup.find('.replay_width .comment_text').text('삭제된 댓글입니다.');

                        var reply_div = replyGroup.parent().find('.comment_etc .reply_div');
                        var ct = parseInt(reply_div.attr('ct')) - 1;
                        reply_div.attr({'ct':ct.toString()});
                        reply_div.text('답글 '+ct);
                        reply_div.append("<span>▼</span>");

                    }

                } else {
                    console.log(data.resultType+": "+data.resultMsg);
                }
            }
            else {
                console.log('WORRING: Request Fail');
            }
        }
        , function (e,e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );
}

function deleteCommet(num, type) {
    try{
        document.addEventListener('deviceready', function() {
            navigator.notification.confirm("삭제하시겠습니까?", function(index) {
                if(index == 1) {
                    deleteCommetAction(num, type);
                }
            }, '확인',"확인,취소");
        }, true);
    }
    catch(e) {
        if(confirm("삭제하시겠습니까?")) {
            deleteCommetAction(num, type);
        }
    }
}

function goodCommet(num, type) {
    var flag = $('#commet' + num).attr('flag');
    if (flag == 'Y') {

        alertLayer('삭제된 댓글입니다.');

    } else {

        ONPANEL.Ajax.Request.invokePostByJSON(
            CONSTANTS.ONPOLL.GOODCOMMENT
            , {
                write_seq: num,
                type: type
            }
            , function (data) {
                if (data == 1) {
                    if (type == '1') {
                        var up = $('#commet' + num).find('.chucheon_btn a:first-child span');
                        var upCnt = parseInt(up.text());
                        up.text(++upCnt);

                    } else {
                        var down = $('#commet' + num).find('.chucheon_btn a:last-child span');
                        var downCnt = parseInt(down.text());
                        down.text(++downCnt);
                    }
                }
                else {

                    alertLayer('이미 공감한 댓글입니다.');
                }
            }
            , function (e, e2) {
                console.log(e);
                console.log(e2);
            }
            , true
        );
    }
}

function appendOnpollCommentListReply(content, data, name) {
    for (var i=0; i<data.opinion_reply_data.length; i++) {
        var reply = data.opinion_reply_data[i];
        var title = reply.board_title;

        var span = name == reply.write_id;
        if (reply.del_flag == "Y") {
            title = '삭제된 댓글입니다.';
            span = false;
        }

        var replyGroup = $('<div>').addClass('reply_group_div').attr({
            'id': 'reply'+reply.write_seq,
            'flag':reply.del_flag
        });

        replyGroup.append("<span>ㄴ</span>");

        var replyWidth = $('<div>').addClass('replay_width');
        var info = $('<div>').addClass('comment_info');
        if (span) info.append("<a href='javascript:;' onclick='deleteCommet("+reply.write_seq+",1);'><span>삭제</span></a>");
        info.append("<em>"+reply.write_id+"</em><strong>"+reply.reg_datetime+"</strong>");
        replyWidth.append(info);
        replyWidth.append($('<div>').addClass('comment_text').text(title));
        replyGroup.append(replyWidth);
        content.append(replyGroup);
    }
}
