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

const savevalues = async() => {
  document.querySelector('#result').innerHTML = 'saving...';

  const key = {}
  key.font = document.querySelector("#input_font").value;
  key.ignoreTag = document.querySelector("#input_tagnames").value.split('\n');
  key.ignoreClassName = document.querySelector("#input_classnames").value.split('\n');

  key.ignoreTag.forEach((x, i) => { if (!x || x == '') { key.ignoreTag.splice(i, 1) }  });
  key.ignoreClassName.forEach((x, i) => { if (!x || x == '') { key.ignoreClassName.splice(i, 1) }  });

  const save = await storageSet(key);
  
  await document.fonts.ready;
  // Not working on firefox for securitry reasons
  if (document.fonts.check(`12px ${key.font}`)) {
    document.querySelector('#result').innerHTML = 'OK: you need to refresh page to apply inputed font';
  } else {
    document.querySelector('#result').innerHTML = '<span style="color:red">Font Saved: but not found font on your system</span>';
  }

  setTimeout(() => {
    document.querySelector('#result').innerHTML = '';
  }, 2000);

}

const setCorrectRowsTextarea = (selector) => {
  const el = document.querySelector(selector);
  const val = el.value;
  const rows = val.split('\n');
  const len = rows.length; 
  el.setAttribute('rows', len + 1);
}

const getFillDefaultValues = () => {
  document.querySelector("#input_font").value = defaultsValue.font;
  
  document.querySelector('#input_tagnames').value = '';
  
  defaultsValue.ignoreTag.forEach(v => { 
    document.querySelector('#input_tagnames').value += `${v}\n`;
    setCorrectRowsTextarea('#input_tagnames')
  })

  document.querySelector('#input_classnames').value = '';

  defaultsValue.ignoreClassName.forEach(v => { 
    document.querySelector('#input_classnames').value += `${v}\n`;
    setCorrectRowsTextarea('#input_classnames');
  })

}

document.addEventListener('DOMContentLoaded', async() => {

  const getKey = await storageGet();

  if (typeof getKey === 'object' && (getKey.font || getKey.ignoreTag || getKey.ignoreClassName)) {

    if (getKey.font) {
      document.querySelector("#input_font").value = getKey.font;
    }

    if (getKey.ignoreTag && getKey.ignoreTag instanceof Array) {
      document.querySelector('#input_tagnames').value = '';
      getKey.ignoreTag.forEach(v => { 
        document.querySelector('#input_tagnames').value += `${v}\n`;
        setCorrectRowsTextarea('#input_tagnames');
      })
    }

    if (getKey.ignoreClassName && getKey.ignoreClassName instanceof Array) {
      document.querySelector('#input_classnames').value = '';
      getKey.ignoreClassName.forEach(v => { 
        document.querySelector('#input_classnames').value += `${v}\n`;
        setCorrectRowsTextarea('#input_classnames');
      })
    }

  } else {
    getFillDefaultValues();
  }

});


document.querySelector("#input_font").addEventListener('keyup', async(e) => {
  e.preventDefault();
  savevalues();
});

document.querySelector("#savebutton").addEventListener('click', (e) => {
  window.scrollTo(0, 0);
  savevalues();
});
document.querySelector("#defaultbutton").addEventListener('click', (e) => {
  window.scrollTo(0, 0);
  getFillDefaultValues();
});
document.querySelector("form").addEventListener("submit", saveOptions);