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

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    if (formData.get('website')) return;

    const recipient = 'rhuztin2006@gmail.com';
    if (!recipient) {
      showToast('Email is not configured yet.');
      return;
    }

    const subject = String(formData.get('subject')).slice(0, 120);
    const body = [
      `Name: ${String(formData.get('name')).slice(0, 100)}`,
      `Reply to: ${String(formData.get('email')).slice(0, 254)}`,
      '',
      String(formData.get('message')).slice(0, 2000),
    ].join('\n');

    window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Your email app should open with a drafted message.');
  });
})();




