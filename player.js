const apiUrl = 'https://script.google.com/macros/s/AKfycbwInTcnlQ3jRC2XK5z4SgPvCdRz33Q8-EAlF33IbMx7RilpBfoDt-9vmohW4T9Lge_H/exec';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const playerList = document.getElementById('player-list');
    data.forEach(player => {
      const playerCard = document.createElement('div');
      playerCard.classList.add('player-card');


     
      playerCard.innerHTML = `
        <div class="player-photo">
          <img src="img/players/${player.大頭照路徑}" alt="球員照片">
        </div>
        <div class="player-info">
          <div><strong>${player.職位 ? `${player.職位}&nbsp;&nbsp;&nbsp;&nbsp;` : ''}${player.姓名}</strong></div>
          <div>守備位置：${player.守備位置}</div>
          <div>投打習慣：${player.投打習慣}</div>
          <div>年級：${player.年級}</div>
          <div class="extra-info">
            <div>畢業國中：${player.畢業國中}</div>
            <div>最快球速：${player.最快球速} km/h</div>
            <div>最快打擊初速：${player.打擊初速} km/h</div>
            <div>身高/體重：${player.身高}cm/${player.體重}kg</div>
            <div>出生日期：${player.出生日期}</div>
          </div>
        </div>
        <div class="jersey-number">${player.背號}</div>
        <button class="dropdown">更多資訊▼</button>
      `;

      const button = playerCard.querySelector('.dropdown');
      button.addEventListener('click', () => {
        playerCard.classList.toggle('expanded');
        button.textContent = playerCard.classList.contains('expanded') ? '收起▲' : '更多資訊▼';
      });

      playerList.appendChild(playerCard);
    });
  })
  .catch(error => {
    console.error('Error fetching player data:', error);
  });
