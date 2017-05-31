/**
 * Created by somehow on 2015. 3. 27..
 */
function readyMyPage() {
    console.log('readyMyPage()');

    getActivity(getUser, fillActivity);
}

function getActivity(getUserFunc, callback) {

    getUserFunc(
    (function(userInfo) {
        ONPANEL.Ajax.Request.invokePostByJSON(
            CONSTANTS.MYPAGE.ACTIVITY,
            {},
            function (data, textStatus, jqXHR) {
                if (ONPANEL.Ajax.Result.isSucess(data))
                    callback(userInfo, ONPANEL.Ajax.Result.getData(data));
                else
                    callback(userInfo);
            },
            null,
            true
        );
    }));

}

function fillActivity(userInfo, data) {
    console.log('fillActivity()');

    console.log(userInfo);
    console.log(data);

    $('.name').text(userInfo.name);
    $('.point').text(data.point + 'P');
    $('.point_total').text(data.total_point + 'P');
    $('.point_use').text(data.use_point + 'P');

    if (data.first_update_date) {
        var firstPoll = $('.first_poll');

        firstPoll.find('.content').text(data.first_update_date);
    }

    $('.powerpannel tr').each(function () {
        var type = $(this).attr('powerpannel_type')

        console.log(this.id + ' : ' + type);
        
        if(userInfo.powerpannel_type & type) {
            if(userInfo.powerpannel_type_real & type) {
                $(this).find('.content').text(data[this.id + '_update_date']);
            } else {
                $(this).find('.content').text('참여 가능');
            }
        } else {
            $(this).find('.content').text('참여 불가능');
        }
    });

}

function readyUserInfo() {
    getBanks(fillBankInput);
    getUser(fillUserInfo);

    $('#member_save').bind('click', function (event, ui) {
        event.preventDefault();

        saveUserInfo(makeSaveData());
    });
}

function getBanks(callback) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.MEMBER.BANKLIST,
        {},
        function (data, textStatus, jqXHR) {
            if (ONPANEL.Ajax.Result.isSucess(data))
                callback(ONPANEL.Ajax.Result.getData(data));
            else
                callback();
        },
        null,
        true
    );
}

function fillBankInput(data) {
    var bankNameInput = $('#bank_name');

    for (var key in data)
        bankNameInput.append($('<option>').val(key).text(data[key]));

    bankNameInput.selectmenu('refresh');
}

function fillUserInfo(data) {

    console.log(data);

    setInputValue('member_id', data.member_id);
    setInputValue('email_addr', data.email_addr);
    setInputValue('email_domain', data.email_domain);
    setInputValue('bank_name', data.bank_name);
    setInputValue('bank_account', data.bank_account);

}

function saveUserInfo(body) {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.MEMBER.EDIT,
        body,
        function (data, textStatus, jqXHR) {
            console.log(data);
        },
        null,
        true
    );
}

function makeSaveData() {
    var data = {
        email_addr: getInputValue('email_addr'),
        email_domain: getInputValue('email_domain'),
        hp1: '010',
        hp2: '4800',
        hp3: '6543',
        bank_name: getInputValue('bank_name'),
        bank_account: getInputValue('bank_account'),
        mpass: signJWT({member_pw: getInputValue('member_pw')}),
    };

    return data;
}