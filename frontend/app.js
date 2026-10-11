document.addEventListener('DOMContentLoaded', async () => {
  const statusLabel = document.getElementById('backend-status-label');
  const statusDot = document.querySelector('.status-dot');

  if (!statusLabel || !statusDot) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/health');

    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }

    const data = await response.json();
    statusLabel.textContent = `Backend: ${data.status}`;
    statusDot.style.background = '#7ee7c5';
  } catch (error) {
    statusLabel.textContent = 'Backend: unavailable';
    statusDot.style.background = '#ff7d7d';
    statusDot.style.boxShadow = '0 0 14px rgba(255, 125, 125, 0.9)';
    console.error('LearnLoop backend check failed:', error);
  }
});
