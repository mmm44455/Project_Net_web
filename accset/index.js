var images = [
    '/icon/img/z4857424446438_d1b1f8ed655d447795a80a7ae12ecdcb.jpg',
    '/icon/img/anh2.jpg',
];

var currentImageIndex = 0;
var slider = $('.slider');

function changeImage() {
    var nextImageIndex = (currentImageIndex + 1) % images.length;

    var currentSlide = $('<div class="slide"></div>').css('background-image', 'url(' + images[currentImageIndex] + ')');
    var nextSlide = $('<div class="slide"></div>').css('background-image', 'url(' + images[nextImageIndex] + ')');

    slider.append(currentSlide, nextSlide);

    // Force a reflow to enable the CSS transition
    void currentSlide.width();
    void nextSlide.width();

    // Add the 'active' class to apply the fade animation
    nextSlide.addClass('active');

    // Remove the current slide after the animation completes
    setTimeout(function () {
        currentSlide.remove();
    }, 1500);

    // Move to the next image
    currentImageIndex = nextImageIndex;
}

function startSlider() {
    setInterval(changeImage, 5000); // Change image every 5 seconds, adjust as needed
}

// Call startSlider after all content has been loaded
$(document).ready(function () {
    changeImage(); // Show the first image immediately when the page loads
    startSlider();
});