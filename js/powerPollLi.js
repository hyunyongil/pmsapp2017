/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapLi = {

    '01_01': {
        inputName: 'lf_internet_purpose',
        bitCalc: true,                 
        nextPage: '01_02',
        validator: [
            {
                type: 'notnull',
                message: '컴퓨터/인터넷을 어떤 목적으로 이용하시는지를 선택해주세요.'
            }
        ],
        etcRule: ['256'],
        etcInputName: 'lf_internet_purpose_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'lf_browser_type',
        bitCalc: true,                 
        nextPage: '01_03',
        validator: [
            {
                type: 'notnull',
                message: '주로 이용하는 웹 브라우저를 선택해주세요.'
            }
        ],
        etcRule: ['64'],
        etcInputName: 'lf_browser_type_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_03': {
        inputName: 'lf_game_type',
        bitCalc: true,                 
        nextPage: '01_04',
        validator: [
            {
                type: 'notnull',
                message: '선호하시는 게임 종류를 선택해주세요.'
            }
        ],
        etcRule: ['512'],
        etcInputName: 'lf_game_type_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },    
    '01_04': {
        inputName: 'lf_health_yn',
        nextPage: '01_05',
        skipPage: '01_06',
        skipRule: ['N'],           
        validator: [
            {
                type: 'notnull',
                message: '건강을 위해 규칙적으로 운동을 하시는지 여부를 선택해주세요.'
            }
        ]
    },
    '01_05': {
        inputName: 'lf_health_type',
        nextPage: '01_06',        
        validator: [
            {
                type: 'notnull',
                message: '어떤종류의 운동을 하시는지를 선택해주세요.'
            }
        ]
    },             
    '01_06': {
        inputName: 'lf_smoking',
        nextPage: '01_07',
        skipPage: '01_08',
        skipRule: ['ing','no'],         
        validator: [
            {
                type: 'notnull',
                message: '흡연여부를 선택해주세요.'
            }
        ]
    },
    '01_07': {
        inputName: 'lf_nosmoking_month',
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '금연하신지 몇 개월 되셨는지를 입력해주세요.'
            }
        ],
        inputTypeText: true   
    },    
    '01_08': {
        inputName: 'lf_drinking',
        nextPage: '01_09',
        skipPage: '01_10',
        skipRule: ['N'],           
        validator: [
            {
                type: 'notnull',
                message: '음주여부를 선택해주세요.'
            }
        ]
    },       
    '01_09': {
        
        inputName: 'lf_drinking_type',
        bitCalc: true,                 
        nextPage: '01_10',
        validator: [
            {
                type: 'notnull',
                message: '선호하는 술의 종류를 선택해주세요.'
            }
        ],
        etcRule: ['1024'],
        etcInputName: 'lf_drinking_type_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]     
    },    
    '01_10': {
        inputName: 'lf_lecent_travel',
        nextPage: '01_11',
        skipPage: '01_12',
        skipRule: ['N'],          
        validator: [
            {
                type: 'notnull',
                message: '최근 3년 이내에 해외 여행 경험여부를 선택해주세요.'
            }
        ]
    },  
    '01_11': {
        inputName: 'lf_travel_country',
        nextPage: '01_12',
        validator: [
            {
                type: 'notnull',
                message: '최근 3년 이내에 해외여행 중 방문 했던 나라를 선택해주세요.'
            }
        ]
    },          
    '01_12': {
        inputName: 'lf_leisure_type',
        bitCalc: true,                 
        nextPage: '01_13',
        validator: [
            {
                type: 'notnull',
                message: '선호하시는 레저를 선택해주세요.'
            }
        ],
        etcRule: ['32768'],
        etcInputName: 'lf_leisure_type_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_13': {
        inputName: 'lf_sport_view',
        bitCalc: true,                 
        nextPage: '01_14',
        validator: [
            {
                type: 'notnull',
                message: '평소 즐겨보는 스포츠(직접관람, TV관람 등)를 선택해주세요.'
            }
        ],
        etcRule: ['32768'],
        etcInputName: 'lf_sport_view_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_14': {
        
        inputName: 'lf_sport_play',
        bitCalc: true,                 
        nextPage: '01_15',
        validator: [
            {
                type: 'notnull',
                message: '직접 참여하시는 스포츠 활동을 선택해주세요.'
            }
        ],
        etcRule: ['16384'],
        etcInputName: 'lf_sport_play_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]  
    },    
    '01_15': {
        inputName: 'lf_like_concert',
        bitCalc: true,                 
        nextPage: '01_16',
        validator: [
            {
                type: 'notnull',
                message: '선호하시는 공연의 종류를 선택해주세요.'
            }
        ],
        etcRule: ['512'],
        etcInputName: 'lf_like_concert_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_16': {
        inputName: 'lf_like_movie',
        bitCalc: true,                 
        nextPage: '01_17',
        validator: [
            {
                type: 'notnull',
                message: '선호하시는 영화 장르를 선택해주세요.'
            }
        ],
        etcRule: ['16777216'],
        etcInputName: 'lf_like_movie_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_17': {
        inputName: 'lf_life_music',
        bitCalc: true,                 
        nextPage: '01_18',
        validator: [
            {
                type: 'notnull',
                message: '선호 하시는 음악 장르를 선택해주세요.'
            }
        ],
        etcRule: ['524288'],
        etcInputName: 'lf_life_music_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_18': {
        inputName: 'lf_instrument',
        bitCalc: true,                 
        nextPage: '01_19',
        validator: [
            {
                type: 'notnull',
                message: '다룰 줄 아는 악기를 선택해주세요.'
            }
        ],
        etcRule: ['1048576'],
        etcInputName: 'lf_instrument_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },  
    '01_19': {
        inputName: 'lf_like_accessories',
        bitCalc: true,                 
        nextPage: '01_20',
        validator: [
            {
                type: 'notnull',
                message: '관심 있는 패션 악세서리를 선택해주세요'
            }
        ],
        etcRule: ['2048'],
        etcInputName: 'lf_like_accessories_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },      
    '01_20': {
        inputName: 'lf_masterpiece',
        nextPage: '01_21',
        skipPage: '01_22',
        skipRule: ['N'],         
        validator: [
            {
                type: 'notnull',
                message: '명품 패선브랜드 물품을 한 번이라도 구입하신지 여부를 선택해주세요.'
            }
        ]
    },      
    '01_21': {
        inputName: 'lf_like_brand',
        bitCalc: true,                 
        nextPage: '01_22',
        validator: [
            {
                type: 'notnull',
                message: '선호하시는 명품 패션브랜드를 선택해주세요.'
            }
        ],
        etcRule: ['2097152'],
        etcInputName: 'lf_like_brand_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },     
    '01_22': {
        inputName: 'lf_cosmetic_surgery_yn',
        nextPage: '01_23',
        skipPage: '01_24',
        skipRule: ['N'],         
        validator: [
            {
                type: 'notnull',
                message: '미용을 위한 성형 경험 여부를 선택해주세요.'
            }
        ]
    },      
    '01_23': {
        inputName: 'lf_cosmetic_surgery',
        bitCalc: true,                 
        nextPage: '01_24',
        validator: [
            {
                type: 'notnull',
                message: '성형 경험이 있으신 부위를 선택해주세요.'
            }
        ],
        etcRule: ['1024'],
        etcInputName: 'lf_cosmetic_surgery_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },     
    '01_24': {
        inputName: 'lf_diet_yn',
        nextPage: '01_25',
        skipPage: '01_26',
        skipRule: ['N'],         
        validator: [
            {
                type: 'notnull',
                message: '다이어트 경험 여부를 선택해주세요.'
            }
        ]
    },      
    '01_25': {
        inputName: 'lf_diet_try',
        bitCalc: true,                 
        nextPage: '01_26',
        validator: [
            {
                type: 'notnull',
                message: '시도하신 다이어트 방법을 선택해주세요'
            }
        ],
        etcRule: ['32'],
        etcInputName: 'lf_diet_try_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_26': {
        inputName: 'lf_beauty_service',
        bitCalc: true,                 
        nextPage: '01_27',
        validator: [
            {
                type: 'notnull',
                message: '이용 경험이 있는 미용 관련 서비스를 선택해주세요.'
            }
        ],
        etcRule: ['1024'],
        etcInputName: 'lf_beauty_service_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },                         
    '01_27': {
        inputName: 'lf_use_cosmetic',
        bitCalc: true,                 
        nextPage: 'power-complete',
        validator: [
            {
                type: 'notnull',
                message: '사용하는 화장품을 선택해주세요.'
            }
        ],
        etcRule: ['2048'],
        etcInputName: 'lf_use_cosmetic_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    }
};
///////////////////////////////////////////////////////


function readyPowerPoll() {
    getPowerPoll(fillPowerPoll);

    bindEvents();
}

function getPowerPoll(callback) {

    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.POWER_LI.INFO,
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

    //console.log(data);

    if (data.lf_seq)
        this.modify = true;

    for (var key in powerPollMapLi) {
        var item = powerPollMapLi[key];

        var inputNames = item.inputName;
        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);
        }
    //console.log(inputNames);
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
                        
                    //if (item.createPage)
                    //    item.createPage(item.etcException);
                                                                      
                }
            }
        }
    }



    //initPage();
}
function setPollValue(key,inputName, inputValue, etcRule, etcInputName,etcValue,  bitCalc,inputTypeText) {
    if(bitCalc)
    {
        if(key=='01_01')
        {
            setInputValueAllFirst(inputName, inputValue);
        }else{
            
            setInputValueAll(inputName, inputValue);

        }
        
        if(etcValue=='0')
            etcValue='';
        setInputTextInit(etcInputName, etcValue);    
        
    }else{

            if (inputTypeText)
            {
                setInputTextInit(inputName, inputValue);
                
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
    changeCheckBox();
   
    for (var key in powerPollMapLi)
        bindEvent(key, powerPollMapLi[key]);
 
}

function changeCheckBox() {


    checkBoxExToogle('01_01', 'lf_internet_purpose','512', ['512']);
    checkBoxExToogle('01_02', 'lf_browser_type','128', ['128']);
    checkBoxExToogle('01_03', 'lf_game_type','1024', ['1024']);

    checkBoxExToogle('01_12', 'lf_leisure_type','65536', ['65536']);
    checkBoxExToogle('01_13', 'lf_sport_view','65536', ['65536']);
    checkBoxExToogle('01_14', 'lf_sport_play','32768', ['32768']);
    checkBoxExToogle('01_15', 'lf_like_concert','1024', ['1024']);
    checkBoxExToogle('01_16', 'lf_like_movie','33554432', ['33554432']);                          
    checkBoxExToogle('01_17', 'lf_life_music','1048576', ['1048576']);       
    checkBoxExToogle('01_18', 'lf_instrument','2097152', ['2097152']);       
    checkBoxExToogle('01_19', 'lf_like_accessories','4096', ['4096']);
    // checkBoxExToogle('01_25', 'lf_diet_try','2', ['2']);
    checkBoxExToogle('01_26', 'lf_beauty_service','2', ['2']);
    checkBoxExToogle('01_27', 'lf_use_cosmetic','2', ['2']);


    labelToggleCheckbox('01_01', 'lf_internet_purpose','lf_internet_purpose_memo', ['256']);
    labelToggleCheckbox('01_02', 'lf_browser_type','lf_browser_type_memo', ['64']);
    labelToggleCheckbox('01_03', 'lf_game_type','lf_game_type_memo', ['512']);
    labelToggleCheckbox('01_09', 'lf_drinking_type','lf_drinking_type_memo', ['1024']);
    labelToggleCheckbox('01_12', 'lf_leisure_type','lf_leisure_type_memo', ['32768']);
    labelToggleCheckbox('01_13', 'lf_sport_view','lf_sport_view_memo', ['32768']);
    labelToggleCheckbox('01_14', 'lf_sport_play','lf_sport_play_memo', ['16384']);
    labelToggleCheckbox('01_15', 'lf_like_concert','lf_like_concert_memo', ['512']);
    labelToggleCheckbox('01_16', 'lf_like_movie','lf_like_movie_memo', ['16777216']);                          
    labelToggleCheckbox('01_17', 'lf_life_music','lf_life_music_memo', ['524288']);       
    labelToggleCheckbox('01_18', 'lf_instrument','lf_instrument_memo', ['1048576']);       
    labelToggleCheckbox('01_19', 'lf_like_accessories','lf_like_accessories_memo', ['2048']);    
    labelToggleCheckbox('01_21', 'lf_like_brand','lf_like_brand_memo', ['2097152']);      
    labelToggleCheckbox('01_23', 'lf_cosmetic_surgery','lf_cosmetic_surgery_memo', ['1024']);   
    labelToggleCheckbox('01_25', 'lf_diet_try','lf_diet_try_memo', ['32']);   
    labelToggleCheckbox('01_26', 'lf_beauty_service','lf_beauty_service_memo', ['1024']);  
    labelToggleCheckbox('01_27', 'lf_use_cosmetic','lf_use_cosmetic_etc', ['2048']);          
                            
}





function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}



function savePowerPoll(){
    var body = makeSaveData(powerPollMapLi);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_LI.EDIT : CONSTANTS.POWER_LI.REGISTER,
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
