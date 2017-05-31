/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapYo = {

    '01_01': {
        inputName: 'y_yn',
        nextPage: '01_02',
        skipPage: 'power-complete',
        skipRule: ['N'],
        validator: [
            {
                type: 'notnull',
                message: '만 19세미만 여부를 선택해주세요.'
            }
        ]
    },
    '01_02': {
        inputName: 'y_continue_yn',
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
        inputName: 'y_private_education',
        nextPage: '01_04',
        skipPage: '01_05',
        skipRule: ['no'],            
        validator: [
            {
                type: 'notnull',
                message: '어떤 사교육을 받고있는지를 선택해주세요'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'y_private_education_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                 
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_04': {
        inputName: 'y_private_education_cnt',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                message: '사교육을 일주일에 총 몇 회 받는지를 선택해주세요.'
            }
        ]
    },             
    '01_05': {
        inputName: 'y_volunteer_work',
        nextPage: '01_06',
        skipPage: '01_08',
        skipRule: ['N'],          
        validator: [
            {
                type: 'notnull',
                message: '자원봉사를 해본 적 여부를 선택해주세요.'
            }
        ]
    },
    '01_06': {
        inputName: 'y_volunteer_work_reason',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '자원봉사를 한 이유를 선택해주세요.'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'y_volunteer_work_reason_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },    
    '01_07': {
        inputName: 'y_volunteer_work_type',
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                message: '어떤 방법으로 자원봉사에 참여했는지를 선택해주세요.'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'y_volunteer_work_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },   
    '01_08': {  
        inputName: 'y_worry',
        bitCalc: true,        
        nextPage: '01_09',
        validator: [
            {
                type: 'notnull',
                message: '3가지 선택해주세요.'
            }
        ],
        etcRule: ['16384'],
        etcInputName: 'y_worry_memo',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                   
                message: '기타를 입력해 주세요.'
            }
        ]
    },
    '01_09': {
        
        multiInput: true,
        inputName: ['y_school_club', 'y_young_club', 'y_internet_club'],                 
        nextPage: '01_10',
        validator: 
            {
                'y_school_club': [
                    {
                        type: 'notnull',
                        message: '학교 동아리 활동 여부를 선택해주세요.'
                    }
                ],           
                'y_young_club': [
                    {
                        type: 'notnull',
                        message: '청소년 시설 동아리 활동 여부를 선택해주세요.'
                    }
                ],
                'y_internet_club': [
                    {
                        type: 'notnull',
                        message: '사이버 동아리 활동 여부를 선택해주세요.'
                    }
                ]
            },
        etcException: 
            {
                'y_school_club': [
                    {
                        exceptionRule: 'Y',
                        exceptionInputName: 'y_school_club_memo',                        
                        exceptionValidator:
                            [
                                    {
                                        type: 'notnull',
                                        message: '학교 동아리 활동명을 입력해주세요.'
                                    }
                            ]        

                    }
                ],           
                'y_young_club': [
                    {
                        exceptionRule: 'Y',
                        exceptionInputName: 'y_young_club_memo',                        
                        exceptionValidator:
                            [
                                    {
                                        type: 'notnull',
                                        message: '청소년 시설 동아리 활동명을 입력해주세요.'
                                    }
                            ]  
                    }
                ],
                'y_internet_club': [
                    {
                        exceptionRule: 'Y',
                        exceptionInputName: 'y_internet_club_memo',                        
                        exceptionValidator:
                            [
                                    {
                                        type: 'notnull',
                                        message: '인터넷 동아리 활동명을 입력해주세요.'
                                    }
                            ]  

                    }
                ]
            }            
    },    
    '01_10': {
        inputName: 'y_alba_yn',
        nextPage: '01_11',
        validator: [
            {
                type: 'notnull',
                message: '아르바이트를 해 본 경험 여부를 선택해주세요.'
            }
        ]
    },
    '01_11': {
        inputName: 'y_loadmap_yn',
        nextPage: 'power-complete',
        validator: [
            {
                type: 'notnull',
                message: '진로 교육여부를 선택해주세요.'
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
        CONSTANTS.POWER_YO.INFO,
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

    if (data.y_seq)
        this.modify = true;

    for (var key in powerPollMapYo) {
        var item = powerPollMapYo[key];

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

                if ((inputValue && inputValue != 0) && skipData.indexOf(inputName) == -1) {
                  
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName, etcValue, item.bitCalc);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                        
                    //if (item.createPage)
                    //    item.createPage(item.etcException);
                                                                      
                }
console.log('1');
console.log(inputName);
                if(typeof item.etcException != 'undefined')
                {   
console.log('2');     
console.log(item.etcException);
console.log(item.etcException[inputName][0].exceptionRule.length);

            
                        //var excRule = item.etcException[item.inputName][0].exceptionRule[k];
                        var excName = item.etcException[inputName][0].exceptionInputName;  
console.log(excName);
console.log(data[excName]);
                        setPollValue(key,excName, data[excName], item.etcRule, item.etcInputName, etcValue, item.bitCalc);
            
            
                            

                }
                
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName, etcValue, bitCalc) {
    if(bitCalc)
    {
        setInputValueAll(inputName, inputValue);
        if(etcRule){
            setInputTextInit(etcInputName, etcValue);
        }
    }else{

        if(key=='01_01')
        {
            setInputValueFirst(inputName, inputValue);
        }else{
            if(inputValue==0)
                inputValue='';
            setInputValue(inputName, inputValue);
        }
    }

    if (checkRule(etcRule, getInputValue(inputName)))
    {
        //console.log(etcInputName);
        //console.log(etcValue);
        setInputTextInit(etcInputName, etcValue);
        
    }

}

function bindEvents() {
    changeWorry();
    changeClub();

    labelToggle('01_03', 'y_private_education','y_private_education_memo', ['etc']);  
    labelToggle('01_06', 'y_volunteer_work_reason','y_volunteer_work_reason_memo', ['etc']);  
    labelToggle('01_07', 'y_volunteer_work_type','y_volunteer_work_memo', ['etc']);  
    
    labelToggleCheckbox('01_08', 'y_worry','y_worry_memo', ['16384']);
            
    for (var key in powerPollMapYo)
        bindEvent(key, powerPollMapYo[key]);
    
}



function changeWorry() {


	var $y_worry_chks = $('input[name="y_worry"]')
		, y_worry = 0
		;
                    
	$('input[name="y_worry"]').click(function() {
	   // (3가지만 선택)
		if ($('input[name="y_worry"]:checked').length > 3)
		{
			alertLayer("고민하는 문제를 3가지 이하로 선택해주세요.");
			//$('input[name="y_worry"]').focus();
            $(this).attr('checked',false).checkboxradio("refresh");                
			return false;
		}
       ////////////////            
		if ($(this).val() != "32768")
		{

			$('#y_worry_32768').attr("checked",false).checkboxradio("refresh");          
				  

        }

          
	});
    setPowerYoWorry();    
}
function setPowerYoWorry() {

		$('#y_worry_32768').click(function() {

            if ($(this).is(":checked"))
            {
                console.log($(this).val());	
                $('input[name="y_worry"]:checked').each(function(){
             
                		if ($(this).val()  != "32768")
                		{

     		                 //$('#y_worry_'+$(this).val()).prop('checked',false);    
                             $(this).attr('checked',false).checkboxradio("refresh");
                             //document.getElementById('y_worry_'+$(this).val()).checked = false;
                		}
                		else {
                 		     $('input[name="y_worry_memo"]').val('');
                			 $(this).attr('checked',true);   
                		}  
                                  
                }); 
      
            }

	});

}


function changeClub() {


    $('input[name="y_school_club"]').bind('click', function (event, ui) {
        setPowerYoClub('y_school_club','y_school_club_memo');                                                            
    });    
    $('input[name="y_young_club"]').bind('click', function (event, ui) {                        
        setPowerYoClub('y_young_club','y_young_club_memo');  
    });    
    $('input[name="y_internet_club"]').bind('click', function (event, ui) {
        setPowerYoClub('y_internet_club','y_internet_club_memo');  
    });    


}


function setPowerYoClub(inputName, checkName) {

    $('input[name=' + inputName + ']:checked').each(function(){
        //var compreValue = parseInt($(this).val());

    		if ($(this).val() == "N")
    		{

                $(createDivId(checkName)).textinput('disable').focus();      
                //$(createDivId(checkName)).attr("readonly",false).css("background-color","#f7f7f7").focus();
    		}//
    		else {
                $(createDivId(checkName)).textinput('enable').val("");       		  
    			//$(createDivId(checkName)).attr("readonly",true).css("background-color","#D5D2D2").val("");
    		}  
                      
    });    
        

}




function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}



function savePowerPoll(){
    var body = makeSaveData(powerPollMapYo);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_YO.EDIT : CONSTANTS.POWER_YO.REGISTER,
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