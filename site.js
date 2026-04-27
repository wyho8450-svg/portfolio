const siteData = window.portfolioData;
const homepageProjectOrder = [
  "meadows-rail",
  "freefall",
  "grove-hooks",
  "nalof-table",
  "magnetic-ltd",
  // Temporary CMDP class portfolio entry; safe to remove after the course.
  "media-portfolio"
];

function buildNavigation(currentPath) {
  return `
    <div class="nav-inner">
      <a class="brand" href="${currentPath === "root" ? "index.html" : "../index.html"}">${siteData.person.name}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">
        <span></span>
        <span></span>
      </button>
      <div class="nav-links">
        <a href="${currentPath === "root" ? "index.html" : "../index.html"}">Work</a>
        <a href="${currentPath === "root" ? "about.html" : "../about.html"}">About</a>
        <a href="${currentPath === "root" ? siteData.person.resumePath : "../" + siteData.person.resumePath}" target="_blank" rel="noreferrer">Resume</a>
      </div>
    </div>
  `;
}

function buildFooter(currentPath) {
  const resumeLink = currentPath === "root" ? siteData.person.resumePath : "../" + siteData.person.resumePath;
  return `
    <div class="footer-grid">
      <div>
        <p class="footer-label">Contact</p>
        <a href="mailto:${siteData.person.email}">${siteData.person.email}</a>
      </div>
      <div>
        <p class="footer-label">Phone</p>
        <a href="tel:${siteData.person.phone.split(".").join("")}">${siteData.person.phone}</a>
      </div>
      <div>
        <p class="footer-label">Location</p>
        <p>${siteData.person.location}</p>
      </div>
      <div>
        <p class="footer-label">Resume</p>
        <a href="${resumeLink}" target="_blank" rel="noreferrer">Open PDF</a>
      </div>
    </div>
  `;
}

function renderSharedShell() {
  const navHost = document.querySelector("[data-nav]");
  const footerHost = document.querySelector("[data-footer]");
  const mode = document.body.dataset.depth === "project" ? "project" : "root";

  if (navHost) {
    navHost.innerHTML = buildNavigation(mode === "root" ? "root" : "project");
  }

  if (footerHost) {
    footerHost.innerHTML = buildFooter(mode === "root" ? "root" : "project");
  }

  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("is-open");
    });
  }
}

function projectPagePath(slug) {
  return `work/${slug}.html`;
}

function getProjectDescriptionParagraphs(project) {
  return project.fullDescription
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter(
      (paragraph) =>
        !paragraph.startsWith("Project Title:") &&
        !paragraph.startsWith("Role:") &&
        !paragraph.startsWith("Date:")
    );
}

function getParagraphs(text) {
  return text
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getMediaPortfolioPage(slug) {
  const hubPage = siteData.mediaPortfolioPages?.hub;
  const chapterPages = siteData.mediaPortfolioPages?.chapters || [];

  if (hubPage?.slug === slug) {
    return { ...hubPage, kind: "hub" };
  }

  const chapter = chapterPages.find((entry) => entry.slug === slug);
  return chapter ? { ...chapter, kind: "chapter" } : null;
}

function renderMediaPortfolioModuleCard(module) {
  return `
    <article class="project-card media-portfolio-module">
      <a class="project-card-link media-portfolio-module-link" href="${module.href}">
        <div class="project-card-media media-portfolio-module-media">
          <img src="../${module.image}" alt="${module.imageAlt}" loading="lazy">
        </div>
        <div class="project-card-copy media-portfolio-module-copy">
          <p class="eyebrow">${module.eyebrow}</p>
          <h2>${module.title}</h2>
          <p>${module.description}</p>
        </div>
      </a>
    </article>
  `;
}

function renderMediaPortfolioChapterNav(slug) {
  const chapters = siteData.mediaPortfolioPages?.chapters || [];
  const currentIndex = chapters.findIndex((chapter) => chapter.slug === slug);

  if (currentIndex === -1) {
    return "";
  }

  const previousChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return `
    <div class="media-portfolio-chapter-nav">
      <a class="media-portfolio-chapter-link" href="media-portfolio.html">
        <span>Back to Overview</span>
        <strong>CMDP 1400 Media Portfolio</strong>
      </a>
      ${previousChapter ? `
        <a class="media-portfolio-chapter-link" href="${previousChapter.slug}.html">
          <span>Previous Chapter</span>
          <strong>${previousChapter.title}</strong>
        </a>
      ` : ""}
      ${nextChapter ? `
        <a class="media-portfolio-chapter-link" href="${nextChapter.slug}.html">
          <span>Next Chapter</span>
          <strong>${nextChapter.title}</strong>
        </a>
      ` : ""}
    </div>
  `;
}

function renderMediaPortfolioSection(section) {
  const sectionMedia = Array.isArray(section.media) ? section.media : [];
  const mediaMarkup = sectionMedia.length
    ? `
        <div class="project-gallery media-portfolio-gallery">
          ${sectionMedia
            .map((item) => {
              const layoutClass = item.layout === "feature" ? "gallery-item--feature" : "gallery-item--pair";

              if (item.type === "video") {
                return `
                  <figure class="project-figure gallery-item ${layoutClass}">
                    <video class="media-portfolio-video" controls preload="metadata" playsinline>
                      <source src="../${item.path}" type="video/mp4">
                      Your browser does not support the video tag.
                    </video>
                    ${item.caption ? `<figcaption class="media-portfolio-caption">${item.caption}</figcaption>` : ""}
                  </figure>
                `;
              }

              return `
                <figure class="project-figure gallery-item ${layoutClass}">
                  <img src="../${item.path}" alt="${item.alt}" loading="lazy">
                  ${item.caption ? `<figcaption class="media-portfolio-caption">${item.caption}</figcaption>` : ""}
                </figure>
              `;
            })
            .join("")}
        </div>
      `
    : "";

  return `
    <section class="media-portfolio-section">
      <div class="media-portfolio-section-copy">
        ${section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : ""}
        <h2>${section.title}</h2>
      </div>
      ${mediaMarkup}
      <div class="project-description media-portfolio-section-text">
        ${getParagraphs(section.body)
          .map((paragraph) => `<p>${paragraph}</p>`)
          .join("")}
        ${section.reflection
          ? getParagraphs(section.reflection)
              .map((paragraph) => `<p>${paragraph}</p>`)
              .join("")
          : ""}
      </div>
    </section>
  `;
}

function renderHomepageGrid() {
  const grid = document.querySelector("[data-project-grid]");

  if (!grid) {
    return;
  }

  const orderedProjects = homepageProjectOrder
    .map((slug) => siteData.projects.find((project) => project.slug === slug))
    .filter(Boolean);

  grid.innerHTML = orderedProjects
    .map(
      (project) => `
        <article class="project-card">
          <a class="project-card-link" href="${projectPagePath(project.slug)}" aria-label="Open ${project.title}">
            <div class="project-card-media">
              <img src="${project.mainImage}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-card-copy">
              <p class="project-meta">${project.date}</p>
              <h2>${project.title}</h2>
            </div>
          </a>
        </article>
      `
    )
    .join("");
}

function renderHomepageHero() {
  const heroHost = document.querySelector("[data-hero-slides]");
  const prevButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");

  if (!heroHost || !siteData.heroSlides || !siteData.heroSlides.length) {
    return;
  }

  heroHost.innerHTML = siteData.heroSlides
    .map(
      (slide, index) => `
        <div class="hero-slide${index === 0 ? " is-active" : ""}">
          <img src="${slide.path}" alt="${slide.alt}" loading="${index === 0 ? "eager" : "lazy"}">
        </div>
      `
    )
    .join("");

  const slides = Array.from(heroHost.querySelectorAll(".hero-slide"));
  let activeIndex = 0;
  let intervalId;

  function showSlide(nextIndex) {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }

  function startAutoPlay() {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      showSlide(activeIndex + 1);
    }, 5500);
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startAutoPlay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startAutoPlay();
    });
  }

  startAutoPlay();
}

function renderProjectPage() {
  const slug = document.body.dataset.project;
  const project = siteData.projects.find((entry) => entry.slug === slug);
  const mediaPortfolioPage = getMediaPortfolioPage(slug);
  const projectHeroImage = project?.projectHeroImage || project?.mainImage;

  if (!project && !mediaPortfolioPage) {
    return;
  }

  const heroHost = document.querySelector("[data-project-hero]");
  const galleryHost = document.querySelector("[data-project-gallery]");

  if (heroHost) {
    if (mediaPortfolioPage) {
      heroHost.innerHTML = `
        <div class="project-hero-stack">
          <div class="project-hero-image project-hero-image--full">
            <img src="../${mediaPortfolioPage.heroImage}" alt="${mediaPortfolioPage.heroAlt}">
          </div>
          <div class="project-hero-copy">
            <h1>${mediaPortfolioPage.title}</h1>
            <div class="project-facts media-portfolio-facts">
              <p><span>Title</span>${mediaPortfolioPage.title}</p>
              <p><span>Date</span>${mediaPortfolioPage.date}</p>
              <p><span>Category</span>${mediaPortfolioPage.category}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      heroHost.innerHTML = `
        <div class="project-hero-stack">
          <div class="project-hero-image project-hero-image--full">
            <img src="../${projectHeroImage}" alt="${project.title}">
          </div>
          <div class="project-hero-copy">
            <h1>${project.title}</h1>
            <div class="project-facts">
              <p><span>Role</span>${project.role}</p>
              <p><span>Date</span>${project.date}</p>
            </div>
            <div class="project-description">
              ${getProjectDescriptionParagraphs(project)
                .map((paragraph) => `<p>${paragraph}</p>`)
                .join("")}
            </div>
          </div>
        </div>
      `;
    }
  }

  if (galleryHost) {
    if (mediaPortfolioPage?.kind === "hub") {
      galleryHost.classList.remove("project-gallery");
      galleryHost.classList.add("media-portfolio-flow");
      galleryHost.innerHTML = `
        <section class="media-portfolio-intro">
          <div class="project-description media-portfolio-intro-copy">
            ${getParagraphs(mediaPortfolioPage.intro)
              .map((paragraph) => `<p>${paragraph}</p>`)
              .join("")}
          </div>
        </section>
        <section class="media-portfolio-modules">
          ${mediaPortfolioPage.modules.map((module) => renderMediaPortfolioModuleCard(module)).join("")}
        </section>
      `;
      return;
    }

    if (mediaPortfolioPage?.kind === "chapter") {
      galleryHost.classList.remove("project-gallery");
      galleryHost.classList.add("media-portfolio-flow");
      galleryHost.innerHTML = `
        <section class="media-portfolio-intro">
          <div class="project-description media-portfolio-intro-copy">
            ${getParagraphs(mediaPortfolioPage.intro)
              .map((paragraph) => `<p>${paragraph}</p>`)
              .join("")}
          </div>
        </section>
        ${mediaPortfolioPage.sections.map((section) => renderMediaPortfolioSection(section)).join("")}
      `;
      return;
    }

    const galleryImages = project.images.filter((image) => image.path !== projectHeroImage);

    galleryHost.innerHTML = galleryImages
      .map((image, index) => {
        if (image.type === "download") {
          return `
            <a class="media-fallback gallery-item gallery-item--pair" href="../${image.path}" target="_blank" rel="noreferrer">
              <p class="media-fallback-label">Original image ${String(index + 1).padStart(2, "0")}</p>
              <h3>Open HEIC file</h3>
              <p>This photo is included in the project folder in HEIC format. Open the original file to view it at full resolution.</p>
            </a>
          `;
        }

        const layoutClass = image.layout === "feature" ? "gallery-item--feature" : "gallery-item--pair";

        return `
          <figure class="project-figure gallery-item ${layoutClass}">
            <img src="../${image.path}" alt="${image.alt}" loading="lazy">
          </figure>
        `;
      })
      .join("");
  }

  const nextProjectHost = document.querySelector("[data-next-project]");

  if (nextProjectHost) {
    if (mediaPortfolioPage?.kind === "hub") {
      nextProjectHost.innerHTML = `
        <a class="next-project-link" href="media-portfolio-photography.html">
          <span>Begin Chapter Sequence</span>
          <strong>Photography</strong>
        </a>
      `;
      return;
    }

    if (mediaPortfolioPage?.kind === "chapter") {
      nextProjectHost.innerHTML = renderMediaPortfolioChapterNav(slug);
      return;
    }

    const orderedProjects = homepageProjectOrder
      .map((projectSlug) => siteData.projects.find((entry) => entry.slug === projectSlug))
      .filter(Boolean);
    const currentIndex = orderedProjects.findIndex((entry) => entry.slug === slug);
    const nextProject = orderedProjects[(currentIndex + 1) % orderedProjects.length];

    nextProjectHost.innerHTML = `
      <a class="next-project-link" href="${nextProject.slug}.html">
        <span>Next project</span>
        <strong>${nextProject.title}</strong>
      </a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSharedShell();
  renderHomepageHero();
  renderHomepageGrid();
  renderProjectPage();
});
