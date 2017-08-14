$(document).one('pageinit', '#myConfig_page', function () {
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

        pri.getConfigInfoArgs = {
            url: CONSTANTS.CONFIG.INFO,
            type: CONSTANTS.METHOD.POST
        };

        pri.setPushConfigArgs = {
            url: CONSTANTS.CONFIG.PUSHEDIT,
            type: CONSTANTS.METHOD.POST
        };

        pri.getLastestVersionArgs = {
            url: CONSTANTS.CONFIG.VERSION,
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

        pub.getConfigInfoArgs = pri.getConfigInfoArgs;
        pub.setPushConfigArgs = pri.setPushConfigArgs;
        pub.getLastestVersionArgs = pri.getLastestVersionArgs;

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

        pri.pushSurvey = $('#pushSurvey', page.dom);
        pri.logout = $('#logout', page.dom);
        pri.versionInfo = $('#version_info', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadUserInfoCallback = function (data) {
            pri.initMenu(data);

            if (data)
                page.controller.loadConfigInfo();
        };

        pri.initMenu = function (login) {
            if (login) {
                $('.connected').show();
                $('.unconnected').hide();
            } else {
                $('.connected').hide();
                $('.unconnected').show();
            }
        };

        pri.loadConfigInfoCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                pri.pushSurvey.val(data.result.push_survey_yn).slider('refresh');
            }
        };

        pri.savePushConfigCallback = function (data) {
            console.log(data);
        };

        pri.checkVersionInfoCallback = function (data) {
            console.log(data);

            if(APP_VERSION < data.resultMsg)
                $.mobile.changePage('#able_update');
            else
                $.mobile.changePage('#lastest_version');
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.pushSurvey = pri.pushSurvey;
        pub.logout = pri.logout;
        pub.login = pri.login;
        pub.versionInfo = pri.versionInfo;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadUserInfoCallback = pri.loadUserInfoCallback;
        pub.loadConfigInfoCallback = pri.loadConfigInfoCallback;
        pub.savePushConfigCallback = pri.savePushConfigCallback;
        pub.checkVersionInfoCallback = pri.checkVersionInfoCallback;

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

        pri.loadUserInfo = function () {
            getUser(page.view.loadUserInfoCallback);
        };

        pri.loadConfigInfo = function () {
            pri.getConfigInfo(page.view.loadConfigInfoCallback);
        };

        pri.getConfigInfo = function (callback) {
            var args = page.model.getConfigInfoArgs;

            args.param = {
                uuid: getUUID()
                , push_token : COMMON.storage.get('push_token')
            };
            this.doRequest(callback, args);
        };

        pri.savePushConfig = function () {
            pri.setPushConfig(page.view.savePushConfigCallback);
        };

        pri.setPushConfig = function (callback) {
            var uuid = getUUID();
            var push_token = 'test';

            try{
                uuid = device.uuid;
                push_token = COMMON.globalData.get('push_token');
            }catch(e){};


            var args = page.model.setPushConfigArgs;
            args.param = {
                uuid: uuid,
                push_token: push_token,
                push_yn: page.view.pushSurvey.val(),
                push_survey_yn: page.view.pushSurvey.val(),
            };

            this.doRequest(callback, args);
        };

        pri.checkVersionInfo = function () {
            pri.getLastestVersion(page.view.checkVersionInfoCallback);
        };

        pri.getLastestVersion = function (callback) {
            var args = page.model.getLastestVersionArgs;

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

            console.log('1111');
            console.log(page.view.pushSurvey);
            console.log('2222');

            // ///////////////////
            // page event handler
            // ///////////////////
            page.view.pushSurvey.on('change', function (event, ui) {
                console.log('3333');

                event.preventDefault();

                pri.savePushConfig(this.value);
            });

            page.view.logout.on('click', function (event, ui) {
                try{
                    if(confirm("로그아웃을 하시겠습니까?")) {
                        event.preventDefault();

                        COMMON.token.clear();

                        location.href = "pmslogin.html";
                    }
					/*document.addEventListener('deviceready', function() {
                        navigator.notification.confirm("로그아웃을 하시겠습니까?", function(index) {
                            if(index == 1) {
								event.preventDefault();

								COMMON.token.clear();

								location.href = "loginNew.html";
                            }
                        }, '확인',"확인,취소");

                    }, true);*/
                }
                catch(e) {
					if(confirm("로그아웃을 하시겠습니까?")) {
						event.preventDefault();

						COMMON.token.clear();

						location.href = "pmslogin.html";
                    }
                }
                //jms.page.startActivity('index.html');
            });

            page.view.versionInfo.on('click', function (event, ui) {
                event.preventDefault();

                pri.checkVersionInfo();
            });

            $('#update_app').on('click', function (event, ui) {
                var app_type = device.platform.toLowerCase();

                if(app_type == 'ios')
                    location.href = 'itms-apps://itunes.apple.com/app/id1207108232';
                else if(app_type == 'android')
                    location.href = 'market://details?id=com.onpanel.onsolution';
            })
        };

        pub.loadUserInfo = pri.loadUserInfo;
        pub.loadConfigInfo = pri.loadConfigInfo;

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

        page.controller.loadUserInfo();
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