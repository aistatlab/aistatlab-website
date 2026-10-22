/* Open Memory photos in a compact modal without leaving the page. */
(()=>{
 'use strict';
 const root=document.querySelector('#memoryResults');if(!root)return;
 const dialog=document.createElement('dialog');
 dialog.className='memory-viewer';
 dialog.setAttribute('aria-label','Memory photo');
 dialog.innerHTML='<button type="button" class="memory-viewer-close" aria-label="Close photo" autofocus>×</button><figure><img alt=""><div class="memory-viewer-controls"><button type="button" class="memory-viewer-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button type="button" class="memory-viewer-next" aria-label="Next photo"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div></figure>';
 document.body.append(dialog);
 const image=dialog.querySelector('img'),close=dialog.querySelector('button');
 const controls=dialog.querySelector('.memory-viewer-controls'),prev=dialog.querySelector('.memory-viewer-prev'),next=dialog.querySelector('.memory-viewer-next');
 let photos=[],index=0;
 const isPhoto=src=>src.startsWith('assets/img/memory/')&&!src.includes('..');
 function showPhoto(){
  const photo=photos[index];
  image.src=photo.src;image.alt=photo.alt;
  controls.hidden=photos.length<2;
 }
 function move(step){if(photos.length>1){index=(index+step+photos.length)%photos.length;showPhoto()}}
 prev.addEventListener('click',()=>move(-1));
 next.addEventListener('click',()=>move(1));
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();move(event.key==='ArrowLeft'?-1:1);
  }
 });
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{
  document.body.classList.remove('memory-viewer-open');
  image.removeAttribute('src');
  photos=[];index=0;
 });
 root.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link||!root.contains(link))return;
  const src=link.getAttribute('href')||'';
  if(!isPhoto(src))return;
  // Keep modified clicks available for people who explicitly request another tab.
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  const photo=link.querySelector('img');
  const card=link.closest('.memory-card');
  photos=Array.from(card?.querySelectorAll('.memory-thumbnails a')||[]).map(a=>({src:a.getAttribute('href')||'',alt:card?.querySelector('h3')?.textContent||''})).filter(p=>isPhoto(p.src));
  if(!photos.some(p=>p.src===src))photos.unshift({src,alt:photo?.alt||''});
  index=photos.findIndex(p=>p.src===src);
  const ko=document.documentElement.lang==='ko';
  dialog.setAttribute('aria-label',ko?'Memory 사진':'Memory photo');
  close.setAttribute('aria-label',ko?'사진 닫기':'Close photo');
  prev.setAttribute('aria-label',ko?'이전 사진':'Previous photo');
  next.setAttribute('aria-label',ko?'다음 사진':'Next photo');
  showPhoto();
  document.body.classList.add('memory-viewer-open');
  dialog.showModal();
 });
})();
