document.addEventListener("DOMContentLoaded", function() {
  const apiUrl = "https://script.google.com/macros/s/AKfycbxa3CQmWsttZemnoefMh1bFX3B0qx9uWNgCaw6zcaL69sf8Fe-MOjehP_NqDXbWsxjMDA/exec";
  let allData = [];
  let selectedYear = "ALL";
  let selectedType = "ALL";

  const yearDropdown = document.getElementById("yearDropdown");
  const selectedDiv = yearDropdown.querySelector(".dropdown-selected");
  const list = yearDropdown.querySelector(".dropdown-list");

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      allData = data;
      initDropdown();
      renderData();
    })
    .catch(err => console.error("撈取資料失敗:", err));

  function initDropdown() {
    const years = ["ALL", ...new Set(allData.map(r => r["學年度"]).filter(y => y))];

    years.forEach(year => {
      const li = document.createElement("li");
      li.textContent = year;

      if (year !== "ALL") {
        // 建立子選單
        const types = ["ALL", ...new Set(allData.filter(r => r["學年度"] === year).map(r => r["比賽類型"]).filter(t => t))];
        const subUl = document.createElement("ul");
        subUl.className = "submenu";
        subUl.style.display = "none"; // 初始隱藏
        li.dataset.open = "false"; // 手機板控制

        types.forEach(type => {
          const typeLi = document.createElement("li");
          typeLi.textContent = type;
          typeLi.addEventListener("click", e => {
            selectedYear = year;
            selectedType = type;
            selectedDiv.innerHTML = year + (type !== "ALL" ? ` / ${type}` : "") + ' <span class="arrow">▼</span>';
            list.style.display = "none";
            subUl.style.display = "none";
            li.dataset.open = "false";
            selectedDiv.classList.remove("active");
            renderData();
            e.stopPropagation();
          });
          subUl.appendChild(typeLi);
        });
        li.appendChild(subUl);

        // 電腦版 hover 右展
        li.addEventListener("mouseenter", () => {
          if (window.innerWidth > 768) {
            subUl.style.display = "block";
            // 對齊父項高度
            //subUl.style.top = li.offsetTop + "px";
            subUl.style.top = "0"; // 保證貼齊父項
          }
        });
        li.addEventListener("mouseleave", () => {
          if (window.innerWidth > 768) {
            subUl.style.display = "none";
          }
        });

        // 手機板點擊展開/收回
        li.addEventListener("click", e => {
          if (window.innerWidth <= 768) {
            const isOpen = li.dataset.open === "true";
            subUl.style.display = isOpen ? "none" : "block";
            li.dataset.open = isOpen ? "false" : "true";
            e.stopPropagation();
          }
        });

      } else {
        li.addEventListener("click", () => {
          selectedYear = "ALL";
          selectedType = "ALL";
          selectedDiv.innerHTML = `ALL <span class="arrow">▼</span>`;
          list.style.display = "none";
          selectedDiv.classList.remove("active");
          renderData();
        });
      }

      list.appendChild(li);
    });

    selectedDiv.addEventListener("click", () => {
      list.style.width = selectedDiv.offsetWidth + "px";
      const isOpen = list.style.display === "block";
      list.style.display = isOpen ? "none" : "block";
      selectedDiv.classList.toggle("active", !isOpen);
    });

    document.addEventListener("click", e => {
      if (!yearDropdown.contains(e.target)) {
        list.style.display = "none";
        selectedDiv.classList.remove("active");
        document.querySelectorAll(".submenu").forEach(sub => sub.style.display = "none");
        document.querySelectorAll('[data-open]').forEach(li => li.dataset.open = "false");
      }
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  function renderData() {
    const container = document.getElementById("dataContainer");
    container.innerHTML = "";

    let filtered = allData;
    if (selectedYear !== "ALL") filtered = filtered.filter(r => r["學年度"] === selectedYear);
    if (selectedType !== "ALL") filtered = filtered.filter(r => r["比賽類型"] === selectedType);

    const grouped = {};
    filtered.forEach(r => {
      const type = r["比賽類型"] || "其他";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(r);
    });

    Object.keys(grouped).forEach(type => {
      const block = document.createElement("div");
      block.className = "block";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = type;
      block.appendChild(title);

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>勝敗</th><th>客隊</th><th>主隊</th><th>客隊得分</th><th>主隊得分</th><th>比賽日期</th><th>比賽種類</th></tr>";
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      grouped[type].sort((a,b) => new Date(b["比賽日期"]) - new Date(a["比賽日期"]));

      let winCount = 0;
      let loseCount = 0;

      grouped[type].forEach(r => {
        if (r["客隊"] && r["主隊"]) {
            const tr = document.createElement("tr");

            const tdResult = document.createElement("td");
            tdResult.textContent = r["比賽結果"] || "";
            if (r["比賽結果"] === "勝") tdResult.classList.add("win");
            if (r["比賽結果"] === "敗") tdResult.classList.add("lose");
            tr.appendChild(tdResult);

            const keys = ["客隊", "主隊", "客隊得分", "主隊得分", "比賽日期", "比賽種類"];
            keys.forEach(key => {
                const td = document.createElement("td");
                td.textContent = key === "比賽日期" ? formatDate(r[key]) : (r[key] !== undefined && r[key] !== null ? r[key] : "");
                tr.appendChild(td);
            });

            tbody.appendChild(tr);

            if (r["比賽結果"] === "勝") winCount++;
            if (r["比賽結果"] === "敗") loseCount++;
        }
    });

      table.appendChild(tbody);
      block.appendChild(table);

      const rankingRow = grouped[type].find(r => r["排名"]);
      const summaryDiv = document.createElement("div");
      summaryDiv.className = "summary";
      summaryDiv.innerHTML = `
      <span class="record">${winCount}勝 ${loseCount}敗</span>
      <span class="ranking">${rankingRow && rankingRow["排名"] ? "排名：" + rankingRow["排名"] : ""}</span>
      `;
      block.appendChild(summaryDiv);
      container.appendChild(block);
    });
  }
});
