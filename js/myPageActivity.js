$(document).one('pageinit', '#myPageActivity_page', function () {
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

        pri.getActivityInfoArgs = {
            url: CONSTANTS.MYPAGE.ACTIVITY,
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

        pub.getActivityInfoArgs = pri.getActivityInfoArgs;

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

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadActivityInfoCallback = function (data) {
            console.log(data);
            page.model.config.activity = data.result;

            getUser(pri.loadActivityInfoUserInfoCallback);
        };

        pri.loadActivityInfoUserInfoCallback = function(data) {
            console.log(data);
            var userInfo = data;
            var activityInfo = page.model.config.activity;

            $('.name').text(userInfo.name);
            $('.point').text(COMMON.formatter.addComma(activityInfo.point) + 'P');
            $('.total_point').text(COMMON.formatter.addComma(activityInfo.point_total) + 'P');
            $('.use_point').text(COMMON.formatter.addComma(activityInfo.point_use) + 'P');

            if (activityInfo.first_update_date) {
                var firstPoll = $('.first_poll');

                firstPoll.find('.content').text(activityInfo.first_update_date.substr(0, 10));
            }

            $('.powerpannel tr').each(function () {
                var type = $(this).attr('powerpannel_type')

                console.log(this.id + ' : ' + type);

                if(userInfo.powerpannel_type & type) {
                    if(userInfo.powerpannel_type_real & type) {
                        $(this).find('.content').text(activityInfo[this.id + '_update_date'].substr(0, 10));
                    } else {
                        $(this).find('.content').text('참여 가능');
                    }
                } else {
                    $(this).find('.content').text('참여 불가능');
                }
            });
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadActivityInfoCallback = pri.loadActivityInfoCallback;

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

        pri.loadActivityInfo = function () {
            pri.getActivityInfo(page.view.loadActivityInfoCallback);
        };

        pri.getActivityInfo = function (callback) {
            var args = page.model.getActivityInfoArgs;

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
        };

        pub.loadActivityInfo = pri.loadActivityInfo;

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

        page.controller.loadActivityInfo();
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