import Popover from '../src/Popover';

describe('Popover widget', () => {
  let popover;
  let triggerElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="test-btn" data-title="Test Title" data-content="Test Content">
        Click me
      </button>
    `;
    popover = new Popover();
    triggerElement = document.getElementById('test-btn');
  });

  afterEach(() => {
    popover.removePopover();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('should create popover on toggle', () => {
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeTruthy();
    expect(popoverElement.querySelector('.popover-header').textContent).toBe('Test Title');
    expect(popoverElement.querySelector('.popover-body').textContent).toBe('Test Content');
    expect(popover.isVisible).toBe(true);
  });

  test('should remove popover on second toggle', () => {
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    popover.removePopover();
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeNull();
    expect(popover.isVisible).toBe(false);
  });

  test('should toggle popover visibility', () => {
    popover.togglePopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    popover.togglePopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(false);
  });

  test('should position popover above trigger element', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    
    // Устанавливаем размеры через CSS
    popoverElement.style.width = '200px';
    popoverElement.style.height = '100px';
    popoverElement.style.position = 'absolute';
    
    // Мокаем getBoundingClientRect для триггера
    const triggerRect = {
      top: 100,
      left: 100,
      width: 100,
      height: 40,
      bottom: 140,
      right: 200,
      x: 100,
      y: 100,
      toJSON: () => {}
    };
    
    // Мокаем getBoundingClientRect для popover
    const popoverRect = {
      height: 100,
      width: 200,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    };
    
    // Подменяем методы
    triggerElement.getBoundingClientRect = jest.fn().mockReturnValue(triggerRect);
    popoverElement.getBoundingClientRect = jest.fn().mockReturnValue(popoverRect);
    
    // Устанавливаем scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true
    });
    
    // Вызываем позиционирование
    popover.positionPopover();
    
    // Получаем значения
    const top = parseInt(popoverElement.style.top);
    const left = parseInt(popoverElement.style.left);
    
    // Проверяем позиционирование
    expect(top).toBe(triggerRect.top - popoverRect.height - 10);
    expect(left).toBe(triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2));
  });

  test('should position popover below trigger when not enough space above', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    
    // Триггер вверху страницы (нет места сверху)
    const triggerRect = {
      top: 10,
      left: 100,
      width: 100,
      height: 40,
      bottom: 50,
      right: 200,
      x: 100,
      y: 10,
      toJSON: () => {}
    };
    
    const popoverRect = {
      height: 100,
      width: 200,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    };
    
    triggerElement.getBoundingClientRect = jest.fn().mockReturnValue(triggerRect);
    popoverElement.getBoundingClientRect = jest.fn().mockReturnValue(popoverRect);
    
    // Устанавливаем scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true
    });
    
    // Вызываем позиционирование
    popover.positionPopover();
    
    // Проверяем, что popover снизу
    const top = parseInt(popoverElement.style.top);
    expect(top).toBe(triggerRect.bottom + 10);
    expect(popover.arrow.style.transform).toBe('rotate(180deg)');
  });

  test('should close popover on outside click', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    // Создаем элемент вне popover
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    // Симулируем клик
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    
    // Вызываем обработчик
    popover.handleOutsideClick(event);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeNull();
    expect(popover.isVisible).toBe(false);
  });

  test('should close popover when clicking on trigger button', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    // Кликаем по триггеру через toggle
    popover.togglePopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeNull();
    expect(popover.isVisible).toBe(false);
  });

  test('should not close popover when clicking inside popover', () => {
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    const popoverElement = document.querySelector('.popover');
    
    // Симулируем клик внутри popover
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: popoverElement });
    popover.handleOutsideClick(event);
    
    // Popover должен остаться
    const popoverElementAfter = document.querySelector('.popover');
    expect(popoverElementAfter).toBeTruthy();
    expect(popover.isVisible).toBe(true);
  });

  test('should update position on window resize', (done) => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    // Шпионим за методом positionPopover
    const positionSpy = jest.spyOn(popover, 'positionPopover');
    
    // Симулируем событие resize
    window.dispatchEvent(new Event('resize'));
    
    // Ждем выполнения таймера
    setTimeout(() => {
      try {
        expect(positionSpy).toHaveBeenCalled();
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  }, 15000);

  test('should update position on scroll', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    // Шпионим за методом positionPopover
    const positionSpy = jest.spyOn(popover, 'positionPopover');
    
    // Симулируем событие scroll
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Проверяем, что метод был вызван
    expect(positionSpy).toHaveBeenCalled();
  });

  test('should not update position when popover is hidden', () => {
    // Шпионим за методом positionPopover
    const positionSpy = jest.spyOn(popover, 'positionPopover');
    
    // Симулируем событие scroll когда popover скрыт
    window.dispatchEvent(new Event('scroll'));
    
    // Метод не должен быть вызван
    expect(positionSpy).not.toHaveBeenCalled();
  });

  test('should handle click outside with setTimeout', () => {
    jest.useFakeTimers();
    
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    expect(popover.isVisible).toBe(true);
    
    // Продвигаем таймер для setTimeout в createPopover
    jest.advanceTimersByTime(10);
    
    // Создаем элемент вне popover
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    // Симулируем клик
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    
    // Вызываем обработчик
    popover.handleOutsideClick(event);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeNull();
    expect(popover.isVisible).toBe(false);
    
    jest.useRealTimers();
  });

  test('should handle multiple popovers correctly', () => {
    // Создаем первый popover
    popover.createPopover('Title 1', 'Content 1', triggerElement);
    
    // Проверяем первый popover
    let popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeTruthy();
    expect(popoverElement.querySelector('.popover-header').textContent).toBe('Title 1');
    expect(popoverElement.querySelector('.popover-body').textContent).toBe('Content 1');
    expect(popover.isVisible).toBe(true);
    
    // Создаем второй popover (должен заменить первый)
    popover.createPopover('Title 2', 'Content 2', triggerElement);
    
    // Проверяем, что старый popover удален
    const allPopovers = document.querySelectorAll('.popover');
    expect(allPopovers.length).toBe(1);
    
    // Проверяем новый popover
    popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeTruthy();
    expect(popoverElement.querySelector('.popover-header').textContent).toBe('Title 2');
    expect(popoverElement.querySelector('.popover-body').textContent).toBe('Content 2');
    expect(popover.isVisible).toBe(true);
  });

  test('should center popover horizontally', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    
    // Мокаем getBoundingClientRect
    const triggerRect = {
      top: 100,
      left: 200,
      width: 100,
      height: 40,
      bottom: 140,
      right: 300,
      x: 200,
      y: 100,
      toJSON: () => {}
    };
    
    const popoverRect = {
      height: 100,
      width: 200,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    };
    
    triggerElement.getBoundingClientRect = jest.fn().mockReturnValue(triggerRect);
    popoverElement.getBoundingClientRect = jest.fn().mockReturnValue(popoverRect);
    
    // Вызываем позиционирование
    popover.positionPopover();
    
    // Проверяем центрирование
    const left = parseInt(popoverElement.style.left);
    const expectedLeft = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
    
    expect(left).toBe(expectedLeft);
  });

  test('should handle arrow position correctly', () => {
    // Создаем popover
    popover.createPopover('Test Title', 'Test Content', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    
    // Мокаем getBoundingClientRect
    const triggerRect = {
      top: 100,
      left: 100,
      width: 100,
      height: 40,
      bottom: 140,
      right: 200,
      x: 100,
      y: 100,
      toJSON: () => {}
    };
    
    const popoverRect = {
      height: 100,
      width: 200,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    };
    
    triggerElement.getBoundingClientRect = jest.fn().mockReturnValue(triggerRect);
    popoverElement.getBoundingClientRect = jest.fn().mockReturnValue(popoverRect);
    
    // Устанавливаем offsetWidth для popover
    Object.defineProperty(popoverElement, 'offsetWidth', {
      value: 200,
      configurable: true
    });
    
    // Вызываем позиционирование
    popover.positionPopover();
    
    // Проверяем позицию стрелки
    const arrowLeft = parseInt(popover.arrow.style.left);
    expect(arrowLeft).toBeGreaterThanOrEqual(10);
    expect(arrowLeft).toBeLessThanOrEqual(180);
  });

  test('should handle popover with long content', () => {
    const longContent = 'A'.repeat(500);
    popover.createPopover('Long Title', longContent, triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeTruthy();
    expect(popoverElement.querySelector('.popover-body').textContent).toBe(longContent);
    expect(popover.isVisible).toBe(true);
  });

  test('should handle popover with empty content', () => {
    popover.createPopover('', '', triggerElement);
    
    const popoverElement = document.querySelector('.popover');
    expect(popoverElement).toBeTruthy();
    expect(popoverElement.querySelector('.popover-header').textContent).toBe('');
    expect(popoverElement.querySelector('.popover-body').textContent).toBe('');
    expect(popover.isVisible).toBe(true);
  });
});