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
const bignumURL = 'https://raw.githubusercontent.com/vs-postmedia/bccdc-od-deaths-scraper/main/data/topline-numbers.csv';

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
	
	// timestamp
	const last_update = data.filter(array => array.includes('last_update'));
	const ts = setupTimestamp(last_update[0][1]);

	// build main big num section
	setupBigNum(data, main, ts, last_update);

	// build drugs big num section
	// HAVE TO FIGURE OUT WHERE TO GET THESE FIGS FROM
	// setupDrugsBigNum(data, drug, ts);
}

function setupBigNum(data, main, timestamp, last_update) {
	// setup wrapper div
	const mainDiv = document.createElement('div');
	mainDiv.className = 'stat-box';

	// data
	const new_deaths = data.filter(array => array.includes('deaths_new'));
	const total_deaths = data.filter(array => array.includes('deaths_total'));
	const daily_deaths = data.filter(array => array.includes('deaths_daily'));
	
	// template
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
	// update the DOM
	main.appendChild(mainDiv);
	main.appendChild(timestamp);
}

function setupDrugsBigNum(data, drug, timestamp) {
	// setup wrapper div
	const drugDiv = document.createElement('div');
	drugDiv.className = 'stat-box';

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

function setupTimestamp(last_update) {
	const timestamp = document.createElement('p');
	timestamp.className = 'timestamp';
	timestamp.innerHTML = `As of ${last_update}`;

	return timestamp;
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

init();