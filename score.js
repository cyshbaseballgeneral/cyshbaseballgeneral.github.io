function showTab(tab) {
    // 隱藏所有tab
    document.querySelectorAll('.tab-cont').forEach(function(tabCont) {
        tabCont.classList.remove('active');
    });

    // 顯示選擇的tab
    document.getElementById(tab).classList.add('active');
}

function changePitcherStat(stat) {
    const pitcherData = {
        "防禦率": [
            { rank: 1, name: "王建民", team: "中信兄弟", stat: "2.10" },
            { rank: 2, name: "李安可", team: "統一獅", stat: "2.25" },
            { rank: 3, name: "陳韻文", team: "樂天桃猿", stat: "2.30" }
        ],
        "勝投": [
            { rank: 1, name: "林祖傑", team: "中信兄弟", stat: "15" },
            { rank: 2, name: "張志豪", team: "統一獅", stat: "14" },
            { rank: 3, name: "林立", team: "樂天桃猿", stat: "13" }
        ],
        // Add other statistics here...
    };

    const pitcherStat = pitcherData[stat] || [];

    let html = '<ul>';
    pitcherStat.forEach(function(player) {
        html += `<li>
                    <div class="rank">${player.rank}</div>
                    <div class="player">${player.name} (${player.team})</div>
                    <div class="num">${player.stat}</div>
                </li>`;
    });
    html += '</ul>';

    document.getElementById('pitcher-stat').innerHTML = html;
}

function changeBatterStat(stat) {
    const batterData = {
        "打擊率": [
            { rank: 1, name: "陳子豪", team: "中信兄弟", stat: "0.330" },
            { rank: 2, name: "林安可", team: "統一獅", stat: "0.315" },
            { rank: 3, name: "林立", team: "樂天桃猿", stat: "0.310" }
        ],
        "安打": [
            { rank: 1, name: "陳子豪", team: "中信兄弟", stat: "150" },
            { rank: 2, name: "林安可", team: "統一獅", stat: "145" },
            { rank: 3, name: "陳傑憲", team: "統一獅", stat: "140" }
        ],
        // Add other statistics here...
    };

    const batterStat = batterData[stat] || [];

    let html = '<ul>';
    batterStat.forEach(function(player) {
        html += `<li>
                    <div class="rank">${player.rank}</div>
                    <div class="player">${player.name} (${player.team})</div>
                    <div class="num">${player.stat}</div>
                </li>`;
    });
    html += '</ul>';

    document.getElementById('batter-stat').innerHTML = html;
}

// 初始化顯示投手的防禦率
showTab('pitcher');
changePitcherStat('防禦率');
