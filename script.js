const form = document.getElementById('reviewForm');
const preview = document.getElementById('preview');
const photoInput = document.getElementById('photo');
const reviewsEl = document.getElementById('reviews');
const clearBtn = document.getElementById('clearStorage');

const STORAGE_KEY = 'hairdye_reviews_v1';

function readReviews(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('load error', e);
    return [];
  }
}

function saveReviews(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatDate(d){
  if(!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString();
}

function render(){
  const reviews = readReviews();
  reviewsEl.innerHTML = '';
  if(reviews.length === 0){
    reviewsEl.innerHTML = '<p class="meta">No reviews yet — add your first color!</p>';
    return;
  }
  reviews.slice().reverse().forEach(r => {
    const card = document.createElement('article');
    card.className = 'review-card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `<div>
      <div class="product">${escapeHtml(r.product)}</div>
      <div class="meta">${escapeHtml(r.shade)} · ${formatDate(r.date)}</div>
    </div>
    <div class="rating">${r.rating || '-'}</div>`;

    const body = document.createElement('div');
    body.className = 'card-body';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = `${r.product} ${r.shade}`;
    if(r.photo) img.src = r.photo; else img.style.display = 'none';

    const notes = document.createElement('div');
    notes.className = 'notes';
    notes.textContent = r.notes || '';

    body.appendChild(img);
    body.appendChild(notes);

    card.appendChild(header);
    card.appendChild(body);

    reviewsEl.appendChild(card);
  });
}

function escapeHtml(s){
  if(!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

photoInput.addEventListener('change', async (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if(!file){ preview.innerHTML = ''; preview.setAttribute('aria-hidden','true'); return; }
  const url = await readFileAsDataURL(file);
  preview.innerHTML = `<img src="${url}" alt="preview" style="width:100%;height:100%;object-fit:cover">`;
  preview.setAttribute('aria-hidden','false');
});

function readFileAsDataURL(file){
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const data = new FormData(form);
  const product = data.get('product')?.toString().trim();
  const shade = data.get('shade')?.toString().trim();
  const rating = data.get('rating')?.toString();
  const date = data.get('date')?.toString() || new Date().toISOString();
  const notes = data.get('notes')?.toString().trim();

  let photo = null;
  const file = photoInput.files && photoInput.files[0];
  if(file){
    // store as data-url so we don't need a backend
    try{ photo = await readFileAsDataURL(file); }catch(e){ console.warn('image read failed', e); }
  }

  const reviews = readReviews();
  reviews.push({id: Date.now(), product, shade, rating, date, notes, photo});
  saveReviews(reviews);

  form.reset();
  preview.innerHTML = '';
  preview.setAttribute('aria-hidden','true');
  render();
});

clearBtn.addEventListener('click', () => {
  if(!confirm('Clear all reviews? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
});

// initial render
render();
