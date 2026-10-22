/* Local professor profile, transcribed from the laboratory's professor page. */
(()=>{
 'use strict';
 const trigger=document.querySelector('[data-professor-profile]');if(!trigger)return;
 const dialog=document.createElement('dialog');
 dialog.className='professor-profile';dialog.id='professorProfile';
 dialog.setAttribute('aria-labelledby','professorProfileName');
 dialog.innerHTML=`<button class="professor-profile-close" type="button" aria-label="Close profile" autofocus>×</button>
  <div class="professor-profile-intro"><img src="assets/img/professor-lim_full.jpg" alt="Professor Changwon Lim" width="280" loading="lazy"><div>
   <span class="eyebrow">PRINCIPAL INVESTIGATOR</span><h2 id="professorProfileName">Changwon Lim <span>임창원</span></h2><p class="professor-profile-position">Ph.D. · Professor, Chung-Ang University</p>
   <p>Department of Applied Statistics<br>Department of Statistics and Data Science<br>Data Science Convergence Research Center<br>Institute for Community Care and Health Equity</p>
   <address>84 Heukseok-Ro, Dongjak-Gu, Seoul 06974, Korea<br><a class="text-link" href="mailto:clim@cau.ac.kr">clim@cau.ac.kr ↗</a><br><a href="tel:+8228205547">+82-2-820-5547</a></address>
  </div></div>
  <section><h3 data-profile-heading="education">Education</h3><dl class="professor-profile-history">
   <div><dt>May 2009</dt><dd><strong>Ph.D. in Statistics</strong><span>University of North Carolina at Chapel Hill, NC, USA</span></dd></div>
   <div><dt>August 2004</dt><dd><strong>M.S. in Statistics</strong><span>Seoul National University, Seoul, Korea</span></dd></div>
   <div><dt>February 2000</dt><dd><strong>B.S. in Statistics</strong><span>Seoul National University, Seoul, Korea</span></dd></div>
  </dl></section>
  <section><h3 data-profile-heading="employment">Professional Employment</h3><dl class="professor-profile-history">
   <div><dt>2023–present</dt><dd><strong>CEO</strong><span>GlobeAI, Seoul, Korea</span></dd></div>
   <div><dt>2022–present</dt><dd><strong>Professor</strong><span>Chung-Ang University, Seoul, Korea</span></dd></div>
   <div><dt>2017–2021</dt><dd><strong>Associate Professor</strong><span>Chung-Ang University, Seoul, Korea</span></dd></div>
   <div><dt>2014–2016</dt><dd><strong>Assistant Professor</strong><span>Chung-Ang University, Seoul, Korea</span></dd></div>
   <div><dt>2011–2013</dt><dd><strong>Assistant Professor</strong><span>Loyola University Chicago, Chicago, IL, USA</span></dd></div>
   <div><dt>2009–2011</dt><dd><strong>Postdoctoral Research Fellow</strong><span>Biostatistics Branch, NIEHS, Research Triangle Park, NC, USA</span></dd></div>
  </dl></section>`;
 document.body.append(dialog);
 const close=dialog.querySelector('.professor-profile-close');
 trigger.addEventListener('click',()=>{
  const ko=document.documentElement.lang==='ko';
  close.setAttribute('aria-label',ko?'프로필 닫기':'Close profile');
  dialog.querySelector('[data-profile-heading="education"]').textContent=ko?'학력':'Education';
  dialog.querySelector('[data-profile-heading="employment"]').textContent=ko?'주요 경력':'Professional Employment';
  document.body.classList.add('professor-profile-open');
  dialog.showModal();dialog.scrollTop=0;
 });
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>document.body.classList.remove('professor-profile-open'));
})();
