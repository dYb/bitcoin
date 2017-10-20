 (function(doc, win) {    
     var docEl = doc.documentElement,
         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
         isIOS = navigator.userAgent.match(/iphone|ipad|ipod/i),
         recalc = function() {
             var clientWidth = docEl.clientWidth;
             var clientHeight = docEl.clientHeight;
             if (!clientWidth) return;
             if (clientWidth >= 750) {
                 clientWidth = 750;
                 doc.body.style.width = 750 + 'px';
             } else {
                 doc.body.style.width = clientWidth + 'px';
             }
             docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
             docEl.dataset.percent = 100 * (clientWidth / 750);
             docEl.dataset.width = clientWidth;
             docEl.dataset.height = clientHeight;
         };
     recalc();
     isIOS && doc.documentElement.classList.add('iosx' + win.devicePixelRatio);
     if (!doc.addEventListener) return;
     win.addEventListener(resizeEvt, recalc, false);
 })(document, window);