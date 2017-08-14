$(document).one('pageinit', '#index_page', function () {
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

        pri.checkTokenArgs = {
            url: CONSTANTS.MYPAGE.TOKEN_CHK,
            type: CONSTANTS.METHOD.POST
        };

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.doRequest = function (callback, args) {
            var reqSetting = COMMON.util.makeReqParam(args);

            console.log("TEST:reqSetting"+JSON.stringify(reqSetting));
            COMMON.plugin.doRequest(reqSetting, callback);
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};
        pub.config = pri.config;

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

        pub.checkTokenArgs = pri.checkTokenArgs;

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
        pri.checkTokenCallback = function (data) {
            console.log("TEST:"+JSON.stringify(data));

            if (ONPANEL.Ajax.Result.isSucess(data)) {
                location.href = 'main_list.html';
                //jms.page.startActivity('home.html');
            } else {
                location.href = 'pmslogin.html';
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        // ////////////////////////////
        // public functions
        // ////////////////////////////

        // initial View
        pub.init = function () {
        };

        pub.checkTokenCallback = pri.checkTokenCallback;

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

        pri.checkAuth = function () {

/*
            if (pri.getKeepLoginInfo() == 'N')
                COMMON.token.clear();
//*/
            var args = page.model.checkTokenArgs;


            if(COMMON.token.get() == "" || typeof COMMON.token.get() == "undefined" || COMMON.token.get() == null || COMMON.token.get() == "null") {
                location.href = 'pmslogin.html';
                return false;
            }

            console.log("TEST:token"+COMMON.token.get());

            this.doRequest(page.view.checkTokenCallback, args);
        };

        pri.getKeepLoginInfo = function () {
            return (COMMON.storage.get('onpanel.keep.login') == 'Y' ? 'Y' : "N");
        };


        pri.ableKeepLogin = function () {
            return true;
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

        pub.checkAuth = pri.checkAuth;

        // initial Controller
        pub.init = function () {
            // initial Model&View
            page.model.init();
            page.view.init();

            // ///////////////////
            // page event handler
            // ///////////////////
        };

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

        page.controller.checkAuth();
        //location.href = 'login.html';
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