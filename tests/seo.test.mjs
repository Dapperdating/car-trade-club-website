import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
const origin = 'https://cartradeclub.com';
const render = path => worker.fetch(new Request(origin + path), {ASSETS: {fetch: async () => new Response('Not found', {status: 404})}}, {waitUntil() {}, passThroughOnException() {}});
test('public pages render unique canonical URLs and meaningful HTML', async () => {
  for (const path of ["/", "/privacy", "/terms", "/approvvigionamento-auto-usate-concessionari", "/acquistare-auto-da-privati"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
    assert.match(html, /CAR TRADE CLUB LIMITED/);
    for (const [, data] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(data);
  }
});
test('sitemap lists canonical successful pages without invented dates', async () => {
  const xml = await (await render('/sitemap.xml')).text();
  assert.doesNotMatch(xml, /lastmod/);
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, ["/", "/privacy", "/terms", "/approvvigionamento-auto-usate-concessionari", "/acquistare-auto-da-privati"].map(path => origin + path));
  for (const url of urls) assert.equal((await render(new URL(url).pathname)).status, 200);
  assert.match(await (await render('/robots.txt')).text(), /Sitemap: https:\/\/cartradeclub.com\/sitemap.xml/);
});
test('missing pages return HTTP 404', async () => {assert.equal((await render('/seo-does-not-exist')).status, 404)});
test('www page redirects preserve URL while API and POST stay untouched', async () => {
 const env={ASSETS:{fetch:async()=>new Response('asset',{status:404})}};
 const ctx={waitUntil(){},passThroughOnException(){}};
 for(const method of ['GET','HEAD']){
  const response=await worker.fetch(new Request('https://www.cartradeclub.com/privacy?ref=test',{method}),env,ctx);
  assert.equal(response.status,308);assert.equal(response.headers.get('location'),'https://cartradeclub.com/privacy?ref=test');
 }
 for(const [path,method] of [['/privacy','POST'],['/api/status','GET']]){
  const response=await worker.fetch(new Request('https://www.cartradeclub.com'+path,{method}),env,ctx);
  assert.notEqual(response.status,308);
 }
});
