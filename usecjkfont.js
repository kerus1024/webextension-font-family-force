const defaultsValue = {
  font: 'Noto Sans CJK JP',
  ignoreTag: [
    'html',
    'head',
    'meta',
    'link',
    'script',
    'style',
    'img',
    'video',
    'audio',
    'embed',
    'i', 
    'pre', 
    'code',
  ],
  ignoreClassName: [
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
    '.*?pdf.*?',
    'fa',
    'fas'
  ]
};

async function storageGet() {

  if (typeof browser !== 'undefined') {
    // firefox
    return browser.storage.local.get();
  } else {
    // chrome
    return new Promise((resolve, reject) => {

      chrome.storage.local.get(Object.keys(defaultsValue), (ret) => {
        resolve(ret);
      });

    });
  }

}

async function storageSet(kv) {

  if (typeof browser !== 'undefined') {
    // firefox
    return browser.storage.local.set(kv);
  } else {
    // chrome 

    return new Promise((resolve, reject) => {

      chrome.storage.local.set(kv, () => {
        resolve();
      });

    });

  }

}
//---------------------------------------------------------------
(async() => {

  const ff = 'font-family';
  let fff = defaultsValue.font;
  const fffi = 'important';
  let ignoreTag = defaultsValue.ignoreTag;
  let ignoreClassName = defaultsValue.ignoreClassName;
  const startTime = new Date().valueOf();
  const startBurstTime = 10000;
  const aliveTime = 60000;
  let lock = false;
  let makeThrottle = new Date().valueOf();
  let throttleTime = 1000;
  let maxSeek = 0;
  let limitSeek = 20000;
  let startlimitSeek = 100000;

  const getKey = await storageGet();
  
  if (typeof getKey === 'object') {

    if (getKey.font) {
      fff = getKey.font;
    }

    if (getKey.ignoreTag && getKey.ignoreTag instanceof Array) {
      ignoreTag = getKey.ignoreTag;
    }

    if (getKey.ignoreClassName && getKey.ignoreClassName instanceof Array) {
      ignoreClassName = getKey.ignoreClassName;
    }

  }

  let make = () => {

    if (lock) return;

    lock = true;

    let affect = 0;
    let seeked = 0;

    document.documentElement.style.setProperty(ff, fff, fffi);
    document.body.style.setProperty(ff, fff, fffi);


    const seek = (htmlNodes) => {
      seeked++;
      
      if ((!maxSeek && seeked > startlimitSeek) && (maxSeek && seeked > limitSeek)) {
        return console.error(`[usecjkfont] Seeked over ${seeked}. seeking is stopped`);
      }

      if (htmlNodes.childNodes) {
        for (let i = 0; i < htmlNodes.childNodes.length; i++) {

          const elem = htmlNodes.childNodes[i];

          // type document-element
          if (elem.nodeType === 1) {

            let set = true;

            // ignore dislike tags
            if (ignoreTag.includes(elem.tagName.toLowerCase())) {
              set = false;
            }

            // ignore element specifically including classname
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

              // shut-off non-text element
              if (elem.textContent && typeof elem.textContent === 'string') {
                // shut-off non-text element (PUA)
                if (!new RegExp(/^[\uE000-\uF8FF]$/).test(elem.textContent)) {
                  elem.style.setProperty(ff, fff, fffi);
                  affect++;  
                }
              }

              if (elem.childNodes) {
                seek(elem);
              }

            }  
          }
        }  
      }

    }

    seek(document.body);

    console.log(`[usecjkfont] Element Affects: ${affect}/${seeked}`);

    if (seek > maxSeek) {
      maxSeek = seek;
    }

    lock = false;

  }

  make();

  let makesecond_ = null;
  const makesecond = () => {

    if (new Date().valueOf() < startTime + aliveTime) {

      if ( (maxSeek < limitSeek) && (startTime + startBurstTime > new Date().valueOf() || new Date().valueOf() > makeThrottle + throttleTime)) {
        make();
        makeThrottle = new Date().valueOf();
        throttleTime += 1000;
      }

    } else {
      if (makesecond_) {
        clearInterval(makesecond_);
      }
    }
  }

  makesecond_ = setInterval(makesecond, 3000);

})();