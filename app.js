let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');

nextButton.onclick = function(){
    showSlider('next');
}
prevButton.onclick = function(){
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if(type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else{
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(()=>{
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function(){
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});
backButton.onclick = function(){
    carousel.classList.remove('showDetail');
}


document.addEventListener('DOMContentLoaded', () => {
    const specificationsContainers = document.querySelectorAll('.specifications-container');
    
    specificationsContainers.forEach(container => {
        let currentIndex = 0;
        const itemsToShow = 1; 
        const specContent = container.querySelector('.spec-content');
        const specItems = container.querySelectorAll('.spec-item');
        const totalItems = specItems.length;

        const updateDisplay = () => {
            const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            specContent.style.transform = `translateX(-${currentIndex * (200 / itemsToShow)}%)`;
        };

        container.querySelector('#spec-left').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            }
            updateDisplay();
        });

        container.querySelector('#spec-right').addEventListener('click', () => {
            const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
            }
            updateDisplay();
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const items = document.querySelectorAll('.item');
    const carouselList = document.querySelector('.carousel .list');

    const fuseOptions = {
        includeScore: true,
        threshold: 0.2,
        keys: [
            { name: 'title', weight: 0.1 },
            { name: 'topic', weight: 0.1 },
            { name: 'description', weight: 0.3 },
            { name: 'detailTitle', weight: 1.1 }
        ]
    };

    const data = Array.from(items).map(item => ({
        element: item,
        title: item.querySelector('.detail .title').innerText.toLowerCase(),
        topic: item.querySelector('.topic').innerText.toLowerCase(),
        description: item.querySelector('.des').innerText.toLowerCase(),
        detailTitle: item.querySelector('.detail .title') ? item.querySelector('.detail .title').innerText.toLowerCase() : ''
    }));

    const fuse = new Fuse(data, fuseOptions);

    function reorderItems(matchedItem, carouselList) {
        // إزالة العنصر المتطابق من الـ DOM مؤقتًا
        carouselList.removeChild(matchedItem);

        // إرجاعه في الموضع المطلوب (في هذا المثال، الموضع الثاني)
        const secondItem = carouselList.children[1];
        carouselList.insertBefore(matchedItem, secondItem);
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let foundItems = [];

        if (query) {
            const results = fuse.search(query);
            foundItems = results.map(result => result.item.element);
        }

        items.forEach(item => {
            item.style.display = 'none';
        });

        const titleMatches = foundItems.filter(item => {
            const detailTitle = item.querySelector('.detail .title').innerText.toLowerCase();
            return detailTitle === query;
        });

        if (titleMatches.length > 0) {
            const matchedItem = titleMatches[0];
            matchedItem.style.display = 'block'; // إظهار العنصر
            reorderItems(matchedItem, carouselList); // تحريكه إلى الموضع الثاني
        } else {
            const topics = new Set();

            foundItems.forEach(item => {
                const itemTopic = item.querySelector('.topic').innerText.toLowerCase();
                topics.add(itemTopic);
            });

            items.forEach(item => {
                const itemTopic = item.querySelector('.topic').innerText.toLowerCase();
                if (topics.has(itemTopic)) {
                    item.style.display = 'block';
                    carouselList.prepend(item); // نقل العنصر إلى بداية القائمة
                }
            });
        }

        if (foundItems.length === 0) {
            items.forEach(item => {
                item.style.display = 'block';
            });
        }
    });
});
