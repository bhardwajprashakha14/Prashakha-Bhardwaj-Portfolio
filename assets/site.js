(function(){
  var nav=document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('solid', window.scrollY>20); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // reveal on scroll
  var els=[].slice.call(document.querySelectorAll('.rv'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  // table of contents highlight
  var links=[].slice.call(document.querySelectorAll('.toc a, .nav-links a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))}).filter(Boolean);
  if(secs.length && 'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){var id='#'+e.target.id;links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')===id)})}
    })},{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  // lightbox for screenshots and slides
  var lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-label','Enlarged image');
  lb.innerHTML='<button aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(lb);
  var big=lb.querySelector('img');
  function close(){lb.classList.remove('open');document.body.style.overflow='';}
  lb.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  [].forEach.call(document.querySelectorAll('.shot img, .slide img'),function(img){
    img.addEventListener('click',function(){big.src=img.currentSrc||img.src;big.alt=img.alt;lb.classList.add('open');lb.scrollTop=0;document.body.style.overflow='hidden';});
  });
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();
