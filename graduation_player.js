const API_URL = "https://script.google.com/macros/s/AKfycbwI71FiWoRXfU-SH2okkLQpydXZXkgO7rpvkeBu9dDw/dev";

document.addEventListener("DOMContentLoaded", () => {

  // 建立下拉選單
  const selectDiv = document.querySelector(".custom-select");
  const selected = selectDiv.querySelector(".selected");
  const optionsContainer = selectDiv.querySelector(".options");
  const listContainer = document.getElementById("playerList");

  let allData = [];
  let currentYear = "ALL";

  // JSONP 載入
  function loadJSONP(url, callbackName) {
    const script = document.createElement("script");
    script.src = `${url}&callback=${callbackName}`;
    script.async = true;  // 強制 async，兼容 iOS
    document.body.appendChild(script);
    // script 加載後自動執行 callback
  }

  // 渲染球員
  function renderPlayers(year) {
    listContainer.innerHTML = "";
    const filtered = year === "ALL" ? allData : allData.filter(p => p['畢業年度'] === year);
    filtered.forEach(player => {
      const div = document.createElement("div");
      div.className = "player";
      div.innerHTML = `
        <div class="name-year">${player['姓名']} &nbsp;&nbsp; 畢業年度：${player['畢業年度']}</div>
        <div>最高學歷：${player['最高學歷']}</div>
        <div>目前任職：${player['目前任職']}</div>
        <div>所屬球隊：${player['所屬球隊']}</div>
      `;
      listContainer.appendChild(div);
    });
  }

  // 建立下拉選單
  function createSelect(years) {
    optionsContainer.innerHTML = "";
    years.forEach(y => {
      const li = document.createElement("li");
      li.textContent = y;
      li.addEventListener("click", (e) => {
        currentYear = y;
        selected.textContent = y;
        optionsContainer.style.display = "none";
        renderPlayers(currentYear);
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

  // JSONP callback
  window.getYearsCallback = function(data){
    allData = data;
    const years = ["ALL", ...new Set(data.map(d => d['畢業年度']))].sort((a,b)=>b-a);
    createSelect(years);
    renderPlayers("ALL");
  }

  // 初始載入
  loadJSONP(`${API_URL}?year=ALL`, "getYearsCallback");

});
