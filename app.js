
const floorInput=document.querySelector('#floors'),widthInput=document.querySelector('#width');
let animationTimer=null;
function drawMass(){
 const n=+floorInput.value,w=+widthInput.value;
 document.querySelector('#floorOut').textContent=n+'층';document.querySelector('#widthOut').textContent=w+' m';
 document.querySelector('#footprint').textContent=w*12;document.querySelector('#gross').textContent=w*12*n;document.querySelector('#height').textContent=(n*3.6).toFixed(1);
 const p=(x,y,z)=>[310+(x-y)*9,280+(x+y)*4-z*(n>4?8:10)];
 const poly=(pts,fill)=>'<polygon points="'+pts.map(v=>p(...v).join(',')).join(' ')+'" fill="'+fill+'" stroke="#93ccca" stroke-width="1.2"/>';
 let s=poly([[-15,-12,0],[15,-12,0],[15,12,0],[-15,12,0]],'#193c4b');
 for(let i=0;i<n;i++){let x=w/2,y=6,z=i*3.6,h=z+3.5;
 s+=poly([[-x,y,z],[x,y,z],[x,y,h],[-x,y,h]],'#287985')+poly([[x,-y,z],[x,y,z],[x,y,h],[x,-y,h]],'#1b5669')+poly([[-x,-y,h],[x,-y,h],[x,y,h],[-x,y,h]],'#93dbc9');}
 s+='<text x="24" y="32" fill="#d1eee9" font-family="sans-serif" font-size="13">PARAMETRIC MASS / 단위 m</text><text x="450" y="370" fill="#9fbeca" font-family="sans-serif" font-size="12">SITE 30 × 24</text>';
 document.querySelector('#mass').innerHTML=s;
}
function stopAnimation(){clearInterval(animationTimer);animationTimer=null;document.querySelector('#animate').textContent='자동 생성 과정 재생';}
floorInput.oninput=widthInput.oninput=()=>{stopAnimation();drawMass();};
document.querySelector('#animate').onclick=()=>{
 if(animationTimer){stopAnimation();return;}
 const target=+floorInput.value,stages=['입력 검증: 단위 m / 대지 중심 원점','층별 매스 생성','수량 확인과 결과 검사'];let i=0;
 document.querySelector('#animate').textContent='애니메이션 정지';
 animationTimer=setInterval(()=>{i++;floorInput.value=Math.min(i,target);drawMass();document.querySelector('#simStage').textContent=i<=target?stages[1]+' · '+i+'층':stages[2]+' · 완료';if(i>target){stopAnimation();}},850);
 document.querySelector('#simStage').textContent=stages[0];
};
drawMass();
const lessons=window.LESSONS||[],audioMap=window.AUDIO_DATA||{};
const $=s=>document.querySelector(s);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function paragraphs(text){const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];let result=[];for(let i=0;i<sentences.length;i+=3)result.push(sentences.slice(i,i+3).join('').trim());return result;}
$('#toc').innerHTML=lessons.map((l,i)=>'<a href="#'+l.id+'" data-nav="'+i+'">'+String(i+1).padStart(2,'0')+' &nbsp; '+esc(l.label)+'</a>').join('');
$('#chapters').innerHTML=lessons.map((l,i)=>{
 const ps=paragraphs(l.narration);l.paragraphs=ps;
 return '<section class="chapter" id="'+l.id+'"><span class="eyebrow">CHAPTER '+String(i+1).padStart(2,'0')+' / '+esc(l.label)+'</span><div class="chapter-head"><h2>'+esc(l.title)+'</h2><button data-play="'+i+'">이 장 듣기 ▷</button></div><p class="summary">'+esc(l.summary)+'</p><p class="kw-strip">'+l.keywords.map(k=>'<span class="kw">'+esc(k)+'</span>').join('')+'</p>'+l.html+(l.sources.length?'<p class="source">출처 · '+l.sources.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>').join('')+'</p>':'')+'<details class="narration"><summary>상세 음성 해설 원고 · '+ps.length+'개 문단</summary>'+ps.map((p,j)=>'<p data-paragraph="'+j+'">'+l.keywords.reduce((s,k)=>s.split(esc(k)).join('<span class="kw">'+esc(k)+'</span>'),esc(p))+'</p>').join('')+'</details></section>';
}).join('');
const audio=$('#audio'),playButton=$('#play'),status=$('#audioStatus'),seek=$('#seek');
let current=0,lastBucket=-1,lastParagraph=-1,playRequest=0;
function fmt(s){if(!Number.isFinite(s))s=0;return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');}
function currentDuration(){return Number.isFinite(audio.duration)?audio.duration:(audioMap[lessons[current]?.id]?.duration||0);}
function scrollToElement(el){if(!el)return;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}
function loadLesson(i,scroll=true){
 playRequest++;audio.pause();current=Math.max(0,Math.min(i,lessons.length-1));lastBucket=-1;lastParagraph=-1;
 const l=lessons[current],d=audioMap[l.id];$('#nowTitle').textContent=String(current+1).padStart(2,'0')+' · '+l.label;
 document.querySelectorAll('#toc a').forEach((a,j)=>a.classList.toggle('active',j===current));
 $('#prev').disabled=current===0;$('#next').disabled=current===lessons.length-1;
 if(d?.file){audio.src=d.file;audio.load();$('#audioDownload').href=d.file;$('#audioDownload').setAttribute('download',d.file.split('/').pop());status.textContent='한국어 해설 · '+fmt(d.duration);}
 else{audio.removeAttribute('src');audio.load();$('#audioDownload').removeAttribute('href');status.textContent='음성 파일을 불러올 수 없습니다. 해설 원고를 읽어 주세요.';}
 $('#duration').textContent=fmt(d?.duration||0);$('#elapsed').textContent='00:00';seek.value=0;
 audio.playbackRate=+$('#rate').value;playButton.textContent='재생';
 const section=document.getElementById(l.id);section.querySelector('details').open=true;
 if(scroll&&$('#autoScroll').checked)section.scrollIntoView({behavior:'smooth',block:'start'});
 document.querySelectorAll('.hot,.reading').forEach(e=>e.classList.remove('hot','reading'));$('#currentKeyword').textContent='5초마다 핵심 키워드';
}
async function startPlayback(){
 if(!audio.getAttribute('src'))return;
 const token=++playRequest;try{await audio.play();if(token===playRequest)status.textContent='재생 중 · '+(current+1)+' / '+lessons.length+'장';}
 catch(e){if(e.name!=='AbortError')status.textContent='재생을 시작하지 못했습니다. 음성 파일 링크를 확인하거나 재생을 다시 눌러 주세요.';}
}
function sync(force=false){
 const dur=currentDuration(),t=audio.currentTime||0,l=lessons[current];if(!l)return;
 seek.value=dur?100*t/dur:0;$('#elapsed').textContent=fmt(t);$('#duration').textContent=fmt(dur);
 const bucket=Math.floor(t/5);
 if(bucket!==lastBucket||force){
 lastBucket=bucket;document.querySelectorAll('.kw.hot').forEach(e=>e.classList.remove('hot'));
 const k=l.keywords[bucket%l.keywords.length];$('#currentKeyword').textContent=$('#emphasis').checked?k:'키워드 강조 꺼짐';$('#currentKeyword').classList.toggle('hot',$('#emphasis').checked);
 if($('#emphasis').checked)Array.from(document.getElementById(l.id).querySelectorAll('.kw')).filter(e=>e.textContent===k).forEach(e=>e.classList.add('hot'));
 }
 const ps=l.paragraphs,total=ps.reduce((n,p)=>n+p.length,0);let weighted=0,pi=ps.length-1;
 const times=audioMap[l.id]?.paragraphTimes; if(times?.length){pi=Math.max(0,times.findIndex(v=>t<v.end));if(t>=times[times.length-1].end)pi=times.length-1;}else{for(let j=0;j<ps.length;j++){weighted+=ps[j].length/total;if(!dur||t/dur<weighted){pi=j;break;}}}
 if(pi!==lastParagraph||force){
 lastParagraph=pi;document.querySelectorAll('.narration .reading').forEach(e=>e.classList.remove('reading'));
 const el=document.getElementById(l.id).querySelector('[data-paragraph="'+pi+'"]');el?.classList.add('reading');
 if($('#autoScroll').checked&&(!audio.paused||force)){document.getElementById(l.id).querySelector('details').open=true;scrollToElement(el);}
 }
}
playButton.onclick=()=>audio.paused?startPlayback():audio.pause();
$('#start').onclick=()=>{loadLesson(0);startPlayback();};
$('#prev').onclick=()=>{const was=!audio.paused;loadLesson(current-1);if(was)startPlayback();};
$('#next').onclick=()=>{const was=!audio.paused;loadLesson(current+1);if(was)startPlayback();};
document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{loadLesson(+b.dataset.play);startPlayback();});
$('#rate').onchange=()=>audio.playbackRate=+$('#rate').value;
$('#emphasis').onchange=()=>sync(true);
$('#autoScroll').onchange=()=>{if($('#autoScroll').checked)sync(true);};
seek.oninput=()=>{const d=currentDuration();if(d){audio.currentTime=d*(+seek.value/100);sync(true);}};
audio.addEventListener('timeupdate',()=>sync());
audio.addEventListener('loadedmetadata',()=>{audio.playbackRate=+$('#rate').value;sync();});
audio.addEventListener('play',()=>{playButton.textContent='일시정지';sync(true);});
audio.addEventListener('pause',()=>{playButton.textContent='재생';if(!audio.ended)status.textContent='일시정지 · 현재 위치 유지';});
audio.addEventListener('ended',()=>{if(current<lessons.length-1){loadLesson(current+1);startPlayback();}else{status.textContent='전체 해설을 마쳤습니다.';}});
audio.addEventListener('error',()=>{status.textContent='음성 로딩 오류. 음성 파일을 직접 열거나 새로고침해 주세요.';});
const keyword=document.createElement('span');keyword.id='currentKeyword';keyword.className='kw';keyword.style.cssText='font-size:14px;font-weight:700';$('.transport').append(keyword);
let flowTimer=null;document.querySelectorAll('.flow-play').forEach(b=>b.onclick=()=>{clearInterval(flowTimer);let i=0;const spans=$('#mcpFlow').querySelectorAll('span');spans.forEach(x=>x.classList.remove('current'));spans[0].classList.add('current');flowTimer=setInterval(()=>{spans.forEach(x=>x.classList.remove('current'));i++;if(i>=spans.length){clearInterval(flowTimer);return;}spans[i].classList.add('current');},1100);});
document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>$('#quizResult').textContent=b.dataset.answer==='right'?'맞습니다. 표현 이미지와 실제 모델·도면의 정합성을 확인해야 합니다.':'이미지 생성은 없는 창을 표현할 수 있습니다. 모델과 도면을 확인하세요.');
if(lessons.length)loadLesson(0,false);
