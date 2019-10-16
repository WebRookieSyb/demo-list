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
    
}