$(document).one('pageinit', '#myPageSubtraction_page', function () {
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

        pri.getSubtractionListArgs = {
            url: CONSTANTS.MYPAGE.POINT,
            type: CONSTANTS.METHOD.POST
        };

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
        pub.getSubtractionListArgs = pri.getSubtractionListArgs;

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

        pri.point = $('.total_point', page.dom);
        pri.list = $('#list', page.dom);
        pri.more = $('.more_list', page.dom);
        pri.loadUsedListCallback = function (data) {
			$("#used_info").html(data.result.list.length);
		};
        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadPointCallback = function(data) {
            pri.point.text(COMMON.formatter.addComma(data.point));
        };

        pri.loadSubtractionListCallback = function (data) {
            if(data.result.list) {
                for (var i = 0; i < data.result.list.length; i++) {
                    var item = data.result.list[i];

                    var type = 'templete_minus';
                    if (0 < parseInt(item.point)) {
                        type = 'templete_plus';
                    }

                    var clone = $('.' + type + ' li').clone();

                    clone.find('.change_store').text(item.od_change_store);
                    clone.find('.title').text(item.etc);
                    clone.find('.point').text(COMMON.formatter.addComma(item.point) + " P");
                    clone.find('.remain_point').text(COMMON.formatter.addComma(item.remain_point));
                    clone.find('.update_date').text(item.reg_datetime.substr(0, 10));

                    clone.appendTo(pri.list);
                }
            }
            else {
                console.log('none22');
                var clone = $('.templete2 li').clone();
                clone.appendTo(pri.list);
            }

            if(data.result.page < data.result.total_page) {
                //pri.more.show();
            }
            else {
                pri.more.hide();
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
        pub.loadPointCallback = pri.loadPointCallback;
        pub.loadSubtractionListCallback = pri.loadSubtractionListCallback;
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
        pri.loadUsedList = function () {
            pri.getUsedList(1, page.view.loadUsedListCallback);
        };
		
        pri.getUsedList = function (pageNo, callback) {
            var args = page.model.getUsedListArgs;
            args.param = {
                page: pageNo,
                pagesize: 10000
            };

            this.doRequest(callback, args);
        };
        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            page.model.doRequest(callback, args);
        };

        pri.validation = function () {
            return true;
        };

        pri.loadPoint = function() {
            getUser(page.view.loadPointCallback);
        };

        pri.loadSubtractionList = function () {
            pri.getSubtractionList(1, page.view.loadSubtractionListCallback);
        };

        pri.moreSubtractionList = function() {
            pri.getSubtractionList(parseInt(page.model.config.page) + 1, page.view.loadSubtractionListCallback);
        };

        pri.getSubtractionList = function (pageNo, callback) {
            var args = page.model.getSubtractionListArgs;
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
                pri.moreSubtractionList();
            });

            onsolMoreList.init(function(){

                var now_page = parseInt(page.model.config.page) + 1;

                if(now_page > 1) {

                    if(onsolMoreList.scroll_mode == false) return false;

                    pri.getSubtractionList(now_page, page.view.loadSubtractionListCallback);
                }
            });
        };

        pub.loadPoint = pri.loadPoint;
        pub.loadSubtractionList = pri.loadSubtractionList;
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

        page.controller.loadPoint();
        page.controller.loadSubtractionList();
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