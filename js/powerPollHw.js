/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapHw = {

    '01_01': {
        inputName: 'hw_yn',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '개인적인 질문에 응답하실지 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'hw_job_yn',
        nextPage: '01_03',
        validator: [
            {
                type: 'notnull',
                message: '직장생활 여부를 선택해주세요.'
            }
        ]
    },
    '01_03': {
        inputName: 'hw_marrige',
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '배우자와의결혼상태를 선택해주세요.'
            }
        ],
        etcRule: ['ETC'],
        etcInputName: 'hw_marrige_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                      
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_04': {
        inputName: 'hw_marrige_year',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                message: '결혼한년수 선택해주세요.'
            }
        ]
    },             
    '01_05': {
        inputName: 'hw_family_count',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                inputType: 'number',                
                message: '가족인원수를 입력해주세요.'
            }
        ],
        inputTypeText: true      
    },
    '01_06': {
        inputName: 'hw_family_type',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '가족형태를 입력해주세요.'
            }
        ],
        etcRule: ['ETC'],
        etcInputName: 'hw_family_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                    
                message: '기타를 입력해 주세요.'
            }
        ]
    },    
    '01_07': {
      
        inputName: 'hw_children_count',   
        bitCalc: true,             
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                message: '자녀연령(수)를 선택해주세요.'
            }
        ]
        ,                         
        etcException: 
            {
                'hw_children_count': [
                    {
                        exceptionRule: ['4','8','16','32','64'],
                        exceptionInputName: ['hw_children_pre','hw_children_elementary','hw_children_middle','hw_children_hight','hw_children_adult'],                        
                        exceptionValidator:
                            [
                                    {
                                        type: 'notnull',
                                        message: '자녀연령(수)를 선택해주세요.'
                                    }
                            ]        

                    }
                ]
            }  
                   
    },    
    '01_08': {
        inputName: 'hw_shopping_info',
        nextPage: '01_09',
        validator: [
            {
                type: 'notnull',
                message: '물품구매정보를 선택해주세요.'
            }
        ],
        etcRule: ['ETC'],
        etcInputName: 'hw_shopping_info_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                    
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_09': {
        inputName: 'hw_shopping_place',
        nextPage: '01_10',
        validator: [
            {
                type: 'notnull',
                message: '물품구입장소를 선택해주세요.'
            }
        ],
        etcRule: ['ETC'],
        etcInputName: 'hw_shopping_place_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                    
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_10': {
        
        multiInput: true,
        inputName: ['hw_payment_money','hw_payment_card', 'hw_payment_checkcard', 'hw_payment_etc'],
        nextPage: '01_11',
        validator: {
            'hw_payment_money': [
                {
                    type: 'notnull',
                    inputType: 'number',                            
                    message: '숫자를 입력해주세요.'
                }
            ],            
            'hw_payment_card': [
                {
                    type: 'notnull',
                    inputType: 'number',                            
                    message: '숫자를 입력해주세요.'
                }
            ],
            'hw_payment_checkcard': [
                {
                    type: 'notnull',
                    inputType: 'number',                      
                    message: '숫자를 입력해주세요.'
                }
            ],
            'hw_payment_etc': [
                {
                    type: 'notnull',
                    inputType: 'number',                      
                    message: '숫자를 입력해주세요.'
                }
            ]
        },   
        percentRule: 100,
        percentName: ['hw_payment_money','hw_payment_card', 'hw_payment_checkcard', 'hw_payment_etc'],
        percentValidator: [
            {
                type: '100',
                message: '결제 수단 비율이  100%가 아닙니다.'
            }
        ],
        inputTypeText: true            
    },    
    '01_11': {
        inputName: 'hw_other_fgi_yn',
        nextPage: '01_12',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },
    '01_12': {
        inputName: 'hw_fgi_yn',
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
        CONSTANTS.POWER_HW.INFO,
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
    var sumData = 0;
    console.log(data);

    if (data.hw_seq)
        this.modify = true;

    for (var key in powerPollMapHw) {
        var item = powerPollMapHw[key];

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
                
                
console.log('1');
console.log(inputName);
                if(typeof item.etcException != 'undefined')
                {   
console.log('2');     
console.log(item.etcException);
console.log(item.etcException[inputName][0].exceptionRule);


                        
                    for (var k = 0; k < item.etcException[inputName][0].exceptionRule.length; k++) {
            

                        var excName = item.etcException[inputName][0].exceptionInputName[k];  
console.log(excName);
console.log(data[excName]);
                        setPollValue(key,excName, data[excName], item.etcRule, item.etcInputName, etcValue, item.bitCalc,inputTypeText , item.etcException[inputName][0].exceptionRule);
            
                        if(key=='01_10')
                        {
                            sumData = sumData +  parserInt(data[excName]); 
                        } 
 
                    }
                            
                    if(key=='01_10')
                    {
                	   $('#hw_payment_sum').html(sumData);
                    }
                }                
                
                
            }
        }
        

    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName, etcValue, bitCalc,inputTypeText , exceptionRule) {
    if(bitCalc)
    {
        setInputValueAll(inputName, inputValue);
        
        if(exceptionRule){
            setInputTextInit(inputName, inputValue);
        }        
        
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

    changeCheckBox();
    changePayment();
    

    
    for (var key in powerPollMapHw)
        bindEvent(key, powerPollMapHw[key]);

}


function changeCheckBox() {


    checkBoxExToogle('01_07', 'hw_children_count','2', ['2']);
    
    labelToggle('01_03', 'hw_marrige','hw_marrige_etc', ['ETC']);  
    labelToggle('01_06', 'hw_family_type','hw_family_etc', ['ETC']); 
    labelToggle('01_08', 'hw_shopping_info','hw_shopping_info_etc', ['ETC']); 
    labelToggle('01_09', 'hw_shopping_place','hw_shopping_place_etc', ['ETC']);               

    labelToggleCheckbox2('01_07', 'hw_children_count','hw_children_pre', ['4']);
    labelToggleCheckbox2('01_07', 'hw_children_count','hw_children_elementary', ['8']);
    labelToggleCheckbox2('01_07', 'hw_children_count','hw_children_middle', ['16']);
    labelToggleCheckbox2('01_07', 'hw_children_count','hw_children_hight', ['32']);
    labelToggleCheckbox2('01_07', 'hw_children_count','hw_children_adult', ['64']);                

}

function changePayment() {

    var count = 4;
    var page = '01_10';

    $(createDivId(page)+' .poll_a_list').click(function () {
        
        var hw_payment_sum=0;   
        for (var i = 1; i < count+1; i++) {
         
            var hw_paymentValue=$('#hw_payment_' + i).val();
            $('#hw_payment_' + i).removeText();
            
            if(hw_paymentValue=='')
            {
                hw_paymentValue=0;
            }else{
                hw_paymentValue=parseInt(hw_paymentValue);
            }

            hw_payment_sum = hw_payment_sum + hw_paymentValue;
            console.log(hw_payment_sum);            
        }
        
    	$('#hw_payment_sum').html(hw_payment_sum);
      
    });


    $('#01_05 .poll_a_list').bind('keyup', function (event, ui) {
        $('#hw_family_count').removeText();
    });

}



function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}




function savePowerPoll(){
    var body = makeSaveData(powerPollMapHw);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_HW.EDIT : CONSTANTS.POWER_HW.REGISTER,
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
