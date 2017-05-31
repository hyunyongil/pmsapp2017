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
	this.grpListTmp = {}; //grpSeq를 key로 갖는 그룹리스트
	this.defaultGrpSeq = [];
	this.qstList = [];
	this.skinCode = null;
	this.skinUrl = null;
	this.cssUrl = null;
	this.joinData = {'grpList' : {}, 'nextGrpSeq' : {}, 'nextQstSeq' : {'1':0}, 'totalQstCnt' : 0, 'pageIndex':1, 'historyBack':{}};
	this.isMode = gup("isMode");
	this.maxRankCnt = {};
	this.totalQstCnt = 0;
	this.questionCnt = 0;
    this.checkSelectCnt=1;


	/**
	 * 최초 view에서 호출하게 되는 함수
	 */
	this.init = function()
	{
		this.getSurveyAjaxData();
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
            }
            , function (data) {

                //console.log(data);
                if(ONPANEL.Ajax.Result.isSucess(data)) {

                    joinSurvey.getSurveyData(data);
                }
                else {
                    alertLayer(data.resultMsg);
                    location.href = "poll.html";
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
		joinSurvey.grpList = joinSurvey.surveyData.grpList;

        if(typeof data.result.joinMyInfo != "undefined") {
            joinSurvey.joinData = data.result.joinMyInfo;
        }

		// 실제 설문진행
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
	this.setJoinData = function(flag,chPer, callback) 
	{
		var paramData = {
				'surveySeq' : this.surveySeq,
				'limit_type' : this.limit_type,   
				'surveyLinkId' : this.surveyLinkId,//비회원 테이블 분리 추가 -june// 053                                
				'doAction' : 'askData',  
				'chPer' : chPer,                        
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
                        //종료 문구
                        if(res.resultMsg=='LINK'){
                            var pointMsg='';
                        }
                        else {
                            var pointMsg='설문을 참여해주셔서 감사합니다. 총 '+res.result+' 포인트가 적립되었습니다.';
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
                        //종료 문구
                        if(res.resultMsg=='LINK'){
                            var pointMsg='';
                        }else{
                            var pointMsg='설문을 참여해주셔서 감사합니다. 총 '+res.result+' 포인트가 적립되었습니다.';
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
            $page = $('#pollJoin');
                      
            $header = $page.children( ":jqmData(role=header)" );
            $content = $page.children( ":jqmData(role=content_poll)" );

        //var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/"+joinSurvey.surveyData.layoutDataMobile.template_cover+".jpg";
        var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/style1_bg.jpg";        

        $("#pollJoin").css("background-image",'url('+bg_url+')');
console.log(joinSurvey.surveyData.layoutDataMobile.template_cover_yn);
		// 표지 사용할경우
		if (joinSurvey.surveyData.layoutDataMobile.template_cover_yn == "Y")
		{
			var foreward_html_h = [],foreward_html_c = []
				;
			

			// 로고 사용 여부


			//foreward_html_h.push('		<div style="position:absolute;top:15px;right:15px"> 1/20 </div>');

            
            //contents

           
			foreward_html_c.push('	<div class="cover_title_text '+joinSurvey.surveyData.layoutDataMobile.template_cover+'">'+joinSurvey.surveyData.layoutDataMobile.cover_title_text+'</div>');
			//foreward_html_c.push('	<button type="submit" data-theme="b" style="cursor:default">'+joinSurvey.surveyData.layoutDataMobile.cover_title_text+'</button>');

                           
			// 이미지 업로드
			if (joinSurvey.surveyData.layoutDataMobile.group_cover_bg == "style_06" && joinSurvey.surveyData.layoutDataMobile.cover_bg_user_path)
			{

			     foreward_html_c.push('	<div class="point_view_img"></div>');
			}
			else {
			     foreward_html_c.push('	<div class="point_view_img"></div>');
			}
			     foreward_html_c.push('	<div class="poll_disc"></div>');
            
            //contents-title            
			foreward_html_c.push('	<ul data-role="listview" data-inset="true" style="margin-bottom:30px;">');
                                 
         
			foreward_html_c.push('	<li style=" background:#FFF; padding:0px; position:relative; padding:15px">'+joinSurvey.surveyData.layoutDataMobile.cover_content_text+'</li>');      
			foreward_html_c.push('	</ul>');   
                 
            /////button     
                 
			foreward_html_c.push('	<div class="poll_bottom_btn">');
			//foreward_html_c.push('	<fieldset class="ui-grid-b">');
			//foreward_html_c.push('	<div class="ui-block-a"></div>');
			//foreward_html_c.push('	<div class="ui-block-b">');
		
			try {
				if (iframe_yn == "Y")
				{
					foreward_html_c.push('			<a href="javascript:;" class="n01_box_btn1" >설문시작</a>');
				}
				else {
					//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);"><button type="submit" data-theme="b">설문시작2</button></a>');
                    foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);" class="n01_box_btn1" >설문시작</a>');
				}
			}
			catch(e) {
					//foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);"><button type="submit" >설문시작3</button></a>');
					foreward_html_c.push('			<a href="javascript:;" onclick="javascript:joinSurvey.loadBodySkin(1);" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" >설문시작</a>');
			}


			//foreward_html_c.push('	</div>');
			//foreward_html_c.push('	</fieldset>');
			foreward_html_c.push('	</div>');
            /////button     
			foreward_html_c.push('	</div>');
            //contents            

			//page

            //$header.find( "h1" ).html( category.name );  
            //$header.html( foreward_html_h.join("") ); 
              
            $content.html( foreward_html_c.join("") );

            //$page.header("refresh");            
            //$page.content("refresh");
            //$page.page('refresh');
            $.mobile.changePage($page); 
            $page.trigger('pagecreate');
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
	this.loadFooterSkin = function(pointMsg) 
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
                    body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="location.href=\'poll.html\';"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');
    		}
    		else {
                    body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="location.href=\'poll.html\';"><button type="submit" data-theme="b" >설문참여목록으로 돌아가기</button></a></div>');

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
	   console.log(flag)

        var bg_url = CONNECTION_URL + "/page/onmetrics/mobile/design_set/skin/images/template/"+joinSurvey.surveyData.layoutDataMobile.body_bg+".jpg";

        $("#pollJoin").css("background-image",'url('+bg_url+')');

		if(flag == 1)
		{
			var body_html = []
				;
            $page = $('#pollJoin');
            
            
            $header = $page.children( ":jqmData(role=header)" );            
            $content = $page.children( ":jqmData(role=content_poll)" );
		//	$('body').html(''); //body영역을 초기화 한다.
            $content.html('');
              
        ///////header


			
			// 로고 사용 여부

			// 진행바 사용여부

        ///////header
        ///////content
        ///////content-top                        
                body_html.push('    <div id="content_article">');
            

                    
			    body_html.push('	</div>');    
        ///////content-bottom  
                body_html.push('    <div class="poll_bottom_btn poll_nav_btn">');
			    //body_html.push('	    <fieldset class="ui-grid-b">');
                body_html.push('	   <a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'" onclick="joinSurvey.prevPage();">이전</a>');
                body_html.push('	   <a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'"  onclick="joinSurvey.prevPage(\'reset\');">새로고침</a>');
                body_html.push('	   <a href="javascript:;" class="'+joinSurvey.surveyData.layoutDataMobile.common_button_type+'"  onclick="joinSurvey.nextPage();">다음</a>');
                //body_html.push('	   <div class="ui-block-a"><a href="javascript:;"  onclick="joinSurvey.prevPage();"><button type="submit" data-theme="b" >이전</button></a></div>');
                //body_html.push('	   <div class="ui-block-b"><a href="javascript:;"  onclick="joinSurvey.prevPage(\'reset\');"><button type="submit" data-theme="b" >새로고침</button></a></div>');
                //body_html.push('	   <div class="ui-block-b"><a href="javascript:;"  onclick="joinSurvey.nextPage();"><button type="submit" data-theme="b" >다음</button></a></div>');
                //body_html.push('	</fieldset>');
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
            //$page.page('refresh');
			//joinSurvey.progress();
			joinSurvey.drowSurvey();//실제로 문항생성
            
		}
		else
		{
		  
			//joinSurvey.progress(); //본문 진행바 처리
  			joinSurvey.drowSurvey(pointMsg);
		}
	};
	
	/**
	 * 설문 그림
	 */
	this.drowSurvey = function(pointMsg) 
	{
		var grpSeq = joinSurvey.defaultGrpSeq[0];
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

		if( joinSurvey.joinData.totalQstCnt > 0 )
		{
			if( joinSurvey.joinData.totalQstCnt == 1 )
			{
				if( joinData.pageIndex == 1 ) {
					joinSurvey.questionCnt = 0;
				} else {
					joinSurvey.questionCnt = joinSurvey.joinData.totalQstCnt;
				}
			}
			else
			{
				if( joinData.pageIndex == 1 ) {
					joinSurvey.questionCnt = 0;
				} else {
					joinSurvey.questionCnt = joinSurvey.joinData.totalQstCnt;
				}
			}
		}
		else {
			// @bug 수정됨.
			// 문항 카운트 초기화
			joinSurvey.questionCnt = 0;
		}

		for(var i=startQstSeq; i<joinSurvey.grpList[grpSeq].qstList.length; i++)
		{
			var qstInfo = joinSurvey.grpList[grpSeq].qstList[i];

			if(qstInfo.qstType == 'PAGEBREAK') //페이지 브레이크 일 경우 종료
			{
				isBreak = 1;
				break;
			}

			joinSurvey.questionCnt++;

			qstObj = joinSurvey.drowQuestion(qstInfo, i, joinSurvey.questionCnt);
			$('#content_article').append(qstObj);
            
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
							DOM.getDiv('poll_quest').html('Q'+seq+' '+qstInfo.qstComment).append(
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
						if (joinSurvey.htmlChecker(qstInfo.qstComment))
						{
							$(this).append(DOM.getDiv('poll_quest').addClass(joinSurvey.surveyData.layoutDataMobile.body_bg).html('Q'+seq+' '+qstInfo.qstComment));
						}
						else {
							$(this).append(DOM.getDiv('poll_quest').addClass(joinSurvey.surveyData.layoutDataMobile.body_bg).html('Q'+seq+' '+qstInfo.qstComment).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_title));
						}
					}
				}
                
		).append(//질문 이미지/동영상 그리기
        
			function()
			{
				if (qstInfo.qstCommentImg != undefined && joinSurvey.htmlChecker(qstInfo.qstCommentImg))
				{
				    

				   // console.log(qstInfo.qstCommentImg);

                    $(this).append(DOM.getDiv('poll_quest_sub').addClass('query_text_border_img').html(qstInfo.qstCommentImg));
				}

            }
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
				per = Math.round(joinSurvey.joinData.pageIndex/joinSurvey.surveyData.pageCnt*100);
			}
		}

        $("#progress_bar").text(joinSurvey.joinData.pageIndex+"/"+joinSurvey.totalQstCnt);

		//$('.progress .pro').css({"width":per+"%"});
		//$('.progress .pro_text').text(per+"%");
		//$('.progress .pro_time strong').text("남은시간: "+this.getItemTime((joinSurvey.totalQstCnt-joinSurvey.joinData.totalQstCnt)*2));

	};

	/**
	 * 기본형 세로
	 */
	this.prevDefaultRow = function(qstInfo)
	{
		var returnObj = 
			//$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
            $(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).append(            
				$(document.createElement('form')).append(
					function()
					{
						var lastItem = end(qstInfo.itemList);
						var itemList = JSON.parse(JSON.stringify(qstInfo.itemList));
						var randVal = qstInfo.qstOptionList['RANDITEM'].optionValue;
						var randLastVal = qstInfo.qstOptionList['RANDITEM'].subOptionValue;
                        var continueItem = '';
						if(randVal == 'CHECKED')
							shuffle(itemList);
						
						for(var i in itemList)
						{
							if(itemList[i] != '' && itemList[i] != null)
							{

									if(randLastVal == 'CHECKED')
									{
                                    //console.log(itemList[i]);
                                    //console.log(itemList[i].itemSeq);
                                    //console.log(lastItem.itemSeq);                                    									   
										if(itemList[i].itemSeq == lastItem.itemSeq)
                                        {
                                            continueItem = i;
											continue;                                            
                                        }

									}
                                    
		                            if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타 input box                                    
                                    {
                                        var textLabel='text_label';
                                    }else{
                                        var textLabel='';                                        
                                    }
									$(this).append(
                                        DOM.getDiv(textLabel).append(
											function()
											{
												if(qstInfo.qstType == 'MULTI')
												{
													if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT') //다중선택 처리
													{
														$(this).append(
															DOM.getCheckBox().attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).change(function(){
																//답변처리
																//joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
																//답변처리
          						                                if(randVal == 'CHECKED')
                                                                {
                                                                    joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),'','etc');   
                                                                }else{
                                                                    joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
                                                                }
                                                                
															}).append(function(){
																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																{
																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																	{
																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																			$(this).prop('checked', true);
																	}
																}
															})
														);
													}
													else //단일선택 처리
													{
												
														$(this).append(
															DOM.getRadioButton('item'+qstInfo.qstSeq).attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).change(function(){
																//답변처리
                                                                //console.log('randVal:'+randVal);
                                                                //console.log('itemIndex:'+itemList[i].itemSeq);                                                                  
                                                                //console.log('itemEtc:'+itemList[i].itemOptionList['INPUT'].optionValue);  
                                                                
          						                                if(randVal == 'CHECKED')
                                                                {
                                                                    joinSurvey.resultAsk(qstInfo, '', this,'','etc');   
                                                                }else{
                                                                    joinSurvey.resultAsk(qstInfo, '', this);
                                                                }

															}).append(function(){
																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
																{
																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
																	{
																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
																			$(this).prop('checked', true);
																	}
																}
															})
														);
													}
												}
												else if(qstInfo.qstType == 'RANK')
												{
												    
													$(this).append(
														DOM.getDiv('poll_list_num')
                                                        .append(
                                                            DOM.getSpan('poll_list_num_span rankCnt'+qstInfo.qstSeq, 'span'+itemList[i].itemSeq).html('&nbsp;').append(
    															function()
    															{
    																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    																{
    																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    																	{
    																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																		{
    																		  //alertLayer(1)
                                                                              //console.log('prev=>'+joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse)
    																			//$(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                                                                                $(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
    																		}
    																	}
    																}
    															}
                                                            )//poll_list_num_span
												        )//poll_list_num
													).append(
														DOM.getCheckBox().click(function(){//랭크 선택시  처리
															if(joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined)
															{
																joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
															}
    												//	console.log(i)

															if($(this).prop('checked') == true)//빈박스 체크
															{
														 
																$('#span'+$(this).val()).html(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);
													//console.log('2:'+joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt)	                                                                
																joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt++;
                                                             
															}
															else
															{
													//console.log('3')			                                                             
                                                                //var chk = $(this).is(":checked");//.attr('checked');
                													   ////////
                                                                        var checkCnt = $('#span'+$(this).val()).html();
                                                                        console.log('checkCnt:'+checkCnt)
                														$('.rankCnt'+qstInfo.qstSeq).each(function(){
                															if($(this).html()!= '' && $(this).html()!='&nbsp;')
                															{
                																if(checkCnt < $(this).html())
                																	$(this).html($(this).html()-1);
                															}
                														});
                														
                														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt--;
                                                                        $('#span'+$(this).val()).html('&nbsp;');
                													   ////////  
                                                                //$(this).parent().find('input:first').change();
                                                                //$(".radio_01").prop('checked', false).checkboxradio("refresh");
                                                                //$(this).parent().parent().parent().parent().find('input[type=checkbox]').prop('checked', false);
                                                                
                                                                //$('.rankCnt'+qstInfo.qstSeq).html('&nbsp;');
                                                                //joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt=1;
                                                                //joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
															}
                                                        checkSelectCnt=joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;
													
                                                            
														}).attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).change(function(){
														  
                                                                if (typeof checkSelectCnt == 'undefined') {
                                                                    checkSelectCnt = 1;

                                                                }
															//답변처리
                                                            
          						                                if(randVal == 'CHECKED')
                                                                {
                                                                    joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),checkSelectCnt,'etc');   
                                                                }else{
                                                                    joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),checkSelectCnt);
                                                                }                                                            
                                                            

															//joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),checkSelectCnt);
														}).append(function(){
			                          //console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);
                          													  
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
																	console.log(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt)
                                                                    console.log(addResponse)
																		if(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt < addResponse)
																		{
																			joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt = addResponse;
																		}else{
																		  
                                                                            joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt = addResponse +1;
																		}
						 
																		$(this).prop('checked', true);
      
																	}
																}
															}
                                                            
														})
													);
												}//if

    											$(this).append(//input
                                                    joinSurvey.randomIncludeSub(qstInfo,itemList,itemList[i].itemSeq,i)//기타 input box	
                                                )
                                            }//function$('<label>').attr('for', input.attr('id')).html(title);
                                        )                                      
									).append(//this

                                        joinSurvey.randomInclude(qstInfo,itemList,itemList[i].itemSeq,i)//label
                                    );

							}//if
						}//for
						
                    //last random

                        if(randLastVal == 'CHECKED')
						{

                            var textLabel='text_label';
					  
							$(this).append(

                                    DOM.getDiv(textLabel).append(
										function()
										{
    									   var i=continueItem;
    										if(qstInfo.qstType == 'MULTI')
    										{
    											if(qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT')
    											{
    												$(this).append(
    													DOM.getCheckBox().attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).on('change', function() {
    														//답변처리
    														//$(this).parent().find('input:first').prop('checked', true);
    
    														joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),'', 'etc');                                                        
    													}).append(function(){
    														if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    														{
    															if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    															{
    																if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																	$(this).prop('checked', true);console.log('cc');
                                                                        
    															}
    														}
    													})
    												);
    											}
    											else
    											{
    												$(this).append(
    													DOM.getRadioButton('item'+qstInfo.qstSeq).attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).on('change', function() {
    														//답변처리
    														joinSurvey.resultAsk(qstInfo, '', this,'', 'etc');
                                                            
                                                            
                                                            
    													}).append(function(){
    														if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
    														{
    															if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
    															{
    																if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
    																	$(this).prop('checked', true);
    															}
    														}
    													})
    												);
    											}
    										}
    										else if(qstInfo.qstType == 'RANK')
    										{
    													$(this).append(
    														  DOM.getDiv('poll_list_num')
                                                                .append(
                                                                    DOM.getSpan('poll_list_num_span rankCnt'+qstInfo.qstSeq, 'span'+itemList[i].itemSeq).html('&nbsp;').append(
                    													function()
                    													{
                    														if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                    														{
                    															if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                    															{
                    																if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq] != undefined)
                    																{
                    																	$(this).html(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[itemList[i].itemSeq].addResponse);
                    																}
                    															}
                    														}
                    													}//function
                                                                    )//poll_list_num_span
                												)//poll_list_num
                											).append(
                												DOM.getCheckBox().on('click',function(event,param1){
    												                //event.preventDefault();
                                                                    
                													if(joinSurvey.maxRankCnt[qstInfo.qstSeq] == undefined)
                													{
                														joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};
                													}
                													console.log(event);
                                                                    console.log('2:'+param1);
                													if($(this).prop('checked') == true)//빈박스 체크 했을때
                													{
                													//console.log('2')	
                                                                   // alertLayer(1)												   
                														$('#span'+$(this).val()).html(joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt);
                														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt++;
                													}
                													else
                													{
                													   ////////
                                                                        var checkCnt = $('#span'+$(this).val()).html();
                                                                        console.log('checkCnt:'+checkCnt)
                														$('.rankCnt'+qstInfo.qstSeq).each(function(){
                															if($(this).html()!= '' && $(this).html()!='&nbsp;')
                															{
                																if(checkCnt < $(this).html())
                																	$(this).html($(this).html()-1);
                															}
                														});
                														
                														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt--;
                                                                        $('#span'+$(this).val()).html('&nbsp;');
                													   ////////                                                                        
                													//console.log('3')
                														//$(this).parent().parent().find('input[type=checkbox]').prop('checked', false);
                													//	$(".radio_01").prop('checked', false).checkboxradio("refresh");
                													//	$('.rankCnt'+qstInfo.qstSeq).html('&nbsp;');
                														//joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt=1;
                														//joinSurvey.maxRankCnt[qstInfo.qstSeq] = {'cnt':1};                                                        
                													}
                                                                    checkSelectCnt=joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt;                                                    
                												}).attr({'itemIndex':i, 'id':'item'+i}).val(itemList[i].itemSeq).change(function(){
                													//답변처리 //JUNE-0717
                													//joinSurvey.resultAsk(qstInfo, 'MULTI', $(this));
                                                                    if (typeof checkSelectCnt == 'undefined') {
                                                                        checkSelectCnt = 1;
                
                                                                    }         
                                                                                                               
                													joinSurvey.resultAsk(qstInfo, 'MULTI', $(this),checkSelectCnt, 'etc');
                                                                    
                												}).append(function(){
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
                                                                    
    														      })
    					                               );
    										}//if
											$(this).append(//input
                                                joinSurvey.randomExceptionSub(qstInfo,continueItem)//기타 input box	
                                            )
									   }//function
									)//div								
								).append(//checked this

                                        joinSurvey.randomException(qstInfo,continueItem)

                                    
                                );


						}//if
					}//function
				)//form
			)//fieldset
		;
	//	console.log(returnObj);
		return returnObj;
	};
	
	/**
	 * 객관식 random 포함 etc 처리        // last 랜덤 포함
	 */    
	this.randomInclude = function(qstInfo,itemList,optionSeq,i)
	{   
//console.log(qstInfo.qstType);
        var rankLabel="";
        if(qstInfo.qstType == 'RANK'){
            rankLabel="randomLabel";
        }else{
            rankLabel="";
        }
//console.log(rankLabel);
//console.log(itemList[i].itemTitle);
//console.log(i);    
		var returnObj =        

                                        $(document.createElement('label')).attr('for', 'item'+i).addClass(rankLabel).append(
                                            function()
                                            {
                                                
                                                
    											if (joinSurvey.htmlChecker(itemList[i].itemTitle) == false)
    											{
    												$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view)
    											}                                                
                                                //답변 이미지/동영상 그리기
                                                if(itemList[i].itemTitleImg != undefined && joinSurvey.htmlChecker(itemList[i].itemTitleImg))
                                                {
                                                    DOM.getImage(itemList[i].itemTitleImg).css({'padding-top':'7px'})
                                                    $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(itemList[i].itemTitleImg));
		
                                                }
                                                
                                                
												if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타 input box
												{
													$(this).append(
                                                        DOM.getDiv('ui-grid-a').append(//기타 title
                                                      
                                                            DOM.getDiv('ui-block-a').css({'width':'auto', 'line-height':'36px','margin-right':'15px'}).append(itemList[i].itemTitle+'1')
                                                            
                                                        ).append(//기타 입력박스

                                                        )
													);
												}                                                
                                                
                                                
                                            }
                                        ).append(
                                            function()
                                            {
            
												if(itemList[i].itemOptionList['INPUT'].optionValue != 'CHECKED')//기타 input box
												{                                                
                                                    $(this).append(itemList[i].itemTitle+'1')
                                                }
                                            }
                                        )
        
        ;
        
       
		return returnObj;
	};
    
	/**
	 * 객관식 random 포함 etc 처리        // last 랜덤 포함
	 */    
	this.randomIncludeSub = function(qstInfo,itemList,optionSeq,i)
	{   
        var returnObj = '';	   
////console.log(qstInfo.qstType);


//console.log(itemList[i].itemTitle);
//console.log(i);    
		if(itemList[i].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타 input box
		{
		  
    		if( qstInfo.qstType == 'MULTI' && qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT')//체크박스, 다중선택
    		{              
        		returnObj =        
        
        					//$(this).append(
                                DOM.getDiv('ui-grid-a').append(//기타 입력박스
                                    DOM.getDiv('ui-block-b').append(  
                                                                                                                                                             
                                    	DOM.getTextBox().css({'margin-left':'10px', 'margin-top':'5px',}).click(function(){
                     
        										if($(this).prop('checked') == true)
        										{
        
        										}
        										else
        										{

                                                    $(".radio_01").prop('checked', false).checkboxradio("refresh");
        
        										}
                                                                              
                                    			$(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");


                                    	}).on('blur', function(){

        										$(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");


                                            $(this).parent().parent().parent().parent().find('input:first').trigger('click');
        
                                    	}).append(function(){
                                    	   //console.log('a1:'+joinSurvey.joinData.grpList[qstInfo.grpSeq]);
                                    		if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                    		{
                                    			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                    			{
        
                                    				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq] != undefined)
                                                    {
                                                        console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq].subAddResponse);
                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq].subAddResponse);
                                                    }
                                    					
                                    			}
                                    		}
                                    	})
                                    )//block
                                )//grid
        					//);
                            
                
                    ;
                }//다중선택
                else{
                    
                    
        		returnObj =        
        
        					//$(this).append(
                                DOM.getDiv('ui-grid-a').append(//기타 입력박스
                                    DOM.getDiv('ui-block-b').append(  
                                                                                                                                                             
                                    	DOM.getTextBox().css({'margin-left':'10px', 'margin-top':'5px',}).click(function(){
                                    		if( qstInfo.qstType != 'RANK' )//라디오버튼
                                    		{
                                                
        										if($(this).prop('checked') == true)
        										{
        
        										}
        										else
        										{
                                                    $(".radio_01").prop('checked', false).checkboxradio("refresh");
        										}
            			                         $(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");                                                                
                                    		}else{//우선순위
                                    	
                                                $(this).parent().parent().parent().parent().find('input:first').trigger('click',['extraClick']);
            			                         
                                               
                                    		}
                                    	}).on('blur', function(){
    											if( qstInfo.qstType != 'RANK' )//라디오버튼
    											{
							                      $(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");
                                                  $(this).parent().parent().parent().parent().find('input:first').trigger('click');//???
                                                  
    											}else{//우선순위

            										  console.log('true:')
                                                      
    													   ////////
                                                            var checkCnt = $('#span'+$(this).val()).html();
                                                            console.log('checkCnt:'+checkCnt)
    														$('.rankCnt'+qstInfo.qstSeq).each(function(){
    															if($(this).html()!= '' && $(this).html()!='&nbsp;')
    															{
    																if(checkCnt < $(this).html())
    																	$(this).html($(this).html()-1);
    															}
    														});
    														
    														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt--;
                                                            $('#span'+$(this).val()).html('&nbsp;');
    													   //////// 
                                                      $(this).parent().parent().parent().parent().find('input:first').prop('checked', false).checkboxradio("refresh"); 
                                                      $(this).parent().parent().parent().parent().find('input:first').trigger('click',false);
                                                      
 											         //var inp = $(this).val();
                                                     //$(this).textinput();
                                                     
                                                    // $('.ui-input-text').on('change', function() {
                                                     //   $(this).val($(this).prop("defaultValue"));
                                                    //});

    											}  
        
                                    	}).append(function(){
                                    	   //console.log('a1:'+joinSurvey.joinData.grpList[qstInfo.grpSeq]);
                                    		if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                    		{
                                    			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                    			{
        
                                    				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq] != undefined)
                                                    {
                                                        console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq].subAddResponse);
                                                        $(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[optionSeq].subAddResponse);
                                                    }
                                    					
                                    			}
                                    		}
                                    	})
                                    )//block
                                )//grid
        					//);
                            
                
                    ;                    
                    
                    
                }//라디오, 우선순위
                
                
                
        }//checked 기타

		return returnObj;
	};
    
	/**
	 * random 제외 etc 처리        //last 입력박스 random 제외
	 */
	this.randomException = function(qstInfo,continueItem)
	{
		var lastItem = end(qstInfo.itemList);
		var itemList = JSON.parse(JSON.stringify(qstInfo.itemList));
        
        var rankLabel="";
        if(qstInfo.qstType == 'RANK'){
            rankLabel="randomLabel";
        }else{
            rankLabel="";
        }
            
		var returnObj =        

            $(document.createElement('label')).attr('for', 'item'+continueItem).addClass(rankLabel).append(
				function()
				{
				    
                    
                                                
						if (joinSurvey.htmlChecker(lastItem.itemTitle) == false)
						{
							$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view)
						}                                                
                        //답변 이미지/동영상 그리기
                        if(lastItem.itemTitleImg != undefined && joinSurvey.htmlChecker(lastItem.itemTitleImg))
                        {
                            DOM.getImage(lastItem.itemTitleImg).css({'padding-top':'7px'})
                            $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(lastItem.itemTitleImg));

                        }
                                                                    
                    
						if(lastItem.itemOptionList['INPUT'].optionValue == 'CHECKED')///////기타 입력박스
						{
                    		if( qstInfo.qstType == 'MULTI' && qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT')
                    		{   						  
    							$(this).append(
                                    DOM.getDiv('ui-grid-a').append(//기타 title
                                     
                                        DOM.getDiv('ui-block-a').css({'width':'auto', 'line-height':'36px','margin-right':'15px'}).append(lastItem.itemTitle+'2')
                                        
                                    ).append(//기타 입력박스

                                    )
    							);  
                          
                            }else{                          
 						  
    							$(this).append(
                                    DOM.getDiv('ui-grid-a').append(//기타 title
                                  
                                        DOM.getDiv('ui-block-a').css({'width':'auto', 'line-height':'36px','margin-right':'15px'}).append(lastItem.itemTitle+'2')
                                        
                                    ).append(//기타 입력박스

                                    )
    							);                                                          
                            }//MULTISELECT
                        }

                }
		    )
        
        ;
        
       
		return returnObj;
	};

	/**
	 * random 제외 etc 처리        //last 입력박스 random 제외
	 */
	this.randomExceptionSub = function(qstInfo,continueItem)
	{
		var lastItem = end(qstInfo.itemList);
		var itemList = JSON.parse(JSON.stringify(qstInfo.itemList));	   	   
        var returnObj = '';	  
        
		if(lastItem.itemOptionList['INPUT'].optionValue == 'CHECKED')///////기타 입력박스
		{
    		if( qstInfo.qstType == 'MULTI' && qstInfo.qstOptionList['ASKTYPE'].optionValue == 'MULTISELECT')//체크박스, 다중선택
    		{    		  		  
    		  
                //alertLayer(1)
                    returnObj =                                                    
                                DOM.getDiv('ui-grid-a').append(//기타 입력박스
                                    DOM.getDiv('ui-block-b').append(  

                                            	DOM.getTextBox().css({'margin-left':'10px', 'margin-top':'5px'}).click(function(){
                                            	   
                                                    if($(this).val() && !$(this).parent().parent().parent().parent().find('input:first').is(":checked"))
                                                    {
                                                        console.log(1)   //$(this).parent().find('input:first').prop('checked', true);
                                                        
                                                    }else{
                                                        console.log(1)   //$(this).parent().find('input:first').prop('checked', true).checkboxradio("refresh");
                                                                                                                        
                                                    }                                                                
                                                    $(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");  
                                                }).on('blur', function(){
    
                                                    console.log(continueItem)    
                                                    //alertLayer(2);                                                         
                                                    if($('#item'+continueItem).parent().find('input:first').is(":checked"))
                                                    {
                                                    console.log(3)                                                               
                                                       $('#item'+continueItem).parent().find('input:first').prop('checked', false).checkboxradio("refresh");
                                                       $('#item'+continueItem).parent().find('input:first').trigger('click');
                                                    }
        
                                            	}).append(function(){
                                            		if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                            		{
                                            			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                            			{
                                            				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                            					$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].subAddResponse);
                                            			}
                                            		}
                                             	})

                                        
                                                
                                            )
                                        )
                            ;
                            
            }//if
            else{//라디오, 우선순위
               // alertLayer(2)
                    returnObj =                  
                                        DOM.getDiv('ui-grid-a').append(//기타 입력박스
                                            DOM.getDiv('ui-block-b').append(  
        
                                                        
                                                    	DOM.getTextBox().css({'margin-left':'10px', 'margin-top':'5px'}).click(function(){
                                                    		if( qstInfo.qstType != 'RANK' )//라디오버튼
                                                    		{
                                                                
                        										if($(this).prop('checked') == true)
                        										{
                        
                        										}
                        										else
                        										{
                                                                    $(".radio_01").prop('checked', false).checkboxradio("refresh");
                        										}
                            			                         $(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");                                                                
                                                    		}else{//우선순위
                                                    	
                                                                $(this).parent().parent().parent().parent().find('input:first').trigger('click',['extraClick']);
                            			                         
                                                               
                                                    		}
                                                            
                                                            
                                                    	}).on('blur', function(){
                											if( qstInfo.qstType != 'RANK' )//라디오버튼
                											{
										                      $(this).parent().parent().parent().parent().find('input:first').prop('checked', true).checkboxradio("refresh");
                                                              $(this).parent().parent().parent().parent().find('input:first').trigger('click');
                                                              
                											}else{//우선순위

                        										  console.log('true:')
                                                                  
                													   ////////
                                                                        var checkCnt = $('#span'+$(this).val()).html();
                                                                        console.log('checkCnt:'+checkCnt)
                														$('.rankCnt'+qstInfo.qstSeq).each(function(){
                															if($(this).html()!= '' && $(this).html()!='&nbsp;')
                															{
                																if(checkCnt < $(this).html())
                																	$(this).html($(this).html()-1);
                															}
                														});
                														
                														joinSurvey.maxRankCnt[qstInfo.qstSeq].cnt--;
                                                                        $('#span'+$(this).val()).html('&nbsp;');
                													   //////// 
                                                                  $(this).parent().parent().parent().parent().find('input:first').prop('checked', false).checkboxradio("refresh"); 
                                                                  $(this).parent().parent().parent().parent().find('input:first').trigger('click',false);
                                                                  
             											         //var inp = $(this).val();
                                                                 //$(this).textinput();
                                                                 
                                                                // $('.ui-input-text').on('change', function() {
                                                                 //   $(this).val($(this).prop("defaultValue"));
                                                                //});

                											}  
                                                            
                                                            console.log($(this).val());                                                          	   
                                                    		//$(this).parent().find('input:first').on('change', function(){});
                                                            
                
                                                    	}).append(function(){
                                                    		if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                                                    		{
                                                    			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                                                    			{
                                                    				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq] != undefined)
                                                    					$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[lastItem.itemSeq].subAddResponse);
                                                    			}
                                                    		}
                                                    	})                                                
                                                
                                            )
                                        )
                                ;                                                                                
            }//multiselect                                    

        
        }       
		return returnObj;
	};
	
	/**
	 * 주관식 미리보기
	 */
	this.prevOpen = function(qstInfo)
	{
		var returnObj = 
            $(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(
				//$(document.createElement('div')).append(
					function()
					{
						for(var i in qstInfo.itemList)
						{
							if(qstInfo.itemList[i] != '')
							{
								if(qstInfo.itemList[i] != null)
								{
									$(this).append(
										$(document.createElement('div')).css({'overflow':'hidden'})
                                        .append(
                                            DOM.getSpan().css({'float':'left', 'padding':'10px'})
                                            .append(
                                                $(document.createElement('label')).attr('for', 'select-choice-mini').append(qstInfo.itemList[i].itemTitle)
                                            )
                                        
                                        
                                        )
                                        .append(//답변 이미지/동영상 그리기
                                            function()
                                            {
                                                if(qstInfo.itemList[i].itemTitleImg != undefined && joinSurvey.htmlChecker(qstInfo.itemList[i].itemTitleImg))
                                                {
                                                    $(this).append($(document.createElement('div')).addClass('muhang_text_border_img').html(qstInfo.itemList[i].itemTitleImg));
		
                                                }
                                            }
								        )                                             
                                        .append(
                                                DOM.getSpan().css({'float':'left'})
                                                .append(                                        
        											function()
        											{
        
        												if(qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'INPUT')
        												{
        													$(this).append(
        														DOM.getTextBox().attr({'itemIndex':i, 'itemSeq':qstInfo.itemList[i].itemSeq}).addClass('input_02').append(
        															function()
        															{
        																if(qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
        																	$(this).css({'display':'block', 'clear':'both', 'width':'100px', 'ime-mode':'disabled'});
        																else
        																	$(this).css({'display':'block', 'clear':'both', 'width':'100px'});
        															}
        														).attr({
        															'onlynum':qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
        														}).keypress(function(e){
        															if($(this).attr('onlynum') == 'CHECKED')
        															{
        																if(e.which && (e.which < 48 || e.which > 57))
        																	e.preventDefault();
        															}
        														}).change(function(){
        															//답변처리
        															joinSurvey.resultAsk(qstInfo, '', this);
        														}).append(
        															function()
        															{
        																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
        																{
        																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
        																	{
        																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
        																			$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
        																	}
        																}
        															}
        														)
        													);
        												}
        												else if(qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'INPUT2')
        												{
        													$(this).append(
        														DOM.getTextBox().attr({'itemIndex':i, 'itemSeq':qstInfo.itemList[i].itemSeq}).addClass('input_02').append(
        															function()
        															{
        																if(qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
        																	$(this).css({'display':'block', 'clear':'both', 'width':'300px', 'ime-mode':'disabled'});
        																else
        																	$(this).css({'display':'block', 'clear':'both', 'width':'300px'});
        															}
        														).attr({
        															'onlynum':qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
        														}).keypress(function(e){
        															if($(this).attr('onlynum') == 'CHECKED')
        															{
        																if(e.which && (e.which < 48 || e.which > 57))
        																	e.preventDefault();
        															}
        														}).change(function(){
        															//답변처리
        															joinSurvey.resultAsk(qstInfo, '', this);
        														}).append(
        															function()
        															{
        																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
        																{
        																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
        																	{
        																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
        																			$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
        																	}
        																}
        															}
        														)
        													);
        												}                                                
        												else if(qstInfo.itemList[i].itemOptionList['TEXTTYPE'].optionValue == 'TEXTAREA')
        												{
        													$(this).append(
        														DOM.getTextArea().attr({'itemIndex':i, 'itemSeq':qstInfo.itemList[i].itemSeq}).addClass('input_02').append(
        															function()
        															{
        																if(qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue == 'CHECKED')
        																	$(this).css({'display':'block', 'clear':'both', 'width':'300px', 'height':'50px', 'ime-mode':'disabled'});
        																else
        																	$(this).css({'display':'block', 'clear':'both', 'width':'300px', 'height':'50px'});
        															}
        														).attr({
        															'onlynum':qstInfo.itemList[i].itemOptionList['ONLYNUM'].optionValue
        														}).keypress(function(e){
        															if($(this).attr('onlynum') == 'CHECKED')
        															{
        																if(e.which && (e.which < 48 || e.which > 57))
        																	e.preventDefault();
        															}
        														}).change(function(){
        															//답변처리
        															joinSurvey.resultAsk(qstInfo, '', this);
        														}).append(
        															function()
        															{
        																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
        																{
        																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
        																	{
        																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq] != undefined)
        																			$(this).val(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[qstInfo.itemList[i].itemSeq].addResponse);
        																	}
        																}
        															}
        														)
        													);
        												}
        											}
                                                )
										)//.attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_view).css({'padding-bottom':'5px'})
									);
								}
							}
						}
					}
				//)//div
			)
		;
		
		return returnObj;
	}
	
	/**
	 * 척도형 미리보기
	 */
	this.prevMatrix = function(qstInfo)
	{
	   /*
		var tableWidth = 0;
		tableWidth = (qstInfo.sectionList.length+1)*250;
		if(tableWidth < 400)
			tableWidth = 400;
		
		if (qstInfo.sectionList.length < 4)
		{
			tableWidth = "100%";
		}
        */
		var tableWidth = "100%";
        
        
		var returnObj = 
            $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).append(
				function()
				{   //단을 그림  
					for(var i in qstInfo.sectionList)
					{				    
    				    $(this).append(                        
            				DOM.getTable().addClass('poll_table'+' ').attr({'width':tableWidth,'style':'','scope':'row'}).append(//table
            					DOM.getTr().append(
            							$(document.createElement('th')).attr({'rowspan':'2','style':'','scope':'row'}).css({'width':'210px'}).html('구분')
            					).append(
            						function()
            						{
            							//단을 그림
            							//for(var i in qstInfo.sectionList)
            							//{
            								$(this).append(
            									$(document.createElement('th')).attr({'style':''+"width:150px;",'scope':'row'}).append(
            											qstInfo.sectionList[i].sectionTitle).css({'text-align':'center'}
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
            									$(document.createElement('th')).attr({'style':''+"width:auto;",'scope':'row'}).addClass('').append(
                                                    $(document.createElement('table')).attr({'style':''+"width:100%;"}).addClass('').append(//테이블 추가 150415-JUNE
                		                              DOM.getTr().append( //tr 추가 150415-JUNE                                        
                										function()
                										{
                											var k = 0;
                											for(var j in qstInfo.sectionList[i].itemList)
                											{
                												$(this).append(
                                                                  $(document.createElement('th')).attr({'align':'center','width':'45%','scope':'row'}).append(//td 추가 150415-JUNE                                                    
                														DOM.getSpan()
                														.html(qstInfo.sectionList[i].itemList[j].itemTitle)
                                                                  )
                												);
                												if(k == 0)
                												$(this).append(
                                                                  $(document.createElement('th')).attr({'align':'center','scope':'row'}).append(//td 추가 150415-JUNE                                                       
            
                                                                        //DOM.getImage('sub_wri/table_img01.png').css({'padding-bottom':'7px'})
                                                                        '↔'
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
            									).append(
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
            											$(this).append(//우측 td
            												$(document.createElement('td')).attr({'align':'center'}).addClass('poll_table_multi_radio').append(
                                                            
            				                                    DOM.getTable().append(//라디오버튼 가로정렬위한 테이블 
                                                                    DOM.getTr().append(                                                                                                       
                    													function()
                    													{
                    														if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                    															$(this).addClass('table_bold');
                    														
                    														for(var k=1; k<=qstInfo.sectionList[i].sectionOptionList['SUBCNT'].optionValue; k++)
                    														{
                    															$(this).append(
            												                        $(document.createElement('td')).append(                                                                    
                                                                                
                                                                                        $(document.createElement('label')).append(
                            																DOM.getRadioButton('item_'+qstInfo.qstSeq+'_'+h+'_'+i).attr({'sectionSeq':qstInfo.sectionList[i].sectionSeq, 'subQstSeq':qstInfo.subQstList[h].qstSeq}).val(k).change(function(){
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
                            																					if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[i].sectionSeq].subQstList[qstInfo.subQstList[h].qstSeq].askList[k] != undefined)
                            																						$(this).prop('checked', true);
                            																				}
                            																			}
                            																		}
                            																	}
                            																})
                                                                                        )//label  
                                                                                    )//td
                                                                                                                                                      
                    															);
                    														}//for
                    													}//function
                                                                    )//tr
                                                                )//table
            												)//td	
            											);
            										//}//for
            									}//function
            								)//tr
            							);//this
            						}
            					}//function
            				)//table
                            .append(
                                $(document.createElement('br'))
                            )//table
                    );//this
                }
            }//function
        )//fieldset
		;
		
		return returnObj;
	}
	
	/**
	 * AHP 미리보기
	 */
	this.prevAhp = function(qstInfo)
	{
		var returnObj = '';
		var sectionTitle = '';
		
		returnObj = 
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(  
           $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9; overflow:auto;'}).append(                  
			DOM.getTable().addClass('poll_table'+' ').attr({'width':'100%'}).css({'min-width':'450px'}).append(
				DOM.getTr().append(
					$(document.createElement('th')).attr({'style':'','scope':'row'}).css({'width':'210px'}).html('구분')
				).append(
					function()
					{
						//단을 그림
						for(var i in qstInfo.sectionList)
						{
							$(this).append(
								$(document.createElement('th')).attr({'style':'','scope':'row'}).append(
                            
                                    $(document.createElement('table')).attr({'style':''+"width:100%;"}).addClass('').append(//테이블 추가 150415-JUNE
		                              DOM.getTr().append( //tr 추가 150415-JUNE
                                      
    									function()
    									{
    										var k = 0;
    
    										for(var j in qstInfo.sectionList[i].itemList)
    										{
    											$(this).append(
                                                  $(document.createElement('th')).attr({'align':'center','width':'45%','scope':'row'}).append(//td 추가 150415-JUNE                                                   
    												DOM.getDiv()
    												.html(qstInfo.sectionList[i].itemList[j].itemTitle)
    												/*.append(
    													function()
    													{
    														if(k==0)
    															$(this).css({'float':'left'});
    														else
    															$(this).css({'float':'right'});
    													}
    												)*/
                                                  )                                                    
    											);
    											if(k == 0)
    											{
    												$(this).append(
                                                      $(document.createElement('th')).attr({'align':'center','scope':'row'}).append(//td 추가 150415-JUNE                                                            
    													//DOM.getImage('sub_wri/table_img01.png').css({'padding-top':'7px'})
                                                        '↔'
                                                      )
    												);
    											}
    											
    											k++;
    										}
    									}                                                                              

                                     )
                                    )
                                    
                                                                        

								)
							);
						}
					}
				).append(
					$(document.createElement('th')).attr({'style':'','scope':'row'}).css({'width':'210px'}).html('구분')
				)
			).append(
				function()
				{
					for(var i in qstInfo.subQstList)
					{
						$(this).append(
							DOM.getTr().append(//맨 좌측 td
								$(document.createElement('td')).html(function(){
									if (joinSurvey.htmlChecker(qstInfo.subQstList[i].qstTitle) == false)
									{
										$(this).attr("style",'')
									}
								}).css({'text-align':'center'}).append(
//								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).css({'text-align':'center'}).append(
									qstInfo.subQstList[i].qstTitle
								).append(
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
											$(document.createElement('td')).attr({'align':'center'}).addClass('poll_table_multi_radio').append(
				                                    DOM.getTable().append(//라디오버튼 가로정렬위한 테이블 
                                                        DOM.getTr().append(                                                    
            												function()
            												{
            													if(qstInfo.subQstList[i].qstOptionList['BOLD'].optionValue == 'CHECKED')
            														$(this).addClass('table_bold');
            													
            													var itemVal = -(Math.floor(qstInfo.sectionList[j].sectionOptionList['SUBCNT'].optionValue/2));
                                                                
                                                                
            													for(var k=1; k<=qstInfo.sectionList[j].sectionOptionList['SUBCNT'].optionValue; k++)
            													{
            														$(this).append(
												                        $(document.createElement('td')).append(                                                                    
                                                                    
                                                                            $(document.createElement('label')).append(                                                                    
                    															DOM.getRadioButton('item_'+qstInfo.qstSeq+'_'+i+'_'+j).attr({'sectionSeq':qstInfo.sectionList[j].sectionSeq, 'subQstSeq':qstInfo.subQstList[i].qstSeq, 'itemSeq':k}).val(itemVal).change(function(){
                    																//답변처리
                    																joinSurvey.resultAsk(qstInfo, '', this);
                    															}).append(function(){
                    																if(joinSurvey.joinData.grpList[qstInfo.grpSeq] != undefined)
                    																{
                    																	if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq] != undefined)
                    																	{
                    																		if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq] != undefined)
                    																		{
                    																			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq] != undefined)
                    																			{
                    																				if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[k] != undefined)
                    																					$(this).prop('checked', true);
                    																			}
                    																		}
                    																	}
                    																}
                    															})
                                                                            ) //label                                                                               
                                                                        )//td
            														);
            														itemVal++;
            													}
            												}
                                                        )//tr
                                                    )//table
											)//td
										);
									}
								}
							).append(//맨 우측 td
								$(document.createElement('td')).html(function(){
									if (joinSurvey.htmlChecker(qstInfo.subQstList[i].qstOptionList['SUBTITLE'].optionValue) == false)
									{
										$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
									}
								}).css({'text-align':'center'}).append(
//								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).css({'text-align':'center'}).css({'text-align':'center'}).append(
									qstInfo.subQstList[i].qstOptionList['SUBTITLE'].optionValue
								).append(
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
	}
	
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
			tdCnt = tdCnt+qstInfo.sectionList[i].itemCnt;
		}
		tableWidth = (tdCnt*150)+250;
		if(tableWidth < 400)
			tableWidth = 400;
		
		if (tdCnt < 5)
		{
			tableWidth = "100%";
		}

			tableWidth = "100%";

		returnObj = 
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(  
           $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).append(      
				function()
				{   //단을 그림  
					for(var i in qstInfo.sectionList)
					{				    
    				    $(this).append(                           
                			DOM.getTable().addClass('poll_table'+' ').attr({'width':tableWidth}).append(
                				DOM.getTr().append(
                					$(document.createElement('th')).attr({'rowspan':'2','style':'','scope':'row'}).css({'width':'170px'}).html('구분')
                				).append(
                					function()
                					{
                						//단을 그림
                						//for(var i in qstInfo.sectionList)
                						//{
                							$(this).append(
                								$(document.createElement('th')).attr({'colspan':qstInfo.sectionList[i].itemList.length,'style':+''+"width:60px;"}).append(
                									qstInfo.sectionList[i].sectionTitle
                								)
                							);
                						//}
                					}
                				)
                			).append(
                				DOM.getTr().append(//맨 좌측 th
                					function()
                					{
                						//for(var i in qstInfo.sectionList)
                						//{
                							var k = 0;
                
                							for(var j in qstInfo.sectionList[i].itemList)
                							{
                								$(this).append(
                									$(document.createElement('th')).attr({'style':+''+"width:60px;",'scope':'row'}).addClass('').append(
                										DOM.getDiv()
                										.css({'margin':'0 auto'}) 
                										.html(qstInfo.sectionList[i].itemList[j].itemTitle)
                									)
                								);
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
                							DOM.getTr().append(//우측 td
                								$(document.createElement('td')).html(function(){
                									if (joinSurvey.htmlChecker(qstInfo.subQstList[h].qstTitle) == false)
                									{
                										$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
                									}
                								}).append(
                
                									DOM.getDiv().append(
                										//$(document.createElement('ul')).append(
                										//	$(document.createElement('li')).append(
                												qstInfo.subQstList[h].qstTitle
                											).append(
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
                										//)
                									//)
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
                										for(var k in qstInfo.sectionList[i].itemList)
                										{
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
                        																DOM.getTextBox().attr({'sectionItemSeq':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k, 'sectionSeq':sectionSeq, 'subQstSeq':subQstSeq, 'itemSeq':itemSeq}).css({'width':'100%', 'ime-mode':'disabled', 'margin':'0 auto'}).addClass('input_02 sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k)
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
                											);
                										}//for itemlist
                									//}//for sectionlist
                								}//function
                							)
                						);
                					}
                				}//function
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
                							for(var k in qstInfo.sectionList[i].itemList)
                							{
                								$(this).append(
                									$(document.createElement('td')).attr({'align':'center'}).append(
                										function()
                										{
                											if(qstInfo.sectionList[i].sectionOptionList['SUM'].optionValue == 'SUM')
                											{
                												$(this).append(
                													$(document.createElement('span')).attr({'id':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k}).html(0)
                												);
                											}
                											else if(qstInfo.sectionList[i].sectionOptionList['SUM'].optionValue == 'SET')
                											{
                												$(this).append(
                													$(document.createElement('span')).attr({'id':'sectionItem_'+qstInfo.qstSeq+'_'+i+'_'+k}).html(0)
                												).append('/'+qstInfo.sectionList[i].sectionOptionList['SUM'].subOptionValue);
                											}
                										}
                									)	
                								);
                							}//for itemlist
                						//}//for sectionlist
                					}
                				)
                			)//table
                    )//this
                }//for
            }//function
		);//filedset
		
		return returnObj;
	}
	
	/**
	 * 테이블 미리보기
	 */
	this.prevTable = function(qstInfo)
	{
		var returnObj = '';
		var sectionTitle = '';
		var tableWidth = 0;
		var sectionCnt=qstInfo.sectionList.length;        
		var sectionOptionCnt = 0;
		var tdCnt = 0;
        var colTdCnt = 0;
        var sectionOptionStatus = 0;
        
		for(var i in qstInfo.sectionList)
		{
			if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
            {
				tdCnt = tdCnt+1;

            }
			else{
				tdCnt = tdCnt+qstInfo.sectionList[i].itemCnt;
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

        tableWidth = "100%";

		returnObj = 
            //$(document.createElement('fieldset')).attr({'data-role': 'controlgroup'}).addClass('ui-body-d ui-shadow table-stripe ui-responsive').append(  
           $(document.createElement('div')).attr({'style':'padding:15px; background:#FAF9F9;'}).append(   
           
           
				function()
				{   //단을 그림  
					for(var i in qstInfo.sectionList)
					{				    
    				    $(this).append(               
                            
                			DOM.getTable().addClass('poll_table'+' ').attr({'width':tableWidth}).append(
                				DOM.getTr().append(
                					$(document.createElement('th')).attr({'rowspan':'2','style':''}).css({'width':'210px'}).html('구분')
                				).append(
                					function()
                					{
                						//단을 그림table_border_left 
                						//for(var i in qstInfo.sectionList)
                						//{
                							if(qstInfo.sectionList[i].sectionOptionList['INPUTTYPE'].optionValue == 'SELECT')
                							{
                								$(this).append(
                									$(document.createElement('th')).attr({'style':''+"width:120px;",'scope':'row'}).append(
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
                									$(document.createElement('th')).attr({'colspan':qstInfo.sectionList[i].itemList.length,'style':thWidth,'scope':'row'}).append(
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
                								$(this).append($(document.createElement('th')).addClass('').append('내용을 선택하세요.'));
                							}
                							else
                							{
                								for(var j in qstInfo.sectionList[i].itemList)
                								{
                									$(this).append(
                										$(document.createElement('th')).attr({'style':''+"width:50px;",'scope':'row'}).addClass('').append(
                											DOM.getDiv()
                											.css({'margin':'0 auto'})
                											.html(qstInfo.sectionList[i].itemList[j].itemTitle)
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
                										//$(this).attr("style",joinSurvey.surveyData.layoutDataMobile.body_font_table)
                									}
                								}).append(
                //								$(document.createElement('td')).attr({'style':joinSurvey.surveyData.layoutDataMobile.body_font_table}).append(
                									DOM.getDiv().append(
                										//$(document.createElement('ul')).append(
                											//$(document.createElement('li')).append(
                                                                qstInfo.subQstList[h].qstTitle
                                                            )
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
                												)
                											);
                										}
                										else
                										{
                											//dropdown이 아닐경우 
                											for(var k in qstInfo.sectionList[i].itemList)
                											{
                												$(this).append(
                													$(document.createElement('td')).attr({'align':'center'}).addClass('poll_table_multi_radio').append(
                				                                        DOM.getTable().append(//라디오버튼 가로정렬위한 테이블 
                                                                            DOM.getTr().append(                                                       
                        														function()
                        														{
                        															if(qstInfo.subQstList[h].qstOptionList['BOLD'].optionValue == 'CHECKED')
                        																$(this).addClass('table_bold');
                        															
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
                                																								$(this).prop('checked', true);
                                																						}
                                																					}
                                																				}
                                																			}
                                																		}
                                																	)//체크박스
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
	}
	
	/**
	 * 답변처리
	 */
	this.resultAsk = function(qstInfo, itemType, formId, selectIndex,etcOption)
	{
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
			askItemSeq = $(formId).val();
			askItemIndex = $(formId).attr('itemIndex');
			
			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined){ //답변 데이터 초기화
				if(itemType == 'MULTI')
				{
					delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
				}
				else
				{
					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList = {};
				}
			}
//console.log(qstInfo.qstSeq)
            //기타 처리 라디오버튼
//console.log('index:'+askItemIndex)
//console.log('val:'+askItemSeq)
//console.log('a3:'+etcOption)
            if(etcOption)
            {
                
                
    			if(qstInfo.itemList[askItemSeq-1].itemOptionList['INPUT'].optionValue == 'CHECKED')
                {
    				subAddResponse = $(formId).parent().parent().parent().parent().find('input:text').val();  
//console.log('subAddResponse2:'+subAddResponse)             
                    
                }
                
            }else{
    			if(qstInfo.itemList[askItemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
                {
    				subAddResponse = $(formId).parent().parent().parent().parent().find('input:text').val();  
//console.log('subAddResponse1:'+subAddResponse)             
                    
                }
                
            }

			
			if($(formId).prop('checked') == true)
			{
			 
				if(itemType == 'MULTI')
				{
					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
						'itemSeq' : askItemSeq,
						'addResponse' : 1,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : askItemIndex
					};
				}
				else
				{
					joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
						'itemSeq' : askItemSeq,
						'addResponse' : askItemSeq,
						'subAddResponse' : subAddResponse,
						'askCode' : '',
						'itemIndex' : askItemIndex
					};
				}
			}
//console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq])   			
			var prevQstVal = []
			for(var i in joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList)
			{
				for( var j in joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList ) //실제 item 리스트
				{
					if( joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList[j].itemSeq == joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[i].itemSeq )
					{
						prevQstVal.push(joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList[j].itemTitle);
					}
				}
				//prevQstVal.push(joinSurvey.grpListTmp[qstInfo.grpSeq].qstList[qstInfo.qstSeq].itemList[joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[i].itemIndex].itemTitle);
			}
//console.log('.'+qstInfo.grpSeq+'_'+qstInfo.qstSeq);           
			$('.'+qstInfo.grpSeq+'_'+qstInfo.qstSeq).html(prevQstVal.join(','));
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
//console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList)
            //기타 처리 라디오버튼
//console.log('index:'+askItemIndex)
//console.log('val:'+askItemSeq)

			if(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList != undefined){ //답변 데이터 초기화

				delete joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq];
			}

            
            if(etcOption)
            {
                
                
    			if(qstInfo.itemList[askItemSeq-1].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타
                {
    				subAddResponse = $(formId).parent().parent().parent().parent().find('input:text').val();  
//console.log('subAddResponse2:'+subAddResponse)             
                    
                }
                
            }else{
    			if(qstInfo.itemList[askItemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타
                {
    				subAddResponse = $(formId).parent().parent().parent().parent().find('input:text').val();  
//console.log('subAddResponse1:'+subAddResponse)             
                    
                }
                
            }            


			if($(formId).prop('checked') == true)
			{
	 
				//addResponse = $(formId).prev('span:first').html();
				addResponse = selectIndex-1;
//console.log('selectIndex:'+addResponse+'=>text:'+subAddResponse)				
				joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq] = {
					'itemSeq' : askItemSeq,
					'addResponse' : addResponse,//순위
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
console.log(askList);  
				for(var i in askList)
				{
					//delete askList[i];
				}
console.log(askList); 
 				//checkCnt.html('&nbsp;');  
                
                //////////
                joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList = askList;
                ////////////
			}
		   //alertLayer(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList[askItemSeq]+':c2:'+$(formId).prop('checked')); 
console.log(askItemSeq);             
console.log(joinSurvey.joinData.grpList[qstInfo.grpSeq].qstList[qstInfo.qstSeq].askList);            
		}
		else if(qstInfo.qstType == 'MATRIX' || qstInfo.qstType == 'AHP') //척도형, AHP
		{
			if(qstInfo.qstType == 'MATRIX')
				askItemSeq = $(formId).val();
			else
				askItemSeq = $(formId).attr('itemSeq');
			
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
		}
		
		joinSurvey.progress(); //본문 진행바 처리
	}
	
	/**
	 * prev page 처리
	 */
	this.prevPage = function(flag)
	{
		if(flag == 'reset')
		{
			var qstList = [];
			
			$('.question').each(function(){
				var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];
				qstList.push(qstInfo);
			});
			
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
				var qstList = [];
				
				$('.question').each(function(){
					var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];
					qstList.push(qstInfo);
				});
				
				var grpSeq = joinSurvey.joinData.nextGrpSeq[joinSurvey.joinData.pageIndex];
				
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
				}
				
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
				
				if(joinSurvey.isMode == '')
				{
					joinSurvey.setJoinData('', function(){
						joinSurvey.loadBodySkin();
					});
				}
			}
		}
		
		joinSurvey.loadBodySkin();
	}
	
	/**
	 * next page 처리ggg
	 */
	this.nextPage = function()
	{
		var qstList = [];
		var nextQstIndex = 0;
		var nextGrpSeq = '';

        
		$('.question').each(function(){
			var qstInfo = joinSurvey.grpList[$(this).attr('grpSeq')].qstList[$(this).attr('qstIndex')];//기존 생성된 문항정보
console.log(qstInfo)
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
    
console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq])//qstInfo.qstSeq
			/////////////////////////////////////////////////////////////////////////////////////
			if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq] == undefined)
			{
				alertLayer("답변을 선택하여 주시기 바랍니다.");
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
console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList);					   
						var askCnt=0;
						var linkCnt = 0;

						for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
						{
							


                            if(qstInfo.qstOptionList['RANDITEM'].optionValue =='CHECKED')
                            {//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크
                                itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq - 1;
                            
                            }else{//순서섞기 없음
                                itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;                                
                            }
console.log(itemIndex);
							  
							if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')
							{
								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
								{
//									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
									alertLayer('답변을 입력하여 주시기 바랍니다.a');
									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
									return false;
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
							alertLayer('답변을 선택하여 주시기 바랍니다.b');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
						}
						
						if(qstInfo.qstOptionList['ASKTYPE'].subOptionValue != '')//최소, 최대의 갯수(복수선택일때))
						{
							var subOptionValTmp = qstInfo.qstOptionList['ASKTYPE'].subOptionValue.split('|');
							if(subOptionValTmp[0] > askCnt)
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[0]+'개 이상 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							else if(subOptionValTmp[1] < askCnt)
							{
//								onpanel.printMsg('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('값을 '+subOptionValTmp[1]+'개 까지만 선택하여 주시기 바랍니다.');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
						}
					}
					else //단일 선택
					{
					   

console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList);
						for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)
						{





                                if(qstInfo.qstOptionList['RANDITEM'].optionValue =='CHECKED')
                                {//순서섞기일 경우 링크 위치가 바뀐다 - itemindex 번호가 달라짐->value값으로 체크
                                    itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemSeq - 1;
                                
                                }else{//순서섞기 없음
                                    
                                    
                                    itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;                                
                                    
                                }
console.log(itemIndex);                                
                                    //기타 etc
    							if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')//기타가 있을때
    							{
    								if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')
    								{
    //									onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
    
    									alertLayer('답변을 입력하여 주시기 바랍니다.c');
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

                            //itemList[i].itemSeq
						

//console.log('check>>'+qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue+':nextQstIndex>>'+nextQstIndex);
//console.log('>>'+qstInfo.itemList[itemIndex].itemOptionList['LINK'].optionValue+'>>');                             
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
							alertLayer('답변을 입력하여 주시기 바랍니다.d');
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
console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)		    
					var askCnt=0;
					var linkCnt = 0;                   
					for(var i in joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList)//참여 데이타 복수
					{
						itemIndex = joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].itemIndex;//항목순서
                        
console.log('checked:'+joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse)                        
						if(qstInfo.itemList[itemIndex].itemOptionList['INPUT'].optionValue == 'CHECKED')//참여자에게 입력받기
						{
							if(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse == '')//참여위값
							{
//								onpanel.printMsg('답변을 입력하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
								alertLayer('답변을 입력하여 주시기 바랍니다.e');
								$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								//$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
								return false;
							}
							
						}
console.log('checked2:'+joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].subAddResponse)
                        console.log(joinSurvey.joinData.grpList[grpSeq].qstList[qstSeq].askList[i].addResponse);
                        
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
						alertLayer('답변을 선택하여 주시기 바랍니다.h');
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
                        
						if(maxRank-1 < subOptionValTmp[0])
						{
//							onpanel.printMsg(subOptionValTmp[0]+' 순위 이상 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')')
							alertLayer(subOptionValTmp[0]+' 순위 이상 선택하여 주시기 바랍니다.');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
						}
						
						if(maxRank-1 > subOptionValTmp[1])
						{
//							onpanel.printMsg(subOptionValTmp[1]+' 순위까지만 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')')
							alertLayer(subOptionValTmp[1]+' 순위까지만 선택하여 주시기 바랍니다.');
							$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
							return false;
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
								if(joinDataQst.sectionList[qstInfo.sectionList[j].sectionSeq].subQstList[qstInfo.subQstList[i].qstSeq].askList[qstInfo.sectionList[j].sectionSeq] == undefined)
								{
//									onpanel.printMsg('답변을 선택하여 주시기 바랍니다.', 'joinSurvey.focusQst('+grpSeq+', '+qstSeq+')');
									alertLayer('답변을 선택하여 주시기 바랍니다.');
									$('#qstInfo_'+grpSeq+'_'+qstSeq).find('input:first').focus();
									return false;
								}
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
				} //end TABLE type
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
//console.log('historyBack>>'+joinSurvey.joinData.historyBack); 
//console.log('grpSeq>>'+grpSeq); 

				var historyTmp = [];
				var historyTmpSub = [];                
                var m=0;
				for( var i in joinSurvey.joinData.historyBack )
				{
			    
					historyTmp[m] = i+','+joinSurvey.joinData.historyBack[i].split('|');
//console.log('historyTmp>>'+historyTmp[m]);                     
                    m++;
				}          		
                
                for(var n=0; n<m; n++){
                    historyTmpSub[n]=historyTmp[n].split(',');
//console.log('value3-1>>'+historyTmpSub[n][0]+'value3-2>>'+historyTmpSub[n][1]+'value3-3>>'+historyTmpSub[n][2]);                       
					historyTmp3 = historyTmpSub[n];
					historyTmp2 = historyTmpSub[n-1];                    
					historyTmp1 = historyTmpSub[n-2];	                    

////////////////////////////////
					if( historyTmp3[0] == grpSeq )
					{
console.log('historyTmp3-1>>'+historyTmp1+'historyTmp3-2>>'+historyTmp2+'historyTmp3-3>>'+historyTmp3);  
						nextGrpSeq = historyTmp3[1];
						nextQstIndex = historyTmp3[2];

 console.log(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex]); 
                       ///////////////////복귀해야 할 2그룹이 마지막 문항인지 
    					if(joinSurvey.grpList[nextGrpSeq].qstList[nextQstIndex] == undefined)//2그룹 마지막문항이라면 level1그룹 찾기
                        {
     


    			                     nextGrpSeq = historyTmp1[1];
    			                     nextQstIndex = historyTmp1[2];
                                     
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
          
			if(nextQstIndex == 'END' || joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] == 'END')
			{
				//설문 종료일 경우
                
				joinSurvey.setJoinData('1',chPer, function(pointMsg){//서버에 설문참여데이타 넘긴다

					joinSurvey.loadBodySkin('',pointMsg);
                    
				});
			}
			else if(nextQstIndex == 'TEND' || joinSurvey.joinData.nextQstSeq[joinSurvey.joinData.pageIndex] == 'TEND')//JUNE-2014.0714
			{
				//설문 중간 종료일 경우
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

				joinSurvey.setJoinData('2',chPer, function(pointMsg){//서버에 설문참여데이타 넘긴다
					joinSurvey.loadBodySkin('',pointMsg);
                    
				});                 
			}            
			else
			{
				//페이지 이동일 경우
				joinSurvey.setJoinData('',chPer, function(){
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
			;
		
		$.each(html_tags,function(k,v){
			if (str.indexOf(v) > -1)
			{
				result = true;
			}
		});

		return result;
	}

}