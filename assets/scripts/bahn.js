const addAutocomplete = (api) => {
  const inputs = [
    {
      el: document.querySelector('#originInput'),
      container: document.querySelector('#origin'),
      onSelect: () => document.querySelector('#destinationInput').focus(),
    },
    {
      el: document.querySelector('#destinationInput'),
      container: document.querySelector('#destination'),
      onSelect: () => document.querySelector('#submit').focus(),
    },
  ];

  for (const { el, container, onSelect } of inputs) {
    if (!el) continue;
    const list = document.createElement('ul');
    list.className = 'sey-list';
    list.hidden = true;
    container.style.position = 'relative';
    container.appendChild(list);

    let debounce;
    el.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        const query = el.value.trim();
        if (query.length < 2) {
          list.hidden = true;
          return;
        }
        const params = new URLSearchParams({ ...api.query, query });
        const res = await fetch(`${api.url}?${params}`);
        const data = api.adapter(await res.json());
        list.innerHTML = '';
        for (const item of data) {
          const li = document.createElement('li');
          li.className = 'sey-item';
          li.textContent = item;
          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            el.value = item;
            list.hidden = true;
            onSelect();
          });
          list.appendChild(li);
        }
        list.hidden = data.length === 0;
      }, 150);
    });

    el.addEventListener('blur', () =>
      setTimeout(() => {
        list.hidden = true;
      }, 200),
    );
    el.addEventListener('focus', () => {
      if (list.children.length) list.hidden = false;
    });

    // keyboard navigation
    el.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.sey-item');
      const active = list.querySelector('.sey-item.active');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = active ? [...items].indexOf(active) : -1;
        const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
        if (active) active.classList.remove('active');
        if (items[next]) items[next].classList.add('active');
      } else if (e.key === 'Enter' && active) {
        e.preventDefault();
        el.value = active.textContent;
        list.hidden = true;
        onSelect();
      }
    });
  }
};

const mavStationsApi = {
  url: '/stations',
  query: { limit: 5 },
  adapter: (res) => res.map((e) => e.name),
};

addAutocomplete(mavStationsApi);

// Swap origin ↔ destination button
const swapBtn = document.querySelector('#swap');
if (swapBtn) {
  swapBtn.addEventListener('click', () => {
    const originInput = document.querySelector('#originInput');
    const destInput = document.querySelector('#destinationInput');
    const tmp = originInput.value;
    originInput.value = destInput.value;
    destInput.value = tmp;
  });
}

// Loading indicator on form submit
const form = document.querySelector('form#page');
if (form) {
  // Default date to today if empty
  const dateInput = document.querySelector('#date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', () => {
    const btn = document.querySelector('#submit');
    if (btn) {
      btn.disabled = true;
      btn.value = 'Suche läuft…';
    }
    const error = document.querySelector('#error');
    if (error) error.style.display = 'none';
    // Show progress bar
    const bar = document.createElement('div');
    bar.id = 'loading-bar';
    document.body.prepend(bar);
  });
}

// Time input formatting: 830 → 08:30 on blur, red border on invalid
const timeInputs = document.querySelectorAll(
  'input[name="departureAfter"], input[name="arrivalBefore"]',
);
for (const input of timeInputs) {
  input.addEventListener('blur', () => {
    const raw = input.value.trim();
    if (!raw) {
      input.style.borderColor = '';
      return;
    }

    let hours, minutes;
    if (raw.includes(':')) {
      [hours, minutes] = raw.split(':').map(Number);
    } else if (raw.length <= 2) {
      hours = Number(raw);
      minutes = 0;
    } else {
      minutes = Number(raw) % 100;
      hours = Math.floor(Number(raw) / 100);
    }

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      input.style.borderColor = '#c00';
      input.style.borderBottomStyle = 'solid';
    } else {
      input.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      input.style.borderColor = '';
      input.style.borderBottomStyle = '';
    }
  });
}
