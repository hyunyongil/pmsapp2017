function readyFirstPoll() {
    getFirstPoll(fillFirstPoll);

    bindEvents();
}

function getFirstPoll(callback) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.FIRST_SURVEY.INFO,
        {token: COMMON.token.get()},
        function (data, textStatus, jqXHR) {
            console.log(data);

            if (ONPANEL.Ajax.Result.isSucess(data))
                callback(ONPANEL.Ajax.Result.getData(data));
            else {
                getFirstPollFromUser(callback);
            }
        },
        null,
        true
    );
}

function fillFirstPoll(data) {

    var skipData = [];
    //var skipData = ['gender', 'birthday'];

    console.log('data:'+data);

    if (data.first_data && data.first_data.first_seq)
        this.modify = true;

    for (var key in FIRST_POLL_DATA) {
        var item = FIRST_POLL_DATA[key];

        var inputNames = item.inputName;
        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);
        }

        for (var i = 0; i < inputNames.length; i++) {
            var inputName = inputNames[i];

            if (item.arrayInput) {
                if (data[item.arrayDataName]) {
                    for (var j = 0; j < data[item.arrayDataName].length; j++) {
                        var arrayItem = data[item.arrayDataName][j];
                        var inputValue = arrayItem[inputName];

                        setPollValue(data,inputName + '_' + (j + 1), inputValue, item.etcRule, item.etcInputName)
                    }
                }
            } else {
                if (skipData.indexOf(inputName) > -1)
                    continue;

                var inputValue = data.first_data[inputName];

                if (inputValue) {
                    setPollValue(data,inputName, inputValue, item.etcRule, item.etcInputName, item.bitCalc);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }

    //$('#gender').val(data.first_data.gender).next().text(getGenderText(data.first_data.gender));
    //$('#birthday').val(data.first_data.birthday).next().text(data.first_data.birthday);

    initPage();
}

function setPollValue(data,inputName, inputValue, etcRule, etcInputName, bitCalc) {


    if (bitCalc) {
        setInputValueAll(inputName, inputValue);
    }
    else {
        setInputValue(inputName, inputValue);
    }

    if (checkRule(etcRule, getInputValue(inputName)))
        setInputValue(etcInputName, data.first_data[etcInputName]);
}

function getFirstPollFromUser(callback) {
    getUser(function (data) {
        callback(convertUserToFirstPoll(data));
    });
}

function convertUserToFirstPoll(data) {
    var firstPoll = {
        first_data: {
            member_id: data.member_id
            //gender: (data.sex) ? 'M' : 'F',
            //birthday: data.primary_num
        }
    };

    return firstPoll;
}

function bindEvents() {
    for (var key in FIRST_POLL_DATA) {
        bindEvent(key, FIRST_POLL_DATA[key]);
         console.log(FIRST_POLL_DATA[key]);
    }

    checkBoxToogle('first15', 'financial', ['2048']);
    checkBoxToogle('first19', 'sns_site', ['2']);
 

}

function createChildren(pageDiv, count) {
    var ul = pageDiv.find('.poll_b_list ul');
    ul.find('li:gt(0)').remove();

    for (var i = 0; i < count; i++) {
        var yearSelectBox = createYearSelectBox('children_cnt_detail_year_' + (i + 1), '출생년도');
        var genderSelectBox = createGenderSelectBox('children_cnt_detail_gender_' + (i + 1), '성별');
        var schoolSelectBox = createSchoolSelectBox('children_cnt_detail_school_' + (i + 1), '교급');

        var li = ul.find('li:first').clone();
        li.find('.ui-block-a').text('자녀' + (i + 1));
        li.find('.ui-block-b').append(yearSelectBox);
        li.find('.ui-block-c').append(genderSelectBox);
        li.find('.ui-block-d').append(schoolSelectBox);

        li.show().appendTo(ul);

        ul.find('select').selectmenu().selectmenu('refresh', true);
    }
}

function createCellPhone(pageDiv, count) {
    var ul = pageDiv.find('.poll_b_list ul');
    ul.find('li:gt(0)').remove();

    for (var i = 0; i < count; i++) {
        var phoneMakerSelectBox = createPhoneMakerSelectBox('smartphone_detail_maker_' + (i + 1), '제조사');
        var phoneTypeSelectBox = createPhoneTypeBox('smartphone_detail_type_' + (i + 1), '목록');
        var phoneAppSelectBox = createPhoneAppSelectBox('smartphone_detail_app_' + (i + 1), '유료앱 이용여부');

        var li = ul.find('li:first').clone();
        li.find('.phone-title').text('휴대폰' + (i + 1));
        li.find('.phone-maker').append(phoneMakerSelectBox);
        li.find('.phone-type').append(phoneTypeSelectBox);
        li.find('.phone-app').append(phoneAppSelectBox);

        li.show().appendTo(ul);
        ul.find('select').selectmenu().selectmenu('refresh', true);
    }
}

function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');


    var yearSelectBox = createYearLongSelectBox('birthday', '출생연도');

    $("#birthday_wrap").append(yearSelectBox);

    $("#birthday_wrap").find('select').selectmenu().selectmenu('refresh', true);
}

function saveFirstPoll() {
    var body = makeSaveData(FIRST_POLL_DATA);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.FIRST_SURVEY.EDIT : CONSTANTS.FIRST_SURVEY.REGISTER,
        body,
        function (data, textStatus, jqXHR) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                $.mobile.changePage('#first-complete');
            }
            else {
                alertLayer(ONPANEL.Ajax.Request.getMessage(data));
            }
        },
        null,
        true
    );
}
