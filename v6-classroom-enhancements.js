/* Risk & Reward V6.0 classroom enhancements, shared by Part 1 and Part 2. */
(function(){
'use strict';
const introDelay=7000;
let confirmPending=null;

// Keep student decisions inside the game's own UI, not browser-native alerts.
const modalBefore=maybeOverlay;
maybeOverlay=function(){
 modalBefore();
 if(confirmPending)paintConfirm();
};
function paintConfirm(){
 const q=confirmPending;if(!q)return;
 const host=document.querySelector('#modal');if(!host)return;
 host.innerHTML=`<div class="shade" role="dialog" aria-modal="true" aria-labelledby="v6-modal-heading"><div class="dialog v6-custom-confirm"><div class="dialog-meta">RISK &amp; REWARD · CONFIRMATION</div><h2 id="v6-modal-heading">${escapeHtml(q.title)}</h2><p>${escapeHtml(q.message)}</p><div class="v6-custom-actions"><button class="btn subtle" type="button" onclick="UI.classroomChoice(false)">Cancel</button><button type="button" class="btn primary" onclick="UI.classroomChoice(true)">${escapeHtml(q.button||'Confirm')}</button></div></div></div>`;
 host.querySelector('.btn.subtle')?.focus({preventScroll:true});
}
UI.classroomConfirm=function(title,message,callback,button){
 confirmPending={title,message,callback,button};paintConfirm();
};
UI.classroomChoice=function(yes){
 const callback=confirmPending?.callback;confirmPending=null;
 document.querySelector('#modal').innerHTML='';
 if(yes&&typeof callback==='function')callback();else render();
};

// Home navigation is available in both parts, including during trading.
const priorHeader=roleHeader;
roleHeader=function(){
 let markup=priorHeader();const link='<a class="v6-main-menu" href="index.html" title="Back to the game menu">Main menu</a>';
 if(markup.includes('<div class="top-right v60-actions">'))return markup.replace('<div class="top-right v60-actions">','<div class="top-right v60-actions">'+link);
 return markup.replace('</header>',link+'</header>');
};
const priorHome=home;
home=function(){
 const markup=priorHome();
 const actions=`<div class="v6-home-actions"><a class="btn subtle" href="index.html">← Main game menu</a><button type="button" class="btn v6-restart" onclick="UI.reset()">Restart from Year ${PART===1?'1':'6'}</button></div>`;
 return markup+actions;
};

// Give all students enough time; the Finish button remains available after the short guard.
tradingSeconds=function(st){return st.cycle===0?240:180};

// Hold each new investment introduction briefly before students can dismiss it.
const prevIntro=introOverlay;
introOverlay=function(id,pending){
 let markup=prevIntro(id,pending);
 if(!pending)return markup;
 const key=id+':'+S.cycle;
 if(S.ui.v6IntroWaitKey!==key){S.ui.v6IntroWaitKey=key;S.ui.v6IntroWaitAt=Date.now()}
 const remaining=Math.max(0,Math.ceil((introDelay-(Date.now()-S.ui.v6IntroWaitAt))/1000));
 if(remaining)markup=markup.replace(/(<button[^>]*onclick="UI.introDone\(\)"[^>]*)(>)([^<]*)(<\/button>)/,(_all,a,b,_label,d)=>a+' disabled'+b+'Read introduction · '+remaining+'s'+d);
 return markup;
};
const oldIntroDone=UI.introDone;
UI.introDone=function(){
 if(S.intro?.pending&&Date.now()-(S.ui.v6IntroWaitAt||Date.now())<introDelay){toast('Read the investment introduction before continuing.',true);return}
 oldIntroDone.call(this);
};
const oldDelayRefresh=v55RefreshDelays;
v55RefreshDelays=function(){
 oldDelayRefresh();
 if(S.intro?.pending){const el=document.querySelector('#modal button[onclick="UI.introDone()"]');if(el){
 const remain=Math.max(0,Math.ceil((introDelay-(Date.now()-(S.ui.v6IntroWaitAt||Date.now())))/1000));
 el.disabled=remain>0;el.textContent=remain?'Read introduction · '+remain+'s':S.intro.pending==='start'?'Continue to Year 1 news':'Continue · Start Year '+yearsNow(S);
 }}
 const next=document.querySelector('#result-next');
 if(next&&S.phase==='review'&&!next.disabled&&cycleNow(S)===3)next.textContent='Continue to Year '+(yearsNow(S)+1);
};

// Each banking product occupies one compact panel at a time.
const prevSavings=savings;
savings=function(t){
 const root=document.createElement('div');root.innerHTML=prevSavings(t);
 const panel=root.querySelector('.savings'),grid=panel?.querySelector('.savings-grid');
 if(!panel||!grid||grid.children.length<2)return root.innerHTML;
 const selected=S.ui.bankTab==='term'?'term':'savings';
 panel.classList.add('v6-banking-compact');
 grid.children[0].classList.toggle('v6-bank-hidden',selected!=='savings');
 grid.children[1].classList.toggle('v6-bank-hidden',selected!=='term');
 const tabs=document.createElement('div');tabs.className='v6-bank-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Banking products');
 tabs.innerHTML=`<button role="tab" aria-selected="${selected==='savings'}" onclick="UI.bankTab('savings')">Savings account <small>${S.savingsRate}% p.a. · ${fm(t.sav)} saved · money accessible</small></button><button role="tab" aria-selected="${selected==='term'}" onclick="UI.bankTab('term')">Fixed-term deposits <small>${S.termRates.short}% or ${S.termRates.long}% p.a. · ${fm(termValue(t))} locked</small></button>`;
 grid.before(tabs);
 return panel.outerHTML;
};
UI.bankTab=function(which){if(!['savings','term'].includes(which))return;S.ui.bankTab=which;render()};

// Dedicated plus/minus buttons alongside quantity entry.
const priorTradePanel=tradePanel;
tradePanel=function(t){
 const markup=priorTradePanel(t),wrap=document.createElement('div');wrap.innerHTML=markup;
 const input=wrap.querySelector('#qty');if(!input)return markup;
 input.setAttribute('aria-label','Units to trade, use adjacent buttons to change quantity');
 input.insertAdjacentHTML('beforebegin','<button type="button" class="v6-qty-step" aria-label="Decrease units by one" onclick="UI.adjustQty(-1)">−</button>');
 input.insertAdjacentHTML('afterend','<button type="button" class="v6-qty-step" aria-label="Increase units by one" onclick="UI.adjustQty(1)">+</button>');
 return wrap.innerHTML;
};
UI.adjustQty=function(delta){
 const e=document.querySelector('#qty');if(!e)return;
 const n=Math.max(1,Math.min(100000,Math.floor(Number(e.value)||1)+delta));
 e.value=String(n);S.ui.qty=n;refreshTrade();
};

// Translate any company-specific news into broader sector descriptions.
function sectorNews(text){return String(text||'')
 .replace(/NovaTech draws interest/gi,'Technology firms attract interest')
 .replace(/Outback Minerals reports/gi,'mining companies report')
 .replace(/The Global Horizons ETF provides/gi,'International investment funds provide')
 .replace(/the Global Horizons ETF/gi,'international investment funds')
 .replace(/Global Horizons ETF/gi,'international investment funds')
 .replace(/NovaTech(?: Systems)?/gi,'technology businesses')
 .replace(/Outback Minerals(?: Ltd)?/gi,'mining businesses')
 .replace(/KangaMart(?: Retail Group)?/gi,'retail businesses')
 .replace(/RedGum Energy/gi,'energy producers')
 .replace(/Southern Cross Property Fund/gi,'property funds')
 .replace(/AusBroad Australian ETF/gi,'Australian share funds');}
function newsPossibilities(b){
 const shock=b.shock||{},items=Object.entries(shock).filter(([,v])=>typeof v==='number'&&Math.abs(v)>.1).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
 const [key,val]=items[0]||['',0];
 if(key==='energy')return val>0?['Energy suppliers could benefit if supply stays tight.','Transport and retail businesses may face higher fuel costs.']:['Fuel users may benefit from lower costs.','Energy producers could earn less if selling prices fall.'];
 if(key==='rates')return val>0?['Interest paid on savings could improve.','Borrowers, property and interest-sensitive investments may face higher costs.']:['Lower borrowing costs could help investment and property.','Savings interest may decline.'];
 if(key==='consumer')return val>0?['Consumer-facing industries could see stronger spending.','Higher wages and supply costs could still reduce profits.']:['Lower prices may help some shoppers.','Retail and service businesses could lose sales.'];
 if(key==='copper'||key==='mining')return val>0?['Materials producers may benefit from stronger industrial demand.','Manufacturers and builders could face rising input costs.']:['Lower input prices may assist some manufacturers.','Mining and materials industries could face weaker demand.'];
 if(key==='tech')return val>0?['Technology industries could attract investment and new customers.','High expectations could disappoint if sales fail to materialise.']:['Some buyers might gain from cheaper technology.','Technology businesses may face weaker profits or competition.'];
 if(key==='trade')return val>0?['Exporters and transport industries could benefit from easier trade.','Higher competition could squeeze some local producers.']:['Some domestic producers could gain market share.','Exporters and import-dependent businesses may face disruption.'];
 if(key==='property')return val>0?['Property owners could benefit from rental demand.','Higher financing and construction costs could limit gains.']:['Cheaper property might help some buyers.','Property values and rental income could weaken.'];
 if(key==='safety')return ['Some defensive investments may attract interest.','Riskier investments could lose support as confidence changes.'];
 if(key==='market')return val>0?['Business confidence could support some investment prices.','Optimism may fade if profits fail to meet expectations.']:['Cash and defensive assets may hold steadier.','A broad loss of confidence can lower many investment prices.'];
 return ['Savings and income-paying investments may continue earning interest or distributions.','Prices can still fluctuate, even without a major headline.'];
}
newsOverlay=function(){
 const b=S.beat;if(!b)return'';
 const i=Math.min(29,S.cycle),wait=S.phase==='news'?Math.max(0,Math.ceil((READ_DELAY_MS-(Date.now()-(S.readStartedAt||Date.now())))/1000)):0;
 const [up,down]=newsPossibilities(b);
 return `<div class="shade" role="dialog" aria-modal="true" aria-labelledby="news-title"><div class="dialog v60-news-dialog"><div class="dialog-meta">YEAR ${b.year} · CYCLE ${b.act} · ECONOMIC NEWS</div><h2 id="news-title">${escapeHtml(sectorNews(b.title))}</h2><p class="v6-news-lead">${escapeHtml(sectorNews(b.explanation||b.text))}</p><section class="v60-news-info v60-meaning"><h3>Why it matters</h3><p>${escapeHtml(sectorNews(b.meaning||b.focus))}</p></section><div class="v6-risk-reward"><section class="v6-upside"><h3>Possible upside</h3><p>${escapeHtml(up)}</p></section><section class="v6-downside"><h3>Possible downside</h3><p>${escapeHtml(down)}</p></section></div><section class="v6-news-question"><b>Think:</b> ${escapeHtml(sectorNews(WATCH_V55[i]))}</section><p class="v6-chart-context"><b>Not a prediction:</b> Some effects of this news are already reflected in prices. More news effects and ordinary market movements will be included when trading closes. Either could outweigh the other.</p><div class="review-cta"><button class="btn primary" id="news-continue" ${wait?'disabled':''} onclick="UI.dismissNews()">${S.phase!=='news'?'Close news':wait?'Read the news · '+wait+'s':'Continue to trading'}</button></div></div></div>`;
};
const priorNewsStrip=newsStrip;
newsStrip=function(){return sectorNews(priorNewsStrip())};

// Report movements rather than attributing hypothetical company failures as established facts.
function simplePriceStory(t){
 const b=S.beat,rows=t.last?.assetMoves||[],headline=escapeHtml(sectorNews(b?.title||'This cycle'));
 if(!rows.length)return `<b>News: ${headline}.</b> You held no market investments at settlement, so share and fund price changes did not directly change your holdings. Savings interest and super may still change.`;
 const m=rows.slice().sort((x,y)=>(y.qty*(y.trading||y.closing))-(x.qty*(x.trading||x.closing)))[0];
 const a=AS(m.id),base=m.trading||m.closing,change=base?100*(m.closing/base-1):0,fx=S.v6Factors?.[S.cycle]?.[m.id];
 const fact=`<b>${escapeHtml(a.short)}</b> ${change>0?'rose':change<0?'fell':'stayed level'} ${Math.abs(change).toFixed(1)}% after trading opened.`;
 if(!fx||Math.abs(fx.post||0)<.03)return `<b>News: ${headline}.</b> This headline caused little direct news pressure on your largest holding. ${fact} Regular market movements still mattered.`;
 const newsUp=fx.post>0,priceUp=change>0;
 let comparison='';
 if(Math.abs(change)<.05)comparison='News pushed on the price, but other market changes almost cancelled it out.';
 else if(newsUp!==priceUp)comparison=newsUp?'The headline gave prices a positive push, but other simulated movements were stronger and the investment still fell.':'The headline put downward pressure on prices, but other simulated movements were stronger and the investment still rose.';
 else if((fx.post>0&&fx.random<-.01)||(fx.post<0&&fx.random>.01))comparison='The news and the other market movements pulled in opposite directions, so the overall change was smaller than it might have been.';
 else comparison='The news and other market movements pushed in the same direction this time.';
 const example=newsUp&&change<0?'For example, stronger demand may have been expected, but company earnings could still disappoint.':newsUp&&fx.random<0?'For example, rising costs could reduce the benefit from stronger sales.':!newsUp&&change>0?'For example, businesses might adapt to higher costs or find new customers.':'For example, weaker demand or higher costs could reduce profits.';
 return `<b>News: ${headline}.</b> ${fact} ${comparison} <span class="v6-example">${example}</span>`;
}
const previousReview=resultsOverlay;
resultsOverlay=function(t){
 let markup=previousReview(t),l=t.last;
 if(!l)return markup;
 const wrap=document.createElement('div');wrap.innerHTML=markup;
 const dialog=wrap.querySelector('.v6-review-dialog');if(!dialog)return markup;
 const explanation=dialog.querySelector('.v59-hint');if(explanation)explanation.remove();
 dialog.querySelectorAll('.v6-annual-flag').forEach(n=>n.style.color='#142c44');
 const table=dialog.querySelector('.v59-table tbody');if(table){
  const moves=l.assetMoves||[];
  Array.from(table.querySelectorAll('tr')).forEach((tr,i)=>{if(!moves[i])return;const td=tr.querySelector('td');if(!td)return;const a=AS(moves[i].id);if(!a)return;td.insertAdjacentHTML('afterbegin','<i class="v6-asset-dot" style="background:'+a.col+'" aria-hidden="true"></i>');});
 }
 const expl=dialog.querySelector('.v6-price-explain');
 if(expl){expl.innerHTML='<b>How did the news affect your investments?</b><p>'+simplePriceStory(t)+'</p>';}
 const other=Array.from(dialog.querySelectorAll('p.small')).find(e=>e.textContent.startsWith('Other money:'));
 if(other){other.outerHTML=`<div class="v6-review-kpis"><div><small>Investment income earned this cycle</small><strong>${fm(l.incomeAccrued)}</strong></div><div><small>Bank and deposit interest</small><strong>${fm(l.interest)}</strong></div><div><small>Super investment change</small><strong>${pNum(l.superChange)}</strong></div></div><p class="v6-cycle-note">Investment income is accrued each cycle and paid at year-end. It is not added a second time when paid.</p>`;}
 return wrap.innerHTML;
};

// Track every settled cycle from a labelled starting value, and display start/end of each year.
const previousPerformance=performance;
performance=function(t){
 const markup=previousPerformance(t),wrap=document.createElement('div');wrap.innerHTML=markup;
 const old=wrap.querySelector('.v6-wealth-compact');if(!old)return markup;
 const start=PART===1?1:6,end=PART===1?5:10,startCycle=(start-1)*3;
 const all=(t.history||[]).filter(x=>Number.isFinite(x.nw));
 const period=all.filter(x=>x.cycle>startCycle);
 const starting=all.find(x=>x.cycle===startCycle)?.nw ?? (start===1?S.startCash:(period.length?period[0].nw:totalNet(S,t)));
 const values=[starting,...period.map(x=>x.nw)];
 const chart=values.length>1?lineGraph([{label:'Net worth each cycle',values,col:'#2DD4BF'}],760,220):'<p>Your cycle-by-cycle graph will appear after the first settlement.</p>';
 const annual=Array.from({length:5},(_,i)=>{
  const year=start+i,firstCycle=(year-1)*3,lastCycle=year*3;
  const before=firstCycle===startCycle?starting:all.find(x=>x.cycle===firstCycle)?.nw;
  const after=all.find(x=>x.cycle===lastCycle)?.nw;
  return `<div class="v60-year-block ${Number.isFinite(after)?'':'missing'}"><small>Year ${year}</small><span class="v6-year-start">Start: ${Number.isFinite(before)?fm(before):'Not yet'}</span><strong>End: ${Number.isFinite(after)?fm(after):'Not yet'}</strong></div>`;
 }).join('');
 old.innerHTML=`<h2>Net worth over time</h2><p>Includes wages, cash, savings, investments and super. It is <b>not</b> the same as investment profit.</p><div class="v6-history-summary"><strong>Starting net worth (Year ${start}): ${fm(starting)}</strong> · ${period.length} cycles completed</div>${chart}<p class="v6-chart-context">Each point is the end of one economic cycle. The first point is your starting balance; the Year summary below shows your annual starting and ending values.</p><div class="v60-year-row">${annual}</div>`;
 return wrap.innerHTML;
};
})();