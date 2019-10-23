
const VAPIDPublicKey = 'shuyibin'
//注册service worker
function registerServiceWorker() {
  // 检查是否支持serviceworker
  // if (!("serviceWorker" in navigator)) {
  // 此浏览器不支持serviceworker
  // console.log("此浏览器不支持serviceworker");
  // return;
  // }
  if (!navigator.serviceWorker) {
    return Promise.reject("not support service worker");
  }
  return navigator.serviceWorker
    .register("./sw.js")
    .then(function(registration) {
      console.log("service work successfully registered");
      return registration;
    })
    .catch(function(error) {
      console.error("unable to register service worker", error);
    });
}

//获取通知权限
function askPermission() {
	// 是否支持桌面通知
  if (!window.Notification) {
    return Promise.reject("not support web notification");
  }
  // 兼容Notification.requestPermission返回为一个回调函数的情况
  // return new Promise(function(resolve, reject) {
  //   //获取用户权限
  //   const permissonResult = Notification.requestPermission(function(result) {
  //     resolve(result);
  //   });
  //   if (permissonResult) {
  //     permissonResult.then(resolve, reject);
  //   }
  // }).then(function(permissonResult) {
  //   if (permissonResult !== "granted") {
  //     throw new ErrorEvent("we are not granted permisson");
  //   }
  // });

  // 获取用户权限
  return Notification.requestPermission().then(function(permission) {
    if (permission === "granted") {
      return Promise.resolve();
		}
		// 用户禁止桌面通知权限
    return Promise.reject("we are not granted permission");
  });
}
// 订阅推送并将订阅结果发送给后端
function subscribeUserToPush(registration) {
	if(!window.pushManager) {
		return Promise.reject('not support web push')
	}
	//检查是否已经订阅
  // return navigator.serviceWorker
  //   .register("sw.js")
  //   .then(function(registration) {
  //     const subscribeOptions = {
  //       userVisibleOnly: true,
  //       applicationServerKey: urlBase64ToUint8Array(
  //         "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
  //       )
  //     };
  //     return registration.pushManager.subscribe(subscribeOptions);
  //   })
  //   .then(function(pushSubscription) {
  //     console.log(
  //       "received pushSubscription: ",
  //       JSON.stringify(pushSubscription)
  //     );
  //     return pushSubscription;
	//   });
	return registration.pushManager.getSubscription().then(function(subscription){
		//已经订阅过的就不再订阅
		if (subscription) {
			return;
		}
		//没订阅就发起订阅
		return registration.pushManager.subscribe({
			//用户可见，无法显示静默通知
			userVisibleOnly: true,
			//公匙，鉴别订阅用户的服务应用
			applicationServerKey: base64ToUint8Array(VAPIDPublicKey)
		}).then(function(subscription) {
			sendSubscriptionToBackEnd(subscription)
		})
	})
}


function sendSubscriptionToBackEnd(subscription) {
  return fetch("/api/push/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
			// 推送服务器生成包含唯一标识符的 URL，推送服务器通过它判断将消息发送到哪个客户端
			endpoint: subscription.endpoint,
			key: {
				//getKey获取的值未ArrayBuffer，需要转码未base64字符串方便传输
				//密钥
				p256dh: uint8ArrayToBase64(subscription.getKey('p256th')),
				// 校验码信息
				auth: uint8ArrayToBase64(subscription.getKey('auth'))
			}
		})
  })
//     .then(function(response) {
//       if (!response.ok) {
//         throw new Error("bad status code from server");
//       }
//       return response.json();
//     })
//     .then(function(responseData) {
//       if (!(responseData.data && responseData.data.success)) {
//         throw new Error("bad response from server.");
//       }
//     });
}
function uint8ArrayToBase64 (arr) {
	return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)));
}

function base64ToUint8Array (base64String) {
	let padding = '='.repeat((4 - base64String.length % 4) % 4)
  let base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  let rawData = atob(base64)
  let outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

