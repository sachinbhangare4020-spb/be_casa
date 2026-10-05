const WA="910000000000"; // apna WhatsApp number (country code ke saath)
const $=i=>document.getElementById(i);
// [id, name, uzbek, category, price, image/emoji, description]
const D=[
["plov","Samarkand Plov","Samarqand oshi","Mains",280,"images/plov.jpg","Rice, meat, carrots, cumin – slow-cooked in a big kazan."],
["lag","Lagman","Lag'mon","Mains",240,"images/lagman.jpg","Hand-pulled noodles in hot meat & veg broth."],
["samsa","Tandoor Samsa","Tandir somsa","Starters",90,"images/samsa.jpg","Flaky pastry baked in tandoor, mutton/chicken filling."],
["non","Uzbek Non","Non","Starters",40,"images/non.webp","Round tandoor bread with sesame & traditional stamp."],
["kazan","Kazan Kebab","Qozon kabob","Mains",450,"🍖","Lamb & potatoes fried in cast-iron kazan."],
["manti","Manti","Manti","Mains",220,"🥟","Steamed meat dumplings with yoghurt dip."],
["shash","Lamb Shashlik","Qo'zi shashlik","Grill",320,"🍢","Charcoal-grilled lamb skewers with onion & sumac."],
["duck","Duck Kebab","O'rdak kabob","Grill",420,"🍗","Charcoal duck with herbs & spicy tomato dip."],
["sorva","Lamb Onion Soup","Piyozli sho'rva","Starters",180,"🍲","Light lamb broth with fresh herbs."],
["beh","Quince Dessert","Behili shirinlik","Sweets & Chai",160,"🍯","Baked quince, walnuts & honey."],
["chai","Saffron Chai","Za'faron choy","Sweets & Chai",80,"🍵","Tea with saffron, cardamom & raisins."]];
const CATS=["All","Mains","Grill","Starters","Sweets & Chai"];let cat="All";const cart={};
const pic=d=>d[5].startsWith("images")?`<img src="${d[5]}" alt="${d[1]}" data-i="${D.indexOf(d)}">`:`<div class="emo" data-i="${D.indexOf(d)}">${d[5]}</div>`;
const card=d=>`<div class="card">${pic(d)}<h3>${d[1]}</h3><i>${d[2]}</i><div class="price">₹${d[4]}</div><button class="btn" data-a="${d[0]}">Add to order</button></div>`;
$("spec").innerHTML=D.slice(0,4).map(card).join("");
function renderMenu(){$("chips").innerHTML=CATS.map(c=>`<button class="${c==cat?"on":""}" data-c="${c}">${c}</button>`).join("");
$("mg").innerHTML=D.filter(d=>cat=="All"||d[3]==cat).map(card).join("")}
function add(id,n=1){cart[id]=(cart[id]||0)+n;if(cart[id]<=0)delete cart[id];renderCart()}
function renderCart(){let tot=0,cnt=0;const ids=Object.keys(cart);
$("cl").innerHTML=ids.length?ids.map(id=>{const d=D.find(x=>x[0]==id),q=cart[id];tot+=d[4]*q;cnt+=q;return `<div class="row"><span>${d[1]}</span><span><button data-m="${id}">−</button> ${q} <button data-p="${id}">+</button></span><span>₹${d[4]*q}</span></div>`}).join(""):"<p>Order khaali hai. Dish pe click karke add karo.</p>";
$("ct").textContent=ids.length?"Total: ₹"+tot:"";$("cn").textContent=cnt;$("cf").hidden=!cnt}
// slots
const SL=["12:00 PM","1:30 PM","3:00 PM","5:00 PM","7:00 PM","8:30 PM","10:00 PM"];let slot="";
$("slots").innerHTML=SL.map((s,i)=>`<button type="button" class="${i==3?"full-slot":""}" ${i==3?"disabled":""} data-s="${s}">${s}</button>`).join("");
// page turn
let cur=0;const pages=[...document.querySelectorAll(".page")];
function go(n){if(n==cur)return;const a=pages[cur],b=pages[n];a.classList.add("out");
setTimeout(()=>{a.classList.remove("out","show");b.classList.add("show","in");scrollTo(0,0);setTimeout(()=>b.classList.remove("in"),700)},650);
cur=n;document.querySelectorAll(".tabs button").forEach((t,i)=>t.classList.toggle("on",i==n))}
document.addEventListener("click",e=>{const t=e.target;
const g=t.closest("[data-go]");if(g){go(+g.dataset.go);return}
if(t.dataset.c){cat=t.dataset.c;renderMenu()}
else if(t.dataset.a){add(t.dataset.a);t.textContent="Added ✓";setTimeout(()=>t.textContent="Add to order",900)}
else if(t.dataset.i){const d=D[t.dataset.i];$("di").src=d[5].startsWith("images")?d[5]:"";$("di").hidden=!d[5].startsWith("images");$("dn").textContent=d[1]+" · "+d[2];$("dd").textContent=d[6];$("dpr").textContent="₹"+d[4];$("da").dataset.a=d[0];$("dlg").showModal()}
else if(t.id=="da"){add(t.dataset.a);$("dlg").close()}
else if(t.id=="dx")$("dlg").close();else if(t.id=="lx")$("lb").close();
else if(t.dataset.m)add(t.dataset.m,-1);else if(t.dataset.p)add(t.dataset.p);
else if(t.classList.contains("zoom")){$("li").src=t.src;$("lb").showModal()}
else if(t.dataset.s&&!t.disabled){slot=t.dataset.s;document.querySelectorAll("#slots button").forEach(b=>b.classList.toggle("on",b==t))}
else if(t.closest(".ev")){$("occ").value=t.closest(".ev").dataset.o;$("bf").scrollIntoView({behavior:"smooth"})}
else if(t.id=="dlg"||t.id=="lb")t.close()});
$("cf").onclick=()=>{go(1);setTimeout(()=>$("cartbox").scrollIntoView({behavior:"smooth"}),900)};
$("send").onclick=()=>{const ids=Object.keys(cart);if(!ids.length){$("em").textContent="Pehle dish add karo.";return}
let tot=0;const L=ids.map(id=>{const d=D.find(x=>x[0]==id);tot+=d[4]*cart[id];return `- ${cart[id]} x ${d[1]} = ₹${d[4]*cart[id]}`}).join("\n");
const m=`Hello Be Casa! New order:\n${L}\nTotal: ₹${tot}\nType: ${$("ty").value} (${$("tn").value||"-"})\nName: ${$("on").value}\nPhone: ${$("op").value}`;
window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`,"_blank")};
$("bf").onsubmit=e=>{e.preventDefault();if(!slot){alert("Time slot chuno!");return}const f=new FormData(e.target);
const m=`Hello! Table booking:\nName: ${f.get("n")}\nPhone: ${f.get("p")}\nDate: ${f.get("d")}\nSlot: ${slot}\nGuests: ${f.get("g")}\nOccasion: ${f.get("o")}\nRequests: ${f.get("m")||"-"}`;
window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`,"_blank")};
renderMenu();renderCart();

/* ---- scenery: realistic camels, flapping birds, lanterns, stars ---- */
function leg(x,y,col,begin,amp=17){return `<g transform="translate(${x} ${y})"><g fill="${col}"><path d="M-6 0H6L5 26 8 50 7 54H-4L-3 50 -2 26Z"/><animateTransform attributeName="transform" type="rotate" values="${-amp} 0 0;${amp} 0 0;${-amp} 0 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="1.8s" begin="${begin}s" repeatCount="indefinite"/></g></g>`}
function camel(){const far="#6b4e2c",near="#9a7646";
return `<svg viewBox="0 0 230 150"><ellipse cx="110" cy="145" rx="80" ry="4" fill="#000" opacity=".3"/>
${leg(72,92,far,-.9)}${leg(142,92,far,0)}
<g fill="${near}"><path d="M38 84Q34 62 52 60Q60 36 78 56Q92 62 104 58Q114 34 130 54Q146 60 156 68L172 44Q176 34 188 34L204 40Q212 46 204 52L190 54 174 84Q164 100 148 100L62 102Q42 102 38 84Z"/><path d="M146 72Q168 74 178 50L182 36 200 42 190 56Q180 82 156 100Z"/><path d="M38 76Q26 82 28 100L34 100Q34 88 40 84Z" fill="#6b4e2c"/></g>
<path d="M60 100Q110 108 150 100" stroke="#c0392b" stroke-width="5" fill="none"/><path d="M82 62Q106 52 130 60L126 74Q104 66 86 74Z" fill="#a3283a" stroke="#d9a441" stroke-width="2"/>
<ellipse cx="200" cy="44" rx="13" ry="7" fill="${near}" transform="rotate(14 200 44)"/><path d="M186 34l3-10 5 9z" fill="${far}"/><circle cx="196" cy="40" r="1.8" fill="#111"/>
${leg(58,92,near,-.9)}${leg(128,92,near,0)}
<animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur=".9s" repeatCount="indefinite"/></svg>`}
function bird(){const w=(b,c)=>`<g transform="translate(26 20)"><path d="M0 0Q-14 -10 -34 -4Q-14 4 0 4Z" fill="${c}"/><animateTransform attributeName="transform" type="rotate" additive="sum" values="55 0 0;-40 0 0;55 0 0" dur=".55s" begin="${b}s" repeatCount="indefinite"/></g>`;
return `<svg viewBox="-12 -20 76 62">${w(-.1,"#cfd8dc")}<ellipse cx="30" cy="22" rx="12" ry="5" fill="#f4f1ea"/><circle cx="43" cy="20" r="4" fill="#f4f1ea"/><path d="M47 20l7 2-7 2z" fill="#d9a441"/><path d="M18 22l-12 3 12 2z" fill="#cfd8dc"/><circle cx="44" cy="19" r="1" fill="#111"/>${w(0,"#fff")}</svg>`}
function lantern(){return `<svg viewBox="0 0 40 90"><path d="M20 0V22" stroke="#d9a441" stroke-width="2"/><path d="M12 22h16l6 10-4 30H10L6 32Z" fill="#a3283a" stroke="#d9a441" stroke-width="2"/><path d="M20 28v34M12 28l-2 34M28 28l2 34" stroke="#ffb43a" stroke-width="3" opacity=".8"/><path d="M12 62h16l-3 10h-10Z" fill="#d9a441"/></svg>`}
$("caravan").innerHTML=camel().repeat(4);
$("lamps").innerHTML=Array.from({length:6},()=>`<div class="lamp">${lantern()}</div>`).join("");
let sk="";for(let i=0;i<40;i++)sk+=`<i class="star" style="left:${Math.random()*100}%;top:${Math.random()*60}%;animation-delay:${Math.random()*3}s"></i>`;
[[12,22,0],[26,30,6],[8,38,13]].forEach(([t,d,l])=>sk+=`<div class="fly" style="top:${t}%;animation-duration:${d}s;animation-delay:-${l}s">${bird()}</div>`);
$("sky").innerHTML=sk;