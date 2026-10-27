import './style.css';
import {
  initializeErrorDismissal,
  initializePreviewTabs,
  initializeSceneControls,
  runSyncDemo,
  selectPreview,
} from './app.js';

const shell = document.querySelector('[data-preview-shell]');
initializePreviewTabs(shell);
initializeErrorDismissal(document);
initializeSceneControls(document);

document.querySelector('[data-sync-control]').addEventListener('click', () => runSyncDemo(document));

const requestedPreview = new URLSearchParams(window.location.search).get('preview');
if (['desktop', 'tablet', 'mobile'].includes(requestedPreview)) {
  selectPreview(shell, requestedPreview);
}
