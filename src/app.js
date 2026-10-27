const PREVIEW_LABELS = {
  desktop: 'Desktop preview selected: 1440 × 900 CSS pixels',
  tablet: 'Tablet preview selected: 834 × 1112 CSS pixels',
  mobile: 'Mobile preview selected: iPhone 15 · 393 × 852 CSS pixels · 3× DSF',
};

export function selectPreview(shell, preview) {
  if (!PREVIEW_LABELS[preview]) return;
  shell.dataset.preview = preview;

  shell.querySelectorAll('[data-preview-option]').forEach((tab) => {
    const selected = tab.dataset.previewOption === preview;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  shell.querySelector('[data-preview-status]').textContent = PREVIEW_LABELS[preview];
}

export function initializePreviewTabs(shell) {
  const tabs = [...shell.querySelectorAll('[data-preview-option]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPreview(shell, tab.dataset.previewOption));
    tab.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 :
        event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      selectPreview(shell, next.dataset.previewOption);
      next.focus();
    });
  });
}

export function runSyncDemo(root, delay = 900) {
  const control = root.querySelector('[data-sync-control]');
  const status = root.querySelector('[data-sync-status]');
  control.disabled = true;
  control.setAttribute('aria-busy', 'true');
  control.classList.add('is-loading');
  status.textContent = 'Synchronizing material profile…';

  return new Promise((resolve) => {
    setTimeout(() => {
      control.disabled = false;
      control.removeAttribute('aria-busy');
      control.classList.remove('is-loading');
      status.textContent = 'Material profile synchronized.';
      resolve();
    }, delay);
  });
}

export function initializeErrorDismissal(root) {
  root.querySelector('[data-error-dismiss]')?.addEventListener('click', () => {
    root.querySelector('[data-error-panel]').hidden = true;
  });
}

export function initializeSceneControls(root) {
  root.querySelectorAll('.scene-card:not(:disabled)').forEach((control) => {
    control.addEventListener('click', () => {
      const active = control.getAttribute('aria-pressed') === 'true';
      control.setAttribute('aria-pressed', String(!active));
      control.classList.toggle('active', !active);
      control.querySelector('i').textContent = active ? 'Off' : 'On';
    });
  });
}
