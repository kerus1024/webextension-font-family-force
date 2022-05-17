(() => {
  const ff = 'font-family';
  const fff = 'Noto Sans CJK JP';
  const fffi = 'important';
  const ignoreTag = ['i', 'pre', 'code'];
  const ignoreClassName = ['icon', 'blob','code'];
  let lock = false;
  let makeThrottle = new Date().valueOf();
  let throttleTime = 1000;
  let make = () => {

    if (lock) return;

    lock = true;

    let affect = 0;
    let a = document.querySelectorAll('*');

    for (let i = 0; i < a.length; i++) {

      let stop = false;

      if (ignoreTag.includes(a[i].tagName.toLowerCase()))
        continue;

      if (a[i].className && typeof a[i].className === 'string') {
        ignoreClassName.forEach(ve => {
          if (a[i].className.toLowerCase().indexOf(ve) !== -1) {
            stop = true;
          }
        });
      }

      
      let preventLag = 0;
      let pElem = a[i].parentElement;

      do {

        if (!pElem) break;
        if (ignoreTag.includes(pElem.tagName.toLowerCase())) {
          stop = true;
        }

        if (pElem.className && typeof pElem.className === 'string') {
          ignoreClassName.forEach(ve => {
            if (pElem.className.toLowerCase().indexOf(ve) !== -1) {
              stop = true;
            }
          });
        }

        preventLag++;
        pElem = pElem.parentElement
      } while (!stop && preventLag < 20000 || pElem);

      if (stop) continue;

      a[i].style.setProperty(ff, fff, fffi);
      affect++;

    }

    if (typeof debug !== 'undefined') {
      console.log('Font Affected OK . elements: ' + a.length + ', affect: ' + affect);
    }

    lock = false;

  }


  let observer = new MutationObserver(mutations => {
    if (new Date().valueOf() > makeThrottle + throttleTime) {
      make();
      makeThrottle = new Date().valueOf();
      throttleTime += 1000;
    }
  });

  observer.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  });

  make();
})();
