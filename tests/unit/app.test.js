import { beforeEach, describe, expect, it } from 'vitest';
import * as app from '../../src/app.js';

function previewFixture() {
  document.body.innerHTML = `
    <div data-preview-shell data-preview="desktop">
      <div role="tablist" aria-label="Preview size">
        <button role="tab" id="preview-desktop" data-preview-option="desktop" aria-selected="true" tabindex="0">Desktop</button>
        <button role="tab" id="preview-tablet" data-preview-option="tablet" aria-selected="false" tabindex="-1">Tablet</button>
        <button role="tab" id="preview-mobile" data-preview-option="mobile" aria-selected="false" tabindex="-1">Mobile</button>
      </div>
      <p data-preview-status></p>
    </div>`;
}

describe('preview selection', () => {
  beforeEach(previewFixture);

  it('selects a preview and synchronizes tab state and status text', () => {
    expect(typeof app.selectPreview).toBe('function');

    const shell = document.querySelector('[data-preview-shell]');
    const tablet = document.querySelector('[data-preview-option="tablet"]');

    app.selectPreview(shell, 'tablet');

    expect(shell.dataset.preview).toBe('tablet');
    expect(tablet.getAttribute('aria-selected')).toBe('true');
    expect(tablet.tabIndex).toBe(0);
    expect(document.querySelector('[data-preview-status]').textContent).toBe(
      'Tablet preview selected: 834 × 1112 CSS pixels',
    );
  });

  it('moves between preview tabs with arrow keys', () => {
    const shell = document.querySelector('[data-preview-shell]');
    app.initializePreviewTabs(shell);

    document.querySelector('[data-preview-option="desktop"]').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );

    expect(shell.dataset.preview).toBe('tablet');
    expect(document.activeElement.dataset.previewOption).toBe('tablet');
  });

  it('wraps backward from the first preview tab', () => {
    const shell = document.querySelector('[data-preview-shell]');
    app.initializePreviewTabs(shell);

    document.querySelector('[data-preview-option="desktop"]').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );

    expect(shell.dataset.preview).toBe('mobile');
  });
});

describe('control states', () => {
  it('sets loading state then announces successful synchronization', async () => {
    document.body.innerHTML = `
      <button data-sync-control>Sync material profile</button>
      <p data-sync-status></p>`;

    const finish = app.runSyncDemo(document, 0);

    expect(document.querySelector('[data-sync-control]').disabled).toBe(true);
    expect(document.querySelector('[data-sync-control]').getAttribute('aria-busy')).toBe('true');
    await finish;
    expect(document.querySelector('[data-sync-control]').disabled).toBe(false);
    expect(document.querySelector('[data-sync-status]').textContent).toBe('Material profile synchronized.');
  });

  it('clears an error panel when its dismiss control is activated', () => {
    document.body.innerHTML = `
      <section data-error-panel><button data-error-dismiss>Dismiss</button></section>`;
    app.initializeErrorDismissal(document);
    document.querySelector('[data-error-dismiss]').click();
    expect(document.querySelector('[data-error-panel]').hidden).toBe(true);
  });
});
