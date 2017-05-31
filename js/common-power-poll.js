/**
 * Created by Administrator on 2015-04-07.
 */
/**
 * Created by somehow on 2015. 3. 30..
 */

function bindEvent(page, item) {
    $(createDivId(page)).bind('change', function (event, ui) {
        $(this).attr('changed', 'true');
    });

    $(createDivId(page)).find('.next a').bind('click', {page: page, item: item}, function (event, ui) {
        event.preventDefault();

        if(item.bitCalc)//다중선택 checkbox - 비트연산
        {
            if (validationPageBit(page, item)) {
                
                if(setPageNavigation(page, item)){
                    if (item.createNextPage)
                        createNextPage(page, item);
        
                    $.mobile.changePage(this.href);
                }
                
                //////////////////
                
                var href = $(this).attr("href");
                if(href=='#power-complete'){
    
                    if($(this).attr('complete') == undefined){
                        $(this).attr('complete',true);
                        savePowerPoll();
                     }
                     e.stopPropagation();
    
                }
                
                //////////////////                   
                
    
            }else{
                //console.log('error:'+validationResult); 
                //return false;   
                
                
            }
            
        }else{
            
            if (validationPage(page, item)) {
                if(setPageNavigation(page, item)){
                    if (item.createNextPage)
                        createNextPage(page, item);
        
                    $.mobile.changePage(this.href);
                }
                
                //////////////////
                
                var href = $(this).attr("href");
                if(href=='#power-complete'){
    
                    if($(this).attr('complete') == undefined){
                        $(this).attr('complete',true);
                        savePowerPoll();
                     }
                     e.stopPropagation();
    
                }
                
                //////////////////                  
            }else{
               // console.log('error:'+validationResult); 
                //return false;   
                
                
            }
        }
        

    });
    /*
    $("a[href='#power-complete']").click(function(e){
        if($(this).attr('complete') == undefined){
        $(this).attr('complete',true);
         savePowerPoll();
         }
         e.stopPropagation();
    });
    */
}
 
function createNextPage(page, item, isCreate) {
    var pageDiv = $(createDivId(page));
    if (pageDiv.attr('changed') || isCreate) {
        var value = getInputValue(item.inputName);
        if(checkRule(item.etcRule, value))
            value = getInputValueText(item.etcInputName);

        var href = $(createDivId(page)).find('.next a').attr('href');

        item.createNextPage($(href), value);

        pageDiv.removeAttr('changed');
    }
}

function setPageNavigation(page, item) {
    var inputName = item.inputName;
    var nextPage = item.nextPage;
    var skipPage = item.skipPage;
    var skipRule = item.skipRule;

    if (skipPage) {
        if (!skipRule) skipRule = [];
        if (!skipPage) skipPage = nextPage;

        var checkedInputValue = getCheckedInput(page, inputName).val();
//console.log(checkedInputValue);
//console.log(skipRule.indexOf(checkedInputValue));
        nextPage = (skipRule.indexOf(checkedInputValue) > -1) ? skipPage : nextPage;
        if(nextPage == 'power-complete') { 
            savePowerPoll();
            return false;
        }
    }
    prevFirstPollPageChange(nextPage, page);
    nextFirstPollPageChange(page, nextPage);
    return true;
}

function prevFirstPollPageChange(page, nextPage) {
    $(createDivId(page)).find('.prev a').attr('href', createDivId(nextPage));
}
function nextFirstPollPageChange(page, nextPage) {
    $(createDivId(page)).find('.next a').attr('href', createDivId(nextPage));
}


function validationPage(page, item) {

    var list = getItemSubfixList(item);
    for (var i = 0; i < list.length; i++) {
        var subfix = list[i];

        var inputNames = item.inputName;
        var validators = item.validator;
        var validatorPercent = 0;
         
        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);

            validators = [];
            validators.push(item.validator);
        }
        
   
        
//console.log(inputNames.length); 
        for (var j = 0; j < inputNames.length; j++) {
            
            if (!item.multiInput) {
                var inputName = inputNames[j];
                var validator = validators[j];
                var prefix = '';
            
            }else{
      
                var inputName = inputNames[j];
                var prefix = '';
                var validator = validators[inputName];
       
    //console.log(validators[inputName]);      
            }
    //console.log(inputName); 
    //console.log(validator);  
            if (0 < subfix) {
                inputName += '_' + subfix;
                prefix = item.arrayInputName + subfix + '의 ';
            }
            
            if (!validateInput(inputName, validator, prefix)) {
                return false;
            }

            if(item.percentRule) {
                
                validatorPercent = validatorPercent + parseInt(getInputValueText(inputName));
            }

            if (checkRule(item.etcRule, getInputValue(inputName))) {
                if (!validateInput(item.etcInputName, item.etcValidator, prefix)) {
                    return false;
                }
            }

            if (checkExceptionRule(item.etcException, getInputValue(inputName),inputName)) {
                if (!validateExceptionInput(item.etcException[inputName][0].exceptionInputName, item.etcException[inputName][0].exceptionValidator, prefix)) {
                    return false;
                }
            }

        }
    //console.log(validatorPercent); 
    //console.log(item.percentRule); 
        
        if(item.percentRule) {
            
            if (!validateExceptionInputPercent(item.percentRule,validatorPercent,item.percentValidator, prefix)) {
                return false;
            }
        }
    }

    return true;
}



function validationPageBit(page, item) {
 
    var prefix = '';

    if (!validateInput(item.inputName, item.validator, prefix)){
        return false;
    }

    if (checkRule(item.etcRule, getInputValue(item.inputName))) {
        if (!validateInput(item.etcInputName, item.etcValidator, prefix)) {
            return false;
        }
    }

    var value = 0;

    $('input[name=' + item.inputName + ']:checked').each(function(){
        value = value + parseInt($(this).val())
    });


    try{
        if(item.etcRule.length > 0) {
            var etc_chk = false;
            $.each(item.etcRule,function(k,v){
                var rule_num = parseInt(v);

                if(value & rule_num) {
                    if (!validateInput(item.etcInputName, item.etcValidator, prefix)) {
                        etc_chk = true;
                    }
                }
            });

            if(etc_chk) {
                return false;
            }
        }
    }
    catch(e) { }

    inputNamesData = value;

    if (inputNamesData) {
        
        if(typeof item.etcException != 'undefined')
        {   

            for (var k = 0; k < item.etcException[item.inputName][0].exceptionRule.length; k++) {
    
                var excRule = item.etcException[item.inputName][0].exceptionRule[k];
                var excName = item.etcException[item.inputName][0].exceptionInputName[k];  
                var excVali = item.etcException[item.inputName][0].exceptionValidator;
                                      
                var pNum=parseInt(inputNamesData);
                console.log(pNum);
                if(pNum & excRule){//0010
    
                    if (!validateExceptionInputData(excName, excVali, prefix))
                        return false;
                }
            }
        }
    }                  



    return true;
}


function getItemSubfixList(item) {
    var list = [];

    if (item.arrayInput) {
        var inputName = item.inputName;
        if (item.multiInput)
            inputName = item.inputName[0];

        var count = 1;
        do {
            var input = $(createDivId(inputName + '_' + count));
            if (input.length == 0)
                break;

            list.push(count);

            count++;
        } while (true);

    } else {
        list.push(0);
    }

    return list;
}

function validateInput(inputName, validators, prefix) {
    if (validators) {
        for(var i=0; i<validators.length; i++) {
            var validator = validators[i];
            var inputValue = getInputValue(inputName);
            var isValid = true;
//console.log(inputValue);

            if(validator.inputType=='number')//주관식,텍스트 박스
            {
                inputValue = getInputValueText(inputName);//input text 형태 validation 체크
                
                if('notnull' == validator.type) {
                    if (inputValue.length == 0)
                        isValid = false;
                } else if('condition' == validator.type) {
                    if(!eval(validator.condition))
                        isValid = false;
                }
    

            }else{
                

                if('notnull' == validator.type) {
                    if (inputValue.length == 0)
                        isValid = false;
                } else if('condition' == validator.type) {
                    if(!eval(validator.condition))
                        isValid = false;
                }

            }
    
            if(!isValid) {
                alertLayer(prefix + validator.message);
                return false;
            }

        }
    }

    return true;
}

function validateExceptionInput(inputName, validators, prefix) {

    if (validators) {

    //console.log(validators);        
        for(var i=0; i<validators.length; i++) {
            var validator = validators[i];
            var inputValue = getInputValue(inputName);
            var isValid = true;
    //console.log(inputName);             
    //console.log(inputValue); 
    
    
            if('notnull' == validator.type) {
                if (inputValue.length == 0)
                    isValid = false;
            } else if('condition' == validator.type) {
                if(!eval(validator.condition))
                    isValid = false;
            }

            if(!isValid) {
                alertLayer(prefix + validator.message);
                return false;
            }

        }
    }

    return true;
}


function validateExceptionInputData(inputName, validators, prefix) {

           
 
    if (validators) {

        
        for(var i=0; i<validators.length; i++) {
            var validator = validators[i];
            var inputValue = getInputValueText(inputName);
            var isValid = true;
    console.log(inputName);  
    console.log(inputValue);    
    
            if('notnull' == validator.type) {
                if (inputValue.length == 0)
                    isValid = false;
            } else if('condition' == validator.type) {
                if(!eval(validator.condition))
                    isValid = false;
            }

            if(!isValid) {
                alertLayer(prefix + validator.message);
                return false;
            }

        }
    }

    return true;
}

function validateExceptionInputPercent(vRule,vPercent,validators, prefix) {

           
 
    if (validators) {

        
        for(var i=0; i<validators.length; i++) {
            var validator = validators[i];

            var isValid = true;


            if(vRule != vPercent) {
                    isValid = false;
            } 
            
            if(!isValid) {
                alertLayer(prefix + validator.message);
                return false;
            }

        }
    }

    return true;
}


function checkRule(rule, value) {
    if (!rule) rule = [];

    return ((rule.indexOf(value)) > -1);
}

function checkExceptionRule(etcException, value, inputName) {

    if (!etcException) etcException = [];    
    var rule = false;

    if(typeof etcException[inputName] != 'undefined')
    {

        rule = (etcException[inputName][0].exceptionRule == value) ? true : false;  
        
        
        if(etcException[inputName][0].exceptionRule=='' && value!='')
        {
            rule = true;
        }        
    //console.log(etcException[inputName][0].exceptionRule);   
    //console.log(value);      
    }
    

    return rule;
}


function getCheckedInput(page, inputName) {
    return $(createDivId(page)).find('[name=' + inputName + ']:checked');
}

function checkBoxToogle(page, inputName, toogleRule) {
    $(createDivId(page)).find('[name=' + inputName + ']').click(function () {
        var compareValue = toogleRule.indexOf(this.value);

        $(createDivId(page)).find('[name=' + inputName + ']').each(function () {
            if (toogleRule.indexOf(this.value) != compareValue) {
                $(this).attr('checked', false).checkboxradio('refresh');

                $('label[for=' + this.id + ']').find('input').each(function () {
                    this.value = '';
                });
            }
        });
    });
}

function labelToggle(page, inputName, etcName, toogleRule) {//radio
    $(createDivId(page)).find('[name=' + etcName + ']').click(function () {
        
    console.log(inputName);        


        $(createDivId(page)).find('[name=' + inputName + ']').each(function () {
            var compareValue = toogleRule.indexOf(this.value);  
                 
            if (compareValue >= 0) {
    console.log(compareValue);  
    console.log($(this).prop("checked",true));       
                $(this).prop("checked",true).checkboxradio("refresh");  

            }else{
                
                $(this).prop("checked",false).checkboxradio("refresh");                  
            }

        });
    });
}

function labelToggleCheckbox(page, inputName, etcName, toogleRule) {//radio

    $(createDivId(page)).find('[name=' + etcName + ']').click(function () {
        
    console.log(inputName + '_' + etcName );        


        $(createDivId(page)).find('[name=' + inputName + ']').each(function () {
            var compareValue = toogleRule.indexOf(this.value);  
                 
            if (compareValue >= 0) {
    console.log($(this).prop("checked",true));
                $(this).prop("checked",true).checkboxradio("refresh");  

            }else{
                
               // $(this).prop("checked",false).checkboxradio("refresh");                  
            }

        });
    });
}


function labelToggleCheckbox2(page, inputName, etcName, toogleRule) {//radio


    $(createDivId(page)).find('[name=' + etcName + ']').click(function () {
        
    console.log(inputName + '_' + etcName );        


        $(createDivId(page)).find('[name=' + inputName + ']').each(function () {
            var compareValue = toogleRule.indexOf(this.value);  
    console.log(compareValue);
            if (compareValue >= 0) {

                $(this).prop("checked",true).checkboxradio("refresh");  

            }else{
                
               // $(this).prop("checked",false).checkboxradio("refresh");                  
            }

        });
    });
}

function checkBoxExToogle(page, inputName,togleValue, toogleRule) {

    $(createDivId(page)).find('[name=' + inputName + ']').click(function () {
        
    //console.log(inputName);        
        var compareValue = toogleRule.indexOf(this.value);
    //console.log(compareValue);
        $(createDivId(page)).find('[name=' + inputName + ']').each(function () {
            if (compareValue < 0) {
                $(createDivId(inputName+"_"+togleValue)).attr("checked",false).checkboxradio("refresh");

            }

        });
    });

    checkBoxExToogleSub(page,inputName, togleValue,toogleRule);    

}

function checkBoxExToogleSub(page,inputName, togleValue,toogleRule) {
//console.log(inputName+"_"+togleValue);

    $(createDivId(inputName+"_"+togleValue)).click(function () {

        $(createDivId(page)).find('[name=' + inputName + ']:checked').each(function () {
            if (this.value != togleValue) {
                $(this).attr('checked', false).checkboxradio('refresh');

            }
            else{
                $(this).attr('checked',true);
                $('label').find('input').each(function () {
                    this.value = '';
                });                
                //$('input[name="' + inputName + '_memo"]').val('');

            }
        });


	});     
}



function makeSaveData(map) {
    var data = {};

    for (var key in map) {
        var item = map[key];

        var inputNames = item.inputName;
        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);
        }
//console.log(inputNames);
        var itemSubfixList = getItemSubfixList(item);
     
        for (var i in inputNames) {
            var inputName = inputNames[i];
            var inputValue = '';            


            if (item.arrayInput) {
                data[inputName] = [];

                for (var j = 0; j < itemSubfixList.length; j++)
                    data[inputName].push(getInputValue(inputName + '_' + itemSubfixList[j]));
            } else {


console.log(item);
                if(item.bitCalc)
                {
                    var inputValue = getInputValueAll(inputName);                    
                    data[inputName] = inputValue;                    
   
console.log(data); 
                    //etc 입력값
                    inputNamesData = inputValue;
                    if (inputNamesData) {
                        
                        if(typeof item.etcRule != 'undefined')
                        {   
                  
                                var pNum=parseInt(inputNamesData);
                                console.log(item.etcRule[0]);
                                if(pNum & item.etcRule[0]){//0010
                
//console.log('2.etcInputName:'+item.etcInputName); 
//console.log('3.etcInputName:'+getInputValueText(item.etcInputName));                                           
                                            data[item.etcInputName] = getInputValueText(item.etcInputName);
                                  }
                
                        }
                    } 
                    
                    if(typeof item.etcException != 'undefined')
                    {           
                    //주관식,텍스트 박스
                        for (var k = 0; k < item.etcException[item.inputName][0].exceptionRule.length; k++) {
                
                            var excName = item.etcException[item.inputName][0].exceptionInputName[k];  
//console.log(excName);                  
                            data[excName]=getInputValueText(excName);       
                        }
                    }
//console.log(data); 

                }else{

                    if(item.inputTypeText)//주관식,텍스트 박스
                    {
//console.log('1.inpuTypeText:'+item.inputTypeText);                        
                        var inputTextValue = getInputValueText(inputName);                        
                        data[inputName] = inputTextValue;
                  
                    }
                    else{
                        inputValue = getInputValue(inputName);
                        data[inputName] = inputValue;
                    
                    }
                    //etc 입력값
    //console.log(item.etcRule);  
    //console.log(inputName);  
                    if(typeof item.etcRule != 'undefined')
                    {    
    //console.log(checkRule(item.etcRule, getInputValue(inputName))); 
                        if (checkRule(item.etcRule, getInputValue(inputName)))
                        {
    //console.log('2.etcInputName:'+item.etcInputName);   
                            data[item.etcInputName] = getInputValueText(item.etcInputName);
                        }    
                    }
                    
//console.log(item.inputName);                 
                    if(typeof item.etcException != 'undefined')
                    {           
//console.log(item.etcException);           
                        //for (var j=0;j<item.inputName.length; j++){
                        //주관식,텍스트 박스

                    
                                var excName = item.etcException[inputName][0].exceptionInputName;  
//    console.log(excName);                  
                                data[excName]=getInputValueText(excName);       

                       // }

                    }                    
                    
                }


   

            }
//console.log(data);            
        }
    }

    return data;
}

function getInputValueText(inputName) {
    var input = $(createDivId(inputName));
    if (input.length)
        return input.val().trim();

    input = $('input[name=' + inputName + ']');

    return input.length > 0 ? input.val().trim() : '';
}
function setInputSelected(inputName, value) {
    var input = $(createDivId(inputName));

    if (input.length) {
        input.val(value);
    } 
}
function setInputSelectedInit(inputName, value) {
    
    $('#'+inputName+' option[value="' + value + '"]').prop('selected', true);
    //$('#'+inputName).selectmenu('refresh');    

}
function setInputTextInit(inputName, value) {
    if(value==0)
        value='';
        $('input[name=' + inputName + ']').val(value);
    //$('#'+inputName).selectmenu('refresh');    

}
function setInputValueFirst(inputName, value) {
    var input = $(createDivId(inputName));

    if (input.length) {
        input.val(value);
        if ('select' == input.getInputType())
            input.selectmenu('refresh');
    } else {
        $('input[name=' + inputName + ']').filter('[value="' + value + '"]').attr('checked', true).checkboxradio("refresh");
    }
}

function setInputValueAllFirst(inputName, value) {
    $('input[name=' + inputName + ']').each(function(){
        value = parseInt(value);

        var compreValue = parseInt($(this).val());

        if((value & compreValue) == compreValue)
            $(this).attr('checked', true).checkboxradio("refresh");
    });
}

