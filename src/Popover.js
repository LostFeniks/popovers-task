export default class Popover {
  constructor() {
    this.popover = null;
    this.arrow = null;
    this.title = null;
    this.content = null;
    this.triggerElement = null;
    this.isVisible = false;
    this.boundOutsideClickHandler = null;
  }

  createPopover(title, content, triggerElement) {
    this.triggerElement = triggerElement;
    this.isVisible = true;

    // Remove existing popover if any
    this.removePopover();

    // Create popover container
    this.popover = document.createElement('div');
    this.popover.className = 'popover';
    this.popover.setAttribute('role', 'tooltip');

    // Create arrow
    this.arrow = document.createElement('div');
    this.arrow.className = 'popover-arrow';
    this.popover.appendChild(this.arrow);

    // Create header
    const popoverHeader = document.createElement('h3');
    popoverHeader.className = 'popover-header';
    popoverHeader.textContent = title;
    this.popover.appendChild(popoverHeader);

    // Create body
    const popoverBody = document.createElement('div');
    popoverBody.className = 'popover-body';
    popoverBody.textContent = content;
    this.popover.appendChild(popoverBody);

    // Append to body
    document.body.appendChild(this.popover);

    // Position the popover
    this.positionPopover();

    // Add click listener to close on outside click
    this.boundOutsideClickHandler = this.handleOutsideClick.bind(this);
    setTimeout(() => {
      document.addEventListener('click', this.boundOutsideClickHandler);
    }, 0);
  }

  positionPopover() {
    if (!this.popover || !this.triggerElement) return;

    const triggerRect = this.triggerElement.getBoundingClientRect();
    const popoverRect = this.popover.getBoundingClientRect();

    // Position above the trigger element
    let top = triggerRect.top - popoverRect.height - 10 + window.scrollY;
    const left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

    // Check if popover would go above viewport
    if (top < window.scrollY + 10) {
      // Place below the trigger
      top = triggerRect.bottom + 10 + window.scrollY;
      if (this.arrow) {
        this.arrow.style.transform = 'rotate(180deg)';
      }
    } else {
      if (this.arrow) {
        this.arrow.style.transform = 'rotate(0deg)';
      }
    }

    this.popover.style.top = `${top}px`;
    this.popover.style.left = `${Math.max(0, left)}px`;

    // Position arrow
    if (this.arrow) {
      const arrowOffset = (triggerRect.width / 2) - 10;
      const popoverWidth = this.popover.offsetWidth || 200;
      this.arrow.style.left = `${Math.max(10, Math.min(popoverWidth - 20, arrowOffset))}px`;
    }
  }

  handleOutsideClick(event) {
    if (this.popover && 
        !this.popover.contains(event.target) && 
        !this.triggerElement.contains(event.target)) {
      this.removePopover();
      document.removeEventListener('click', this.boundOutsideClickHandler);
    }
  }

  removePopover() {
    if (this.popover && this.popover.parentNode) {
      this.popover.parentNode.removeChild(this.popover);
      this.popover = null;
      this.arrow = null;
      this.isVisible = false;
      if (this.boundOutsideClickHandler) {
        document.removeEventListener('click', this.boundOutsideClickHandler);
        this.boundOutsideClickHandler = null;
      }
    }
  }

  togglePopover(title, content, triggerElement) {
    if (this.isVisible && this.triggerElement === triggerElement) {
      this.removePopover();
    } else {
      this.createPopover(title, content, triggerElement);
    }
  }

  updatePosition() {
    if (this.isVisible && this.popover) {
      this.positionPopover();
    }
  }
}