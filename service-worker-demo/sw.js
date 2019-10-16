this.addEventListener('install', function () {
    console.log('Service worker install');
});

this.addEventListener('activate', function () {
    console.log('Service worker activate');
});
