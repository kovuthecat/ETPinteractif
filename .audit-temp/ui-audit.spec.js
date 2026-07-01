import { test } from 'playwright/test';
import fs from 'node:fs';

const results = [];
const modules = [
  { title: "Les composantes de l'addiction", actions: async p => { await p.getByRole('button', {name:/Dimension Physique/}).click(); } },
  { title: /La nicotine :/, actions: async p => { await p.getByRole('button', {name:'Fumer une cigarette'}).click(); await p.getByRole('button', {name:'Poser un patch'}).click(); } },
  { title: /Utilisation des substituts/, actions: async p => { const bs=p.getByRole('button'); if(await bs.count()>2) await bs.nth(2).click(); } },
  { title: "La nicotine n'est pas le toxique", actions: async p => { const bs=p.getByRole('button'); if(await bs.count()>2) await bs.nth(2).click(); } },
  { title: 'Le piège du soulagement', actions: async p => { const b=p.getByRole('button',{name:/cigarette|fumer/i}).last(); if(await b.count()) await b.click(); } },
  { title: /Gérer le craving/, actions: async p => { await p.getByRole('button',{name:'Une envie arrive'}).click(); await p.getByRole('button',{name:'Passer 30 s'}).click(); const d=p.getByRole('button',{name:/Différer/}); if(await d.count()) await d.click(); } },
  { title: 'Explorer ma motivation', actions: async p => { await p.getByRole('tab',{name:'Mes raisons'}).click(); await p.getByRole('button',{name:'Placer'}).first().click(); await p.getByRole('button',{name:'Une raison'}).click(); } },
];

for (const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]) {
  test(`audit ${vp.name}`, async ({page}) => {
    await page.setViewportSize(vp);
    const consoleMessages=[];
    page.on('console', m => { if(['warning','error'].includes(m.type())) consoleMessages.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => consoleMessages.push(`pageerror: ${e.message}`));
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    const homeMetrics=await page.evaluate(()=>({title:document.title, bodyText:document.body.innerText.slice(0,500), scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, buttons:[...document.querySelectorAll('button')].map(b=>({text:b.innerText.trim(),aria:b.getAttribute('aria-label'),w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))}));
    await page.screenshot({path:`.audit-temp/${vp.name}-home.png`,fullPage:true});
    const moduleResults=[];
    for(const mod of modules){
      await page.goto('http://localhost:5173/');
      await page.getByRole('button',{name:mod.title}).click();
      await page.waitForTimeout(150);
      const before=await snapshot(page);
      let actionError=null;
      try { await mod.actions(page); await page.waitForTimeout(150); } catch(e){ actionError=e.message; }
      const after=await snapshot(page);
      const slug=String(before.h1||'module').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
      await page.screenshot({path:`.audit-temp/${vp.name}-${slug}.png`,fullPage:true});
      moduleResults.push({name:before.h1,before,after,actionError});
    }
    results.push({viewport:vp,homeMetrics,moduleResults,consoleMessages});
    fs.writeFileSync('.audit-temp/results.json',JSON.stringify(results,null,2));
  });
}

async function snapshot(page){
  return page.evaluate(()=>{
    const els=[...document.querySelectorAll('button,input,textarea,[role=tab]')];
    const small=els.map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim(),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)})).filter(x=>x.w<44||x.h<44);
    const overflow=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>document.documentElement.clientWidth+1||r.left<-1}).slice(0,20).map(e=>({tag:e.tagName,cls:e.className?.toString().slice(0,80),text:(e.innerText||'').slice(0,80),right:Math.round(e.getBoundingClientRect().right)}));
    return {h1:document.querySelector('h1')?.innerText,h2:[...document.querySelectorAll('h2')].map(e=>e.innerText),text:document.body.innerText.slice(0,2500),controls:els.map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim(),pressed:e.getAttribute('aria-pressed'),selected:e.getAttribute('aria-selected'),disabled:e.disabled})),small,overflow,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight};
  });
}
