/**
 * @fileoverview 天气处理
 * @author erduotong
 */
/**
 * 外部可以在访问getLocation后直接访问location属性获取位置信息
 * 外部可以直接getWeather获取天气信息，参数为locationID，若不传则使用当前位置，返回值为天气信息
 * 请不要直接访问weather属性
 */
class Weather {
  weather_key = "????????"; //你的和风天气key
  weather_length = 7; //请求未来多少天的天气
  weather_max_save = 10; //最多保存多少个地点的天气信息
  weather_dealy_time = 1000; //保存天气信息的延迟时间，单位为毫秒
  location_timeout_time = 360; //位置信息超时时间，单位为秒
  weather_timeout_time = 60; //天气信息超时时间，单位为分钟
  data_dir = "/Obsidian/scriptsData/weather.json"; //天气信息存储路径 必须存在
  ///////////////////////////////////////////
  constructor() {
    this.location = {
      get_time: undefined,
      country: undefined,
      region: undefined,
      city: undefined,
      lat: undefined,
      lon: undefined,
    };
    this.weather = {};
    //锁
    this.locks = {
      weather: Promise.resolve(),
    };
    this.storageWeatherTimeout = null; //存储天气信息的定时器 做防抖
    this.weatherPromise = this.weatherPromise = (async () => {
      try {
        const exist = await app.vault.adapter.exists(this.data_dir);
        if (exist) {
          try {
            const data = await app.vault.adapter.read(this.data_dir);
            //读取天气信息
            const weatherData = JSON.parse(data);
            //遍历weatherData中的每一项，将其get_time转换为Date对象
            for (const key in weatherData) {
              weatherData[key].get_time = new Date(weatherData[key].get_time);
            }
            this.weather = weatherData;
          } catch (error) {
            console.log("Weather Module:", `读取天气信息失败:${error}`);
          }
        } else {
          console.log(
            "Weather Module:",
            "天气信息存储文件不存在，将会自动创建"
          );
          await app.vault.adapter.write(this.data_dir, "{}");
        }
      } catch (error) {
        console.log("Weather Module:", `检查目录存在性失败:${error}`);
      }
    })();
  }

  iconToEmoji = {
    moonPhaser: (phase) => {
      const phaseToEmoji = {
        新月: "🌑",
        蛾眉月: "🌒",
        上弦月: "🌓",
        盈凸月: "🌔",
        满月: "🌕",
        亏凸月: "🌖",
        下弦月: "🌗",
        残月: "🌘",
      };
      return phaseToEmoji[phase] || "undefined moon phase!";
    },
    weather: (weather) => {
      const weatherToEmoji = {
        晴: "🌞",
        阵雨: "🌦️",
        雷阵雨: "⛈️",
        多云: "🌥️",
        小雨: "🌧️",
        中雨: "🌧️",
        大雨: "🌧️",
        暴雨: "🌧️",
        大到暴雨: "🌧️",
        阴: "☁️",
      };
      return weatherToEmoji[weather] || "undefined weather!!!!!!!!";
    },
  };

  getLocation = async () => {
    //获取位置信息
    //位置信息调用api不需要什么价钱，所以不用锁+本地缓存
    const date = new Date();
    if (
      this.location.get_time &&
      Math.floor((date - this.location.get_time) / 1000) <
        this.location_timeout_time
    ) {
      return;
    }
    const url = "http://ip-api.com/json/?lang=zh-CN";
    console.log("Weather Module:", "getting location");
    const res = await fetch(new URL(url), { method: "GET" });
    const data = await res.json();
    if (data.status != "success") {
      throw new Error("获取位置信息失败" + JSON.stringify(data));
    }
    this.location.country = data.country;
    this.location.region = data.regionName;
    this.location.city = data.city;
    this.location.lat = data.lat;
    this.location.lon = data.lon;
    this.location.get_time = date;
  };
  _storageWeather = async () => {
    if (this.storageWeatherTimeout) {
      clearTimeout(this.storageWeatherTimeout);
    }
    this.storageWeatherTimeout = setTimeout(async () => {
      const weatherArray = Object.entries(this.weather).sort((a, b) => {
        const dateA = a[1].get_time;
        const dateB = b[1].get_time;
        return dateB.getTime() - dateA.getTime();
      });
      const topWeather = weatherArray.slice(0, this.weather_max_save);
      const storage_data = Object.fromEntries(topWeather);
      console.log("Weather Module:", "saving weather");
      await app.vault.adapter.write(
        this.data_dir,
        JSON.stringify(storage_data)
      );
    }, this.weather_dealy_time);
  };
  getWeather = async (location = null) => {
    await this.locks.weather; //等待上一个请求完成
    await this.weatherPromise; //等待天气信息读取完成
    const date = new Date();
    if (!location) {
      await this.getLocation(); //刷新一下 反正请求不到API头上
    }

    // 若location为null，则使用当前位置，否则使用location（为LocationID）
    location =
      location ||
      `${parseFloat(this.location.lon).toFixed(2)},${parseFloat(
        this.location.lat
      ).toFixed(2)}`;
    const storaged = this.weather[location];


    if (
      storaged !== undefined &&
      Math.floor((date - storaged.get_time) / 1000) <
        this.weather_timeout_time * 60
    ) {
      //请求过的数据，且未超时，就直接返回
      this.locks.weather = Promise.resolve();
      return storaged.data;
    }
    const url = `https://devapi.qweather.com/v7/weather/${this.weather_length}d?key=${this.weather_key}&location=${location}`;
    const res = await fetch(new URL(url), { method: "GET" });
    console.log("Weather Module:","getting weather");
    const data = await res.json();
    if (data.code != "200") {
      throw new Error("获取天气信息失败" + JSON.stringify(data));
    }
    this.weather[location] = {
      get_time: date,
      data: data,
    };
    await this._storageWeather();
    this.locks.weather = Promise.resolve();
    return data;
  };
}
