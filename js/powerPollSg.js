/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapSg = {

    '01_01': {
        inputName: 'sg_yn',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '독신가구 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'sg_continue_yn',
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
        inputName: 'sg_year',
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '혼자 거주하신지 년수를 선택해주세요.'
            }
        ]
    },  
    '01_04': {
        inputName: 'sg_product',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                message: '독신용(1인가구패널)으로 나온 제품을 사용하고 있는지 여부를 선택해주세요.'
            }
        ]
    },      
    '01_05': {
        inputName: 'sg_other_fgi_yn',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },
    '01_06': {
        inputName: 'sg_fgi_yn',
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
        CONSTANTS.POWER_SG.INFO,
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

    if (data.sg_seq)
        this.modify = true;

    for (var key in powerPollMapSg) {
        var item = powerPollMapSg[key];

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
                if ((inputValue && inputValue != 0) && skipData.indexOf(inputName) == -1) {
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName,etcValue, item.bitCalc);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName,etcValue,  bitCalc) {
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
    for (var key in powerPollMapSg)
        bindEvent(key, powerPollMapSg[key]);


}




function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}


function savePowerPoll(){
    var body = makeSaveData(powerPollMapSg);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_SG.EDIT : CONSTANTS.POWER_SG.REGISTER,
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
