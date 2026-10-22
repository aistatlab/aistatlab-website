/* Public seminar archive. Keep source records in data/seminar.js. */
(()=>{
 'use strict';
 const root=document.querySelector('#seminar');if(!root)return;
 const entries=Array.isArray(window.LAB_SEMINARS)?window.LAB_SEMINARS:[];
 const search=root.querySelector('#seminarSearch'),year=root.querySelector('#seminarYear');
 const results=root.querySelector('#seminarResults'),count=root.querySelector('#seminarCount'),more=root.querySelector('#seminarMore');
 let expanded=false;
 const labels={en:{lead:'Paper discussions, architecture reviews, and presentation materials from our lab.',search:'Search titles, presenters, or topics…',all:'All years',unknown:'Date not listed',presenter:'Presenter',pdf:'Open slides · PDF ↗',article:'Read review ↗',external:'View material ↗',missing:'Material link not listed',paper:'Paper review',architecture:'Architecture review',more:'Show all seminars',less:'Show fewer',empty:'No seminars match your filters.',records:'seminars',source:'Original seminar archive ↗'},ko:{lead:'연구실 논문 리뷰, 아키텍처 분석과 발표 자료를 모았습니다.',search:'제목, 발표자, 주제 검색…',all:'전체 연도',unknown:'날짜 미기재',presenter:'발표자',pdf:'발표 자료 · PDF ↗',article:'리뷰 읽기 ↗',external:'자료 보기 ↗',missing:'자료 링크 미기재',paper:'논문 리뷰',architecture:'아키텍처 리뷰',more:'세미나 전체 보기',less:'접기',empty:'검색 조건에 맞는 세미나가 없습니다.',records:'건',source:'기존 세미나 목록 ↗'}};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validUrl=url=>/^https:\/\//i.test(url||'')||/^(?:assets\/seminar\/[A-Za-z0-9_-]+\.pdf|blog\/[a-z0-9_-]+\/)$/i.test(url||'');
 function render(){
  const ko=document.documentElement.lang==='ko',t=labels[ko?'ko':'en'];
  root.querySelector('.seminar-lead').textContent=t.lead;
  root.querySelector('.seminar-source').textContent=t.source;
  search.placeholder=t.search;search.setAttribute('aria-label',t.search);year.setAttribute('aria-label',t.all);
  const selected=year.value||'all';
  const years=[...new Set(entries.map(e=>e.date.slice(0,4)).filter(Boolean))].sort().reverse();
  year.innerHTML=`<option value="all">${esc(t.all)}</option>`+years.map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('')+`<option value="unknown">${esc(t.unknown)}</option>`;
  year.value=selected;
  const query=search.value.trim().toLocaleLowerCase();
  const chosen=entries.filter(e=>(selected==='all'||(selected==='unknown'?!e.date:e.date.startsWith(selected)))&&(!query||[e.title,e.presenter,...e.topics].join(' ').toLocaleLowerCase().includes(query)));
  count.textContent=ko?`${chosen.length}${t.records}`:`${chosen.length} ${t.records}`;
  more.hidden=chosen.length<=10;more.setAttribute('aria-expanded',String(expanded));more.textContent=expanded?t.less:`${t.more} (${chosen.length})`;
  results.innerHTML=chosen.length?(expanded?chosen:chosen.slice(0,10)).map(e=>{
   const material=validUrl(e.url)?`<a class="text-link" href="${esc(e.url)}"${e.format==='pdf'||e.format==='external'?' target="_blank" rel="noopener noreferrer"':''}>${esc(t[e.format]||t.external)}</a>`:`<span class="seminar-unavailable">${esc(t.missing)}</span>`;
   return `<article class="seminar-card"><div class="seminar-meta"><span>${esc(t[e.type])}</span>${e.date?`<time datetime="${esc(e.date)}">${esc(e.date.replaceAll('-','.'))}</time>`:`<span>${esc(t.unknown)}</span>`}</div><h3>${esc(e.title)}</h3>${e.topics.length?`<ul>${e.topics.map(topic=>`<li>${esc(topic)}</li>`).join('')}</ul>`:''}<div class="seminar-card-footer">${e.presenter?`<span>${esc(t.presenter)} · ${esc(e.presenter)}</span>`:''}${material}</div></article>`;
  }).join(''):`<p class="blog-empty">${esc(t.empty)}</p>`;
 }
 const reset=()=>{expanded=false;render()};
 search.addEventListener('input',reset);year.addEventListener('change',reset);
 more.addEventListener('click',()=>{expanded=!expanded;render();if(!expanded)root.scrollIntoView({block:'start'})});
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 render();
})();
