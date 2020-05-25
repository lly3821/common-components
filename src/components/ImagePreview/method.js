export function setGesture(el) {
  let obj = {};
  let start = [];
  el.addEventListener('dblclick', function () {
    obj.gesturedbl && obj.gesturedbl.call(el);
  });
  el.addEventListener(
    'touchstart',
    function (e) {
      start = e.touches;
      obj.gesturestart && obj.gesturestart.call(el);
    },
    {passive: true},
  );
  el.addEventListener(
    'touchmove',
    function (e) {
      let now = e.touches;
      if (start.length === 1 && now.length === 1) {
        if (
          el.parentNode.scrollLeft < el.width - window.innerWidth &&
          el.width > window.innerWidth &&
          el.parentNode.scrollLeft > 0
        ) {
          e.stopPropagation();
        }
        e.move = {
          dx: start[0].pageX - now[0].pageX,
          dy: start[0].pageY - now[0].pageY,
        };
        obj.gesturemove && obj.gesturemove.call(el, e);
      }
      if (start.length === 2 && now.length === 2) {
        e.stopPropagation();
        let scale =
          getDistance(now[0], now[1]) / getDistance(start[0], start[1]);
        e.scale = scale.toFixed(2);
        obj.gestureresize && obj.gestureresize.call(el, e);
      }
    },
    {passive: false},
  );
  el.addEventListener(
    'touchend',
    function () {
      obj.gestureend && obj.gestureend.call(el);
    },
    {passive: true},
  );
  return obj;
}

function getDistance(p1, p2) {
  let x = p2.pageX - p1.pageX,
    y = p2.pageY - p1.pageY;
  return Math.sqrt(x * x + y * y);
}

export function scaleImg(
  img,
  scale = 1,
  {width = window.innerWidth, height = window.innerHeight},
) {
  let obj = {};
  if (img.height / img.width > window.innerHeight / window.innerWidth) {
    const newHeight = Math.max(height * scale, window.innerHeight);
    img.style.height = newHeight + 'px';
    obj.scale = newHeight / window.innerHeight;
    if (img.getBoundingClientRect().width > window.innerWidth) {
      img.style.left = '0';
      img.style.transform = `translateX(0)`;
    } else {
      img.style.left = '50%';
      img.style.transform = `translateX(-50%)`;
    }
  } else {
    const newWidth = Math.max(width * scale, window.innerWidth);
    img.style.width = newWidth + 'px';
    obj.scale = newWidth / window.innerWidth;
    if (img.getBoundingClientRect().height > window.innerHeight) {
      img.style.top = '0';
      img.style.transform = `translateY(0)`;
    } else {
      img.style.top = '50%';
      img.style.transform = `translateY(-50%)`;
    }
  }
  const resImgRect = img.getBoundingClientRect();
  obj.width = resImgRect.width;
  obj.height = resImgRect.height;
  return obj;
}
