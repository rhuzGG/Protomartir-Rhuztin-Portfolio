(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');

  function setTheme(themeName) {
    root.dataset.theme = themeName;

    try {
      localStorage.setItem('portfolio-theme', themeName);
    } catch (error) {
      // Storage may be disabled in private browsing contexts.
    }

    const isLight = themeName === 'light';
    themeButton.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
    themeIcon.textContent = isLight ? '☾' : '☼';
  }

  setTheme(root.dataset.theme || 'dark');
  themeButton.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  menu.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation' : 'Open navigation'
    );
    nav.classList.toggle('open', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const projectGrid = document.getElementById('project-grid');
  const projectFilters = document.getElementById('project-filters');
  const projectSearch = document.getElementById('project-search');
  const resultCount = document.getElementById('result-count');
  const emptyState = document.getElementById('empty-state');
  const projects = window.PORTFOLIO_PROJECTS || [];
  const categories = [
    'All',
    ...new Set(projects.map((project) => project.category)),
  ];
  let activeCategory = 'All';

  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === activeCategory));

    button.addEventListener('click', () => {
      activeCategory = category;

      projectFilters.querySelectorAll('button').forEach((filter) => {
        filter.setAttribute('aria-pressed', String(filter === button));
      });

      renderProjects();
    });

    projectFilters.append(button);
  });

  function escapeHtml(value) {
    const replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return String(value ?? '').replace(/[&<>"']/g, (character) => {
      return replacements[character];
    });
  }

  function renderProjects() {
    const searchTerm = projectSearch.value.trim().toLowerCase();
    const matchingProjects = projects.filter((project) => {
      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;
      const searchableText = [
        project.name,
        project.category,
        project.type,
        project.year,
        project.role,
        project.description,
        ...project.technologies,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && searchableText.includes(searchTerm);
    });

    projectGrid.innerHTML = matchingProjects
      .map((project) => {
        const color = escapeHtml(project.color || '#e34224');
        const projectLink = project.projectUrl
          ? `<a class="project-link" href="${escapeHtml(project.projectUrl)}" target="_blank" rel="noopener">Project ↗</a>`
          : '';
        const technologyTags = project.technologies
          .map((technology) => `<span>${escapeHtml(technology)}</span>`)
          .join('');

        return `
          <article class="project-card">
            <div
              class="project-art"
              style="--art-color: ${color}; --art-bg: color-mix(in srgb, ${color} 12%, var(--bg))"
              role="img"
              aria-label="Abstract graphic for ${escapeHtml(project.name)}"
            >
              <span class="project-shape"></span>
              <span class="project-art-label">${escapeHtml(project.category)} · ${escapeHtml(project.status)}</span>
              <span class="project-year">${escapeHtml(project.year)}</span>
            </div>
            <div class="project-info">
              <div class="project-meta">
                <span>${escapeHtml(project.category.toUpperCase())} / ${escapeHtml(project.type.toUpperCase())}</span>
                <span>${escapeHtml(project.role)}</span>
              </div>
              <h3>${escapeHtml(project.name)}</h3>
              <p>${escapeHtml(project.description)}</p>
              <div class="project-foot">
                <div class="tags">${technologyTags}</div>
                ${projectLink}
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    resultCount.textContent = `${matchingProjects.length} PROJECT${
      matchingProjects.length === 1 ? '' : 'S'
    } · SEARCH BY TITLE, TECHNOLOGY, CATEGORY, TYPE, OR YEAR`;
    emptyState.hidden = matchingProjects.length > 0;
  }

  projectSearch.addEventListener('input', renderProjects);
  renderProjects();

  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    if (formData.get('website')) return;

    const recipient = 'rhuztin2006@gmail.com';
    const serviceId = 'service_31e8vqg';
    const templateId = 'template_u46vf2h';
    const publicKey = 'lkZF2Gzm6auXH5Hjl';
    const name = String(formData.get('name')).slice(0, 100);
    const email = String(formData.get('email')).slice(0, 254);
    const subject = String(formData.get('subject')).slice(0, 120);
    const message = String(formData.get('message')).slice(0, 2000);
    const body = [`Name: ${name}`, `Reply to: ${email}`, '', message].join('\n');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name,
            email,
            subject,
            title: subject,
            message,
          },
        }),
      });

      if (!response.ok) throw new Error('EmailJS could not send the message.');

      contactForm.reset();
      showToast('Your message was sent successfully.');
    } catch {
      showToast('Direct sending failed. Opening an email draft instead.');
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      submitButton.disabled = false;
    }
  });
})();




