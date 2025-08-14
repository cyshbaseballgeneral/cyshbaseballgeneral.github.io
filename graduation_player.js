const API_URL = "https://script.google.com/macros/s/AKfycbwI71FiWoRXfU-SH2okkLQpydXZXkgO7rpvkeBu9dDw/dev";

// JSONP 載入資料
function loadJSONP(url, callbackName) {
  const script = document.createElement('script');
  script.src = `${url}&callback=${callbackName}`;
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
      e.stopPropagation();
      selected.textContent = year;
      optionsContainer.style.display = "none";
      loadPlayers(year);
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

// 取得年份 callback
function getYearsCallback(data) {
  let years = [...new Set(data.map(d => d['畢業年度']))].sort((a,b)=>b-a);
  years.unshift("ALL");
  createCustomSelect(years);
  loadPlayers("ALL");
}

// 載入球員 callback
function loadPlayers(year) {
  const callbackName = 'loadPlayersCallback';
  window[callbackName] = function(data) {
    const list = document.getElementById("playerList");
    list.innerHTML = "";
    data.forEach(player => {
      if (year !== "ALL" && player['畢業年度'] !== year) return;
      const div = document.createElement("div");
      div.className = "player";
      div.innerHTML = `
        <div class="name-year">${player['姓名']} &nbsp;&nbsp; 畢業年度：${player['畢業年度']}</div>
        <div>最高學歷：${player['最高學歷']}</div>
        <div>目前任職：${player['目前任職']}</div>
        <div>所屬球隊：${player['所屬球隊']}</div>
      `;
      list.appendChild(div);
    });
  };
  loadJSONP(`${API_URL}?year=${year}`, callbackName);
}

// 初始呼叫
document.addEventListener("DOMContentLoaded", function() {
  loadJSONP(`${API_URL}?year=ALL`, 'getYearsCallback');
});
