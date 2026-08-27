const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

// Halaman Facebook resmi BARU NGEH
const FB_PAGE = 'https://www.facebook.com/profile.php?id=61593374852564';

// Safe storage
const store = (() => {
  let ok = true;

  try {
    const k = '__bn__';
    localStorage.setItem(k,'1');
    localStorage.removeItem(k);
  } catch(e) {
    ok = false;
  }

  const mem = {};

  return {
    get: k => {
      try {
        return ok
          ? localStorage.getItem(k)
          : (k in mem ? mem[k] : null);
      } catch(e) {
        return mem[k] ?? null;
      }
    },

    set: (k,v) => {
      try {
        ok
          ? localStorage.setItem(k,v)
          : (mem[k] = v);
      } catch(e) {
        mem[k] = v;
      }
    }
  };
})();


// ==========================================================
// MOBILE MENU
// ==========================================================

const menu = $('.menu');
const nav = $('.navlinks');

if(menu && nav){
  menu.onclick = () => nav.classList.toggle('open');
}


// ==========================================================
// RIDDLE REVEAL
// ==========================================================

// Sistem lama.
// Tetap dipakai sementara untuk riddle lama yang masih
// menggunakan revealDays.
function getRevealDate(key='bn_reveal_main', days=7){
  let d = store.get(key);

  if(!d){
    d = new Date(
      Date.now() + days * 86400000
    ).toISOString();

    store.set(key,d);
  }

  return new Date(d);
}


// Format countdown.
function countdownText(ms){
  ms = Math.max(0, ms);

  const days = Math.floor(ms / 86400000);
  ms %= 86400000;

  const hours = Math.floor(ms / 3600000);
  ms %= 3600000;

  const minutes = Math.floor(ms / 60000);
  ms %= 60000;

  const seconds = Math.floor(ms / 1000);

  return `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
}


function updateCountdown(){

  // ========================================================
  // SISTEM BARU
  // revealAt = tanggal absolut yang sama untuk semua orang
  // ========================================================

  $$('[data-reveal-at]').forEach(block => {

    const target = new Date(block.dataset.revealAt);

    const locked = $('[data-reveal-locked]', block);
    const answer = $('[data-reveal-answer]', block);
    const countdown = $('[data-countdown]', block);

    // Kalau tanggal invalid.
    if(Number.isNaN(target.getTime())){
      if(countdown){
        countdown.textContent = 'Tanggal reveal belum valid.';
      }

      return;
    }

    const remaining =
      target.getTime() - Date.now();


    // Waktu reveal sudah tiba.
    if(remaining <= 0){

      if(locked){
        locked.hidden = true;
      }

      if(answer){
        answer.hidden = false;
      }

      return;
    }


    // Reveal belum tiba.
    if(locked){
      locked.hidden = false;
    }

    if(answer){
      answer.hidden = true;
    }

    if(countdown){
      countdown.textContent =
        countdownText(remaining);
    }

  });


  // ========================================================
  // FALLBACK SISTEM LAMA
  // Untuk riddle lama yang masih pakai revealDays
  // ========================================================

  $$('.countdown[data-days]').forEach(el => {

    const target = getRevealDate(
      el.dataset.key || 'bn_reveal_main',
      Number(el.dataset.days || 7)
    );

    const remaining =
      target.getTime() - Date.now();

    el.textContent =
      countdownText(remaining);

  });

}


// Jalankan langsung.
updateCountdown();

// Update tiap detik.
setInterval(updateCountdown, 1000);


// ==========================================================
// RIDDLE ANSWER VOTING
// Masih local/demo untuk sekarang.
// ==========================================================

$$('[data-vote]').forEach(btn =>
  btn.addEventListener('click', () => {

    const id = btn.dataset.vote;
    const k = 'bn_vote_' + id;

    if(store.get(k)){
      return alert(
        'Lo udah ikut jawab riddle ini.'
      );
    }

    store.set(
      k,
      btn.dataset.choice || 'jawab'
    );

    let score =
      Number(store.get('bn_score') || 0) + 10;

    store.set('bn_score',score);

    alert(
      'Jawaban lo disimpan. +10 poin. Reveal tetap nunggu komunitas.'
    );

  })
);


// ==========================================================
// COMMENT SYSTEM
// Masih local/demo untuk sekarang.
// ==========================================================

const commentForm = $('#commentForm');

if(commentForm){

  const list = $('#commentList');

  const key =
    'bn_comments_' +
    location.pathname.replace(/\W+/g,'_');


  const render = () => {

    const data =
      JSON.parse(store.get(key) || '[]');

    list.innerHTML =
      data.map(x => `
        <div class="comment">
          <b>${escapeHtml(x.name)}</b>
          <small> • baru saja</small>
          <div>${escapeHtml(x.text)}</div>
        </div>
      `).join('')
      ||
      '<p style="color:#8b8883">Belum ada komentar. Jadi yang pertama curiga.</p>';

  };


  render();


  commentForm.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      const data =
        JSON.parse(store.get(key) || '[]');

      data.unshift({
        name:
          commentForm.name.value ||
          'Anonim',

        text:
          commentForm.comment.value
      });

      store.set(
        key,
        JSON.stringify(data)
      );

      commentForm.reset();

      render();

    }
  );
}


// ==========================================================
// SHARE BUTTONS
// ==========================================================

$$('[data-share]').forEach(a =>
  a.addEventListener('click', e => {

    e.preventDefault();

    const url =
      encodeURIComponent(location.href);

    const text =
      encodeURIComponent(
        document.title +
        ' — baca di BARU NGEH'
      );

    const type =
      a.dataset.share;

    const href =
      type === 'whatsapp'

        ? `https://wa.me/?text=${text}%20${url}`

        : `https://www.facebook.com/sharer/sharer.php?u=${url}`;


    window.open(
      href,
      '_blank',
      'noopener,width=640,height=560'
    );

  })
);


// ==========================================================
// FACEBOOK PAGE
// ==========================================================

$$('[data-fb]').forEach(a => {

  a.href = FB_PAGE;
  a.target = '_blank';
  a.rel = 'noopener';

});


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(s=''){

  return s.replace(
    /[&<>'"]/g,
    c => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      "'":'&#039;',
      '"':'&quot;'
    }[c])
  );

}


// ==========================================================
// CATEGORY / DIFFICULTY FILTER
// ==========================================================

(function(){

  const chips =
    $$('.filterbar .chip[data-filter]');

  if(!chips.length){
    return;
  }

  const items =
    $$('[data-tags]');


  const apply = tok =>
    items.forEach(it => {

      const tags =
        (it.dataset.tags || '')
        .split(' ');

      it.style.display =
        (
          tok === 'all' ||
          tags.includes(tok)
        )
        ? ''
        : 'none';

    });


  chips.forEach(c =>
    c.addEventListener('click', () => {

      chips.forEach(x =>
        x.classList.remove('active')
      );

      c.classList.add('active');

      apply(c.dataset.filter);

    })
  );


  const def =
    $('.filterbar .chip.active[data-filter]')
    || chips[0];

  def.classList.add('active');

  apply(def.dataset.filter);

})();


// ==========================================================
// COOKIE / STORAGE CONSENT
// ==========================================================

(function(){

  if(store.get('bn_consent')){
    return;
  }

  const bar =
    document.createElement('div');

  bar.className =
    'cookiebar';

  bar.innerHTML = `
    <span>
      BARU NGEH pakai cookie & penyimpanan lokal
      buat fitur komunitas dan (nantinya) iklan.
      <a href="/kebijakan-privasi/">
        Selengkapnya
      </a>.
    </span>

    <button
      class="btn primary"
      type="button"
    >
      Oke, ngerti
    </button>
  `;

  document.body.appendChild(bar);


  bar.querySelector('button')
    .onclick = () => {

      store.set(
        'bn_consent',
        '1'
      );

      bar.remove();

    };

})();
