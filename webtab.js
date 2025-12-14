

/* -------------------------------
   ☰ NAVBAR DROPDOWN LOGIC
-------------------------------- */
const dropdownParents = document.querySelectorAll(".nav-dropdown");

/* Desktop hover + mobile click support */
dropdownParents.forEach(drop => {
  const trigger = drop.querySelector(".dropdown-toggle");
  const menu = drop.querySelector(".dropdown-menu");

  if (!trigger || !menu) return;

  /* Mobile click */
  trigger.addEventListener("click", (e) => {
    e.preventDefault();

    dropdownParents.forEach(other => {
      if (other !== drop) {
        other.classList.remove("open");
      }
    });

    drop.classList.toggle("open");
  });
});

/* Close dropdown when clicking outside navbar */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar")) {
    dropdownParents.forEach(drop => drop.classList.remove("open"));
  }
});

/* -------------------------------
   ☰ MOBILE NAVBAR TOGGLE
-------------------------------- */
const menuBtn = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuBtn.classList.toggle("active");
  });
}

