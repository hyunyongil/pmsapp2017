var metrics_domain = "";

/**
 * onpanel 설문 참여 관련된 처리를 위한 object
 * @create 2013-02-20
 * @author woogeun song
 */
function Join()
{
	/** @var json type 설문 설정 데이터(초기화 과정 필요) **/
	this.surveySeq = null; //view에서 설정한 설문seq
	this.imgUrl = null; //view에서 설정한 이미지 절대경로
	this.surveyData = []; //전체 설문 Json 데이터
	this.grpList = []; //grpSeq를 key로 갖는 그룹리스트
	this.grpListTmp = {}; //grpSeq를 key로 갖는 그룹리스트¡
	this.defaultGrpSeq = [];
	this.qstList = [];
	this.skinCode = null;
	this.skinUrl = null;
	this.cssUrl = null;
	this.joinData = {'grpList' : {}, 'nextGrpSeq' : {}, 'nextQstSeq' : {'1':0}, 'totalQstCnt' : 0, 'pageIndex':1, 'historyBack':{}};
	this.isMode = gup("isMode");
	this.maxRankCnt = {};
    this.askTypeCnt = {};
    this.sectionTypeCnt = {};
	this.totalQstCnt = 0;
	this.questionCnt = 0;
    this.checkSelectCnt=1;
    this.grpSeq=gup("grpSeq");
    this.qstSeq=gup("qstSeq");
    this.arrowType = "";
    this.surveyLinkId = "";


	/**
	 * 최초 view에서 호출하게 되는 함수
	 */
	this.init = function()
	{
        if(get_cookie("surveyLinkId_"+joinSurvey.surveySeq) != "" && get_cookie("surveyLinkId_"+joinSurvey.surveySeq) != "undefined") {
            joinSurvey.surveyLinkId = get_cookie("surveyLinkId_"+joinSurvey.surveySeq);
            $(".top_back_btn").hide();
        }

        console.log('surveyLinkId:' + joinSurvey.surveyLinkId);
        console.log(get_cookie("surveyLinkId_"+joinSurvey.surveySeq));

		this.getSurveyAjaxData();
	};

    this.qstTypeMapper = function(type) {
        var result = "";

        //console.log(type);

        if(type == "MULTI") {
            result = "객관식";
        }
        if(type == "OPEN") {
            result = "주관식";
        }
        if(type == "RANK") {
            result = "순위형";
        }
        if(type == "CONSTANTSUM") {
            result = "상수합";
        }
        if(type == "MATRIX") {
            result = "척도형";
        }
        if(type == "TABLE") {
            result = "테이블";
        }
        if(type == "TABLE2") {
            result = "테이블2";
        }
        if(type == "AHP") {
            result = "AHP";
        }

        return result;
    };

    this.gotoBack = function() {
        if(this.isMode != "") {
            return false;
        }


        try{
            document.addEventListener('deviceready', function() {
                navigator.notification.confirm("설문을 종료하시겠습니까?", function(index) {
                    if(index == 1) {
                        //location.href = "poll.html";
                        joinSurvey.closeLinkIdAction();
                    }
                }, '확인',"확인,취소");

            }, true);
        }
        catch(e) {
            if(confirm("설문을 종료하시겠습니까?")) {
                        //location.href = "poll.html";
                        joinSurvey.closeLinkIdAction();
            }
        }
    };

    /**
     * 설문 데이터 가져옴.
     */
    this.getSurveyAjaxData = function()
    {

        ONPANEL.Ajax.Request.invokePostByJSON(
            CONSTANTS.SURVEY.ABLE_JOIN_SURVEY
            , {
                surveySeq: joinSurvey.surveySeq
                , limit_type: joinSurvey.limit_type
                , isMode: joinSurvey.isMode
                , surveyLinkId : joinSurvey.surveyLinkId
            }
            , function (data) {

                //console.log(data);
                if(ONPANEL.Ajax.Result.isSucess(data)) {

                    if(data.result.link_tmpid != "") {
                        set_cookie("surveyLinkId_"+joinSurvey.surveySeq,data.result.link_tmpid,24*100);
                        location.reload();
                    }

                    joinSurvey.getSurveyData(data);
                }
                else {

                    alertLayer(data.resultMsg);

                    if(data.result.link_tmpid != "" && data.resultMsg == "이미 참여한 설문입니다.") {
                        joinSurvey.closeLinkIdAction();
                    }
                    else {
                        //location.href = "poll.html";
                        joinSurvey.closeLinkIdAction();
                    }
                }
            }
            , function (e,e2) {
                console.log(e);
                console.log(e2);
            }
            , true
        );
    };

    /**
	 * 전체 설문의 json data를 가져온다.
	 */
	this.getSurveyData = function(data)
	{
		var paramData = {
				'surveySeq' : this.surveySeq,
				'requestType' : 'TOTAL',
				'doAction' : 'surveyData'
				};


        joinSurvey.surveyData = data.result.jsonSurveyData;
        console.log(joinSurvey.surveyData);
		joinSurvey.grpList = joinSurvey.surveyData.grpList;

        if(typeof data.result.joinMyInfo != "undefined") {
            joinSurvey.joinData = data.result.joinMyInfo;
        }

		// 실제 설문진행1 2
		if(joinSurvey.isMode == '')
		{
			var orderList = [];
			var orderList2 = [];
			for( var i in joinSurvey.grpList ) //order값으로 정렬
			{
				orderList[joinSurvey.grpList[i].orderNum] = joinSurvey.grpList[i].grpSeq;
			}

			$.each(orderList,function(k,v){
				if(typeof v != "undefined"){
					var orderData = {
						grpSeq : joinSurvey.grpList[v].grpSeq
						, grpType : joinSurvey.grpList[v].grpType
					};

					orderList2.push(orderData);
				}
			});

			// orderNum 으로 정렬
			$.each(orderList2,function(k,v){
				var i = v.grpSeq
					, grpType = v.grpType
					;
				if( joinSurvey.defaultGrpSeq.length == 0 )
				{
					joinSurvey.joinData.nextGrpSeq[1] = i;
				}

				if( v.grpType == 1 ) { // level1 그룹을 배열로 만든다.
					joinSurvey.defaultGrpSeq.push( i );
				}

				joinSurvey.totalQstCnt = joinSurvey.totalQstCnt+joinSurvey.grpList[i].qstCnt;

				joinSurvey.grpListTmp[i] = {'qstList':{}};
				for(y in joinSurvey.grpList[i].qstList)
				{
					joinSurvey.grpListTmp[i].qstList[joinSurvey.grpList[i].qstList[y].qstSeq] = JSON.parse(JSON.stringify(joinSurvey.grpList[i].qstList[y]));
				}
			});


            if(joinSurvey.isMode == 'foreward')//isMode:미리보기, foreward->표지, body->내용, footer->종료
			{
				joinSurvey.loadForewardSkin();
			}
			else if(joinSurvey.isMode == 'body')
			{
				joinSurvey.loadBodySkin(1);
			}
			else if(joinSurvey.isMode == 'footer')
			{
				joinSurvey.loadFooterSkin();
			}
			else {
                joinSurvey.loadForewardSkin();
			}
		}
		else // 설문 미리보기
		{
            joinSurvey.surveyData = data.result.jsonSurveyData;
            joinSurvey.grpList = joinSurvey.surveyData.grpList;

            var orderList = [];
            var orderList2 = [];
            for( var i in joinSurvey.grpList ) //order값으로 정렬
            {
                orderList[joinSurvey.grpList[i].orderNum] = joinSurvey.grpList[i].grpSeq;
            }

            $.each(orderList,function(k,v){
                if(typeof v != "undefined"){

                    var orderData = {
                        grpSeq : joinSurvey.grpList[v].grpSeq
                        , grpType : joinSurvey.grpList[v].grpType
                    };

                    orderList2.push(orderData);
                }
            });

            // orderNum 으로 정렬
            $.each(orderList2,function(k,v){
                var i = v.grpSeq
                    , grpType = v.grpType
                    ;
                if( joinSurvey.defaultGrpSeq.length == 0 )
                {
                    joinSurvey.joinData.nextGrpSeq[1] = i;
                }

                if( v.grpType == 1 ) { // level1 그룹을 배열로 만든다.
                    joinSurvey.defaultGrpSeq.push( i );
                }

                joinSurvey.totalQstCnt = joinSurvey.totalQstCnt+joinSurvey.grpList[i].qstCnt;

                joinSurvey.grpListTmp[i] = {'qstList':{}};
                for(y in joinSurvey.grpList[i].qstList)
                {
                    joinSurvey.grpListTmp[i].qstList[joinSurvey.grpList[i].qstList[y].qstSeq] = JSON.parse(JSON.stringify(joinSurvey.grpList[i].qstList[y]));
                }
            });


            if(joinSurvey.isMode == 'foreward')
            {
                joinSurvey.loadForewardSkin();
            }
            else if(joinSurvey.isMode == 'body')
            {
                joinSurvey.loadBodySkin(1);
            }
            else if(joinSurvey.isMode == 'footer')
            {
                joinSurvey.loadFooterSkin();
            }
            else {
                joinSurvey.loadForewardSkin();
            }
		}

        joinSurvey.progress();
	};

	/**
	 * 설문의 참여 data를 가져온다.
	 */
	this.getJoinData = function(callback)
	{
		var paramData = {
				'surveySeq' : this.surveySeq,
				'limit_type' : this.limit_type,//비회원 테이블 분리 추가 -june// 0530
				'surveyLinkId' : this.surveyLinkId,//비회원 테이블 분리 추가 -june// 053
				'doAction' : 'myResponseData'
				};

		onpanel.setData( '/survey/surveyJoinActionNew', paramData, function(res){
			if(res.resultType == 'SUCCESS')
			{
				if(res.result != '')
				{
					joinSurvey.joinData = res.result;
				}
			}
			else
			{
				onpanel.printMsg(res.resultMsg);
				return false;
			}

			if(typeof callback === 'function')
			{
				callback();
			}
		});
	};

	/**
	 * 참여 data를 저장온다.
	 */
	this.setJoinData = function(flag,chPer, chPerQst,callback)
	{
		var paramData = {
				'surveySeq' : this.surveySeq,
				'limit_type' : this.limit_type,
				'surveyLinkId' : this.surveyLinkId,//비회원 테이블 분리 추가 -june// 053
				'doAction' : 'askData',
				'chPer' : chPer,
				'chPerQst' : chPerQst, 	                
				'askData' : joinSurvey.joinData
				};

		if(flag == 1) //종료
		{

            //console.log('flag 1');

			paramData['resSuccess'] = 'TRUE';

            ONPANEL.Ajax.Request.invokePostByJSON(
                CONSTANTS.SURVEY.ASK_DATA
                , paramData
                , function (res) {

                    console.log(res);
                    if(typeof callback === 'function')
                    {
                        if(res.result == "") {
                            res.result = 0;
                        }

                        //종료 문구
                        if(res.resultMsg=='LINK'){
                            var pointMsg='';
                        }
                        else {
                            var pointMsg='설문을 참여해주셔서 감사합니다. <br />총 '+res.result+' 포인트가 적립되었습니다.';
                        }

                        callback(pointMsg);
                    }
                }
                , function (e,e2) {
                
                    console.log(e);
                    console.log(e2);
                }
                , true
            );
		}
        else if(flag==2) { //중간종료
            console.log('flag 2');
			paramData['resSuccess'] = 'SECONDTRUE';

            ONPANEL.Ajax.Request.invokePostByJSON(
                CONSTANTS.SURVEY.ASK_DATA
                , paramData
                , function (res) {
                    console.log(res);
                    if(typeof callback === 'function')
                    {
                        if(res.result == "") {
                            res.result = 0;
                        }

                        //종료 문구
                        if(res.resultMsg=='LINK'){
                            var pointMsg='';
                        }else{
                            var pointMsg='설문을 참여해주셔서 감사합니다. <br />총 '+res.result+' 포인트가 적립되었습니다.';
                        }
                           // onpanel.printMsgNo('설문을 참여해주셔서 감사합니다. 총 '+res.result+' 포인트가 적립되었습니다.');
                        callback(pointMsg);
                    }
                }
                , function (e,e2) {
                    console.log(e);
                    console.log(e2);
                }
                , true
            );
        }
        else { //NEXT

            //console.log('next');
            //console.log(paramData);
            ONPANEL.Ajax.Request.invokePostByJSON(
                CONSTANTS.SURVEY.ASK_DATA
                , paramData
                , function (res) {
                    if(typeof callback === 'function')
                    {
                        callback();
                    }
                }
                , function (e,e2) {
                    console.log(e);
                    console.log(e2);
                }
                , true
            );
        }
	};

	/**
	 * 표지 스킨 로드
	 */
	this.loadForewardSkin = function()
	{
		//$('body').html(''); //body영역을 초기화 한다.

        $page = $('#pollJoinCover').addClass(joinSurvey.surveyData.layoutDataMobile.template_cover);


        //$header = $page.children( ":jqmData(role=header)" );
        //$content = $page.children( ":jqmData(role=content_poll)" );

        //var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/"+joinSurvey.surveyData.layoutDataMobile.template_cover+".jpg";
        var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/style1_bg.jpg";

        //$("#pollJoin").css("background-image",'url('+bg_url+')');

		// 표지 사용할경우
		if (joinSurvey.surveyData.layoutDataMobile.template_cover_yn == "Y" || joinSurvey.surveyData.layoutDataMobile.template_cover_yn == "N")
		{
			var foreward_html_h = [],foreward_html_c = []
				;

			// 로고 사용 여부
			//foreward_html_h.push('		<div style="position:absolute;top:15px;right:15px"> 1/20 </div>');
            //contents

            foreward_html_c.push('<div class="cover_template_div">');

            if(joinSurvey.surveyData.layoutDataMobile.common_logo_yn == "Y") {

                if(joinSurvey.surveyData.layoutDataMobile.common_logo_user_path == "") {
                    foreward_html_c.push('    <div class="logo_img '+joinSurvey.surveyData.layoutDataMobile.common_logo_position+'"><img src="'+CONNECTION_URL+'/page/onmetrics/design_set/skin/images/logo.gif" /></div>');
                }
                else {
                    foreward_html_c.push('    <div class="logo_img '+joinSurvey.surveyData.layoutDataMobile.common_logo_position+'"><img src="'+FILES_URL+joinSurvey.surveyData.layoutDataMobile.common_logo_user_path+'" style="max-width:120px;max-height:40px;" /></div>');
                }
            }

            foreward_html_c.push('    <div class="cover_group_div">');

            if(joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path2 != "" && joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path2 != null && joinSurvey.surveyData.layoutDataMobile.template_cover == "") {
                foreward_html_c.push('    <img src="'+FILES_URL+joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path2+'" style="max-width:100%;max-height:100%;" />');
            }else if(joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path != "" && joinSurvey.surveyData.layoutDataMobile.template_cover == "") {
                foreward_html_c.push('    <img src="'+FILES_URL+joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path+'" style="max-width:100%;max-height:100%;" />');
            }
            else {
                if(joinSurvey.surveyData.layoutDataMobile.cover_title_text_yn == "Y") {
                    foreward_html_c.push('        <h1 style="color:#ffffff; font-weight:bold; font-size:16px;">'+joinSurvey.surveyData.layoutDataMobile.cover_title_text+'</h1>');
                }
                if(joinSurvey.surveyData.layoutDataMobile.cover_content_text_yn == "Y") {
                    foreward_html_c.push('        <div class="cover_content">');
                    foreward_html_c.push('            ' + joinSurvey.surveyData.layoutDataMobile.cover_content_text + '');
                    foreward_html_c.push('        </div>');
                }
            }
            foreward_html_c.push('    </div>');
            foreward_html_c.push('</div>');

            var radius_class = "";
            if(joinSurvey.surveyData.layoutDataMobile.common_button_type.indexOf("n02_") > -1) {
                radius_class = "div_btn_radius";
            }

            try {
				if (iframe_yn == "Y")
				{
					foreward_html_c.push('<div class="div_btn btn_blue '+radius_class+'"><a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'">설문참여</a></div>');
				}
				else {
                    foreward_html_c.push('<div class="div_btn btn_blue '+radius_class+'"><a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="javascript:joinSurvey.loadBodySkin(1);">설문참여</a></div>');
				}
			}
			catch(e) {
                foreward_html_c.push('<div class="div_btn btn_blue '+radius_class+'"><a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="javascript:joinSurvey.loadBodySkin(1);">설문참여</a></div>');
					//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);"><button type="submit" >설문시작3</button></a>');
					//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" >설문시작</a>');
			}




			//foreward_html_c.push('	<div class="cover_title_text '+joinSurvey.surveyData.layoutDataMobile.template_cover+'">'+joinSurvey.surveyData.layoutDataMobile.cover_title_text+'</div>');
			////foreward_html_c.push('	<button type="submit" data-theme="b" style="cursor:default">'+joinSurvey.surveyData.layoutDataMobile.cover_title_text+'</button>');
            //
             //
			//// 이미지 업로드
			//if (joinSurvey.surveyData.layoutDataMobile.group_cover_bg == "style_06" && joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path)
			//{
            //
			//     foreward_html_c.push('	<div class="point_view_img"></div>');
			//}
			//else {
			//     foreward_html_c.push('	<div class="point_view_img"></div>');
			//}
			//     foreward_html_c.push('	<div class="poll_disc"></div>');
            //
            ////contents-title
			//foreward_html_c.push('	<ul data-role="listview" data-inset="true" style="margin-bottom:30px;">');
             //
            //
			//foreward_html_c.push('	<li style=" background:#FFF; padding:0px; position:relative; padding:15px">'+joinSurvey.surveyData.layoutDataMobile.cover_content_text+'</li>');
			//foreward_html_c.push('	</ul>');
             //
            ///////button
             //
			//foreward_html_c.push('	<div class="poll_bottom_btn">');
			////foreward_html_c.push('	<fieldset class="ui-grid-b">');
			////foreward_html_c.push('	<div class="ui-block-a"></div>');
			////foreward_html_c.push('	<div class="ui-block-b">');
            //
			//try {
			//	if (iframe_yn == "Y")
			//	{
			//		foreward_html_c.push('			<a href="javascript:;" class="n01_box_btn1" >설문시작</a>');
			//	}
			//	else {
			//		//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);"><button type="submit" data-theme="b">설문시작2</button></a>');
             //       foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);" class="n01_box_btn1" >설문시작</a>');
			//	}
			//}
			//catch(e) {
			//		//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);"><button type="submit" >설문시작3</button></a>');
			//		foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" >설문시작</a>');
			//}
            //
            //
			////foreward_html_c.push('	</div>');
			////foreward_html_c.push('	</fieldset>');
			//foreward_html_c.push('	</div>');
            ///////button
			//foreward_html_c.push('	</div>');
            //contents

			//page

            //$header.find( "h1" ).html( category.name );
            //$header.html( foreward_html_h.join("") );

            $page.html( foreward_html_c.join("")).show();

            //$page.header("refresh");
            //$page.content("refresh");
            //$page.page('refresh');
            //$.mobile.changePage($page);
            //$page.trigger('pagecreate');
            //$('#pollJoin').page().page("refresh");
            //$page.page();
            //$('#pollJoin').page('refresh');
		}
		else {

			joinSurvey.loadBodySkin(1);

		}
	};

	/**
	 * 종료 스킨 로드
	 */
    this.loadFooterSkin = function (pointMsg) {
        var body_html = []
            ;

        $page = $('#pollJoinEnd');

        if (pointMsg != undefined && pointMsg != '') {
            var pointMsgData = pointMsg;

        } else {

            var pointMsgData = '설문에 참여해주셔서 감사합니다.';
        }


        body_html.push('<br>    <div style="background:#fff;"><div class="end_template_div" style="padding-top:10px;">');
        body_html.push('    	<div><a  href="javascript:;" onclick="location.reload();"><img src="images/m_img/m_endimg1.jpg" align="absmiddle" style="width:100%;"></a></div>');
        body_html.push('        <p>'+pointMsgData+'</p>');
        body_html.push('    </div>');


        if (joinSurvey.isMode == "")
        {
            // 리스트조사 설문
            if(joinSurvey.surveyLinkId != "") {
                body_html.push('    <div class="div_btn btn_blue div_btn_radius"><a href="javascript:;" onclick="joinSurvey.closeLinkIdAction();">참여완료</a></div> ');
            }
            else {
                //body_html.push('    <div class="div_btn btn_blue div_btn_radius"><a href="poll.html" >참여완료</a></div> ');
                body_html.push('    <div class="div_btn btn_blue div_btn_radius"><a href="javascript:;" onclick="joinSurvey.closeLinkIdAction();">참여완료</a></div> ');
            }
        }
        else {
            body_html.push('    <div class="div_btn btn_blue div_btn_radius"><a href="javascript:;" onclick="location.reload();" >참여완료</a></div> ');
        }


        $('#pollJoin').hide();
        $page.html( body_html.join("")).show();


        //$content.html(body_html.join(""));

        //$page.page('refresh');
        //$.mobile.changePage($page);
        //$page.trigger('pagecreate');
	};

    this.closeLinkIdAction = function() {
        try{
            if(navigator.appVersion.indexOf("MSIE 6.0")>=0) {
               parent.window.close();
            }else {
               parent.window.open('about:blank','_self').close();
            }
        }
        catch(e) { }
    };

	/**
	 * 종료 스킨 로드
	 */
	this.loadFooterSkinOrg = function(pointMsg)
	{
		var body_html = []
			;
        $page = $('#pollJoin');

        $header = $page.children( ":jqmData(role=header)" );
        $content = $page.children( ":jqmData(role=content_poll)" );
		//	$('body').html(''); //body영역을 초기화 한다.

        if(pointMsg != undefined && pointMsg !='')
        {
            var pointMsgData=pointMsg;

        }else{

            var pointMsgData='응답이 완료되었습니다.<br>설문에 참여해 주셔서 감사합니다.';
        }

		//$('body').html(''); //body영역을 초기화 한다.


        ///////header



			// 로고 사용 여부

			// 진행바 사용여부

        ///////header
        ///////content
        ///////content-top


			if (joinSurvey.surveyData.layoutDataMobile.group_body_bg == "style_06")
			{
                body_html.push('    <div class="poll_quest center_content"></div>');
			}
			else {
                //body_html.push('<div id="body_container" class="'+joinSurvey.surveyData.layoutDataMobile.body_bg+'">');
                body_html.push('    <div class="poll_quest center_content"></div>');
            }

                body_html.push('    <div class="poll_a_list "  id="content_article">');

                //contents-title
    			body_html.push('	<ul data-role="listview" data-inset="true" style="margin-bottom:30px;">');

        		body_html.push('	<li style=" background:#FFF; padding:0px; position:relative;">');
    			body_html.push('	<div class="poll_end">'+pointMsgData+'</div>');
        		body_html.push('	<div class="box_bottom_right"><span class="box_bottom_left"></span></div>');
        		body_html.push('	</li>');
    			body_html.push('	</ul>');
                body_html.push('	</div>');
        ///////content-bottom
                body_html.push('    <div class="poll_bottom_btn">');
			    body_html.push('	    <fieldset class="ui-grid-b">');
    		if (joinSurvey.isMode == "")
    		{
                    //body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="location.href=\'poll.html\';"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');
		    body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="joinSurvey.closeLinkIdAction();"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');
    		}
    		else {
                    //body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="location.href=\'poll.html\';"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');
		    body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="joinSurvey.closeLinkIdAction();"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');

            }
                    body_html.push('	</fieldset>');
			    body_html.push('	</div>');



        ///////content
        ///////footer




        ///////footer
           // body_html.push('</div>');
        ///////page
//console.log(body_html);

            $content.html( body_html.join("") );

            //$page.page('refresh');
            $.mobile.changePage($page);
            $page.trigger('pagecreate');



	};

	/**
	 * 본문 스킨 로드
	 */
	this.loadBodySkin = function(flag,pointMsg)
	{
	   //console.log(flag)

        console.log(joinSurvey.surveyData.layoutDataMobile.group_cover_bg);
        console.log(joinSurvey.surveyData.layoutDataMobile.body_bg_css);
        console.log(joinSurvey.surveyData.layoutDataMobile.body_bg);
        if(joinSurvey.surveyData.layoutDataMobile.group_body_bg == "style_07") {
            //var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/"+joinSurvey.surveyData.layoutDataMobile.body_bg+".jpg";
            var bg_color = joinSurvey.surveyData.layoutDataMobile.body_bg.replace("background-color: ","").replace(";","");
            console.log(bg_color);
            $("#pollJoin").css({"background-color":bg_color});
        }
        else {
            $("#pollJoin").addClass(joinSurvey.surveyData.layoutDataMobile.body_bg_css);
        }

        //$page = $('#pollJoinCover').addClass(joinSurvey.surveyData.layoutDataMobile.template_cover);

        //$("#pollJoin").css("background-image",'url('+bg_url+')');

        //console.log('load cover');

		if(flag == 1)
		{
			var body_html = []
				;
            $page = $('#pollJoin');

			$page.html(''); //body영역을 초기화 한다.

            var radius_class = "";
            if(joinSurvey.surveyData.layoutDataMobile.common_button_type.indexOf("n02_") > -1) {
                radius_class = "div_btn_radius";
            }

            body_html.push('<div class="pro_box" id="progress_bar" style="'+joinSurvey.surveyData.layoutDataMobile.body_progress_style+'"></div>');
            body_html.push('<div class="box_content">');
            body_html.push('    <div id="content_article">');
            body_html.push('        ');
            body_html.push('    </div>');
            body_html.push('</div>');
            body_html.push('<!--템플릿 레이아웃 종료-->');

            if(joinSurvey.grpSeq == "") {
                body_html.push('<div class="div_btn btn_blue '+radius_class+' poll_bottom_btn poll_nav_btn">');
                body_html.push('    <a href="#" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="joinSurvey.prevPage();">이전</a>');
                body_html.push('    <a href="#" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="joinSurvey.prevPage(\'reset\');">새로고침</a>');
                body_html.push('    <a href="#" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="joinSurvey.nextPage();">다음</a>');
                body_html.push('</div>');
            }

            $("#pollJoinCover").hide();

            $page.html(body_html.join("")).show();

            //$page.page('refresh');
            //$.mobile.changePage($page);
            //$page.trigger('pagecreate');
            //$page.page('refresh');
			//joinSurvey.progress();
			joinSurvey.drowSurvey();//실제로 문항생성

		}
		else
		{

			//joinSurvey.progress(); //본문 진행바 처리
  			joinSurvey.drowSurvey(pointMsg);
		}

        joinSurvey.progress();
	};

	/**
	 * 설문 그림
	 */
	this.drowSurvey = function(pointMsg)
	{

        if(joinSurvey.grpSeq == "") {
		    var grpSeq = joinSurvey.defaultGrpSeq[0];
        }
        else {
		    var grpSeq = joinSurvey.grpSeq;
        }

		var startQstSeq = 0;
		var isBreak = 0;
		var qstObj = '';
		var joinData = joinSurvey.joinData;

		if(joinData.grpList[grpSeq] != undefined)
		{
			if(joinData.nextGrpSeq[joinData.pageIndex] != undefined)
			{
				grpSeq = joinData.nextGrpSeq[joinData.pageIndex];
				startQstSeq = joinData.nextQstSeq[joinData.pageIndex];

				//설문 참여종료처리
				if( startQstSeq == 'END' )
				{
					joinSurvey.loadFooterSkin(pointMsg);
					return false;
				}
                else if(startQstSeq == 'TEND')//JUNE-2014.0714
                {
					joinSurvey.loadFooterSkin(pointMsg);
					return false;
                }
			}
		}

		$('#content_article').html('');

        console.log("arrowType : " + joinSurvey.arrowType);
        console.log("joinData.pageIndex : " + joinData.pageIndex);
        console.log("joinSurvey.joinData.totalQstCnt : " + joinSurvey.joinData.totalQstCnt);

		if( joinSurvey.joinData.totalQstCnt > 0 )
		{
            console.log('if-1');
			if( joinSurvey.joinData.totalQstCnt == 1 )
			{
                console.log('if-2');
				if( joinData.pageIndex == 1 ) {
                    console.log('if-3');
                    joinSurvey.questionCnt = 0;
				} else {
                    console.log('if-4');
                    joinSurvey.questionCnt = joinSurvey.joinData.totalQstCnt;
				}
			}
			else
			{
                console.log('if-5');
				if( joinData.pageIndex == 1 ) {
                    console.log('if-6');

					joinSurvey.questionCnt = 0;
				} else {
                    console.log('if-7');
					joinSurvey.questionCnt = joinSurvey.joinData.totalQstCnt;

                    if(joinSurvey.arrowType == "prev") {
                        joinSurvey.questionCnt--;
                    }
				}
            }

		}
		else {

            console.log('if-8');

			// @bug 수정됨.
			// 문항 카운트 초기화
			joinSurvey.questionCnt = 0;
		}



        if(joinSurvey.qstSeq != "") {
            startQstSeq = parseInt(joinSurvey.qstSeq) - 1;

            $.each(joinSurvey.grpList[grpSeq].qstList,function(k,v){
                if(v.qstSeq == joinSurvey.qstSeq) {
                    startQstSeq = k;
                }
            });

        }

        //var totalQstLength = parseInt(joinSurvey.grpList[grpSeq].qstList.length)+parseInt(startQstSeq);
        var totalQstLength = parseInt(joinSurvey.grpList[grpSeq].qstList.length);

		for(var i=startQstSeq; i<totalQstLength; i++)
		{
            var qstInfo = joinSurvey.grpList[grpSeq].qstList[i];

			if(qstInfo.qstType == 'PAGEBREAK') //페이지 브레이크 일 경우 종료
			{
				isBreak = 1;
				break;
			}

			joinSurvey.questionCnt++;
			//qstObj = joinSurvey.drowQuestion(qstInfo, qstInfo.qstSeq, joinSurvey.questionCnt);
			qstObj = joinSurvey.drowQuestion(qstInfo, i, joinSurvey.questionCnt);

			$('#content_article').append(qstObj);
            if(qstObj){
                
                $(".SliderSingle").slider({
                    callback: function (value) {
                        var $this = this;
                        setTimeout(function () {
                            var $check_radios = $("input[name='" + $this.settings.item + "']");
                            $check_radios.prop("checked", false);
                            $.each($check_radios, function (k, v) {
                                if ($(this).val() == value) {
                                    $(this).prop("checked", true);
    
                                    joinSurvey.resultAsk(qstInfo, '', $(this));
                                    //console.log($(this).val());
                                }
                            });
                            //console.log($("input[name='"+$this.settings.item+"']"));
    
                        }, 500);  
    
                        return false;
                    }
                });
            }


            $('#pollJoin').trigger('pagecreate');
			//alertLayer(qstInfo.isItemLink);
			if(qstInfo.isItemLink == 1) //연결 옵션이 있을 경우 종료
			{
				isBreak = 1;
				break;
			}

            isBreak = 1;
			break;
		}
	};

	/**
	 * 문항 그림
	 * @param qstInfo:문항정보, qstIndex:문항순번, seq:그려진 순서
	 */
	this.drowQuestion = function(qstInfo, qstIndex, seq)
	{
        console.log("drowQuestion : " + seq);
        console.log("qstInfo.qstSeq : " + qstInfo.qstSeq);

		//alertLayer(JSON.stringify(joinSurvey.joinData));
		var returnObj = DOM.getDiv('question group', 'qstInfo_'+qstInfo.grpSeq+'_'+qstInfo.qstSeq).attr({'grpSeq':qstInfo.grpSeq, 'qstIndex':qstIndex}).append(
				function()
				{
					var prevQstVal = [];

					if(qstInfo.qstOptionList['PREVQST'].optionValue == 'CHECKED') //답변받기 옵션이 체크되어 있는지 확인
					{
						var subOptionValTmp = qstInfo.qstOptionList['PREVQST'].subOptionValue.split('_');

						if( joinSurvey.grpListTmp[subOptionValTmp[0]] != undefined )
						{
							if( joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]] != undefined )
							{
								if(joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]].qstType == 'MULTI') //답변 받기는 객관식만 가능
								{
									if(joinSurvey.joinData.grpList[subOptionValTmp[0]] != undefined)
									{
										if(joinSurvey.joinData.grpList[subOptionValTmp[0]].qstList[subOptionValTmp[1]] != undefined)
										{
											var prevQstListTmp = joinSurvey.joinData.grpList[subOptionValTmp[0]].qstList[subOptionValTmp[1]];
											for(var i in prevQstListTmp.askList) //답변 리스트
											{
												for( var j in joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]].itemList ) //실제 item 리스트
												{
													if( joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]].itemList[j].itemSeq == prevQstListTmp.askList[i].itemSeq )
													{
                                                        console.log(joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]].itemList[j].itemTitle);
														prevQstVal.push(joinSurvey.grpListTmp[subOptionValTmp[0]].qstList[subOptionValTmp[1]].itemList[j].itemTitle);
													}
												}
											}
										}
									}
								}
							}
						}

						$(this).append(
							DOM.getDiv('poll_quest').attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_title+";"+joinSurvey.surveyData.layoutDataMobile.body_title_bg+";color:#ffffff;").html('Q'+seq+' '+qstInfo.qstComment).append(
								function()
								{
									if($(this).html().indexOf('[답변]') != -1)
									{
										$(this).html(qstInfo.qstComment.replace('[답변]', '<span class="'+qstInfo.qstOptionList['PREVQST'].subOptionValue+'">'+prevQstVal.join(',')+'</span>'));
									}
									else
									{
										$(this).html().find('.'+qstInfo.qstOptionList['PREVQST'].subOptionValue+':first').html(prevQstVal);
									}
								}
							)
						);
					}
					else
					{
                        var title_img_wrap = "";
                        if (qstInfo.qstCommentImg != undefined && joinSurvey.htmlChecker(qstInfo.qstCommentImg))
                        {
                            title_img_wrap = '<div class="title_img">';
                            title_img_wrap += qstInfo.qstCommentImg;
                            title_img_wrap += '</div>';
                        }

                        console.log(qstInfo);
						if (joinSurvey.htmlChecker(qstInfo.qstComment))
						{
                            // qstInfo.qstSeq
                            $(this).append(DOM.getDiv('poll_quest').attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_title+";"+joinSurvey.surveyData.layoutDataMobile.body_title_bg+";color:#ffffff;").html('<h1><div class="no_class">Q'+seq+'</div><div class="muhang_youheng">'+joinSurvey.qstTypeMapper(qstInfo.qstType)+'</div> <span style="'+joinSurvey.surveyData.layoutDataMobile.body_font_title+'">'+qstInfo.qstComment+'</span></h1>'+title_img_wrap));
							//$(this).append(DOM.getDiv('poll_quest').html('Q'+seq+' '+qstInfo.qstComment));
						}
						else {
                            // qstInfo.qstSeq
                            //<div class="title_img"><img src="../images/1231321.jpg"></div>
							$(this).append(DOM.getDiv('poll_quest').attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_title+";"+joinSurvey.surveyData.layoutDataMobile.body_title_bg+";color:#ffffff;").html('<h1><div class="no_class">Q'+seq+'</div><div class="muhang_youheng">'+joinSurvey.qstTypeMapper(qstInfo.qstType)+'</div> <span style="'+joinSurvey.surveyData.layoutDataMobile.body_font_title+'">'+qstInfo.qstComment+'</span></h1>'+title_img_wrap));
							//$(this).append(DOM.getDiv('poll_quest').html('Q'+seq+' '+qstInfo.qstComment).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_title));
						}
					}
				}

		).append(//질문 이미지/동영상 그리기

            //function()
            //{
				//if (qstInfo.qstCommentImg != undefined && joinSurvey.htmlChecker(qstInfo.qstCommentImg))
				//{
				//
            //
				//   // console.log(qstInfo.qstCommentImg);
            //
            //        $(this).append(DOM.getDiv('poll_quest_sub').addClass('query_text_border_img').html(qstInfo.qstCommentImg));
				//}
            //
            //}
		).append(///답변 그리기
			DOM.getDiv('poll_a_list').append(
				function()
				{
					if(qstInfo.qstType == 'MULTI' || qstInfo.qstType == 'RANK') //기본형태
					{
						if(qstInfo.qstOptionList['ALIGN'].optionValue == 'ROW') {
							$(this).append(joinSurvey.prevDefaultRow(qstInfo)); //기본형 세로 정렬 미리보기
						}
						else if(qstInfo.qstOptionList['ALIGN'].optionValue == 'COL') {
                            $(this).append(joinSurvey.prevDefaultRow(qstInfo)); //기본형 세로 정렬 미리보기//$(this).append(joinSurvey.prevDefaultCol(qstInfo)); //기본형 가로 정렬 미리보기
						}
					}
					else if(qstInfo.qstType == 'OPEN')
					{
						$(this).append(joinSurvey.prevOpen(qstInfo));
					}
					else if(qstInfo.qstType == 'CONSTANTSUM')
					{
						$(this).append(joinSurvey.prevConstantsum(qstInfo));
					}
					else if(qstInfo.qstType == 'MATRIX')
					{
						$(this).append(joinSurvey.prevMatrix(qstInfo));
					}
					else if(qstInfo.qstType == 'TABLE')
					{
						$(this).append(joinSurvey.prevTableOne(qstInfo));
					}
					else if(qstInfo.qstType == 'TABLE2')
					{
						$(this).append(joinSurvey.prevTable(qstInfo));
					}
					else if(qstInfo.qstType == 'AHP')
					{
						$(this).append(joinSurvey.prevAhp(qstInfo));
					}


                    $('#poll_a_list').trigger('create');

				}
			)
		).append(
			DOM.getDiv().css({'height':'15px'})
		);

		return returnObj;
	};

	/**
	 * 진행바 처리
	 */
	this.progress = function()
	{
		var per = 0;

		if( joinSurvey.surveyData.pageCnt == 1 )
		{
			if(joinSurvey.joinData.totalQstCnt > 0)
			{
				per = Math.round(joinSurvey.joinData.totalQstCnt/joinSurvey.totalQstCnt*100);
			}
		}
		else
		{

			if(joinSurvey.surveyData.pageCnt > 0)
			{
				per = Math.round(joinSurvey.joinData.pageIndex/joinSurvey.surveyData.currentCnt*100);
			}
		}

        if(joinSurvey.surveyData.layoutDataMobile.body_progress_type_yn == "Y") {
            //$("#progress_bar").text(joinSurvey.joinData.pageIndex+"/"+joinSurvey.totalQstCnt);
			$("#progress_bar").html('<div class="'+joinSurvey.surveyData.layoutDataMobile.body_progress_type+'"><div class="pro_bg"><div class="pro" style="width: '+per+'%;"></div></div><div class="pro_text">'+per+'%</div></div>');
        }

		//$('.progress .pro').css({"width":per+"%"});
		//$('.progress .pro_text').text(per+"%");
		//$('.progress .pro_time strong').text("남은시간: "+this.getItemTime((joinSurvey.totalQstCnt-joinSurvey.joinData.totalQstCnt)*2));

	};

	/**
	 * 기본형 세로
	 */
	this.prevDefaultRow = function(qstInfo)
	{
	   
        if(joinSurvey.askTypeCnt == undefined)
        {
            joinSurvey.askTypeCnt = {};
        
        }else{
            delete  joinSurvey.askTypeCnt;
            joinSurvey.askTypeCnt = {};
        }
       
		var returnObj =
			$( '<table>' ).attr( { 'width':'100%', 'border':'0', 'cellspacing':'0', 'cellpadding':'0' } ).addClass( 'giben_table' ).append(
					$( '<tbody>' ).append(
							function()
							{
								var lastItem = end(qstInfo.itemList);
								var itemList = JSON.parse(JSON.stringify(qstInfo.itemList));
								var randVal = qstInfo.qstOptionList['RANDITEM'].optionValue;
								var randLastVal = qstInfo.qstOptionList['RANDITEM'].subOptionValue;

								if(randVal == 'CHECKED')
									shuffle(itemList);
console.log(itemList);	
								for(var i in itemList)
								{
									if(itemList[i] != '')
									{
										if(itemList[i] != null)
										{
										  
                                            lastItem.itemSeq = parseInt(lastItem.itemSeq);
                                            itemList[i].itemSeq = parseInt(itemList[i].itemSeq);
											if(randLastVal == 'CHECKED')
											{
console.log('itemSeq');
console.log(itemList[i].itemSeq);
console.log('lastItem');
console.log(lastItem.itemSeq);											 
												if(itemList[i].itemSeq == lastItem.itemSeq){
												    var lastItemIndex = i;
													continue;
												}

											}
											$(this).append(
													$( '<tr>' ).click(function() {
                                                        $(this).find('input:first').click();
                                                    }).append(
                                                        function() {

                                                            if (qstInfo.qstType == 'RANK') {
                                                                $(this).append(DOM.getTd().addClass("sun_bg").append(function () {
                                                                    $(this).append(
                                                                        DOM.getDiv('poll_list_num')
                                                                            .append(
                                                                            DOM.getSpan('poll_list_num_span rankCnt' + qstInfo.qstSeq, 'span' + itemList[i].itemSeq).html('').append(

                                                                                function()
                                                                                {
                                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                                                    {
                                                                                        if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                                                        {
                                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
                                                                                            {
                                                                                                $(this).append(
                                                                                                        $( '<span>' ).text( joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse )
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }

                                                                                // function () {
                                                                                //     console.log('randval prev 2');
                                                                                //     if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                //         if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                //             if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined) {
                                                                                //                 //alertLayer(1)
                                                                                //                 //console.log('prev=>'+joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse)
                                                                                //                 //$(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                                                                                //                 // $(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                                                                                //             }
                                                                                //         }
                                                                                //     }
                                                                                // }
                                                                            )//poll_list_num_span
                                                                        )//poll_list_num
                                                                    );
                                                                }));
                                                            }

                                                            $(this).append(DOM.getTd().append(
                                                                function () {
                                                                    $(this).append(
																	$( '<div>' ).addClass( 'buogi_div' ).append(
																			function()
																			{
																				if(qstInfo.qstType == 'MULTI')
																				{
																				    
                                                                                    


																				                                                                                               
                                                                                    
																					if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택 처리
																					{
																						$(this).append(
																								$( '<input>' ).attr( { 'type' : 'checkbox', 'itemIndex':i } ).val( itemList[i].itemSeq )
                                                                                                //.change(function(){
																								//답변처리
                                                                                                
																								//	joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
																								//})
                                                                                                .append(function(){
                                                                                                    ///////체크가능 갯수 -  갯수
                                                                                                    if(joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined)
																									{
																										joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
                                                                                                        
																									}
																									if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																									{
																										if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																										{
																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
                                                                                                            {
                                                                                                                ///////체크가능 갯수 -  갯수
                                                                                                                
            																									joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;
            																									
                                                                                                                $(this).prop('checked', true);
                                                                                                            }
																											
																										}
																									}
                                                                                                    
                                                                                                    console.log('cnt0011:');
																									console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    
																								}).click( function(e){
																									e.stopPropagation();


                                                                                                    ///////체크가능 갯수 -  갯수
                                                                                                    if(joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined)
																									{
																										joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
																									}

																									if(this.checked){//checked 처리된 항목의 값

                                                                                                       // alert(this.value);
                                                                                                       joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;

                                                                                                    }else{
                                                                                                       joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                                                    }
                                                                                                    console.log('cnt00:');
																									console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    console.log(qstInfo.qstSeq);



                                                                            						if(qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                            						{
                                                                            							var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                                                                                                        //var maxAsk = joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt;
                                                                            							if(subOptionValTmp[1] < joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt)
                                                                            							{
                                                                            							 console.log('현재:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                            //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                            joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                            								alertLayer(' '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                                            $(this).prop('checked', false);
                                                                            								console.log('마이너스:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                            								return false;

                                                                            							}else{
                                                                            							 joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
                                                                            							}

                                                                            						}else{
                                                                            						  
                                                                                                      joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
                                                                            						}

										                                                            ///////체크가능 갯수 -  갯수


																								} ).trigger('change')
																						);
                                                                                        
                                                                                        
                                                                                        /////ETC 입력박스
    																					$( this ).append( $( '<span>' ).addClass( 'text_text_margin_right' ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append( joinSurvey.qstCommentChecker(itemList[i].itemTitle) ) ).append(
    																							function()
    																							{
    																								if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')
    																								{
    																									$(this).append(
    																										$( '<input>' ).attr( { 'type':'text' } ).css({'margin-left':'10px', 'margin-top':'5px'}).click(function(e){
    																											e.stopPropagation();
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																											 
                                                                                                                 
                                                                                                                    ///////체크가능 갯수 -  갯수
                                                                                                                    if(joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined)
                																									{
                																										joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
                																									}
                                                                                                                    
                                                                                                                    if($(this).parent().find('input:first').prop('checked')){
                                                                                                                        console.log('checked:');
                                                                                                                    }else{
                                                                                                                        $(this).parent().find('input:first').prop('checked', true);
                                                                                                                        joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;
                                                                                                                        console.log('first:');
                                                                                                                        console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                        
                                                                                                    						if(qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                                                    						{
                                                                                                    							var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                                                                                                                                //var maxAsk = joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt;
                                                                                                    							if(subOptionValTmp[1] < joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt)
                                                                                                    							{
                                                                                                    							 console.log('현재:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                                                    joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                                                    								alertLayer(' '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                                                                    $(this).parent().find('input:first').prop('checked', false);
                                                                                                    								console.log('마이너스:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    								return false;
                        
                                                                                                    							}
                        
                                                                                                    						}                                                                                                                        
                                                                                                                    }
                                                                                                                    
                																								
                                                                                                                    
                
                                                                                                                    
                                                                                                                    console.log('cnt00:');
                																									console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                                    console.log(qstInfo.qstSeq);
                
                

                
                										                                                            ///////체크가능 갯수 -  갯수                                                                                                                 
                                                                                            
    																												$(this).parent().find('input:first').change();
            																											//추가
                                                                                                                        if (typeof checkSelectCnt == 'undefined') {
            										                                                                    checkSelectCnt = 1;
            										                                                                    }
                                                                                                                        
            																											joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
                                                                                                                        //                                                                                                                        
    																											}
    																										}).change(function(){
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																												$(this).parent().find('input:first').prop('checked', true);
    																											}
    																											$(this).parent().find('input:first').change();
                                                                                                                if (typeof checkSelectCnt == 'undefined') {
    														                                                                    checkSelectCnt = 1;
    														                                                                }
    
    																											joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
    
    																										}).append(function(){
    																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    																											{
    																												if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    																												{
    																													if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																														$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].subAddResponse);
    																												}
    																											}
    																										})
    																									);
    																								}
    																							}
    																					);
                                                                                        /////ETC 입력박스                                                                                        
                                                                                        
                                                                                        
																					}
																					else //단일선택 처리
																					{

																						$(this).append(
																								$( '<input>' ).attr( { 'type' : 'radio', 'name':'item'+qstInfo.qstSeq, 'itemIndex':i } ).val( itemList[i].itemSeq ).change(function(){
																								//답변처리
																									joinSurvey.resultAsk(qstInfo, '', this);
																									console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq]);
																								}).append(function(){
																									if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																									{
																										if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																										{
																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																												$(this).prop('checked', true);
																										}
																									}
																								}).click( function(e){
																									e.stopPropagation();
																								} )
																						);
                                                                                        
                                                                                        /////ETC 입력박스
    																					$( this ).append( $( '<span>' ).addClass( 'text_text_margin_right' ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append( joinSurvey.qstCommentChecker(itemList[i].itemTitle) ) ).append(
    																							function()
    																							{
    																								if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')
    																								{
    																									$(this).append(
    																										$( '<input>' ).attr( { 'type':'text' } ).css({'margin-left':'10px', 'margin-top':'5px'}).click(function(e){
    																											e.stopPropagation();
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																												$(this).parent().find('input:first').prop('checked', true);
    																												$(this).parent().find('input:first').change();
    																											}
    																										}).change(function(){
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																												$(this).parent().find('input:first').prop('checked', true);
    																											}
    																											$(this).parent().find('input:first').change();
                                                                                                                if (typeof checkSelectCnt == 'undefined') {
    														                                                                    checkSelectCnt = 1;
    														                                                                }
    
    																											joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
    
    																										}).append(function(){
    																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    																											{
    																												if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    																												{
    																													if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																														$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].subAddResponse);
    																												}
    																											}
    																										})
    																									);
    																								}
    																							}
    																					);
                                                                                        /////ETC 입력박스                                                                                        
                                                                                        
																					}

                                                                                    console.log(joinSurvey.htmlChecker(itemList[i].itemTitleImg));
                                                                                    
																			         if(itemList[i].itemTitleImg != undefined && (joinSurvey.htmlChecker(itemList[i].itemTitleImg) && itemList[i].itemTitleImg !='<div></div>') )
                                                                                    {
                                                                                        $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(itemList[i].itemTitleImg));
    
                                                                                    }                                                                                    
                                                                                    
																				}
																				else if(qstInfo.qstType == 'RANK')
																				{
																					$( this ).removeClass( 'buogi_div' ).append(
																							$( '<div>' ).addClass( 'no_bg rankCnt'+qstInfo.qstSeq ).append(
																									function()
																									{
																										if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																										{
																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																											{
																												if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																												{
																													$(this).append(
																															$( '<span>' ).text( joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse )
																													);
																												}
																											}
																										}
																									}
																							)
																					).append(
																							$( '<div>' ).addClass( 'buogi_div2' ).css( { 'cursor':'pointer' } ).append(
																									$( '<input>' ).attr( { 'type':'checkbox' } ).attr({'itemIndex':i}).val(itemList[i].itemSeq).click(function(e){//랭크 선택시  처리

																										e.stopPropagation();
																										if(joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined)
																										{
																											joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
																										}

																										console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);

											                                                            ///////체크가능 갯수 - 우선순위 갯수
											                                        	                if(qstInfo.qstOptionList['MAXRANK'].optionValue == 'CHECKED')
											                                        					{
											                                        						var subOptionValTmp = qstInfo.qstOptionList['MAXRANK'].subOptionValue.split('|');
											                                        						var maxRank = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;


											                                        						if(maxRank > subOptionValTmp[1])
											                                        						{
											                                        							alert(subOptionValTmp[1]+' 순위까지만 선택하여 주시기 바랍니다.');
											                                        							//$(this).prop('checked', false);
											                                        							return false;
											                                        						}
											                                                            }
											                                                            ///////체크가능 갯수 - 우선순위 갯수


																										if($(this).prop('checked') == true)
																										{
                                                                                                            var mmcnt = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
                                                                                                            console.log("mmcnt1 : " + mmcnt);
																											$(this).parent().prev( 'div:first' ).addClass( 'no_bg_on' ).append(
																													$( '<span>' ).text( mmcnt )
																											);
																											$(this).parents('tr').find('span.poll_list_num_span').append(
																													$( '<span>' ).text( mmcnt )
																											);

																											joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt++;
																										}
																										else
																										{
																											/*console.log( $( this ).parent().parent().parent().parent().html() );

											                                                                $(this).parent().parent().find('input[type=checkbox]').prop('checked', false);

											                                                                $( this ).parent().parent().find( '.no_bg_no' ).each( function(){
											                                                                	$( this ).removeClass( 'no_bg_no' );
											                                                                } );
											                                                                */
											                                                                $( '.rankCnt'+qstInfo.qstSeq ).each( function(){
											                                                                	$( this ).html( '' ).removeClass( 'no_bg_on' );
											                                                                	$( this ).next( 'div:first' ).find( 'input[type=checkbox]' ).prop( 'checked', false );
											                                                                } );
//											                                                                joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt=1;
											                                                                joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
																										}

																										checkSelectCnt=joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
																										console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);

																										if (typeof checkSelectCnt == 'undefined') {
										                                                                    checkSelectCnt = 1;
										                                                                }

																										//답변처리
											                                                            joinSurvey.resultAsk(qstInfo, 'MULTI', $(this), checkSelectCnt);
											                                                            console.log('change rank : ' + checkSelectCnt);


																									})/*.change(function(){

										                                                                if (typeof checkSelectCnt == 'undefined') {
										                                                                    checkSelectCnt = 1;
										                                                                }

																										//답변처리
											                                                            joinSurvey.resultAsk(qstInfo, 'MULTI', $(this), checkSelectCnt);
											                                                            console.log('change rank : ' + checkSelectCnt);

																										//joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),checkSelectCnt);
																									})*/.append(function(){
																										if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																										{
																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																											{
																												if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																												{
																													if(joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined)
																													{
																														joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
																													}

																													var addResponse = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse;

																													if(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt < addResponse)
																													{
																														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt = addResponse;
																													}

																													$(this).prop('checked', true);

																												}
																											}
																										}

																									}).hide()
																							).append( $( '<span>' ).addClass( 'text_text_margin_right' ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append( joinSurvey.qstCommentChecker(itemList[i].itemTitle)) ).append(
																									function()
																									{
																										if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')
																										{
																											$(this).append(
																												$( '<input>' ).attr( { 'type':'text' } ).css({'margin-left':'10px', 'margin-top':'5px'}).click(function(e){
																													e.stopPropagation();
																													if( qstInfo.qstType != 'RANK' )
																													{
																														$(this).parent().find('input:first').prop('checked', true);
																														$(this).parent().find('input:first').change();
																													}
																												}).change(function(){
																													if( qstInfo.qstType != 'RANK' )
																													{
																														$(this).parent().find('input:first').prop('checked', true);
																														$(this).parent().find('input:first').change();
																													}
																													else
																													{
																														if (typeof checkSelectCnt == 'undefined') {
														                                                                    checkSelectCnt = 1;
														                                                                }

																														if( $(this).parent().find('input:first').prop('checked') == true )
																														{
																															checkSelectCnt = parseInt( $( this ).parent().parent().find( 'span:first' ).text() ) +1;
																															console.log('~~~~~~~', qstInfo.qstType, checkSelectCnt);
																															joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
																														}


																													}
																												}).append(function(){
																													if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																													{
																														if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																														{
																															if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																																$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].subAddResponse);
																														}
																													}
																												})
																											);
																										}
																									}
																							).append(function(){
																							         if(itemList[i].itemTitleImg != undefined && (joinSurvey.htmlChecker(itemList[i].itemTitleImg) && itemList[i].itemTitleImg !='<div></div>') )
                                                                                                    {
                                                                                                        $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(itemList[i].itemTitleImg));
                    
                                                                                                    }
																				            })                                                                                        
                                                                                            .click( function(e){
//																								if( qstInfo.qstType != 'RANK' )
//																								{
//																									$( this ).find( 'input[type=checkbox]' ).click();
//																								}
																							} )
																					);
																				}

                                                                                //if(itemList[i].itemTitleImg != undefined && joinSurvey.htmlChecker(itemList[i].itemTitleImg))
                                                                                //{
                                                                                //    $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(itemList[i].itemTitleImg));

                                                                                //}
																			}))
                                                                })
															)}
													).append(//답변 이미지/동영상 그리기
			                                            // function()
			                                            // {
			                                            //     if(itemList[i].itemTitleImg != undefined && joinSurvey.htmlChecker(itemList[i].itemTitleImg))
			                                            //     {
			                                            //         $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(itemList[i].itemTitleImg));
			                                            //     }
			                                            // }
											        )
											);
										}
									}
								}

console.log(itemList[i].itemTitle);
console.log(itemList[i].itemSeq);

								if(randLastVal == 'CHECKED')
								{
								    if(lastItemIndex != undefined)
                                        i=lastItemIndex;

									$(this).append(
											$( '<tr>' ).click(function() {
                                                        $(this).find('input:first').click();
                                                    }).append(
                                                        function() {

                                                            if (qstInfo.qstType == 'RANK') {
                                                                $(this).append(DOM.getTd().addClass("sun_bg").append(function () {
                                                                    $(this).append(
                                                                        DOM.getDiv('poll_list_num')
                                                                            .append(
                                                                                DOM.getSpan('poll_list_num_span rankCnt' + qstInfo.qstSeq, 'span' + itemList[i].itemSeq).html('').append(
                                                                                    function () {
                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined) {
                                                                                                    $(this).append(
                                                                                                        $('<span>').text(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].addResponse)
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    // function () {
                                                                                    //     if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                    //         if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                    //             if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined) {
                                                                                    //                 //alertLayer(1)
                                                                                    //                 //console.log('prev=>'+joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse)
                                                                                    //                 //$(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                                                                                    //                 // $(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                                                                                    //             }
                                                                                    //         }
                                                                                    //     }
                                                                                    // }
                                                                                )//poll_list_num_span
                                                                            )//poll_list_num
                                                                    );
                                                                }));
                                                            }

                                                            $(this).append(DOM.getTd().append(
                                                                function () {
                                                                    $(this).append(
                                                                        $('<div>').addClass('buogi_div').append(
                                                                            function () {
                                                                                if (qstInfo.qstType == 'MULTI') {
                                                                                    if (qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택 처리
                                                                                    {
                                                                                        $(this).append(
                                                                                            $('<input>').attr({
                                                                                                'type': 'checkbox',
                                                                                                'itemIndex': i
                                                                                            }).val(lastItem.itemSeq)
                                                                                            /*.change(function(){
                                                                                             //답변처리
                                                                                             joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
                                                                                             })
                                                                                             */.append(function () {
                                                                                            ///////체크가능 갯수 -  갯수
                                                                                                if(joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined)
																								{
																									joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
                                                                                                    
																								}
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                                                                                        {
                                                                                                            joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;
                                                                                                            $(this).prop('checked', true);
                                                                                                        }
                                                                                                            
                                                                                                    }
                                                                                                }
                                                                                            }).click(function (e) {
                                                                                                e.stopPropagation();


                                                                                                ///////체크가능 갯수 -  갯수
                                                                                                if (joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined) {
                                                                                                    joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt': 0};
                                                                                                }

                                                                                                if (this.checked) {//checked 처리된 항목의 값

                                                                                                    // alert(this.value);
                                                                                                    joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;

                                                                                                } else {
                                                                                                    joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                                                }
                                                                                                console.log('cnt1:')
                                                                                                console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                console.log(qstInfo.qstSeq);


                                                                                                if (qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                                                {
                                                                                                    var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                                                                                                    var maxAsk = joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt;
                                                                                                    if (subOptionValTmp[1] < maxAsk) {
                                                                                                        console.log(maxAsk);
                                                                                                        //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                        alertLayer(' ' + subOptionValTmp[1] + '개 까지만 선택하여 주시기 바랍니다.');
                                                                                                        joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                                                        return false;
                                                                                                    } else {
                                                                                                        joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));

                                                                                                    }

                                                                                                } else {
                                                                                                    joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));

                                                                                                }

                                                                                                ///////체크가능 갯수 -  갯수


                                                                                            }).trigger('change')
                                                                                        );
                                                                                        
                                                                                        
                                                                                        /////ETC 입력박스
    																					$( this ).append( $( '<span>' ).addClass( 'text_text_margin_right' ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append( joinSurvey.qstCommentChecker(itemList[i].itemTitle) ) ).append(
    																							function()
    																							{
    																								if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')
    																								{
    																								    
    																									$(this).append(
    																										$( '<input>' ).attr( { 'type':'text' } ).css({'margin-left':'10px', 'margin-top':'5px'}).click(function(e){
    																											e.stopPropagation();
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																											 
                                                                                                                 
                             
                                                                                                                    ///////체크가능 갯수 -  갯수
                                                                                                                    if(joinSurvey.askTypeCnt[qstInfo.qstSeq] == undefined)
                																									{
                																										joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
                																									}
                                                                                                                    
                                                                                                                    if($(this).parent().find('input:first').prop('checked')){
                                                                                                                        console.log('checked:');
                                                                                                                    }else{
                                                                                                                        $(this).parent().find('input:first').prop('checked', true);
                                                                                                                        joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt++;
                                                                                                                        console.log('first:');
                                                                                                                        console.log(joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                        
                                                                                                    						if(qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                                                    						{
                                                                                                    							var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                                                                                                                                //var maxAsk = joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt;
                                                                                                    							if(subOptionValTmp[1] < joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt)
                                                                                                    							{
                                                                                                    							 console.log('현재:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                                                    joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt--;
                                                                                                    								alertLayer(' '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                                                                    $(this).parent().find('input:first').prop('checked', false);
                                                                                                    								console.log('마이너스:'+joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt);
                                                                                                    								return false;
                        
                                                                                                    							}
                        
                                                                                                    						}                                                                                                                        
                                                                                                                    }                                                                                                              
                                                                                            
    																												$(this).parent().find('input:first').change();
            																											//추가
                                                                                                                        if (typeof checkSelectCnt == 'undefined') {
            										                                                                    checkSelectCnt = 1;
            										                                                                    }
                                                                                                                        
            																											joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
                                                                                                                        //                                                                                                                        
    																											}
    																										}).change(function(){
    																											if( qstInfo.qstType != 'RANK' )
    																											{
    																												$(this).parent().find('input:first').prop('checked', true);
    																											}
    																											$(this).parent().find('input:first').change();
                                                                                                                if (typeof checkSelectCnt == 'undefined') {
    														                                                                    checkSelectCnt = 1;
    														                                                                }
    
    																											joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
    
    																										}).append(function(){
    																											if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    																											{
    																												if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    																												{
    																													if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																														$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].subAddResponse);
    																												}
    																											}
    																										})
    																									);
    																								}
    																							}
    																					);
                                                                                        /////ETC 입력박스                                                                                           
                                                                                        
                                                                                    }
                                                                                    else //단일선택 처리
                                                                                    {

                                                                                        $(this).append(
                                                                                            $('<input>').attr({
                                                                                                'type': 'radio',
                                                                                                'name': 'item' + qstInfo.qstSeq,
                                                                                                'itemIndex': i
                                                                                            }).val(lastItem.itemSeq).change(function () {
                                                                                                //답변처리
                                                                                                joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq]);
                                                                                            }).append(function () {
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                                                                                            $(this).prop('checked', true);
                                                                                                    }
                                                                                                }
                                                                                            }).click(function (e) {
                                                                                                e.stopPropagation();
                                                                                            })
                                                                                        );
                                                                                         /////ETC 입력박스 
                                                                                        $(this).append($('<span>').addClass('text_text_margin_right').attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append(joinSurvey.qstCommentChecker(lastItem.itemTitle))).append(
                                                                                            function () {
                                                                                                if (lastItem.itemOptionList['INPUT'].optionValue == 'CHECKED') {
                                                                                                    $(this).append(
                                                                                                        $('<input>').attr({'type': 'text'}).css({
                                                                                                            'margin-left': '10px',
                                                                                                            'margin-top': '5px'
                                                                                                        }).click(function (e) {
                                                                                                            e.stopPropagation();
                                                                                                            if (qstInfo.qstType != 'RANK') {
                                                                                                                $(this).parent().find('input:first').prop('checked', true);
                                                                                                                $(this).parent().find('input:first').change();
                                                                                                            }
                                                                                                        }).change(function () {
                                                                                                            if (qstInfo.qstType != 'RANK') {
                                                                                                                $(this).parent().find('input:first').prop('checked', true);
                                                                                                            }
                                                                                                            $(this).parent().find('input:first').change();
    
                                                                                                            if (typeof checkSelectCnt == 'undefined') {
                                                                                                                checkSelectCnt = 1;
                                                                                                            }
    
                                                                                                            joinSurvey.resultAsk(qstInfo, 'MULTI', $(this).parents('td').find('input:first'), checkSelectCnt);
    
                                                                                                        }).append(function () {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].subAddResponse);
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        );                                                                                        
                                                                                         /////ETC 입력박스 
                                                                                    }


                                                                                }
                                                                                else if (qstInfo.qstType == 'RANK') {
                                                                                    $(this).removeClass('buogi_div').append(
                                                                                        $('<div>').addClass('no_bg rankCnt' + qstInfo.qstSeq).append(
                                                                                            function () {
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined) {
                                                                                                            $(this).append(
                                                                                                                $('<span>').text(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].addResponse)
                                                                                                            );
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        )/*.click(function(){
                                                                                         //																						$( this ).parent().find( 'input[type=checkbox]' ).click();
                                                                                         })*/
                                                                                    ).append(
                                                                                        $('<div>').addClass('buogi_div2').css({'cursor': 'pointer'}).append(
                                                                                            $('<input>').attr({'type': 'checkbox'}).attr({'itemIndex': i}).val(lastItem.itemSeq).click(function (e) {//랭크 선택시  처리

                                                                                                e.stopPropagation();
                                                                                                if (joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined) {
                                                                                                    joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt': 1};
                                                                                                }

                                                                                                console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);

                                                                                                ///////체크가능 갯수 - 우선순위 갯수
                                                                                                if (qstInfo.qstOptionList['MAXRANK'].optionValue == 'CHECKED') {
                                                                                                    var subOptionValTmp = qstInfo.qstOptionList['MAXRANK'].subOptionValue.split('|');
                                                                                                    var maxRank = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;


                                                                                                    if (maxRank > subOptionValTmp[1]) {
                                                                                                        alertLayer(subOptionValTmp[1] + ' 순위까지만 선택하여 주시기 바랍니다.');
                                                                                                        //$(this).prop('checked', false);
                                                                                                        return false;
                                                                                                    }
                                                                                                }
                                                                                                ///////체크가능 갯수 - 우선순위 갯수


                                                                                                if ($(this).prop('checked') == true) {
                                                                                                    var mmcnt = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
                                                                                                    console.log("mmcnt2 : " + mmcnt);
                                                                                                    $(this).parent().prev('div:first').addClass('no_bg_on').append(
                                                                                                        $('<span>').text(mmcnt)
                                                                                                    );
                                                                                                    $(this).parents('tr').find('span.poll_list_num_span').append(
                                                                                                        $( '<span>' ).text( mmcnt )
                                                                                                    );

                                                                                                    joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt++;
                                                                                                }
                                                                                                else {
                                                                                                    /*console.log( $( this ).parent().parent().parent().parent().html() );

                                                                                                     $(this).parent().parent().find('input[type=checkbox]').prop('checked', false);

                                                                                                     $( this ).parent().parent().find( '.no_bg_no' ).each( function(){
                                                                                                     $( this ).removeClass( 'no_bg_no' );
                                                                                                     } );
                                                                                                     */
                                                                                                    $('.rankCnt' + qstInfo.qstSeq).each(function () {
                                                                                                        $(this).html('').removeClass('no_bg_on');
                                                                                                        $(this).next('div:first').find('input[type=checkbox]').prop('checked', false);
                                                                                                    });
//									                                                                joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt=1;
                                                                                                    joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt': 1};
                                                                                                }

                                                                                                checkSelectCnt = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
                                                                                                console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);

                                                                                                if (typeof checkSelectCnt == 'undefined') {
                                                                                                    checkSelectCnt = 1;
                                                                                                }

                                                                                                //답변처리
                                                                                                joinSurvey.resultAsk(qstInfo, 'MULTI', $(this), checkSelectCnt);
                                                                                                console.log('change rank : ' + checkSelectCnt);


                                                                                            }).append(function () {
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined) {
                                                                                                            if (joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined) {
                                                                                                                joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt': 1};
                                                                                                            }

                                                                                                            var addResponse = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].addResponse;

                                                                                                            if (joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt < addResponse) {
                                                                                                                joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt = addResponse;
                                                                                                            }

                                                                                                            $(this).prop('checked', true);

                                                                                                        }
                                                                                                    }
                                                                                                }

                                                                                            }).hide()
                                                                                        ).append($('<span>').addClass('text_text_margin_right').attr("style", joinSurvey.surveyData.layoutDataMobile.body_font_view).append(joinSurvey.qstCommentChecker(lastItem.itemTitle))).append(
                                                                                            function () {
                                                                                                if (lastItem.itemOptionList['INPUT'].optionValue == 'CHECKED') {
                                                                                                    $(this).append(
                                                                                                        $('<input>').attr({'type': 'text'}).css({
                                                                                                            'margin-left': '10px',
                                                                                                            'margin-top': '5px'
                                                                                                        }).click(function (e) {
                                                                                                            e.stopPropagation();
                                                                                                            if (qstInfo.qstType != 'RANK') {
                                                                                                                $(this).parent().find('input:first').prop('checked', true);
                                                                                                                $(this).parent().find('input:first').change();
                                                                                                            }
                                                                                                        }).change(function () {
                                                                                                            if (qstInfo.qstType != 'RANK') {
                                                                                                                $(this).parent().find('input:first').prop('checked', true);
                                                                                                            }
                                                                                                            $(this).parent().find('input:first').change();

                                                                                                            if (typeof checkSelectCnt == 'undefined') {
                                                                                                                checkSelectCnt = 1;
                                                                                                            }

                                                                                                            if ($(this).parent().find('input:first').prop('checked') == true) {
                                                                                                                checkSelectCnt = parseInt($(this).parent().parent().find('span:first').text()) + 1;
                                                                                                                console.log('~~~~~~~', qstInfo.qstType, checkSelectCnt);
                                                                                                                joinSurvey.resultAsk(qstInfo, 'MULTI', $(this).parents('td').find('input:first'), checkSelectCnt);
                                                                                                            }

                                                                                                        }).append(function () {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].subAddResponse);
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }
                                                                        ))
                                                                }))
                                                        }
											)

									);

								} //if(randLastVal == 'CHECKED')



							}
					)
			);

		return returnObj;
	};

    /**
     * 주관식 미리보기
     */
    this.prevOpen = function (qstInfo) {
        var returnObj =
            $(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('fieldset_open_wrap').append(
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
                function () {
                    $(this).append(DOM.getTable('giben_table').append(
                        function () {
                            for (var i in qstInfo.itemList) {
                                if (qstInfo.itemList[i] != '') {
                                    if (qstInfo.itemList[i] != null) {
                                        $(this).append(DOM.getTr().append(
                                            function () {
                                                $(this).append(DOM.getTd().append(
                                                    function () {
                                                       

                                                        $(this).append(DOM.getDiv("buogi_div chekbox_img_div").append(
                                                            function () {
                                                                
                                                                //답변 이미지/동영상 그리기
                                                                if(qstInfo.itemList[i].itemTitleImg != undefined && (joinSurvey.htmlChecker(qstInfo.itemList[i].itemTitleImg) && qstInfo.itemList[i].itemTitleImg !='<div></div>') )
                                                                {
                                                                    DOM.getImage(qstInfo.itemList[i].itemTitleImg).css({'padding-top': '7px'});
                                                                    $(this).append($(document.createElement('div')).addClass('muhang_text_border_img edit_div_img1').html(qstInfo.itemList[i].itemTitleImg));
                                                                }
                                                            }
                                                        ).append(
                                                            function () {
                                                                $(this).append(
                                                                    $(document.createElement('div')).css({'overflow': 'hidden'})
                                                                        .append(
                                                                        DOM.getSpan().attr("style", "float:left;padding:10px;"+joinSurvey.surveyData.layoutDataMobile.body_font_view)
                                                                            .append(
                                                                            $(document.createElement('label')).attr('for', 'select-choice-mini').append(qstInfo.itemList[i].itemTitle)
                                                                        ).append(
                                                                        
                                                                            DOM.getSpan().css({'float': 'left'})
                                                                                .append(
                                                                                function () {
    
                                                                                    if (qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'INPUT') {
                                                                                        $(this).append(
                                                                                            DOM.getTextBox().attr({
                                                                                                'itemIndex': i,
                                                                                                'itemSeq': qstInfo.itemList[i].itemSeq
                                                                                            }).addClass('input_02').append(
                                                                                                function () {
                                                                                                    if (qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '100px'
                                                                                                        });
                                                                                                    else
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '100px'
                                                                                                        });
                                                                                                }
                                                                                            ).attr({
                                                                                                    'onlynum': qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
                                                                                                }).on("keypress keyup",function (e) {
                                                                                                    if ($(this).attr('onlynum') == 'CHECKED') {
    
                                                                                                        if ($.trim($(this).val()) && isNumeric($(this).val()) == false) {
                                                                                                        //if (e.which && (e.which < 48 || e.which > 57)) {
                                                                                                            alertLayer('숫자만 입력해주세요.');
                                                                                                            $(this).val('');
                                                                                                            e.preventDefault();
                                                                                                        }
                                                                                                    }
                                                                                                }).change(function () {
                                                                                                    //답변처리
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                }).append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
                                                                                                                $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                    else if (qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'INPUT2') {
                                                                                        $(this).append(
                                                                                            DOM.getTextBox().attr({
                                                                                                'itemIndex': i,
                                                                                                'itemSeq': qstInfo.itemList[i].itemSeq
                                                                                            }).addClass('input_02').append(
                                                                                                function () {
                                                                                                    if (qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '300px'
                                                                                                        });
                                                                                                    else
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '300px'
                                                                                                        });
                                                                                                }
                                                                                            ).attr({
                                                                                                    'onlynum': qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
                                                                                                }).on("keypress keyup",function (e) {
                                                                                                    if ($(this).attr('onlynum') == 'CHECKED') {
                                                                                                        if ($.trim($(this).val()) && isNumeric($(this).val()) == false) {
                                                                                                            alertLayer('숫자만 입력해주세요.');
                                                                                                            $(this).val('');
                                                                                                            e.preventDefault();
                                                                                                        }
                                                                                                    }
                                                                                                }).change(function () {
                                                                                                    //답변처리
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                }).append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
                                                                                                                $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                    else if (qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'TEXTAREA') {
                                                                                        $(this).append(
                                                                                            DOM.getTextArea().attr({
                                                                                                'itemIndex': i,
                                                                                                'itemSeq': qstInfo.itemList[i].itemSeq
                                                                                            }).addClass('input_02').append(
                                                                                                function () {
                                                                                                    if (qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '300px',
                                                                                                            'height': '50px'
                                                                                                        });
                                                                                                    else
                                                                                                        $(this).css({
                                                                                                            'display': 'block',
                                                                                                            'clear': 'both',
                                                                                                            'width': '300px',
                                                                                                            'height': '50px'
                                                                                                        });
                                                                                                }
                                                                                            ).attr({
                                                                                                    'onlynum': qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
                                                                                                }).on("keypress keyup",function (e) {
                                                                                                    if ($(this).attr('onlynum') == 'CHECKED') {
                                                                                                        if ($.trim($(this).val()) && isNumeric($(this).val()) == false) {
                                                                                                            alertLayer('숫자만 입력해주세요.');
                                                                                                            $(this).val('');
                                                                                                            e.preventDefault();
                                                                                                        }
                                                                                                    }
                                                                                                }).change(function () {
                                                                                                    //답변처리
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                }).append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
                                                                                                                $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }
                                                                            )//span
                                                                        
                                                                        )
                                                                        
                                                                        
                                                                        
                                                                        
                                                                    )
                                                                    //    .append(//답변 이미지/동영상 그리기
                                                                    //    function () {
                                                                    //        if (qstInfo.itemList[i].itemTitleImg != undefined && joinSurvey.htmlChecker(qstInfo.itemList[i].itemTitleImg)) {
                                                                    //            $(this).append($(document.createElement('div')).addClass('muhang_text_border_img edit_div_img1').html(qstInfo.itemList[i].itemTitleImg));
                                                                    //
                                                                    //        }
                                                                    //    }
                                                                    //)
                                                                    //    .append(

                                                                    //)//.attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).css({'padding-bottom':'5px'})
                                                                );
                                                            }))
                                                    }))
                                            }))
                                    }
                                }
                            }
                        }))
                }
            )
        ;

        return returnObj;
    };

	/**
	 * 척도형 미리보기
	 */
	this.prevMatrix = function(qstInfo)
	{
		var tableWidth = "100%";

		var returnObj =
            $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).append(
				function()
				{   //단을 그림
					for(var i in qstInfo.sectionList)
					{
    				    $(this).append(
            				DOM.getTable().addClass('poll_table'+' basic_table '+joinSurvey.surveyData.layoutDataMobile.body_table_type+' table_size2').attr({'width':tableWidth,'style':'','scope':'row'}).append(//table
            					DOM.getTr().append(
            							$(document.createElement('th')).attr({'rowspan':'2','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).html('구분')
            					).append(
            						function()
            						{
            							//단을 그림
            							//for(var i in qstInfo.sectionList)
            							//{
            								$(this).append(
            									$(document.createElement('th')).attr({'scope':'row'}).append(
            											//qstInfo.sectionList[i].sectionTitle).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop+';text-align:center;'}
                                                        qstInfo.sectionList[i].sectionTitle).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop+';'}
            									)
            								);
            							//}
            						}
            					)
            				).append(//table
            					DOM.getTr().append(//단 하단 th
            						function()
            						{
            							//for(var i in qstInfo.sectionList)
            							//{
            								$(this).append(
            									$(document.createElement('th')).attr({'style':''+"width:auto;",'scope':'row'}).addClass('table_border_left').append(
                                                    //width="100%" border="0" cellpadding="0" cellspacing="0" class=""
                                                    $(document.createElement('table')).css({"width":"100%"}).addClass('th_table_1').append(
                		                              DOM.getTr().append(
                										function()
                										{
                											var k = 0;
                											for(var j in qstInfo.sectionList[i].itemList)
                											{
                												$(this).append(
                                                                  $(document.createElement('th')).attr({'align':'center','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).append(
                														qstInfo.sectionList[i].itemList[j].itemTitle
                                                                  )
                												);
                												if(k == 0)
                												$(this).append(
                                                                  $(document.createElement('th')).attr({'align':'center','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).append(
                                                                        DOM.getImage('images/table_img01.png')
                                                                  )
                                                                );
                												k++;
                											}
                										}
                                                     )
                                                    )
            									)
            								);
            							//}
            						}
            					)
            				).append(//table
            					function()
            					{
            						for(var h in qstInfo.subQstList)
            						{
            							$(this).append(
            								DOM.getTr().append(//좌측 td
            									$(document.createElement('td')).html(function(){
            										if (joinSurvey.htmlChecker(qstInfo.subQstList[h].qstTitle) == false)
            										{
            											$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
            										}
            									}).append(
            //									$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).append(
            										qstInfo.subQstList[h].qstTitle
            									).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table).append(
            										function()
            										{
            											if(qstInfo.subQstList[h].qstOptionList['INPUT'].optionValue == 'CHECKED')
            											{
            												$(this).append(
            													$(document.createElement('span')).css({'display':'block', 'clear':'both'}).append(
            														DOM.getTextBox().addClass('input_02 etcInput')
            														.attr({
            															'grpSeq' : qstInfo.grpSeq,
            															'qstSeq': qstInfo.qstSeq,
            															'qstType' : qstInfo.qstType,
            															'subQstSeq' : qstInfo.subQstList[h].qstSeq
            														})
            													)
            												);
            											}
            										}
            									).append(
            										function()
            										{
            											if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
            												$(this).addClass('table_bold');

            										}
            									)
            								).append(
            									function()
            									{
            										//for(var j in qstInfo.sectionList)
            										//{
                                                    var choice_value = 0;
                                                                        var select_k = "";
                                                                        var show_slider = true;

            											$(this).append(//우측 td
            												$(document.createElement('td')).attr({'align':'center'}).addClass('poll_table_multi_radio').append(

            				                                    DOM.getTable().append(//라디오버튼 가로정렬위한 테이블
                                                                    DOM.getTr().append(
                    													function()
                    													{
                    														//if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                    															//$(this).addClass('table_bold');

                                                                            var data_to = parseInt(qstInfo.sectionList[i].sectionOptionList['SUBCNT'].optionValue)
                                                                                    , data_from = 1
                                                                                    ;

                                                                            var choice_value = parseInt(data_to/2)+1;

                    														for(var k=1; k<=qstInfo.sectionList[i].sectionOptionList['SUBCNT'].optionValue; k++)
                    														{
                                                                                var checked_class = (choice_value==k)?true:false;

                                                                                if(checked_class) {
                                                                                    var hh = h;
                                                                                    var ii = i;
                                                                                    setTimeout(function(){
                                                                                        joinSurvey.resultAsk(qstInfo, '', $('input[name="item_'+qstInfo.qstSeq+'_'+hh+'_'+ii+'"]'));
                                                                                    },500);
                                                                                }

                    															$(this).append(
            												                        //$(document.createElement('td')).append(

                                                                                        $(document.createElement('label')).append(
                            																DOM.getRadioButton('item_'+qstInfo.qstSeq+'_'+h+'_'+i).hide().attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq,'checked':checked_class}).val(k).change(function(){
                            																	//답변처리
                            																	joinSurvey.resultAsk(qstInfo, '', this);
                            																}).append(function(){
                            																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                            																	{
                            																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                            																		{
                            																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined)
                            																			{
                            																				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq] != undefined)
                            																				{
                            																					if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[k] != undefined) {
                                                                                                                    //
                                                                                                                    $(this).prop('checked', true);

                                                                                                                    choice_value = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[k].addResponse;
                                                                                                                }
                            																				}
                            																			}
                            																		}
                            																	}
                            																})
                                                                                        )//label
                                                                                    //)//td

                    															);
                    														}//for



                                                                            $(this).append(
                                                                                $(document.createElement('div')).attr({"class":"layout-slider"}).append(
                                                                                    $('<input class="SliderSingle" type="slider" name="price" value="'+choice_value+'" data-from="'+data_from+'" data-to="'+data_to+'" data-step="1" data-item="item_'+qstInfo.qstSeq+'_'+h+'_'+i+'" data-dimension="&nbsp;" />')
                                                                                )
                                                                            );
                    													}//function
                                                                    )//tr
                                                                )//table
            												)//td
                                                            .append(
                                                                function () {
                                                                    if (qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                        $(this).addClass('table_bold');
                                                                }
                                                            )
            											);
            										//}//for
            									}//function
            								)//tr
            							);//this
            						}
            					}//function
            				)//table
                            .append(
                                // $(document.createElement('br'))
                            )//table
                    );//this
                }
            }//function
        )//fieldset
		;

		return returnObj;
	};

	/**
	 * AHP 미리보기
	 */
	this.prevAhp = function(qstInfo)
	{
		var returnObj = '';
		var sectionTitle = '';
		//테이블 우측 class 추가
		var ahpStyleClass = '';
		var stringClass = joinSurvey.surveyData.layoutDataNew.body_table_type;
		var arrStrClass = stringClass.split('_');
		returnObj =
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
           $(document.createElement('div')).addClass("sur_padding").attr({'style':'padding:15px; background:#FAF9F9; overflow:auto;'}).append(
			DOM.getTable().addClass('poll_table'+' basic_table '+joinSurvey.surveyData.layoutDataMobile.body_table_type+' ').attr({'width':'100%'}).append(
				DOM.getTr().append(

				).append(
					function()
					{
                        //console.log(qstInfo);
						//단을 그림
						for(var i in qstInfo.sectionList)
						{
                            $(this).append(
                                $(document.createElement('th')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).css({"width":"20%"}).html(qstInfo.sectionList[i].itemList[0].itemTitle)
                            );
							$(this).append(

								$(document.createElement('th')).attr({'style':'','scope':'row'}).append(

                                    $(document.createElement('table')).attr({'style':''+"width:100%;"}).addClass('').append(
		                              DOM.getTr().append(

    									function()
    									{
    										var k = 0;

    										for(var j in qstInfo.sectionList[i].itemList)
    										{
    											//$(this).append(
                                                 // $(document.createElement('th')).attr({'align':'center','scope':'row'}).append(
    											//	DOM.getDiv()
    											//	.html(qstInfo.sectionList[i].itemList[j].itemTitle + "@")
    											//	/*.append(
    											//		function()
    											//		{
    											//			if(k==0)
    											//				$(this).css({'float':'left'});
    											//			else
    											//				$(this).css({'float':'right'});
    											//		}
    											//	)*/
                                                 // )
    											//);
    											if(k == 0)
    											{
    												$(this).append(
                                                      //$(document.createElement('th')).attr({'align':'center','scope':'row'}).append('↔')
                                                        DOM.getImage('images/table_img01.png').css({"width":"42px","height":"13px"})
    												);
    											}

    											k++;
    										}
    									}

                                     )
                                    )
								)
							);
                            $(this).append(
                                $(document.createElement('th')).attr({'scope':'row','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop}).css({"width":"20%"}).html(qstInfo.sectionList[i].itemList[1].itemTitle)
                            );
						}
					}
				)
			).append(
				function()
				{
					for(var i in qstInfo.subQstList)
					{

                		if( arrStrClass[1] == 'style05' || arrStrClass[1] == 'style06')
                		{
                			ahpStyleClass = 'table_border_ahp';
                            removeStyleClass='';                               
                		}
                		else
                		{
                			ahpStyleClass = '';
                            removeStyleClass='table_border_ahp';                             
                		}										  
					    //테이블 우측 class 추가
						$(this).append(
							DOM.getTr().append(//맨 좌측 td
								$(document.createElement('td')).html(function(){
									if (joinSurvey.htmlChecker(qstInfo.subQstList[i].qstTitle) == false)
									{
										// $(this).attr("style",'')
                                        $(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table);
									}
								}).css({'text-align':'center'}).append(
//								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).css({'text-align':'center'}).append(
									qstInfo.subQstList[i].qstTitle
								).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table).append(
									function()
									{
										if(qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
											$(this).addClass('table_bold');
									}
								)
							).append(
								function()
								{
									for(var j in qstInfo.sectionList)
									{
										$(this).append(//우측 td
											$(document.createElement('td')).attr({'align':'center'}).addClass('poll_table_multi_radio').css({"width":"60%"}).append(
				                                    DOM.getTable().append(//라디오버튼 가로정렬위한 테이블
                                                        DOM.getTr().append(
            												function()
            												{
            													//if(qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
            														//$(this).addClass('table_bold');

            													var itemVal = -(Math.floor(qstInfo.sectionList[j].sectionOptionList['SUBCNT'].optionValue/2));

                                                                $(this).append(DOM.getTd().append(
                                                                    function() {
                                                                        var choice_value = 0;
                                                                        var select_k = "";
                                                                        var show_slider = true;

                                                                        var data_to = parseInt(qstInfo.sectionList[j].sectionOptionList['SUBCNT'].optionValue)
                                                                                , data_from = data_to
                                                                                ;

                                                                        //if(data_to != 0) {
                                                                            data_to = (data_to-1)/2;
                                                                            data_from = data_to * -1;
                                                                        //}

                                                                        console.log('data_to' + data_to);
                                                                        console.log('data_from' + data_from);

                                                                        for(var k=1; k<=qstInfo.sectionList[j].sectionOptionList['SUBCNT'].optionValue; k++)
                                                                        {

                                                                            if(itemVal == choice_value) {
                                                                                var ii = i;
                                                                                var jj = j;
                                                                                setTimeout(function(){
                                                                                    joinSurvey.resultAsk(qstInfo, '', $('input[name="item_'+qstInfo.qstSeq+'_'+ii+'_'+jj+'"]'));
                                                                                },500);
                                                                            }

                                                                            $(this).append(

                                                                                    $(document.createElement('label')).append(
                                                                                        DOM.getRadioButton('item_'+qstInfo.qstSeq+'_'+i+'_'+j).hide().attr({'sectionSeq':qstInfo.sectionList[j].sectionSeq, 'subQstSeq':qstInfo.subQstList[i].qstSeq, 'itemSeq':k}).val(itemVal).change(function(){
                                                                                            //답변처리
                                                                                            var $this = this;
                                                                                            setTimeout(function(){
                                                                                                console.log('ahp result ask');

                                                                                                joinSurvey.resultAsk(qstInfo, '', $this);

                                                                                            },500);
                                                                                        }).append(function(){
                                                                                        //}).hide().append(function(){
                                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                                                            {
                                                                                                if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                                                                {
                                                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined)
                                                                                                    {
                                                                                                        if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined)
                                                                                                        {
                                                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[k] != undefined) {
                                                                                                                console.log('ask...');
                                                                                                                $(this).prop('checked', true);
                                                                                                                select_k = k;
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    ).append(function(){


                                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                                                            {
                                                                                                if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                                                                {
                                                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined)
                                                                                                    {
                                                                                                        if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined)
                                                                                                        {
                                                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[k] != undefined) {
                                                                                                                choice_value = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[k].addResponse;

                                                                                                                console.log('now ch :'+choice_value);

                                                                                                                //console.log('show_slider false');

                                                                                                                show_slider = false;
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                    })
                                                                            );
                                                                            itemVal++;
                                                                            select_k = "";
                                                                        }



                                                                        $(this).append(
                                                                            $(document.createElement('div')).attr({"class":"layout-slider"}).append(
                                                                                $('<input class="SliderSingle" type="slider" name="price" value="'+choice_value+'" data-from="'+data_from+'" data-to="'+data_to+'" data-step="1" data-item="item_'+qstInfo.qstSeq+'_'+i+'_'+j+'" data-dimension="&nbsp;" />')
                                                                            )
                                                                        );
                                                                    }))
            												}
                                                        )//tr
                                                    )//table
											)//td
                                            .append(
                                                function () {
                                                    if (qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                        $(this).addClass('table_bold');
                                                }
                                            )
										);
									}
								}
							).append(//맨 우측 td
								$(document.createElement('td')).removeClass(removeStyleClass).addClass(ahpStyleClass).html(function(){
									if (joinSurvey.htmlChecker(qstInfo.subQstList[i].qstOptionList['SUBTITLE'].optionValue) == false)
									{
										$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
									}
								}).css({'text-align':'center'}).append(
//								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).css({'text-align':'center'}).css({'text-align':'center'}).append(
									qstInfo.subQstList[i].qstOptionList['SUBTITLE'].optionValue
								).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table).append(
									function()
									{
										if(qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
											$(this).addClass('table_bold');

									}
								)
							)
						);
					}
				}
			)
		)
        ;

		return returnObj;
	};

    this.prevConstantsumLoop = function(qstInfo,$this,i,k) {
        // 하위 질문
        for(var h in qstInfo.subQstList)
        {
            $this.append(
                DOM.getTr().append(// 우측 td
                    $(document.createElement('td')).html(function(){
                        if (joinSurvey.htmlChecker(qstInfo.subQstList[h].qstTitle) == false)
                        {
                            $(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
                        }
                    }).append(

                        DOM.getDiv().append(
                            qstInfo.subQstList[h].qstTitle
                        ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table).append(
                            function()
                            {
                                if(qstInfo.subQstList[h].qstOptionList['INPUT'].optionValue == 'CHECKED')
                                {
                                    $(this).append(
                                        $(document.createElement('span')).css({'margin-left':'2px', 'clear':'both'}).append(
                                            DOM.getTextBox().addClass('input_02 etcInput')
                                            .attr({
                                                'grpSeq' : qstInfo.grpSeq,
                                                'qstSeq': qstInfo.qstSeq,
                                                'qstType' : qstInfo.qstType,
                                                'subQstSeq' : qstInfo.subQstList[h].qstSeq
                                            })
                                        )
                                    );
                                }
                            }
                        )
                    ).append(
                        function()
                        {
                            if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                $(this).addClass('table_bold');
                        }
                    )
                ).append(
                    function()
                    {
                        //for(var j in qstInfo.sectionList)
                        //{
                        //    for(var k in qstInfo.sectionList[i].itemList)
                        //    {
                                var sectionSeq = qstInfo.sectionList[i].sectionSeq;
                                var subQstSeq = qstInfo.sectionList[i].itemList[k].itemSeq;
                                var itemSeq = qstInfo.subQstList[h].qstSeq;

                                $(this).append(
                                    $(document.createElement('td')).attr({'align':'center'}).append(
                                       DOM.getDiv('ui-grid-a"').append(

                                            function()
                                            {
                                                if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                    $(this).addClass('table_bold');

                                                if(qstInfo.sectionList[i].sectionOptionList['UNIT'].optionValue == 'CHECKED')
                                                {
                                                    var unitTmp = qstInfo.sectionList[i].sectionOptionList['UNIT'].subOptionValue.split('|');
                                                    if(unitTmp[1] == 'front')
                                                    {
                                                        $(this).append(
                                                            DOM.getDiv('ui-block-a').css({'width':'auto', 'line-height':'36px','margin-left':'5px', 'margin-top':'5px'}).append(
                                                                    unitTmp[0]+'&nbsp;&nbsp;'
                                                            )
                                                        );
                                                    }
                                                }

                                                if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
                                                {
                                                    $(this).append(
                                                        DOM.getDiv('ui-block-b').css({'width':'auto', 'line-height':'36px','margin-left':'5px','margin-right':'5px'}).append(
                                                            DOM.getTextBox().attr({'sectionItemSeq':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k, 'sectionSeq':sectionSeq, 'subQstSeq':subQstSeq, 'itemSeq':itemSeq}).css({'width':'50px', 'margin':'0 auto'}).addClass('input_02 sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k)
                                                            .on("keypress keyup",function (e) {
                        
                                                     
                                                                if ($.trim($(this).val()) && isNumeric($(this).val()) == false) {
                                                                //if (e.which && (e.which < 48 || e.which > 57)) { 
                                                                    alertLayer('숫자만 입력해주세요.');
                                                                    $(this).val('');
                                                                    e.preventDefault();
                                                                }

                                                            })
                                                            .change(function(){
                                                                var totalSum = 0;

                                                                $('.'+$(this).attr('sectionItemSeq')).each(function(){
                                                                    if($(this).val()!= '')
                                                                    {
                                                                        totalSum = parseInt(totalSum)+parseInt($(this).val());
                                                                    }
                                                                });

                                                                $('#'+$(this).attr('sectionItemSeq')).html(totalSum);

                                                                //답변처리
                                                                joinSurvey.resultAsk(qstInfo, '', this);
                                                            }).append(
                                                                function()
                                                                {
                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                                    {
                                                                        if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                                        {
                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq] != undefined)
                                                                            {
                                                                                if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq] != undefined)
                                                                                {
                                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq].askList[itemSeq] != undefined)
                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq].askList[itemSeq].addResponse);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            )
                                                        )//ui-block-b
                                                    );
                                                }
                                                else
                                                {
                                                    $(this).append(
                                                        DOM.getDiv('ui-block-b').css({'width':'auto', 'line-height':'36px','margin-left':'5px','margin-right':'5px'}).append(
                                                            $(document.createElement('select')).attr({'data-mini':'true','data-inline':'true','sectionItemSeq':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k, 'sectionSeq':sectionSeq, 'subQstSeq':subQstSeq, 'itemSeq':qstInfo.subQstList[h].qstSeq}).addClass('input_02 sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k).append(
                                                                function()
                                                                {
                                                                    $(this).append(
                                                                            $(document.createElement('option'))
                                                                            .val('')
                                                                            .html('선택')
                                                                    );

                                                                    if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].subOptionValue != '')
                                                                    {
                                                                        var subOptionValueTmp = qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');
                                                                        for(var l=parseInt(subOptionValueTmp[0]); l<=parseInt(subOptionValueTmp[1]); l++)
                                                                        {
                                                                            $(this).append(
                                                                                    $(document.createElement('option'))
                                                                                    .val(l)
                                                                                    .html(l)
                                                                            );

                                                                            l = l+4;
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        for(var l=0; l<=100; l++)
                                                                        {
                                                                            $(this).append(
                                                                                    $(document.createElement('option'))
                                                                                    .val(l)
                                                                                    .html(l)
                                                                            );

                                                                            l = l+4;
                                                                        }
                                                                    }
                                                                }
                                                            ).change(function(){
                                                                var totalSum = 0;

                                                                $('.'+$(this).attr('sectionItemSeq')).each(function(){
                                                                    if($(this).val()!= '')
                                                                    {
                                                                        totalSum = parseInt(totalSum)+parseInt($(this).val());
                                                                    }
                                                                });

                                                                $('#'+$(this).attr('sectionItemSeq')).html(totalSum);

                                                                //답변처리
                                                                joinSurvey.resultAsk(qstInfo, '', this);
                                                            }).append(
                                                                function()
                                                                {
                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                                    {
                                                                        if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                                        {
                                                                            if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq] != undefined)
                                                                            {
                                                                                if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq] != undefined)
                                                                                {
                                                                                    if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq].askList[itemSeq] != undefined)
                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[sectionSeq].subQstList[subQstSeq].askList[itemSeq].addResponse);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            )
                                                        )//ui-block-b
                                                    );
                                                }

                                                if(qstInfo.sectionList[i].sectionOptionList['UNIT'].optionValue == 'CHECKED')
                                                {
                                                    var unitTmp = qstInfo.sectionList[i].sectionOptionList['UNIT'].subOptionValue.split('|');
                                                    if(unitTmp[1] == 'back')
                                                    {

                                                        $(this).append(
                                                            DOM.getDiv('ui-block-c').css({'width':'auto', 'line-height':'36px', 'margin-top':'5px'}).append(
                                                                    '&nbsp;&nbsp;'+unitTmp[0]
                                                            )
                                                        );
                                                    }
                                                }
                                            }
                                        )//ui-grid-a
                                    )//td
                                    .append(
                                        function () {
                                            if (qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                $(this).addClass('table_bold');
                                        }
                                    )
                                );
                            //}//for itemlist
                        //}//for sectionlist
                    }//function
                )
            );
        }

        //return $(this);
    };

	/**
	 * 상수합 미리보기
	 */
	this.prevConstantsum = function(qstInfo)
	{
		var returnObj = '';
		var sectionTitle = '';
		var tableWidth = 0;

		var tdCnt = 0;
		for(var i in qstInfo.sectionList)
		{
			tdCnt = tdCnt+parseInt(qstInfo.sectionList[i].itemCnt);
		}

		tableWidth = "100%";

		returnObj =
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
           $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).addClass("sur_padding").append(
				function()
				{   //단을 그림
					for(var i in qstInfo.sectionList)
					{
                        for(var ii in qstInfo.sectionList[i].itemList) {
                            $(this).append(
                                $(document.createElement('div')).append(DOM.getTable().addClass('poll_table'+' basic_table '+joinSurvey.surveyData.layoutDataMobile.body_table_type+' table_size1').attr({'width':tableWidth}).append(
                                    DOM.getTr().append(
                                        $(document.createElement('th')).attr({'rowspan':'2','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).css({'width':'170px'}).html('구분')
                                    ).append(
                                        function()
                                        {
                                            // 단제목
                                            $(this).append(
                                                $(document.createElement('th')).attr({'colspan':qstInfo.sectionList[i].itemList.length,'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop}).append(
                                                    qstInfo.sectionList[i].sectionTitle
                                                )
                                            );
                                        }
                                    )
                                ).append(
                                    DOM.getTr().append(//맨 좌측 th
                                        function()
                                        {
                                            // 항목
                                            var k = 0;
                                            //for(var j in qstInfo.sectionList[i].itemList)
                                            //{
                                                $(this).append(
                                                    $(document.createElement('th')).attr({'scope':'row'}).addClass('table_border_left').append(
                                                        DOM.getDiv()
                                                        .attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop+';margin:0 auto'})
                                                        .html(qstInfo.sectionList[i].itemList[ii].itemTitle)
                                                    )
                                                );
                                            //}
                                        }
                                    )
                                ).append(
                                    function()
                                    {
                                        joinSurvey.prevConstantsumLoop(qstInfo,$(this),i,ii);
                                    }
                                ).append(
                                    DOM.getTr().append(
                                        $(document.createElement('th')).attr({'style':'','scope':'row'}).append(
                                            '합계'
                                        )
                                    ).append(
                                        function()
                                        {
                                            //for(var j in qstInfo.sectionList)
                                            //{
                                            //    for(var k in qstInfo.sectionList[i].itemList)
                                            //    {
                                                    $(this).append(
                                                        $(document.createElement('td')).attr({'align':'center'}).append(
                                                            function()
                                                            {
                                                                if(qstInfo.sectionList[i].sectionOptionList['SUM'].optionValue == 'SUM')
                                                                {
                                                                    $(this).append(
                                                                        $(document.createElement('span')).attr({'id':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+ii}).html(0)
                                                                    );
                                                                }
                                                                else if(qstInfo.sectionList[i].sectionOptionList['SUM'].optionValue == 'SET')
                                                                {
                                                                    $(this).append(
                                                                        $(document.createElement('span')).attr({'id':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+ii}).html(0)
                                                                    ).append('/'+qstInfo.sectionList[i].sectionOptionList['SUM'].subOptionValue);
                                                                }
                                                            }
                                                        )
                                                    );
                                                //}//for itemlist
                                            //}//for sectionlist
                                        }
                                    )
                                )//table
                            )//this
                            )
                        }
                    }//for
                }//function
            );//filedset

		return returnObj;
	};

    /**
     * 테이블 미리보기
     */
    this.prevTable = function (qstInfo) {
        var returnObj = '';
        var sectionTitle = '';
        var tableWidth = 0;
        var sectionCnt = qstInfo.sectionList.length;
        var sectionOptionCnt = 0;
        var tdCnt = 0;
        var colTdCnt = 0;
        var sectionOptionStatus = 0;
        var table_size_class = (qstInfo.qstType=="TABLE")?"table_size4":"table_size1";

        for (var i in qstInfo.sectionList) {
            if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT') {
                tdCnt = tdCnt + 1;

            }
            else {
                tdCnt = tdCnt + parseInt(qstInfo.sectionList[i].itemCnt);
                if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT') {
                    sectionOptionCnt = tdCnt * 1;
                    sectionOptionStatus = sectionOptionStatus + 1;
                }
            }
        }

        //단->하위섹션
        //colTdCnt=
        if (sectionCnt > 1) {

            if (sectionOptionStatus > 0) {
                colTdCnt = 8 - sectionOptionCnt;
            } else {
                colTdCnt = 8 - sectionOptionCnt;
            }


        } else {

            if (sectionOptionStatus > 0) {
                colTdCnt = 5;
            } else {
                colTdCnt = 8;
            }
        }

//console.log('테이블-sectionOptionStatus:'+sectionOptionStatus);
//console.log('테이블-sectionCnt:'+sectionCnt);
//console.log('테이블-sectionOptionCnt:'+sectionOptionCnt);
//console.log('테이블-tdCnt:'+tdCnt+'테이블-colTdCnt:'+colTdCnt);

        tableWidth = (tdCnt * 150) + 250;
        if (tableWidth < 400) {
            tableWidth = 400;
        }


        if (tdCnt < colTdCnt) {
            tableWidth = "100%";
        }

        var thWidth = "";

        returnObj =

            $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).addClass("sur_padding").append(

                function()
				{   //단을 그림
					for(var i in qstInfo.sectionList)
					{
                        for(var ii in qstInfo.sectionList[i].itemList) {
                            $(this).append(
                                $('<table>').attr({'width': '100%'}).addClass('poll_table' + ' basic_table ' + joinSurvey.surveyData.layoutDataMobile.body_table_type + ' ' + table_size_class).append(
                                    $('<tbody>').append(
                                        $('<tr>').append(
                                            $('<th>').attr({
                                                'rowspan': '2'
                                                ,'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop
                                            }).html('구분')
                                        ).append(
                                            function () {
                                                //단을 그림table_border_left
                                                //for (var i in qstInfo.sectionList) {
                                                    $(this).append(
                                                        $(document.createElement('th')).attr({
                                                            'colspan': qstInfo.sectionList[i].itemList.length
                                                            ,'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop
                                                        }).append(
                                                            qstInfo.sectionList[i].sectionTitle
                                                        )
                                                    );
                                                //}
                                            }
                                        )
                                    ).append(
                                        $('<tr>').append(
                                            function () {
                                                //for (var i in qstInfo.sectionList) {
                                                //    for (var j in qstInfo.sectionList[i].itemList) {
                                                        $(this).append(
                                                            $(document.createElement('th')).attr({'style': "width:10px;"}).addClass('table100_th01 table_border_left').append(
                                                                DOM.getDiv()
                                                                    .attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop+';margin:0 auto'})
                                                                    .html(qstInfo.sectionList[i].itemList[ii].itemTitle)
                                                            )
                                                        );
                                                    //}
                                                //}
                                            }
                                        )
                                    ).append(
                                        function () {
                                            for (var qi in qstInfo.subQstList) {
                                                $(this).append(
                                                    $('<tr>').append(
                                                        $('<td>').html(function () {
                                                            if (joinSurvey.htmlChecker(qstInfo.subQstList[qi].qstTitle) == false) {
                                                            }
                                                        }).append(
                                                            $('<div>').append(
                                                                $('<ul>').append(
                                                                    $('<li>').append($('<span>').addClass('text_text_margin_right')
                                                                    .attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table).append(joinSurvey.qstCommentChecker(qstInfo.subQstList[qi].qstTitle))).append(
                                                                        function () {
                                                                            if (qstInfo.subQstList[qi].qstOptionList['INPUT'].optionValue == 'CHECKED')//서술형
                                                                            {
                                                                                $(this).append(
                                                                                    $('<span>').css({
                                                                                        'display': 'block',
                                                                                        'clear': 'both'
                                                                                    }).append(
                                                                                        DOM.getTextBox().addClass('input_02 etcInput')
                                                                                            .attr({
                                                                                                'grpSeq': qstInfo.grpSeq,
                                                                                                'qstSeq': qstInfo.qstSeq,
                                                                                                'qstType': qstInfo.qstType,
                                                                                                'subQstSeq': qstInfo.subQstList[qi].qstSeq
                                                                                            })
                                                                                    )
                                                                                );
                                                                            }
                                                                        }
                                                                    )
                                                                )
                                                            )
                                                        ).append(
                                                            function () {
                                                                if (qstInfo.subQstList[qi].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                    $(this).addClass('table_bold');
                                                            }
                                                        )
                                                    ).append(
                                                        function () {
                                                            //for (var j in qstInfo.sectionList) {
                                                                if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT') {
                                                                    //for (var k in qstInfo.sectionList[i].itemList) {
                                                                        $(this).append(
                                                                            $(document.createElement('td')).attr({'align': 'center'}).append(
                                                                                $('<select>').addClass('table_input_03').attr("style","width:90%;").append(
                                                                                    function () {
                                                                                        $(this).append(
                                                                                            $('<option>').val('').text('항목을 선택하세요.')
                                                                                        );

                                                                                        if (qstInfo.sectionList[i].itemList[ii].subItemList[i] != undefined) {
                                                                                            //	console.log(qstInfo.sectionList[i].itemList[ii].subItemList[i]);
                                                                                            for (var l in qstInfo.sectionList[i].itemList[ii].subItemList[i].subItemOptionList) {
                                                                                                var optionValue = qstInfo.sectionList[i].itemList[ii].subItemList[i].subItemOptionList[l];
                                                                                                $(this).append(
                                                                                                    $(document.createElement('option'))
                                                                                                        //.val(optionValue)
                                                                                                        .val(parseInt(l)+1)
                                                                                                        .html(optionValue)
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                ).attr({
                                                                                        'sectionSeq': qstInfo.sectionList[i].sectionSeq,
                                                                                        'subQstSeq': qstInfo.subQstList[qi].qstSeq,
                                                                                        'itemType': 'SELECT',
                                                                                        'itemSeq': parseInt(ii) + 1
                                                                                    })
                                                                                    .change(function () {
                                                                                        //답변처리
                                                                                        joinSurvey.resultAsk(qstInfo, '', this);
                                                                                    })
                                                                            ).append(
                                                                                function () {
                                                                                    if (qstInfo.subQstList[qi].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                                        $(this).addClass('table_bold');
                                                                                }
                                                                            ).append(
                                                                                function () {
                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined) {
                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq] != undefined) {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].sectionSeq] != undefined)
                                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].sectionSeq].addResponse);
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                    //}

                                                                }
                                                                else {
                                                                    //dropdown이 아닐경우
                                                                    //for (var k in qstInfo.sectionList[i].itemList) {
                                                                        $(this).append(
                                                                            $(document.createElement('td')).attr({'align': 'center'}).append(
                                                                                function () {
                                                                                    if (qstInfo.subQstList[qi].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                                        $(this).addClass('table_bold');

                                                                                    if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO') {
                                                                                        $(this).append(
                                                                                            DOM.getRadioButton('item_' + qstInfo.qstSeq + '_' + i + '_' + j)
                                                                                                .addClass('input_02')
                                                                                                .attr({
                                                                                                    'sectionSeq': qstInfo.sectionList[i].sectionSeq,
                                                                                                    'subQstSeq': qstInfo.subQstList[qi].qstSeq,
                                                                                                    'itemType': 'RADIO',
                                                                                                    'itemSeq': qstInfo.sectionList[i].itemList[ii].itemSeq
                                                                                                })
                                                                                                .val(qstInfo.sectionList[i].itemList[ii].itemSeq)
                                                                                                .change(function () {
                                                                                                    //답변처리
                                                                                                    
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                }).append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined) {
                                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq] != undefined) {
                                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].sectionSeq] != undefined) {
                                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].sectionSeq].addResponse == qstInfo.sectionList[i].itemList[ii].itemSeq)
                                                                                                                            $(this).prop('checked', true);
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                    else if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX') {
                                                                                        
                                                                                        $(this).append(
                                                                                            DOM.getCheckBox()
                                                                                                .addClass('input_02')
                                                                                                .attr({
                                                                                                    'sectionSeq': qstInfo.sectionList[i].sectionSeq,
                                                                                                    'subQstSeq': qstInfo.subQstList[qi].qstSeq,
                                                                                                    'itemType': 'CHECKBOX'
                                                                                                })
                                                                                                .val(qstInfo.sectionList[i].itemList[ii].itemSeq)                                                                                                
                                                                                                .change(function () {
                                                                                                    //답변처리
                                                                                                    console.log($(this).attr('subqstseq'));	
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                })
                                                                                                .append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined) {
                                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq] != undefined) {
                                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].itemList[ii].itemSeq] != undefined)
                                                                                                                        $(this).prop('checked', true);
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            ).click( function(e){
                        																				e.stopPropagation();
                                                                                                        ////////
                        
                                                                                                        ///////체크가능 갯수 -  갯수
                                                                                                        console.log(qstInfo.qstSeq);	
                                                                                                       
                                                                                                        console.log($(this).attr('subQstSeq'));	 
                                                                                                        var subQstSeqCnt = parseInt(qstInfo.qstSeq+$(this).attr('subQstSeq'));
                                                                                                        if(joinSurvey.sectionTypeCnt[subQstSeqCnt] == undefined)
                        																				{
                        																					joinSurvey.sectionTypeCnt[subQstSeqCnt] = {'cnt':0};
                        																				}
                        																				
                        																				if(this.checked){//checked 처리된 항목의 값
                                                                                                
                                                                                                           // alert(this.value); 
                                                                                                           joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt++;                                                                                   
                                                                                                           //joinSurvey.sectionTypeCnt[qstInfo.qstSeq].subOptionCnt[qstInfo.sectionList[j].sectionSeq].cnt++;
                        
                                                                                                        }else{
                                                                                                           joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--; 
                                                                                                        }
                        																				console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt);
                                                                                                       // console.log(qstInfo.qstOptionList);
                        					                                                            
                        					                                                            
                                                                                                        
                                                                                						if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                                						{
                                                                                							var subOptionValTmp = qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');
                                       								                                         console.log(subOptionValTmp);
                                                                                                         
                                                                                                            
                                                                            								for(var k in qstInfo.sectionList[j].itemList)
                                                                            								{
                                                                            									
                                                                                                                
                                                                                                                if(subOptionValTmp[0] == subOptionValTmp[1])
                                                                                                                {
                                                                                        							if(subOptionValTmp[0] > joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                        							{
                                                                                        //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                        								alertLayer('값을 '+subOptionValTmp[0]+'개 까지 선택하여 주시기 바랍니다.');
                                                                                        								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                        								return false;
                                                                                        							}
                                                                                        							else if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                        							{
                                                                                        //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                        								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                        								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                        								return false;
                                                                                        							}
                                                                                                                }else{
                                                                                                                    
                                                                                        							if(subOptionValTmp[0] > joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                        							{
                                                                                        //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                        								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.');
                                                                                        								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                        								return false;
                                                                                        							}
                                                                                        							else if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                        							{
                                                                                        //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                        								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                        								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                        								return false;
                                                                                        							}
                                                                                                                }
                                                                            
                                                                            								}
                                                                                                            
                                                                                                            
                                                                                						}                                                                                                    
                        
                        					                                                            ///////체크가능 갯수 -  갯수                                                                                                   
                                                                                                
                                                                                                
                        																	} )
                                                                                        );
                                                                                    }
                                                                                    else if (qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT') {
                                                                                        $(this).append(
                                                                                            DOM.getTextBox()
                                                                                                .addClass('input_02')
                                                                                                .attr({
                                                                                                    'sectionSeq': qstInfo.sectionList[i].sectionSeq,
                                                                                                    'subQstSeq': qstInfo.subQstList[qi].qstSeq,
                                                                                                    'itemType': 'INPUT',
                                                                                                    'itemSeq': qstInfo.sectionList[i].itemList[ii].itemSeq
                                                                                                })
                                                                                                .change(function () {
                                                                                                    //답변처리
                                                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                }).append(
                                                                                                function () {
                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined) {
                                                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq] != undefined) {
                                                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].itemList[ii].itemSeq] != undefined)
                                                                                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[qi].qstSeq].askList[qstInfo.sectionList[i].itemList[ii].itemSeq].addResponse);
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                    //}
                                                                }
                                                            //}
                                                        }
                                                    )
                                                );
                                            }
                                        }
                                    )
                                )
                            )
                        }
                    }
                }
            );


        DOM.getTable().addClass('table_100' + ' ' + joinSurvey.surveyData.layoutDataNew.body_table_type).attr({'width': tableWidth}).append(
            function () {
                for (var i in qstInfo.subQstList) {
                    $(this).append(
                        DOM.getTr().append(
                            $(document.createElement('td')).html(function () {
                                if (joinSurvey.htmlChecker(qstInfo.subQstList[i].qstTitle) == false) {
                                    $(this).attr("style", joinSurvey.surveyData.layoutDataNew.body_font_table)
                                }
                            }).append(
//								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataNew.body_font_table}).append(
                                DOM.getDiv().append(
                                    $(document.createElement('ul')).append(
                                        $(document.createElement('li')).append($('<span>').addClass('text_text_margin_right')
                                        .attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).append(joinSurvey.qstCommentChecker(qstInfo.subQstList[i].qstTitle))).append(
                                            function () {
                                                if (qstInfo.subQstList[i].qstOptionList['INPUT'].optionValue == 'CHECKED')//서술형
                                                {
                                                    $(this).append(
                                                        $(document.createElement('span')).css({
                                                            'display': 'block',
                                                            'clear': 'both'
                                                        }).append(
                                                            DOM.getTextBox().addClass('input_02 etcInput')
                                                                .attr({
                                                                    'grpSeq': qstInfo.grpSeq,
                                                                    'qstSeq': qstInfo.qstSeq,
                                                                    'qstType': qstInfo.qstType,
                                                                    'subQstSeq': qstInfo.subQstList[i].qstSeq
                                                                })
                                                        )
                                                    );
                                                }
                                            }
                                        )
                                    )
                                )
                            ).append(
                                function () {
                                    if (qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                        $(this).addClass('table_bold');
                                }
                            )
                        ).append(
                            function () {
                                for (var j in qstInfo.sectionList) {
                                    if (qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT') {
                                        //dropdown일 경우
                                        $(this).append(
                                            $(document.createElement('td')).attr({'align': 'center'}).append(
                                                $(document.createElement('select')).attr("style","width:90%;").append(
                                                    function () {
                                                        $(this).append(
                                                            $(document.createElement('option'))
                                                                .val('')
                                                                .html('항목을 선택하세요.')
                                                        );

                                                        for (var k in qstInfo.sectionList[j].itemList) {
                                                            $(this).append(
                                                                $(document.createElement('option'))
                                                                    .val(qstInfo.sectionList[j].itemList[k].itemSeq)
                                                                    .html(qstInfo.sectionList[j].itemList[k].itemTitle)
                                                            );
                                                        }
                                                    }
                                                ).attr({
                                                        'sectionSeq': qstInfo.sectionList[j].sectionSeq,
                                                        'subQstSeq': qstInfo.subQstList[i].qstSeq,
                                                        'itemType': 'SELECT',
                                                        'itemSeq': 1
                                                    })
                                                    .change(function () {
                                                        //답변처리
                                                        joinSurvey.resultAsk(qstInfo, '', this);
                                                    }).append(
                                                    function () {
                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined) {
                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined) {
                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] != undefined)
                                                                            $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq].addResponse);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                )
                                            )
                                        );
                                    }
                                    else {
                                        //dropdown이 아닐경우
                                        for (var k in qstInfo.sectionList[j].itemList) {
                                            $(this).append(
                                                $(document.createElement('td')).attr({'align': 'center'}).append(
                                                    function () {
                                                        if (qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                            $(this).addClass('table_bold');

                                                        if (qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO') {
                                                            $(this).append(
                                                                DOM.getRadioButton('item_' + qstInfo.qstSeq + '_' + i + '_' + j)
                                                                    .addClass('input_02')
                                                                    .attr({
                                                                        'sectionSeq': qstInfo.sectionList[j].sectionSeq,
                                                                        'subQstSeq': qstInfo.subQstList[i].qstSeq,
                                                                        'itemType': 'RADIO',
                                                                        'itemSeq': qstInfo.sectionList[j].itemList[k].itemSeq
                                                                    })
                                                                    .val(qstInfo.sectionList[j].itemList[k].itemSeq)
                                                                    .change(function () {
                                                                        //답변처리
                                                                        joinSurvey.resultAsk(qstInfo, '', this);
                                                                    }).append(
                                                                    function () {
                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined) {
                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined) {
                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] != undefined) {
                                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq].addResponse == qstInfo.sectionList[j].itemList[k].itemSeq)
                                                                                                $(this).prop('checked', true);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                )
                                                            );
                                                        }
                                                        else if (qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX') {
                                                            $(this).append(
                                                                DOM.getCheckBox()
                                                                    .addClass('input_02')
                                                                    .attr({
                                                                        'sectionSeq': qstInfo.sectionList[j].sectionSeq,
                                                                        'subQstSeq': qstInfo.subQstList[i].qstSeq,
                                                                        'itemType': 'CHECKBOX'
                                                                    })
                                                                    .val(qstInfo.sectionList[j].itemList[k].itemSeq)
                                                                    .change(function () {
                                                                        //답변처리
                                                                    
                                                                        joinSurvey.resultAsk(qstInfo, '', this);
                                                                    }).append(
                                                                    function () {
                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined) {
                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined) {
                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] != undefined)
                                                                                            $(this).prop('checked', true);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                ).click( function(e){
																			e.stopPropagation();
                                                                            ////////

                                                                            ///////체크가능 갯수 -  갯수
                                                                            console.log(qstInfo.qstSeq);	
                                                                            
                                                                            console.log($(this).attr('subQstSeq'));	 
                                                                            var subQstSeqCnt = parseInt(qstInfo.qstSeq+$(this).attr('subQstSeq'));
                                                                            if(joinSurvey.sectionTypeCnt[subQstSeqCnt] == undefined)
																			{
																				joinSurvey.sectionTypeCnt[subQstSeqCnt] = {'cnt':0};
																			}
																			
																			if(this.checked){//checked 처리된 항목의 값
                                                                    
                                                                               // alert(this.value); 
                                                                               joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt++;                                                                                   
                                                                               //joinSurvey.sectionTypeCnt[qstInfo.qstSeq].subOptionCnt[qstInfo.sectionList[j].sectionSeq].cnt++;

                                                                            }else{
                                                                               joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--; 
                                                                            }
																			console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt);
                                                                           // console.log(qstInfo.qstOptionList);
				                                                            
				                                                            
                                                                            
                                                    						if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                    						{
                                                    							var subOptionValTmp = qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');
           								                                         console.log(subOptionValTmp);
                                                                             
                                                                                
                                                								for(var k in qstInfo.sectionList[j].itemList)
                                                								{
                                                									
                                                                                    
                                                                                    if(subOptionValTmp[0] == subOptionValTmp[1])
                                                                                    {
                                                            							if(subOptionValTmp[0] > joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                            							{
                                                            //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                            								alertLayer('값을 '+subOptionValTmp[0]+'개 까지 선택하여 주시기 바랍니다.');
                                                            								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                            								return false;
                                                            							}
                                                            							else if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                            							{
                                                            //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                            								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                            								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                            								return false;
                                                            							}
                                                                                    }else{
                                                                                        
                                                            							if(subOptionValTmp[0] > joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                            							{
                                                            //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                            								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.');
                                                            								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                            								return false;
                                                            							}
                                                            							else if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                            							{
                                                            //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                            								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                            								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                            								return false;
                                                            							}
                                                                                    }
                                                
                                                								}
                                                                                
                                                                                
                                                    						}                                                                                                    

				                                                            ///////체크가능 갯수 -  갯수                                                                                                   
                                                                    
                                                                    
																} )
                                                            );
                                                        }
                                                        else if (qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT') {
                                                            $(this).append(
                                                                DOM.getTextBox()
                                                                    .addClass('input_02')
                                                                    .attr({
                                                                        'sectionSeq': qstInfo.sectionList[j].sectionSeq,
                                                                        'subQstSeq': qstInfo.subQstList[i].qstSeq,
                                                                        'itemType': 'INPUT',
                                                                        'itemSeq': qstInfo.sectionList[j].itemList[k].itemSeq
                                                                    })
                                                                    .change(function () {
                                                                        //답변처리
                                                                        joinSurvey.resultAsk(qstInfo, '', this);
                                                                    }).append(
                                                                    function () {
                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined) {
                                                                            if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined) {
                                                                                if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined) {
                                                                                    if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined) {
                                                                                        if (joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] != undefined)
                                                                                            $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq].addResponse);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                )
                                                            );
                                                        }
                                                    }
                                                )
                                            );
                                        }
                                    }
                                }
                            }
                        )
                    );
                }
            }
        )
        ;


        return returnObj;
    };


	/**
	 * 테이블 미리보기 (1)
	 */
	this.prevTableOne = function(qstInfo)
	{
		var returnObj = '';
		var sectionTitle = '';
		var tableWidth = 0;
		var sectionCnt=qstInfo.sectionList.length;
		var sectionOptionCnt = 0;
		var tdCnt = 0;
        var colTdCnt = 0;
        var sectionOptionStatus = 0;

        if(joinSurvey.sectionTypeCnt == undefined)
        {
            joinSurvey.sectionTypeCnt = {};
        
        }else{
            delete  joinSurvey.sectionTypeCnt;
            joinSurvey.sectionTypeCnt = {};
        }

		for(var i in qstInfo.sectionList)
		{
			if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
            {
				tdCnt = tdCnt+1;

            }
			else{
				tdCnt = tdCnt+parseInt(qstInfo.sectionList[i].itemCnt);
                if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
                {
                    sectionOptionCnt = tdCnt*1;
                    sectionOptionStatus = sectionOptionStatus+1;
                }
            }
		}

        //단->하위섹션
        //colTdCnt=
        if(sectionCnt  > 1){

            if(sectionOptionStatus > 0)
            {
                colTdCnt=8-sectionOptionCnt;
            }else{
                colTdCnt=8-sectionOptionCnt;
            }


        }else{

            if(sectionOptionStatus > 0)
            {
                colTdCnt=5;
            }else{
                colTdCnt=8;
            }
        }

console.log('테이블-sectionOptionStatus:'+sectionOptionStatus);
console.log('테이블-sectionCnt:'+sectionCnt);
console.log('테이블-sectionOptionCnt:'+sectionOptionCnt);
console.log('테이블-tdCnt:'+tdCnt+'테이블-colTdCnt:'+colTdCnt);

		tableWidth = (tdCnt*150)+250;
		if(tableWidth < 400) {
			tableWidth = 400;
		}


		if (tdCnt < colTdCnt)
		{
			tableWidth = "100%";
		}

        var thWidth="";


        if(sectionCnt > 1)
        {
            switch (tdCnt)
            {
                    case 1 : thWidth = "width:150px;"; break;
                    case 2 : thWidth = "width:200px;"; break;
                    case 3 : thWidth = "width:200px;"; break;
                    case 4 : thWidth = "width:200px;"; break;
                    case 5 : thWidth = "width:30px;"; break;
                    case 6 : thWidth = "width:25px;"; break;
                    case 7 : thWidth = "width:20px;"; break;
                    default: thWidth = "width:15px;"; break;

            }

        }else{
            switch (tdCnt)
            {
                    case 1 : thWidth = "width:150px;"; break;
                    case 2 : thWidth = "width:200px;"; break;
                    case 3 : thWidth = "width:250px;"; break;
                    case 4 : thWidth = "width:300px;"; break;
                    case 5 : thWidth = "width:350px;"; break;
                    case 6 : thWidth = "width:400px;"; break;
                    case 7 : thWidth = "width:450px;"; break;
                    default: thWidth = "width:15px;"; break;

            }

        }

        var tdWidthPer = 0;

        try{
            tdWidthPer = Math.round(60/tdCnt);
        }
        catch(e) { }


        tableWidth = "100%";

		returnObj =
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
           $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).addClass("sur_padding").append(


				function()
				{   //단을 그림
					for(var i in qstInfo.sectionList)
					{
    				    $(this).append(

                			DOM.getTable().addClass('poll_table' + ' basic_table ' + joinSurvey.surveyData.layoutDataMobile.body_table_type + ' table_size4').attr({'width':tableWidth}).append(
                				DOM.getTr().append(
                					$(document.createElement('th')).attr({'rowspan':'2','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop}).html('구분')
                				).append(
                					function()
                					{
                						//단을 그림table_border_left
                						//for(var i in qstInfo.sectionList)
                						//{
                							if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
                							{
                								$(this).append(
                									$(document.createElement('th')).attr({'scope':'row'}).append(
                										//$(document.createElement('ul')).append(
                										//	$(document.createElement('li')).append(qstInfo.sectionList[i].sectionTitle)
                										//)
                                                        qstInfo.sectionList[i].sectionTitle
                									)
                								);
                							}
                							else
                							{
                								$(this).append(
                									$(document.createElement('th')).attr({'colspan':qstInfo.sectionList[i].itemList.length,'style':thWidth+';'+joinSurvey.surveyData.layoutDataMobile.body_font_tabletop,'scope':'row'}).append(
                										//$(document.createElement('ul')).append(
                										//	$(document.createElement('li')).append(qstInfo.sectionList[i].sectionTitle)
                										//)
                                                        qstInfo.sectionList[i].sectionTitle
                									)
                								);
                							}
                						//}
                					}
                				)
                			).append(
                				DOM.getTr().append(//단 하단
                					function()
                					{
                						//for(var i in qstInfo.sectionList)
                						//{
                							if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
                							{
                								$(this).append($(document.createElement('th')).addClass('table_border_left').append('내용을 선택하세요.'));
                							}
                							else
                							{
                								for(var j in qstInfo.sectionList[i].itemList)
                								{
                									$(this).append(
                										$(document.createElement('th')).attr({'scope':'row','style':joinSurvey.surveyData.layoutDataMobile.body_font_tabletop}).addClass('table_border_left').append(

                                                            qstInfo.sectionList[i].itemList[j].itemTitle
                										)
                									);
                								}
                							}
                						//}
                					}
                				)
                			).append(
                				function()
                				{
                					for(var h in qstInfo.subQstList)
                					{
                						$(this).append(
                							DOM.getTr().append(//좌측 td
                								$(document.createElement('td')).html(function(){
                									if (joinSurvey.htmlChecker(qstInfo.subQstList[h].qstTitle) == false)
                									{
                										$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
                									}
                								}).append(
                //								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).append(
                									DOM.getDiv().append(
                										//$(document.createElement('ul')).append(
                											//$(document.createElement('li')).append(
                                                                qstInfo.subQstList[h].qstTitle
                                                            ).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
                                                            .append(
                												function()
                												{
                													if(qstInfo.subQstList[h].qstOptionList['INPUT'].optionValue == 'CHECKED')//서술형
                													{
                														$(this).append(
                															$(document.createElement('span')).css({'display':'block', 'clear':'both'}).append(
                																DOM.getTextBox().addClass('input_02 etcInput')
                																.attr({
                																	'grpSeq' : qstInfo.grpSeq,
                																	'qstSeq': qstInfo.qstSeq,
                																	'qstType' : qstInfo.qstType,
                																	'subQstSeq' : qstInfo.subQstList[h].qstSeq
                																})
                															)
                														);
                													}
                												}
                											)
                										//)
                									//)//
                								).append(
                									function()
                									{
                										if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                											$(this).addClass('table_bold');
                									}
                								)
                							).append(
                								function()
                								{
                									//for(var j in qstInfo.sectionList)
                									//{
                										if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
                										{
                											//dropdown일 경우
                											$(this).append(
                												$(document.createElement('td')).attr({'align':'center','style':'padding:0px 10px'}).append(
                													$(document.createElement('select')).append(
                														function()
                														{
                															$(this).append(
                																$(document.createElement('option'))
                																.val('')
                																.html('항목을 선택하세요.')
                															);

                															for(var k in qstInfo.sectionList[i].itemList)
                															{
                																$(this).append(
                																	$(document.createElement('option'))
                																	.val(qstInfo.sectionList[i].itemList[k].itemSeq)
                																	.html(qstInfo.sectionList[i].itemList[k].itemTitle)
                																);
                															}
                														}
                													).attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq, 'itemType':'SELECT', 'itemSeq':1})
                													.change(function(){
                														//답변처리
                														joinSurvey.resultAsk(qstInfo, '', this);
                													}).append(
                														function(){
                															if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                															{
                																if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                																{
                																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined)
                																	{
                																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq] != undefined)
                																		{
                																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].sectionSeq] != undefined)
                																				$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].sectionSeq].addResponse);
                																		}
                																	}
                																}
                															}
                														}
                													)
                												).append(
                                                                    function () {
                                                                        if (qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                            $(this).addClass('table_bold');
                                                                    }
                                                                )
                											);
                										}
                										else
                										{
                											//dropdown이 아닐경우
                											for(var k in qstInfo.sectionList[i].itemList)
                											{
                												$(this).append(
                													$(document.createElement('td')).attr({'align':'center','style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).css("width",tdWidthPer+"%").addClass('poll_table_multi_radio').append(
                				                                        DOM.getTable().append(//라디오버튼 가로정렬위한 테이블
                                                                            DOM.getTr().append(
                        														function()
                        														{
                        															//if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                        																//$(this).addClass('table_bold');

                        															if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO')
                        															{
                        																$(this).append(
                    												                        $(document.createElement('td')).attr({'align':'center'}).append(

                                                                                                $(document.createElement('label')).append(
                                																	DOM.getRadioButton('item_'+qstInfo.qstSeq+'_'+h+'_'+i)
                                																	.addClass('input_02')
                                																	.attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq, 'itemType':'RADIO', 'itemSeq':qstInfo.sectionList[i].itemList[k].itemSeq})
                                																	.val(qstInfo.sectionList[i].itemList[k].itemSeq)
                                																	.change(function(){
                                																		//답변처리
                                																		joinSurvey.resultAsk(qstInfo, '', this);
                                																	}).append(
                                																		function(){
                                																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                																			{
                                																				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                																				{
                                																					if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined)
                                																					{
                                																						if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq] != undefined)
                                																						{
                                																							if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].sectionSeq] != undefined)
                                																							{
                                																								if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].sectionSeq].addResponse == qstInfo.sectionList[i].itemList[k].itemSeq)
                                																									$(this).prop('checked', true);
                                																							}
                                																						}
                                																					}
                                																				}
                                																			}
                                																		}
                                																	)
                                                                                                )//label
                                                                                            )//td
                        																);
                        															}
                        															else if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX')
                        															{
                        																$(this).append(
                                                                                            $(document.createElement('td')).attr({'align':'center'}).append(
                                                                                                $(document.createElement('label')).append(
                                																	DOM.getCheckBox()
                                																	.addClass('input_02')
                                																	.attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq, 'itemType':'CHECKBOX'})
                                																	.val(qstInfo.sectionList[i].itemList[k].itemSeq)
                                																	/*.change(function(){
                                																		//답변처리
                                																		joinSurvey.resultAsk(qstInfo, '', this);
                                																	})*/
                                                                                                    .append(
                                																		function(){
                                																		  //////checked
                                                                                                            var subQstSeqCnt3 = parseInt(qstInfo.qstSeq+$(this).attr('subQstSeq'));
                                                                                                            //console.log(subQstSeqCnt2);
                                                                                                            
                                                                                                             
                                                                                                            if(joinSurvey.sectionTypeCnt[subQstSeqCnt3] == undefined)
                            																				{
                            																					joinSurvey.sectionTypeCnt[subQstSeqCnt3] = {'cnt':0};
                                                                                                                
                            																				}    
                                                                                                            console.log('cnt0:');
                                                                                                            console.log(subQstSeqCnt3);
                                                                                                                console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt3].cnt);
                                                                                                            ///////                            																		  
                                																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                																			{
                                																				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                																				{
                                																					if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined)
                                																					{
                                																						if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq] != undefined)
                                																						{
                                																							if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].itemList[k].itemSeq] != undefined)
                                                                                                                            {
                                                                                                                            
                                                                                                                                
                                                																				
                                                                                                                                                                                                                   
                                                                                                                                joinSurvey.sectionTypeCnt[subQstSeqCnt3].cnt++;
            																													                                                                                                                            
                                																								$(this).prop('checked', true);
                                                                                                                            }
                                																						}
                                																					}
                                																				}
                                																			}
                                                                                                            
                                                                                                            console.log('cnt0000:');
                                                                                                            console.log(subQstSeqCnt3);
                                                                                                                console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt3].cnt);
                                																		}
                                																	)//체크박스
                                                                                                    .change( function(e){
                                																				e.stopPropagation();
                                                                                                                ////////
                                
                                                                                                                ///////체크가능 갯수 -  갯수
                                                                                                                console.log(qstInfo.qstSeq);	
                                                                                                                
                                                                                                                console.log($(this).attr('subQstSeq'));	 
                                                                                                                var subQstSeqCnt = parseInt(qstInfo.qstSeq+$(this).attr('subQstSeq'));
                                                                                                                console.log('cnt1:');
                                                                                                                console.log(subQstSeqCnt);
                                																				//console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt);
                                                                                                                if(joinSurvey.sectionTypeCnt[subQstSeqCnt] == undefined)
                                																				{
                                																					joinSurvey.sectionTypeCnt[subQstSeqCnt] = {'cnt':0};
                                																				}
                                																				
                                																				if(this.checked){//checked 처리된 항목의 값
                                                                                                        
                                                                                                                   // alert(this.value); 
                                                                                                                   joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt++;                                                                                   
                                                                                                                   //joinSurvey.sectionTypeCnt[qstInfo.qstSeq].subOptionCnt[qstInfo.sectionList[j].sectionSeq].cnt++;
                                
                                                                                                                }else{
                                                                                                                   joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--; 
                                                                                                                   //$(this).prop('checked', false);                                                                                                                   
                                                                                                                }
                                                                                                                console.log('cnt2:');
                                																				console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt);
                                                                                                               // console.log(qstInfo.qstOptionList);
                                					                                                            
                                					                                                            
                                                                                                                
                                                                                        						if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
                                                                                        						{
                                                                                        							var subOptionValTmp = qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');
                                               								                                         console.log(subOptionValTmp);
                                                                                                                 
                                                                                                                    
                                                                                    								for(var k in qstInfo.sectionList[i].itemList)
                                                                                    								{
                                                                                    									
                                                                                                                        
                                                                                                                        if(subOptionValTmp[0] == subOptionValTmp[1])
                                                                                                                        {
                                                                                                							if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                                							{
                                                                                                //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                                                                $(this).prop('checked', false); 
                                                                                                                                joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--;
                                                                                                								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                                								return false;
                                                                                                							}
                                                                                                                            else{
                                                                                                                                joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                                            }
                                                                                                                        }else{
                                                                                                                            
                                                                                                							/*if(subOptionValTmp[0] > joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                                							{
                                                                                                //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.');
                                                                                                                                $(this).prop('checked', false); 
                                                                                                                                joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--;
                                                                                                								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                                								return false;
                                                                                                							}
                                                                                                							else */
                                                                                                                            if(subOptionValTmp[1] < joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt)
                                                                                                							{
                                                                                                //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
                                                                                                								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
                                                                                                                                $(this).prop('checked', false); 
                                                                                                                                joinSurvey.sectionTypeCnt[subQstSeqCnt].cnt--;
                                                                                                								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
                                                                                                								return false;
                                                                                                							}else{
                                                                                                							    joinSurvey.resultAsk(qstInfo, '', this);
                                                                                                							}
                                                                                                                        }
                                                                                    
                                                                                    								}
                                                                                                                    
                                                                                                                    
                                                                                        						}else{
                                                                                  						            joinSurvey.resultAsk(qstInfo, '', this);
                                                                                        						}                                                                                                     
                                
                                					                                                            ///////체크가능 갯수 -  갯수                                                                                                   
                                                                                                        
                                                                                                        
                                																	} )//.trigger('change')
                                                                                                )//label
                                                                                            )//td
                        																);
                        															}
                        															else if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
                        															{
                        																$(this).append(
                                                                                            $(document.createElement('td')).attr({'align':'center','style':'padding:0px 10px'}).append(
                            																	DOM.getTextBox()
                            																	.addClass('')
                            																	.attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq, 'itemType':'INPUT', 'itemSeq':qstInfo.sectionList[i].itemList[k].itemSeq})
                            																	.change(function(){
                            																		//답변처리
                            																		joinSurvey.resultAsk(qstInfo, '', this);
                            																	}).append(
                            																		function(){
                            																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                            																			{
                            																				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                            																				{
                            																					if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq] != undefined)
                            																					{
                            																						if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq] != undefined)
                            																						{
                            																							if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].itemList[k].itemSeq] != undefined)
                            																								$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[qstInfo.sectionList[i].itemList[k].itemSeq].addResponse);
                            																						}
                            																					}
                            																				}
                            																			}
                            																		}
                            																	)//input text
                                                                                            )//td
                        																);
                        															}
                        														}
                                                                            )//tr
                                                                        )//table
                													).append(
                                                                    function () {
                                                                        if (qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                                                                            $(this).addClass('table_bold');
                                                                        }
                                                                    )
                												);
                											}//for
                										}//dropdown 아님
                									//}//for
                								}
                							)
                						);
                					}//for
                				}//function
                			)//table
                        )//this
                    }//for
            }//function
		)//fieldset
        ;

		return returnObj;
	};


	/**
	 * 답변처리
     * joinSurvey.resultAsk(qstInfo, 'MULTI', $( this ).parents('td').find('input:first'), checkSelectCnt);
	 */
	this.resultAsk = function(qstInfo, itemType, formId, selectIndex,etcOption)
	{
        console.log('resultAsk');
		if(joinSurvey.joinData.grpList[qstInfo.grpSeq] == undefined){//create group index
			joinSurvey.joinData.grpList[qstInfo.grpSeq] = {'qstList' : {}};
		}

		if(qstInfo.qstType == 'MULTI' || qstInfo.qstType == 'OPEN' || qstInfo.qstType == 'RANK')
		{

			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] == undefined) //create question index
			{
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] = {'askList' : {}};
				joinSurvey.joinData.totalQstCnt++;
			}

		}
		else
		{
			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] == undefined) //create question index
			{
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] = {'sectionList' : {}};
				joinSurvey.joinData.totalQstCnt++;
			}

			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')] == undefined) //create section index
			{
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')] = {'subQstList' : {}};
			}

			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')] == undefined) //create sub question index
			{
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')] = {'askList' : {}};
			}
		}

		var askItemSeq = '';
		var askItemIndex = '';
		var addResponse = '';
		var subAddResponse = '';

		if(qstInfo.qstType == 'MULTI') //객관식
		{
            // if(etcOption)
            // {
            //     $formId = $(formId).prev();
            // }
            // else {
                $formId = $(formId);
            // }

            askItemSeq = $formId.val();
            askItemIndex = $formId.attr('itemIndex');

                if(qstInfo.qstOptionList['RANDITEM'].optionValue =='CHECKED'){//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크
                
                  if(qstInfo.itemList[parseInt(askItemSeq)-1].itemOptionList['INPUT'].optionValue == 'CHECKED')            
    				subAddResponse = $(formId).parent().find('input:text').val();
                }
                else{
                  if(qstInfo.itemList[askItemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')            
    				subAddResponse = $(formId).parent().find('input:text').val();
                }

                
                
                console.log('subAddResponse:');
                console.log(subAddResponse);
                



				if(itemType == 'MULTI')
				{

				    
        			if($(formId).prop('checked') == true)
        			{				    
    					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
    						'itemSeq' : askItemSeq,
    						'addResponse' : askItemSeq,
    						'subAddResponse' : subAddResponse,
    						'askCode' : '',
    						'itemIndex' : askItemIndex
    					};
                    }else{
                        
            			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined){ //답변 데이터 초기화
    
            					delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
    
            			}
                        
                    }
				}
                else if(itemType == 'MULTISELECT'){
                    console.log('MULTISELECT1:');
                    console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList);                     
        			if($(formId).prop('checked') == true)
        			{	                    
    					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
    						'itemSeq' : askItemSeq,
    						'addResponse' : askItemSeq,
    						'subAddResponse' : subAddResponse,
    						'askCode' : '',
    						'itemIndex' : askItemIndex
    					};
                    }else{
                        
					   delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
                    }  
                    console.log('MULTISELECT2:');                    
                    console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList);                      
                }                
				else
				{
        			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined){ //답변 데이터 초기화

                		joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList = {};

        			}
				    
    					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
    						'itemSeq' : askItemSeq,
    						'addResponse' : askItemSeq,
    						'subAddResponse' : subAddResponse,
    						'askCode' : '',
    						'itemIndex' : askItemIndex
    					};
				}
			

            /////////////////////////////////앞 문항 답변 선택값 -> 질문 내용에 추가 ÐQ4Ð
			var prevQstVal = [];

			for(var u in joinSurvey.grpListTmp)
			{
				for(y in joinSurvey.grpListTmp[u].qstList)
				{
				   //console.log(joinSurvey.grpListTmp[u].qstList[y]);

					if(typeof joinSurvey.grpListTmp[u].qstList[y].qstComment === 'number')
					{
						joinSurvey.grpListTmp[u].qstList[y].qstComment = String(joinSurvey.grpListTmp[u].qstList[y].qstComment);
					}

                   if(joinSurvey.grpListTmp[u].qstList[y].qstComment.indexOf('Ð') != -1){
                        var qstPrevValTmp = joinSurvey.grpListTmp[u].qstList[y].qstComment.split('Ð');
                        var checkQstPrevValTmp = joinSurvey.qstCommentChecker(qstPrevValTmp[1]);//태그 제거
                        var qstPrevValTmpSub = checkQstPrevValTmp.split('Q');
                        var qstPrevQstTmp = qstPrevValTmpSub[1];
                       console.log(qstPrevQstTmp);


                       if(qstInfo.orderNumTotal==qstPrevQstTmp){//질문내 변수넘버와 현재 답변질문번호가 동일할때 -> 값을 넘겨받아야할 질문


            			for(var i in joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList)//현재 질문 데이터
            			{
            				for( var j in joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList ) //실제 전체 item 리스트
            				{
            					if( joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList[j].itemSeq == joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[i].itemSeq )
            					{
            						prevQstVal.push(joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList[j].itemTitle);
            					}
            				}
            			}
                        console.log(qstInfo.grpSeq);
                        console.log(qstInfo.qstSeq);
						$('.'+qstInfo.grpSeq+'_'+qstInfo.qstSeq).html(prevQstVal.join(','));
						prevQstVal.length = 0;

                       }
                   }
				}
			}

            /////////////////////////////////앞 문항 답변 선택값 -> 질문 내용에 추가 ÐQ4Ð
		}
		else if(qstInfo.qstType == 'OPEN') //주관식
		{
			askItemSeq = $(formId).attr('itemSeq');
			askItemIndex = $(formId).attr('itemIndex');
			addResponse = $(formId).val();

			if(addResponse == '')
			{
				delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
			}
			else
			{
                addResponse=addResponse+' ';
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
					'itemSeq' : askItemSeq,
					'addResponse' : addResponse,
					'subAddResponse' : '',
					'askCode' : '',
					'itemIndex' : askItemIndex
				};
			}
		}
		else if(qstInfo.qstType == 'RANK') //순위형
		{

			askItemSeq = $(formId).val();
			askItemIndex = $(formId).attr('itemIndex');

            console.log('~~~~~~~~~~~', qstInfo, parseInt(askItemSeq)-1);
			if(qstInfo.itemList[parseInt(askItemSeq)-1].itemOptionList['INPUT'].optionValue == 'CHECKED')
			{
				subAddResponse = $(formId).parent().find('input:text').val();
			}

			if( joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined )
			{
				console.log('yes askList');
				console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList);
			}

			if($(formId).prop('checked') == true)
			{
				console.log( 'add askList : '+ askItemSeq );
				//addResponse = $(formId).prev('span:first').html();
				addResponse = selectIndex-1;

				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
					'itemSeq' : askItemSeq,
					'addResponse' : addResponse,
					'subAddResponse' : subAddResponse,
					'askCode' : '',
					'itemIndex' : askItemIndex
				};

			}
			else
			{
			 /*
				var checkCnt = $(formId).prev('span:first');

				var askList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList;

				for(var i in askList)
				{
					if(checkCnt.html() < askList[i].addResponse)
					{
						askList[i].addResponse--;
					}
				}

				checkCnt.html('&nbsp;');
                */
                var checkCnt = $(formId).prev('span:first');

				var askList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList;

				for(var i in askList)
				{
					delete askList[i];
				}

//				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined)
//				{ //답변 데이터 초기화
//					delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
//				}

 				checkCnt.html('&nbsp;');
			}

			console.log( 'join data' );
			console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq]);
		   //alert(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq]+':c2:'+$(formId).prop('checked'));
		   //console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq]+':c2:'+$(formId).prop('checked'));

		}
		else if(qstInfo.qstType == 'MATRIX' || qstInfo.qstType == 'AHP') //척도형, AHP
		{
			if(qstInfo.qstType == 'MATRIX') {
				askItemSeq = $(formId).val();
                addResponse = $(formId).val();

                var subQstList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];

                if(subQstList.askList != undefined){ //답변 데이터 초기화
                    subQstList.askList = {};
                }

                if($(formId).prop('checked') == true)
                {

                    subQstList.askList[askItemSeq] = {
                        'itemSeq' : askItemSeq,
                        'addResponse' : addResponse,
                        'subAddResponse' : subAddResponse,
                        'askCode' : '',
                        'itemIndex' : ''
                    };
                }
            }
			else {
                var $formId = $('input[name="'+$(formId).attr("name")+'"]:checked');
				askItemSeq = $formId.attr('itemSeq');
                addResponse = $formId.val();
				//askItemSeq = $(formId).attr('itemSeq');

                var subQstList = {};

                try{
                    subQstList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$formId.attr('sectionSeq')].subQstList[$formId.attr('subQstSeq')];
                }
                catch(e) {
                    subQstList.askList = {};
                }

                if(subQstList.askList != undefined){ //답변 데이터 초기화
                    subQstList.askList = {};
                }

                if($formId.prop('checked') == true)
                {

                    subQstList.askList[askItemSeq] = {
                        'itemSeq' : askItemSeq,
                        'addResponse' : addResponse,
                        'subAddResponse' : subAddResponse,
                        'askCode' : '',
                        'itemIndex' : ''
                    };
                }
            }
		}
		else if(qstInfo.qstType == 'CONSTANTSUM') //상수합
		{
			askItemSeq = $(formId).attr('itemSeq');
			addResponse = $(formId).val();
			var subQstList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];

			if(subQstList.askList[askItemSeq] != undefined){ //답변 데이터 초기화
				subQstList.askList[askItemSeq] = {};
			}

			subQstList.askList[askItemSeq] = {
				'itemSeq' : askItemSeq,
				'addResponse' : addResponse,
				'subAddResponse' : subAddResponse,
				'askCode' : '',
				'itemIndex' : ''
			};
		}
		else if(qstInfo.qstType == 'TABLE') //테이블
		{
			var itemType = $(formId).attr('itemType');
			var itemIndex = '';
			if(itemType == 'CHECKBOX')
			{
				askItemSeq = $(formId).val();
				addResponse = askItemSeq;
				itemIndex = askItemSeq;
			}
			else if(itemType == 'RADIO' || itemType == 'SELECT')
			{
				askItemSeq = $(formId).attr('itemSeq');
				addResponse = $(formId).val();
				itemIndex = $(formId).attr('sectionSeq');
			}
			else if(itemType == 'INPUT')
			{
				askItemSeq = $(formId).attr('itemSeq');
				addResponse = $(formId).val();
				itemIndex = askItemSeq;
			}

			var subQstList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];
        console.log('subQstList');            
        console.log($(formId).attr('subQstSeq'));


			if(itemType == 'CHECKBOX' )
			{
				if($(formId).prop('checked') == true)
				{
					subQstList.askList[itemIndex] = {
						'itemSeq' : askItemSeq,
						'addResponse' : addResponse,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : ''
					};
				}
                else
				{
				    delete subQstList.askList[askItemSeq];
					//delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];
				}
        console.log(subQstList);                
			}else if(itemType == 'RADIO'){
    			if(subQstList.askList[askItemSeq] != undefined){ //답변 데이터 초기화
    				delete subQstList.askList[askItemSeq];
    			}			 
				if($(formId).prop('checked') == true)
				{
					subQstList.askList[itemIndex] = {
						'itemSeq' : askItemSeq,
						'addResponse' : addResponse,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : ''
					};
				}
                else
				{

					delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];
				}
			}
			else
			{
    			if(subQstList.askList[askItemSeq] != undefined){ //답변 데이터 초기화
    				delete subQstList.askList[askItemSeq];
    			}			 
				if(addResponse != '')
				{
					subQstList.askList[itemIndex] = {
						'itemSeq' : askItemSeq,
						'addResponse' : addResponse,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : ''
					};
				}
			}
		}
        else if(qstInfo.qstType == 'TABLE2') //테이블
		{
			var itemType = $(formId).attr('itemType');
			var itemIndex = '';
			if(itemType == 'CHECKBOX')
			{
				askItemSeq = $(formId).val();
				addResponse = askItemSeq;
				itemIndex = askItemSeq;
			}
			else if(itemType == 'RADIO')
			{
				askItemSeq = $(formId).attr('itemSeq');
				addResponse = $(formId).val();
				itemIndex = $(formId).attr('sectionSeq');
			}
			else if(itemType == 'INPUT')
			{
				askItemSeq = $(formId).attr('itemSeq');
				addResponse = $(formId).val();
				itemIndex = askItemSeq;
			}
			else if(itemType == 'SELECT')
			{
				askItemSeq = $(formId).attr('itemSeq');
				addResponse = $(formId).val();
				itemIndex = askItemSeq;
			}

			var subQstList = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[$(formId).attr('sectionSeq')].subQstList[$(formId).attr('subQstSeq')];

			if(subQstList.askList[askItemSeq] != undefined){ //답변 데이터 초기화
				delete subQstList.askList[askItemSeq];
			}

			if(itemType == 'RADIO' || itemType == 'CHECKBOX')
			{
				if($(formId).prop('checked') == true)
				{
					subQstList.askList[itemIndex] = {
						'itemSeq' : askItemSeq,
						'addResponse' : addResponse,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : ''
					};
				}
			}
			else
			{
				if(addResponse != '')
				{
					subQstList.askList[itemIndex] = {
						'itemSeq' : askItemSeq,
						'addResponse' : addResponse,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : ''
					};
				}
			}

			console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq]);
		}

		joinSurvey.progress(); //본문 진행바 처리
	};

	/**
	 * prev page 처리
	 */
	this.prevPage = function(flag)
	{
		if(flag == 'reset')
		{
		  

            joinSurvey.arrowType = "reset";
                      
			var qstList = [];
console.log('reset::::');            
console.log($(this).attr('qstIndex'));
			$('.question').each(function(){
				var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];
				qstList.push(qstInfo);
			});
console.log(qstList);
			var grpSeq = joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex];

			for(var i in qstList)
			{
				var qstInfo = qstList[i];
				var qstSeq = qstInfo.qstSeq;
//console.log('check>>'+grpSeq+':check2>>'+joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq]+':check3>>'+joinSurvey.maxRankCnt[qstInfo.qstSeq]);

				if(joinSurvey.joinData.grpList[grpSeq] != undefined)
				{
					if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] != undefined)
					{
						delete joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq];
						joinSurvey.joinData.totalQstCnt--;
					}
				}

				if(qstInfo.qstType == 'RANK')
				{

                    //checkSelectCnt=1;//joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
					if(joinSurvey.maxRankCnt[qstInfo.qstSeq] != undefined)
						delete joinSurvey.maxRankCnt[qstInfo.qstSeq];

				}

                if(qstInfo.qstType == 'MULTI')
				{
                    if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택 처리
				    {

                        //joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
    					if(joinSurvey.askTypeCnt[qstInfo.qstSeq] != undefined)
    						delete joinSurvey.askTypeCnt[qstInfo.qstSeq];
                            
                    }
				}
                
                

                if(qstInfo.qstType == 'TABLE')
				{
     console.log(qstInfo.sectionList); 				    
				    for(var i in qstInfo.sectionList)
                    {
                        if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX') //다중선택 처리
    				    {
     console.log(qstInfo.subQstList);    				        
        				        for(var h in qstInfo.subQstList)
               					{
               					    var subQstSeqCnt1=qstInfo.subQstList[h].qstSeq;
                                    var subQstSeqCnt2 = parseInt(qstInfo.qstSeq+subQstSeqCnt1.toString());
     console.log(subQstSeqCnt2);
     console.log(subQstSeqCnt2);
                                    //joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
                                    console.log(joinSurvey.sectionTypeCnt[subQstSeqCnt2]);  
                					if(joinSurvey.sectionTypeCnt[subQstSeqCnt2] != undefined){
                    					   delete joinSurvey.sectionTypeCnt[subQstSeqCnt2];
                    						//joinSurvey.sectionTypeCnt[subQstSeqCnt2].cnt=0;
                                                                            
                					}

                                }
                        }
                    }
				}                
                
			}
		}
		else
		{
			if(joinSurvey.joinData.pageIndex == 1)
			{
                alertLayer('첫 페이지 입니다.');
                return false;
				//onpanel.printMsgPos('첫 페이지 입니다.');
			}
			else
			{
                joinSurvey.arrowType = "prev";

				var qstList = [];

				$('.question').each(function(){
					var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];
					qstList.push(qstInfo);
				});

				var grpSeq = joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex];
console.log('questionCnt2:');  
console.log(joinSurvey.totalQstCnt);   
console.log(joinSurvey.questionCnt);  
				for(var i in qstList)
				{
					var qstInfo = qstList[i];
					var qstSeq = qstInfo.qstSeq;

					if(joinSurvey.joinData.grpList[grpSeq] != undefined)
					{
						if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] != undefined)
						{
							delete joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq];
							joinSurvey.joinData.totalQstCnt--;
							joinSurvey.questionCnt--;
						}
					}

					if(qstInfo.qstType == 'RANK')
					{
						if(joinSurvey.maxRankCnt[qstInfo.qstSeq] != undefined)
							delete joinSurvey.maxRankCnt[qstInfo.qstSeq];
					}
                    if(qstInfo.qstType == 'MULTI')
    				{
                        if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택 처리
    				    {

                            //joinSurvey.askTypeCnt[qstInfo.qstSeq] = {'cnt':0};
        					if(joinSurvey.askTypeCnt[qstInfo.qstSeq] != undefined)
        						delete joinSurvey.askTypeCnt[qstInfo.qstSeq];
                        }
    				}
                    
    
                    
                                  
				}
console.log('questionCnt3:');  
console.log(joinSurvey.totalQstCnt);   
console.log(joinSurvey.questionCnt);  
				/*
				//히스토리 처리
				var i = 1;
				var firstHistory = '';
				for(var index in joinSurvey.joinData.historyBack)
				{
					if( i == 1 ) //히스토리의 첫번째 일때 저장
						firstHistory = joinSurvey.joinData.historyBack[index].split( '|' );
					i++;
				}

				//현재의 그룹과 이전페이지의 그룹이 다를때 처리
				if( joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] != joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex-1] )
				{
					if( firstHistory[0] == joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex-1] ) //이전페이지가 히스토리의 첫번째와 일치할 경우
						joinSurvey.joinData.historyBack = {};
					else if( joinSurvey.grpList[joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex-1]].grpType == 1 ) //이전페이지가 level1일 경우
						joinSurvey.joinData.historyBack = {};
					else
						joinSurvey.joinData.historyBack[parseInt( i )+1] = joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex]+'|'+joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex];
				}*/
                //console.log(joinSurvey.joinData.pageIndex);
//console.log(joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex]);
//console.log(joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex]);
				delete joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex];
				delete joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex];

				joinSurvey.joinData.pageIndex--;
                //joinSurvey.questionCnt--;


                //console.log("prev joinSurvey.joinData.pageIndex : "+joinSurvey.joinData.pageIndex);
                //console.log("prev joinSurvey.questionCnt : " + joinSurvey.questionCnt);

				if(joinSurvey.isMode == '')
				{
					joinSurvey.setJoinData('', function(){
						joinSurvey.loadBodySkin();
					});
				}
			}
		}

		joinSurvey.loadBodySkin();
	};

	/**
	 * next page 처리ggg
	 */
	this.nextPage = function()
	{
		var qstList = [];
		var nextQstIndex = 0;
		var nextGrpSeq = '';


        joinSurvey.arrowType = "next";

		$('.question').each(function(){
			var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];//기존 생성된 문항정보
//console.log(qstInfo)
			qstList.push(qstInfo);
			nextQstIndex = parseInt($(this).attr('qstIndex'))+1; //현재 페이지 마지막 문항의 다음 문항
		});


        for(var i in qstList)
		{
			var qstInfo = qstList[i];

            var grpSeq = qstInfo.grpSeq;
            var qstSeq = qstInfo.qstSeq;

            //grpSeq->그룹, gstSeq->문항

            if(joinSurvey.joinData.grpList[grpSeq] == undefined)
			{
                joinSurvey.joinData.grpList[grpSeq] = {'qstList':{}};
			}

            //console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq]);
            //return false;

//console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq])//qstInfo.qstSeq
			/////////////////////////////////////////////////////////////////////////////////////
			if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] == undefined)
			{

                if(qstInfo.qstType == "OPEN") {
				    alertLayer("답변을 입력하여 주시기 바랍니다.");
                }
                else {
                    alertLayer("답변을 선택하여 주시기 바랍니다.");
                }

//				onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
				$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
				return false;
			}
			else
			{

				if(qstInfo.qstType == 'MULTI') //객관식
				{

					if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택
					{
						var askCnt=0;
						var linkCnt = 0;
						for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
						{
							i=parseInt(i);						  
							itemIndex = parseInt(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex);


                            if(qstInfo.qstOptionList['RANDITEM'].optionValue =='CHECKED'){//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크

                                var itemIndex2 = parseInt(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq) - 1;
                                
    							if(qstInfo.itemList[itemIndex2].itemOptionList['INPUT'].optionValue == 'CHECKED')
    							{
    								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
    								{
    //									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    									alertLayer('답변을 입력하여 주시기 바랍니다.');
    									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    									return false;
    								}
    							}                                
                                
                            }else{
                              
                                
    							if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
    							{
    								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
    								{
    //									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    									alertLayer('답변을 입력하여 주시기 바랍니다.');
    									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    									return false;
    								}
    							}    
                            }



							if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK')//연결그룹체크
							{



                				if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                				{
                					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK')//다음문항이동(다음다음)
                						nextQstIndex = parseInt(nextQstIndex)+1;

                				}
								if( linkCnt == 0 ) //연결그룹 첫번째 일때
								{
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{
									   joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq+'|'+nextQstIndex;
                                       //alertLayer(qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue);
                                    }
								}
								else
								{
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{

									   joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = nextGrpSeq+'|'+nextQstIndex;
                                       //alertLayer(qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue);
                                    }
								}

								nextQstIndex = 0;
								nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;

								linkCnt++;
							}
							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END')//설문종료
							{
								nextQstIndex = 'END';
							}
                            else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                            {
								nextQstIndex = 'TEND';
                            }
							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND')//그룹종료
							{
								nextQstIndex = 'GRPEND';
								nextGrpSeq = grpSeq;
							}

							askCnt++;
						}

						if(askCnt == 0)
						{
							//onpanel.printMsg('답변을 선택하여 주시기 바랍니다.');
//							onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
							alertLayer('답변을 선택하여 주시기 바랍니다.');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
						}

						if(qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
						{
							var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
                            var maxCnt = joinSurvey.askTypeCnt[qstInfo.qstSeq].cnt;
                            console.log(subOptionValTmp[0]);
                            console.log(subOptionValTmp[1]);
                            console.log(askCnt);
                            if(subOptionValTmp[0] == subOptionValTmp[1])
                            {
    							if(subOptionValTmp[0] > maxCnt)
    							{
    //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    								alertLayer('값을 '+subOptionValTmp[0]+'개 까지 선택하여 주시기 바랍니다.');
    								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    								return false;
    							}
    							else if(subOptionValTmp[1] < maxCnt)
    							{
    //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
    								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    								return false;
    							}
                            }else{

    							if(subOptionValTmp[0] > maxCnt)
    							{
    //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.');
    								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    								return false;
    							}
    							else if(subOptionValTmp[1] < maxCnt)
    							{
    //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
    								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    								return false;
    							}
                            }

						}
					}
					else //단일 선택
					{


						for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
						{
						  
                            i=parseInt(i);
							itemIndex = parseInt(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex);
//console.log('itemIndex:subAddResponse:');                            
//console.log(itemIndex);


                            if(qstInfo.qstOptionList['RANDITEM'].optionValue =='CHECKED'){//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크

                                itemIndex = parseInt(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq) - 1;
//console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i]);                         
//console.log('itemIndex:subAddResponse:');                            
//console.log(itemIndex);
                                //순서섞기 있을때
    							if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
    							{
    								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
    								{
    //									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    									alertLayer('답변을 입력하여 주시기 바랍니다.');
    									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    									return false;
    								}
    							}
                                
                                
                            	if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK')
    							{

                    				//종료 옵션이 없을 경우 처리
                    				if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                    				{
                    					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK')
                    						nextQstIndex = parseInt(nextQstIndex)+1;

                    				}
    								//다음페이지 정보
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{


    								    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq+'|'+nextQstIndex;

                    				}


    								nextQstIndex = 0;
    								nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;


    							}
    							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END')
    							{
    								nextQstIndex = 'END';
    							}
                                else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                                {
    								nextQstIndex = 'TEND';
                                }
    							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND')
    							{
    								nextQstIndex = 'GRPEND';
    								nextGrpSeq = grpSeq;
    							}



                            }else{

                                //순서섞기 없을때
    							if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
    							{
    								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
    								{
    //									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    									alertLayer('답변을 입력하여 주시기 바랍니다.');
    									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
    									return false;
    								}
    							}

                            	if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK')
    							{

                    				//종료 옵션이 없을 경우 처리
                    				if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                    				{
                    					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK')
                    						nextQstIndex = parseInt(nextQstIndex)+1;

                    				}
    								//다음페이지 정보
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{


    								    joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq+'|'+nextQstIndex;

                    				}


    								nextQstIndex = 0;
    								nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;
    							}
    							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END')
    							{
    								nextQstIndex = 'END';
    							}
                                else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                                {
    								nextQstIndex = 'TEND';
                                }
    							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'GRPEND')
    							{
    								nextQstIndex = 'GRPEND';
    								nextGrpSeq = grpSeq;
    							}


                            }
                            //itemList[i].itemSeq

						}

					}
				} //end MULTI type
				else if(qstInfo.qstType == 'OPEN') //주관식
				{
					for(var i in qstInfo.itemList)
					{
						if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[qstInfo.itemList[i].itemSeq] == undefined)
						{
//							onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
							alertLayer('답변을 입력하여 주시기 바랍니다.');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
						}
						else
						{
							if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse == '')
							{
//								onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 입력하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
						}
					}

				} //end OPEN type
				else if(qstInfo.qstType == 'RANK') //순위형
				{
					var askCnt=0;
					var linkCnt = 0;
					for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)//참여 데이타 복수
					{
						i=parseInt(i);					   
//						itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;//항목순서
						itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq;//항목순서
						itemIndex = parseInt(itemIndex)-1;
						console.log(qstInfo.itemList[itemIndex]);
						console.log(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue);
						if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')//참여자에게 입력받기
						{
							if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')//참여위값
							{
//								onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 입력하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}

						}

                        console.log('item' + i + ' : ' + joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].addResponse);

						console.log(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue );

                        console.log('nextGrpSeq:'+nextGrpSeq);
                        console.log('grpSeq:'+grpSeq);
                        console.log('linkCnt:'+linkCnt);
						//if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].addResponse == 1)
						//{
							if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'LINK')
							{

                 				if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)//jun->14.04.16
                				{
                					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK')//다음문항이동(다음다음)
                						nextQstIndex = parseInt(nextQstIndex)+1;

                				}
								if( linkCnt == 0 ) //연결그룹 첫번째 일때
								{
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{


									   joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = grpSeq+'|'+nextQstIndex;
                                    }
                        console.log('historyBack1:'+joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue]);
								}
								else
								{
                    				if(joinSurvey.joinData.historyBack  != undefined)//jun->14.04.16
                    				{
                    				   // console.log('nextGrpSeq:'+nextGrpSeq);
									   joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue] = nextGrpSeq+'|'+nextQstIndex;
                                    }
                        console.log('historyBack2:'+joinSurvey.joinData.historyBack[qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue]);
								}

								nextQstIndex = 0;
								nextGrpSeq = qstInfo.itemList[itemIndex].itemOptionList['LINK'].subOptionValue;

								linkCnt++;
							}
							else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'END')
							{
								nextQstIndex = 'END';
							}
                            else if(qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue == 'TEND')//설문종료 'TEND')//JUNE-2014.0714
                            {
								nextQstIndex = 'TEND';
                            }
						//}

						askCnt++;
					}
                        console.log('nextGrpSeq3:'+nextGrpSeq);
					if(askCnt == 0)
					{
//						onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
						alertLayer('답변을 선택하여 주시기 바랍니다.');
						$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
						return false;
					}

					if(qstInfo.qstOptionList['MAXRANK'].optionValue == 'CHECKED')
					{
						var subOptionValTmp = qstInfo.qstOptionList['MAXRANK'].subOptionValue.split('|');
						var maxRank = joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;


						if(maxRank-1 < 1)
						{
//							onpanel.printMsg(subOptionValTmp[0]+' 순위 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')')
							alertLayer(subOptionValTmp[0]+' 답변을 선택하여 주시기 바랍니다.');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
						}

                        if(subOptionValTmp[0] == subOptionValTmp[1])
                        {
							if(maxRank-1 < subOptionValTmp[0])
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[0]+'순위 까지 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(maxRank-1 > subOptionValTmp[1])
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[1]+'순위 까지만 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
                        }else{

							if(maxRank-1 < subOptionValTmp[0])
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[0]+'순위 이상 '+subOptionValTmp[1]+'순위 이하로 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(maxRank-1 > subOptionValTmp[1])
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[1]+'순위 까지만 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
                        }

					}
//return false;
				} //end RANK type
				else if(qstInfo.qstType == 'MATRIX' || qstInfo.qstType == 'AHP') //척도형, AHP
				{
				    
					for(var i in qstInfo.subQstList)
					{
						for(var j in qstInfo.sectionList)
						{
							var joinDataQst = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq];
            
             
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('슬라이드를 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('슬라이드를 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList == undefined || jQuery.isEmptyObject(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList))
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('슬라이드를 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
						}
					}
				} //end MATRIX type
				else if(qstInfo.qstType == 'TABLE') //테이블
				{
				    

                    for(var i in qstInfo.subQstList)
					{
						for(var j in qstInfo.sectionList)
						{
							var joinDataQst = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq];
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq] == undefined)
							{
								console.log('1111');
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] == undefined)
							{
								console.log('2222');
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList == undefined)
							{
								console.log('3333');
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}

							if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT' || qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO')
							{
								console.log('4444');
								if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] == undefined)
								{
//									onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
									alertLayer('답변을 선택하여 주시기 바랍니다.');
									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
									return false;
								}
							}
							else if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX')
							{
								console.log('5555');

								var subOptionValTmp = qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');


								for(var k in qstInfo.sectionList[j].itemList)
								{
                                    console.log(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList);								    
									var askCnt = 0;
									for( var kk in joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList )
									{
										askCnt++;
									}
                                    console.log('resultCnt'+k);
                                    console.log(askCnt);

                                    if(subOptionValTmp[0] == subOptionValTmp[1])
                                    {
            							if(subOptionValTmp[0] > askCnt)
            							{
            //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
            								alertLayer('값을 '+subOptionValTmp[0]+'개 까지 선택하여 주시기 바랍니다.1');
            								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
            								return false;
            							}
            							else if(subOptionValTmp[1] < askCnt)
            							{
            //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
            								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.1');
            								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
            								return false;
            							}
                                    }else{

            							if(subOptionValTmp[0] > askCnt)
            							{
            //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
            								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.1');
            								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
            								return false;
            							}
            							else if(subOptionValTmp[1] < askCnt)
            							{
            //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
            								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.1');
            								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
            								return false;
            							}
                                    }

								}
                                
                				//if(joinSurvey.sectionTypeCnt != undefined){
                				//	   delete joinSurvey.sectionTypeCnt;

                                                                        
                				//}                                

							}
							else if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
							{
								for(var k in qstInfo.sectionList[j].itemList)
								{
									if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
									{
//										onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
										alertLayer('답변을 입력하여 주시기 바랍니다.');
										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
										return false;
									}
								}
							}
                            
                            
                           
                            
						}
					}
// 					for(var i in qstInfo.subQstList)
// 					{
// 						for(var j in qstInfo.sectionList)
// 						{
// 							var joinDataQst = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq];
// 							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq] == undefined)
// 							{
// //								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
// 								alertLayer('답변을 선택하여 주시기 바랍니다.');
// 								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
// 								return false;
// 							}
// 							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] == undefined)
// 							{
// //								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
// 								alertLayer('답변을 선택하여 주시기 바랍니다.');
// 								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
// 								return false;
// 							}
// 							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList == undefined)
// 							{
// //								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
// 								alertLayer('답변을 선택하여 주시기 바랍니다.');
// 								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
// 								return false;
// 							}
//
// 							if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT' || qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO')
// 							{
// 								if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] == undefined)
// 								{
// //									onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
// 									alertLayer('답변을 선택하여 주시기 바랍니다.');
// 									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
// 									return false;
// 								}
// 							}
//                             else if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'CHECKBOX')
// 							{
// 								var subOptionValTmp = qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].subOptionValue.split('|');
//
// 								for(var k in qstInfo.sectionList[j].itemList)
// 								{
// 									var askCnt = 0;
// 									for( var kk in joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList )
// 									{
// 										askCnt++;
// 									}
//
//                                     if(subOptionValTmp[0] == subOptionValTmp[1])
//                                     {
//             							if(subOptionValTmp[0] > askCnt)
//             							{
//             //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
//             								alertLayer('값을 '+subOptionValTmp[0]+'개 까지 선택하여 주시기 바랍니다.');
//             								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
//             								return false;
//             							}
//             							else if(subOptionValTmp[1] < askCnt)
//             							{
//             //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
//             								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
//             								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
//             								return false;
//             							}
//                                     }else{
//
//             							if(subOptionValTmp[0] > askCnt)
//             							{
//             //								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
//             								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 '+subOptionValTmp[1]+'개 이하로 선택하여 주시기 바랍니다.');
//             								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
//             								return false;
//             							}
//             							else if(subOptionValTmp[1] < askCnt)
//             							{
//             //								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
//             								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
//             								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
//             								return false;
//             							}
//                                     }
// 								}
//
// 							}
// 							else if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
// 							{
// 								for(var k in qstInfo.sectionList[j].itemList)
// 								{
// 									if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
// 									{
// //										onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
// 										alertLayer('답변을 입력하여 주시기 바랍니다.');
// 										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
// 										return false;
// 									}
// 								}
// 							}
// 						}
// 					}
				} //end TABLE type
                else if(qstInfo.qstType == 'TABLE2') //테이블
				{
					for(var i in qstInfo.subQstList)
					{
						for(var j in qstInfo.sectionList)
						{
							var joinDataQst = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq];
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}

							if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT' || qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'RADIO')
							{
                                for(var k in qstInfo.sectionList[j].itemList)
								{
									if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
									{
										alertLayer('답변을 선택하여 주시기 바랍니다.');
										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
										return false;
									}
								}

//								if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] == undefined)
//								{
////									onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
//									alertLayer('답변을 선택하여 주시기 바랍니다.');
//									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
//									return false;
//								}
							}
							else if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
							{
								for(var k in qstInfo.sectionList[j].itemList)
								{
									if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
									{
//										onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
										alertLayer('답변을 입력하여 주시기 바랍니다.');
										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
										return false;
									}
								}
							}
						}
					}
				}
				else if(qstInfo.qstType == 'CONSTANTSUM') //상수합
				{
					for(var j in qstInfo.sectionList)
					{
						var sectionItemTotal = {};
						for(var k in qstInfo.sectionList[j].itemList)
						{
							if(sectionItemTotal[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
							{
								sectionItemTotal[qstInfo.sectionList[j].itemList[k].itemSeq] = {'total':0};
							}

							var joinDataQst = joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq];
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.sectionList[j].itemList[k].itemSeq] == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.sectionList[j].itemList[k].itemSeq].askList == undefined)
							{
//								onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}

							for(var i in qstInfo.subQstList)
							{
								if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.sectionList[j].itemList[k].itemSeq].askList[qstInfo.subQstList[i].qstSeq] == undefined)
								{
									if(qstInfo.sectionList[j].sectionOptionList['INPUTTYPE'].optionValue == 'INPUT')
									{
//										onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
										alertLayer('답변을 입력하여 주시기 바랍니다.');
										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
										return false;
									}
									else
									{
//										onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
										alertLayer('답변을 입력하여 주시기 바랍니다.');
										$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
										return false;
									}
								}
								else
								{
									sectionItemTotal[qstInfo.sectionList[j].itemList[k].itemSeq].total = parseInt(sectionItemTotal[qstInfo.sectionList[j].itemList[k].itemSeq].total)+parseInt(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.sectionList[j].itemList[k].itemSeq].askList[qstInfo.subQstList[i].qstSeq].addResponse);
								}
							}

							if(qstInfo.sectionList[j].sectionOptionList['SUM'].optionValue == 'SET')//합계지정
							{
								if(sectionItemTotal[qstInfo.sectionList[j].itemList[k].itemSeq].total != qstInfo.sectionList[j].sectionOptionList['SUM'].subOptionValue)
								{
//									onpanel.printMsg('합계를 '+qstInfo.sectionList[j].sectionOptionList['SUM'].subOptionValue+'에 맞춰 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
									alertLayer('합계를 '+qstInfo.sectionList[j].sectionOptionList['SUM'].subOptionValue+'에 맞춰 주시기 바랍니다.');
									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
									return false;
								}
							}
						}
					}
				} //end CONSTANTSUM type
			}
		}

		//etc 처리
		$('.etcInput').each(function(){

			if($(this).val() != '')
			{
				var joinQstData = joinSurvey.joinData.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstSeq')];

				if($(this).attr('qstType') == 'CONSTANTSUM') //상수합 etc일경우->상수합 LEFT값(참여받기)
				{
					joinQstData['sectionEtc'] = $(this).val();
					//joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.sectionList[j].itemList[k].itemSeq]
				}
				else
				{
					for(var i in joinQstData.sectionList)
					{
						joinQstData.sectionList[i].subQstList[$(this).attr('subQstSeq')]['qstEtc'] = $(this).val();
					}
				}
			}

		});

		//다음페이지 확인
		if(nextGrpSeq == '') //다음 그룹seq가 null일 경우에 현재 그룹seq를 부여한다.
			nextGrpSeq = grpSeq;

		if( nextQstIndex != 'END' && nextQstIndex != 'TEND'  )//JUNE-2014.0714
		{
			if( nextQstIndex != 'GRPEND' )
			{
				try {
					joinSurvey.grpList[grpSeq].qstList;
				}
				catch(e) {
					alertLayer("설문이 잘못등록되어 진행이 불가능합니다.");
					return false;
				}


				//종료 옵션이 없을 경우 처리
				if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] != undefined)
				{
					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex].qstType == 'PAGEBREAK')
						nextQstIndex = parseInt(nextQstIndex)+1;

					if(joinSurvey.grpList[grpSeq].qstList[nextQstIndex] == undefined)
						nextQstIndex = 'GRPEND';
				}
				else
				{
					nextQstIndex = 'GRPEND';
				}

			}
		}
//console.log('nextQstIndex>>'+nextQstIndex);
//console.log('nextGrpSeq>>'+nextGrpSeq);
//console.log('nextGrpSeq>>'+joinSurvey.defaultGrpSeq);
		if( nextQstIndex == 'END' ) //설문 참여 종료
		{
			joinSurvey.joinData.pageIndex++;
			joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = nextQstIndex;
			joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;
		}
		else if( nextQstIndex == 'TEND' ) //설문 참여 종료//JUNE-2014.0714
		{
			joinSurvey.joinData.pageIndex++;
			joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = nextQstIndex;
			joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;
		}
		else if( nextQstIndex == 'GRPEND' ) //그룹 종료
		{

//console.log('grpType>>'+joinSurvey.grpList[nextGrpSeq].grpType+':nextGrpSeqTmp>>'+joinSurvey.grpList[nextGrpSeqTmp]);

//console.log('grpType>>'+joinSurvey.grpList[nextGrpSeq].grpType);

			if( joinSurvey.grpList[nextGrpSeq].grpType == 1 )
			{
				//현재 그룹이 level1 일 경우 다음 level1그룹이 있는지 확인한다.
				var nextGrpSeqTmp = '';
				for( var i in joinSurvey.defaultGrpSeq )
				{
					if( nextGrpSeq == joinSurvey.defaultGrpSeq[i] )
					{
						nextGrpSeqTmp = i;
						continue;
					}

					if( nextGrpSeqTmp != '' )
					{
						nextGrpSeqTmp = joinSurvey.defaultGrpSeq[i];
						break;
					}
				}
//console.log('nextGrpSeq>>'+joinSurvey.defaultGrpSeq    +':grpSeq>>'+joinSurvey.grpList[nextGrpSeqTmp].grpSeq);
				if( joinSurvey.grpList[nextGrpSeqTmp] != undefined ) //다음 level1그룹이 존재할 경우
				{
					joinSurvey.joinData.pageIndex++;
					joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = 0;
					joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = joinSurvey.grpList[nextGrpSeqTmp].grpSeq;
				}
				else //다음 level1 그룹이 존재 하지 않을 경우 설문 종료
				{
					joinSurvey.joinData.pageIndex++;
					joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = 'END';
					joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;
				}

			}
            else if(joinSurvey.grpList[nextGrpSeq].grpType == 2)
            {
				//현재 그룹이 level2일 경우 복귀해야 할 그룹과 문항을 찾는다
//console.log('historyBack>>'+joinSurvey.joinData.historyBack);
//console.log('grpSeq>>'+grpSeq);

				var historyTmp = [];
				var historyTmpSub = [];
                var m=0;
				for( var i in joinSurvey.joinData.historyBack )
				{

					historyTmp[m] = i+','+joinSurvey.joinData.historyBack[i].split('|');
//console.log('historyTmp2>>'+historyTmp[m]);
                    m++;
				}

                for(var n=0; n<m; n++){
                    historyTmpSub[n]=historyTmp[n].split(',');
//console.log('value2-1>>'+historyTmpSub[n][0]+'value2-2>>'+historyTmpSub[n][1]+'value2-3>>'+historyTmpSub[n][2]);
					historyTmp2 = historyTmpSub[n];
					historyTmp1 = historyTmpSub[n-1];

////////////////////////////////
					if( historyTmpSub[n][0] == grpSeq )
					{

						nextGrpSeq = historyTmpSub[n][1];
						nextQstIndex = historyTmpSub[n][2];

                       ///////////////////복귀해야 할 1그룹이 마지막 문항인지
        					if(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex] == undefined)
                            {
                				//현재 그룹이 level1 일 경우 다음 level1그룹이 있는지 확인한다.
                				var nextGrpSeqTmp = '';
                				for( var i in joinSurvey.defaultGrpSeq )
                				{
                					if( nextGrpSeq == joinSurvey.defaultGrpSeq[i] )
                					{
                						nextGrpSeqTmp = i;
                						continue;
                					}

                					if( nextGrpSeqTmp != '' )
                					{
                						nextGrpSeqTmp = joinSurvey.defaultGrpSeq[i];
                						break;
                					}
                				}
                //console.log('nextGrpSeq>>'+joinSurvey.grpList[nextGrpSeqTmp]    +':grpSeq>>'+joinSurvey.grpList[nextGrpSeqTmp].grpSeq);
                				if( joinSurvey.grpList[nextGrpSeqTmp] != undefined ) //다음 level1그룹이 존재할 경우
                				{

                					nextQstIndex = 0;
                					nextGrpSeq = joinSurvey.grpList[nextGrpSeqTmp].grpSeq;
                				}
                				else //다음 level1 그룹이 존재 하지 않을 경우 설문 종료
                				{

                					nextQstIndex = 'END';
                					nextGrpSeq = nextGrpSeq;
                				}
                            }///////////////////복귀해야 할 1그룹이 마지막 문항인지

						break;
					}
////////////////////////////////

                }

//console.log('historyTmp>>'+historyTmp+':nextQstIndex>>'+nextQstIndex+':nextGrpSeq>>'+nextGrpSeq);
				joinSurvey.joinData.pageIndex++;
				joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = nextQstIndex;
				joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;

            }
			else
			{
				//현재 그룹이  level3 일 경우 복귀해야 할 그룹과 문항을 찾는다
console.log(joinSurvey.joinData.historyBack);
//console.log('grpSeq>>'+grpSeq);

				var historyTmp = [];
				var historyTmpSub = [];
				var historyTmpSub1 = [];
                var m=0;
				for( var i in joinSurvey.joinData.historyBack )
				{

					historyTmp[m] = i+','+joinSurvey.joinData.historyBack[i].split('|');
console.log('historyTmp>>'+historyTmp[m]);
                    m++;
				}
console.log('m>>'+m);
                for(var n=0; n<m; n++){
                    historyTmpSub[n]=historyTmp[n].split(',');
console.log('value3-1>>'+historyTmpSub[n][0]+'value3-2>>'+historyTmpSub[n][1]+'value3-3>>'+historyTmpSub[n][2]);
					historyTmp3 = historyTmpSub[n];
					//historyTmp2 = historyTmpSub[n-1];
					//historyTmp1 = historyTmpSub[n-2];

////////////////////////////////
					if( historyTmp3[0] == grpSeq )
					{

						nextGrpSeq = historyTmp3[1];//level2그룹
						nextQstIndex = historyTmp3[2];

console.log('nextGrpSeq-1>>'+nextGrpSeq+'nextQstIndex-2>>'+nextQstIndex);
                       ///////////////////복귀해야 할 2그룹이 마지막 문항인지
    					if(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex] == undefined)//2그룹 마지막문항이라면 level1그룹 찾기
                        {


console.log('n>>'+n);
						///////////////////////////////////////////////////////////
							for(var k=0; k<m; k++){
								historyTmpSub1[k]=historyTmp[k].split(',');
								historyTmp1 = historyTmpSub1[k];

								if( historyTmp1[0] == nextGrpSeq )
								{
									nextGrpSeq = historyTmp1[1];//level2그룹
									nextQstIndex = historyTmp1[2];

								}
							}
						///////////////////////////////////////////////////////////
									/*
    			                     nextGrpSeq = historyTmpSub[n-1][1];//historyTmpSub[n-1][1];//historyTmp1[1];
    			                     nextQstIndex = historyTmpSub[n-1][2];//historyTmpSub[n-1][2];//historyTmp1[2];
									*/
console.log('nextGrpSeq-1>>'+nextGrpSeq+'nextQstIndex-2>>'+nextQstIndex);
                console.log(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex]);
                                    ///////////////////복귀해야 할 1그룹이 마지막 문항인지
                					if(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex] == undefined)
                                    {
                        				//현재 그룹이 level1 일 경우 다음 level1그룹이 있는지 확인한다.
                        				var nextGrpSeqTmp = '';
                        				for( var i in joinSurvey.defaultGrpSeq )
                        				{
                        					if( nextGrpSeq == joinSurvey.defaultGrpSeq[i] )
                        					{
                        						nextGrpSeqTmp = i;
                        						continue;
                        					}

                        					if( nextGrpSeqTmp != '' )
                        					{
                        						nextGrpSeqTmp = joinSurvey.defaultGrpSeq[i];
                        						break;
                        					}
                        				}
                                        //console.log('nextGrpSeq>>'+joinSurvey.grpList[nextGrpSeqTmp]    +':grpSeq>>'+joinSurvey.grpList[nextGrpSeqTmp].grpSeq);
                        				if( joinSurvey.grpList[nextGrpSeqTmp] != undefined ) //다음 level1그룹이 존재할 경우
                        				{

                        					nextQstIndex = 0;
                        					nextGrpSeq = joinSurvey.grpList[nextGrpSeqTmp].grpSeq;
                        				}
                        				else //다음 level1 그룹이 존재 하지 않을 경우 설문 종료
                        				{

                        					nextQstIndex = 'END';
                        					nextGrpSeq = nextGrpSeq;
                        				}
                                    }
                                    ///////////////////복귀해야 할 1그룹이 마지막 문항인지



                        }
                        ///////////////////복귀해야 할 2그룹이 마지막 문항인지


						break;
					}
////////////////////////////////

                }



//console.log('historyTmp>>'+historyTmp+':   nextQstIndex>>'+nextQstIndex+':nextGrpSeq>>'+nextGrpSeq);
				joinSurvey.joinData.pageIndex++;
				joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = nextQstIndex;
				joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;
			}
		}
		else //종료 옵션 없는 일반 처리
		{
			joinSurvey.joinData.pageIndex++;
			joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] = nextQstIndex;
			joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex] = nextGrpSeq;
		}

		//미리보기가 아닐 경우에만 서버에 참여 데이터를 저장한다.
		if(joinSurvey.isMode == '')
		{
//console.log('nextQstIndex>>'+nextQstIndex+':nextGrpSeq>>'+joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex]+':nextQstSeq>>'+joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex]);

            var per = 0;
            var chPer = 0;
            var chPerQst = 0;
			if(nextQstIndex == 'END' || joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] == 'END')
			{
				//설문 종료일 경우

				joinSurvey.setJoinData('1',chPer,chPerQst, function(pointMsg){//서버에 설문참여데이타 넘긴다

					joinSurvey.loadBodySkin('',pointMsg);

				});
			}
			else if(nextQstIndex == 'TEND' || joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] == 'TEND')//JUNE-2014.0714
			{
				//설문 중간 종료일 경우
                /*
        		if( joinSurvey.surveyData.pageCnt == 1 )
        		{
        			if(joinSurvey.joinData.totalQstCnt > 0)
        			{
        				per = Math.round(joinSurvey.joinData.totalQstCnt/joinSurvey.totalQstCnt*100);
        			}
        		}
        		else
        		{
        			if(joinSurvey.surveyData.pageCnt > 0)
        			{
        				per = Math.round(joinSurvey.joinData.pageIndex/joinSurvey.surveyData.pageCnt*100);
        			}
        		}
                chPer=100-per;
                */
				joinSurvey.setJoinData('2',nextGrpSeq,qstSeq, function(pointMsg){//서버에 설문참여데이타 넘긴다
					joinSurvey.loadBodySkin('',pointMsg);

				});
			}
			else
			{
				//페이지 이동일 경우
				joinSurvey.setJoinData('',chPer,chPerQst, function(){
					joinSurvey.loadBodySkin();
				});
			}
		}
        else{

		joinSurvey.loadBodySkin();
        }


	}

	this.focusQst = function(grpSeq, qstSeq)
	{
		$('html').animate({scrollTop:parseInt($('#qstInfo_'+grpSeq+'_'+qstSeq).offset().top)-100}, 500);
	}

	this.getItemTime = function (second)
	{
		return this.toHHMMSS(second);
	}

	this.toHHMMSS = function (sec_num) {
//		var sec_num = parseInt(this, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = minutes+':'+seconds+'';
//		var time    = hours+':'+minutes+':'+seconds;
		return time;
	}

	this.htmlChecker = function (str)
	{
		var html_tags = ["<ul" , "<area" , "<article" , "<b" , "<base"
				, "<body" , "<br" , "<button" , "<dd" , "<dt" , "<dl" , "<em"
				, "<embed" , "<fieldset" , "<figcaption" , "<figure" , "<footer"
				, "<form" , "<h1" , "<h2" , "<h3" , "<h4" , "<h5" , "<h6" , "<header"
				, "<hgroup" , "<hr" , "<i" , "<img" , "<input" , "<ins"
				, "<span" , "<p" , "<div"]
			, result = false
            , str = String(str)
			;

        if(str == "") return false;

		$.each(html_tags,function(k,v){
			if (str.indexOf(v) > -1)
			{
				result = true;
			}
		});

		return result;
	}

    this.qstCommentChecker = function (str)
	{

        var pattern = '/[<].*[>].*[<]/+.*[>]/gi';
        var pattern2 = '/[<][^>]*[>]/gi';
        var pattern3 = '/(<[^>]*>)/gi';//태그 삭제
        var pattern4 = '/<[^>]+>/gi';//태그 삭제
        var pattern5 = '<[^<|>]*>';//태그 삭제
        var pattern6 = /[<][^>]*[>]/gi;//태그 삭제

        if(typeof str === 'number')
		{
        	str = String(str);
		}

		str = str.replace(/\<br\>/gi,"",str);

        var regExp = str.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
		

//        return regExp.replace(pattern6, "");
		//return str.replace(/(<[^>]*>)/gi, "");
        return str;
	}

}