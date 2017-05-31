/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapSm = {

    '01_01': {
        inputName: 'sm_use_type',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['NOTHING'],
        validator: [
            {
                type: 'notnull',
                message: '스마트폰 보유 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'sm_yn',
        nextPage: '01_03',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '설문진행 여부를 선택해주세요.'
            }
        ]
    },
    '01_03': {
        inputName: 'sm_release_date',
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '제품구입시기를 선택해주세요.'
            }
        ]
    },      
    '01_04': {
        inputName: 'sm_use_date',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                message: '제품사용기간을 선택해주세요.'
            }
        ]
    },  
    '01_05': {
        inputName: 'sm_as_yn',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                message: 'A/S서비스방문여부를 선택해주세요.'
            }
        ]
    },    
    '01_06': {
        inputName: 'sm_datafree_yn',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '데이터무제한요금제 이용여부를 선택해주세요.'
            }
        ]
    },  
    '01_07': {
        inputName: 'sm_price',
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                message: '한달사용료를 선택해주세요.'
            }
        ]
    },   
    '01_08': {
        inputName: 'sm_use_app',
        bitCalc: true,           
        nextPage: '01_09',
        validator: [
            {
                type: 'notnull',
                message: '어플리케이션을 모두 선택하여 주십시오.'
            }
        ]
    },     
    '01_09': {
        inputName: 'sm_app_cnt',
        nextPage: '01_10',
        validator: [
            {
                type: 'notnull',
                message: '어플리케이션의 보유수를 선택해주세요.'
            }
        ]
    },                               
    '01_10': {
        inputName: 'sm_app_money',
        nextPage: '01_11',
        validator: [
            {
                type: 'notnull',
                message: '유료 어플리케이션을 구매하는 비용을 선택해주세요.'
            }
        ]
    },
    '01_11': {
        inputName: 'sm_other_fgi_yn',
        nextPage: '01_12',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },
    '01_12': {
        inputName: 'sm_fgi_yn',
        nextPage: 'power-complete',
        validator: [
            {
                type: 'notnull',
                message: 'FGI,심층인터뷰 참가여부를 선택해주세요'
            }
        ]
    }
};

function readyPowerPoll() {
    getPowerPoll(fillPowerPoll);

    bindEvents();
}

function getPowerPoll(callback) {

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.POWER_SM.INFO,
        {},
        function (data, textStatus, jqXHR) {
            if (ONPANEL.Ajax.Result.isSucess(data))
                callback(ONPANEL.Ajax.Result.getData(data));
            //else
                //getPowerPollFromUser(callback);
        },
        null,
        true
    );
}
function fillPowerPoll(data) {
    var skipData = [];

    console.log(data);

    if (data.sm_seq)
        this.modify = true;

    for (var key in powerPollMapSm) {
        var item = powerPollMapSm[key];

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

                        setPollValue(inputName + '_' + (j + 1), inputValue, item.etcRule, item.etcInputName)
                    }
                }
            } else {
                var inputValue = data[inputName];
                var etcValue = data[item.etcInputName];
                var bypass = false;
                if(inputName == 'sm_app_money'){
                    bypass = true;
                }
                if (((inputValue && inputValue != 0) && skipData.indexOf(inputName) == -1)  || bypass) {
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName,etcValue, item.bitCalc);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName,etcValue, bitCalc) {
    if(bitCalc)
    {
        setInputValueAll(inputName, inputValue);
    }else{

        if(key=='01_01')
        {
            setInputValueFirst(inputName, inputValue);
        }else{
            
            setInputValue(inputName, inputValue);
        }
    }

    if (checkRule(etcRule, getInputValue(inputName)))
    {
        setInputTextInit(etcInputName, etcValue);
        
    }

}

function bindEvents() {
    for (var key in powerPollMapSm)
        bindEvent(key, powerPollMapSm[key]);

  
}

function savePowerPoll(){
    var body = makeSaveData(powerPollMapSm);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_SM.EDIT : CONSTANTS.POWER_SM.REGISTER,
        body,
        function (data, textStatus, jqXHR) {
            if (ONPANEL.Ajax.Result.isSucess(data))
                $.mobile.changePage('#power-complete');
            else
                alertLayer(ONPANEL.Ajax.Request.getMessage(data));
        },
        null,
        true
    );    
}


function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}

