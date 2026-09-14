const pages = [...document.querySelectorAll(".page")];
const fx = document.getElementById("fx");
const toast = document.getElementById("toast");

function showPage(id){
  pages.forEach(p => p.classList.toggle("active", p.id === id));
  window.scrollTo({top:0, behavior:"instant"});
}

function burst(symbols=["♡","✦","𐙚","•"]){
  for(let i=0;i<34;i++){
    const s=document.createElement("span");
    s.className="fx";
    s.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    s.style.left=(Math.random()*100)+"vw";
    s.style.top=(55+Math.random()*40)+"vh";
    s.style.fontSize=(12+Math.random()*24)+"px";
    s.style.animationDelay=(Math.random()*.7)+"s";
    fx.appendChild(s);
    setTimeout(()=>s.remove(),4500);
  }
}

function toastMsg(text){
  toast.textContent=text;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}

document.getElementById("startBtn").onclick=()=>showPage("page-birthday");
document.getElementById("giftsBtn").onclick=()=>showPage("page-gifts");

document.querySelectorAll(".gift").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const g=btn.dataset.gift;
    if(g==="1") showPage("page-message1");
    if(g==="2") showPage("page-q2");
    if(g==="3") showPage("page-message3");
    if(g==="4") showPage("page-q4");
    if(g==="5") showPage("page-code");
  });
});

document.querySelectorAll("[data-back]").forEach(btn=>{
  btn.addEventListener("click",()=>showPage(btn.dataset.back));
});

// Gift 02
const answer2=document.getElementById("answer2");
const feedback2=document.getElementById("feedback2");
document.getElementById("hint2").onclick=()=>{
  feedback2.textContent="تلميح: أول شيء صار بيننا كان فيه تهديد 😌";
};
document.getElementById("check2").onclick=()=>{
  const v=answer2.value.trim().toLowerCase();
  const ok=/هددت|هددتك|كنت اهددك|تهديد|التهديد/.test(v);
  if(ok){ feedback2.textContent="صح… تذكرتيها ♡"; setTimeout(()=>showPage("page-message2"),450); }
  else feedback2.textContent="مو هذي 😭 جربي تتذكرين أول موقف بيننا…";
};
answer2.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("check2").click()});

// Gift 04
document.querySelectorAll("#page-q4 [data-answer]").forEach(btn=>{
  btn.onclick=()=>{
    const a=btn.dataset.answer, f=document.getElementById("feedback4");
    if(a==="D"){showPage("page-q4popup");burst(["♡","𐙚","✦"]);}
    else if(a==="A") f.textContent="غلط لازم تصير تعرفني اكتر !";
    else if(a==="B") f.textContent="صح عليك بس مو الجواب الصح عندي خوف اكبر منهم لازم تعرفه !";
    else f.textContent="ماتعرفني كويس !";
  };
});
document.getElementById("dontLose").onclick=()=>showPage("page-message3");

// Code
const codeInput=document.getElementById("codeInput");
const codeFeedback=document.getElementById("codeFeedback");
function checkCode(){
  if(codeInput.value==="1214"){
    codeFeedback.textContent="Unlocked ♡";
    burst(["♡","✦","𐙚","•"]);
    setTimeout(()=>showPage("page-cake"),700);
  }else{
    codeFeedback.textContent="Wrong code :(";
    codeInput.value="";
    codeInput.focus();
  }
}
document.getElementById("checkCode").onclick=checkCode;
codeInput.addEventListener("keydown",e=>{if(e.key==="Enter")checkCode()});

// Cake interaction: first click extinguishes candles; next clicks eat it progressively.
let cakeStep=0;
const cakeScene=document.getElementById("cakeScene");
const cake=document.querySelector(".cake");
const cakeInstruction=document.getElementById("cakeInstruction");
const sliceEaten=document.getElementById("sliceEaten");
const cakeMeter=document.getElementById("cakeMeter");

cakeScene.onclick=()=>{
  if(cakeStep===0){
    cake.classList.add("scissors");
    cakeInstruction.textContent="الحين اضغط مرة ثانية… ناكل أول قطعة 🍰";
    cakeStep++;
    cakeMeter.style.width="18%";
    return;
  }
  if(cakeStep<5){
    cakeStep++;
    sliceEaten.style.width=(cakeStep*24)+"%";
    cakeMeter.style.width=(cakeStep*20)+"%";
    cakeInstruction.textContent = cakeStep<5 ? "مممم… باقي شوي 🍰 اضغط كمان" : "خلصت الكيكة كلها ♡";
    if(cakeStep===5){
      setTimeout(()=>showPage("page-cake-q"),700);
    }
  }
};

document.getElementById("cakeYes").onclick=()=>{
  document.getElementById("cakeFeedback").textContent="اجل خد هديتك";
  burst(["♡","𐙚","✦","🎈"]);
  setTimeout(()=>showPage("page-final"),700);
};
document.getElementById("cakeNo").onclick=()=>{
  document.getElementById("cakeFeedback").textContent="مافي هدية زعلت";
};

// Final
document.getElementById("endBtn").onclick=()=>{
  showPage("page-end");
  burst(["♡","𐙚","✦","🎈","•"]);
};

// Music
const song=document.getElementById("song");
const record=document.getElementById("recordBtn");
const tip=document.getElementById("recordTip");
const source=song.querySelector("source");

song.addEventListener("loadedmetadata",()=>{
  song.classList.add("has-audio");
  tip.textContent="اضغط على الأسطوانة لتشغيل الأغنية ♫";
});
song.addEventListener("error",()=>{
  song.classList.remove("has-audio");
});

record.onclick=async()=>{
  // If a real local MP3 exists, play it in the site.
  if(song.readyState>0 && song.duration && isFinite(song.duration)){
    try{
      if(song.paused){ await song.play(); record.classList.add("playing"); tip.textContent="الأغنية تشتغل… ♫"; }
      else { song.pause(); record.classList.remove("playing"); tip.textContent="وقفت الأغنية… اضغط مرة ثانية"; }
    }catch(e){ toastMsg("اضغط تشغيل من مشغل الأغنية ♫"); }
  }else{
    // Fallback to the supplied TikTok link when no audio file is included.
    window.open("https://vt.tiktok.com/ZSqQhJJQ2/","_blank","noopener,noreferrer");
  }
};
song.addEventListener("ended",()=>record.classList.remove("playing"));

// Tiny keyboard escape/back support
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    const active=document.querySelector(".page.active");
    if(active && active.id!=="page-intro") showPage("page-gifts");
  }
});
