/**
 * @fileoverview 为dataview提供视图数据
 */
const { Weather } = await cJS();
async function weatherView() {
  const weather = await formatWeather();
  const location_name = `位于${Weather.location.country}的${Weather.location.region}${Weather.location.city}市`;
  if (weather.status === "error") {
    dv.paragraph("天气获取失败");
    dv.paragraph(weather.message);
    return;
  }
  // today Description
  const today_weather = weather.message[0];
  dv.el(
    "blockquote",
    `${location_name}今天的天气是 ${today_weather.dayWeather}的模样，${today_weather.temp}\n` +
      `天空被 ${today_weather.cloud} 的云朵所充盈，降水量达${today_weather.precip}\n` +
      `倘若看到月亮，它现在处于${today_weather.moonPhase}`
  );
  // Future Description
  dv.paragraph(`${location_name}未来${Weather.weather_length}天的天气情况如下：`);
  dv.table(
    ["日期", "天气", "温度", "风向", "湿度"],
    weather.message.map((t) => [
      t.date,
      t.dayWeather,
      t.temp,
      t.wind,
      t.humidity + "💧",
    ])
  );
}

async function formatWeather() {
  let data = null;

  try {
    data = await Weather.getWeather();
  } catch (e) {
    return {
      status: "error",
      message: e,
    };
  }

  // formatter
  const weather = data.daily;
  let result = [];
  //处理天气
  for (let i = 0; i < weather.length; i++) {
    const weatherItem = weather[i];
    const date = weatherItem.fxDate.split("-").slice(1).join("-"); //去掉年份
    const dayWeather = `${Weather.iconToEmoji.weather(weatherItem.textDay)}${
      weatherItem.textDay
    }`;
    const temp = `${weatherItem.tempMin}~${weatherItem.tempMax}℃`;
    const wind = `${weatherItem.windDirDay} ${weatherItem.windScaleDay}级`;
    const humidity = `${weatherItem.humidity}%`;
    const moonPhase = `${Weather.iconToEmoji.moonPhaser(
      weatherItem.moonPhase
    )}${weatherItem.moonPhase}`;
    const precip = `${weatherItem.precip}mm`;
    const cloud =
      weatherItem.cloud !== undefined ? `${weatherItem.cloud}%` : "0%";
    result.push({
      date,
      dayWeather,
      temp,
      wind,
      humidity,
      moonPhase,
      precip,
      cloud,
    });
  }
  return {
    status: "success",
    message: result,
  };
}
weatherView();
