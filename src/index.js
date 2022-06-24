// LIBS

// CSS
import normalize from './css/normalize.css';
import postmedia from './css/postmedia.css';
import colours from './css/colors.css';
import fonts from './css/fonts.css';
import css from './css/main.css';
import nav from './css/nav.css';

// VARS
const headerOffset = 50;

// JS
const init = async () => {
	console.log('init!')

	document.querySelectorAll('.nav-li a[href^="#"')
		.forEach(trigger => {
			trigger.onclick = function(e) {
				e.preventDefault();
				let hash = this.getAttribute('href');
				let target = document.querySelector(hash);
				let elementPosition = target.offsetTop;
				let offsetPosition = elementPosition - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			}
		});
};

init();