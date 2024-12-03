import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
	const API_URL = import.meta.env.VITE_WEATHER_API_KEY;
	const [list, setList] = useState(null);
	const [filteredList, setFilteredList] = useState(null);
	const [countryData, setCountryData] = useState(null);
	const [capitalWeather, setCapitalWeather] = useState(null);

	const fetchAll = () =>
		axios
			.get("https://studies.cs.helsinki.fi/restcountries/api/all")
			.then((results) => {
				console.log(results.data);
				setList(results.data);
			})
			.catch((error) => console.log(error));

	const countryLookup = (text) => {
		const filtered = list.filter((country) =>
			country.name.common
				.toLowerCase()
				.includes(text.target.value.toLowerCase()),
		);

		console.log(text.target.value, filtered);

		if (text.target.value === "") setFilteredList(null);
		else setFilteredList(filtered);
	};

	const fetchCountryData = (country) => {
		const find = country || filteredList[0].name.common;

		axios
			.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${find}`)
			.then((result) => {
				setCountryData(result.data);
				fetchWeatherData(result.data);
			})
			.catch((error) => console.log(error));
	};

	const fetchWeatherData = (data) => {
		if (!data) return;

		// after half a day of waiting, api key for open weather map still isn't working
		/* `https://api.openweathermap.org/data/3.0/onecall?lat=${data.latlng[0]}&lon=${data.latlng[1]}&appid=${API_URL}`; */

		axios
			.get(
				`http://api.weatherapi.com/v1/current.json?key=${API_URL}&q=${data.capital[0]}&aqi=no`,
			)
			.then((result) => {
				console.log(result.data);
				setCapitalWeather(result.data);
			})
			.catch((error) => console.log("Error fetching weather data, ", error));
	};

	useEffect(() => {
		if (!filteredList || filteredList.length !== 1) {
			setCountryData(null);
			return;
		}

		fetchCountryData();
	}, [filteredList]);

	useEffect(() => {
		if (!list) fetchAll();
	}, []);

	return (
		<div>
			<div>
				find countries <input onChange={countryLookup} />
			</div>

			{filteredList ? (
				<div>
					{filteredList.length <= 10
						? filteredList.map((country) => (
								<div key={country.cioc}>
									{country.name.common}{" "}
									<button
										hidden={filteredList.length === 1}
										type="button"
										onClick={() => fetchCountryData(country.name.common)}
									>
										show
									</button>
								</div>
							))
						: "Too many matches"}
				</div>
			) : null}

			{countryData ? (
				<div>
					<h1>{countryData.name.common}</h1>
					<div>
						capital{" "}
						{Object.values(countryData.capital).map((capital) => capital)}
					</div>
					<div>population {countryData.population}</div>
					<div>
						<h1>languages:</h1>
						<div>
							{Object.values(countryData.languages).map((lang) => (
								<div key={lang}>- {lang}</div>
							))}
						</div>
					</div>
					<img src={countryData.flags.png} alt="" />

					{capitalWeather && (
						<div>
							<h1>Weather in {capitalWeather.location.name}</h1>
							<div>
								<img src={capitalWeather.current.condition.icon} />
							</div>
							<div>{capitalWeather.current.condition.text}</div>
							<div>temperature {capitalWeather.current.temp_c} celsius</div>
							<div>
								wind{" "}
								{((capitalWeather.current.wind_kph * 1000) / 3600).toFixed(2)}{" "}
								m/s
							</div>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}

export default App;
