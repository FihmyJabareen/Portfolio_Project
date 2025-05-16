async function getWeather() {
    const city = document.getElementById('city').value;
    const result = document.getElementById('result');
    const apiKey = '78cd4ea05cc44e28a47232129251505';

    result.innerHTML = "טוען נתונים...";

    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=he`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("שגיאה בנתונים");
        const data = await res.json();

        result.innerHTML = `
        <img class="weather-icon" src="https:${data.current.condition.icon}" alt="">
        <div class="temp">${data.current.temp_c}°</div>
        <div class="desc">${data.current.condition.text}</div>
        <div class="details">
          לחות: ${data.current.humidity}%<br>
          רוח: ${data.current.wind_kph} קמ"ש
        </div>
      `;
    } catch (err) {
        result.innerHTML = "אירעה שגיאה. נסה שוב.";
        console.error("שגיאה:", err);
    }
}