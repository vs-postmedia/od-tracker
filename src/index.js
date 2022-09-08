// LIBS
import 'lazysizes';
import * as Papa from 'papaparse';

// CSS
import normalize from './css/normalize.css';
import postmedia from './css/postmedia.css';
import colours from './css/colors.css';
import fonts from './css/fonts.css';
import css from './css/main.css';
import nav from './css/nav.css';

// VARS
const headerOffset = 50;
const bignumURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSoEwt95_sCck6DtZAZIA1SLflANuwvGgQLtQEIYO0x7eOa1pQ-yKQZO8W-FdFDKx3abnITsxcqEpeD/pub?gid=440911543&single=true&output=csv';

// JS
const init = async () => {
	// nav menu
	setupMenu();

	// fetch data & update big numbers section
	Papa.parse(bignumURL, {
		download: true,
		header: false,
		complete: results => {
			setupBigNums(results.data);
		}
	});
};

function setupBigNums(data) {
	const main = document.getElementById('main-big-num');
	const drug = document.getElementById('drugs-big-num');
	const timestamp = document.createElement('p');
	const mainDiv = document.createElement('div');
	const drugDiv = document.createElement('div');
	mainDiv.className = 'stat-box';
	drugDiv.className = 'stat-box';
	timestamp.className = 'timestamp';

	// build main big num section
	const new_deaths = data.filter(array => array.includes('deaths_new'));
	const total_deaths = data.filter(array => array.includes('deaths_total'));
	const daily_deaths = data.filter(array => array.includes('deaths_daily'));
	const last_update = data.filter(array => array.includes('last_update'));

	mainDiv.innerHTML = `
		<div class="stat">
			<p class="big-num">${new_deaths[0][1]}</p>
			<p class="label">New deaths in ${last_update[0][1].split(' ')[0]}</p>
		</div>
		<div class="stat">
			<p class="big-num">${numberWithCommas(total_deaths[0][1])}</p>
			<p class="label">Deaths since 2016</p>
		</div>
		<div class="stat">
			<p class="big-num">${daily_deaths[0][1]}</p>
			<p class="label">Deaths per day (average)</p>
		</div>
	`;
	timestamp.innerHTML = `As of ${last_update[0][1]}`;
	main.appendChild(mainDiv);
	main.appendChild(timestamp);

	// build drugs big num section
	const fenty_deaths = data.filter(array => array.includes('deaths_fentanyl'));
	const benzo_deaths = data.filter(array => array.includes('deaths_benzo'));
	drugDiv.innerHTML = `
		<div class="stat">
			<p class="big-num">${benzo_deaths[0][1]}</p>
			<p class="label">Deaths involving benzodiazepines</p>
		</div>
		<div class="stat">
			<p class="big-num">${fenty_deaths[0][1]}</p>
			<p class="label">Deaths involving extreme fentanyl concentrations</p>
		</div>
	`;
	 
	drug.appendChild(drugDiv);
	drug.appendChild(timestamp);
}

function setupMenu() {
	document.querySelectorAll('.nav-li a[href^="#"')
		.forEach(trigger => {
			trigger.onclick = function(e) {
				e.preventDefault();
				let hash = this.getAttribute('href');
				let target = document.querySelector(hash);
				let elementPosition = target.offsetTop;
				let offsetPosition = elementPosition - headerOffset;

				// reset highlight
				document.querySelectorAll('.nav-li')
					.forEach(li => {
						li.className = 'nav-li'
					});
				let parent = this.parentNode;
				parent.className = 'nav-li active-nav'

				// scroll page
				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			}
		});
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

init();