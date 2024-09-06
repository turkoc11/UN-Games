document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.post-image');

    images.forEach(image => {
        image.addEventListener('click', function() {
            if (this.classList.contains('enlarged')) {
                this.classList.remove('enlarged');
            } else {
                this.classList.add('enlarged');
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Default to showing the first section
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }
});


document.addEventListener('DOMContentLoaded',function(){
    const gameImages = document.querySelectorAll('.game-image');
    const navDropdown = document.querySelector('.navbar-dropdown-menu');

    gameImages.forEach(gameImage => {
        gameImage.addEventListener('click', function(){
            navDropdown.classList.toggle('active')
            window.scrollTo(0, 0);
        })
    })
})