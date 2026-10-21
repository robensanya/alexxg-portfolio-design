const projects=window.PORTFOLIO_PROJECTS;
const root=document.getElementById('projects');
const src=id=>`assets/${String(id).padStart(2,'0')}.webp`;
const viewer=document.getElementById('viewer');
let current={project:0,variant:0,index:0};
function showImage(){
 const p=projects[current.project],v=p.variants[current.variant];
 const img=document.getElementById('full-image');img.src=src(v.images[current.index]);img.alt=v.alts[current.index];
 document.getElementById('viewer-title').textContent=`${p.title} / ${v.name}`;
 document.getElementById('image-count').textContent=`${current.index+1} / ${v.images.length} · ${v.alts[current.index]}`;
}
function openImage(p,v,i){current={project:p,variant:v,index:i};showImage();viewer.showModal()}
function move(d){const n=projects[current.project].variants[current.variant].images.length;current.index=(current.index+d+n)%n;showImage()}
projects.forEach((project,pi)=>{
 const article=document.createElement('article');article.className='project';
 article.innerHTML=`<div class="project-top"><div class="project-title"><span class="project-num">0${pi+1}</span><div><h3>${project.title} <span aria-hidden="true">↗</span></h3><p class="project-description">${project.category} / ${project.description}</p></div></div><div class="variant-controls" role="group" aria-label="Варианты оформления ${project.title}"></div></div><div class="gallery" id="gallery-${pi}"></div><div class="variant-info"><span class="variant-note"></span><span class="card-count"></span></div>`;
 const controls=article.querySelector('.variant-controls'),gallery=article.querySelector('.gallery');
 function render(vi){const v=project.variants[vi];
 gallery.replaceChildren();gallery.className='gallery'+(v.images.length===4?' four':v.images.length===2?' two':'');gallery.style.setProperty('--surface',v.color);gallery.scrollLeft=0;
 v.images.forEach((id,i)=>{const b=document.createElement('button');b.className='image-button';b.setAttribute('aria-label',`Открыть: ${v.alts[i]}`);b.innerHTML=`<img src="${src(id)}" alt="${v.alts[i]}" loading="lazy" decoding="async" width="1086" height="1448"><span class="zoom-icon" aria-hidden="true">↗</span>`;b.addEventListener('click',()=>openImage(pi,vi,i));gallery.append(b)});
 controls.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',i===vi?'true':'false'));
 article.querySelector('.variant-note').textContent=v.note;
 article.querySelector('.card-count').textContent=`${v.images.length} карточки · нажмите для просмотра`;
 }
 if(project.variants.length>1)project.variants.forEach((v,vi)=>{const b=document.createElement('button');b.textContent=v.name;b.setAttribute('aria-controls',`gallery-${pi}`);b.addEventListener('click',()=>render(vi));controls.append(b)});
 else controls.textContent=project.variants[0].name;
 render(0);root.append(article);
});
document.getElementById('close').addEventListener('click',()=>viewer.close());
document.getElementById('prev').addEventListener('click',()=>move(-1));
document.getElementById('next').addEventListener('click',()=>move(1));
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}});
let touchX=0;const fullImage=document.getElementById('full-image');
fullImage.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
fullImage.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>50)move(delta>0?-1:1)},{passive:true});
document.getElementById('year').textContent=new Date().getFullYear();
