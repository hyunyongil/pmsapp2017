/**
 * onpanel 설문 참여 관련된 처리를 위한 object
 * @create 2013-02-20
 * @author woogeun song
 */
var user_first = 'N'; // 퍼스트 설문을 했으면 N , 안했으면 Y
var user_first_update_yn = 'N'; // 6개월 지나면 Y
var imageYN = 0;

function Join() {
    /** @var json type 설문 설정 데이터(초기화 과정 필요) **/
    this.surveySeq = null; //view에서 설정한 설문seq
    this.imgUrl = null; //view에서 설정한 이미지 절대경로
    this.surveyData = []; //전체 설문 Json 데이터
    this.grpList = []; //grpSeq를 key로 갖는 그룹리스트
    this.grpListTmp = {}; //grpSeq를 key로 갖는 그룹리스트
    this.defaultGrpSeq = [];
    this.qstList = [];
    this.skinCode = null;
    this.skinUrl = null;
    this.cssUrl = null;

    // 설문 데이터
    this.joinData = {
        'grpList': {},
        'nextGrpSeq': {},
        'nextQstSeq': {'1': 0},
        'totalQstCnt': 0,
        'pageIndex': 1,
        'historyBack': {}
    };


    this.isMode = '';
    this.maxRankCnt = {};
    this.totalQstCnt = 0;
    this.questionCnt = 0;

    this.checkSelectCnt = 1;

    /**
     * 참여 data를 저장온다.
     */
    this.setJoinData = function (flag, chPer, callback) {
        var paramData = {
            'surveySeq': this.surveySeq,
            'limit_type': this.limit_type,
            'surveyLinkId': this.surveyLinkId,//비회원 테이블 분리 추가 -june// 053
            'doAction': 'askData',
            'chPer': chPer,
            'askData': joinSurvey.joinData
        };

        // todo 개발중...
        if (flag == 1)//종료
        {
            paramData['resSuccess'] = 'TRUE';
            onpanel.setData('/survey/surveyJoinActionNew', paramData, function (res) {
                if (typeof callback === 'function') {

                    //종료 문구
                    if (res.resultMsg == 'LINK') {
                        var pointMsg = '';
                    } else {
                        var pointMsg = '설문을 참여해주셔서 감사합니다. 총 ' + res.result + ' 포인트가 적립되었습니다.';
                    }

                    //onpanel.printMsgNo('설문을 참여해주셔서 감사합니다. 총 '+res.result+' 포인트가 적립되었습니다.');
                    callback(pointMsg);
                }
            });

        } else if (flag == 2)//중간종료
        {
            paramData['resSuccess'] = 'SECONDTRUE';
            onpanel.setData('/survey/surveyJoinActionNew', paramData, function (res) {
                if (typeof callback === 'function') {
                    //종료 문구
                    if (res.resultMsg == 'LINK') {
                        var pointMsg = '';
                    } else {
                        var pointMsg = '설문을 참여해주셔서 감사합니다. 총 ' + res.result + ' 포인트가 적립되었습니다.';
                    }
                    // onpanel.printMsgNo('설문을 참여해주셔서 감사합니다. 총 '+res.result+' 포인트가 적립되었습니다.');
                    callback(pointMsg);
                }
            });

        } else {//NEXT
            onpanel.setData('/survey/surveyJoinActionNew', paramData, function (res) {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    }
}

var joinSurvey = new Join();


/**
 * 설문 참여 관련 유틸
 */
var surveyUtil = {

    surveyStartToggle: false

    /**
     * 설문지 참여하기
     * @param surveySeq
     * @returns {boolean}
     */
    , initSurveyData: function () {

        console.log('surveyUtil.initSurveyData');

        var data = $('#join').data();

        if (!data.surveySeq) {
            $.mobile.changePage('poll.html');

            return false;
        }

        ONPANEL.Ajax.Request.invokePostByJSON(
            CONSTANTS.SURVEY.ABLE_JOIN_SURVEY
            , {surveySeq: data.surveySeq}
            , function (data) {
                if (ONPANEL.Ajax.Result.isSucess(data)) {

                    surveyUtil.setSurveyData(data);

                    createJoinCover();
                }
                else {
                    console.log('survey data fail');
                }
            }
            , function (e, e2) {
                console.log(e);
                console.log(e2);
            }
            , true
        );
    }

    /**
     * 설문데이터를 스토리지에 담아둠
     */
    , setSurveyData: function (data) {
        localStorage.setItem('survey.surveyData', JSON.stringify(data));

        joinSurvey.surveyData = data.result.jsonSurveyData;
        joinSurvey.surveySeq = data.result.surveySeq;
        joinSurvey.grpList = joinSurvey.surveyData.grpList;
        joinSurvey.joinData = data.result.joinMyInfo;

        var orderList = [];
        var orderList2 = [];
        for (var i in joinSurvey.grpList) //order값으로 정렬
        {
            orderList[joinSurvey.grpList[i].orderNum] = joinSurvey.grpList[i].grpSeq;
        }

        $.each(orderList, function (k, v) {
            if (typeof v != "undefined") {
                var orderData = {
                    grpSeq: joinSurvey.grpList[v].grpSeq
                    , grpType: joinSurvey.grpList[v].grpType
                };

                orderList2.push(orderData);
            }
        });


        // orderNum 으로 정렬
        $.each(orderList2, function (k, v) {
            var i = v.grpSeq
                , grpType = v.grpType
                ;
            if (joinSurvey.defaultGrpSeq.length == 0) {
                joinSurvey.joinData.nextGrpSeq[1] = i;
            }

            if (v.grpType == 1) { // level1 그룹을 배열로 만든다.
                joinSurvey.defaultGrpSeq.push(i);
            }

            joinSurvey.totalQstCnt = joinSurvey.totalQstCnt + joinSurvey.grpList[i].qstCnt;

            joinSurvey.grpListTmp[i] = {'qstList': {}};
            for (y in joinSurvey.grpList[i].qstList) {
                joinSurvey.grpListTmp[i].qstList[joinSurvey.grpList[i].qstList[y].qstSeq] = JSON.parse(JSON.stringify(joinSurvey.grpList[i].qstList[y]));
            }
        });

    }

    /**
     * 설문데이터를 반환함
     */
    , getSurveyData: function () {
        var surveyData = JSON.parse(localStorage.getItem('survey.surveyData'));

        return surveyData;
    }

    /**
     * 그룹 seq 를 구해옴.
     */
    , getGroupSeq: function () {
        var seq = "";
        try {
            seq = location.hash.replace("#", "").split("_")[0];
        }
        catch (e) {
        }

        return seq;
    }

    /**
     * 현재 그룹의 순서
     */
    , getQuestionKey: function () {
        var key = 0;
        try {
            key = parseInt(location.hash.replace("#", "").split("_")[1]) - 1;
        }
        catch (e) {
        }

        return key;
    }

    /**
     * 설문 시작
     */
    , surveyStart: function () {

        var survey_data = surveyUtil.getSurveyData()
            , data = survey_data.result
            , pageId = "#" + getFirstQuestion(data)
            ;

        location.hash = pageId;
        $.mobile.changePage(pageId);
    }
};


function readyPoll() {
    $(document).ready(function () {
        bindTabEvent();
    });

    bindPollList();
    bindPollJoin();
    bindPollEnd();
}

function bindTabEvent() {
    $('.topNavbar li a').bind('click', function () {
        //$('.topNavbar li a').removeClass('ui-btn-active');
        //$(this).addClass('ui-btn-active');

        /*
         var url = CONSTANTS.SURVEY.LIST;
         if (this.href.endsWith('#end'))
         url = CONSTANTS.SURVEY.ENDLIST;
         */

        var url = CONSTANTS.SURVEY.LIST;
        if ($(this).hasClass('end_list')) {
            url = CONSTANTS.SURVEY.ENDLIST;
            getSurvey(url, 1, appendPoll);
        }
        else {
            responseUpdateList();

        }
    });
}

function responseUpdateList() {

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.SURVEY.UPDATE_INFO,
        {},
        function (data) {
            var pollList = $('.poll-list')
                , responseListHtml = []
                ;

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                var response_lists = ONPANEL.Ajax.Result.getData(data);
                $.each(response_lists, function (k, v) {
                    if (k == "first") {

                        user_first = v.show_yn;
                        user_first_update_yn = v.update_yn;
                        if (v.show_yn == "Y" || v.update_yn == "Y") {
                            responseListHtml.push('<div class="poll_list bg_w box_shadow ">');
                            responseListHtml.push('    <div class="poll_list_type_a padding15">' + v.title + '<span>' + v.update_time + '</span></div>');
                            responseListHtml.push('    <div class="padding15">');
                            responseListHtml.push('        <div class="poll_list_title">');
                            responseListHtml.push('            <span class="plist_title">' + v.sub_title + '</span>');
                            if (v.update_time) {
                                responseListHtml.push('            <span class="plist_update">[업데이트]</span>');
                            }
                            responseListHtml.push('        </div>');
                            responseListHtml.push('        <div class="poll_list_count"><span class="f_col_g poll_icon_red_question" aria-hidden="true" style="margin:13px 0;"></span><span style="padding-left:5px;">' + v.question_cnt + ' 문항</span></div>');
                            //responseListHtml.push('        <div class="poll_list_point"><span style="display:block;border-left:1px solid #ededed;padding-left: 5px;margin:13px 0;"> <span class="f_col_g poll_icon_red_point" aria-hidden="true"></span> '+ v.point +' P</span></div>');
                            responseListHtml.push('        <div class="poll_list_point"><span style="display:block;border-left:1px solid #ededed;padding-left: 5px;margin:13px 0;"> <span class="f_col_g poll_icon_red_point" aria-hidden="true"></span> 최초 ' + v.point + ' P</span></div>');
                            responseListHtml.push('        <div class="poll_list_time"><span class="f_col_g poll_icon_red_time" aria-hidden="true" style="margin:13px 0;"></span><span style="padding-left: 5px;">약 ' + v.survey_time + ' 분</span></div>');
                            responseListHtml.push('        <div class="poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-a">');
                            responseListHtml.push('            <span class="ui-btn-inner" onclick="location.href=\'' + v.link_url + '\'"><span class="ui-btn-text">');
                            if (type == 'car') {
                                responseListHtml.push('차');
                            } else if (type == 'civilservant') {
                                responseListHtml.push('<img src="images/m_img/poll_pn6.png">');
                            } else if (type == 'housewife') {
                                responseListHtml.push('<img src="images/m_img/poll_pn1.png">');
                            } else if (type == 'life') {
                                responseListHtml.push('<img src="images/m_img/poll_pn7.png">');
                            } else if (type == 'multicultural') {
                                responseListHtml.push('<img src="images/m_img/poll_pn5.png">');
                            } else if (type == 'single') {
                                responseListHtml.push('<img src="images/m_img/poll_pn4.png">');
                            } else if (type == 'smart') {
                                responseListHtml.push('<img src="images/m_img/poll_pn2.png">');
                            } else if (type == 'specialty') {
                                responseListHtml.push('<img src="images/m_img/poll_pn3.png">');
                            } else if (type == 'young') {
                                responseListHtml.push('<img src="images/m_img/poll_pn8.png">');
                            }
                            responseListHtml.push('            참여하기</span></span>');
                            responseListHtml.push('        </div>');
                            responseListHtml.push('    </div>');
                            responseListHtml.push('</div>');
                            imageYN = 1;
                        }
                    }

                    if (k.indexOf("power_") > -1) {

                        var type = k.replace("power_", "");
                        console.log(type);
                        if (v.show_yn == "Y" || v.update_yn == "Y") {
                            responseListHtml.push('<div class="poll_list bg_w box_shadow ">');
                            responseListHtml.push('    <div class="poll_list_type_b padding15">' + v.title + '<span>' + v.update_time + '</span></div>');
                            responseListHtml.push('    <div class="padding15">');
                            responseListHtml.push('        <div class="poll_list_title">');
                            responseListHtml.push('            <span class="plist_title_b">' + v.sub_title + '</span>');
                            if (v.update_time) {
                                responseListHtml.push('            <span class="plist_update_b">[업데이트]</span>');
                            }
                            responseListHtml.push('        </div>');
                            responseListHtml.push('        <div class="poll_list_count"><span class="f_col_g poll_icon_green_question" aria-hidden="true" style="margin:13px 0;"></span><span style="padding-left:5px;">' + v.question_cnt + ' 문항</span></div>');
                            //responseListHtml.push('        <div class="poll_list_point"><span style="display:block;border-left:1px solid #ededed;padding-left: 5px;margin:13px 0;"> <span class="f_col_g poll_icon_green_point" aria-hidden="true"></span> '+ v.point +' P</span></div>');
                            responseListHtml.push('        <div class="poll_list_point"><span style="display:block;border-left:1px solid #ededed;padding-left: 5px;margin:13px 0;"> <span class="f_col_g poll_icon_green_point" aria-hidden="true"></span> 0 ~ 100 P</span></div>');
                            responseListHtml.push('        <div class="poll_list_time"><span class="f_col_g poll_icon_green_time" aria-hidden="true" style="margin:13px 0;"></span><span style="padding-left: 5px;">약 ' + v.survey_time + ' 분</span></div>');
                            responseListHtml.push('        <div class="poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-e">');
                            responseListHtml.push('            <span class="ui-btn-inner" onclick="location.href=\'' + v.link_url + '\'"><span class="ui-btn-text">');
                            if (type == 'car') {
                                responseListHtml.push('성공');
                            } else if (type == 'civilservant') {
                                responseListHtml.push('<img src="images/m_img/poll_pn6.png">');
                            } else if (type == 'housewife') {
                                responseListHtml.push('<img src="images/m_img/poll_pn1.png">');
                            } else if (type == 'life') {
                                responseListHtml.push('<img src="images/m_img/poll_pn7.png">');
                            } else if (type == 'multicultural') {
                                responseListHtml.push('<img src="images/m_img/poll_pn5.png">');
                            } else if (type == 'single') {
                                responseListHtml.push('<img src="images/m_img/poll_pn4.png">');
                            } else if (type == 'smart') {
                                responseListHtml.push('<img src="images/m_img/poll_pn2.png">');
                            } else if (type == 'specialty') {
                                responseListHtml.push('<img src="images/m_img/poll_pn3.png">');
                            } else if (type == 'young') {
                                responseListHtml.push('<img src="images/m_img/poll_pn8.png">');
                            }
                            responseListHtml.push('            참여하기</span></span>');
                            responseListHtml.push('        </div>');
                            responseListHtml.push('    </div>');
                            responseListHtml.push('</div>');
                            imageYN = 1;
                        }
                    }
                });

                pollList.html(responseListHtml.join(''));
                //pollList.listview("refresh");
            }


            getSurvey(CONSTANTS.SURVEY.LIST, 1, appendPollInit);

        },
        null,
        true);
}

function bindPollList() {
    $(document).on('pageinit', '#poll_list', function () {

        responseUpdateList();
        //getSurvey(CONSTANTS.SURVEY.LIST, 1, appendPoll);
        bindSurveyEvent();
        bindMoreEvent();

        onsolMoreList.init(function () {
            var data = $('.poll-more').data();
            if ($.isEmptyObject(data)) {
                $('.poll-more').data({url: "/api/survey/surveyList", page: 0});
                var data = $('.poll-more').data();
            }

            var now_page = parseInt(data.page) + 1;

            console.log("data");
            console.log(data);

            if (now_page > 1) {

                if (onsolMoreList.scroll_mode == false) return false;

                getSurvey(data.url, parseInt(data.page) + 1, appendPoll);
            }
        });

        //ableJoinSurvey(2164, createJoinSurvey);
    });
}

// 설문 조사 시작하기
function bindPollJoin() {
    $(document).on('pageinit', '#join', function () {
        var data = $(this).data();

        if (!data.surveySeq) {
            $.mobile.changePage('poll.html');
        }
        else {
            surveyUtil.initSurveyData();
        }


        //console.log('bindPollJoin 1');

        //ableJoinSurvey(data.surveySeq, createJoinCover);

        //console.log('bindPollJoin 2');
    });
}

function bindPollEnd() {
    $(document).on('pageinit', '#poll_end', function () {
        var prevQuestion = $(this).data('prev_question');
        //var saveData = makeSaveData(prevQuestion);
        //console.log(saveData);

        console.log('end page');
    });
}

function getSurvey(url, page, callback) {
    if (!page)
        page = 1;
    if (page > 1)
        imageYN = 1;
    $('.poll-more').data({url: url, page: page});

    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        {
            page: page,
            list_cnt: 5
        },
        function (data) {

            try {
                if (ONPANEL.Ajax.Result.isSucess(data)) {
                    callback(ONPANEL.Ajax.Result.getData(data));
                }
                console.log(data);
                onsolMoreList.scroll_mode = true;
            }
            catch (e) {
                onsolMoreList.scroll_mode = true;
            }
        },
        null,
        true);
}

function gotoSurveyMove(surveySeq) {

    if (user_first == "Y") {
        alertLayer("퍼스트 설문 참여후 이용하세요.");
        $(location).attr('href', 'firstPoll.html#first1');
    }
    else {
        if (user_first_update_yn == 'Y') {
            alertLayer("퍼스트설문 업데이트 (6개월 기준) 후 참여 가능합니다.\n퍼스트설문 페이지로 이동합니다.");
            $(location).attr('href', 'firstPoll.html#first1');
        } else {
            location.href = 'poll_join_new.html?surveySeq=' + surveySeq;
        }
    }
}


function appendPollInit(data) {

    var pollList = $('.poll-list');
    if (data.arrSurveyList.length == 0 && imageYN == 0) {
        pollList.html("<img src='images/m_img/msg1.jpg' width='100%'>");
    }
    for (var i = 0; i < data.arrSurveyList.length; i++) {
        var survey = data.arrSurveyList[i];

        var row = $('<a>')
            //.attr("href","poll_join.html?surveySeq="+survey.survey_seq)
                .attr('data-ajax', 'false')
                .attr('data-survey-seq', survey.survey_seq)
                .attr('data-used', survey.btnUsed)

            //.click(function(){
            //    if($(this).attr("data-used") == "설문참여") {
            //        //location.href = "poll_join.html?surveySeq="+$(this).attr("data-survey-seq");
            //    }
            //    else {
            //        alertLayer($(this).attr("data-used")+" 상태에선 참여가 불가능합니다.");
            //    }
            //    return false;
            //})
            ;

        var question_class = ""
            , point_class = ""
            , time_class = ""
            , cal_class = ""
            , service_class = ""
            ;
        if ($("#poll_survey_ing").hasClass("ui-btn-active")) {
            question_class = "poll_icon_question";
            point_class = "poll_icon_point";
            time_class = "poll_icon_time";
            cal_class = "poll_icon_cal";
            service_class = "poll_icon_service";
        }
        else {
            question_class = "poll_icon_question_off";
            point_class = "poll_icon_point_off";
            time_class = "poll_icon_time_off";
            cal_class = "poll_icon_cal_off";
            service_class = "poll_icon_service_off";
        }
        var type_str = "";
        if(survey.service_type == 'ALL'){
            type_str = '온라인/모바일';
			service_class = "poll_icon_service3";
        }else if(survey.service_type == 'WEB'){
            type_str = '온라인';
			service_class = "poll_icon_service2";
        }else if(survey.service_type == 'MOBILE'){
            type_str = '모바일';
			service_class = "poll_icon_service";
        }
        if (survey.btnUsed == "참여완료" || survey.btnUsed == "참여대상아님") {
            row.append($('<div>').addClass('poll_list_title title_end').text(survey.survey_title));
        } else {
            row.append($('<div>').addClass('poll_list_title').text(survey.survey_title));
        }
        //row.append($('<div>').addClass('poll_list_count').html("<span class='f_col_g glyphicon glyphicon-th-list' aria-hidden='true'></span><span class='f_col_g'> 문항수</span><span style='float:right;padding-right:15px;'>"+survey.qst_cnt + survey.btnUsed+"</span>"));
        row.append($('<div>').addClass('poll_list_count poll_top50').html("<span class='f_col_g " + question_class + "' aria-hidden='true' style='display:inline-block;margin:13px 0;'></span><span style='padding-left: 5px;'>" + survey.qst_cnt + " 문항" + "</span>"));
        row.append($('<div>').addClass('poll_list_point poll_top50').html("<span style='display:block;border-left:1px solid #ededed;padding-left: 5px;margin:12px 0;'> <span class='f_col_g " + point_class + "' aria-hidden='true'></span> " + survey.point_pay + " P</span>"));
        row.append($('<div>').addClass('poll_list_time poll_top50').html("<span class='f_col_g " + time_class + "' aria-hidden='true' style='display:inline-block;margin:13px 0;'></span><span style='padding-left: 5px;'>약 " + survey.itemtime + "</span>"));
        row.append($('<div>').addClass('poll_list_date poll_top50').html("<span class='f_col_g " + cal_class + "' aria-hidden='true' style='display:inline-block;margin:13px 0;'></span><span style='padding-left: 5px;font-size:11px;'>" + survey.survey_endday_str + "</span>"));
        row.append($('<div>').addClass('poll_list_service poll_top50').html("<span class='f_col_g " + service_class + "' aria-hidden='true' style='display:inline-block;margin:13px 0;'></span><span style='padding-left: 5px;font-size:11px;'>" + type_str + "</span>"));
        if ($("#poll_survey_ing").hasClass("ui-btn-active")) {
            if (survey.btnUsed == "설문참여") {
                if(survey.service_type == 'WEB'){

                    row.append($('<div>').addClass('poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-b').html("<span class='ui-btn-inner' onclick=\"javascript:alertLayer('온라인 전용 설문입니다.\\nPC환경 온패널 사이트(https://www.onpanel.co.kr)에서\\n참여 부탁드립니다.');\"><span class='ui-btn-text'>온라인 전용</span></span>"));
                }else{
                    row.append($('<div>').addClass('poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-b').html("<span class='ui-btn-inner' onclick=\"javascript:gotoSurveyMove(" + survey.survey_seq + ");\"><span class='ui-btn-text'>" + survey.btnUsed + "</span></span>"));
                }
            }
            else {
                if (survey.btnUsed == "참여완료") {
                    row.append($('<div>').addClass('poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-b').css({
                        "background-color": "#999999",
                        "border-color": "#999999"
                    }).html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + survey.btnUsed + "</span></span>"));
                }
                else if (survey.btnUsed == "참여대상아님") {
                    row.append($('<div>').addClass('poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-b daesang_no_btn').html("<span class='ui-btn-inner' onclick=\"alertLayer('참여대상이 아닙니다.');\"><span class='ui-btn-text'>" + survey.btnUsed + "</span></span>"));
                }
                else {
                    row.append($('<div>').addClass('poll_list_btn ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-b daesang_no_btn').html("<span class='ui-btn-inner' onclick=\"alertLayer('" + survey.btnUsed + " 상태에선 참여가 불가능합니다.');\"><span class='ui-btn-text'>" + survey.btnUsed + "</span></span>"));
                }
            }
        }
        $('<div>').attr('id', survey.survey_seq).attr("data-used", survey.btnUsed).attr("class", "poll_list bg_w box_shadow padding15").append(row).appendTo(pollList);
    }

    //pollList.listview("refresh");

    var moreButton = $('.poll-more');
    //if ((data.page * data.list_cnt) < parseInt(data.tot_cnt))
    //    moreButton.show();
    //else
    //    moreButton.hide();

    if ((data.page * data.list_cnt) < parseInt(data.tot_cnt)) {
        //moreButton.show();
    }
    else {
        onsolMoreList.last_page = true;
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
        getSurvey(data.url, parseInt(data.page) + 1, appendPoll);
    });
}

// 설문 진행 표지 보여줌.
function bindSurveyEvent() {
    $('.poll-list li').unbind().bind('click', function (event, ui) {
        var join = $('#join');
        join.data({surveySeq: this.id});

        $.mobile.changePage('#join');
    });
}

function ableJoinSurvey(surveySeq, callback) {

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.SURVEY.ABLE_JOIN_SURVEY,
        {surveySeq: surveySeq},
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                callback(ONPANEL.Ajax.Result.getData(data));
            }
        },
        null,
        true
    );
}

// 설문 표지를 그림.
function createJoinCover() {

    var survey_data = surveyUtil.getSurveyData()
        , data = survey_data.result
        ;

    console.log('createJoinCover');

    var join = $('#join');

    //join.find('.join_survey_title').text(data.jsonSurveyData.surveyTitle).button().button("refresh");
    join.find('.join_survey_title').html(data.jsonSurveyData.layoutDataMobile.cover_title_text).button().button("refresh");
    join.find('.cover_content_text').html(data.jsonSurveyData.layoutDataMobile.cover_content_text);
    join.find('.join_start_end_date').html(
        new Date(data.jsonSurveyData.startDate).format("yyyy년MM월dd일")
        + "~" + new Date(data.jsonSurveyData.endDate).format("yyyy년MM월dd일")
    );


    //console.log(data.jsonSurveyData);


    //$.mobile.changePage('#join');

    // test
    //createSurvey(data);
    //$.mobile.changePage('#' + getFirstQuestion(data));
    //
    //$('.join-poll-button').unbind().bind('click', {survey: data}, function (event, ui) {
    //    createSurvey(event.data.survey);
    //
    //    $.mobile.changePage('#' + getFirstQuestion(event.data.survey));
    //});
}

// 설문지를 그림
function createSurveyIng() {
    console.log('createSurveyIng');
    var survey_data = surveyUtil.getSurveyData()
        , data = survey_data.result
        ;

    if (!data.surveySeq) {
        $.mobile.changePage('poll.html');
    }

    createJoinSurvey();
    //ableJoinSurvey(data.surveySeq, createJoinSurvey);
}

// 설문지를 그림
function createJoinSurvey() {
    console.log('createJoinSurvey');
    var survey_data = surveyUtil.getSurveyData()
        , data = survey_data.result
        ;

    if (surveyUtil.surveyStartToggle == false) {
        createSurvey(data);
    }

    $.mobile.changePage('#' + getFirstQuestion(data));

    //$('.join-poll-button').unbind().bind('click', {survey: data}, function (event, ui) {
    //    createSurvey(event.data.survey);
    //
    //    $.mobile.changePage('#' + getFirstQuestion(event.data.survey));
    //});
}


function createSurvey(data) {
    console.log('createSurvey');

    var grpList = data.jsonSurveyData.grpList
        , j = 0
        ;

    for (var grpSeq in grpList) {
        var group = data.jsonSurveyData.grpList[grpSeq];

        for (var i = 0; i < group.qstList.length; i++) {
            var question = group.qstList[i];

            //if(j == 0) {
            createQuestion(question);
            //}

            j++;
        }
    }

    surveyUtil.surveyStartToggle = true;

    //$('#poll-templete').clone().attr('id', '3560_1').attr('data-role', 'page').addClass('survey').show().appendTo($('body'));
}

function createQuestion(data) {
    var id = createQuestionId(data);

    var page = createPage(id, data);
    page.data({question: data});
    page.append(createHeader());
    page.append(createContent(data));
    page.appendTo($('body'));

    bindNavigationEvent(id);
}

function createQuestionId(data) {
    return data.grpSeq + '_' + data.orderNum;
}

function createPage(questionId, data) {
    //console.log(data);
    var page = $('<div>').attr('id', questionId).attr('data-role', 'page').addClass("question_" + data.grpSeq + "_" + data.qstSeq).addClass('survey').addClass('wrap');
    page.css({'background': 'url(../images/test_bg.png)', 'background-size': '100% 100%'});

    return page;
}

function createHeader() {
    var header = $('<div>').attr({'data-role': 'header', 'data-position': 'fixed'});
    $('<h1>').addClass('mainTopLogo').text('설문 조사').appendTo(header);
    $('<a>').attr({
        'href': '#',
        'data-icon': 'back',
        'data-rel': 'back'
    }).addClass('ui-btn-left').text('back').appendTo(header);

    return header;
}

function createContent(data) {
    var content = $('<div>').attr({'data-role': 'content'}).addClass('jqm-content');

    appendContentData(content, data)

    return content;
}

function appendContentData(content, data) {
    var quest = data.qstTitle + ' ' + data.qstComment;
    var quest_sub = '최소 4개의 답변을 하셔야합니다';

    appendQuestionTitle(content, quest, quest_sub);
    appendQuestionForm(content, data);
    appendQuestionNavigation(content);
}

function appendQuestionTitle(content, quest, quest_sub) {
    $('<div>').addClass('poll_quest').html(quest).appendTo(content);
    //$('<div>').addClass('poll_quest_sub').text(quest_sub).appendTo(content);
}

function appendQuestionForm(content, data) {
    var form = $('<form>').attr('id', createQuestionId(data));
    var pollList = $('<div>').addClass('poll_a_list');

    switch (data.qstType) {
        case 'MULTI' :  // 객관식
            createMulti(data).appendTo(form);

            break;
        case 'OPEN'  :  // 주관식
            createOpen(data).appendTo(form);

            break;
        case 'RANK'  :  // 순위형
            pollList.addClass('poll_a_list_num');
            createRank(data).appendTo(form);

            break;
        case 'MATRIX' : // 척도형
            //createMatrixQuestion(data).appendTo(form);
            break;
        default :
            console.log('undefined type : ' + data.qstType);
    }

    content.append(pollList.append(form));
}

function appendQuestionNavigation(content) {
    var navigation = $('<div>').addClass('poll_bottom_btn');
    $('<fieldset>').addClass('ui-grid-b')
        .append($('<div>').addClass('ui-block-a').addClass('prev').append($('<a href="#join">').append($('<button>').attr({
            'type': 'submit',
            'data-theme': 'b'
        }).text('이전페이지'))))
        .append($('<div>').addClass('ui-block-b').addClass('refresh').append($('<a>').append($('<button>').attr({
            'type': 'submit',
            'data-theme': 'b'
        }).text('새로고침'))))
        .append($('<div>').addClass('ui-block-b').addClass('next').append($('<a>').append($('<button>').attr({
            'type': 'submit',
            'data-theme': 'b'
        }).text('다음페이지'))))
        .appendTo(navigation);

    content.append(navigation);
}

function createMulti(question) {
    var id = createQuestionId(question);
    var option = question.qstOptionList;

    var fieldset = $('<fieldset>').attr('data-role', 'controlgroup').addClass('ui-body-d').addClass('ui-shadow').addClass('table-stripe').addClass('ui-responsive');

    for (var i = 0; i < question.itemList.length; i++) {
        var item = question.itemList[i];


        fieldset.append(createQuestionItem(id, item, option));
    }

    return fieldset;
}

function createQuestionItem(questionId, item, option) {

    switch (option.ASKTYPE.optionValue) {
        case 'RADIO' :  // 객관식
            return createRadioItem(questionId, item);

            break;
        case 'MULTISELECT' : // 객관식-다중응답
            return createCheckBoxItem(questionId, item);

            break;
            break;
        default :
            console.log('undefined item type : ' + option.ASKTYPE.optionValue);
    }
}

function createRadioItem(questionId, item) {
    var itemId = createItemId(questionId, item);

    console.log(questionId);
    console.log(item);
    console.log(joinSurvey.joinData);

    var input = $('<input>').attr({'type': 'radio', 'id': itemId, 'name': questionId}).val(item.itemSeq);
    input.data({item: item});
    input.append(createLabel(input, item.itemTitle));

    return input
}

function createItemId(questionId, item) {
    return questionId + '_' + item.itemSeq;
}

function createLabel(input, title) {
    return $('<label>').attr('for', input.attr('id')).html(title);
}

function createCheckBoxItem(questionId, item) {
    var itemId = createItemId(questionId, item);

    var input = $('<input>').attr({'type': 'checkbox', 'id': itemId, 'name': questionId}).val(item.itemSeq);
    input.data({item: item});
    input.append(createLabel(input, item.itemTitle));

    return input
}

function createOpen(question) {
    var questionId = createQuestionId(question);

    return createTextBoxItem(questionId, question.itemList[0]);
}

function createTextBoxItem(questionId, item) {
    var input = $('<input>').attr({'type': 'text', 'name': questionId});
    input.data({item: item});
    input.append(createLabel(input, item.itemTitle));

    return input
}

function createRank(question) {
    var id = createQuestionId(question);
    var option = question.qstOptionList;

    var fieldset = $('<fieldset>').attr('data-role', 'controlgroup').addClass('ui-body-d').addClass('ui-shadow').addClass('table-stripe').addClass('ui-responsive');

    for (var i = 0; i < question.itemList.length; i++) {
        var item = question.itemList[i];

        fieldset.append(createRankLabel())
        fieldset.append(createCheckBoxItem(id, item, option));
    }

    bindCheckBoxRank(fieldset);

    return fieldset;
}

function createRankLabel() {
    return $('<div>').addClass('poll_list_num').append($('<span>').addClass('poll_list_num_span').html('&nbsp;&nbsp;'));
}

function bindCheckBoxRank(fieldset) {
    fieldset.find(':checkbox').bind('click', function () {
        var checkCnt = fieldset.data('checkCnt');
        if (!checkCnt) checkCnt = 0;

        if (this.checked) {
            checkCnt++;
            $(this).data({index: checkCnt, 'timestamp': Date.now()});
        } else {
            checkCnt--;
            var removeIndex = $(this).data('index');

            $(':checkbox[name=' + this.name + ']:checked').each(function () {
                var index = $(this).data('index');
                if (index > removeIndex)
                    $(this).data('index', --index);
            });

            $(this).data({index: 0, 'timestamp': 0});
        }
        fieldset.data('checkCnt', checkCnt);

        refreshCheckBoxRank(fieldset);
    });
}

function refreshCheckBoxRank(fieldset) {
    fieldset.find(':checkbox').each(function () {
        var rankLabel = $(this).parent().prev().find('span');

        if (this.checked) {
            rankLabel.html($(this).data('index'));
        } else {
            rankLabel.html('&nbsp;&nbsp;');
        }
    });
}

function createMatrixQuestion(data) {
    var table = $('<table>').addClass('poll_table').attr('width', '100%').attr('cellpadding', '5').attr('cellspacing', '0').attr('border', '0');

    return page;
}

function bindNavigationEvent(page) {
    //console.log('bindNavigationEvent call');

    var pageId = createDivId(page);

    //console.log('pageId : ' + pageId);

    $(pageId).bind('change', function (event, ui) {
        $(this).attr('changed', 'true');
    });

    // test
    $(pageId).find('.refresh a').bind('click', {page: page}, function (event, ui) {
        console.log('refresh');
        //var data = $(pageId).data();
        //console.log(data.question);
    });

    // 다음페이지
    $(pageId).find('.next a').bind('click', {page: page}, function (event, ui) {
        event.preventDefault();

        //var data = $(pageId).data();
        //var question = data.question;
        //
        //console.log(data);

        //return false;

        var data = surveyUtil.getSurveyData()
            , grpSeq = surveyUtil.getGroupSeq()
            , qstKey = surveyUtil.getQuestionKey()
            , question = data.result.jsonSurveyData.grpList
            //, joinData = data.result.jsonSurveyData
            , qstInfo = question[grpSeq].qstList[qstKey]
            , qstSeq = qstInfo.qstSeq
            ;


        //grpSeq->그룹, gstSeq->문항

        if (joinSurvey.joinData.grpList[grpSeq] == undefined) {
            joinSurvey.joinData.grpList[grpSeq] = {'qstList': {}};
        }

        if (joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] == undefined) {
            alertLayer("답변을 선택하여 주시기 바랍니다.");
            $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
            return false;
        }
        else {

            if (qstInfo.qstType == 'MULTI') //객관식
            {

                if (qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택
                {
                    var askCnt = 0;
                    var linkCnt = 0;

                    for (var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList) {
                        itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;

                        if (qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED') {
                            if (joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '') {
                                alertLayer('답변을 입력하여 주시기 바랍니다.');
                                $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
                                return false;
                            }
                        }

                        if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK')//연결그룹체크
                        {
                            if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                            {
                                if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK') {//다음문항이동(다음다음)
                                    nextQstIndex = parseInt(nextQstIndex) + 1;
                                }

                            }
                            if (linkCnt == 0) //연결그룹 첫번째 일때
                            {
                                if (joinSurvey.joinData.historyBack != undefined)//jun->14.04.16
                                {
                                    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq + '|' + nextQstIndex;
                                    //alertLayer(qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue);
                                }
                            }
                            else {
                                if (joinSurvey.joinData.historyBack != undefined)//jun->14.04.16
                                {
                                    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = nextGrpSeq + '|' + nextQstIndex;
                                    //alertLayer(qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue);
                                }
                            }

                            nextQstIndex = 0;
                            nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;

                            linkCnt++;
                        }
                        else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END')//설문종료
                        {
                            nextQstIndex = 'END';
                        }
                        else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                        {
                            nextQstIndex = 'TEND';
                        }
                        else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND')//그룹종료
                        {
                            nextQstIndex = 'GRPEND';
                            nextGrpSeq = grpSeq;
                        }

                        askCnt++;
                    }

                    if (askCnt == 0) {
                        alertLayer('답변을 선택하여 주시기 바랍니다.');
                        $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
                        return false;
                    }

                    if (qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                    {
                        var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                        if (subOptionValTmp[0] > askCnt) {
                            alertLayer('값을 ' + subOptionValTmp[0] + '개 이상 선택하여 주시기 바랍니다.');
                            $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
                            return false;
                        }
                        else if (subOptionValTmp[1] < askCnt) {
                            alertLayer('값을 ' + subOptionValTmp[1] + '개 까지만 선택하여 주시기 바랍니다.');
                            $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
                            return false;
                        }
                    }
                }
                else //단일 선택
                {

                    for (var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList) {
                        itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;

                        if (qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED') {
                            if (joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '') {
                                alertLayer('답변을 입력하여 주시기 바랍니다.');
                                $('.question_' + grpSeq + '_' + qstSeq).find('input:first').focus();
                                return false;
                            }
                        }

                        if (qstInfo.qstOptionList['RANDITEM'].optionValue == 'CHECKED') {//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크

                            itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq - 1;

                            if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK') {

                                //종료 옵션이 없을 경우 처리
                                if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                                {
                                    if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK') {
                                        nextQstIndex = parseInt(nextQstIndex) + 1;
                                    }
                                }
                                //다음페이지 정보
                                if (joinSurvey.joinData.historyBack != undefined)//jun->14.04.16
                                {
                                    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq + '|' + nextQstIndex;
                                }

                                nextQstIndex = 0;
                                nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END') {
                                nextQstIndex = 'END';
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                            {
                                nextQstIndex = 'TEND';
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND') {
                                nextQstIndex = 'GRPEND';
                                nextGrpSeq = grpSeq;
                            }
                        }
                        else {

                            if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK') {

                                //종료 옵션이 없을 경우 처리
                                if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                                {
                                    if (joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK') {
                                        nextQstIndex = parseInt(nextQstIndex) + 1;
                                    }
                                }
                                //다음페이지 정보
                                if (joinSurvey.joinData.historyBack != undefined)//jun->14.04.16
                                {
                                    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq + '|' + nextQstIndex;
                                }

                                nextQstIndex = 0;
                                nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END') {
                                nextQstIndex = 'END';
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                            {
                                nextQstIndex = 'TEND';
                            }
                            else if (qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND') {
                                nextQstIndex = 'GRPEND';
                                nextGrpSeq = grpSeq;
                            }
                        }
                    }
                }
            }
        }


        //return false;
        var prevQuestion = pageId;
        var nextQuestion = createDivId(getNextQuestion());

        $(nextQuestion).find('.prev a').attr('href', prevQuestion);

        $(this).attr('href', nextQuestion);

        location.hash = nextQuestion;

        //$.mobile.changePage(this.href);
        //$('#poll_end').data('prev_question', pageId);
        //$.mobile.changePage('#poll_end');


        //if (validationPage(page, item)) {
        //    setPageNavigation(page, item);
        //
        //    if (item.createNextPage)
        //    createNextPage(page, item);
        //
        //    $.mobile.changePage(this.href);
        //}
    });
}

function getFirstQuestion(data) {
    //return '3558_14';

    var grpList = data.jsonSurveyData.grpList;
    for (var grpSeq in grpList) {
        var group = grpList[grpSeq];

        return grpSeq + '_' + group.qstList[0].orderNum;
    }
}

function getNextQuestion() {
    console.log('getNextQuestion');

    var survey_data = surveyUtil.getSurveyData()
        , data = survey_data.result
        , hash_question = location.hash.replace("#", "").split("_")
        , now_question = parseInt(hash_question[1])
        , nextQuestionId = ""
        ;

    // TODO 연결형일경우 다음으로 잘 넘어가져야함.
    try {
        var next_object = data.jsonSurveyData.grpList[hash_question[0]].qstList[now_question];


        if (typeof next_object == "undefined") {
            nextQuestionId = (parseInt(hash_question[0]) + 1) + '_1';

            var next_object2 = data.jsonSurveyData.grpList[(parseInt(hash_question[0]) + 1)];

            if (typeof next_object2 == "undefined") {
                nextQuestionId = "poll_end";
            }
        }
        else {
            nextQuestionId = hash_question[0] + '_' + (parseInt(now_question) + 1);
        }
    }
    catch (e) {
        nextQuestionId = "poll_end";
        console.log(e);
    }

    return nextQuestionId;
}

function makeSaveData(questionDivId) {
    console.log('makeSaveData');

    var question = $(questionDivId);
    var data = question.data('question');
    console.log(data);

    var askData = getQuestionAnswer(data);
    var questionData = {};
    questionData[data.qstSeq] = askData;

    var saveData = {};
    saveData[data.grpSeq] = questionData;

    var prevQuestion = question.find('.prev a').attr('href');
    if ('#join' != prevQuestion) {
        var prevSaveData = makeSaveData(prevQuestion);
        for (var key in prevSaveData)
            saveData[key] = prevSaveData[key];
    }

    return saveData;
}

function getQuestionAnswer(data) {
    switch (data.qstType) {
        case 'MULTI' :  // 객관식
            break;
        case 'OPEN'  :  // 주관식
            break;
        case 'RANK'  :  // 순위형
            return getRankAnswer(data);
            break;
        case 'MATRIX' : // 척도형
            break;
        default :
            console.log('undefined type : ' + data.qstType);
    }
}

function getRankAnswer(data) {
    console.log('getRankAnswer');

    var askList = {};
    $(createDivId(createQuestionId(data)) + ' :checkbox:checked').each(function () {
        var itemSeq = getItemSeq(this.id);

        var answer = {
            itemSeq: itemSeq,
            addResponse: '',
            subAddResponse: '',
            itemIndex: ''
        };


        askList[itemSeq] = answer;
    });


}

function getItemSeq(id) {
    var pos = id.lastIndexOf('_');
    return id.substring(pos + 1, pos + 2);
}