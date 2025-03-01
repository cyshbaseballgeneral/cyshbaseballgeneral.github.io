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
