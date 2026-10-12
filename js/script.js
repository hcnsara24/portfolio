// Interactive features for Hocine Sara's portfolio
document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const year = document.getElementById("current-year");

  if (year) year.textContent = new Date().getFullYear();

  // Accessible responsive navigation.
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });

    navItems.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  // Highlight the navigation item for the visible section.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  // Reveal cards gently as they enter the viewport.
  const revealItems = document.querySelectorAll(
    ".about-story, .education-card, .skill-card, .project-showcase, .contact-panel, .contact-form-card"
  );
  revealItems.forEach(item => item.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // This prepares a message in the visitor's email application; it does not send automatically.
  if (form && status) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = document.getElementById("name").value.trim();
      const senderEmail = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !senderEmail || !message) {
        status.textContent = "Please complete all fields.";
        return;
      }

      const recipient = "hcnsara333@gmail.com";
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);
      status.textContent = "Opening your email application. Review the message and press Send there.";
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }
});
