const photos=window.PHOTOS;
const $=s=>document.querySelector(s);
const layout=[[6,18,13,31,-7],[24,4,11,25,5],[43,0,9,19,-3],[63,5,11,26,6],[81,19,13,31,-6],[3,60,11,25,5],[22,73,12,25,-5],[43,80,10,21,3],[65,70,12,28,-4],[83,63,10,23,7]];
const order=[0,3,2,5,6,4,7,1,0,2];
$('#constellation').innerHTML=layout.map((l,i)=>`<button class="photo-card" aria-label="Ver: ${photos[order[i]].alt}" data-photo="${order[i]}" style="--x:${l[0]}%;--y:${l[1]}%;--w:${l[2]}%;--h:${l[3]}%;--r:${l[4]}deg"><img src="${photos[order[i]].src}" alt="${photos[order[i]].alt}" fetchpriority="${i===0?'high':'auto'}"></button>`).join('');
$('#story-grid').innerHTML=[['Kayla & Guillaume','UNA HISTORIA JUNTO AL MAR',0],['Lucía & Gabriel','ENTRE FLORES Y ABRAZOS',6]].map(([name,desc,i])=>`<article class="story"><button data-photo="${i}" aria-label="Ver historia de muestra de ${name}"><div class="story-image"><img loading="lazy" src="${photos[i].src}" alt="${photos[i].alt}"></div><div class="story-label"><h3>${name}</h3><span>${desc}</span></div></button></article>`).join('');
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
let heroCleanup=[];
function animateHero(){
  heroCleanup.forEach(clean=>clean());heroCleanup=[];
  const target=$('#home'),stage=$('#constellation');
  if(!stage.clientWidth)return;
  const mobile=innerWidth<600;
  const w=stage.clientWidth,h=stage.clientHeight;
  const initialWidth=mobile?125:170,initialHeight=mobile?165:220;
  const options={target,offset:['start start','end end']};
  const cards=[...document.querySelectorAll('.photo-card')];
  let drifting=false,driftAnimations=[];
  const stopDrift=()=>{driftAnimations.forEach(a=>a.stop());driftAnimations=[]};
  heroCleanup.push(()=>{stopDrift();cards.forEach(el=>el.style.translate='0px 0px')});
  document.querySelectorAll('.photo-card').forEach((el,i)=>{
    const [left,top,width,height,rotation]=layout[i];
    const cardWidth=mobile?w*Math.max(width,17)/100:w*width/100;
    const cardHeight=mobile?cardWidth*1.4:h*height/100;
    el.style.width=cardWidth+'px';el.style.height=cardHeight+'px';
    const x=w*(.5-left/100)-cardWidth/2;
    const y=h*(.43-top/100)-cardHeight/2;
    const initial=`translate(${x}px, ${y}px) rotate(0deg) scale(${initialWidth/cardWidth}, ${initialHeight/cardHeight})`;
    const final=`translate(0px, 0px) rotate(${rotation}deg) scale(1, 1)`;
    el.style.zIndex=String(20-i);
    if(reduced.matches){el.style.transform=final;el.style.opacity=1;el.inert=false;return}
    const begin=i===0?0:.025+i*.012;
    const end=.72+i*.016;
    const animation=Motion.animate(el,{transform:[initial,initial,final,final],opacity:i===0?[1,1,1,1]:[0,0,1,1]},{duration:1,times:[0,Math.max(.001,begin),end,1],ease:[.22,.65,.3,1],autoplay:false});
    heroCleanup.push(Motion.scroll(animation,options),()=>animation.stop());
  });
  const title=$('.hero-title');
  if(reduced.matches){title.style.transform='translateY(0px)';title.style.opacity=1;return}
  const animation=Motion.animate(title,{transform:[`translateY(${mobile?130:180}px)`,'translateY(0px)','translateY(0px)'],opacity:[.75,1,1]},{duration:1,times:[0,.8,1],ease:'linear',autoplay:false});
  heroCleanup.push(Motion.scroll(animation,options),()=>animation.stop());
  heroCleanup.push(Motion.scroll(progress=>{
    cards.forEach((el,i)=>{el.inert=i>0&&progress<.025+i*.012});
    const shouldDrift=progress>=.86;
    if(shouldDrift===drifting)return;
    drifting=shouldDrift;stopDrift();
    cards.forEach((el,i)=>{
      if(!drifting){driftAnimations.push(Motion.animate(el,{translate:'0px 0px'},{duration:.45,ease:'easeOut'}));return}
      const dx=(mobile?7:14)*(i%2?1:-1),dy=(mobile?10:20)*(i%3?1:-1);
      driftAnimations.push(Motion.animate(el,{translate:['0px 0px',`${dx}px ${dy}px`,`${-dx*.65}px ${-dy*.7}px`,'0px 0px']},{duration:7+i*.43,repeat:Infinity,ease:'easeInOut'}));
    });
  },options));
}
animateHero();
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(animateHero,150)});
reduced.addEventListener('change',animateHero);
let favorites=new Set(),shared=new Set(),galleryFilter='all',guestMode=false,allowDownloads=true;
function galleryCards(){const items=photos.map((p,i)=>({p,i})).filter(({i})=>guestMode?shared.has(i):galleryFilter==='favorites'?favorites.has(i):galleryFilter==='shared'?shared.has(i):true);return items.length?items.map(({p,i})=>`<article class="gallery-card"><button class="gallery-photo" data-photo="${i}" aria-label="Ampliar ${p.alt}"><img src="${p.src}" alt="${p.alt}" loading="lazy"></button>${guestMode?`<div class="gallery-actions"><span class="gallery-note">${String(i+1).padStart(2,'0')}</span>${allowDownloads?`<button class="back-link" data-download="${i}">Descargar muestra</button>`:''}</div>`:`<div class="gallery-actions"><label><input type="checkbox" data-share="${i}" ${shared.has(i)?'checked':''}>Para invitados</label><button class="favorite" data-favorite="${i}" aria-label="Favorita: ${p.alt}" aria-pressed="${favorites.has(i)}">${favorites.has(i)?'♥':'♡'}</button></div>`}</article>`).join(''):`<p class="empty-gallery">${galleryFilter==='favorites'?'Marca el corazón de las fotografías que más os gusten.':'Selecciona fotos en «Todas» para crear vuestra galería de invitados.'}</p>`}
function renderGallery(){const g=$('#gallery-view');g.innerHTML=`<div class="gallery-shell ${guestMode?'guest-mode':''}"><div class="gallery-top"><button class="back-link" id="gallery-back">${guestMode?'Volver a nuestra galería':'Volver a Inti.Studio'}</button><span class="demo-badge">GALERÍA DE MUESTRA</span></div><div class="gallery-cover"><img src="${photos[0].src}" alt="${photos[0].alt}"><div class="gallery-cover-text"><span>${guestMode?'UN RECUERDO PARA COMPARTIR':'VUESTRA HISTORIA, SIEMPRE CERCA'}</span><h1>Kayla & Guillaume</h1><span>${guestMode?shared.size+' FOTOGRAFÍAS SELECCIONADAS':'EL DÍA QUE TODO EMPIEZA'}</span></div></div>${guestMode?`<p class="gallery-note">Vista de invitados · Solo aparecen las fotografías que habéis elegido compartir.</p>`:`<div class="gallery-toolbar"><div class="gallery-tabs" aria-label="Filtrar fotografías"><button data-filter="all" class="${galleryFilter==='all'?'active':''}">Todas (${photos.length})</button><button data-filter="favorites" class="${galleryFilter==='favorites'?'active':''}">Favoritas (${favorites.size})</button><button data-filter="shared" class="${galleryFilter==='shared'?'active':''}">Para invitados (${shared.size})</button></div><button class="dark-button" id="download-all">Descargar galería</button></div><div class="share-panel"><div><h3>Algunos recuerdos se comparten.</h3><p>Seleccionad las fotos que queréis mostrar a vuestros invitados.</p><div class="guest-switches"><label><input type="checkbox" id="allow-downloads" ${allowDownloads?'checked':''}> Permitir descargas</label></div></div><button class="dark-button" id="guest-preview" ${shared.size?'':'disabled'}>Ver como invitado (${shared.size})</button></div><p class="gallery-note">Prueba sin cuenta · La selección dura mientras esta página esté abierta. No se crea un enlace público.</p>`}<div class="gallery-grid">${galleryCards()}</div></div>`;
$('#gallery-back').onclick=()=>{if(guestMode){guestMode=false;renderGallery()}else{location.hash='home';route()}window.scrollTo({top:0,behavior:'instant'})};
if(!guestMode){$('#download-all').onclick=()=>toast('En la versión final recibiréis un ZIP en alta resolución. Esta prueba permite descargar fotos de muestra desde la vista de invitados.');$('#guest-preview').onclick=()=>{guestMode=true;renderGallery();window.scrollTo({top:0,behavior:'instant'})};$('#allow-downloads').onchange=e=>{allowDownloads=e.target.checked};document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{galleryFilter=b.dataset.filter;renderGallery()})}
}
function route(){const isGallery=location.hash==='#galeria';$('#public-view').hidden=isGallery;$('#gallery-view').hidden=!isGallery;if(isGallery)renderGallery();else requestAnimationFrame(animateHero)}
document.querySelector('[data-gallery]').onclick=()=>{guestMode=false;location.hash='galeria';route();window.scrollTo({top:0,behavior:'instant'})};window.addEventListener('hashchange',route);
document.addEventListener('change',e=>{if(e.target.matches('[data-share]')){const id=Number(e.target.dataset.share);e.target.checked?shared.add(id):shared.delete(id);const y=window.scrollY;renderGallery();window.scrollTo({top:y,behavior:'instant'})}});
document.addEventListener('click',async e=>{const f=e.target.closest('[data-favorite]');if(f){const id=Number(f.dataset.favorite);favorites.has(id)?favorites.delete(id):favorites.add(id);const y=window.scrollY;renderGallery();window.scrollTo({top:y,behavior:'instant'})}const d=e.target.closest('[data-download]');if(d){try{d.textContent='Preparando…';const res=await fetch(photos[Number(d.dataset.download)].src);if(!res.ok)throw Error();const url=URL.createObjectURL(await res.blob());const a=document.createElement('a');a.href=url;a.download=`inti-muestra-${Number(d.dataset.download)+1}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);d.textContent='Descargar muestra'}catch{d.textContent='Descargar muestra';toast('No se pudo descargar la muestra. Inténtalo de nuevo.')}}});
route();
