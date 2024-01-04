const searchInp = document.querySelector('.search')
const searchBtn = document.querySelector('.search-btn')
const errorMessage = document.querySelector('#errorMesage')
const temperature = document.querySelector('.temperature')
const tempStatus = document.querySelector('.status')
const time = document.querySelector('.time')
const day = document.querySelector('.day')
const date = document.querySelector('.date')
const cityBlock = document.querySelector('.city')
const weatherImage = document.querySelector('.weatherImage')


let city = 'London'
let value

searchBtn.addEventListener('click', (e) => {
	value = searchInp.value
	city = value
	
	if(!value) return false
	api(value)
	searchInp.value = ''
})
document.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		value = searchInp.value
		city = value
		
	if(!value) return false
	api(value)
	searchInp.value = ''
	}
})



function api(city) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?
	q=${city}&appid=06b7721a3df30171c1ec1accc239c479`)

	.then((response) => {return response.json()})
	.then((data) => {
		start(data)
	})
	.catch((error) => {
		
		errorMessage.innerHTML = 'Not found :('
	})
}

function start(data) {
	errorMessage.innerHTML = ''
	updateTemp(data) 
	updateDate(data.timezone)
	updateTime(data.timezone)
	updateWeather(data)

}

function updateTemp(data) {
	let getTemp = data.main.temp
	let tempC = Math.floor(getTemp) - 273
	let sign = (tempC > 0) ? '+' : ''
	
	temperature.innerHTML = `${sign}${tempC}°`
	tempStatus.innerHTML = data.weather[0].main
	// let tempDescription = data.weather[0].description

}

function updateDate(timezone) {
	// Получаем текущую дату и время с учетом смещения времени
	const currentTime = new Date(Date.now() + timezone * 1000); // Преобразуем смещение в миллисекунды
 
	// Создаем объект для локализации дня недели и месяца
	const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
	const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
 
	// Получаем отформатированные значения для дня и даты
	const formattedDate = dateTimeFormat.format(currentTime);
 
	// Обновляем элементы страницы
	day.innerHTML = formattedDate.split(',')[0]; // Отделяем день от даты
	date.innerHTML = formattedDate.split(',')[1].trim(); // Убираем пробелы перед датой
}

function updateTime(timezone) {
	// Вычисляем текущее время в часовом поясе UTC
	const currentTimeUTC = new Date();
	
	// Применяем смещение к текущему времени
	currentTimeUTC.setUTCSeconds(currentTimeUTC.getUTCSeconds() + timezone);
 
	// Функция для форматирования числа с добавлением нулей
	const formatNumber = (num) => (num < 10 ? `0${num}` : num);
 
	// Получаем часы и минуты из скорректированного времени
	const hours = formatNumber(currentTimeUTC.getUTCHours());
	const minutes = formatNumber(currentTimeUTC.getUTCMinutes());
 
	// Форматируем время в формат "10:15"
	const formattedTime = `${hours}:${minutes}`;
	if (formattedTime === '00:00') updateDate(data.timezone)
	// Обновляем элемент страницы
	time.innerHTML = formattedTime; // Устанавливаем отформатированное время
 }

 
function updateWeather(data) {
	let city = data.name
	let country = data.sys.country
	let weatherCode = data.weather[0].icon

	cityBlock.innerHTML = ` ${city}, ${country}`
	weatherImage.src = `https://openweathermap.org/img/wn/${weatherCode}@2x.png`
}
 



setInterval(() => {
	api(city);
 }, 5000);

api(city)




