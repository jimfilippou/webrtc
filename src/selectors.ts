const video = document.querySelector('video');

export const applySelectors = (): void => {
    document.getElementById('play').addEventListener('click', (ev) => {
        video.play();
    })
    
    document.getElementById('stop').addEventListener('click', (ev) => {
        video.pause();
    })
    
    document.getElementById('rotate').addEventListener('click', (ev) => {
        if (video.classList.contains('rotated')) {
            video.classList.remove('rotated');
        } else {
            video.classList.add('rotated');
        }
    })
}

