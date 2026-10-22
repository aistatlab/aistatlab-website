/* AI Stat Lab homepage carousel — keep research imagery and text together.
   Add or replace images in index.html and edit bilingual captions below. */
(()=>{
  'use strict';
  const root=document.getElementById('heroCarousel');
  if(!root)return;
  const slides=[...root.querySelectorAll('[data-hero-slide]')];
  if(slides.length<2)return;
  const controls=document.getElementById('heroSliderControls');
  const dotWrap=document.getElementById('heroSlideDots');
  const prev=document.getElementById('heroSlidePrev');
  const next=document.getElementById('heroSlideNext');
  const pause=document.getElementById('heroSlidePause');
  const counter=document.getElementById('heroSlideCounter');
  const status=document.getElementById('heroSlideStatus');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const DELAY=6000;
  const captions=[
    {en:['AI STAT LAB','At the intersection of AI & Statistics','Chung-Ang University · Seoul','AI and Statistics Lab concept illustration inspired by Chung-Ang University'],ko:['AI STAT LAB','인공지능과 통계학의 만남','중앙대학교 · 서울','중앙대학교를 모티브로 한 AI·통계 연구실 콘셉트 이미지']},
    {en:['ORIGINAL HOMEPAGE','AI Statistics in Seoul','The city · Data · Discovery','AI and Statistics Lab concept art overlooking Seoul at sunset'],ko:['AI STAT LAB','서울의 AI·통계 연구','도시 · 데이터 · 새로운 발견','서울 노을 풍경을 배경으로 한 AI·통계 연구실 콘셉트 이미지']},
    {en:['ORIGINAL HOMEPAGE','Intelligence Beyond Boundaries','Artificial intelligence meets statistical thinking','AI and Statistics Lab futuristic Seoul night skyline concept illustration'],ko:['AI STAT LAB','경계를 넘는 지능','인공지능과 통계적 사고의 만남','미래 도시 야경을 배경으로 한 AI·통계 연구실 콘셉트 이미지']},
    {en:['MEDICAL AI','Medical & Healthcare AI','Clinical data · medical imaging · patient trajectories','Abstract visualization of healthcare AI and biological signals'],ko:['의료 인공지능','의료·헬스케어 AI','임상 데이터 · 의료영상 · 환자 경과 예측','의료 AI 및 생체신호를 표현한 추상 시각화']},
    {en:['COMPUTER VISION','Computer Vision & Industrial AI','Visual intelligence for complex environments','Abstract computer vision scene with visual tracking boxes'],ko:['컴퓨터 비전','컴퓨터 비전·산업 AI','복잡한 환경을 이해하는 영상 인공지능','객체 추적과 컴퓨터 비전을 표현한 추상 시각화']},
    {en:['AUDIO & LANGUAGE AI','Audio & Multimodal Intelligence','Acoustic understanding · audio question answering','Abstract audio waveform and multimodal sound visualization'],ko:['오디오·언어 AI','오디오·멀티모달 지능','음향 이해 · 오디오 질의응답','오디오 파형 및 멀티모달 분석을 표현한 추상 시각화']},
    {en:['STATISTICAL LEARNING','Statistics & Machine Learning','Inference · uncertainty · data-driven discovery','Abstract statistical curves and uncertainty visualization'],ko:['통계적 기계학습','통계학·기계학습','통계적 추론 · 불확실성 · 데이터 기반 탐구','확률곡선과 불확실성을 표현한 추상 통계 시각화']}
  ];
  let index=0,timer=null,userPaused=motion.matches,hovered=false,focused=false;
  const l=()=>document.documentElement.lang==='ko'?'ko':'en';
  const number=n=>String(n).padStart(2,'0');
  function translate(){
    const ko=l()==='ko';
    root.setAttribute('aria-label',ko?'주요 연구 분야 이미지 슬라이드쇼':'Featured research areas');
    dotWrap.setAttribute('aria-label',ko?'슬라이드 선택':'Choose a slide');
    prev.setAttribute('aria-label',ko?'이전 이미지':'Previous slide');
    next.setAttribute('aria-label',ko?'다음 이미지':'Next slide');
    const stop=ko?'슬라이드쇼 일시정지':'Pause slideshow';
    const resume=ko?'슬라이드쇼 재생':'Resume slideshow';
    pause.setAttribute('aria-label',userPaused?resume:stop);
    [prev,next,pause].forEach(b=>{b.title=b.getAttribute('aria-label')});
    slides.forEach((el,i)=>{
      const d=captions[i]?.[l()];if(!d)return;
      const [kicker,title,description,alt]=d;
      el.querySelector('.hero-caption-kicker').textContent=kicker;
      el.querySelector('.hero-caption-title').textContent=title;
      el.querySelector('.hero-caption-description').textContent=description;
      el.querySelector('img').alt=alt;
      el.setAttribute('aria-label',ko?`${i+1}/${slides.length}: ${title}`:`${i+1} of ${slides.length}: ${title}`);
    });
    [...dotWrap.children].forEach((b,i)=>b.setAttribute('aria-label',ko?`${i+1}번 이미지 보기`:`Show slide ${i+1}`));
  }
  function render(userAction=false){
    slides.forEach((el,i)=>{
      const active=i===index;
      el.classList.toggle('is-active',active);
      el.setAttribute('aria-hidden',String(!active));
    });
    [...dotWrap.children].forEach((el,i)=>{
      const active=i===index;
      el.classList.toggle('is-active',active);
      el.setAttribute('aria-current',active?'true':'false');
    });
    counter.textContent=`${number(index+1)} / ${number(slides.length)}`;
    const following=slides[(index+1)%slides.length].querySelector('img');
    if(following&&following.loading==='lazy')following.loading='eager';
    if(userAction){status.setAttribute('aria-live','polite');status.textContent=slides[index].querySelector('.hero-caption-title').textContent;}
    else{status.setAttribute('aria-live','off');}
  }
  function stopTimer(){if(timer!==null){clearTimeout(timer);timer=null;}}
  function canAutoPlay(){return !userPaused&&!motion.matches&&!hovered&&!focused&&!document.hidden;}
  function schedule(){
    stopTimer();
    if(!canAutoPlay())return;
    timer=setTimeout(()=>{index=(index+1)%slides.length;render();schedule();},DELAY);
  }
  function updatePause(){
    pause.textContent=userPaused?'▶':'Ⅱ';
    pause.setAttribute('aria-pressed',String(userPaused));
    translate();
    schedule();
  }
  function move(i,manual=false){
    index=(i+slides.length)%slides.length;
    if(manual)userPaused=true;
    render(manual);
    updatePause();
  }
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='hero-slide-dot';
    b.setAttribute('aria-label',`Show slide ${i+1}`);
    b.addEventListener('click',()=>move(i,true));
    dotWrap.appendChild(b);
  });
  prev.addEventListener('click',()=>move(index-1,true));
  next.addEventListener('click',()=>move(index+1,true));
  pause.addEventListener('click',()=>{userPaused=!userPaused;updatePause();});
  root.addEventListener('mouseenter',()=>{hovered=true;schedule();});
  root.addEventListener('mouseleave',()=>{hovered=false;schedule();});
  root.addEventListener('focusin',()=>{focused=true;schedule();});
  root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){focused=false;schedule();}});
  root.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();move(index+1,true);}
    if(e.key==='ArrowLeft'){e.preventDefault();move(index-1,true);}
  });
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener?.('change',()=>{if(motion.matches)userPaused=true;updatePause();});
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  controls.hidden=false;
  render();updatePause();
})();
