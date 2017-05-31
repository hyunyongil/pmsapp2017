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
    console.log('first19:');  

        var validationResult = validationPage(page, item);   
    console.log(validationResult);               
        if (validationResult) {
            console.log('pass:'+validationResult); 
            if(setPageNavigation(page, item)){
                if (item.createNextPage)
                    createNextPage(page, item);

                $.mobile.changePage(this.href);
            }
            //////////////////
            
            var href = $(this).attr("href");
            if(href=='#first-complete'){

                if($(this).attr('complete') == undefined){
                    $(this).attr('complete',true);
                    saveFirstPoll();
                 }
                 e.stopPropagation();

            }
            
            //////////////////                
        }
        else{
            //console.log('error:'+validationResult); 
            //return false;            
                    
        }        
    });
    /*

    $("a[href='#first-complete']").click(function(e){
        if($(this).attr('complete') == undefined){
            $(this).attr('complete',true);
            saveFirstPoll();
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
            value = getInputValue(item.etcInputName);

        var href = $(createDivId(page)).find('.next a').attr('href');

        var func = eval(item.createNextPage);

        func($(href), value);

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

        nextPage = (skipRule.indexOf(checkedInputValue) > -1) ? skipPage : nextPage;
        if(nextPage == 'first-complete') { 
            saveFirstPoll();
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

        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);

            validators = [];
            validators.push(item.validator);
        }

        for (var j = 0; j < inputNames.length; j++) {
            var inputName = inputNames[j];
            var validator = validators[j];
            var prefix = '';

            if (0 < subfix) {
                inputName += '_' + subfix;
                prefix = item.arrayInputName + subfix + '의 ';
            }    validationPage
 
    console.log(prefix);        
            if (!validateInput(inputName, validator, prefix)) {
                return false;
            }
   
            if (checkRule(item.etcRule, getInputValue(inputName))) {
                if (!validateInput(item.etcInputName, item.etcValidator, prefix)) {
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

        try{
            if($.isEmptyObject(validators.children_cnt_detail_year) == false) {
                var validator = validators.children_cnt_detail_year[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
            if($.isEmptyObject(validators.children_cnt_detail_gender) == false) {
                var validator = validators.children_cnt_detail_gender[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
            if($.isEmptyObject(validators.children_cnt_detail_school) == false) {
                var validator = validators.children_cnt_detail_school[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
            
            //////////////smartphone_
            
            if($.isEmptyObject(validators.smartphone_detail_maker) == false) {
                var validator = validators.smartphone_detail_maker[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
            if($.isEmptyObject(validators.smartphone_detail_type) == false) {
                var validator = validators.smartphone_detail_type[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
            if($.isEmptyObject(validators.smartphone_detail_app) == false) {
                var validator = validators.smartphone_detail_app[0];
                var inputValue = getInputValue(inputName);
                var isValid = true;

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
        catch(e) { }

        console.log(validators);
    }

    return true;
}

function checkRule(rule, value) {
    if (!rule) rule = [];

    return ((rule.indexOf(value)) > -1);
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

function makeSaveData(map) {
    var data = {};

    for (var key in map) {
        var item = map[key];

        var inputNames = item.inputName;
        if (!item.multiInput) {
            inputNames = [];
            inputNames.push(item.inputName);
        }

        var itemSubfixList = getItemSubfixList(item);
        for (var i in inputNames) {
            var inputName = inputNames[i];

            if (item.arrayInput) {
                data[inputName] = [];

                for (var j = 0; j < itemSubfixList.length; j++)
                    data[inputName].push(getInputValue(inputName + '_' + itemSubfixList[j]));
            } else {
                data[inputName] = getInputValue(inputName);

                if(item.bitCalc)
                    data[inputName] = getInputValueAll(inputName);

                if (checkRule(item.etcRule, data[inputName]))
                    data[item.etcInputName] = getInputValue(item.etcInputName);
            }
        }
    }

    return data;
}

function createDivId(id) {
    return '#' + id;
}

function getGenderText(code) {
    return ('M' == code) ? '남자' : '여자';
}

function getBirthDayText(birthDay) {
    var year = birthDay.substr(0, 4);
    var month = birthDay.substr(4, 2); // 1월=0,12월=11
    var day = birthDay.substr(6, 2);

    return year + '-' + month + '-' + day;
}

function getInputValue(inputName) {
    var input = $(createDivId(inputName));
    if (input.length)
        return input.val().trim();

    input = $('input[name=' + inputName + ']:checked');
    return input.length > 0 ? input.val().trim() : '';
}

function getInputValueAll(inputName) {
    var value = 0;
    $('input[name=' + inputName + ']:checked').each(function(){
        value = value + parseInt($(this).val())
    });

    return value;
}

function setInputChecked(inputName, value) {
    $('input[name=' + inputName + ']').filter('[value="' + value + '"]').attr('checked', true);
}

function setInputValue(inputName, value) {
    var input = $(createDivId(inputName));

    if (input.length) {
        input.val(value);

        if ('select' == input.getInputType()) {
            input.selectmenu('refresh');
        }

    } else {
        try{
            if(inputName == "birthday") {
                setTimeout(function(){
                    $.each($('select[name=' + inputName + '] option'),function(k,v){
                        if(value == $(this).val()) {
                            $(this).attr('selected',true);
                        }
                    });
                },100);

                setTimeout(function(){
                    $('select[name=' + inputName + ']').selectmenu('refresh');
                },130);

                //$('select[name=' + inputName + '] option').filter('[value="' + value + '"]').attr('selected', true).selectmenu('refresh');
            }
            else {
                $('input[name=' + inputName + ']').filter('[value="' + value + '"]').attr('checked', true).checkboxradio('refresh');
            }
        }
        catch(e) {
            $('input[name=' + inputName + ']').filter('[value="' + value + '"]').attr('checked', true);
            console.log(e);
        }
    }
}

function setInputValueAll(inputName, value) {
    $('input[name=' + inputName + ']').each(function(){
        value = parseInt(value);

        var compreValue = parseInt($(this).val());

        if((value & compreValue) == compreValue)
            $(this).attr('checked', true);
    });
}

function createYearSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    var date = new Date();
    for (var i = 1974; i <= date.getFullYear(); i++)
        selectBox.append($('<option>').val(i).text(i + '년'));

    return selectBox;
}
function createYearLongSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    var date = new Date();
    for (var i = 1930; i <= date.getFullYear(); i++)
        selectBox.append($('<option>').val(i).text(i + '년'));

    return selectBox;
}

function createGenderSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    selectBox.append($('<option>').val('M').text('남자'));
    selectBox.append($('<option>').val('F').text('여자'));

    return selectBox;
}

function createSchoolSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    selectBox.append($('<option>').val('PRE').text('미취학아동'));
    selectBox.append($('<option>').val('GRADE').text('초등학생'));
    selectBox.append($('<option>').val('MIDDLE').text('중학생'));
    selectBox.append($('<option>').val('HIGH').text('고등학생'));
    selectBox.append($('<option>').val('UNI').text('대학생 이상'));

    return selectBox;
}

function createPhoneMakerSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    selectBox.append($('<option>').val('SAMSUNG').text('삼성전자'));
    selectBox.append($('<option>').val('LG').text('LG전자'));
    selectBox.append($('<option>').val('APPLE').text('애플'));
    selectBox.append($('<option>').val('SKY').text('팬텍(SKY)'));
    selectBox.append($('<option>').val('NOKIA').text('노키아'));
    selectBox.append($('<option>').val('HTC').text('HTC'));
    selectBox.append($('<option>').val('SONY').text('소니에릭슨'));
    selectBox.append($('<option>').val('RIM').text('RIM(블랙베리)'));
    selectBox.append($('<option>').val('MOTOROLA').text('모토로라'));
    selectBox.append($('<option>').val('KT').text('KT Tech'));
    selectBox.append($('<option>').val('SK').text('SK Telesys'));

    return selectBox;
}

function createPhoneTypeBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    selectBox.append($('<option>').val('SK').text('SK'));
    selectBox.append($('<option>').val('KT').text('KT'));
    selectBox.append($('<option>').val('LG').text('LG'));
    selectBox.append($('<option>').val('ETC').text('기타'));

    return selectBox;
}

function createPhoneAppSelectBox(inputName, defaulOptionText) {
    var selectBox = createSelectBox(inputName, defaulOptionText);

    selectBox.append($('<option>').val('DONTKNOW').text('잘 모르겠다'));
    selectBox.append($('<option>').val('N').text('스마트폰이 아니라서 해당없음'));
    selectBox.append($('<option>').val('0').text('스마트앱폰이지만 유료앱을 이용하지 않는다'));
    selectBox.append($('<option>').val('1').text('유료앱 월 1회 이용'));
    selectBox.append($('<option>').val('3').text('유료앱 월 2~3회 이용'));
    selectBox.append($('<option>').val('5').text('유료앱 월 4~5회 이상'));

    return selectBox;
}

function createSelectBox(inputName, defaulOptionText) {
    return $('<select>').attr('name', inputName).attr('id', inputName).attr('data-mini', 'true').attr('data-corners', 'false').append($('<option>').val('').text(defaulOptionText));
}

function gup( name )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );

    if( results == null )
        return "";
    else
        return results[1];
}
