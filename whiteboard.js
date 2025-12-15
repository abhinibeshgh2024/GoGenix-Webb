const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const board=document.getElementById("boardContainer");
const header=document.getElementById("headerTitle");

canvas.width=3600; canvas.height=2400;

let tool="pen", drawing=false, color="#000", size=4, dark=false;

/* HEADER */
function updateHeader(){
  header.innerText="WHITEBOARD · "+tool.toUpperCase();
}

/* PEN MENU */
function togglePenMenu(){
  const m=document.getElementById("penMenu");
  m.style.display=m.style.display==="block"?"none":"block";
}
function selectPen(t){ tool=t; updateHeader(); document.getElementById("penMenu").style.display="none"; }
function setTool(t){ tool=t; updateHeader(); }

/* INPUTS */
colorPicker.oninput=e=>color=e.target.value;
sizePicker.oninput=e=>size=e.target.value;

/* DRAWING */
canvas.addEventListener("mousedown",e=>{
  if(tool==="text") return createTextEditor(e);
  drawing=true; ctx.beginPath();
  const p=pos(e); ctx.moveTo(p.x,p.y);
});
canvas.addEventListener("mousemove",e=>{
  if(!drawing) return;
  const p=pos(e);
  if(tool==="marker"){ctx.globalAlpha=1;ctx.lineWidth=size*2}
  else if(tool==="highlighter"){ctx.globalAlpha=.25;ctx.lineWidth=size*4}
  else if(tool==="eraser"){ctx.strokeStyle=dark?"#000":"#fff";ctx.lineWidth=size*3}
  else{ctx.globalAlpha=1;ctx.lineWidth=size;ctx.strokeStyle=color}
  ctx.lineTo(p.x,p.y); ctx.stroke();
});
canvas.addEventListener("mouseup",()=>drawing=false);

function pos(e){
  const r=canvas.getBoundingClientRect();
  return {x:e.clientX-r.left,y:e.clientY-r.top};
}

/* TEXT SYSTEM (MS PAINT STYLE) */
function createTextEditor(e){
  if(e.target!==canvas) return;
  const box=document.createElement("div");
  box.className="text-editor";
  box.contentEditable=true;

  const actions=document.createElement("div");
  actions.className="text-actions";
  const ok=document.createElement("span"); ok.innerHTML="✅";
  const cancel=document.createElement("span"); cancel.innerHTML="❌";
  actions.append(ok,cancel); box.appendChild(actions);

  box.style.left=e.offsetX+"px";
  box.style.top=e.offsetY+"px";

  ok.onclick=()=>finalizeText(box);
  cancel.onclick=()=>box.remove();

  makeDraggable(box);
  board.appendChild(box); box.focus();
}

function finalizeText(box){
  const txt=box.innerText.replace("✅","").replace("❌","").trim();
  const fixed=document.createElement("div");
  fixed.className="fixed-text";
  fixed.innerText=txt;
  fixed.style.left=box.style.left;
  fixed.style.top=box.style.top;
  fixed.onclick=()=>{ box.innerText=txt; board.appendChild(box); fixed.remove(); box.focus(); };
  board.appendChild(fixed); box.remove();
}

/* IMAGE */
function addImage(e){
  const img=document.createElement("img");
  img.src=URL.createObjectURL(e.target.files[0]);
  img.className="img-item"; img.style.width="260px";
  img.style.left="120px"; img.style.top="120px";
  makeDraggable(img); board.appendChild(img);
}

/* DRAG */
function makeDraggable(el){
  let ox,oy;
  el.onmousedown=ev=>{
    ox=ev.offsetX; oy=ev.offsetY;
    document.onmousemove=mv=>{
      el.style.left=mv.pageX-ox+"px";
      el.style.top=mv.pageY-oy+"px";
    };
    document.onmouseup=()=>document.onmousemove=null;
  };
}

/* MISC */
function toggleMode(){ dark=!dark; document.body.className=dark?"dark":"light"; }
function clearBoard(){ ctx.clearRect(0,0,canvas.width,canvas.height); }
updateHeader();
