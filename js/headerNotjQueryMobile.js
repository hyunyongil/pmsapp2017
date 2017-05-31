( function () {
    var arrHead = document.getElementsByTagName("script");
    var i;
    var size = arrHead.length;
    var src;
    var depth = 0;
    for (i = 0; i < size; ++i) {
        src = arrHead[i].getAttribute("src");
        if (null !== src.match("header.js")) {
            var regex = /\.\./ig;
            var regResult = regex.exec(src);
            if (regResult) {
                depth = regResult.length;
            }
        }
    }

    var dir_prefix = "";
    for (i = 0; i < depth; ++i) {
        dir_prefix += "../";
    }

    document.write('<script src="' + dir_prefix + 'lib/jsjws-3.0.2/ext/jsrsasign-4.1.4-all-min.js"></script>');
    document.write('<script src="' + dir_prefix + 'lib/jsjws-3.0.2/ext/json-sans-eval-min.js"></script>');
    document.write('<script src="' + dir_prefix + 'lib/jsjws-3.0.2/jws-3.0.min.js"></script>');

    document.write('<script src="' + dir_prefix + 'lib/jquery/jquery-1.9.1.js"></script>');
    //document.write('<script src="' + dir_prefix + 'lib/jquery.mobile/jquery.mobile-1.3.2.min.js"></script>');
    document.write('<script src="' + dir_prefix + 'lib/json2.js"></script>');
    //document.write('<script src="' + dir_prefix + 'lib/jms/jms.emulator.js"></script>');
    //document.write('<script src="' + dir_prefix + 'lib/jms/jms.util.js"></script>');
    //document.write('<script src="' + dir_prefix + 'lib/jms/jms.page.js"></script>');
    //document.write('<script src="' + dir_prefix + 'lib/iscroll.js"></script>');
    document.write('<script src="' + dir_prefix + 'js/common.js"></script>');
    document.write('<script src="' + dir_prefix + 'js/config.js"></script>');
    document.write('<script src="' + dir_prefix + 'js/constants.js"></script>');
    document.write('<script src="' + dir_prefix + 'js/rest.js"></script>');
    document.write('<script src="' + dir_prefix + 'js/push.js"></script>');
    document.write('<script src="' + dir_prefix + 'cordova.js"></script>');
    document.write('<script src="' + dir_prefix + 'cordova_plugins.js"></script>');
}());
