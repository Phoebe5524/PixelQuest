// 1. Get all the ralative dom elements to use for rendering
// 2. Fetch pictures
// 3. render them

let objs = {
    body: null,
    inputCity: null,
    bthSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext: null,
    page: {
        cursor: 1,
        total: 1
    }
}
const unplashKey = `LA5gOJvtLE2ZOBEaQk-FCyLuiip-p3Buzht3Frpw-Ww`
const strClassSelected = 'selected'

objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.bthSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallary')
objs.btnPrev = document.querySelector('.btnNav.Prev')
objs.btnNext = document.querySelector('.btnNav.Next')


const cbInput = function (evt) {
    const inputValue = evt.target.value.trim().toLowerCase();
    if(evt.key === 'Enter' && inputValue.length) {
        fetchData()
    }
}
// objs.inputCity.addEventListener('keyup', cbInput)

const setKeyEvent = function () {

    //todo: add more key event setup
    objs.body.addEventListener('keyup', (evt) => {
        if (evt.key === 'ArrowLeft') {
            prevPage();
        }
        if (evt.key === 'ArrowRight') {
            nextPage();
        }
    })

    // objs.btnPrev.addEventListener('click', prevPage)
    // objs.btnNext.addEventListener('click', nextPage)

    let arrEle = [objs.inputCity, objs.btnPrev, objs.btnNext]
    let evtName = ['keyup', 'Enter', 'click']
    let arrCB = [cbInput, prevPage, nextPage]

    arrEle.forEach((ele, index) => {
        ele.addEventListener(evtName[index], arrCB[index])
    })
}


const prevPage = () => {
    if(objs.page.cursor > 1) {
        objs.page.cursor--
    // what is this -- style?
    }
    // why this fetchData()
    fetchData()

}

const nextPage = () => {
    if(objs.page.cursor < objs.page.total) {
        objs.page.cursor++
    }

    fetchData()
}


const fetchData = ()  => {
    const newCity = objs.inputCity.value.trim().toLowerCase()  || 'macbook'
    fetch(`https://api.unsplash.com/search/photos/?client_id=${unplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(function(response) {
            return response.json()
        })
        .then(function (data) {
            console.log('raw data: ', data)
            // todo: render image carousel
            renderImages(data.results)
            objs.page.total = data.total_pages

        })

}

const renderImages = function (arrImages) {
//     set background image with the new data got
    let img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') no-repeat center center fixed`
//     create carousel
    createCarousel(arrImages)
}

const updateBackgroundImage = function (url) {
    objs.body.style.background = `url('${url}') no-repeat center center fixed`
}

const setImageSelected = function (eleImage) {
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function(ele) {
        ele.className = 'imgContainer'
    })
    eleImage.className = strClassSelected
}

const resetToFirstImage = function () {
    let images = document.querySelectorAll('[data-index]');
    images.forEach(function(ele, index) {
        ele.className = 'imgContainer'; // Reset all to default class
    });
    if (images.length > 0) {
        images[0].className = strClassSelected; // Set the first image to selected
    }
};

const createCarousel = function (arrImages) {
//
    objs.carousel.innerHTML = ''

    arrImages.forEach((image, i) => {
        let item = document.createElement('div')
        item.className = 'imgContainer'
        item.setAttribute('data-index', i); // Important to set a unique data attribute
        if(i === 0) {
            item.className = strClassSelected
        }

        const img = image.urls.regular
        item.style.background = `url('${img}') no-repeat center center fixed`
        item.dataset.index = i

        // animation
        item.style.animation = 'fadeIn 0.25s forwards'
        item.style.animationDelay = `${0.1 * i}s`

        item.dataset.url = image.urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', (evt) => {
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
            // console.log('evt clicked', evt)
        })
        item.addEventListener('mouseenter', (e) => {
            let newUrl = e.target.dataset.url
            if(!objs.preUrl) {
                let str = objs.body.style.background
                let iStart = str.indexOf('(');
                let iEnd = str.indexOf(')');
                str = str.slice(iStart + 2, iEnd - 1)
                console.log('original url:', str)

                objs.preUrl = str
                updateBackgroundImage(newUrl)
            };

            setImageSelected(e.target);
        })
        item.addEventListener('mouseleave', function (e) {
            if(objs.preUrl) {
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null
            }
        })
    })
}

fetchData()
setKeyEvent()

objs.bthSearch.addEventListener('click', fetchData)
objs.inputCity.addEventListener('keyup', setKeyEvent)
objs.carousel.addEventListener('mouseleave', resetToFirstImage);

//
//
//

function processUserInput () {
    const name = prompt('please enter your name.');
    callback(name);
}

function callback(input) {
    alert('hello' + input + '!');
}

