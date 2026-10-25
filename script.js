/* =========================================================
   ORGN Agency - script.js
   1 Settings (EDIT HERE) · 1b Placeholder images · 2 Header & menu · 3 YouTube
   4 Logo marquee · 5 Scroll reveal · 6 Contact form · 7 Footer year
   ========================================================= */

/* ---------------------------------------------------------
   1. SETTINGS - EDIT THESE VALUES
   --------------------------------------------------------- */
const CONFIG = {
  // >>> YOUTUBE VIDEO URL <<<
  // Paste any normal YouTube link (watch, youtu.be, shorts or embed).
  // Replace the link below to change the video.
  youtubeUrl: "هنا هحط لينك فيديو البرومو",

  // >>> CONTACT FORM ENDPOINT <<<
  // Leave empty until an email service is connected. While empty, the form
  // validates the input but does NOT send anything (and says so).
  // Example with a form service: "https://formspree.io/f/your-form-id"
  formEndpoint: ""
};

/* ---------------------------------------------------------
   1b. PLACEHOLDER IMAGES
   Images marked data-placeholder="..." get a generated picture so the
   site works with only HTML, CSS and JS files. To use a real image, set
   src="your-image.jpg" and delete the data-placeholder attribute.
   --------------------------------------------------------- */
(function initPlaceholders() {
  const svgUri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

  function clientLogo(n) {
    return svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 56"><rect x="1.5" y="1.5" width="157" height="53" rx="8" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5"/><text x="80" y="33" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#fff">CLIENT LOGO ' + n + '</text></svg>');
  }

  const shapes = [
    '<circle cx="420" cy="400" r="230" fill="none" stroke="#5B8DFF" stroke-width="70"/><circle cx="800" cy="400" r="150" fill="#EEF2FF"/>',
    '<rect x="220" y="140" width="760" height="480" rx="24" fill="#EEF2FF" opacity=".92"/><rect x="300" y="220" width="320" height="320" rx="16" fill="#2F63FF"/>',
    '<polygon points="300,600 600,140 900,600" fill="#5B8DFF"/><circle cx="600" cy="470" r="70" fill="#0a0f26"/>'
  ];
  const covers = [
    '<rect width="1200" height="900" fill="#000"/><circle cx="780" cy="450" r="300" fill="none" stroke="#1F5BFF" stroke-width="90"/><circle cx="780" cy="450" r="90" fill="#fff"/>',
    '<rect width="1200" height="900" fill="#1F5BFF"/><rect x="180" y="150" width="520" height="600" fill="#000"/><rect x="520" y="300" width="500" height="450" fill="#fff"/>',
    '<rect width="1200" height="900" fill="#000"/><polygon points="420,220 420,680 820,450" fill="#1F5BFF"/><rect x="60" y="60" width="1080" height="780" fill="none" stroke="#fff" stroke-width="6"/>'
  ];

  function workImage(project, n) {
    const label = '<text x="60" y="' + (n === 1 ? 840 : 750) + '" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#fff" opacity=".65">Placeholder: project ' + project + ', image ' + n + '</text>';
    if (n === 1) {
      return svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">' + covers[project - 1] + label + '</svg>');
    }
    return svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2a6b"/><stop offset="1" stop-color="#0a0f26"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/>' + shapes[(project + n) % 3] + label + '</svg>');
  }

  document.querySelectorAll("img[data-placeholder]").forEach((img) => {
    const key = img.dataset.placeholder.split("-");   // "client-3" or "work-2-3"
    if (key[0] === "client") img.src = clientLogo(key[1]);
    if (key[0] === "work") img.src = workImage(Number(key[1]), Number(key[2]));
  });
})();

/* ---------------------------------------------------------
   2. HEADER & MOBILE MENU
   --------------------------------------------------------- */
(function initHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const hero = document.getElementById("home");

  // Show the header logo and a border once the hero is mostly scrolled past
  function onScroll() {
    const limit = hero ? hero.offsetHeight * 0.5 : 200;
    header.classList.toggle("is-scrolled", window.scrollY > limit);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after choosing a link, or with Escape
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Reset the menu if the window is resized to desktop width
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) setMenu(false);
  });
})();

/* ---------------------------------------------------------
   3. YOUTUBE - turns a normal link into a responsive embed
   --------------------------------------------------------- */
function getYouTubeEmbedUrl(url) {
  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch (err) {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
  let id = null;

  if (host === "youtu.be") {
    id = parsed.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else {
      // /shorts/ID, /embed/ID, /live/ID, /v/ID
      const match = parsed.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?]+)/);
      if (match) id = match[1];
    }
  }

  if (!id || !/^[\w-]{11}$/.test(id)) return null;

  // Optional start time: ?t=90 or ?t=90s or ?start=90
  const startRaw = parsed.searchParams.get("start") || parsed.searchParams.get("t") || "";
  const start = parseInt(startRaw, 10);

  let embed = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
  if (start > 0) embed += "&start=" + start;
  return embed;
}

(function initVideo() {
  const frame = document.getElementById("video-frame");
  const embedUrl = getYouTubeEmbedUrl(CONFIG.youtubeUrl || "");

  if (!embedUrl) {
    frame.innerHTML = '<p class="video-message">Video unavailable. Check the YouTube link in script.js.</p>';
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = "ORGN Agency promotional video";
  iframe.loading = "lazy";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;

  frame.replaceChildren(iframe);
})();

/* ---------------------------------------------------------
   4. CLIENT LOGO MARQUEE - duplicates logos for a seamless loop
   --------------------------------------------------------- */
(function initMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const originals = Array.from(track.children);

  function build() {
    // Remove old clones (used when the window is resized)
    track.querySelectorAll("[data-clone]").forEach((el) => el.remove());

    // Width of one full set of logos, including the spacing after each
    const setWidth = track.scrollWidth;
    if (!setWidth) return;

    // Enough copies to always fill the screen, plus one spare
    const copies = Math.ceil(window.innerWidth / setWidth) + 1;
    for (let i = 0; i < copies; i++) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("data-clone", "");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelector("img").alt = "";
        clone.querySelector("img").removeAttribute("loading");
        track.appendChild(clone);
      });
    }

    // Animate by exactly one set width so the loop has no jump
    track.style.setProperty("--shift", setWidth + "px");
  }

  build();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
})();

/* ---------------------------------------------------------
   5. SCROLL REVEAL - cards fade in as they enter the screen
   --------------------------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    // Small stagger within each row of three
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    observer.observe(el);
  });
})();

/* ---------------------------------------------------------
   6. CONTACT FORM - validation + a place to connect email later
   --------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  // One rule per field: returns an error message, or "" when valid
  const rules = {
    name(value) {
      if (!value) return "Enter your full name.";
      if (value.length < 2) return "Name must be at least 2 characters.";
      return "";
    },
    email(value) {
      if (!value) return "Enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email, like name@example.com.";
      return "";
    },
    service(value) {
      return value ? "" : "Select the service you need.";
    },
    message(value) {
      if (!value) return "Write a short message.";
      if (value.length < 10) return "Message must be at least 10 characters.";
      return "";
    }
  };

  function validateField(field) {
    const error = rules[field.name](field.value.trim());
    const errorEl = document.getElementById(field.id + "-error");
    errorEl.textContent = error;
    field.setAttribute("aria-invalid", error ? "true" : "false");
    return !error;
  }

  const fields = Array.from(form.querySelectorAll("input, select, textarea"));

  // Check a field when the person leaves it, and re-check while fixing an error
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "");

    // Validate every field; focus the first invalid one
    const results = fields.map((field) => validateField(field));
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus("Fix the highlighted fields and try again.", "error");
      return;
    }

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim()
    };

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;

    try {
      const result = await sendMessage(data);

      if (result.sent) {
        setStatus("Message sent. We will reply soon.", "success");
        form.reset();
        fields.forEach((f) => f.setAttribute("aria-invalid", "false"));
      } else {
        // Honest message: nothing was sent because no service is connected yet
        setStatus("Your details are valid, but this site is not connected to an email service yet, so your message has not been sent.", "info");
      }
    } catch (err) {
      setStatus("Something went wrong and your message was not sent. Please try again.", "error");
    } finally {
      button.disabled = false;
    }
  });

  /* >>> CONNECT AN EMAIL SERVICE HERE <<<
     This is the only function to change. It must return { sent: true } on
     success and { sent: false } when nothing was sent.

     Option A (works now): set CONFIG.formEndpoint to a form service URL,
     such as Formspree. The code below posts the data as JSON.

     Option B: use EmailJS or your own server instead, for example:
       await emailjs.send("SERVICE_ID", "TEMPLATE_ID", data, "PUBLIC_KEY");
       return { sent: true };
  */
  async function sendMessage(data) {
    if (!CONFIG.formEndpoint) {
      console.info("Contact form data (not sent, no endpoint configured):", data);
      return { sent: false };
    }

    const response = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Request failed: " + response.status);
    return { sent: true };
  }
})();

/* ---------------------------------------------------------
   6b. OUR WORK - project detail window (images + description)
   Content comes from the .work-details block inside each project
   card in index.html, so you only edit the HTML.
   --------------------------------------------------------- */
(function initProjectModal() {
  const dialog = document.getElementById("project-modal");
  if (!dialog) return;

  const titleEl = document.getElementById("modal-title");
  const categoryEl = document.getElementById("modal-category");
  const descEl = document.getElementById("modal-description");
  const mediaEl = document.getElementById("modal-media");
  let opener = null;

  function openProject(card, button) {
    opener = button;
    titleEl.textContent = card.querySelector(".work-title").textContent;
    categoryEl.textContent = card.querySelector(".work-category").textContent;

    // Description paragraphs
    descEl.replaceChildren(
      ...Array.from(card.querySelectorAll(".work-description p")).map((p) => p.cloneNode(true))
    );

    // Scrollable images
    mediaEl.replaceChildren(
      ...Array.from(card.querySelectorAll(".work-gallery img")).map((img) => img.cloneNode(true))
    );
    mediaEl.scrollTop = 0;
    dialog.querySelector(".modal-body").scrollTop = 0;

    document.body.style.overflow = "hidden";
    dialog.showModal();
  }

  document.querySelectorAll(".work-card").forEach((card) => {
    const button = card.querySelector(".work-open");
    button.addEventListener("click", () => openProject(card, button));
  });

  dialog.querySelector(".modal-close").addEventListener("click", () => dialog.close());

  // Click on the dark area outside the window closes it
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Runs for the close button, outside click and the Escape key
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    if (opener) opener.focus();
  });
})();

/* ---------------------------------------------------------
   7. FOOTER YEAR
   --------------------------------------------------------- */
(function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
