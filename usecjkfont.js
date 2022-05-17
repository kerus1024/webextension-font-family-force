(() => {
	const ff='font-family';
	const fff='Noto Sans CJK JP';
	const fffi='important';
	const itgn=['I', 'PRE', 'CODE'];
  let lock=false;
	let makeThrottle=new Date().valueOf();
  let throttleTime=1000;
  let make = () => {

    if (lock) return;

    lock = true;

    let affect = 0;
    let a = document.querySelectorAll('*');

    for (let i = 0; i < a.length; i++) {

      if (itgn.includes(a[i].tagName))
      	continue;

      if (a[i].className) {
        if (typeof a[i].className === 'string') {
          if (a[i].className.indexOf('icon') !== -1) {
            continue;
          }
        }
      }

      let stop = false;
      let preventLag = 0;
      let pElem = a[i].parentElement;
      do {
        if (!pElem) break;
        if (itgn.includes(pElem.tagName)) {
          stop = true;
          break;
        }
        preventLag++;
        pElem = pElem.parentElement
      } while (preventLag < 20000 || pElem);

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
      throttleTime+=1000;
  	}
	});

	observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

	make();
})();