$(document).one('pageinit', '#event_page', function () {
    // initial log for global variable of page
    var page = {
        "dom": $(this),
        "id": $(this).attr("id")
    };
    var log = jms.util.log;
    var TAG = page.id;

    log.d(TAG, "pageinit");

    // ////////////////////////////
    // Start MVC configuration
    // ////////////////////////////

    // MVC::model codes
    page.model = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};
        pri.config = {};

        pri.getNoticeListArgs = {
            url: CONSTANTS.BOARD.NOTICE.LIST,
            type: CONSTANTS.METHOD.POST
        };

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            var reqSetting = COMMON.util.makeReqParam(args);
            COMMON.plugin.doRequest(reqSetting, callback);
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};
        pub.config = pri.config;

        pub.getNoticeListArgs = pri.getNoticeListArgs;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        // initial Model
        pub.init = function () {
            // TODO::
        };
        // return public functions
        return pub;
    }());

    // MVC::view codes
    page.view = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};

        pri.list = $('#list', page.dom);
        pri.more = $('.more_list', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadNoticeListCallback = function (data) {
			if(typeof(data.result.board_list) == 'undefined'){
				pri.list.html("<img src='images/m_img/msg3.jpg' width='100%'>");
			}
            try{
                for(var i=0; i<data.result.board_list.length; i++) {
                    var board = data.result.board_list[i];
                    /*
                     var row = $('<div>').attr('id', board.write_seq).attr('data-role', 'collapsible', 'data-iconpos', 'right', 'data-collapsed-icon', 'arrow-r', 'data-expanded-icon', 'arrow-d');
                     row.append($('<div>').text(board.board_title));
                     //row.append($('<img>').attr('src','http://files.onsolutions.co.kr/download_files/mergeboard/201407/2013-0913.jpg'));
                     board.board_contents = board.board_contents.replace(new RegExp("\/\/"+FILES_URL_DOMAIN,'gi'),"http://"+FILES_URL_DOMAIN);
                     row.append($('<p>').html(board.board_contents));
                     row.show().appendTo(pri.list);*/
                    var row = $('<div>').attr('id', board.write_seq).attr('data-role', 'collapsible', 'data-iconpos', 'right', 'data-collapsed-icon', 'arrow-r', 'data-expanded-icon', 'arrow-d');

                    var str = '<ul class="board_off"> <!-- 이미지 --> ';
                    var widthVal = '100';
                    var imgVal = getcontentimg(board.board_contents);
                    var cssstr = 'style="width:auto;"';
                    if(imgVal) {
						imgVal = imgVal.replace(new RegExp("\/\/"+FILES_URL_DOMAIN,'gi'),"http://"+FILES_URL_DOMAIN);
                        str += '<li><img style="max-height: 100px !important;" src='+imgVal+'></li>';
                        widthVal = 66;
                        cssstr = '';
                    }
                    str+='<li style="width:'+widthVal+'%;"> <!-- 타이틀 --> <p> <b>[안내]</b><span '+cssstr+'>'+board.board_title.replace('[안내]','')+'</span><!-- 두줄이상 묵음처리 --> <div style="clear:both"></div> </p> <!-- 상세정보 간략보기 --> <div class="bt_btn"> <span> <b>등록일</b> : '+(board.reg_datetime.substr(0,10))+'<br><!-- 등록일 --> <b>작성자</b> : '+board.write_name+'<!-- 작성자 --> </span> <a  class="abt"  href="javascript:;" onclick="javascript:showContents('+board.write_seq+',1)">펼쳐보기 ▼</a><!-- 펼처보기 버튼 --> <div style="clear:both"></div> </div> </li> <div style="clear:both"></div> </ul>';
                    var newboardcontent = board.board_contents.replace('style="height:','Xstyle="height:');
                    var newboardcontent = board.board_contents.replace(new RegExp("\/\/"+FILES_URL_DOMAIN,'gi'),"http://"+FILES_URL_DOMAIN);
                    str += '<ul class="board_on" style="display: none;"><li> <!-- 타이틀 --> <p> <b>[안내]</b><span>'+board.board_title+'</span><!-- 두줄이상 묵음처리 --> <div style="clear:both"></div></p> <!-- 이미지 --><!-- 상세정보 간략보기 --> <div class="bt_txt">'+newboardcontent+'</div> <div class="bt_btn"> <span> <b>등록일</b> : '+(board.reg_datetime.substr(0,10))+'<!-- 등록일 -->&nbsp;&nbsp;&nbsp; <b>작성자</b> : '+board.write_name+'<!-- 작성자 --></span> <a class="bbt" href="javascript:;" onclick="javascript:showContents('+board.write_seq+',2)">간략 보기 ▲</a><!-- 닫기 버튼 --> <div style="clear:both"></div> </div> </li> <div style="clear:both"></div></ul>';
                    row.append(str);
                    row.show().appendTo(pri.list);
                }

                //pri.list.collapsibleset('refresh');

                if(page.model.config.notice_seq) {
                    $('#' + page.model.config.notice_seq).trigger('expand');
                }

                if(gup("notice_seq")) {
                    $('#' + gup("notice_seq")).trigger('expand');
                }

                if(data.result.page < data.result.total_page)
                    pri.more.show();
                else
                    pri.more.hide();

                page.model.config.page = data.result.page;

                if(data.result.page == data.result.total_page) {
                    onsolMoreList.last_page = true;
                }

                onsolMoreList.scroll_mode = true;

            }
            catch(e) {
                onsolMoreList.scroll_mode = true;
                //console.log("마지막 페이지 입니다");
                //console.log(e);
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.more = pri.more;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadNoticeListCallback = pri.loadNoticeListCallback;

        // initial View
        pub.init = function () {
        };

        // return public functions
        return pub;
    }());

    // MVC::controller codes
    page.controller = ( function () {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        var pri = {};

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            page.model.doRequest(callback, args);
        };

        pri.validation = function () {
            return true;
        };

        pri.loadNoticeList = function () {
            pri.getNoticeList(1, page.view.loadNoticeListCallback);
        };

        pri.moreNoticeList = function() {
            pri.getNoticeList(parseInt(page.model.config.page) + 1, page.view.loadNoticeListCallback);
        };

        pri.getNoticeList = function (pageNo, callback) {
            var args = page.model.getNoticeListArgs;
            args.param = {
                board_id: 'mevent',
                site_code: 32,
                page: pageNo,
                pagecnt: 15
            };

            this.doRequest(callback, args);
        };

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        var pub = {};

        // request
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        pub.validation = function () {
            return pri.validation();
        };

        // initial Controller
        pub.init = function () {
            // initial Model&View
            page.model.init();
            page.view.init();

            // ///////////////////
            // page event handler
            // ///////////////////
            //page.view.more.on('click', function (event, ui) {
            //    pri.moreNoticeList();
            //});

            onsolMoreList.init(function(){
            //    onsolMoreList.page++;


                var now_page = parseInt(page.model.config.page) + 1;

                if(now_page > 1) {

                    if(onsolMoreList.scroll_mode == false) return false;

                    pri.getNoticeList(now_page, page.view.loadNoticeListCallback);
                }
            });
        };

        pub.loadNoticeList = pri.loadNoticeList;

        // return public functions
        return pub;
    }());

    // registration the 'jms.page' making MVC in current page
    jms.page.setModel(page.id, page.model);
    jms.page.setView(page.id, page.view);
    jms.page.setController(page.id, page.controller);


    // ////////////////////////////
    // page life cycle events...
    // ////////////////////////////

    /* @Annotation Don't Delete Me: page.dom.bind:onCreate */
    page.dom.bind('onCreate', function () {
        // do initializing function.
        page.controller.init();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStart */
    page.dom.bind('onStart', function (event, data, prevPageId) {
        if ($.isPlainObject(data))
            $.extend(page.model.config, data);

        page.controller.loadNoticeList();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});


function showContents(write_seq,num) {
    if(write_seq && num){
        if(num == 1) {
            $('#' + write_seq).find('.board_off').hide();
            $('#' + write_seq).find('.board_on').show();
        }else{
            $('#' + write_seq).find('.board_off').show();
            $('#' + write_seq).find('.board_on').hide();
        }
    }
}

function getcontentimg(str) {

    var r, re, img_str = '';

    re = /<[img|href][^>]*src\s*=\s*('|)?([^'>]*)\1([^>])*>/ig;

    while ((r = re.exec(str)) != null) {

        img_str = img_str + r[2] + ',';

    }

    img_str = img_str == '' ? '' : img_str.substring(0, img_str.length-1);

    return img_str;

}