// Change Online Registration button text on hover
document.addEventListener('DOMContentLoaded', function() {
  var regBtn = document.getElementById('online-reg-btn');
  if (regBtn) {
    regBtn.addEventListener('mouseenter', function() {
      regBtn.innerHTML = 'Register <span style="font-size:1.2em; vertical-align:middle;">&#8594;</span>';
    });
    regBtn.addEventListener('mouseleave', function() {
      regBtn.textContent = 'Online Registration';
    });
  }
});


    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      // Toggle hamburger icon between menu and close (cross)
      if (hamburger.classList.contains('active')) {
        hamburger.innerHTML = '&times;'; // Cross icon
        // Add overlay for closing on outside click
        addSidebarOverlay();
      } else {
        hamburger.innerHTML = '&#9776;'; // Hamburger icon
        removeSidebarOverlay();
      }
    });

    // Overlay logic for closing sidebar on outside click
    function addSidebarOverlay() {
      if (!document.getElementById('sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '999';
        overlay.style.background = 'rgba(0,0,0,0)'; // invisible but clickable
        overlay.addEventListener('click', () => {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.innerHTML = '&#9776;';
          removeSidebarOverlay();
        });
        // Insert before navLinks so nav is above overlay
        navLinks.parentNode.insertBefore(overlay, navLinks);
      }
    }

    function removeSidebarOverlay() {
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) overlay.remove();
    }
    // Close sidebar when a nav link is clicked (for better UX)
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.innerHTML = '&#9776;'; // Reset to hamburger icon
        removeSidebarOverlay();
      });
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
