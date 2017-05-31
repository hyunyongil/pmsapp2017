
$(document).one('pageinit', '#home_page', function () {
	
	
	
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

        pri.getMainArgs = {
            url: CONSTANTS.MYPAGE.MAIN,
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

        pub.getMainArgs = pri.getMainArgs;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        // initial Model
        pub.init = function () {
            // TODO::

            document.addEventListener('backbutton', function() {
                navigator.notification.confirm('앱을 종료하시겠습니까?', function(index) {
                    if(index == 1)
                        navigator.app.exitApp();
                }, '종료');

            }, true);

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
        pri.notice = $('.mainBottomNotice', page.dom);
        pri.list = $('#list', page.dom);
        pri.templete = $('#templete li', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadMainCallback = function (data) {
            console.log(data);

            //pri.notice.text(data.result.notice_title.board_title);
            $("#notice_title", page.dom).text(data.result.notice_title.board_title);
            $(".notice_link", page.dom).attr("href", 'notice.html?notice_seq='+data.result.notice_title.write_seq);

            //pri.notice.on('click', {notice_seq: data.result.notice_title.write_seq}, function (event, ui) {
            //    jms.page.startActivity('notice.html?notice_seq='+event.data.notice_seq, {notice_seq: event.data.notice_seq});
            //});

            for (var i = 0; i < data.result.survey_list.length; i++) {
                var survey = data.result.survey_list[i];

                var clone = pri.templete.clone();
                clone.find('.title').text(survey.survey_title);
                clone.find('.count').text(COMMON.formatter.addComma(survey.qst_cnt) + '문항');
                clone.find('.point').text(COMMON.formatter.addComma(survey.point_pay) + 'P');
                clone.on('click', {survey_seq: survey.survey_seq}, function (event, ui) {
                    location.href = 'poll_join.html?surveySeq=' + event.data.survey_seq;
                    //jms.page.startActivity('poll_join.html?surveySeq=' + event.data.survey_seq);
                });

                clone.appendTo(pri.list);
            }

            var my_info = data.result.my_info;


            $("#my_info_name", page.dom).text(my_info.name);
            $("#my_info_point", page.dom).text(COMMON.formatter.addComma(my_info.point));

/*
            var level_type_html = []
                , point_total_html = []
                ;

            var body_width = $('body').width();

            if(body_width > 360) {
                var data_size = 185
                    , font_size = 20
                    //, font_size = 27
                    , label_font_size = 12
                    ;
            }
            else if(body_width <= 360 && body_width > 320) {
                var data_size = 170
                    , font_size = 20
                    //, font_size = 22
                    , label_font_size = 11
                    ;
            }
            else {
                var data_size = 160
                    , font_size = 20
                    , label_font_size = 9
                    ;
            }

            level_type_html.push('<div class="GaugeMeter gauge_level_type" id="PreviewGaugeMeter_1" data-percent="'+my_info.lelvel_type_per+'"');
            level_type_html.push(' data-text="<font style=\'color:red;font-size:'+font_size+'px;\'>'+my_info.lelvel_type+'</font>" data-size="'+data_size+'" data-theme="Red"');
            level_type_html.push(' data-back="RGBa(0,0,0,.1)" data-width="5"');
            level_type_html.push(' data-label="<font style=\'font-size:'+label_font_size+'px !important;color:red;\'>적립금 '+my_info.lelvel_add_point+'%</font>" data-label_color="#FFF"></div>');

            point_total_html.push('<div class="GaugeMeter" id="PreviewGaugeMeter_5" data-percent="'+my_info.point_total_per+'"');
            point_total_html.push(' data-size="'+data_size+'" data-append="%" data-theme="DarkBlue-LightBlue" data-back="RGBa(0,0,0,.1)"');
            point_total_html.push(' data-animate_text_colors="1" data-width="5"');
            point_total_html.push(' data-label="<font style=\'color:#2a9ce7;\'>'+my_info.point_total+'P</font>"');
            point_total_html.push(' data-label_color="#2a9ce7"></div>');

            $("#li_gauge_level_type").append(level_type_html.join(''));
            $("#li_gauge_point_total").append(point_total_html.join(''));

            $(".GaugeMeter").gaugeMeter();

            */
            console.log(my_info);
            console.log(my_info.point_total_per/100);            
            var gaugeOptions = {
                per: my_info.point_total_per/100,
                bottomText: my_info.point_total +"P",
                color: '#21b2f7' 
            }
            $('#gauge_point_canvas').onsolChart(gaugeOptions);
            
            
            gaugeOptions = {
                per: my_info.lelvel_type_per/100,
                topText: my_info.lelvel_type,
                bottomText: my_info.lelvel_add_point + '%' + ' 추가P',
                color: '#ff0000' 
            }
            $('#gauge_level_canvas').onsolChart(gaugeOptions);

        };

        pri.resize = function() {
            var home_box_w = $('.home_box').width();
            console.log('home_box_w : ' + home_box_w);

            var box_one_w = (home_box_w-120)/3 - 1;
            var box_two_w = box_one_w * 2 +45;
            
            $('.home_img').animate({
            	height: $(window).height()/2.6
              }, 1, function() {
            	  $('.poll_box ,.point_box,.first_box,.power_box,.my_box').show();
              });

            $('.poll_box').width(box_two_w);
            $('.point_box').width(box_one_w);
            $('.first_box').width(box_one_w);
            $('.power_box').width(box_one_w);
            $('.my_box').width(box_one_w);

            if(box_one_w < 138){
                $('.home_box li a img  ').width(box_one_w);
            }else{
                $('.home_box li a img  ').width("");
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadMainCallback = pri.loadMainCallback;

        // initial View
        pub.init = function () {
            page.dom.bind('pageshow', function() {
                pri.resize();
            });
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

        pri.loadMain = function () {
            pri.getMain(page.view.loadMainCallback);
        };

        pri.getMain = function (callback) {
            var args = page.model.getMainArgs;

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

        pub.loadMain = pri.loadMain;

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
        console.log('111');
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStart */
    page.dom.bind('onStart', function (event, data, prevPageId) {
        if ($.isPlainObject(data))
            $.extend(page.model.config, data);

        page.controller.loadMain();

        console.log('222');
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);

        console.log('333');
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});
