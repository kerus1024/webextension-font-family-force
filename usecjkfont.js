/*
Just draw a border round the document.body.
*/
(() => {
	
	let a = document.querySelectorAll('*');
	for (let i = 0; i < a.length; i++) {
	  a[i].style.setProperty('font-family', 'Noto Sans CJK JP', 'important')
	}
	
	console.log('Font Affected OK');
	
})()