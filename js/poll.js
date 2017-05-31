

function createQuestion(data) {
    var id = createQuestionId(data);

    var page = createPage(id,data);
    page.data({question: data});
    page.append(createHeader());
    page.append(createContent(data));
    page.appendTo($('body'));

    bindNavigationEvent(id);
}

function createQuestionId(data) {
    return data.grpSeq + '_' + data.orderNum;
}

function createPage(questionId,data) {
    //console.log(data);
    var page = $('<div>').attr('id', questionId).attr('data-role', 'page').addClass("question_"+data.grpSeq+"_"+data.qstSeq).addClass('survey').addClass('wrap');
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

        if(joinSurvey.joinData.grpList[grpSeq] == undefined)
        {
            joinSurvey.joinData.grpList[grpSeq] = {'qstList':{}};
        }

        if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] == undefined)
        {
            alertLayer("답변을 선택하여 주시기 바랍니다.");
            $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
            return false;
        }
        else {

            if (qstInfo.qstType == 'MULTI') //객관식
            {

                if (qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택
                {
                    var askCnt = 0;
                    var linkCnt = 0;

                    for (var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
                    {
                        itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;

                        if (qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
                        {
                            if (joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
                            {
                                alertLayer('답변을 입력하여 주시기 바랍니다.');
                                $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
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
                        $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                        return false;
                    }

                    if (qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                    {
                        var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                        if (subOptionValTmp[0] > askCnt) {
                            alertLayer('값을 ' + subOptionValTmp[0] + '개 이상 선택하여 주시기 바랍니다.');
                            $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                            return false;
                        }
                        else if (subOptionValTmp[1] < askCnt) {
                            alertLayer('값을 ' + subOptionValTmp[1] + '개 까지만 선택하여 주시기 바랍니다.');
                            $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                            return false;
                        }
                    }
                }
                else //단일 선택
                {

                    for (var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
                    {
                        itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;

                        if (qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED') {
                            if (joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '') {
                                alertLayer('답변을 입력하여 주시기 바랍니다.');
                                $('.question_'+grpSeq+'_'+qstSeq).find('input:first').focus();
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
        , hash_question = location.hash.replace("#","").split("_")
        , now_question = parseInt(hash_question[1])
        , nextQuestionId = ""
        ;

    // TODO 연결형일경우 다음으로 잘 넘어가져야함.
    try{
        var next_object = data.jsonSurveyData.grpList[hash_question[0]].qstList[now_question];


        if(typeof next_object == "undefined") {
            nextQuestionId = (parseInt(hash_question[0])+1) + '_1';

            var next_object2 = data.jsonSurveyData.grpList[(parseInt(hash_question[0])+1)];

            if(typeof next_object2 == "undefined") {
                nextQuestionId = "poll_end";
            }
        }
        else {
            nextQuestionId = hash_question[0] + '_' + (parseInt(now_question) + 1);
        }
    }
    catch(e) {
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
    $(createDivId(createQuestionId(data)) + ' :checkbox:checked').each(function(){
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