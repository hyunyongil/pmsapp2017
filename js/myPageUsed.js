$(document).one('pageinit', '#myPageUsed_page', function () {
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

        pri.getUsedListArgs = {
            url: CONSTANTS.MYPAGE.POINT_USE,
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

        pub.getUsedListArgs = pri.getUsedListArgs;

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
        pri.loadUsedListCallback = function (data) {
            console.log('loadUsedlist');
            console.log(data);

            if(data.result.list) {
                for (var i = 0; i < data.result.list.length; i++) {
                    var item = data.result.list[i];
                    var clone = $('.templete li').clone();
                    var od_status_str = "";
					var od_change_store = "";
					var od_mobile_num = "";
					if(item.od_name.indexOf('기부') > -1){ od_status_str = '-';od_change_store='-';od_mobile_num='-';}else{ 
						if (item.od_status == "NEW")
						{
							od_status_str = "<span style='color:#555555;'>신청중</span>";
						}
						if (item.od_status == "ING")
						{
							od_status_str = "<span style='color:#4087f0;'>대기중</span>";
						}
						if (item.od_status == "CAN") {
							od_status_str = "<span style='color:#333'>취소완료</span>";
						}
						if (item.od_status == "COM")
						{
							var today = new Date();
							var yyyy = today.getFullYear();
							var mm = today.getMonth()+1; // getMonth() is zero-based
							var dd  = today.getDate();
							var date = String(10000*yyyy + 100*mm + dd);
							if (item.exchange_enddate < date) {
								od_status_str = "<em>기간만료</em>";
							} else {
								od_status_str = "<span id='orderCancel"+item.od_seq+"' onclick='javascript:orderCancel("+item.od_seq+ ")' style='cursor: pointer;border-bottom: 1px solid #333333;color:blue;'>주문취소</span>";
							}
						}
						if (item.od_status == "USED") {
							od_status_str = "<span style='color:blue;'>사용완료</span>";
						}
						if (item.od_status == "ERR")
						{
							od_status_str = "<span style='color:#FF6B6B;'>오류및환불</span>";
						}
						od_change_store=item.od_change_store;
						od_mobile_num=item.od_mobile_num;
					}
                    clone.find('.change_store').text(od_change_store);
                    clone.find('.od_count').text(item.od_count);
                    clone.find('.od_name b').text(item.od_name);
                    clone.find('.od_use_point').text(item.od_use_point);
                    clone.find('.od_mobile_num').text(od_mobile_num);
                    clone.find('.od_status').html(od_status_str);
                    clone.find('.reg_datetime').text(item.reg_datetime.substring(0,10));

                    clone.appendTo(pri.list);
                }
            }
            else {
                var clone = $('.templete2 li').clone();
                clone.appendTo(pri.list);
            }

            if(data.result && data.result.page < data.result.total_page) {
                //pri.more.show();
            }
            else {
                //pri.more.hide();
                onsolMoreList.last_page = true;
            }

            page.model.config.page = data.result.page;

            onsolMoreList.scroll_mode = true;
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.more = pri.more;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadUsedListCallback = pri.loadUsedListCallback;

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

        pri.loadUsedList = function () {
            pri.getUsedList(1, page.view.loadUsedListCallback);
        };

        pri.moreUsedList = function() {
            pri.getUsedList(parseInt(page.model.config.page) + 1, page.view.loadUsedListCallback);
        };

        pri.getUsedList = function (pageNo, callback) {
            console.log('getusedlist');
            var args = page.model.getUsedListArgs;
            args.param = {
                page: pageNo,
                pagesize: 10
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
            page.view.more.on('click', function (event, ui) {
                pri.moreUsedList();
            });

            onsolMoreList.init(function(){

                try{
                    var now_page = parseInt(page.model.config.page) + 1;
                }
                catch(e) {
                    now_page = 1;
                }

                if(now_page > 1) {
                    if(onsolMoreList.scroll_mode == false) return false;

                    pri.getUsedList(now_page, page.view.loadUsedListCallback);
                }
            });
        };

        pub.loadUsedList = pri.loadUsedList;

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

        page.controller.loadUsedList();
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
//온포인트몰 주문취소
function orderCancel(od_seq) {
	 if(confirm("주문취소하시겠습니까?")) {
        ONPANEL.Ajax.Request.invokePostByJSON(
           CONSTANTS.POINTMALL.ITEM.PAYMENTCANCEL
            , {
                od_seq: od_seq
            }
            , function (data) {
               console.log(data);
			   if(data.resultType == 'FAIL'){
					alertLayer(data.resultMsg);
			   }else{
					alertLayer(data.resultMsg);
					location.href='myPageUsed.html';
			   }
            }
            , function (e, e2) {
                console.log(e);
                console.log(e2);
            }
            , true
        );
    }
}