$(document).one('pageinit', '#myPageCart_page', function () {
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

        pri.list = $('#list', page.dom);
        pri.templete = $('#templete li', page.dom);
        pri.purchase = $('#purchase', page.dom);

        // ////////////////////////////
        // private functions
        // ////////////////////////////
        pri.loadCartListCallback = function (data) {
            console.log(data);
            if (!data)
                return;

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var clone = pri.templete.clone();

                clone.data('row', item);
                if (item.item.product.it_file_name) {
                    var src = 'https://' + item.item.product.it_file_rel_path + '/' + item.item.product.it_file_name;
                    clone.find('.image').attr('src', src);
                }

                clone.find('.title').text(item.item.product.it_name);
                clone.find('.point').text(COMMON.formatter.addComma(item.item.product.it_amount) + 'P');
                clone.find('.count').text(item.item.count + '개');
                clone.find('.create_date').text(COMMON.formatter.date.addSlash(item.item.create_date, '.'));

                clone.find('.remove').on('click', {seq: item.seq}, function (event, ui) {
                    page.controller.removeCartItem(event.data.seq);

                    $(this).closest('.item').remove();
                });

                clone.appendTo(pri.list);
            }

            if(data.length)
                pri.purchase.show();

            pri.list.listview("refresh");
        };

        pri.purchaseItemCallback = function (data) {
            if (ONPANEL.Ajax.Result.isSucess(data)) {
                page.controller.clearCart();

                jms.page.startActivity(page.view.purchase.attr('href'));
            }
        };

        // ////////////////////////////
        // public variables
        // ////////////////////////////
        var pub = {};

        pub.list = pri.list;
        pub.purchase = pri.purchase;

        // ////////////////////////////
        // public functions
        // ////////////////////////////
        pub.loadCartListCallback = pri.loadCartListCallback;
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

        pri.getCart = function () {
            return eval(COMMON.storage.get(CONSTANTS.CART_KEY));
        };

        pri.setCart = function (cart) {
            return COMMON.storage.put(CONSTANTS.CART_KEY, JSON.stringify(cart));
        };

        pri.clearCart = function() {
            pri.setCart([]);
        };

        pri.loadCartList = function () {
            page.view.loadCartListCallback(pri.getCart());
        };

        pri.removeCartItem = function (seq) {
            var cart = pri.getCart();
            for (var i = 0; i < cart.length; i++) {
                var item = cart[i];

                if (item.seq = seq) {
                    cart.splice(i, 1);

                    break;
                }
            }

            pri.setCart(cart);
        };

        pri.purchaseItem = function () {
            var item_seq = '';
            var item_count = '';

            $('.item', page.view.list).each(function () {
                var item = $(this).data('row');
                if(item_seq.length > 0) {
                    item_seq += '^';
                    item_count += '^';
                }

                item_seq += item.item.product.it_seq;
                item_count += item.item.count
            });

            var args = page.model.purchaseItemArgs;
            args.param = {
                it_seq: item_seq,
                count: item_count
            };

            this.doRequest(page.view.purchaseItemCallback, args);
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
            page.view.purchase.on('click', function (event, ui) {
                event.preventDefault();

                pri.purchaseItem();
            });
        };

        pub.loadCartList = pri.loadCartList;
        pub.removeCartItem = pri.removeCartItem;
        pub.clearCart = pri.clearCart;

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

        page.controller.loadCartList();
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