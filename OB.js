// 1. 歷史比賽資料
const historyUrl = 'https://script.google.com/macros/s/AKfycbxa3CQmWsttZemnoefMh1bFX3B0qx9uWNgCaw6zcaL69sf8Fe-MOjehP_NqDXbWsxjMDA/exec';

// 2. 下一場比賽日期（JSONP）
const nextOBUrl = 'https://script.google.com/macros/s/AKfycbxSpSF9cPXF34yzZsD0wnrFFeZbHHuWBX_E6eQ_zXAbf08-C13r8Ftn6Hka1XJB3Z6Z9w/exec';

// -----------------------
// 讀取歷史比賽資料
fetch(historyUrl)
  .then(res => res.json())
  .then(data => {
    const obData = data.filter(item => item['比賽類型'] === 'OB賽');
    obData.sort((a, b) => new Date(b['比賽日期']) - new Date(a['比賽日期']));

    const tbody = document.querySelector('#obTable tbody');
    obData.forEach(item => {
      const row = document.createElement('tr');
      const fields = ['比賽日期','比賽結果','客隊','主隊','客隊得分','主隊得分'];
      fields.forEach(key => {
        const td = document.createElement('td');
        if(key === '比賽日期' && item[key]) {
          td.textContent = item[key].substring(0,10); // 只取日期
        } else {
          td.textContent = item[key] || '';
        }
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error('讀取歷史比賽資料失敗', err));

// -----------------------
// 讀取下一場比賽日期（JSONP）
function loadNextOB() {
  const script = document.createElement('script');
  script.src = nextOBUrl + '?callback=handleNextOB';
  document.body.appendChild(script);
}

// JSONP 回呼函式
function handleNextOB(data) {
  if (!data || !data.nextOBDate) {
    console.error('下一場OB賽資料不存在');
    return;
  }

  const nextMatch = new Date(data.nextOBDate);

  // 顯示下一場比賽日期
  const nextDateEl = document.getElementById('nextDate');
  nextDateEl.textContent = `下一場OB賽日期: ${nextMatch.getFullYear()}-${(nextMatch.getMonth()+1).toString().padStart(2,'0')}-${nextMatch.getDate().toString().padStart(2,'0')}`;

  // 啟動倒數計時
  startCountdown(nextMatch);
}

// 啟動 JSONP 載入
loadNextOB();

// 倒數計時函式
function startCountdown(targetDate) {
  const countdownEl = document.getElementById('countdown');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownEl.textContent = "下一場OB賽已開始！";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `距離下一場還有: ${days}天 ${hours}小時 ${minutes}分 ${seconds}秒`;
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}
