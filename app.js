// ======================================
// AFTER DARK BLOG — app.js
// Supabase backend + full blog logic
// ======================================

// ── SUPABASE CONFIG ──────────────────
// Wklej swoje dane z Supabase Dashboard → Settings → API
const SUPABASE_URL  = 'https://ankjsyifirjeyddfvefa.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFua2pzeWlmaXJqZXlkZGZ2ZWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjA5OTcsImV4cCI6MjA5MTczNjk5N30.st0Wn5wYiZDMJYDKjcqrhnY3kxEzkJIiIayJstr24J4';

let supabase = null;
let allPosts = [];
let filteredPosts = [];
let currentPage = 0;
const PAGE_SIZE = 9;
let currentCat = 'all';

// ── INIT ─────────────────────────────
async function init() {
  // Load supabase client
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    await loadPosts();
  } else {
    // Demo mode — use sample data
    console.log('Supabase not connected — using demo data');
    useDemoData();
  }

  // Nav filter
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      filterByCategory(el.dataset.cat);
    });
  });

  // Cat buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => filterByCategory(btn.dataset.cat));
  });

  // Set today's date in hero
  const heroDate = document.getElementById('heroDate');
  if (heroDate) heroDate.textContent = formatDate(new Date().toISOString());
}

// ── LOAD POSTS FROM SUPABASE ──────────
async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    useDemoData();
    return;
  }

  allPosts = data;
  filteredPosts = [...allPosts];
  renderHero(allPosts[0]);
  renderGrid();
}

// ── DEMO DATA (gdy brak Supabase) ─────
function useDemoData() {
  allPosts = [
    {
      id: 1, slug: 'jak-urozmaicic-zwiazek', featured: true,
      title: 'Jak rozpalić ogień w związku — przewodnik dla odważnych par',
      excerpt: 'Rutyna to cichy wróg namiętności. Odkryj sprawdzone sposoby, by każdy wieczór zamienić w niezapomniane przeżycie. Po trzech minutach z After Dark już nic nie będzie takie samo...',
      content: `<p>Każdy związek przechodzi przez fazy — od euforii pierwszych spotkań, przez komfort codzienności, aż po chwile, gdy rutyna zaczyna tłumić pożądanie. To naturalne. Ale nie nieuniknione.</p>
<h2>Dlaczego rutyna zabija namiętność?</h2>
<p>Nasz mózg jest wyjątkowo sprawny w "neutralizowaniu" bodźców, które stają się przewidywalne. To ewolucyjny mechanizm — pozwala oszczędzać energię. Problem w tym, że dotyczy to również <em>podniecenia seksualnego</em>.</p>
<blockquote>"Nowość to najsilniejszy afrodyzjak" — twierdzą seksuolodzy. I mają rację.</blockquote>
<h2>5 sprawdzonych sposobów na nową energię</h2>
<h3>1. Zmień przestrzeń</h3>
<p>Sypialnia to tylko jeden pokój. Kuchnia, salon, balkon o północy — każde miejsce niesie inny ładunek emocjonalny. Spróbujcie czegoś, czego jeszcze nie robiliście razem.</p>
<h3>2. Fantazje na głos</h3>
<p>Większość par nigdy nie rozmawia o swoich fantazjach. A to najprostszy klucz do głębszej intymności. Zacznij od prostego pytania: <em>"Co zawsze chciałeś/chciałaś spróbować?"</em></p>
<h3>3. Gry erotyczne dla par</h3>
<p>Gra <strong>After Dark</strong> to 200+ wyzwań ułożonych po to, by wyciągnąć parę ze strefy komfortu. Od delikatnej prowokacji po scenariusze, które zostają w pamięci na długo.</p>
<h3>4. Rytuały intymności</h3>
<p>Masaż bez oczekiwań. Wspólna kąpiel. 10 minut wyłącznie dla siebie, bez telefonów. Małe rytuały budują napięcie lepiej niż wielkie gesty.</p>
<h3>5. Odgrywanie ról</h3>
<p>Roleplay to nie wymysł filmów. To jedna z najskuteczniejszych technik otwierania nowych wymiarów erotycznych. Zacznijcie od prostego scenariusza i pozwólcie sobie być kimś innym przez jedną noc.</p>
<h2>Zacznij dziś</h2>
<p>Nie czekaj na "odpowiedni moment". Otwórz After Dark, zakręć kołem i pozwól grze zrobić resztę.</p>`,
      category: 'zwiazki', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
      created_at: new Date().toISOString(), read_time: 5
    },
    {
      id: 2, slug: 'roleplay-dla-poczatkujacych',
      title: 'Roleplay dla początkujących — jak zacząć bez wstydu',
      excerpt: 'Myślisz, że odgrywanie ról to tylko dla zaawansowanych? Nic bardziej mylnego. Wystarczy jedno zdanie, by wejść w nową rolę i odkryć siebie na nowo.',
      content: `<p>Roleplay wzbudza w wielu parach jednocześnie ekscytację i lęk. "A co jeśli wyjdę śmiesznie?" "Co jeśli partner/partnerka się roześmieje?" To naturalne obawy. I właśnie dlatego napisaliśmy ten przewodnik.</p>
<h2>Dlaczego roleplay działa?</h2>
<p>Kiedy wchodzisz w rolę, zdejmujesz z siebie ciężar własnych oczekiwań i ocen. Stajesz się kimś innym — przez co możesz pozwolić sobie na więcej.</p>
<h3>Najprostsze scenariusze na start</h3>
<p><strong>Nieznajomi w barze</strong> — umówcie się, że jesteście obcymi sobie ludźmi. Zacznijcie od nowa. Podrywajcie się wzajemnie tak, jakby to było pierwsze spotkanie.</p>
<p><strong>Masażysta i klientka/klient</strong> — jeden masuje, drugi całkowicie się poddaje. Żadnych pytań, żadnych negocjacji. Tylko zmysły.</p>
<p><strong>Szef/podwładna</strong> — klasyka, która nadal działa. Kto ma władzę? Kto jej słucha? Zasady ustalają sami.</p>
<h2>Złota zasada: Safeword</h2>
<p>Przed każdą grą ustalcie słowo-klucz, które natychmiast zatrzymuje wszystko. To nie psuje zabawy — to daje poczucie bezpieczeństwa, które paradoksalnie pozwala się bardziej otworzyć.</p>`,
      category: 'fantazje', image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80',
      created_at: new Date(Date.now() - 86400000).toISOString(), read_time: 4
    },
    {
      id: 3, slug: 'best-couples-games-for-adults',
      title: 'Najlepsza gra erotyczna dla par — recenzja After Dark',
      excerpt: 'Testowaliśmy dziesiątki gier dla dorosłych. Żadna nie robi tego, co After Dark — 200 wyzwań, 5 poziomów, 7 języków. Oto nasza szczera ocena.',
      content: `<p>Na rynku gier erotycznych dla par nie brakuje propozycji. Karty, kości, aplikacje. Większość jest albo zbyt nieśmiała, albo zbyt ekstremalnie. <strong>After Dark</strong> znalazło złoty środek.</p>
<h2>Co wyróżnia After Dark?</h2>
<p>Koło fortuny losuje jedno z 200+ wyzwań podzielonych na 5 poziomów:</p>
<p><strong>Prowokacja</strong> → <strong>Pieszczoty</strong> → <strong>Dominacja</strong> → <strong>Ekstaza</strong> → <strong>Bez Granic</strong></p>
<p>Możecie zacząć od poziomu 1 i stopniowo podkręcać napięcie. Albo wrzucić od razu na poziom 4 — jeśli macie odwagę.</p>
<h2>Co nam się szczególnie podoba</h2>
<p>Imiona graczy — gra mówi do Ciebie po imieniu. To drobiazg, który robi niesamowitą różnicę. Czujesz, że wyzwanie zostało stworzone właśnie dla Was.</p>
<h2>Dla kogo?</h2>
<p>Dla każdej pary, która chce urozmaicić swoje życie erotyczne bez presji i niezręczności. Gra robi wszystko — Wy tylko wykonujecie.</p>`,
      category: 'zabawy', image: 'https://images.unsplash.com/photo-1535083783855-ded073985b83?w=800&q=80',
      created_at: new Date(Date.now() - 172800000).toISOString(), read_time: 6
    },
    {
      id: 4, slug: 'jak-rozmawiac-o-seksie',
      title: 'Jak rozmawiać o seksie z partnerem — bez wstydu i stresu',
      excerpt: 'Większość problemów w sypialni wynika nie z braku chęci, ale z braku rozmowy. Oto jak zacząć tę ważną rozmowę — i jak ją prowadzić.',
      content: `<p>Badania pokazują, że pary, które rozmawiają o seksie, mają o 50% większe zadowolenie z życia intymnego. Mimo to większość unika tego tematu jak ognia.</p>
<h2>Dlaczego tak trudno rozmawiać?</h2>
<p>Kultura wstydu, strach przed oceną, obawa przed zranieniem partnera. To wszystko sprawia, że milczymy — i tłumimy potrzeby, które mogłyby zbudować głębszą więź.</p>
<h3>Zasada "3 zdań"</h3>
<p>Zacznij od trzech zdań. Nie od całego wyznania. Trzy zdania o tym, co Ci się podoba. Trzy zdania o tym, czego masz ochotę spróbować. Trzy zdania o tym, co czujesz.</p>
<h2>Kiedy rozmawiać?</h2>
<p>Nie bezpośrednio przed ani po — emocje są zbyt duże. Najlepiej przy kolacji, na spacerze, przy kawie. W neutralnej atmosferze. Bez presji.</p>`,
      category: 'porady', image: 'https://images.unsplash.com/photo-1556103255-4443dbae8e5a?w=800&q=80',
      created_at: new Date(Date.now() - 259200000).toISOString(), read_time: 5
    },
    {
      id: 5,
      title: 'Masaż erotyczny — kompletny przewodnik dla par',
      excerpt: 'Masaż to nie tylko relaks. W rękach pary, która wie co robi, staje się wstępem do czegoś znacznie głębszego. Naucz się technik, które zapamiętacie na zawsze.',
      content: `<p>Dotyk jest pierwszym językiem miłości. Długo przed słowami, długo przed pocałunkami — był dotyk. Masaż erotyczny to powrót do tego pierwotnego źródła połączenia.</p>
<h2>Przygotowanie przestrzeni</h2>
<p>Temperatura (ciepło — 22-24°C), oświetlenie (świece lub przyciemnione lampki), muzyka (powolna, instrumentalna), olej do masażu (migdałowy lub rozgrzewający).</p>
<h2>Podstawowe techniki</h2>
<h3>Effleurage — długie, spokojne ruchy</h3>
<p>Zacznij od pleców. Długie, płynne ruchy dłońmi wzdłuż kręgosłupa. Nie naciskaj — prowadź. Celem jest rozgrzanie i stworzenie połączenia, nie rozluźnienie mięśni.</p>
<h3>Rozgrzewanie energii</h3>
<p>Przed dotknięciem trzymaj dłonie 2-3 cm nad ciałem partnera. Poczujcie wzajemną energię. Ten moment napięcia bez dotyku jest często tym, co zapada w pamięci najbardziej.</p>
<h2>Zasada "nie spiesz się"</h2>
<p>Najlepszy masaż erotyczny trwa co najmniej 30 minut. Nie dlatego, że tak trzeba — ale dlatego, że napięcie rośnie wolno. I im wolniej rośnie, tym intensywniej się rozładowuje.</p>`,
      category: 'lifestyle', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      created_at: new Date(Date.now() - 345600000).toISOString(), read_time: 7
    },
    {
      id: 6,
      title: 'Pozycje seksualne, których jeszcze nie próbowaliście',
      excerpt: 'Missionary i doggy style to dobry fundament. Ale co powiesz na coś, co sprawi, że spojrzycie na siebie zupełnie nowymi oczami?',
      content: `<p>Zmiana pozycji to nie kwestia sprawności fizycznej — to kwestia odwagi i ciekawości. Nowa pozycja to nowy kąt, nowe odczucia, nowe wrażenia dla obojga.</p>
<h2>Lotus — bliskość twarzą w twarz</h2>
<p>Partner siada ze skrzyżowanymi nogami, partnerka siada naprzeciwko i owija nogi wokół jego talii. Twarzą w twarz, maksymalny kontakt wzrokowy, minimalna odległość. To pozycja intymności, nie tylko przyjemności.</p>
<h2>Leżąca ósemka</h2>
<p>Oboje leżą bokiem, twarzą do siebie, jeden nad drugim. Wolna gra ruchów, komfort dla obu stron, i intensywny kontakt wzrokowy.</p>
<h2>Na krawędzi</h2>
<p>Partnerka leży na krawędzi łóżka, partner stoi. Zmiana kąta zmienia dosłownie wszystko. Prosta modyfikacja klasycznej pozycji z efektem, który zaskakuje.</p>
<h2>Wskazówka After Dark</h2>
<p>Gra After Dark ma wbudowane losowanie pozycji. Jeśli nie możecie się zdecydować — niech zdecyduje koło fortuny.</p>`,
      category: 'lifestyle', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      created_at: new Date(Date.now() - 432000000).toISOString(), read_time: 4
    }
  ];

  filteredPosts = [...allPosts];
  renderHero(allPosts[0]);
  renderGrid();
}

// ── RENDER HERO ───────────────────────
function renderHero(post) {
  if (!post) return;
  const titleEl   = document.getElementById('heroTitle');
  const excerptEl = document.getElementById('heroExcerpt');
  const catEl     = document.getElementById('heroCat');
  const dateEl    = document.getElementById('heroDate');
  const linkEl    = document.getElementById('heroLink');
  const heroBg    = document.querySelector('.hero-bg');

  if (titleEl)   titleEl.textContent   = post.title;
  if (excerptEl) excerptEl.textContent = post.excerpt;
  if (catEl)     catEl.textContent     = catLabel(post.category);
  if (dateEl)    dateEl.textContent    = formatDate(post.created_at);
  if (linkEl)    linkEl.onclick = (e) => { e.preventDefault(); openPost(post); };
  if (heroBg && post.image) {
    heroBg.style.backgroundImage = `
      linear-gradient(160deg, rgba(8,6,8,0) 30%, rgba(155,31,82,0.08) 60%, rgba(8,6,8,0.95) 100%),
      linear-gradient(to bottom, rgba(8,6,8,0.3) 0%, rgba(8,6,8,0.85) 70%, #080608 100%),
      url('${post.image}')`;
  }
}

// ── RENDER GRID ───────────────────────
function renderGrid(append = false) {
  const grid = document.getElementById('postsGrid');
  const loadBtn = document.getElementById('loadMoreBtn');

  if (!append) {
    grid.innerHTML = '';
    currentPage = 0;
  }

  const start = currentPage * PAGE_SIZE;
  const slice = filteredPosts.slice(start, start + PAGE_SIZE);

  if (filteredPosts.length === 0) {
    grid.innerHTML = `<div class="empty-state"><h3>Brak artykułów</h3><p>Wróć wkrótce — nowe treści już w drodze.</p></div>`;
    loadBtn.style.display = 'none';
    return;
  }

  slice.forEach((post, idx) => {
    const card = createCard(post, idx === 0 && currentPage === 0 && currentCat === 'all');
    grid.appendChild(card);
  });

  currentPage++;
  const hasMore = filteredPosts.length > currentPage * PAGE_SIZE;
  loadBtn.style.display = hasMore ? 'inline-block' : 'none';
}

function loadMore() {
  renderGrid(true);
}

// ── CREATE CARD ───────────────────────
function createCard(post, featured = false) {
  const card = document.createElement('div');
  card.className = 'post-card' + (featured ? ' featured' : '');
  card.onclick = () => openPost(post);

  card.innerHTML = `
    <div class="card-img-wrap">
      <img class="card-image" src="${post.image || 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=60'}" alt="${post.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=60'">
      <div class="card-img-overlay"></div>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-cat cat-${post.category}">${catLabel(post.category)}</span>
        <span class="card-date">${formatDate(post.created_at)}</span>
      </div>
      <h3 class="card-title">${post.title}</h3>
      <p class="card-excerpt">${post.excerpt}</p>
      <div class="card-footer">
        <span class="card-read">⏱ ${post.read_time || 4} min czytania</span>
        <div class="card-arrow">→</div>
      </div>
    </div>`;
  return card;
}

// ── FILTER ────────────────────────────
function filterByCategory(cat) {
  currentCat = cat;
  filteredPosts = cat === 'all' ? [...allPosts] : allPosts.filter(p => p.category === cat);

  // Update active states
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  renderGrid();
  document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── OPEN POST MODAL ───────────────────
async function openPost(post) {
  const modal    = document.getElementById('postModal');
  const body     = document.getElementById('modalBody');

  body.innerHTML = `
    <div class="article-header">
      <span class="article-cat card-cat cat-${post.category}">${catLabel(post.category)}</span>
      <h1 class="article-title">${post.title}</h1>
      <div class="article-meta">
        <span>📅 ${formatDate(post.created_at)}</span>
        <span>⏱ ${post.read_time || 4} min czytania</span>
      </div>
    </div>
    ${post.image ? `<img class="article-image" src="${post.image}" alt="${post.title}">` : ''}
    <div class="article-body">${post.content || '<p>' + post.excerpt + '</p>'}</div>
    <div class="comments-section" id="commentsSection">
      <h3 class="comments-title">💬 Komentarze</h3>
      <div class="comment-form">
        <div class="comment-inputs">
          <input class="form-input" id="commentName"  type="text"  placeholder="Twoje imię (lub pseudonim)" maxlength="50">
          <input class="form-input" id="commentEmail" type="email" placeholder="Email (nie będzie widoczny)" maxlength="100">
        </div>
        <textarea class="form-input" id="commentText" placeholder="Napisz komentarz..." maxlength="1000"></textarea>
        <button class="submit-comment" onclick="submitComment('${post.slug}', '${(post.title||'').replace(/'/g,'')}')">Wyślij komentarz →</button>
      </div>
      <div class="comments-list" id="commentsList">
        <div class="loading-state"><div class="spinner"></div></div>
      </div>
    </div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  await loadComments(post.slug);
}

function closeModal() {
  document.getElementById('postModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── COMMENTS ─────────────────────────
async function loadComments(slug) {
  const list = document.getElementById('commentsList');
  if (!list) return;

  if (!supabase) {
    list.innerHTML = `<p class="no-comments">Komentarze dostępne po podłączeniu bazy danych.</p>`;
    return;
  }

  // tabela blog_comments (wspolna z monitorem rady + dashboardem Maxi Bot), klucz = slug
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('slug', slug)
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    list.innerHTML = `<p class="no-comments">Bądź pierwszy/a — dodaj komentarz!</p>`;
    return;
  }

  list.innerHTML = data.map(c => {
    const bot = c.is_bot;
    const who = bot ? '🌹 <strong>After Dark</strong>' : '👤 ' + escHtml(c.author_name || 'Gość');
    const style = bot ? 'border-left:3px solid #ff4d8d;padding-left:12px;margin-left:18px;' : '';
    return `
    <div class="comment-item" style="${style}">
      <div class="comment-header">
        <span class="comment-author">${who}</span>
        <span class="comment-date">${formatDate(c.created_at)}</span>
      </div>
      <p class="comment-text">${escHtml(c.body || '')}</p>
    </div>`;
  }).join('');
}

async function submitComment(slug, title) {
  const name  = document.getElementById('commentName')?.value?.trim();
  const text  = document.getElementById('commentText')?.value?.trim();

  if (!name || !text) { showToast('⚠️ Wpisz imię i treść komentarza'); return; }
  if (text.length < 10) { showToast('⚠️ Komentarz jest zbyt krótki'); return; }

  if (!supabase) { showToast('❌ Baza nie podłączona'); return; }

  const { error } = await supabase.from('blog_comments').insert({
    slug: slug, author_name: name, body: text, lang: 'pl', is_bot: false
  });
  if (error) { showToast('❌ Błąd wysyłania — spróbuj ponownie'); return; }

  document.getElementById('commentName').value  = '';
  const em = document.getElementById('commentEmail'); if (em) em.value = '';
  document.getElementById('commentText').value  = '';
  showToast('✅ Komentarz dodany — dziękujemy!');
  await loadComments(slug);  // odswiez liste (pokaze tez odpowiedz rady gdy dotrze)
}

// ── NEWSLETTER ────────────────────────
async function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const email = input.value.trim();
  if (!email) return;

  if (supabase) {
    await supabase.from('newsletter').insert({ email });
  }

  input.value = '';
  showToast('💌 Zapisano! Wkrótce się odezwiemy.');
}

// ── UTILS ─────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function catLabel(cat) {
  const labels = {
    zwiazki: 'Związki', zabawy: 'Zabawy', fantazje: 'Fantazje',
    porady: 'Porady', lifestyle: 'Lifestyle'
  };
  return labels[cat] || cat;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// Keyboard close
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── START ─────────────────────────────
document.addEventListener('DOMContentLoaded', init);
