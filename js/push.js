// app.initialize();

/**
 * tokenHandler
 *
 * @param result
 *
 * 디바이스 토큰핸들러 콜백함수.
 * 푸시 서비스를 활성화 하였을 때, window.plugins.pushNotification.register 메소드가 실행되면서 디바이스 토큰을 가져와서 출력한다.
 * 만약에 푸시 서버로 디바이스 토큰을 보내야할 경우 이 함수 안에서 서버로 디바이스 토큰을 전송하면 된다.
 */
function tokenHandler(result){
  console.log('tokenHandler');
  console.log('deviceToken:' + result);

  COMMON.globalData.set({'push_token': result});
  COMMON.storage.put("push_token",result)
}

/**
 * errorHandler
 *
 * @param err
 *
 * 에러 핸들러 콜백 함수.
 */
function errorHandler(err){
  console.log('error:' + err);
}

/**
 * successHandler
 *
 * @param result
 *
 * 디바이스로 푸시 메세지를 받았을 때 뱃지처리 이후 호출하는 콜백함수
 */
function successHandler(result){
  console.log('successHandler');
  console.log(JSON.stringify(result));
}

/**
 * onNotificationAPN
 *
 * @param event
 *
 * iOS 디바이스로 푸시 메세지를 받을 때 호출되는 콜백함수, window.plugins.pushNotification.register 옵션 설정에서 ecb의 이름에 매칭된다.
 */
function onNotificationAPN (e){
    console.log('onNotificationAPN');
    console.log(JSON.stringify(e));

  // 푸시 메세지에 alert 값이 있을 경우
  if (e.message){
    navigator.notification.alertLayer(e.message, function(){ location.href = e.link_url; }, e.title, "확인");
  }

  // 푸시 메세지에 sound 값이 있을 경우
  if (e.sound){
    var snd = new Media(e.sound);
    snd.play();
  }

  // 푸시 메세지에 bage 값이 있을 경우
  if (e.badge){
    window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, e.badge);
  }
}

/**
 * onNotificationGCM
 *
 * @param e
 *
 * 안드로이드 디바이스로 푸시 메세지를 받을 때 호출되는 함수, window.plugins.pushNotification.register 옵션에 설정에서 ecb의 이름에 매칭된다.
 */
function onNotificationGCM (e){
console.log('onNotificationGCM');

  switch (e.event) {
  case 'registered': // 안드로이드 디바이스의 registerID를 획득하는 event 중 registerd 일 경우 호출된다.
    COMMON.globalData.set({'push_token': e.regid});
      COMMON.storage.put('push_token', e.regid);
    console.log('registerID:' + e.regid);
    break;
  case 'message': // 안드로이드 디바이스에 푸시 메세지가 오면 호출된다.
    {
      var link_url = e.payload.link_url;

      if (e.foreground){ // 푸시 메세지가 왔을 때 앱이 실행되고 있을 경우
//                    var soundfile = e.soundname || e.payload.sound;
//                    var my_media = new Media("/android_asset/www/" + soundfile);
//                    my_media.play();

          navigator.notification.alertLayer(e.payload.message, function(){ location.href = link_url }, e.payload.title, "확인");

      } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 실행되거나 실행되지 않을 경우
        if (e.coldstart) { // 푸시 메세지가 왔을 때 푸시를 선택하여 앱이 열렸을 경우
            location.href = link_url
        } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 사용되고 있을 경우
            console.log("앱이 백그라운드로 실행될 때");
        }
      }
    }

    break;
  case 'error': // 푸시 메세지 처리에 에러가 발생하면 호출한다.
    console.log('error:' + e.msg);
    break;
  case 'default':
    console.log('알수 없는 이벤트');
    break;
  }
}

// 디바이스가 ready가 될때 실행될 수 있도록 이벤트 리스너에 등록한다.
document.addEventListener("deviceready", function(){
  try{
    if(device.platform.toUpperCase() == 'ANDROID'){
      window.plugins.pushNotification.register(successHandler,errorHandler, {
        "senderID" : "245459587130", // Google GCM 서비스에서 생성한 Project Number를 입력한다.
        "ecb" : "onNotificationGCM" // 디바이스로 푸시가 오면 onNotificationGCM 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
      });
    } else {
      // PushPlugin을 설치했다면 window.plugins.pushNotification.register를 이용해서 iOS 푸시 서비스를 등록한다.
      window.plugins.pushNotification.register(tokenHandler, errorHandler, {
        "badge":"true", // 뱃지 기능을 사용한다.
        "sound":"true", // 사운드를 사용한다.
        "alert":"true", // alert를 사용한다.
        "ecb": "onNotificationAPN" // 디바이스로 푸시가 오면 onNotificationAPN 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
      });
    }
  }catch(exception){
    
  }
});