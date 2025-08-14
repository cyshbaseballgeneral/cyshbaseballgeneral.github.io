document.addEventListener("DOMContentLoaded", function() {
  const API_URL = "https://script.google.com/macros/s/AKfycbww5s1YMFeSpkf63EneZwn2EYCvTkh78goz3w47A6QaIGRp2vML4wKg82QUQro9cEi42w/exec";
  let allData = [];

  // 取得球員資料
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allData = data;
      initYearSelect();
      renderPlayers("ALL");
    })
    .catch(err => console.error("資料載入失敗:", err));

  // 初始化下拉選單
  function initYearSelect() {
    const selectDiv = document.querySelector(".custom-select");
    const selected = selectDiv.querySelector(".selected");
    const optionsContainer = selectDiv.querySelector(".options");

    // 取得所有年份
    const years = [...new Set(allData.map(p => p["畢業年度"]))].sort((a,b) => b-a);
    years.unshift("ALL");

    optionsContainer.innerHTML = "";
    years.forEach(year => {
      const li = document.createElement("li");
      li.textContent = year;
      li.addEventListener("click", (e) => {
        selected.textContent = year;
        optionsContainer.style.display = "none";
        renderPlayers(year);
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

  // 渲染球員卡片
  function renderPlayers(year) {
    const container = document.getElementById("playerList");
    container.innerHTML = "";

    allData.forEach(player => {
      if (year === "ALL" || player["畢業年度"] === year) {
        const div = document.createElement("div");
        div.className = "player";
        div.innerHTML = `
          <div class="name-year">${player['姓名']} &nbsp;&nbsp; 畢業年度：${player['畢業年度']}</div>
          <div>最高學歷：${player['最高學歷']}</div>
          <div>目前任職：${player['目前任職']}</div>
          <div>所屬球隊：${player['所屬球隊']}</div>
        `;
        container.appendChild(div);
      }
    });
  }
});
