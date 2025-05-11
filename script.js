document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".news-slider");
    const items = document.querySelectorAll(".news-item");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let index = 0;
    let itemWidth = document.querySelector(".news-wrapper").getBoundingClientRect().width; 

    window.addEventListener("resize", function () {
        itemWidth = document.querySelector(".news-wrapper").getBoundingClientRect().width;
        updateSlider();
    });

    nextBtn.addEventListener("click", function () {
        index = (index + 1) % items.length;  
        updateSlider();
    });

    prevBtn.addEventListener("click", function () {
        index = (index - 1 + items.length) % items.length; 
        updateSlider();
    });

    function updateSlider() {
        slider.style.transition = "transform 0.5s ease-in-out"; 
        slider.style.transform = `translateX(-${index * itemWidth}px)`;  
    }
});

const apiUrl = 'https://script.google.com/macros/s/AKfycbwInTcnlQ3jRC2XK5z4SgPvCdRz33Q8-EAlF33IbMx7RilpBfoDt-9vmohW4T9Lge_H/exec';

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const players = data; 
        const container = document.getElementById('players-container');

        players.forEach(player => {
          if (player.職位 && player.職位.trim() !== '') {
            const card = document.createElement('div');
            card.className = 'player-card';

            card.innerHTML = `
              <img src="img/players/${player.大頭照路徑}" alt="${player.姓名}">
              <h3>${player.職位}<br>${player.姓名}</h3>
            `;
            container.appendChild(card);
          }
        });
      })
      .catch(error => {
        console.error('撈取資料失敗:', error);
      });
