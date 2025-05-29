    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    });    
    // Images for each category
    const galleryData = {
      training: [
        "img/training1.jpg",
        "img/training2.jpg",
        "img/training3.jpg"
      ],
      seminar: [
        "img/seminar1.jpg",
        "img/seminar2.jpg"
      ],
      laboratory: [
        "img/laboratory1.jpg",
        "img/laboratory2.jpg",
        "img/laboratory3.jpg"
      ],
      members: [
        "img/members1.jpg",
        "img/members2.jpg",
        "img/members3.jpg",
        "img/members4.jpg"
      ]
    };

     
    const popupGallery = document.getElementById('popup-gallery');
    const popupImagesContainer = document.getElementById('popup-images');
    const popupClose = document.getElementById('popup-close');
// Open popup with images of clicked category
    document.querySelectorAll('.gallery-category').forEach(category => {
      category.addEventListener('click', () => {
        const categoryName = category.getAttribute('data-category');
        const images = galleryData[categoryName];
        if (images && images.length) {
          popupImagesContainer.innerHTML = '';
          images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = categoryName + " image";
            popupImagesContainer.appendChild(img);
          });
          popupGallery.classList.remove('hidden');
        }
      });
    });

    // Close popup on clicking X
    popupClose.addEventListener('click', () => {
      popupGallery.classList.add('hidden');
    });

    // Close popup when clicking outside content
    popupGallery.addEventListener('click', (e) => {
      if (e.target === popupGallery) {
        popupGallery.classList.add('hidden');
      }
    });
