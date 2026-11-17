/* Risk & Reward V6.0: 17 November classroom layout refinements.
   Presentation only; no market, trade or settlement calculations are changed. */
(function(){
'use strict';

// More compact home page, using existing live controls rather than replacing their behaviour.
const previousLanding=home;
home=function(){
 const root=document.createElement('div');root.innerHTML=previousLanding();
 const section=root.querySelector('.welcome');if(!section)return root.innerHTML;
 section.classList.add('v6-landing');
 section.querySelector(':scope > .eyebrow')?.remove();
 section.querySelector(':scope > h2')?.remove();
 section.querySelector(':scope > p:not(.eyebrow)')?.remove();
 const heading=section.querySelector(':scope > h1');
 heading?.insertAdjacentHTML('afterend',`<p class="v6-landing-part">PART ${PART} · YEARS ${PART===1?'1–5':'6–10'}</p>`);
 const panel=section.querySelector('.start-panel');
 if(panel){
   panel.classList.add('v6-home-profile');
   const note=panel.querySelector(':scope > p.small.muted');if(note)note.remove();
   const actions=panel.querySelector(':scope > .review-cta');
   if(actions){
     const old=Array.from(actions.children);
     const load=old.find(el=>el.getAttribute('onclick')?.includes('UI.load('));
     const report=old.filter(el=>el!==load && /report|pdf/i.test(el.textContent||''));
     const resume=old.filter(el=>el!==load && !report.includes(el));
     actions.replaceChildren();actions.classList.add('v6-home-controls');
     const menu=document.createElement('a');menu.href='index.html';menu.className='btn subtle v6-home-menu';menu.textContent='← Main game menu';actions.appendChild(menu);
     resume.forEach(el=>{el.classList.add('v6-home-primary');actions.appendChild(el)});
     if(load)actions.appendChild(load);
     const restart=document.createElement('button');restart.type='button';restart.className='btn v6-restart';restart.textContent='Restart from Year '+(PART===1?'1':'6');restart.setAttribute('onclick','UI.reset()');actions.appendChild(restart);
     report.forEach(el=>actions.appendChild(el));
   }
 }
 const after=root.querySelector('.v6-home-learn');
 if(after){after.classList.add('v6-landing-after');const p=after.querySelector('p');if(p)p.textContent='Complete this part to unlock extra challenges and your investment report.';section.appendChild(after)}
 root.querySelector('.v6-home-actions')?.remove();
 return root.innerHTML;
};

// The yellow cycle action belongs beside Net Worth, beneath the header's Save & Exit.
const previousHeader=roleHeader;
roleHeader=function(){
 const root=document.createElement('div');root.innerHTML=previousHeader();
 const header=root.querySelector('header');
 if(header){header.querySelector('#finish-trading')?.remove();header.querySelector('button[onclick="UI.startYear1()"]')?.remove();}
 return root.innerHTML;
};
const previousWallet=walletBar;
walletBar=function(){
 let markup=previousWallet();
 if(S.ui.view!=='student'||!['trading','explore'].includes(S.phase))return markup;
 const root=document.createElement('div');root.innerHTML=markup;
 const wallet=root.querySelector('.v60-wallet, .wallet');if(!wallet)return markup;
 const area=document.createElement('div');area.className='v6-wallet-action';
 if(S.phase==='trading')area.innerHTML='<button type="button" id="finish-trading" class="btn v6-top-finish" onclick="UI.finishTrading()">Finished Trading</button>';
 else area.innerHTML='<button type="button" class="btn v6-top-finish" onclick="UI.startYear1()">Start Year 1</button>';
 wallet.appendChild(area);
 return root.innerHTML;
};

// Banking products are visible together, with a common amount entered before choosing a deposit term.
const previousBanking=savings;
savings=function(t){
 const root=document.createElement('div');root.innerHTML=previousBanking(t);
 const panel=root.querySelector('.savings');if(!panel)return root.innerHTML;
 panel.classList.remove('v6-banking-compact');panel.classList.add('v6-banking-both');
 panel.querySelector('.v6-bank-tabs')?.remove();
 panel.querySelectorAll('.v6-bank-hidden').forEach(n=>n.classList.remove('v6-bank-hidden'));
 const columns=panel.querySelector('.savings-grid');
 if(columns?.children[0])columns.children[0].classList.add('v6-savings-side');
 if(columns?.children[1]){
   const side=columns.children[1];side.classList.add('v6-deposits-side');
   const amount=side.querySelector('#term-amount');const amountLabel=side.querySelector('label[for="term-amount"]');
   const choices=side.querySelector('.deposit-choices');
   if(choices&&amount&&amountLabel){
     const instruction=document.createElement('p');instruction.className='v6-deposit-instruction';
     instruction.innerHTML='<b>1.</b> Enter the amount to lock away. <b>2.</b> Choose a deposit length.';
     choices.before(instruction);
     choices.before(amountLabel);choices.before(amount);
     const extras=side.querySelector('.v6-bank-extras');if(extras)choices.before(extras);
     side.querySelectorAll('.deposit-option').forEach((option,i)=>{
       const b=option.querySelector('button');if(!b)return;
       b.textContent=i===0?'Open 1-year deposit':'Open 3-year deposit';
       b.setAttribute('type','button');
       option.setAttribute('aria-label',i===0?'One-year fixed deposit':'Three-year fixed deposit');
     });
   }
 }
 return root.innerHTML;
};

// Keep the Explore Mode instruction aligned with the relocated Start Year 1 button.
const previousExploreGuide=exploreGuide;
exploreGuide=function(){return previousExploreGuide().replace('at the top right','beside Net Worth above')};

// Make the first year's explanation conceptual rather than falsely attributing a price movement to calm news.
const previousReview=resultsOverlay;
resultsOverlay=function(t){
 const root=document.createElement('div');root.innerHTML=previousReview(t);
 const dialog=root.querySelector('.v6-review-dialog');
 if(!dialog||!t.last)return root.innerHTML;
 if(t.last.year===1){
  const why=dialog.querySelector('.v6-price-explain');
  if(why)why.innerHTML='<b>Why do prices change?</b><p>Prices rise when more investors want to buy, and fall when more want to sell. Expectations about business profits, costs and the economy affect these decisions. Prices can still move when the news is quiet.</p>';
 }
 dialog.querySelectorAll('.v6-annual-flag').forEach(flag=>{
   flag.style.color='#132e47';
   if(flag.tagName==='P')flag.textContent=`YEAR ${t.last.year} COMPLETE · Use Performance to record your net worth and financial decisions.`;
 });
 return root.innerHTML;
};

// Style positive/negative amounts as plain text and show annual net worth changes.
const previousPerformance=performance;
performance=function(t){
 const root=document.createElement('div');root.innerHTML=previousPerformance(t);
 root.querySelectorAll('.v6-performance-quick .v6-kpis strong > span').forEach(s=>s.classList.add('v6-financial-number'));
 root.querySelectorAll('.v6-wealth-compact .v60-year-block').forEach(block=>{
   const title=block.querySelector('small')?.textContent||'';
   const year=Number(title.match(/Year\s+(\d+)/)?.[1]);if(!Number.isInteger(year))return;
   const start=year===1?S.startCash:(t.history||[]).find(x=>x.cycle===(year-1)*3)?.nw;
   const end=(t.history||[]).find(x=>x.cycle===year*3)?.nw;
   if(!Number.isFinite(start)||!Number.isFinite(end)||start<=0)return;
   const pct=(end/start-1)*100;
   const indicator=document.createElement('span');indicator.className='v6-annual-change '+(pct>=0?'pos':'neg');
   indicator.textContent=(pct>=0?'+':'')+pct.toFixed(1)+'% net worth change';
   block.appendChild(indicator);
 });
 return root.innerHTML;
};
})();