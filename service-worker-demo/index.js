// if('serviceWorker' in window.navigator) {
//     navigator.serviceWorker.register('sw.js', {scope: './'})
//     .then(function(reg) {
//         console.log('success', reg);
//     })
//     .catch(function(err){
//         console.log('fail', err);
//     })
// }
//检查是否支持serviceworker
if(!('serviceWorker' in navigator)) {
    //此浏览器不支持serviceworker
    console.log('此浏览器不支持serviceworker')
    return;
}
if(!('PushManager' in window)) {
    //此浏览器不支持推送
    console.log('此浏览器不支持推送')
    return;
}
//注册service worker
function registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js')
    .then(function(registration){
        console.log('service work successfully registered');
        return registration;
    })
    .catch(function (error) {
        console.error('unable to register service worker', error)
    })
    
}

//获取权限
function askPermission() {
    return new Promise(function(resolve, reject) {
        //获取用户权限
        const permissonResult = Notification.requestPermission(function(result) {
            resolve(result)
        })
        if(permissonResult) {
            permissonResult.then(resolve, reject);
        }
    })
    .then(function(permissonResult) {
        if (permissonResult !== 'granted') {
            throw new ErrorEvent('we are not granted permisson')
        }
    })
}
function subscribeUserToPush() {
    return navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
            )
        };
        return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
        console.log('received pushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
    })
}

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
    .then(function(response) {
        if(!response.ok) {
            throw new Error('bad status code from server');
        }
        return response.json();
    })
    .then(function(responseData) {
        if(!(responseData.data && responseData.data.success)) {
            throw new Error('bad response from server.');
        }
    })

}