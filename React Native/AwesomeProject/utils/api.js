/**
 * Only ES6 =))))
 *
 * GET iD current location
 * Example ``RESPONSE``:
 * URi: " https://www.metaweather.com/api/location/search/?query=London "
 *
   [
      {
        "title": "London",
        "location_type": "City",
        "woeid": 44418,
        "latt_long": "51.506321,-0.12714"
      }
  ]
 *
 */
export const getLocationId = async city => {

  const response = await fetch(
    `https://www.metaweather.com/api/location/search/?query=${city}`,
  );

  const r = await response.json();

  return r[0].woeid;
};

export const getCurrent = async () => {

  const response = await fetch(
    `http://weather-flask-env.eba-37und6n8.us-east-2.elasticbeanstalk.com/`,
  );

  let { current_humid, current_temp, update_time } = await response.json();

  return {
    current_temp: current_temp,
    current_humid: current_humid,
    update_time: update_time
  };
};

export const getFuture = async () => {

  const response = await fetch(
    `http://weather-flask-env.eba-37und6n8.us-east-2.elasticbeanstalk.com/iot`
  );

  const r = await response.json();
  let { current, next } = r;

  return {
    current: current,
    next: next
  };
};
export const getPredict = async (temp, humid) => {

  const response = await fetch(
    `http://weather-flask-env.eba-37und6n8.us-east-2.elasticbeanstalk.com/iot/predict?temp=${temp}&humid=${humid}`
  );

  const r = await response.json();
  let { next_temp } = r;

  return {
    next_temp: next_temp
  };
};

/*
 * GEt WEATHER by current Location <<< iD  >>>
 * Example ``RESPONSE``:
 * URi: " https://www.metaweather.com/api/location/924938/ "
 *
  [
    {
      "consolidated_weather": [
      {
        "id": 5364180358004736,

        "weather_state_name": "Heavy Cloud", // << WEATHER

        "weather_state_abbr": "hc",
        "wind_direction_compass": "WSW",

        "created": "2018-08-21T06:09:14.113170Z", // << CREATED

        "applicable_date": "2018-08-21",
        "min_temp": 16.8,
        "max_temp": 27.63333333333333,

        "the_temp": 27.45, // << The TEMPERATURE

        "wind_speed": 4.406190471627032,
        "wind_direction": 246.7213559823457,
        "air_pressure": 1014.44,
        "humidity": 59,
        "visibility": 14.79546945836316,
        "predictability": 71
      },
      ...
  ]
 *
 */
export const getWeather = async woeid => {

  const response = await fetch(
    `https://www.metaweather.com/api/location/${woeid}/`
  );

  let { title, consolidated_weather } = await response.json();
  let { weather_state_name, the_temp, created } = consolidated_weather[0];

  return {
    location: title,
    weather: weather_state_name,
  };
};
