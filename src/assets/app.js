const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

// GANTI dengan URL halaman Facebook resmi lo:
const FB_PAGE = 'https://www.facebook.com/profile.php?id=61593374852564';

// Safe storage: jangan bikin situs mati di private mode / storage disabled
const store = (()=>{
  let ok=true; try{const k='__bn__';localStorage.setItem(k,'1');localStorage.removeItem(k)}catch(e){ok=false}
  const mem={};
  return {
    get:k=>{try{return ok?localStorage.getItem(k):(k in mem?mem[k]:null)}catch(e){return mem[k]??null}},
    set:(k,v)=>{try{ok?localStorage.setItem(k,v):(mem[k]=v)}catch(e){mem[k]=v}}
  };
})();

// Mobile menu
const menu=$('.menu'), nav=$('.navlinks'); if(menu&&nav) menu.onclick=()=>nav.classList.toggle('open');

// Reveal countdown demo: N days from first visit, persisted per key
function getRevealDate(key='bn_reveal_main', days=7){
  let d=store.get(key); if(!d){d=new Date(Date.now()+days*86400000).toISOString();store.set(key,d)} return new Date(d)
}
function updateCountdown(){
  $$('.countdown,[data-countdown]').forEach(el=>{
    const target=getRevealDate(el.dataset.key||'bn_reveal_main', Number(el.dataset.days||7));
    let ms=Math.max(0,target-Date.now()); const d=Math.floor(ms/86400000); ms%=86400000; const h=Math.floor(ms/3600000); ms%=3600000; const m=Math.floor(ms/60000);
    el.textContent=`${d} hari ${h} jam ${m} menit`;
  })
}
updateCountdown(); setInterval(updateCountdown,60000);

// Riddle answer voting (demo)
$$('[data-vote]').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.vote; const k='bn_vote_'+id; if(store.get(k)) return alert('Lo udah ikut jawab riddle ini.');
  store.set(k,btn.dataset.choice||'jawab');
  let score=Number(store.get('bn_score')||0)+10; store.set('bn_score',score);
  alert('Jawaban lo disimpan. +10 poin. Reveal tetap nunggu komunitas.');
}));

// Comment system (local demo)
const commentForm=$('#commentForm'); if(commentForm){
  const list=$('#commentList'); const key='bn_comments';
  const render=()=>{const data=JSON.parse(store.get(key)||'[]'); list.innerHTML=data.map(x=>`<div class="comment"><b>${escapeHtml(x.name)}</b><small> • baru saja</small><div>${escapeHtml(x.text)}</div></div>`).join('')||'<p style="color:#8b8883">Belum ada komentar. Jadi yang pertama curiga.</p>'};
  render(); commentForm.addEventListener('submit',e=>{e.preventDefault();const data=JSON.parse(store.get(key)||'[]');data.unshift({name:commentForm.name.value||'Anonim',text:commentForm.comment.value});store.set(key,JSON.stringify(data));commentForm.reset();render()})
}

// Submission form (local demo)
const submitForm=$('#submitStory'); if(submitForm){submitForm.addEventListener('submit',e=>{e.preventDefault();const data=JSON.parse(store.get('bn_submissions')||'[]');data.push({title:submitForm.title.value,category:submitForm.category.value,story:submitForm.story.value,date:new Date().toISOString()});store.set('bn_submissions',JSON.stringify(data));submitForm.reset();$('#submitStatus').textContent='Cerita masuk. Tim BARU NGEH bakal review dulu sebelum tayang.'})}

// Share buttons -> real FB/WhatsApp intents based on current page
$$('[data-share]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  const url=encodeURIComponent(location.href);
  const text=encodeURIComponent(document.title+' — baca di BARU NGEH');
  const type=a.dataset.share;
  const href = type==='whatsapp'
    ? `https://wa.me/?text=${text}%20${url}`
    : `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(href,'_blank','noopener,width=640,height=560');
}));

// Facebook page links
$$('[data-fb]').forEach(a=>{ a.href=FB_PAGE; a.target='_blank'; a.rel='noopener'; });

function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}

// Category / difficulty filters
(function(){
  const chips=$$('.filterbar .chip[data-filter]');
  if(!chips.length) return;
  const items=$$('[data-tags]');
  const apply=tok=>items.forEach(it=>{const t=(it.dataset.tags||'').split(' ');it.style.display=(tok==='all'||t.includes(tok))?'':'none'});
  chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('active'));c.classList.add('active');apply(c.dataset.filter)}));
  const def=$('.filterbar .chip.active[data-filter]')||chips[0]; def.classList.add('active'); apply(def.dataset.filter);
})();

// Cookie / storage consent (needed once you run ads)
(function(){
  if(store.get('bn_consent')) return;
  const bar=document.createElement('div'); bar.className='cookiebar';
  bar.innerHTML='<span>BARU NGEH pakai cookie & penyimpanan lokal buat fitur komunitas dan (nantinya) iklan. <a href="/kebijakan-privasi/">Selengkapnya</a>.</span><button class="btn primary" type="button">Oke, ngerti</button>';
  document.body.appendChild(bar);
  bar.querySelector('button').onclick=()=>{store.set('bn_consent','1');bar.remove()};
})();
