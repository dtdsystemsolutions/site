const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('hide');
});

function closeMenu() {
  navLinks.classList.remove('active');
  hamburger.classList.remove('hide');
}

window.addEventListener('scroll', closeMenu);

document.addEventListener('click', (event) => {
  const isInside = hamburger.contains(event.target) || navLinks.contains(event.target);
  if (!isInside) closeMenu();
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href").substring(1) === entry.target.id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        rootMargin: "-50% 0px -50% 0px", // triggers when section middle hits viewport
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
});