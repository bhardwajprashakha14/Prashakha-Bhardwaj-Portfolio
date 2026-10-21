(function(){
  var doc=document, body=doc.body;
  var nav=doc.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('solid', window.scrollY>20); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  var menuBtn=doc.querySelector('.menu-btn'), menu=doc.getElementById('site-menu');
  function setMenu(open){
    if(!menuBtn||!menu) return;
    menuBtn.setAttribute('aria-expanded', open?'true':'false');
    menu.classList.toggle('open', open);
    if(nav) nav.classList.toggle('menu-open', open);
  }
  if(menuBtn&&menu){
    menuBtn.addEventListener('click',function(){ setMenu(menuBtn.getAttribute('aria-expanded')!=='true'); });
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown',function(e){ if(e.key==='Escape'&&menu.classList.contains('open')){ setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize',function(){ if(window.innerWidth>820) setMenu(false); });
  }

  // reveal on scroll (content is visible without JS; see .js .rv in CSS)
  var els=[].slice.call(doc.querySelectorAll('.rv'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
  // reveal anything targeted by a hash link right away
  function revealHash(){ var t=location.hash&&doc.getElementById(location.hash.slice(1)); if(t){ [].forEach.call(t.querySelectorAll('.rv'),function(el){el.classList.add('in')}); t.classList.add('in'); } }
  window.addEventListener('hashchange',revealHash); revealHash();

  // table of contents highlight
  var links=[].slice.call(doc.querySelectorAll('.toc a, .nav-links a[href^="#"]'));
  var secs=links.map(function(a){return doc.querySelector(a.getAttribute('href'))}).filter(Boolean);
  var tocList=doc.querySelector('.toc-list');
  if(secs.length && 'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){
        var id='#'+e.target.id;
        links.forEach(function(a){
          var on=a.getAttribute('href')===id;
          a.classList.toggle('on',on);
          if(on){ a.setAttribute('aria-current','true');
            if(tocList&&tocList.contains(a)&&tocList.scrollWidth>tocList.clientWidth){ tocList.scrollTo({left:a.offsetLeft-18,behavior:reduce?'auto':'smooth'}); }
          } else a.removeAttribute('aria-current');
        });
      }
    })},{rootMargin:'-35% 0px -60% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  // accessible lightbox
  var triggers=[].slice.call(doc.querySelectorAll('.zoom'));
  if(triggers.length){
    var lb=doc.createElement('div');
    lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-labelledby','lb-title'); lb.hidden=true;
    lb.innerHTML='<div class="lb-bar"><p id="lb-title"></p><div class="lb-actions"><a class="lb-open" target="_blank" rel="noopener">Open original ↗</a><button type="button" class="lb-close" aria-label="Close enlarged image">&times;</button></div></div><div class="lb-stage"><img alt=""></div>';
    body.appendChild(lb);
    var big=lb.querySelector('img'), title=lb.querySelector('#lb-title'), closeBtn=lb.querySelector('.lb-close'), openLink=lb.querySelector('.lb-open'), stage=lb.querySelector('.lb-stage');
    var lastTrigger=null;
    function open(btn){
      var img=btn.querySelector('img');
      lastTrigger=btn;
      big.src=btn.getAttribute('data-full')||img.currentSrc||img.src;
      big.alt=img.alt;
      title.textContent=img.alt;
      openLink.href=big.src;
      lb.hidden=false; lb.classList.add('open'); stage.scrollTop=0;
      body.classList.add('lb-lock');
      closeBtn.focus();
    }
    function close(){
      if(lb.hidden) return;
      lb.classList.remove('open'); lb.hidden=true; body.classList.remove('lb-lock');
      big.removeAttribute('src');
      if(lastTrigger) lastTrigger.focus();
    }
    triggers.forEach(function(b){ b.addEventListener('click',function(){ open(b); }); });
    closeBtn.addEventListener('click',close);
    stage.addEventListener('click',function(e){ if(e.target===stage) close(); });
    lb.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ e.preventDefault(); close(); return; }
      if(e.key==='Tab'){
        var f=[openLink,closeBtn].filter(function(x){return x.offsetParent!==null});
        var first=f[0], last=f[f.length-1];
        if(e.shiftKey&&doc.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey&&doc.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    });
  }
  var y=doc.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();
