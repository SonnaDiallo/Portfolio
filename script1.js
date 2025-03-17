document.addEventListener('scroll', () => {
    const projectImage = document.querySelector('.project-image');
    const projectInfo = document.querySelector('.project-info');

    const imageTop = projectImage.getBoundingClientRect().top;
    const infoTop = projectInfo.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (imageTop < windowHeight * 0.75) {
        projectImage.classList.add('visible');
    }

    if (infoTop < windowHeight * 0.75) {
        projectInfo.classList.add('visible');
    }
});