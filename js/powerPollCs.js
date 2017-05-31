/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapCs = {

    '01_01': {
        inputName: 'cs_yn',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '공공기관에 소속되어 근무중인지 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'cs_continue_yn',
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
        inputName: 'cs_organization',
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '소속된 기관이 어디인지 선택해주세요.'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'cs_organ_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                 
                message: '기타를 입력해 주세요.'
            }
        ]
    },       
    '01_04': {
        inputName: 'cs_organization_name',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '소속된 국가기관이나 지방자치단체의 이름을 입력해주세요.'
            }
        ],
        inputTypeText: true    
    },             
    '01_05': {
        inputName: 'cs_level',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                message: '직급을 선택해주세요.'
            }
        ]
    },
    '01_06': {
        inputName: 'cs_year',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '근무년수를 선택해주세요.'
            }
        ]
    },
    '01_07': {
        inputName: 'cs_other_fgi_yn',
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },        
    '01_08': {
        inputName: 'cs_fgi_yn',
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
        CONSTANTS.POWER_CS.INFO,
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

    if (data.cs_seq)
        this.modify = true;

    for (var key in powerPollMapCs) {
        var item = powerPollMapCs[key];

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
                var inputTypeText = '';
                if(item.inputTypeText)
                    inputTypeText = item.inputTypeText;                
                if ((inputValue && inputValue != 0) && skipData.indexOf(inputName) == -1) {
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName, etcValue,item.bitCalc,inputTypeText);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName,etcValue,  bitCalc,inputTypeText) {
    if(bitCalc)
    {
        setInputValueAll(inputName, inputValue);
    }else{

        if(key=='01_01')
        {
            setInputValueFirst(inputName, inputValue);
        }else{
            
console.log(inputTypeText);
            if (inputTypeText)
            {
                setInputTextInit(inputName, inputValue);
                
            }else{
                setInputValue(inputName, inputValue);
                
            }
        }
    }

    if (checkRule(etcRule, getInputValue(inputName)))
    {
        setInputTextInit(etcInputName, etcValue);
        
    }
}


function bindEvents() {
    
    labelToggle('01_03', 'cs_organization','cs_organ_etc', ['etc']);         
    
    for (var key in powerPollMapCs)
        bindEvent(key, powerPollMapCs[key]);

}

function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}


function savePowerPoll(){
    var body = makeSaveData(powerPollMapCs);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_CS.EDIT : CONSTANTS.POWER_CS.REGISTER,
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
