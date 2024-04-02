import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_KEY

    useEffect(() => {
        if (country.capital) {
            axios
                .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
                .then(response => setWeather(response.data))
        }
    }, [country.capital, api_key])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {country.languages && Object.values(country.languages).map((language, index) => <li key={index}>{language}</li>)}
            </ul>
            <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="100" />
            {weather && (
                <div>
                    <h3>Weather in {country.capital}</h3>
                    <p>temperature {weather.main.temp} Celsius</p>
                    <p>wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

const Countries = ({ countries, onShowCountry }) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    } else if (countries.length === 1) {
        return <CountryDetails country={countries[0]} />
    } else {
        return (
            <div>
                {countries.map((country) => (
                    <div key={country.cca3}>
                        {country.name.common}
                        <button onClick={() => onShowCountry(country)}>show</button>
                    </div>
                ))}
            </div>
        )
    }
}

const App = () => {
    const [countries, setCountries] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (searchQuery) {
            axios
                .get(`https://restcountries.com/v3.1/name/${searchQuery}`)
                .then(response => setCountries(response.data))
        } else {
            setCountries([])
        }
    }, [searchQuery])

    const handleSearchChange = (event) => setSearchQuery(event.target.value)

    const handleShowCountry = (country) => setCountries([country])

    return (
        <div>
            find countries <input value={searchQuery} onChange={handleSearchChange} />
            <Countries countries={countries} onShowCountry={handleShowCountry} />
        </div>
    )
}

export default App