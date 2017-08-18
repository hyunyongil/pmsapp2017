APP_VERSION = '1.0.7';
//CONNECTION_AJ_URL = 'http://loconsol.onsolutions.co.kr';//로컬
//CONNECTION_URL = 'http://loconsol.onsolutions.co.kr';//로컬

//CONNECTION_AJ_URL = 'http://devonsol.onsolutions.co.kr';//개발서버
//CONNECTION_URL = 'http://devonsol.onsolutions.co.kr';//개발서버


CONNECTION_AJ_URL = 'http://onsolutions.co.kr';//REAL서버
CONNECTION_URL = 'http://page.onsolutions.co.kr';//REAL서버

FILES_URL_DOMAIN = 'files.onsolutions.co.kr';
FILES_URL = 'http://' + FILES_URL_DOMAIN;

document.addEventListener("deviceready", function () {
   // checkVersion();
   // document.addEventListener("resume", checkVersion, false);
});
function checkVersion() {
    ONPANEL.Ajax.Request.invokePostByJSON(
        CONSTANTS.CONFIG.VERSION
        , {}
        , function (data) {
            console.log("VERSION Data:" + data.resultMsg);
            //안드로이드^ios
            //data.resultMsg = '1.0.2^v0.1';
            var versionArr = data.resultMsg.split("^");
            var app_type = device.platform.toLowerCase();
            if (app_type == 'android') {
				var new_av = parseInt(APP_VERSION.replace(/\./gi,''));
				var new_va = parseInt(versionArr[0].replace(/\./gi,''));
                if (new_av < new_va) {
                    navigator.notification.confirm('새로운 버전이 출시되어 설치할 준비가 되었습니다.', function (index) {
                        if (index == 2) {
                            location.href = 'market://details?id=com.onpanel.onsolution';
                        } else {
                            navigator.app.exitApp();
                        }
                    }, '앱 업데이트', '나중에,바로 설치하기');
                }
            } else if (app_type == 'ios') {
				var new_av = parseInt(APP_VERSION.replace(/\./gi,''));
				var new_va = parseInt(versionArr[1].replace(/\./gi,''));
                if (new_av < new_va) {
                    navigator.notification.alert('새로운 버전이 출시되어 설치할 준비가 되었습니다.', function (index) {
                        location.href = 'itms-apps://itunes.apple.com/app/id1207108232';
                    }, '앱 업데이트', '바로 설치하기');
                }
            }
        }
        , function (e, e2) {
            console.log(e);
            console.log(e2);
        }
        , true
    );
}
