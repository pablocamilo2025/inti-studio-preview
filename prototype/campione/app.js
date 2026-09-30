const photos=window.PHOTOS;
const $=s=>document.querySelector(s);
const layout=[[34,4,32,66,0],[14,18,24,41,-5],[62,14,24,42,4],[24,36,20,42,-6],[70,35,21,44,5],[16,63,24,36,-4],[54,70,20,32,3],[42,0,17,30,0]];
const order=[0,3,2,5,6,4,7,1,0,2];
$('#constellation').innerHTML=layout.map((l,i)=>`<button class="photo-card" aria-label="Ver: ${photos[order[i]].alt}" data-photo="${order[i]}" style="--x:${l[0]}%;--y:${l[1]}%;--w:${l[2]}%;--h:${l[3]}%;--r:${l[4]}deg"><img src="${photos[order[i]].src}" alt="${photos[order[i]].alt}" fetchpriority="${i===0?'high':'auto'}"></button>`).join('');
const storyTitles=['Lo que empieza','La mesa compartida','Pequeños detalles','Antes de salir','Un poco de color','Los de siempre','Juntos','Lo que queda'];
function storyCard(i){const p=photos[i];return `<article class="story"><button data-photo="${i}" aria-label="Ver ${p.alt}"><div class="story-image"><img loading="lazy" src="${p.src}" alt="${p.alt}"></div><div class="story-label"><h3>${storyTitles[i]}</h3><span>0${i+1} / INTI</span></div></button></article>`}

$('#about-photo').src=photos[1].src;$('#frame-photo').src=photos[7].src;
$('#credits-list').innerHTML=photos.map(p=>`<a href="${p.source}" target="_blank" rel="noopener">${p.credit} · ${p.alt}</a>`).join('');
let currentPhoto=0;
function showPhoto(i){currentPhoto=(i+photos.length)%photos.length;$('#lightbox img').src=photos[currentPhoto].src;$('#lightbox img').alt=photos[currentPhoto].alt;$('.light-caption').textContent=`${String(guestMode?[...shared].indexOf(currentPhoto)+1:currentPhoto+1).padStart(2,'0')} / ${guestMode?shared.size:photos.length} · ${photos[currentPhoto].alt}`;if(!$('#lightbox').open)$('#lightbox').showModal()}
document.addEventListener('click',e=>{let p=e.target.closest('[data-photo]');if(p)showPhoto(Number(p.dataset.photo));if(e.target.closest('.dialog-close'))e.target.closest('dialog').close()});
function stepPhoto(delta){const ids=guestMode?[...shared]:photos.map((_,i)=>i);const pos=ids.indexOf(currentPhoto);showPhoto(ids[(pos+delta+ids.length)%ids.length])}
$('.light-prev').onclick=()=>stepPhoto(-1);$('.light-next').onclick=()=>stepPhoto(1);
document.addEventListener('keydown',e=>{if($('#lightbox').open){if(e.key==='ArrowRight')stepPhoto(1);if(e.key==='ArrowLeft')stepPhoto(-1)}});
$('#contact-open').onclick=()=>$('#contact-dialog').showModal();$('#credits-open').onclick=()=>$('#credits-dialog').showModal();
$('#contact-form').onsubmit=e=>{e.preventDefault();$('#form-result').textContent='La prueba está completa. En la web final recibiréis una confirmación; aquí no se han enviado ni guardado datos.'};
let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4200)}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const storyMobile=matchMedia('(max-width:600px)');
let storyCleanup=[];
function animateStories(){
 storyCleanup.forEach(fn=>fn());storyCleanup=[];
 const groups=storyMobile.matches?[[0,2,4,6],[1,3,5,7]]:[[0,3,6],[1,4],[2,5,7]];
 $('#story-grid').innerHTML=groups.map(ids=>`<div class="story-column">${ids.map(storyCard).join('')}</div>`).join('');
 if(reduced.matches)return;
 const ranges=storyMobile.matches?[[70,-280],[-65,-100]]:[[120,-320],[-50,-100],[-130,-370]];
 document.querySelectorAll('.story-column').forEach((column,i)=>{
  const animation=Motion.animate(column,{y:ranges[i]},{duration:1,ease:'linear',autoplay:false});
  storyCleanup.push(Motion.scroll(animation,{target:$('#historias'),offset:['start end','end start']}),()=>animation.stop());
 });
}
animateStories();storyMobile.addEventListener('change',animateStories);reduced.addEventListener('change',animateStories);
let heroCleanup=[],entrancePlayed=false;
function animateHero(){
 heroCleanup.forEach(fn=>fn());heroCleanup=[];
 const stage=$('#constellation');if(!stage.clientWidth)return;
 const mobile=innerWidth<600,w=stage.clientWidth,h=stage.clientHeight;
 const playEntrance=!entrancePlayed&&!reduced.matches;
 entrancePlayed=true;
 const cards=[...document.querySelectorAll('.photo-card')];
 cards.forEach((el,i)=>{
  const [left,top,width,height,angle]=layout[i];
  el.style.zIndex=String(i===0?10:i+1);
  const x=w*(.5-left/100-width/200),y=h*(.47-top/100-height/200);
  const sx=(mobile?155:235)/(w*width/100),sy=(mobile?235:350)/(h*height/100);
  const stacked=`translate(${x}px,${y}px) rotate(0deg) scale(${sx},${sy})`;
  const final=`translate(0px,0px) rotate(${angle}deg) scale(1,1)`;
  if(playEntrance){
   el.inert=i>0;
   const intro=Motion.animate(el,{transform:[stacked,stacked,stacked,final],opacity:i===0?[1,1,1,1]:[0,0,1,1]},{duration:4.6,times:[0,.62,.66,1],ease:[.22,.8,.3,1]});
   heroCleanup.push(()=>intro.stop());
   intro.then(()=>{el.inert=false});
  }else{el.style.opacity=1;el.style.transform=final;el.inert=false}
  if(reduced.matches)return;
  const parallax=Motion.animate(el,{translate:['0px 0px',`${(i%2?1:-1)*(mobile?20:75)}px ${-30-i*14}px`]},{duration:1,ease:'linear',autoplay:false});
  heroCleanup.push(Motion.scroll(parallax,{target:$('#home'),offset:['start start','end start']}),()=>parallax.stop());
 });
 if(playEntrance){
  const spin=Motion.animate(stage,{rotateY:[0,0,360,360]},{duration:4.6,times:[0,.20,.66,1],ease:['linear',[.65,0,.25,1],'linear']});
  heroCleanup.push(()=>{spin.stop();stage.style.transform='none'});
 }else{stage.style.transform='none'}
 if(!reduced.matches){
  let stopped=false,timer,fade;
  const primary=cards[0];
  const cycle=async()=>{
   if(stopped)return;
   const bounds=stage.getBoundingClientRect();
   if(document.hidden||bounds.bottom<0||bounds.top>innerHeight||$('#public-view').hidden){timer=setTimeout(cycle,4000);return}
   const next=(Number(primary.dataset.photo)+1)%photos.length;
   const photo=photos[next],incoming=new Image();
   incoming.src=photo.src;incoming.alt=photo.alt;incoming.className='hero-swap';
   try{await incoming.decode()}catch{if(!stopped)timer=setTimeout(cycle,4000);return}
   if(stopped)return;
   primary.append(incoming);
   fade=Motion.animate(incoming,{opacity:[0,1]},{duration:1.2,ease:'easeInOut'});
   await fade;
   if(stopped)return;
   primary.querySelector('img:not(.hero-swap)').remove();incoming.classList.remove('hero-swap');
   primary.dataset.photo=String(next);primary.setAttribute('aria-label',`Ver: ${photo.alt}`);
   timer=setTimeout(cycle,4000);
  };
  timer=setTimeout(cycle,playEntrance?6500:4000);
  heroCleanup.push(()=>{stopped=true;clearTimeout(timer);if(fade)fade.stop();primary.querySelector('.hero-swap')?.remove()});
 }
}
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(animateHero,150)});reduced.addEventListener('change',animateHero);
if(!reduced.matches){
 Motion.inView('.bento-card',element=>{Motion.animate(element,{opacity:[.3,1],y:[35,0]},{duration:.7,ease:'easeOut'})},{amount:.15});

}
// A portrait rises from behind each process card as it enters the viewport.
document.querySelectorAll('.steps article').forEach((article,i)=>{
 const scene=document.createElement('div');scene.className='step-scene';
 article.before(scene);
 const picture=document.createElement('div');picture.className='step-portrait';
 const photo=photos[[3,5,7][i]];
 picture.innerHTML=`<img src="${photo.src}" alt="${photo.alt}" loading="lazy">`;
 scene.append(picture,article);
});
let stepCleanup=[];
function animateSteps(){
 stepCleanup.forEach(fn=>fn());stepCleanup=[];
 document.querySelectorAll('.step-scene').forEach((scene,i)=>{
  const portrait=scene.querySelector('.step-portrait');
  const angle=[-7,5,-4][i];
  if(reduced.matches){portrait.style.transform=`translateY(-205px) rotate(${angle}deg)`;return}
  const animation=Motion.animate(portrait,{y:[135,-205],rotate:[0,angle],scale:[.86,1]},{duration:1,ease:'linear',autoplay:false});
  stepCleanup.push(Motion.scroll(animation,{target:scene,offset:[`start ${95-i*4}%`,`start ${28-i*4}%`]}),()=>animation.stop());
 });
}
animateSteps();reduced.addEventListener('change',animateSteps);
let favorites=new Set(),shared=new Set(),galleryFilter='all',guestMode=false,allowDownloads=true;
function galleryCards(){const items=photos.map((p,i)=>({p,i})).filter(({i})=>guestMode?shared.has(i):galleryFilter==='favorites'?favorites.has(i):galleryFilter==='shared'?shared.has(i):true);return items.length?items.map(({p,i})=>`<article class="gallery-card"><button class="gallery-photo" data-photo="${i}" aria-label="Ampliar ${p.alt}"><img src="${p.src}" alt="${p.alt}" loading="lazy"></button>${guestMode?`<div class="gallery-actions"><span class="gallery-note">${String(i+1).padStart(2,'0')}</span>${allowDownloads?`<button class="back-link" data-download="${i}">Descargar muestra</button>`:''}</div>`:`<div class="gallery-actions"><label><input type="checkbox" data-share="${i}" ${shared.has(i)?'checked':''}>Para invitados</label><button class="favorite" data-favorite="${i}" aria-label="Favorita: ${p.alt}" aria-pressed="${favorites.has(i)}">${favorites.has(i)?'♥':'♡'}</button></div>`}</article>`).join(''):`<p class="empty-gallery">${galleryFilter==='favorites'?'Marca el corazón de las fotografías que más os gusten.':'Selecciona fotos en «Todas» para crear vuestra galería de invitados.'}</p>`}
function renderGallery(){const g=$('#gallery-view');g.innerHTML=`<div class="gallery-shell ${guestMode?'guest-mode':''}"><div class="gallery-top"><button class="back-link" id="gallery-back">${guestMode?'Volver a nuestra galería':'Volver a Inti.Studio'}</button><span class="demo-badge">GALERÍA DE MUESTRA</span></div><div class="gallery-cover"><img src="${photos[0].src}" alt="Pareja junto a una ventana"><div class="gallery-cover-text"><span>${guestMode?'UN RECUERDO PARA COMPARTIR':'VUESTRA HISTORIA, SIEMPRE CERCA'}</span><h1>Clara & Mateo</h1><span>${guestMode?shared.size+' FOTOGRAFÍAS SELECCIONADAS':'EL DÍA QUE TODO EMPIEZA'}</span></div></div>${guestMode?`<p class="gallery-note">Vista de invitados · Solo aparecen las fotografías que habéis elegido compartir.</p>`:`<div class="gallery-toolbar"><div class="gallery-tabs" aria-label="Filtrar fotografías"><button data-filter="all" class="${galleryFilter==='all'?'active':''}">Todas (${photos.length})</button><button data-filter="favorites" class="${galleryFilter==='favorites'?'active':''}">Favoritas (${favorites.size})</button><button data-filter="shared" class="${galleryFilter==='shared'?'active':''}">Para invitados (${shared.size})</button></div><button class="dark-button" id="download-all">Descargar galería</button></div><div class="share-panel"><div><h3>Algunos recuerdos se comparten.</h3><p>Seleccionad las fotos que queréis mostrar a vuestros invitados.</p><div class="guest-switches"><label><input type="checkbox" id="allow-downloads" ${allowDownloads?'checked':''}> Permitir descargas</label></div></div><button class="dark-button" id="guest-preview" ${shared.size?'':'disabled'}>Ver como invitado (${shared.size})</button></div><p class="gallery-note">Prueba sin cuenta · La selección dura mientras esta página esté abierta. No se crea un enlace público.</p>`}<div class="gallery-grid">${galleryCards()}</div></div>`;
$('#gallery-back').onclick=()=>{if(guestMode){guestMode=false;renderGallery()}else{location.hash='home';route()}window.scrollTo({top:0,behavior:'instant'})};
if(!guestMode){$('#download-all').onclick=()=>toast('En la versión final recibiréis un ZIP en alta resolución. Esta prueba permite descargar fotos de muestra desde la vista de invitados.');$('#guest-preview').onclick=()=>{guestMode=true;renderGallery();window.scrollTo({top:0,behavior:'instant'})};$('#allow-downloads').onchange=e=>{allowDownloads=e.target.checked};document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{galleryFilter=b.dataset.filter;renderGallery()})}
}
function route(){const isGallery=location.hash==='#galeria';$('#public-view').hidden=isGallery;$('#gallery-view').hidden=!isGallery;if(isGallery)renderGallery();else requestAnimationFrame(animateHero)}
document.querySelector('[data-gallery]').onclick=()=>{guestMode=false;location.hash='galeria';route();window.scrollTo({top:0,behavior:'instant'})};window.addEventListener('hashchange',route);
document.addEventListener('change',e=>{if(e.target.matches('[data-share]')){const id=Number(e.target.dataset.share);e.target.checked?shared.add(id):shared.delete(id);const y=window.scrollY;renderGallery();window.scrollTo({top:y,behavior:'instant'})}});
document.addEventListener('click',async e=>{const f=e.target.closest('[data-favorite]');if(f){const id=Number(f.dataset.favorite);favorites.has(id)?favorites.delete(id):favorites.add(id);const y=window.scrollY;renderGallery();window.scrollTo({top:y,behavior:'instant'})}const d=e.target.closest('[data-download]');if(d){try{d.textContent='Preparando…';const res=await fetch(photos[Number(d.dataset.download)].src);if(!res.ok)throw Error();const url=URL.createObjectURL(await res.blob());const a=document.createElement('a');a.href=url;a.download=`inti-muestra-${Number(d.dataset.download)+1}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);d.textContent='Descargar muestra'}catch{d.textContent='Descargar muestra';toast('No se pudo descargar la muestra. Inténtalo de nuevo.')}}});
route();
