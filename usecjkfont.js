(() => {


  const ff = 'font-family';
  const fff = 'Noto Sans CJK JP';
  const fffi = 'important';
  const ignoreTag = ['i', 'pre', 'code', 'textarea', 'input'];
  const ignoreClassName = ['icon', 'blob','code', 'enlighter', 'prettyprint', 'microlight', 'comment', 'property', 'hljs', 'textarea'];
  const startTime = new Date().valueOf();
  const startBurstTime = 10000;
  const aliveTime = 60000;
  let lock = false;
  let makeThrottle = new Date().valueOf();
  let throttleTime = 1000;
  let maxSeek = 0;
  let limitSeek = 20000;

  let make = () => {

    if (lock) return;

    lock = true;

    let affect = 0;
    let seeked = 0;

    const seek = (htmlNodes) => {

      if (htmlNodes.childNodes) {
        for (let i = 0; i < htmlNodes.childNodes.length; i++) {

          const elem = htmlNodes.childNodes[i];

          if (elem.nodeType === 1 || elem.nodeType === 2) {

            let set = true;

            if (ignoreTag.includes(elem.tagName.toLowerCase())) {
              set = false;
            }

            ignoreClassName.forEach(ev => {
              if (typeof elem.className === 'string' && elem.className.toLowerCase().indexOf(ev) !== -1) {
                set = false;
              }
            });

            if (set) {
              elem.style.setProperty(ff, fff, fffi);
              affect++;
            }

            if (elem.childNodes) {
              seek(elem);
              seeked++;
            }  
          }
        }  
      }

    }

    seek(document)

    if (typeof debug !== 'undefined') {
      console.log('Font Affected OK . elements: ' + seeked + ', affect: ' + affect);
    }

    if (seek > maxSeek) {
      maxSeek = seek;
    }

    lock = false;

  }


  let observer = new MutationObserver(mutations => {
    if ((maxSeek < limitSeek && new Date().valueOf() < startTime + aliveTime && new Date().valueOf() > makeThrottle + throttleTime) || (startTime + startBurstTime > new Date().valueOf() && new Date().valueOf() > makeThrottle + throttleTime)) {
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