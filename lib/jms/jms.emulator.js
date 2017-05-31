window.JMSUtil = {}
window.JMSUtil.Browser = {}

var agent = navigator.userAgent.toLowerCase();

if (window.JMSUtil && window.JMSUtil.AJAX) {
    window.JMSUtil.AJAX.request = function (success, error, args) {
        var paramString = "";

        var params = args.parameter.split("&");
        if (args.parameter) {
            for (var i = 0; i < params.length; i++) {
                var rec = params[i].split("=");

                if (i > 0) {
                    paramString += escape("&");
                }

                paramString += rec[0];
                paramString += escape("=");
                paramString += rec[1];
            }
        }

        $.ajax({
            'url': args.connectionType + '://' + args.ipAddress + ':' + args.portNumber + '/' + args.contextUrl + '/ws/' + args.sType + '/getService/' + args.sCode + '/?',
            'type': 'post',
            'cache': false,
            'contentType': "application/x-www-form-urlencoded",
            'dataType': "json",
            'data': 'parameters=' + paramString,
            'success': function (data) {
                console.log('ajax::success');
                success(data);
            },
            'error': function (xhr, textStatus, errorThrown) {
                console.log('ajax::fail');
                error(textStatus);
            }
        });
    };
}

if (window.JMSUtil && window.JMSUtil.Browser) {

    window.JMSUtil.Browser.startLoadingBar = function (options) {
        if ($.isPlainObject(options)) {
            console.log('[Emulator]', 'JMSUtil.Browser.startLoadingBar()', options);
            $.mobile.showPageLoadingMsg();
        }
    };

    window.JMSUtil.Browser.stopLoadingBar = function () {
        console.log('[Emulator]', 'JMSUtil.Browser.stopLoadingBar()');
        $.mobile.hidePageLoadingMsg();
    };

    // MDHUtil.Borser.terminateApp()
    window.JMSUtil.Browser.terminateApp = function () {
        console.log('[Emulator]', 'JMSUtil.Browser.terminateApp()');
        alert('[Emulator] 어플리케이션이 종료되었습니다.');
    };

}

