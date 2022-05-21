document.addEventListener('DOMContentLoaded', async() => {

  const getKey = await browser.storage.local.get('font');
  
  if (typeof getKey === 'object' && getKey.font) {
    document.querySelector("#input_font").value = getKey.font;
  } else {
    document.querySelector("#input_font").value = 'Noto Sans CJK JP';
  }

});


document.querySelector("#input_font").addEventListener('keyup', async(e) => {
  e.preventDefault();
  document.querySelector('#result').innerHTML = 'saving...';

  const key = {font: document.querySelector("#input_font").value}
  const save = await browser.storage.local.set(key);

  document.querySelector('#result').innerHTML = 'OK: you need to refresh page to apply inputed font';
  setTimeout(() => {
    document.querySelector('#result').innerHTML = '';
  }, 500)

});


document.querySelector("form").addEventListener("submit", saveOptions);