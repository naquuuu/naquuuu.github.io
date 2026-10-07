/* Mobile-only reading layout and compact diagram alternatives. Desktop stays inert. */
(function(){
  'use strict';
  var mq=window.matchMedia('(max-width: 760px)'), mounted=false, cleanups=[], nodes=[], hidden=[], observers=[], timers=[], currentSlide=null, nav, menu, count;
  var root=document.documentElement, vp=document.getElementById('vp'), slides=Array.prototype.slice.call(document.querySelectorAll('.slide'));
  function svgWrap(id,label,viewBox,inner){return '<svg id="'+id+'" role="img" aria-label="'+label+'" viewBox="'+viewBox+'" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';}
  function mount(parent,html){var box=document.createElement('div');box.className='mobile-diagram';box.innerHTML=html;parent.appendChild(box);nodes.push(box);return box;}
  function hide(el){if(el){el.classList.add('m-original-hidden');hidden.push(el);}}
  function line(x1,y1,x2,y2,cls){return '<path class="'+(cls||'m-line')+'" d="M'+x1+' '+y1+' L'+x2+' '+y2+'"/>';}
  function buildS2(){
    var fig=document.querySelector('#s2 .s2-fig');if(!fig)return;
    hide(fig.querySelector('#s2-svg'));
    var content='<text x="14" y="22" class="m-title">cost stays. effort falls.</text>'+line(34,58,34,190)+line(34,190,304,190)+'<path class="m-red" fill="none" stroke-width="3" d="M35 72 C100 70 205 71 302 70"/><path class="m-strong" d="M35 88 C110 91 150 115 188 145 S260 177 302 181"/><path d="M35 72 C100 70 205 71 302 70 L302 181 C260 177 225 163 188 145 S110 91 35 88Z" fill="var(--accent-crimson,#a43b35)" opacity=".08" stroke="none"/><text x="44" y="64" class="m-small m-red">cost of wrong</text><text x="151" y="176" class="m-small">effort to make</text><text x="304" y="218" text-anchor="end" class="m-small">before ai → now</text><text x="28" y="242" class="m-small">illustrative · optimism gap</text>';
    mount(fig,svgWrap('m-s2','Illustration: making effort falls while the cost of a wrong result remains high.','0 0 320 252',content));
  }
  function buildS4(){
    var fig=document.querySelector('#s4 .s4-fig');if(!fig)return;hide(fig.querySelector('#s4-svg'));
    var paths='';[.99,.95,.90].forEach(function(p){var d='';for(var n=1;n<=50;n++){var risk=1-Math.pow(p,n),x=38+(n-1)*5.35,y=194-risk*150;d+=(n===1?'M':' L')+x.toFixed(1)+' '+y.toFixed(1);}paths+='<path class="'+(p===.95?'m-red':'m-line')+'" '+(p===.95?'stroke-width="3"':'stroke-width="2"')+' fill="none" d="'+d+'"/>';});
    var labels='<text x="4" y="18" class="m-small">chance one or more is wrong</text><text x="3" y="52" class="m-small">100%</text><text x="12" y="127" class="m-small">50%</text><text x="23" y="198" class="m-small">0</text><text x="36" y="220" class="m-small">1</text><text x="150" y="220" class="m-small">25</text><text x="305" y="220" text-anchor="end" class="m-small">50 steps</text>';
    var html=svgWrap('m-s4','Live chart of probability at least one step is wrong. Three per-step accuracy curves, keyed above.','0 0 320 244',line(36,28,36,198)+line(36,198,307,198)+'<path class="m-line" d="M36 48H307 M36 98H307 M36 148H307"/>'+paths+'<circle id="m-s4-dot" class="m-packet" r="5" cx="140" cy="102"/>'+labels);
    var chart=mount(fig,html), p=document.getElementById('s4-p'),n=document.getElementById('s4-n');
    function update(){if(!p||!n)return;var pv=Number(p.value)/100,nv=Number(n.value),x=38+(nv-1)*5.35,y=194-(1-Math.pow(pv,nv))*150,dot=chart.querySelector('#m-s4-dot');dot.setAttribute('cx',x);dot.setAttribute('cy',y);}
    if(p&&n){p.addEventListener('input',update);n.addEventListener('input',update);cleanups.push(function(){p.removeEventListener('input',update);n.removeEventListener('input',update);});update();}
  }
  function buildS7(){
    var fig=document.querySelector('#s7 .s7-bp');if(!fig)return;hide(fig.querySelector('#s7-svg'));
    var items=['item out of stock','price changed since last order','saved address deleted','voucher already used','double tap, two orders','payment method expired'];
    var html='<div class="m-fail-title">one-tap reorder shipped. it failed. why?</div><ol class="m-failures">'+items.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ol>';
    var box=mount(fig,html);box.classList.add('m-fail-map');
  }
  function buildS8(){
    var fig=document.querySelector('#s8 .s8-fig');if(!fig)return;hide(fig.querySelector('#s8-svg'));
    var d='M35 50 L78 145 L78 50 L121 145 L121 50 L164 145 L164 50 L200 174 L200 50 L243 145 L243 50 L277 120';
    var content='<text x="35" y="18" class="m-small">stock on hand</text><rect x="34" y="164" width="252" height="34" fill="var(--accent-crimson,#a43b35)" opacity=".10"/><path class="m-line" d="M34 28V198H288 M34 125H288" stroke-dasharray="4 4"/><path class="m-strong" d="'+d+'"/><circle cx="200" cy="174" r="5" class="m-packet"/><text x="38" y="216" class="m-small">weeks</text><text x="160" y="232" text-anchor="middle" class="m-small">red band = safety stock</text><text x="160" y="252" text-anchor="middle" class="m-small">bad week dips into buffer</text>';
    mount(fig,svgWrap('m-s8','Inventory falls and rises. A late delivery dips into the safety stock buffer without reaching zero.','0 0 320 260',content));
  }
  function buildS9(){
    var area=document.querySelector('#s9 .s9-circuit'),orig=document.querySelector('#s9 .s9-flow-svg');if(!area||!orig)return;hide(orig);
    var inner='<defs><marker id="m9-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-primary,#292722)"/></marker><marker id="m9-redarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent-crimson,#a43b35)"/></marker></defs>'+
      '<path class="m-line" marker-end="url(#m9-arrow)" d="M160 68V104 M160 161V186 M160 240V260 M160 316V340 M160 395V420"/>'+
      '<path id="m9-return" class="m-route" pathLength="1" d="M276 130 H306 V214 H276" marker-end="url(#m9-redarrow)"/>'+
      '<path id="m9-rollback" class="m-route" pathLength="1" d="M276 368 H306 V450 H276" marker-end="url(#m9-redarrow)"/>'+
      '<rect class="m-card" x="44" y="18" width="232" height="50"/><text class="m-title" x="160" y="40" text-anchor="middle">builder · model a</text><text class="m-small" x="160" y="59" text-anchor="middle">draft</text>'+
      '<rect class="m-card" x="44" y="104" width="232" height="58"/><text class="m-title" x="160" y="128" text-anchor="middle">skeptic · model b</text><text class="m-small" x="160" y="150" text-anchor="middle">challenge assumptions</text>'+
      '<text class="m-small m-red" x="230" y="182">revise</text>'+
      '<rect class="m-card" x="44" y="186" width="232" height="54"/><text class="m-title" x="160" y="210" text-anchor="middle">builder revises</text><text class="m-small" x="160" y="230" text-anchor="middle">address review findings</text>'+
      '<rect class="m-card" x="44" y="260" width="232" height="56"/><text class="m-title" x="160" y="284" text-anchor="middle">verifier</text><text class="m-small" x="160" y="306" text-anchor="middle">run repeatable checks</text>'+
      '<rect class="m-card" x="44" y="340" width="232" height="56"/><text class="m-title" x="160" y="364" text-anchor="middle">human gate</text><text class="m-small" x="160" y="386" text-anchor="middle">decide what ships</text>'+
      '<rect class="m-card" x="44" y="420" width="232" height="60"/><text class="m-title" x="160" y="446" text-anchor="middle">last safe checkpoint</text><text class="m-small" x="160" y="468" text-anchor="middle">rollback if needed</text>'+
      '<text class="m-small m-red" x="160" y="508" text-anchor="middle">rollback → safe checkpoint</text><text class="m-small" x="160" y="546" text-anchor="middle">fresh eyes help spot mistakes.</text><text class="m-small" x="160" y="570" text-anchor="middle">they can still miss things.</text><text class="m-small" x="160" y="594" text-anchor="middle">the human decides what ships.</text><path id="m9-story" d="M160 68 L160 104 L160 132 C270 132 270 214 160 214 L160 240 L160 260 L160 316 L160 340 L160 396 L160 420 L160 480" fill="none" stroke="none"/><circle class="m-packet m9-packet" r="6" cx="160" cy="68"/>';
    var diagram=mount(area,svgWrap('m-s9','Mobile recovery workflow: builder draft, skeptic review and revision, verifier checks, human release gate, and rollback to a safe checkpoint.','0 0 320 610',inner));
    diagram.dataset.packetPath='m9-return';
  }
  function buildS11(){
    var area=document.querySelector('#s11 .disclosure-map'),orig=area&&area.querySelector('.disclosure-svg');if(!area||!orig)return;hide(orig);
    var roles=[['human','direction'],['naquuuubot','coordinate'],['naquuuu-curator','taste'],['librarian','research'],['scribe + builder','write + build'],['skeptic','challenge assumptions'],['verifier','check the result'],['human','judgment']];
    var inner='<defs><marker id="m11-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--arrow)"/></marker></defs>';
    roles.forEach(function(r,i){var y=12+i*80;if(i)inner+='<path class="m-line" marker-end="url(#m11-arrow)" d="M160 '+(y-24)+'V'+y+'"/>';inner+='<rect class="m-card" x="28" y="'+y+'" width="264" height="56"/><text class="m-title" x="160" y="'+(y+24)+'" text-anchor="middle">'+r[0]+'</text><text class="m-small" x="160" y="'+(y+46)+'" text-anchor="middle">'+r[1]+'</text>';});
    inner+='<path id="m11-loop" class="m-route" pathLength="1" d="M292 440 H308 V360 H292"/><text class="m-small m-red" x="160" y="675" text-anchor="middle">review → revise → check</text><text class="m-small" x="160" y="704" text-anchor="middle">workflow roles, not a run log</text><text class="m-small" x="160" y="728" text-anchor="middle">human direction + judgment</text><path id="m11-story" d="M160 68 V440 H308 V360 H160 V628" fill="none" stroke="none"/><circle class="m-packet m11-packet" r="6" cx="160" cy="68"/>';
    mount(area,svgWrap('m-s11','Workflow roles: human direction, coordinator, curator, research, authoring, skeptic review, verifier checks, and human judgment. Review can return a draft for revision.','0 0 320 748',inner));
  }
  function buildS12(){
    var fig=document.querySelector('#s12 .s12-loop'),orig=fig&&fig.querySelector('#s12-svg');if(!fig||!orig)return;hide(orig);
    var inner='<defs><marker id="m12-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--line,#aaa294)"/></marker></defs><path class="m-line" marker-end="url(#m12-arrow)" d="M160 38V72 M160 112V148 M160 188V222 M160 262V286 H270 V38 H160"/><path id="m12-path" class="m-route" pathLength="1" d="M160 38V286 H270 V38 H160"/><circle class="m-node" cx="160" cy="38" r="5"/><text class="m-title" x="160" y="28" text-anchor="middle">krishna</text><circle class="m-node" cx="160" cy="92" r="5"/><text class="m-title" x="160" y="87" text-anchor="middle">ai</text><circle class="m-node" cx="160" cy="168" r="5"/><text class="m-title" x="160" y="164" text-anchor="middle">you</text><circle class="m-node" cx="160" cy="242" r="5"/><text class="m-title" x="160" y="238" text-anchor="middle">v4</text><circle class="m-packet" r="6" cx="160" cy="38"/>';
    var box=mount(fig,svgWrap('m-s12','A feedback loop from Krishna to AI to you, then revision and the next version.','0 0 320 300',inner));
  }
  function addMobileNavigation(){
    nav=document.createElement('nav');nav.className='m-nav';nav.setAttribute('aria-label','slide navigation');
    nav.innerHTML='<button type="button" data-action="prev" aria-label="previous slide">‹</button><button type="button" data-action="replay" aria-label="replay animations">↻</button><span class="m-count" aria-live="polite"></span><button type="button" data-action="next" aria-label="next slide">›</button><button type="button" data-action="more" aria-label="more controls" aria-expanded="false">•••</button>';
    menu=document.createElement('div');menu.className='m-menu';menu.hidden=true;menu.setAttribute('role','group');menu.setAttribute('aria-label','more presentation controls');
    menu.innerHTML='<button type="button" data-action="notes">speaker notes</button><button type="button" data-action="theme">switch theme</button><button type="button" data-action="full">fullscreen</button><a href="../" data-action="archive">back to archive</a>';
    document.body.appendChild(nav);document.body.appendChild(menu);nodes.push(nav,menu);count=nav.querySelector('.m-count');
    function delegate(action){var target={prev:'b-prev',next:'b-next',replay:'b-replay',notes:'b-notes',theme:'b-theme',full:'b-full'}[action];if(target){var el=document.getElementById(target);if(el)el.click();}}
    function close(){menu.hidden=true;nav.querySelector('[data-action="more"]').setAttribute('aria-expanded','false');}
    function click(e){var b=e.target.closest('[data-action]');if(!b)return;var action=b.dataset.action;if(action==='more'){menu.hidden=!menu.hidden;b.setAttribute('aria-expanded',String(!menu.hidden));return;}if(action==='archive'){close();return;}if(action==='prev'||action==='next'){close();delegate(action);return;}if(action==='replay'){delegate(action);restartVisible();return;}if(['notes','theme','full'].indexOf(action)>=0){delegate(action);if(action==='notes')refreshNotesSpace();close();}}
    nav.addEventListener('click',click);menu.addEventListener('click',click);cleanups.push(function(){nav.removeEventListener('click',click);menu.removeEventListener('click',click);});
    var mo=new MutationObserver(function(){refreshCount();if(activeSlide()!==currentSlide){currentSlide=activeSlide();nodes.forEach(function(n){if(n._mFrame)cancelAnimationFrame(n._mFrame);n.dataset.storyRan='0';});close();refreshNotesSpace();}});
    slides.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:['class']});});observers.push(mo);refreshCount();
  }
  function activeSlide(){return document.querySelector('.slide.active')||document.querySelector('.slide.play')||slides[0];}
  function refreshCount(){if(!count)return;var s=activeSlide(),i=slides.indexOf(s);count.textContent=(i+1)+' / '+slides.length;}
  function refreshNotesSpace(){var panel=document.getElementById('np');if(!panel)return;var open=panel.classList.contains('open');root.style.setProperty('--m-notes-space',open?Math.min(panel.scrollHeight,window.innerHeight*.46)+'px':'0px');}
  function setupOrigin(){var box=document.querySelector('#s-origin .origin-left'),art=box&&box.querySelector('.origin-art');if(!box||!art||!window.ResizeObserver)return;var ro=new ResizeObserver(function(){var scale=Math.min(1,box.clientWidth/390);art.style.setProperty('--m-origin-scale',scale);box.style.setProperty('--m-origin-height',(410*scale)+'px');});ro.observe(box);observers.push(ro);cleanups.push(function(){art.style.removeProperty('--m-origin-scale');box.style.removeProperty('--m-origin-height');});}
  function animatePacket(box,pathId,packetId){
    var svg=box.querySelector('svg'),path=svg&&svg.querySelector('#'+pathId),packet=svg&&svg.querySelector('.'+packetId);if(!path||!packet)return;
    if(box._mFrame)cancelAnimationFrame(box._mFrame);var len=path.getTotalLength(),start=performance.now(),duration=3900,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,first=path.getPointAtLength(0);packet.setAttribute('cx',first.x);packet.setAttribute('cy',first.y);
    if(reduced){var end=path.getPointAtLength(len);packet.setAttribute('cx',end.x);packet.setAttribute('cy',end.y);return;}
    function step(now){if(!mounted||!box.isConnected||!box.closest('.slide').classList.contains('active'))return;var p=Math.min(1,(now-start)/duration),pt=path.getPointAtLength(len*p);packet.setAttribute('cx',pt.x);packet.setAttribute('cy',pt.y);if(p<1){box._mFrame=requestAnimationFrame(step);}}
    box._mFrame=requestAnimationFrame(step);
  }
  function playStory(box){box.classList.remove('m-running');void box.offsetWidth;box.classList.add('m-running');if(box.querySelector('#m9-story'))animatePacket(box,'m9-story','m9-packet');else if(box.querySelector('#m11-story'))animatePacket(box,'m11-story','m11-packet');else if(box.querySelector('#m12-path'))animatePacket(box,'m12-path','m-packet');}
  function animateInView(){
    if(!window.IntersectionObserver)return;
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(!en.isIntersecting)return;var box=en.target,slide=box.closest('.slide');if(!slide||!slide.classList.contains('active')||box.dataset.storyRan==='1')return;box.dataset.storyRan='1';playStory(box);
      });},{threshold:.18,root:vp});
    nodes.filter(function(n){return n.classList&&n.classList.contains('mobile-diagram');}).forEach(function(n){if(n.querySelector('#m9-story,#m11-story,#m12-path'))io.observe(n);});observers.push(io);
  }
  function restartVisible(){timers.splice(0).forEach(function(id){cancelAnimationFrame(id);});nodes.filter(function(n){return n.classList&&n.classList.contains('mobile-diagram');}).forEach(function(n){if(n._mFrame)cancelAnimationFrame(n._mFrame);n.dataset.storyRan='0';n.classList.remove('m-running');n.querySelectorAll('*').forEach(function(x){if(x.getAnimations)x.getAnimations().forEach(function(a){a.cancel();});});var r=n.getBoundingClientRect(),s=n.closest('.slide');if(s&&s.classList.contains('active')&&vp&&r.top<vp.getBoundingClientRect().bottom&&r.bottom>vp.getBoundingClientRect().top){n.dataset.storyRan='0';playStory(n);n.dataset.storyRan='1';}});}
  function mountMobile(){if(mounted||!mq.matches)return;mounted=true;document.body.classList.add('mobile-reading');
    buildS2();buildS4();buildS7();buildS8();buildS9();buildS11();buildS12();setupOrigin();addMobileNavigation();animateInView();refreshNotesSpace();
    var notes=document.getElementById('b-notes');if(notes){var noteClick=function(){setTimeout(refreshNotesSpace,80);};notes.addEventListener('click',noteClick);cleanups.push(function(){notes.removeEventListener('click',noteClick);});}
    var resize=function(){refreshNotesSpace();};window.addEventListener('resize',resize);cleanups.push(function(){window.removeEventListener('resize',resize);});
  }
  function unmountMobile(){if(!mounted)return;mounted=false;timers.splice(0).forEach(function(id){cancelAnimationFrame(id);});observers.forEach(function(o){o.disconnect();});observers=[];cleanups.splice(0).forEach(function(f){try{f();}catch(e){}});nodes.splice(0).forEach(function(n){if(n._mFrame)cancelAnimationFrame(n._mFrame);if(n&&n.parentNode)n.parentNode.removeChild(n);});hidden.splice(0).forEach(function(el){el.classList.remove('m-original-hidden');});document.body.classList.remove('mobile-reading');root.style.removeProperty('--m-notes-space');nav=menu=count=null;}
  function change(){if(mq.matches)mountMobile();else unmountMobile();}
  if(mq.addEventListener)mq.addEventListener('change',change);else mq.addListener(change);
  window.addEventListener('beforeprint',unmountMobile);window.addEventListener('afterprint',function(){if(mq.matches)mountMobile();});
  if(mq.matches)mountMobile();
})();
