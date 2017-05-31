$(document).one('pageinit', '#pointMallItemList_page', function () {
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
        pri.config = {
            order_type: 'amount_asc'
        };

        pri.getItemListArgs = {
            url: CONSTANTS.POINTMALL.ITEM.LIST,
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

        pub.getItemListArgs = pri.getItemListArgs;

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

        pri.point = $('.point', page.dom);
        pri.orderTypes = $('#order_type li a', page.dom);
        pri.itemList = $('#item_list', page.dom);
        pri.itemTemplete = $('#templete .item', page.dom);
        pri.more = $('.more_list', page.dom);
        pri.item_init_list = $('#second_depth li a', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadPointCallback = function(data) {
            pri.point.text(COMMON.formatter.addComma(data.point));
        };

        pri.loadItemListCallback = function (data) {

            if ("1" == data.page) {
                page.view.itemList.empty();
            }

            for (var i = 0; i < data.result.list.length; i++) {
                var item = data.result.list[i];

                var positionChar = String.fromCharCode(i % 3 + 97);
                var positionClass = "ui-block-" + positionChar;

                var clone = pri.itemTemplete.clone();

                if(item.it_file_name) {
                    var src = 'https://' + item.it_file_rel_path + '/' + item.it_file_name;

                    clone.find('.image').attr('src', src);
                }
                //console.log(item);
                clone.find('.name').text(item.it_name);
                clone.find('.amount').text(COMMON.formatter.addComma(item.it_amount));
                clone.find('.sell_store').text(item.it_change_store);
                clone.prop("href","pointMallItemInfo.html?it_seq="+item.it_seq+"&data_seq=" + page.data_seq);
                //clone.addClass(positionClass);
                clone.appendTo(page.view.itemList);

                clone.show();

                //clone.find('a').on('click', {item: item}, function (event, ui) {
                //    event.preventDefault();
                //
                //    jms.page.startActivity(this.href, event.data.item);
                //});
            }

            //var second_html = [];
            //var second_depth = $('#second_depth', page.dom);
            //
            //if(page.model.config.item_type == 3) {
            //    second_depth.hide();
            //}
            //else {
            //    second_depth.show();
            //}
            //
            //$.each(data.result.second_depth,function(k,v){
            //    var active_class = "ui-btn-active";
            //
            //    if(k > 0) {
            //        active_class = "";
            //    }
            //
            //    if(page.model.config.ct_seq) {
            //
            //        active_class = "";
            //
            //        if(page.model.config.ct_seq == v.ct_seq) {
            //            active_class = "ui-btn-active";
            //        }
            //    }
            //
            //    second_html.push('<li><a id="item_in_1" href="javascript:;" data-ajax="false" data-seq="'+ v.ct_seq +'" class="'+active_class+' item_init_list"><div class="glyphicon glyphicon-music" aria-hidden="true"></div>'+v.cate_nm+'</a></li>');
            //});

            //second_depth.html(second_html.join(''));

            if(data.result.page < data.result.total_page) {
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

        pub.orderTypes = pri.orderTypes;
        pub.itemList = pri.itemList;
        pub.more = pri.more;
        pub.item_init_list = pri.item_init_list;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadPointCallback = pri.loadPointCallback;
        pub.loadItemListCallback = pri.loadItemListCallback;

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

        pri.loadPoint = function() {
            getUser(page.view.loadPointCallback);
        };

        pri.loadItemList = function () {
            pri.getItemList(1, page.view.loadItemListCallback);
        };

        pri.moreItemList = function () {
            pri.getItemList(parseInt(page.model.config.page) + 1, page.view.loadItemListCallback);
        };

        pri.getItemList = function (pageNo, callback) {
            var args = page.model.getItemListArgs;
            args.param = {
                ct_seq: page.model.config.ct_seq || page.model.config.item_type,
                ct_seq_first: page.model.config.item_type,
                order_type: page.model.config.order_type,
                pagesize: 9,
                page: pageNo
            };

            this.doRequest(callback, args);
        };

        pri.orderType = function (orderType) {
            page.model.config.order_type = orderType;

            pri.loadItemList();
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


            $("#order_type_food .item_init_list").eq(0).find('.item_title_off').hide();
            $("#order_type_food .item_init_list").eq(0).find('.item_title_on').show();

            // ///////////////////
            // page event handler
            // ///////////////////
            page.view.orderTypes.on('click', function (event, ui) {
                var data_seq = $(this).attr("data-seq");
                page.data_seq = data_seq;
                $("#item_list").html('');

                $(".item_init_list").removeClass("ui-btn-active2");

                $('.item_title_on').hide();
                $('.item_title_off').show();


                $("#order_type_food .item_init_list").eq(0).find('.item_title_off').hide();
                $("#order_type_food .item_init_list").eq(0).find('.item_title_on').show();

                if(data_seq == "31") {
                    $(".data_seq_96").addClass("ui-btn-active2");
                    $("#order_type_food").hide();
                    $("#order_type_culture").show();

                }
                else if(data_seq == "32") {
                    $(".data_seq_56").addClass("ui-btn-active2");
                    $("#order_type_food").show();
                    $("#order_type_culture").hide();
                }
                else {
                    $("#order_type_food").hide();
                    $("#order_type_culture").hide();
                }

                page.model.config.item_type = data_seq;
                page.model.config.ct_seq = "";
                page.controller.loadItemList();


            });

            page.view.more.on('click', function (event, ui) {
                pri.moreItemList();
            });

            $(document).on('click','.item_init_list', function (event, ui) {
                var data_seq = $(this).attr("data-seq");
                page.model.config.ct_seq = data_seq;

                $('.item_title_on').hide();
                $('.item_title_off').show();

                $(this).find('.item_title_off').hide();
                $(this).find('.item_title_on').show();

                $(".item_init_list").removeClass("ui-btn-active2");
                $(this).addClass("ui-btn-active2");
                //$(".data_seq_"+page.model.config.ct_seq).addClass("ui-btn-active2");

                $("#item_list").html('');
                page.controller.loadItemList();
            });

            onsolMoreList.init(function(){
                var now_page = parseInt(page.model.config.page) + 1;

                if(now_page > 1) {

                    if(onsolMoreList.scroll_mode == false) return false;

                    pri.getItemList(now_page, page.view.loadItemListCallback);
                }
            });
        };

        pub.loadPoint = pri.loadPoint;
        pub.loadItemList = pri.loadItemList;

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

        page.model.config.item_type = 32;
                //page.model.config.item_type = data.item_type;
        var data_seq = gup("data_seq");
        page.view.orderTypes.first().trigger('click');
//        if(data_seq == '') {
//        }else{
//            page.dom.find("#order_type li a[data-seq='"+ data_seq+"']").trigger('click');
//        }
        page.controller.loadPoint();
        page.controller.loadItemList();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onStop */
    page.dom.bind('onStop', function () {
    });

    /* @Annotation Don't Delete me: page.dom.bind:onRestart */
    page.dom.bind('onRestart', function (event, data, prevPageId) {
        log.d(TAG, "Data from the next page : ", data, prevPageId);

        page.controller.loadPoint();
    });

    /* @Annotation Don't Delete me: page.dom.bind:onDestroy */
    page.dom.bind('onDestroy', function () {
    });
});