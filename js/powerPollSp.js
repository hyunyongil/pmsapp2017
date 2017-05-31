/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapSp = {

    '01_01': {
        inputName: 'sp_yn',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '설문진행 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'master_school',
        nextPage: '01_03',
        validator: [
            {
                type: 'notnull',
                inputType: 'number',                    
                message: '석사학위를 수여받은 학교명을 입력해주세요.'
            }
        ],
        inputTypeText: true      
    },
    '01_03': {
        inputName: 'master_type',
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '석사계열을 선택해주세요.'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'master_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_04': {
        inputName: 'master_report_subject',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                inputType: 'number',                    
                message: '귀하의 석사학위 논문의 제목은 무엇입니까?(제목이 잘 기억이 안날 경우는 핵심 주제(Key word)만 적어 주십시오.'
            }
        ],
        inputTypeText: true     
    },             
    '01_05': {
        inputName: 'master_job_yn',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                message: '석사계열과 관련이 있는 업무를 하시는지를 선택해주세요.'
            }
        ]
    },
    '01_06': {
        inputName: 'sp_other_fgi_yn',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },        
    '01_07': {
        inputName: 'sp_fgi_yn',
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
        CONSTANTS.POWER_SP.INFO,
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

    if (data.sp_seq)
        this.modify = true;

    for (var key in powerPollMapSp) {
        var item = powerPollMapSp[key];

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
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName,etcValue, item.bitCalc,inputTypeText);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName, etcValue,bitCalc,inputTypeText) {
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
    
    labelToggle('01_03', 'master_type','master_etc', ['etc']);     
    
    for (var key in powerPollMapSp)
        bindEvent(key, powerPollMapSp[key]);

}



function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}


function savePowerPoll(){
    var body = makeSaveData(powerPollMapSp);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_SP.EDIT : CONSTANTS.POWER_SP.REGISTER,
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