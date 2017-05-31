$(document).one('pageinit', '#pointMallItemInfo_page', function () {
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
        pri.getItemInfoArgs = {
            url: CONSTANTS.POINTMALL.ITEM.INFO,
            type: CONSTANTS.METHOD.POST
        };

        pri.purchaseItemArgs = {
            url: CONSTANTS.POINTMALL.ITEM.PAYMENT,
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

        pub.getItemInfoArgs = pri.getItemInfoArgs;
        pub.purchaseItemArgs = pri.purchaseItemArgs;

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

        pri.image = $('.po_image', page.dom);
        pri.title = $('.po_title', page.dom);
        pri.amount = $('.po_amount', page.dom);
        pri.count = $('#po_count', page.dom);
        pri.changeStore = $('.po_change_store', page.dom);
        pri.info = $('.po_disc', page.dom);

        pri.purchase = $('.purchase', page.dom);
        pri.cart = $('.cart', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadItemInfoCallback = function(data) {
            console.log(data);

            page.model.config.info = data.result;

            if(data.result.it_file_name) {
                var src = 'https://' + data.result.it_file_rel_path + '/' + data.result.it_file_name;

                pri.image.attr('src', src);
            }
            pri.title.text(data.result.it_name);
            pri.amount.text(COMMON.formatter.addComma(data.result.it_amount) + '원');
            pri.changeStore.text(data.result.it_change_store);
            pri.info.html(data.result.it_info);
        };

        pri.purchaseItemCallback = function(data) {
            console.log(data);

            jms.page.startActivity(page.view.purchase.attr('href'));
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.purchase = pri.purchase;
        pub.cart = pri.cart;

        pub.count = pri.count;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadItemInfoCallback = pri.loadItemInfoCallback;
        pub.purchaseItemCallback = pri.purchaseItemCallback;

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

        pri.loadItemInfo = function(itemSeq) {
            pri.getItemInfo(itemSeq, page.view.loadItemInfoCallback)
        };

        pri.getItemInfo = function(itemSeq, callback) {
            var args = page.model.getItemInfoArgs;
            args.param = {
                it_seq : itemSeq
            };

            this.doRequest(callback, args);
        };

        pri.purchaseItem = function(data) {
            var args = page.model.purchaseItemArgs;
            args.param = {
                it_seq : data.it_seq,
                count : page.view.count.val()
            };

            this.doRequest(page.view.purchaseItemCallback, args);
        };

        pri.putItemInCart = function(item) {
            var cart = pri.getCart();
            if(!cart)
                cart = [];

            var seq = cart.length + 1;
            if(seq > 1)
                seq = cart[cart.length-1].seq + 1;

            cart.push({seq: seq, item: item});

            pri.setCart(cart);
        };

        pri.getCart = function() {
            return eval(COMMON.storage.get(CONSTANTS.CART_KEY));
        };

        pri.setCart = function(cart) {
            return COMMON.storage.put(CONSTANTS.CART_KEY, JSON.stringify(cart));
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
            page.view.purchase.on('click', function(event, ui) {
                event.preventDefault();

                pri.purchaseItem(page.model.config.info);
            });

            page.view.cart.on('click', function(event, ui) {
                event.preventDefault();

                var info = page.model.config.info;
                var item = {
                    product: info,
                    count: page.view.count.val(),
                    create_date: COMMON.date.getDateObjToStr(new Date())
                };

                pri.putItemInCart(item);

                alertLayer('장바구니에 담았습니다.');

                jms.page.startActivity(this.href);
            });
        };

        pub.loadItemInfo = pri.loadItemInfo;

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

    /**/
    page.dom.bind('onStart', function (event, data, prevPageId) {
        if ($.isPlainObject(data))
            $.extend(page.model.config, data);

        console.log(data);
        var it_seq = gup("it_seq");

        page.controller.loadItemInfo(it_seq);
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