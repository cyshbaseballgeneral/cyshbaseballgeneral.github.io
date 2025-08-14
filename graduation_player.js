const API_URL = "https://script.google.com/macros/s/AKfycbwI71FiWoRXfU-SH2okkLQpydXZXkgO7rpvkeBu9dDw/dev";

// JSONP 載入資料
function loadJSONP(url, callbackName) {
  const script = document.createElement('script');
  // 避免快取，加隨機參數
  script.src = `${url}&callback=${callbackName}&_=${Date.now()}`;
  script.onerror = () => {
    console.error("JSONP 載入失敗");
  };
  document.body.appendChild(script);
}

// 自訂下拉選單
function createCustomSelect(years) {
  const selectDiv = document.querySelector(".custom-select");
  const selected = selectDiv.querySelector(".selected");
  const optionsContainer = selectDiv.querySelector(".options");

  optionsContainer.innerHTML = "";
  years.forEach(year => {
    const li = document.createElement("li");
    li.textContent = year;
    li.addEventListener("click", (e) => {
      selected.textContent = year;
      optionsContainer.style.display = "none";
      loadPlayers(year);
      e.stopPropagation();
    });
    optionsContainer.appendChild(li);
  });

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    optionsContainer.style.display = "none";
  });
}

// 從 Google Sheets 取得年份
function getYearsCallback(data) {
  if (!data || !data.map) return console.error("資料格式錯誤");
  let years = [...new Set(data.map(d => d['畢業年度']))].sort((a,b)=>b-a);
  years.unshift("ALL");
  createCustomSelect(years);
  loadPlayers("ALL");
}

// 載入球員卡片
function loadPlayers(year) {
  const callbackName = 'loadPlayersCallback';
  window[callbackName] = function(data) {
    if (!data) return console.error("資料格式錯誤");
    const list = document.getElementById("playerList");
    list.innerHTML = "";

    data.forEach(player => {
      if (!year || year === "ALL" || player['畢業年度'] === year) {
        const div = document.createElement("div");
        div.className = "player";
        div.innerHTML = `
          <div class="name-year">${player['姓名']} &nbsp;&nbsp; 畢業年度：${player['畢業年度']}</div>
          <div>最高學歷：${player['最高學歷']}</div>
          <div>目前任職：${player['目前任職']}</div>
          <div>所屬球隊：${player['所屬球隊']}</div>
        `;
        list.appendChild(div);
      }
    });
  };
  loadJSONP(`${API_URL}?year=${year}`, callbackName);
}

// 初始呼叫
document.addEventListener("DOMContentLoaded", function() {
  loadJSONP(`${API_URL}?year=ALL`, 'getYearsCallback');
});
