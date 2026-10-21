/* Touch navigation for the scaled desktop slide canvas. */
(function(){
  'use strict';
  var mq=window.matchMedia('(max-width:760px)'), mounted=false, nav=null, menu=null, count=null;
  var root=document.documentElement, slides=[].slice.call(document.querySelectorAll('.slide'));
  var back=document.querySelector('.deck-back-link'), backHref=back?back.getAttribute('href'):'../';
  function activeSlide(){return document.querySelector('.slide.active')||slides[0]}
  function refresh(){if(count)count.textContent=(slides.indexOf(activeSlide())+1)+' / '+slides.length}
  function controlsChanged(){window.dispatchEvent(new Event('deck:controlschange'))}
  function delegate(action){var ids={progress:'b-prog',prev:'b-prev',next:'b-next',replay:'b-replay',notes:'b-notes',theme:'b-theme',full:'b-full'},el=ids[action]&&document.getElementById(ids[action]);if(el)el.click()}
  function mount(){
    if(mounted||!mq.matches)return;mounted=true;root.classList.add('mobile');
    nav=document.createElement('nav');nav.className='m-nav';nav.setAttribute('aria-label','slide navigation');
    nav.innerHTML='<button type="button" data-action="prev" aria-label="previous slide">‹</button><button type="button" data-action="replay" aria-label="replay animations">↻</button><span class="m-count" aria-live="polite"></span><button type="button" data-action="next" aria-label="next slide">›</button><button type="button" data-action="more" aria-label="more controls" aria-expanded="false">•••</button>';
    menu=document.createElement('div');menu.className='m-menu';menu.hidden=true;menu.setAttribute('role','group');menu.setAttribute('aria-label','presentation controls');
    menu.innerHTML='<button type="button" data-action="progress">checklist</button><button type="button" data-action="search" data-cmdk-open aria-label="search this site">search</button><button type="button" data-action="notes">speaker notes</button><button type="button" data-action="theme">switch theme</button><button type="button" data-action="full">fullscreen</button><a data-action="archive">back to archive</a>';menu.querySelector('a').setAttribute('href',backHref);
    document.body.appendChild(nav);document.body.appendChild(menu);count=nav.querySelector('.m-count');
    var more=nav.querySelector('[data-action="more"]');
    function close(){menu.hidden=true;more.setAttribute('aria-expanded','false')}
    function click(e){var b=e.target.closest('[data-action]');if(!b)return;var action=b.dataset.action;if(action==='more'){menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden));return}if(action==='archive'){close();return}if(action==='search'){close();more.focus();return}delegate(action);close()}
    nav.addEventListener('click',click);menu.addEventListener('click',click);
    window.addEventListener('deck:slidechange',refresh);refresh();controlsChanged();
  }
  function unmount(){if(!mounted)return;mounted=false;if(nav)nav.remove();if(menu)menu.remove();nav=menu=count=null;root.classList.remove('mobile');controlsChanged()}
  function change(){if(mq.matches)mount();else unmount()}
  if(mq.addEventListener)mq.addEventListener('change',change);else mq.addListener(change);
  window.addEventListener('beforeprint',unmount);window.addEventListener('afterprint',change);
  if(mq.matches)mount();
})();
