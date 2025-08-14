document.addEventListener("DOMContentLoaded", function() {
  const API_URL = "https://script.google.com/macros/s/AKfycbz9FzxFUNTaS12U28_ct41cQt1FVgrE1fexd16oT4rWicX0nXH8kKumL5V4X7TuWR2fQg/exec";
  let allPlayers = [];
  let selectedYear = "ALL";

  const yearDropdown = document.querySelector(".custom-select");
  const selectedDiv = yearDropdown.querySelector(".selected");
  const list = yearDropdown.querySelector(".options");

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allPlayers = data;
      initDropdown();
      renderPlayers();
    })
    .catch(err => console.error("資料載入失敗:", err));

  function initDropdown() {
    const years = ["ALL", ...new Set(allPlayers.map(p => p["畢業年度"]).filter(y => y))];

    years.forEach(year => {
      const li = document.createElement("li");
      li.textContent = year;
      li.addEventListener("click", e => {
        selectedYear = year;
        selectedDiv.innerHTML = year + ' <span class="arrow">▼</span>';
        list.style.display = "none";
        selectedDiv.classList.remove("active");
        renderPlayers();
        e.stopPropagation();
      });
      list.appendChild(li);
    });

    selectedDiv.addEventListener("click", e => {
      e.stopPropagation();
      list.style.display = list.style.display === "block" ? "none" : "block";
      selectedDiv.classList.toggle("active", list.style.display === "block");
    });

    document.addEventListener("click", () => {
      list.style.display = "none";
      selectedDiv.classList.remove("active");
    });
  }

  function renderPlayers() {
    const container = document.getElementById("playerList");
    container.innerHTML = "";

    allPlayers.forEach(player => {
      if (selectedYear === "ALL" || player["畢業年度"] === selectedYear) {
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
