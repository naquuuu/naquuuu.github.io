/* Mobile-only slide navigation for the deck. Desktop stays inert. */
(function(){
  'use strict';
  var mq=window.matchMedia('(max-width: 760px)'), mounted=false, nodes=[], cleanups=[], nav, menu, count;
  var root=document.documentElement, slides=[].slice.call(document.querySelectorAll('.slide'));
  var back=document.querySelector('.deck-back-link'), backHref=back?back.getAttribute('href'):'../';
  function activeSlide(){return document.querySelector('.slide.active')||slides[0]}
  function refreshCount(){if(count)count.textContent=(slides.indexOf(activeSlide())+1)+' / '+slides.length}
  function refreshNotesSpace(){window.dispatchEvent(new Event('deck:controlschange'))}
  function delegate(action){var id={prev:'b-prev',next:'b-next',replay:'b-replay',notes:'b-notes',theme:'b-theme',full:'b-full'}[action];var el=id&&document.getElementById(id);if(el)el.click()}
  function mount(){
    if(mounted||!mq.matches)return; mounted=true;
    nav=document.createElement('nav'); nav.className='m-nav'; nav.setAttribute('aria-label','slide navigation');
    nav.innerHTML='<button type="button" data-action="prev" aria-label="previous slide">‹</button><button type="button" data-action="replay" aria-label="replay animations">↻</button><span class="m-count" aria-live="polite"></span><button type="button" data-action="next" aria-label="next slide">›</button><button type="button" data-action="more" aria-label="more controls" aria-expanded="false">•••</button>';
    menu=document.createElement('div'); menu.className='m-menu'; menu.hidden=true; menu.setAttribute('role','group'); menu.setAttribute('aria-label','more presentation controls');
    menu.innerHTML='<button type="button" data-action="search" data-cmdk-open aria-label="search this site">search</button><button type="button" data-action="notes">speaker notes</button><button type="button" data-action="theme">switch theme</button><button type="button" data-action="full">fullscreen</button><a data-action="archive">back to archive</a>';
    menu.querySelector('a').setAttribute('href',backHref);
    document.body.appendChild(nav); document.body.appendChild(menu); nodes.push(nav,menu); count=nav.querySelector('.m-count');
    var more=nav.querySelector('[data-action="more"]');
    function close(){menu.hidden=true;more.setAttribute('aria-expanded','false')}
    function click(e){
      var b=e.target.closest('[data-action]'); if(!b)return; var action=b.dataset.action;
      if(action==='more'){menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden));return}
      if(action==='archive'){close();return}
      if(action==='search'){close();more.focus();return}
      delegate(action); close();
      if(action==='notes')setTimeout(refreshNotesSpace,80);
    }
    nav.addEventListener('click',click); menu.addEventListener('click',click);
    var mo=new MutationObserver(function(){refreshCount();refreshNotesSpace()});
    slides.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:['class']})});
    window.addEventListener('resize',refreshNotesSpace);
    cleanups.push(function(){mo.disconnect();window.removeEventListener('resize',refreshNotesSpace)});
    refreshCount(); refreshNotesSpace();
  }
  function unmount(){
    if(!mounted)return; mounted=false;
    cleanups.splice(0).forEach(function(f){try{f()}catch(e){}});
    nodes.splice(0).forEach(function(n){if(n.parentNode)n.parentNode.removeChild(n)});
    window.dispatchEvent(new Event('deck:controlschange'));
  }
  function change(){if(mq.matches)mount();else unmount()}
  if(mq.addEventListener)mq.addEventListener('change',change);else mq.addListener(change);
  window.addEventListener('beforeprint',unmount);
  window.addEventListener('afterprint',function(){if(mq.matches)mount()});
  if(mq.matches)mount();
})();
