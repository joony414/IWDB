const rawURL = location.href
const url = rawURL.slice(rawURL.indexOf('?') + 1, rawURL.length);
console.log(url);

var progressMeter = document.getElementById('progress-meter');
      var duration = 3000;
      var endTime = Date.now() + duration;

      function animateProgressBar ()
      {
        var currentTime = Date.now();
        var remainingTime = Math.max(0, endTime - currentTime);
        var progress = 1 - (remainingTime / duration);
        var currentWidth = (1 - progress) * 100 + '%';

        //width를 업데이트 
        progressMeter.style.width = currentWidth;

        if (remainingTime > 0) {
          requestAnimationFrame(animateProgressBar);
        } else {
          progressMeter.style.width = '0%';
        }
      }
      requestAnimationFrame(animateProgressBar);
      function startCountdown()
      {
          var countdownElement = document.getElementById('countdown');
          countdownElement.innerHTML = countdown;

          if (countdown > 0)
          {
              countdown--;
              setTimeout(startCountdown, 1000);
          }
          else
          {
              window.location.href = url;
          }
      }
      var countdown = 3;
      setTimeout(startCountdown(),100);
