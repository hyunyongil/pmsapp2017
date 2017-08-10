
$(document).one('pageinit', '#home_page', function () {

    var page = {
        "dom": $(this),
        "id": $(this).attr("id")
    };
    var log = jms.util.log;
    var TAG = page.id;

    var firstYN = "X";

    log.d(TAG, "pageinit");
    //log.d(TAG, "AppVersion.version: "+AppVersion.version);

    // ////////////////////////////
    // Start MVC configuration
    // ////////////////////////////

    // MVC::model codes
    page.model = ( function () {
        var pri = {};
        pri.config = {};

        pri.getMainArgs = {
            url: CONSTANTS.MYPAGE.MAIN,
            type: CONSTANTS.METHOD.POST
        };

        pri.doRequest = function (callback, args) {
            var reqSetting = COMMON.util.makeReqParam(args);
            COMMON.plugin.doRequest(reqSetting, callback);
        };

        var pub = {};
        pub.config = pri.config;
        pub.getMainArgs = pri.getMainArgs;

        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        // initial Model
        pub.init = function () {
            document.addEventListener('backbutton', function() {
                navigator.notification.confirm('앱을 종료하시겠습니까?', function(index) {
                    if(index == 1)
                        navigator.app.exitApp();
                }, '종료');
            }, true);
        };
        return pub;
    }());

    // MVC::view codes
    page.view = ( function () {
        var pri = {};
        pri.list = $('.home_list', page.dom);
        pri.visual = $('.visual', page.dom);

        pri.loadMainCallback = function (data) {

            //등급별  "골드 : class='lev_g'", "브론즈 : class='lev_b'", "실버 : class='lev_s'", "플레티넘 : class='lev_p'
            var my_info = data.result.my_info;
            var lelvel_type = my_info.lelvel_type.charAt(0);

            firstYN = my_info.first_yn;

            $("#my_info_lelvel", page.dom).addClass("lev_"+lelvel_type.toLowerCase());
            $("#my_info_name", page.dom).text(my_info.name);
            $("#my_info_point", page.dom).text(COMMON.formatter.addComma(my_info.point)+"P");
            if(data.result.survey_list.length == 0){
                pri.list.html("<img src='images/m_img/msg1.jpg' width='95%'  style='-webkit-filter: grayscale(100%); filter:gray;'>");
            }else{
                pri.list.append(li);
            }
            for (var i=0; i<data.result.survey_list.length; i++) {
                var survey = data.result.survey_list[i];

                console.log(survey);

                var className = "reserch";
                var number = -1;
                var point = 0;

                if (survey.poll_num) {
                    point = parseInt(survey.question_count);
                    number = survey.poll_num;
                    className = (survey.join_yn) ? "onpolEnd" : "onpol";
                } else  {
                    point = parseInt(survey.point_pay);
                    number = survey.survey_seq;
                    if (survey.progres_status == "COMPLETE") {
                        className = "reserchEnd";
                    }
                }

                var li = $('<li>').addClass(className);
                if (number > 0) {
                    li.attr({"type":className, "number":number});
                } else {
                    li.attr("type",className);
                }

                //제목
                var title = $('<p>').text(survey.survey_title);
                if (className == "onpol" || className == "onpolEnd") {
                    title.append($('<span>').text(survey.category_name));
                }
                li.append(title);

                if (className == "reserch" || className == "onpol") {
                    var point = $('<div>').addClass("point").html(
                        "<a href='#'>"+point+"P</a>"+
                        "<a href='#' style='padding-left: 5px;'><span><img src='images/m_img/w_arrow.png'></span></a>"
                    );
                    li.append(point);
                } else {
                    if(className == "reserchEnd"){
                        var end = $('<div>').addClass("end_link").html(
                            "<a href='#' class='txt'>설문 완료</a>"+
                            "<a href='#' style='padding-left: 5px;'><span><img src='images/m_img/o_arrow.png'></span></a>"
                        );
                        li.append(end);
                    }else{
                        var end = $('<div>').addClass("end_link").html(
                            "<a href='#' class='txt'>참여 완료</a>"+
                            "<a href='#' style='padding-left: 5px;'><span><img src='images/m_img/g_arrow.png'></span></a>"
                        );
                        li.append(end);
                    }
                }

                //배경
                var bg = $('<div>').addClass('bg');
                if (survey.poll_img) {
                    bg.html("<img src="+FILES_URL+survey.poll_img+">");
                } else {
                    bg.html("<img src='images/m_img/test_img.png'>");
                }
                li.append(bg);
                pri.list.append(li);
            }

            //배너
            var container = $('<div>').addClass('swiper-container');
            var wrapper = $('<div>').addClass('swiper-wrapper');
            for (var i=0; i<data.result.banner_list.length; i++) {
                var banner = data.result.banner_list[i];
                var upload_list = banner.upload_list[0];

                var slide = $('<div>').addClass('swiper-slide');

                var ahref = $('<a>');
                if (parseInt(banner.etc6) == 1) {
                    ahref.attr({"href": banner.etc5, "data-ajax": false});
                } else {
                    ahref.attr({"href": "#", "onclick": "window.open('"+banner.etc5+"','_system')"});
                }
                ahref.html(
                    "<img src="+FILES_URL + upload_list.upload_dir + "/" + upload_list.upload_filename+">"
                );
                slide.append(ahref);
                wrapper.append(slide);
            }
            container.append(wrapper);
            container.append($('<div>').addClass('swiper-pagination'));
            pri.visual.append(container);

            setTimeout(function () {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    loop: true,
                    autoplay: 2500,
                    autoplayDisableOnInteraction: false,
                });
            }, 500);

            $("body").scrollTop(0);
        };

        var pub = {};
        pub.loadMainCallback = pri.loadMainCallback;

        pub.init = function () {
        };

        return pub;
    }());

    // MVC::controller codes
    page.controller = ( function () {
        var pri = {};
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

        var pub = {};
        pub.doRequest = function (callback, args) {
            pri.doRequest(callback, args);
        };

        pub.validation = function () {
            return pri.validation();
        };

        pub.init = function () {
            page.model.init();
            page.view.init();
        };

        pub.loadMain = pri.loadMain;
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
        page.controller.init();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStart */
    page.dom.bind('onStart', function (event, data, prevPageId) {
        if ($.isPlainObject(data))
            $.extend(page.model.config, data);
        page.controller.loadMain();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});
