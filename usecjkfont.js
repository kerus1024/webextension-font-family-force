  (async() => {

  const ff = 'font-family';
  let fff = 'Noto Sans CJK JP';
  const fffi = 'important';
  const ignoreTag = ['i', 'pre', 'code'];
  const ignoreClassName = [
    '.*?icon.*?', 
    '.*?blob.*?', 
    '.*?code.*?', 
    '.*?enlighter.*?', 
    '.*?prettyprint.*?', 
    '.*?microlight.*?', 
    '.*?comment.*?', 
    '.*?property.*?', 
    '.*?hljs.*?', 
    '.*?textarea.*?', 
    '.*?highlight.*?', 
    '.*?editor.*?', 
    '.*?vjs.*?', 
    'fa'
  ];
  const startTime = new Date().valueOf();
  const startBurstTime = 10000;
  const aliveTime = 60000;
  let lock = false;
  let makeThrottle = new Date().valueOf();
  let throttleTime = 1000;
  let maxSeek = 0;
  let limitSeek = 20000;
  let startlimitSeek = 100000;

  const getKey = await browser.storage.local.get('font');
  
  if (typeof getKey === 'object' && getKey.font) {
    fff = getKey.font;
  }


  let make = () => {

    if (lock) return;

    lock = true;

    let affect = 0;
    let seeked = 0;

    document.documentElement.style.setProperty(ff, fff, fffi);
    document.body.style.setProperty(ff, fff, fffi);

    const seek = (htmlNodes) => {

      if (seeked > startlimitSeek) {
        return console.error(`[usecjkfont] Seeked over ${seeked}. seeking is stopped`);
      }

      if (htmlNodes.childNodes) {
        for (let i = 0; i < htmlNodes.childNodes.length; i++) {

          const elem = htmlNodes.childNodes[i];

          if (elem.nodeType === 1 || elem.nodeType === 2) {

            let set = true;

            if (ignoreTag.includes(elem.tagName.toLowerCase())) {
              set = false;
            }

            if (typeof elem.className === 'string') {
              const classNames = elem.className.toLowerCase().split(' ');
              
              classNames.forEach(className => {

                ignoreClassName.forEach(ev => {

                  const ignoreRegExp = new RegExp(`^${ev}$`);
                  
                  if (ignoreRegExp.test(className)) {
                    set = false;
                  }

                });

              });

            }

            if (set) {
              elem.style.setProperty(ff, fff, fffi);
              affect++;

              if (elem.childNodes) {
                seek(elem);
                seeked++;
              }

            }  
          }
        }  
      }

    }

    seek(document);

    if (typeof debug !== 'undefined' && debug) {
      console.log(`[usecjkfont] Element Affects: ${affect}/${seeked}`);
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