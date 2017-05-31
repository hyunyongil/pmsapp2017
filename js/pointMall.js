$(document).one('pageinit', '#pointMall_page', function () {
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
        pri.getBestSellersArgs = {
            url: CONSTANTS.POINTMALL.MAIN,
            type: CONSTANTS.METHOD.GET
        };

        pri.getItemListArgs = {
            url: CONSTANTS.POINTMALL.ITEM.LIST,
            type: CONSTANTS.METHOD.GET
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

        pub.getBestSellersArgs = pri.getBestSellersArgs;
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

        pri.bestSellers = $('#best_seller', page.dom);
        pri.food = $('#food', page.dom);
        pri.culture = $('#culture', page.dom);
        pri.cash = $('#cash', page.dom);
        pri.categories = $('.category', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadBestSellersCallback = function(data) {
            for(var i=0; i<data.result.length; i++) {
                var item = data.result[i];
                var bestSeller = $('#best_seller_' + i, pri.bestSellers);

                bestSeller.data('row', item);

                if(item.it_file_name) {
                    var src = 'https://' + item.it_file_rel_path + '/' + item.it_file_name;
                    $('.image', bestSeller).attr('src', src);
                }

                $('.image', bestSeller).attr('src', src);
                $('.sell_store', bestSeller).text(item.it_sell_store);
                $('.name', bestSeller).text(item.it_name);
                $('.amount', bestSeller).text(COMMON.formatter.addComma(item.it_amount) + '원');

                bestSeller.show();
            }
        };

        pri.loadFoodCallback = function(data) {
            pri.loadItemList(pri.food, data)
        };

        pri.loadCultureCallback = function(data) {
            pri.loadItemList(pri.culture, data)
        };

        pri.loadCashCallback = function(data) {
            pri.loadItemList(pri.cash, data)
        };

        pri.loadItemList = function(dom, data) {
            var count = data.result.total_count;

            dom.find('.count').val(count).text(COMMON.formatter.addComma(count));

            pri.calcTotalCount();
        };

        pri.calcTotalCount = function() {
            var total = 0;
            $('.count', page.dom).each(function() {
                total += parseInt($(this).val())
            });

            $('.total', page.dom).text(COMMON.formatter.addComma(total));
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.bestSellers = pri.bestSellers;
        pub.categories = pri.categories;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadBestSellersCallback = pri.loadBestSellersCallback;
        pub.loadFoodCallback = pri.loadFoodCallback;
        pub.loadCultureCallback = pri.loadCultureCallback;
        pub.loadCashCallback = pri.loadCashCallback;

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

        pri.loadBestSellers = function() {
            pri.getBestSellers(page.view.loadBestSellersCallback);
        };

        pri.getBestSellers = function(callback) {
            var args = page.model.getBestSellersArgs;

            this.doRequest(callback, args);
        };

        pri.loadFood = function() {
            pri.getItemList(32, page.view.loadFoodCallback);
        };

        pri.loadCulture = function() {
            pri.getItemList(31, page.view.loadCultureCallback);
        };

        pri.loadCash = function() {
            pri.getItemList(3, page.view.loadCashCallback);
        };

        pri.getItemList = function(type, callback) {
            var args = page.model.getItemListArgs;
            args.param = {
                ct_seq: type,
                ct_seq_first: type
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
            page.view.bestSellers.find('a').bind('click', function(event, ui){
                event.preventDefault();

                jms.page.startActivity(this.href, $(this).closest('.best_seller').data('row'));
            });

            page.view.categories.find('a').bind('click', function(event, ui){
                event.preventDefault();

                jms.page.startActivity(this.href, {item_type: $(this).closest('.category').attr('item_type')});
            });
        };

        pub.loadBestSellers = pri.loadBestSellers;
        pub.loadFood = pri.loadFood;
        pub.loadCulture = pri.loadCulture;
        pub.loadCash = pri.loadCash;

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

        page.controller.loadBestSellers();
        page.controller.loadFood();
        page.controller.loadCulture();
        page.controller.loadCash();
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