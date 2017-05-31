/**
 * Created by somehow on 2015. 3. 25..
 */
var powerPollMapMc = {

    '01_01': {
        inputName: 'mc_continue_yn',
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
        inputName: 'mc_target',
        nextPage: '01_03',
        validator: [
            {
                type: 'notnull',
                message: '외국국적을 가지신분이 누구인지 선택해주세요.'
            }
        ]
    },
    '01_03': {
        multiInput: true,        
        inputName: ['mc_national1','mc_national2'],
        nextPage: '01_04',
        validator: {
            'mc_national1': [
                {
                    type: 'notnull',
                    message: '지역을 선택해주세요.'
                }
            ],
            'mc_national2': [
                {
                    type: 'notnull',
                    message: '국가를 선택해주세요.'
                }
            ]
        },
        inputTypeSelect: true           
    },
    '01_04': {
        inputName: 'mc_marriage_type',
        nextPage: '01_05',
        validator: [
            {
                type: 'notnull',
                message: '어떻게 결혼하신지를 선택해주세요.'
            }
        ],
        etcRule: ['etc'],
        etcInputName: 'mc_marriage_type_etc',
        etcValidator: [
            {
                type: 'notnull',
                inputType: 'number',                 
                message: '기타를 입력해 주세요.'
            }
        ]
    },       
    '01_05': {
        inputName: 'mc_entry_year',
        nextPage: '01_06',
        validator: [
            {
                type: 'notnull',
                message: '한국에 온지는 얼마나 되었는지를 선택해주세요.'
            }
        ]
    },             
    '01_06': {
        inputName: 'mc_program_yn',
        nextPage: '01_07',
        validator: [
            {
                type: 'notnull',
                message: '다문화가정을 위한 프로그램행사 참여여부를 선택해주세요.'
            }
        ]
    },
    '01_07': {
        inputName: 'mc_korea_level',
        nextPage: '01_08',
        validator: [
            {
                type: 'notnull',
                message: '한국어 구사능력을 선택해주세요'
            }
        ]
    },
    '01_08': {
        inputName: 'mc_other_fgi_yn',
        nextPage: '01_09',
        validator: [
            {
                type: 'notnull',
                message: '타기관 FGI 경험여부를 선택해주세요.'
            }
        ]
    },        
    '01_09': {
        inputName: 'mc_fgi_yn',
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
        CONSTANTS.POWER_MC.INFO,
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

    if (data.mc_seq)
        this.modify = true;

    for (var key in powerPollMapMc) {
        var item = powerPollMapMc[key];

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
                    setPollValue(key,inputName, inputValue, item.etcRule, item.etcInputName, etcValue,item.bitCalc,item.inputTypeSelect);

                    if (item.createNextPage)
                        createNextPage(key, item, true);
                }
            }
        }
    }



    //initPage();
}

function setPollValue(key,inputName, inputValue, etcRule, etcInputName,etcValue,  bitCalc,inputTypeSelect) {
    
    if(bitCalc)
    {
        setInputValueAll(inputName, inputValue);
    }
    else{
        if(key=='01_01')
        {
            setInputValueFirst(inputName, inputValue);
        }else{
            
            if(inputTypeSelect)
            {
                if(inputName=='mc_national1')
                {
                    setInputSelected(inputName, inputValue);                
                    changeNation(inputValue,""); 

                          
                }else if(inputName=='mc_national2')
                {
                    setInputSelectedInit(inputName, inputValue);              
                }

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
    
    
    labelToggle('01_04', 'mc_marriage_type','mc_marriage_type_etc', ['etc']);     
    
    for (var key in powerPollMapMc)
        bindEvent(key, powerPollMapMc[key]);
        
    ////////////////

        //if (this.modify)
            //changeNation(str,"");      
        
        $("#mc_national1").change(function () {
            var str = "";
            $("#mc_national1 option:selected").each(function () {
                str = $(this).val();

                //$("#mc_national1").selectmenu("refresh",true);
                changeNation(str,"");
              
                       
            });
            //alertLayer(1);
            $('#mc_national2 option[value=""]').prop('selected', true);  
            $("#mc_national2").selectmenu("refresh",true);      
        }); 
/*

    var mc_national1 = "N";
    var mc_national2 = "";      
	$('#mc_national1').bind('change', function (event, ui) {

        var val = $("#mc_national1 option:selected").val();//$("#mc_national1").find(":selected").val();

		var nation1Value = val;//$(this).val();
      
console.log(nation1Value)
		//changeNation(nation1Value,"");

	});
	if (mc_national1 && mc_national2)
	{
		makeNationalHtml(mc_national1,mc_national2);
	}
    */
    /////////////////

}

function changeNation(nation1Value, nation2Value) {
console.log(nation2Value)
    var national_json = 
        {
            'asia':[
                '카자흐스탄','우즈베키스탄','키르기스스탄','네팔','파키스탄','방글라데시','인도','중국','홍콩','일본','미얀마','러시아','몽골','타이완','필리핀','인도네시아','베트남','캄보디아','태국','라오스','싱가포르','말레이시아','기타'
            ],
            'mideast':[
                '터키','레바논','시리아','이스라엘','요르단','이라크','이란','아프가니스탄','쿠웨이트','바레인','사우디아라비아','카타르','아랍에미리트','오만','예멘','기타'
            ],
            'europe':[
                '아이슬란드','스웨덴','노르웨이','핀란드','아일랜드','영국','덴마크','러시아','라트비아','독일','프랑스','벨기에','폴란드','체코','벨라루스','우크라이나','이탈리아','루마니아','포르투갈','에스파냐','그리스','기타'
            ],
            'north_america':[
                '캐나다','미국','기타'
            ],
            'south_america':[
                '멕시코','과테말라','파나마','쿠바','도미니카공화국','바베이도스','베네수엘라','콜롬비아','수리남','에콰도르','페루','브라질','볼리비아','파라과이','칠레','우루과이','아르헨티나','기타'
            ],
            'africa':[
                '모로코','알제리','리비아','이집트','모리타니','세네갈','니제르','차드','수단','나이지리아','라이베리아','에티오피아','소말리아','케냐','콩고민주공화국','탄자니아','앙골라','보츠와나','마다가스카르','남아프리카공화국','기타'
            ],
            'oceania':[
                '오스트레일리아','뉴질랜드','팔라우','미크로네시아','파푸아뉴기니','나우루','마셜','키리바시','투발루','사모아','바누아투','피지','통가','기타'
            ]                                                                                               
            
    }  
  
    
	var mc_national2_html=[]
			;

                    
	mc_national2_html.push("<option value='' >상세선택</option>");

    
            
	$.each(national_json,function(k,v){
		if (nation1Value == k)
		{

			$.each(v,function(kk,vv){
				var selected = ""
					;

				if (nation2Value == vv)
				{
		  console.log(vv);				    				    
					selected = "selected='selected'";
				}

				mc_national2_html.push("<option value='"+vv+"' "+selected+">"+vv+"</option>");
			});
		}
	});

	$('#mc_national2').html(mc_national2_html.join(""));
    //$("#mc_national2").selectmenu("refresh",true);

}



function initPage() {
    if ($.mobile.activePage && 'first0' == $.mobile.activePage.attr('id'))
        $.mobile.changePage('#first1');
}


function savePowerPoll(){
    var body = makeSaveData(powerPollMapMc);
    ONPANEL.Ajax.Request.invokePostByJSON(
        this.modify ? CONSTANTS.POWER_MC.EDIT : CONSTANTS.POWER_MC.REGISTER,
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