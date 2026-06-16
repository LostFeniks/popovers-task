import './styles.css';
import Popover from './Popover';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.popover-btn');
  const popover = new Popover();

  // Get title and content from data attributes
  const title = button.dataset.title || 'Popover title';
  const content = button.dataset.content || 'Popover content';

  button.addEventListener('click', (event) => {
    event.preventDefault();
    popover.togglePopover(title, content, button);
  });

  // Update position on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      popover.updatePosition();
    }, 100);
  });

  // Update position on scroll
  window.addEventListener('scroll', () => {
    if (popover.isVisible) {
      popover.updatePosition();
    }
  });
});