document.addEventListener('DOMContentLoaded', function() {
    // Gestion du header lors du défilement
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Animation des vignettes vidéo sur la page d'accueil
    const thumbnails = document.querySelectorAll('.recent-thumbnail, .video-thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', function() {
            const video = this.querySelector('video');
            if (video) {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
        
        thumbnail.addEventListener('mouseleave', function() {
            const video = this.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });
});