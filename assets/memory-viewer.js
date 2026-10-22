/* Open Memory photos in a compact modal without leaving the page. */
(()=>{
 'use strict';
 const root=document.querySelector('#memoryResults');if(!root)return;
 const dialog=document.createElement('dialog');
 dialog.className='memory-viewer';
 dialog.setAttribute('aria-labelledby','memoryViewerCaption');
 dialog.innerHTML='<button type="button" class="memory-viewer-close" aria-label="Close photo" autofocus>×</button><figure><img alt=""><figcaption id="memoryViewerCaption"></figcaption></figure>';
 document.body.append(dialog);
 const image=dialog.querySelector('img'),caption=dialog.querySelector('figcaption'),close=dialog.querySelector('button');
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{
  document.body.classList.remove('memory-viewer-open');
  image.removeAttribute('src');
 });
 root.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link||!root.contains(link))return;
  const src=link.getAttribute('href')||'';
  if(!src.startsWith('assets/img/memory/')||src.includes('..'))return;
  // Keep modified clicks available for people who explicitly request another tab.
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  const photo=link.querySelector('img');
  image.src=src;image.alt=photo?.alt||'';caption.textContent=image.alt;
  close.setAttribute('aria-label',document.documentElement.lang==='ko'?'사진 닫기':'Close photo');
  document.body.classList.add('memory-viewer-open');
  dialog.showModal();
 });
})();
