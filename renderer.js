document.addEventListener('DOMContentLoaded', () => {
  const cleanBtn = document.getElementById('clean-btn');
  const statusEl = document.getElementById('status');
  const spinner = document.getElementById('spinner');
  const checkmark = document.getElementById('checkmark');
  const errorIcon = document.getElementById('error-icon');

  cleanBtn.addEventListener('click', async () => {
    // Reset state
    cleanBtn.disabled = true;
    cleanBtn.classList.add('loading');
    statusEl.textContent = 'Solicitando permissão e limpando...';
    statusEl.className = 'status text-blue';
    spinner.style.display = 'block';
    checkmark.style.display = 'none';
    errorIcon.style.display = 'none';

    // Call API
    const result = await window.ramCleanerAPI.cleanRam();

    // Update state based on result
    cleanBtn.classList.remove('loading');
    cleanBtn.disabled = false;
    spinner.style.display = 'none';

    if (result.success) {
      statusEl.textContent = result.message;
      statusEl.className = 'status text-green';
      checkmark.style.display = 'block';
      
      // Animate checkmark
      checkmark.classList.remove('pop-in');
      void checkmark.offsetWidth; // trigger reflow
      checkmark.classList.add('pop-in');
    } else {
      statusEl.textContent = result.message;
      statusEl.className = 'status text-red';
      errorIcon.style.display = 'block';
      
      // Animate error icon
      errorIcon.classList.remove('shake');
      void errorIcon.offsetWidth; // trigger reflow
      errorIcon.classList.add('shake');
    }
  });
});
