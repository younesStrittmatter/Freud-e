console.log('running commons')
fetch('./assets/htmlAssets/head.html')
    .then(res => res.text())
    .then(data => {
        document.head.innerHTML += data;
    })

fetch('./assets/htmlAssets/navbar.html')
    .then(res => res.text())
    .then(data => {
        document.body.innerHTML = data + document.body.innerHTML;
    })
fetch('./assets/htmlAssets/background.html')
    .then(res => res.text())
    .then(data => {
        let div = document.getElementsByClassName('page-container')[0];
        div.innerHTML = data + div.innerHTML;

    })
    .then(() => {
        const resizeBackground = function () {
            let divs = document.getElementsByClassName('gradient');
            let h = document.body.clientHeight;
            for (let i = 0; i < divs.length; i++) {
                divs[i].style.height = h + 'px'
            }
        }
        window.addEventListener('resize', resizeBackground, false)
        window.addEventListener('load', resizeBackground, false)
    })
fetch('./assets/htmlAssets/footer.html')
    .then(res => res.text())
    .then(data => {
        document.body.innerHTML += data;
    })


fetch('./assets/htmlAssets/title.html')
    .then(res => res.text())
    .then(data => {
        let div = document.getElementsByClassName('page-container')[0];
        div.innerHTML = data + div.innerHTML;
    })
