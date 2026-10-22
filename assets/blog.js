/* AI Stat Lab Blog: read-only public article listing. Editing is performed in Pages CMS. */
(()=>{
 'use strict';
 const root=document.querySelector('#blog');if(!root)return;
 const entries=Array.isArray(window.AISTAT_BLOG)?window.AISTAT_BLOG:[];
 const search=root.querySelector('#blogSearch'),category=root.querySelector('#blogCategory');
 const count=root.querySelector('#blogCount'),results=root.querySelector('#blogResults');
 const more=root.querySelector('#blogMore');
 const pageSize=10;let expanded=false;
 const languages={en:{all:'All topics',search:'Search posts, authors, or topics…',posts:'posts',empty:'No posts match your filters.',read:'Read article',latest:'Latest stories',more:'Show all posts',less:'Show fewer',topics:{'Research Insights':'Research Insights','Technical Notes':'Technical Notes','Lab Stories':'Lab Stories','Tutorials':'Tutorials','Paper Review':'Paper Review','Projects':'Projects','Statistics':'Statistics','기타':'Other','Uncategorized':'Uncategorized'}},ko:{all:'전체 분야',search:'글 제목, 작성자, 주제 검색…',posts:'개의 글',empty:'검색 조건에 해당하는 게시글이 없습니다.',read:'글 읽기',latest:'최신 게시글',more:'글 전체 보기',less:'접기',topics:{'Research Insights':'연구 인사이트','Technical Notes':'기술 노트','Lab Stories':'연구실 이야기','Tutorials':'튜토리얼','Paper Review':'논문 리뷰','Projects':'프로젝트','Statistics':'통계학','기타':'기타','Uncategorized':'미분류'}}};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const lang=()=>document.documentElement.lang==='ko'?'ko':'en';
 const safeCover=v=>/^assets\/img\/blog\/[\w./-]+\.(webp|png|jpe?g|gif)$/i.test(v||'')&&!String(v).includes('..');
 const articleLink=s=>/^[a-z0-9][a-z0-9_-]*$/.test(s||'')?`blog/${s}/`:'#blog';
 function render(){
  const t=languages[lang()];search.placeholder=t.search;
  const selected=category.value||'all';
  category.innerHTML='<option value="all">'+esc(t.all)+'</option>'+Object.keys(t.topics).map(k=>`<option value="${esc(k)}">${esc(t.topics[k])}</option>`).join('');
  category.value=selected in t.topics||selected==='all'?selected:'all';
  const q=search.value.toLocaleLowerCase().trim();
  const chosen=entries.filter(p=>(selected==='all'||p.category===selected)&&(!q||[p.title,p.summary,p.author,p.category].join(' ').toLocaleLowerCase().includes(q)));
  count.textContent=lang()==='ko'?`${chosen.length}${t.posts}`:`${chosen.length} ${t.posts}`;
  more.hidden=chosen.length<=pageSize;
  more.setAttribute('aria-expanded',String(expanded));
  more.textContent=expanded?t.less:`${t.more} (${chosen.length})`;
  if(!chosen.length){results.innerHTML=`<div class="blog-empty">${esc(t.empty)}</div>`;return;}
  results.innerHTML=(expanded?chosen:chosen.slice(0,pageSize)).map((p,i)=>{
   const cover=safeCover(p.cover)?`<img loading="lazy" src="${esc(p.cover)}" alt="" decoding="async">`:`<span class="blog-card-pattern" aria-hidden="true">${['∑','◈','✳','≋'][i%4]}</span>`;
   return `<article class="blog-card"><a class="blog-card-cover" href="${esc(articleLink(p.slug))}" aria-label="${esc(p.title)}">${cover}<span class="blog-cover-index">${String(i+1).padStart(2,'0')}</span></a><div class="blog-card-body"><span class="blog-card-topic">${esc(t.topics[p.category]||p.category)} · ${p.language==='ko'?'KO':'EN'}</span><h3><a href="${esc(articleLink(p.slug))}">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p><div class="blog-card-footer"><span>${esc(p.date)} <span aria-hidden="true">·</span> ${esc(p.author)}</span><a href="${esc(articleLink(p.slug))}" aria-label="${esc(t.read)}: ${esc(p.title)}">↗</a></div></div></article>`;
  }).join('');
 }
 const reset=()=>{expanded=false;render()};
 search.addEventListener('input',reset);category.addEventListener('change',reset);
 more.addEventListener('click',()=>{expanded=!expanded;render();if(!expanded)root.scrollIntoView({block:'start'})});
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 render();
})();
