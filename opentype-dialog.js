(function initOpenTypeDialog(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OpenTypeDialog = api;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  function createController({ dialog, closeButton, featureList, onSelect }) {
    let triggerButton = null;

    function select(button) {
      if (!button) return;
      const tag = button.dataset?.featureTag;
      featureList.querySelectorAll('.open-type-feature-chip').forEach((chip) => {
        const selected = chip === button;
        chip.classList.toggle('is-selected', selected);
        chip.setAttribute('aria-pressed', String(selected));
      });
      onSelect(tag, button);
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    function open(trigger, initialSelection = null) {
      triggerButton = trigger || null;
      dialog.showModal();
      if (initialSelection) select(initialSelection);
      closeButton.focus();
    }

    featureList.addEventListener('click', (event) => {
      const chip = event.target.closest('.open-type-feature-chip');
      if (chip) select(chip);
    });
    closeButton.addEventListener('click', close);
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener('close', () => {
      triggerButton?.focus();
      triggerButton = null;
    });

    return { close, open, select };
  }

  return { createController };
});
