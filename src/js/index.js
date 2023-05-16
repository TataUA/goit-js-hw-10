import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './fetchCountries';
import '../css/styles.css';

const  refs = {
    search: document.getElementById('search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
};

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

refs.search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const value = e.target.value.trim();

    if(value === "") {
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";
        return;
    }
    fetchCountries(value)
    .then((data) => {
        if(data.length > 10) {
            refs.countryList.innerHTML = "";
            Notify.info('Too many matches found. Please enter a more specific name.');            
        } else if (data.length === 1) {
            refs.countryList.innerHTML = "";
            createCountryInfo(data);
        } else {
            refs.countryInfo.innerHTML = "";
            createCountryList(data);
        }        
    })
    .catch(error => {
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";
        Notify.failure('Oops, there is no country with that name');
    })
 };

 function createCountryList(countries) {
    refs.countryList.innerHTML = countries.map(({flags, name}) => {
    return `<li class="flag">
        <img src="${flags.svg}" width='100' alt="${flags.alt}"/>
        <h2 class="subtitle">${name.official}</h2>
    </li>`;
    }).join('');
};

function createCountryInfo(country) {
    refs.countryInfo.innerHTML = country.map(({flags, name, capital, population, languages}) => {
    languages = Object.values(languages).join(', ');

    return `<div class="block">
            <img src="${flags.svg}" width='100' alt="${flags.alt}"/>
            <h1 class="title">${name.official}</h1>
        </div>
        <div class="block">
            <h3 class="category">Capital:</h3>
            <p class="value">${capital}</p>
        </div>
        <div class="block">
            <h3 class="category">Population:</h3>
            <p class="value">${population}</p>
        </div>        
        <div class="block">
            <h3 class="category">Languages:</h3>
            <p class="value">${languages}</p>
        </div>`
    }).join('');
};









