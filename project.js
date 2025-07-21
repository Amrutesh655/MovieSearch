let count = 0;
document.getElementById('clickbtn').addEventListener('click', () => {
    count++;
    document.getElementById('count').textContent = count;
});