let logoBlock = document.querySelector('.logo');

logoBlock.addEventListener('mouseover', e => {
    logoBlock.style.backgroundColor = "#1B335C";
    logoBlock.style.animationDuration = "0.5s";
    logoBlock.style.animationName = "hover";
    logoBlock.addEventListener('mouseout', e => {
        logoBlock.style.backgroundColor = "#0F1D35";
        logoBlock.style.animationDuration = "0.5s";
        logoBlock.style.animationName = "out";
    });
});