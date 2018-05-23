/**
 * Created by yong on 2017. 08. 10
 */

function readyMainView() {
    $(document).ready(function () {
        $(document).on('click', '.survey_tr', function () {
            //$(".survery_content").hide();
            var id = 'content' + $(this).attr('id');
            $("#" + id).slideToggle(100);
            $(".survey_tr").removeClass('on');
            $(this).addClass('on');
        });

        $(document).on('click', '.deleteNum', function () {
            if (confirm("해당 데이터를 삭제하시겠습니까?")) {
                deleteStatus(CONSTANTS.PMS.STATUSDELETENYC, $(this).attr('id'), 1, gup("btype"));
            }
        });
    });
    bindSurveyList();
}

function deleteStatus(url, muid, type, btype) {
    var param = {
        muid: muid
        , type: type
        , btype: btype
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                ONPANEL.Ajax.Result.LoadingHide();
                alertLayer('삭제되었습니다.');
                location.reload();
            }
        },
        null,
        true);
}


function bindSurveyList() {
    $(document).on('pageinit', '#survey_list', function () {
        getSurvey(CONSTANTS.PMS.STATUSVIEWNYC, 1, appendSurvey, gup("pms_num"), gup("type"), gup("btype"), gup("numth"));
        bindMoreEvent();

        onsolMoreList.init(function () {
            var data = $('.survey-more').data();
            if ($.isEmptyObject(data)) {
                $('.survey-more').data({url: CONSTANTS.PMS.PROGRAMLIST, page: 0});
                var data = $('.survey-more').data();
            }
            var now_page = parseInt(data.page) + 1;

            if (now_page > 1) {
                if (onsolMoreList.scroll_mode == false) {
                    return false;
                }
                getSurvey(data.url, parseInt(data.page) + 1, appendSurvey, gup("pms_num"), gup("type"), gup("btype"), gup("numth"));
            }
        });
    });
}


function getSurvey(url, page, callback, num, type, btype, numth) {
    if (!page)
        page = 1;
    $('.survey-more').data({url: url, page: page});

    var param = {
        num: num,
        type: type,
        btype: btype,
        numth: numth,
        page: page,
        list_cnt: 10000
    };
    ONPANEL.Ajax.Result.LoadingShow();
    ONPANEL.Ajax.Request.invokePostByJSON(
        url,
        param,
        function (data) {
            try {
                if (ONPANEL.Ajax.Result.isSucess(data)) {
                    callback(ONPANEL.Ajax.Result.getData(data));
                }
                onsolMoreList.scroll_mode = true;
            }
            catch (e) {
                onsolMoreList.scroll_mode = true;
            }
        },
        null,
        true);
}
function bindMoreEvent() {
    $('.survey-more').bind('click', function () {
        var data = $(this).data();
        getSurvey(data.url, parseInt(data.page) + 1, appendSurvey, gup("pms_num"), gup("type"), gup("btype"), gup("numth"));
    });
}
function appendSurvey(data) {
    var surveyList = $('.list_table_ok > tbody:last-child');
    if (data.page == 1) {
        surveyList.empty();
    }
    appendSurveyList(surveyList, data);
}

function appendSurveyList(content, data) {
    ONPANEL.Ajax.Result.LoadingHide();
    var viewdata = data.program_data[0];
    var kang = viewdata.kang.slice(0, -1);
    kang = kang.split('|');
    var v_tab = $('.c_menu_tab2');
    v_tab.empty();
    var widt = 100 / (kang.length + 1);
    var classon = "";
    if (gup('numth') == 100 || gup('numth') == '') {
        classon = "class='on'";
    }
    var urls = "status_view_yeonsu_type2.html?pms_num=" + gup('pms_num') + '&type=100&numth=100' + '&btype=' + gup('btype');
    v_tab.append('<li style="width:' + widt + '%" onclick="javascript:location.href=\'' + urls + '\'" ' + classon + '>종합만족도</li>');
    var href =  'main_view_nyc.html?pms_num='+ gup('pms_num');
    $(".btn_view").attr('onclick', "location.href='" + href + "'").removeAttr('href');
    for (var i = 0; i < kang.length; i++) {
        var classon = "";
        if (gup('numth') == (i + 1)) {
            classon = "class='on'";
        }
        var urls = "status_view_yeonsu_type2.html?pms_num=" + gup('pms_num') + '&numth=' + (i + 1) + '&type=' + kang[i] + '&btype=' + gup('btype');
        v_tab.append('<li style="width:' + widt + '%" onclick="javascript:location.href=\'' + urls + '\'" ' + classon + '>' + kang[i].substring(0, 6) + '</li>');
    }

    var htmlArr = []
        ;
    if (data.survey_data.length == 0 && data.page <= 1) {
        $(".graph_div").empty();
        $(".graph_div").append('참여한 인원이 없습니다.');
        $(".padding_group").show();
        return false;
    }
    if (data.survey_ct.length > 0) {
        $(".padding_group").show();
    } else {
        $(".list_table_title").hide();
    }

    if (gup('numth') == 100 || gup('numth') == '') {

        $("#title1").html('응시여부');
        $("#title2").html('급수');
        $("#title3").html('성별');
        $("#title4").html('근무지');
        $("#title5").html('종사경력');
        $("#title6").html('연령');
        $("#title7").html('지역');
        for (var i = 0; i < data.survey_data.length; i++) {
            var survey = data.survey_data[i].muid;
            var survey_detail = data.survey_detail_data[survey];
            var status = survey_detail[0].select_text.slice(0, -1);

            var level = '1급';
            if (survey_detail[1].select_num == 1) {
                level = '1급';
            } else if (survey_detail[1].select_num == 2) {
                level = '2급';
            } else if (survey_detail[1].select_num == 3) {
                level = '3급';
            }

            var sexval = '남';
            if (survey_detail[2].select_num == 2) {
                sexval = '여';
            }

            var classval = '수련관';
            if (survey_detail[3].select_num == 1) {
                classval = '수련관';
            } else if (survey_detail[3].select_num == 2) {
                classval = '수련원';
            } else if (survey_detail[3].select_num == 3) {
                classval = '문화의집';
            } else if (survey_detail[3].select_num == 4) {
                classval = '청소년단체';
            } else if (survey_detail[3].select_num == 5) {
                classval = '공공기관';
            } else if (survey_detail[3].select_num == 6) {
                classval = '학교';
            } else if (survey_detail[3].select_num == 7) {
                classval = '기타';
            }
            if(status == '응시') {
                var years = '1년 미만';
                if (survey_detail[4].select_num == 1) {
                    years = '1년 미만';
                } else if (survey_detail[4].select_num == 2) {
                    years = '1~3년 미만';
                } else if (survey_detail[4].select_num == 3) {
                    years = '3~6년 미만';
                } else if (survey_detail[4].select_num == 4) {
                    years = '6~10년 미만';
                } else if (survey_detail[4].select_num == 5) {
                    years = '10년 이상';
                }

                var age = '20대 미만';
                if (survey_detail[5].select_num == 1) {
                    age = '20대 미만';
                } else if (survey_detail[5].select_num == 2) {
                    age = '30대';
                } else if (survey_detail[5].select_num == 3) {
                    age = '40대';
                } else if (survey_detail[5].select_num == 4) {
                    age = '50대';
                } else if (survey_detail[5].select_num == 5) {
                    age = '60대 이상';
                }

                var addr = '서울';
                if (survey_detail[6].select_num == 1) {
                    addr = '서울';
                } else if (survey_detail[6].select_num == 2) {
                    addr = '경기(인천)';
                } else if (survey_detail[6].select_num == 3) {
                    addr = '강원';
                } else if (survey_detail[6].select_num == 4) {
                    addr = '충북';
                } else if (survey_detail[6].select_num == 5) {
                    addr = '충남(대전)';
                } else if (survey_detail[6].select_num == 6) {
                    addr = '경북(대구)';
                } else if (survey_detail[6].select_num == 7) {
                    addr = '경남(부산,울산)';
                } else if (survey_detail[6].select_num == 8) {
                    addr = '전북';
                } else if (survey_detail[6].select_num == 9) {
                    addr = '전남(광주)';
                } else if (survey_detail[6].select_num == 10) {
                    addr = '제주';
                }
            }else{
                var years = '1년 미만';
                if (survey_detail[5].select_num == 1) {
                    years = '1년 미만';
                } else if (survey_detail[5].select_num == 2) {
                    years = '1~3년 미만';
                } else if (survey_detail[5].select_num == 3) {
                    years = '3~6년 미만';
                } else if (survey_detail[5].select_num == 4) {
                    years = '6~10년 미만';
                } else if (survey_detail[5].select_num == 5) {
                    years = '10년 이상';
                }

                var age = '20대 미만';
                if (survey_detail[6].select_num == 1) {
                    age = '20대 미만';
                } else if (survey_detail[6].select_num == 2) {
                    age = '30대';
                } else if (survey_detail[6].select_num == 3) {
                    age = '40대';
                } else if (survey_detail[6].select_num == 4) {
                    age = '50대';
                } else if (survey_detail[6].select_num == 5) {
                    age = '60대 이상';
                }

                var addr = '서울';
                if (survey_detail[7].select_num == 1) {
                    addr = '서울';
                } else if (survey_detail[7].select_num == 2) {
                    addr = '경기(인천)';
                } else if (survey_detail[7].select_num == 3) {
                    addr = '강원';
                } else if (survey_detail[7].select_num == 4) {
                    addr = '충북';
                } else if (survey_detail[7].select_num == 5) {
                    addr = '충남(대전)';
                } else if (survey_detail[7].select_num == 6) {
                    addr = '경북(대구)';
                } else if (survey_detail[7].select_num == 7) {
                    addr = '경남(부산,울산)';
                } else if (survey_detail[7].select_num == 8) {
                    addr = '전북';
                } else if (survey_detail[7].select_num == 9) {
                    addr = '전남(광주)';
                } else if (survey_detail[7].select_num == 10) {
                    addr = '제주';
                }
                status = status.slice(0, -1);
            }
            htmlArr.push('<tr id="' + (i + 1) + '" class="survey_tr">');
            htmlArr.push('            <td style="text-align: center;padding-right: 10px;">' + status + '</td>');
            htmlArr.push('                     <td>' + level + '</td>');
            htmlArr.push('                     <td>' + sexval + '</td>');
            htmlArr.push('                     <td>' + classval + '</td>');
            htmlArr.push('                     <td>' + years + '</td>');
            htmlArr.push('           <td>' + age + '</td>');
            htmlArr.push('           <td>' + addr + '</td>');

            htmlArr.push('</tr>');

            htmlArr.push('<tr class="survery_content" id="content' + (i + 1) + '" style="display: none;">');
            htmlArr.push('         <td colspan="7" class="on_content">');
            htmlArr.push('           <div><img src="images/img5.png">설문완료 : ' + survey_detail[2].regDate + '<a href="#" class="deleteNum" id="' + survey_detail[2].muid + '"><img src="images/btn_del.png">삭제</a></div>');
            htmlArr.push('         </td>');
            htmlArr.push('</tr>');
        }
    } else {
        $("#title1").html('응시여부');
        $("#title2").html('성별');
        $("#title3").html('소속기관');
        $("#title4").html('급수');
        $("#title5").html('종사경력');
        $("#title6").html('-');
        $("#title7").html('-');
        for (var i = 0; i < data.survey_data.length; i++) {
            var survey = data.survey_data[i].muid;
            var survey_detail = data.survey_detail_data[survey];
            var status = survey_detail[0].select_text.slice(0, -1);
            var sexval = '남';
            if (survey_detail[3].select_num == 2) {
                sexval = '여';
            }

            var classval = '수련관';
            if (survey_detail[4].select_num == 1) {
                classval = '수련관';
            } else if (survey_detail[4].select_num == 2) {
                classval = '수련원';
            } else if (survey_detail[4].select_num == 3) {
                classval = '문화의집';
            } else if (survey_detail[4].select_num == 4) {
                classval = '청소년단체';
            } else if (survey_detail[4].select_num == 5) {
                classval = '공공기관';
            } else if (survey_detail[4].select_num == 6) {
                classval = '학교';
            } else if (survey_detail[4].select_num == 7) {
                classval = '기타';
            }


            var level = '1급';
            if (survey_detail[5].select_num == 1) {
                level = '1급';
            } else if (survey_detail[5].select_num == 2) {
                level = '2급';
            } else if (survey_detail[5].select_num == 3) {
                level = '3급';
            }

            if(status == '응시생') {
                var years = '1년 미만';
                if (survey_detail[6].select_num == 1) {
                    years = '1년 미만';
                } else if (survey_detail[6].select_num == 2) {
                    years = '1~3년 미만';
                } else if (survey_detail[6].select_num == 3) {
                    years = '3~6년 미만';
                } else if (survey_detail[6].select_num == 4) {
                    years = '6~10년 미만';
                } else if (survey_detail[6].select_num == 5) {
                    years = '10년 이상';
                }
            }else{
                var years = '1년 미만';
                if (survey_detail[7].select_num == 1) {
                    years = '1년 미만';
                } else if (survey_detail[7].select_num == 2) {
                    years = '1~3년 미만';
                } else if (survey_detail[7].select_num == 3) {
                    years = '3~6년 미만';
                } else if (survey_detail[7].select_num == 4) {
                    years = '6~10년 미만';
                } else if (survey_detail[7].select_num == 5) {
                    years = '10년 이상';
                }
                status = status.slice(0, -1);
            }

            htmlArr.push('<tr id="' + (i + 1) + '" class="survey_tr">');
            htmlArr.push('            <td style="text-align: center;padding-right: 10px;">' + status + '</td>');
            htmlArr.push('           <td>' + sexval + '</td>');
            htmlArr.push('           <td>' + classval + '</td>');
            htmlArr.push('                     <td>' + level + '</td>');
            htmlArr.push('                     <td>' + years + '</td>');
            htmlArr.push('                     <td>-</td>');
            htmlArr.push('                     <td>-</td>');
            htmlArr.push('</tr>');

            htmlArr.push('<tr class="survery_content" id="content' + (i + 1) + '" style="display: none;">');
            htmlArr.push('         <td colspan="7" class="on_content">');
            htmlArr.push('           <div><img src="images/img5.png">설문완료 : ' + survey_detail[2].regDate + '<a href="#" class="deleteNum" id="' + survey_detail[2].muid + '"><img src="images/btn_del.png">삭제</a></div>');
            htmlArr.push('         </td>');
            htmlArr.push('</tr>');
        }
    }

    var nowjoinct = data.survey_ct.length;
    var totaljoinct = data.survey_join_ct[0].set_value;
    $(".graph_div span").empty();
    $(".graph_div span").append('(' + nowjoinct + '/' + totaljoinct + ')');
    $(".graph_num").empty();
    $(".graph_num").append((nowjoinct / totaljoinct * 100).toFixed(1) + '%');
    $(".graph_num").css('width', (nowjoinct / totaljoinct * 100).toFixed(1) + '%');

    if (data.survey_ct.length > 0) {
        content.append(htmlArr.join(""));
    }
}
