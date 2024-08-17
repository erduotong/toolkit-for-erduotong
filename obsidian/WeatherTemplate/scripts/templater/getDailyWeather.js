/**
 * @fileoverview get the weather data from the qweather api
 */

/**
 *
 * @param {*}   cation 地点的编号
 * @param {*} location_name 地点的名称
 * @param {*} date 日期，格式为YYYY-MM-DD 星期几 例如：2021-07-01 星期四 若为空则默认为当天
 */
async function getWeather(date = null) {
  const { Weather } = await cJS();
  let data = null;
  let location_name = null;

  data = await Weather.getWeather();
  location_name = `${Weather.location.country}, ${Weather.location.region}, ${Weather.location.city}`;

  let today_weather = data.daily[0];
  if (date !== null) {
    //指定日期
    date = date.split(" ")[0];
    let finded = false;
    for (let i = 0; i < data.daily.length; i++) {
      if (data.daily[i].fxDate === date) {
        today_weather = data.daily[i];
        finded = true;
        break;
      }
    }
    if (!finded) {
      return "未找到指定日期的天气数据" + date + "请检查下或者明天再来看看吧~";
    }
  }

  const uvIndex = [
    { min: 0, max: 2, level: "低", desc: "无需特别防护喵 😺" },
    { min: 3, max: 5, level: "中等", desc: "来点防晒霜吧喵~ 🧴" },
    { min: 6, max: 7, level: "高", desc: "记得在荫凉的环境中走喵~ 🌳" },
    { min: 8, max: 10, level: "很高", desc: "别去沙滩上浪了喵 🏖️" },
    {
      min: 11,
      max: Infinity,
      level: "极高",
      desc: "尽量避免外出吧喵~ 🚫",
    },
  ];
  let allday_weather = "";
  let day_weather = "";
  let night_weather = "";
  allday_weather += `${today_weather.tempMin}°C ~ ${today_weather.tempMax}°C 🌡️ `;
  allday_weather += `降雨量: ${today_weather.precip}mm 🌧️ 湿度: ${today_weather.humidity}% 💧 `;
  for (let i = 0; i < uvIndex.length; i++) {
    if (
      today_weather.uvIndex >= uvIndex[i].min &&
      today_weather.uvIndex <= uvIndex[i].max
    ) {
      allday_weather += `\n        紫外线指数: ${today_weather.uvIndex} ${uvIndex[i].level} ${uvIndex[i].desc} ☀️`;
      break;
    }
  }
  day_weather += `${today_weather.textDay} ${Weather.iconToEmoji.weather(
    today_weather.textDay
  )} `;
  day_weather += `风速: ${today_weather.windSpeedDay}km/h 💨 ${today_weather.windScaleDay}级 ${today_weather.windDirDay} `;
  day_weather += `日出: ${today_weather.sunrise} 🌅 日落: ${today_weather.sunset} 🌇`;
  night_weather += `${today_weather.textNight} ${Weather.iconToEmoji.weather(
    today_weather.textNight
  )} `;
  night_weather += `风速: ${today_weather.windSpeedNight}km/h 💨 ${today_weather.windScaleNight}级 ${today_weather.windDirNight} `;
  night_weather += `${today_weather.moonPhase} ${Weather.iconToEmoji.moonPhaser(
    today_weather.moonPhase
  )}`;
  return `${location_name}的天气~\n    - ${allday_weather}\n    - ☀️日间: ${day_weather}\n    - 🌙夜晚: ${night_weather}`;
}
module.exports = getWeather;
