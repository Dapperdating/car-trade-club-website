import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import worker from '../dist/server/index.js';
const origin = 'https://cartradeclub.com';
const render = path => worker.fetch(new Request(origin + path), {ASSETS: {fetch: async () => new Response('Not found', {status: 404})}}, {waitUntil() {}, passThroughOnException() {}});
const {cars} = JSON.parse(fs.readFileSync(new URL('../data/parco-auto.json', import.meta.url), 'utf8'));
const page = async path => { const response = await render(path); return {status: response.status, html: await response.text()}; };
const jsonLdBlocks = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => match[1]);

test('/parco-auto renders 200 with one h1 and its canonical URL', async () => {
  const {status, html} = await page('/parco-auto');
  assert.equal(status, 200);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}/parco-auto"`));
});
test('/parco-auto keeps the legal line and the illustrative-data disclosures', async () => {
  const {html} = await page('/parco-auto');
  for (const text of ['© 2026 CAR TRADE CLUB LIMITED', 'Selezione illustrativa: prezzi, margini e disponibilità indicativi.', 'Selezione illustrativa di auto trattate dal network.', 'Prezzi, margini e disponibilità sono indicativi.']) assert.ok(html.includes(text), `missing: ${text}`);
});
test('/parco-auto?auto=CTC-0PRT renders that car server-side', async () => {
  const car = cars.find(c => c.code === 'CTC-0PRT');
  assert.ok(car, 'CTC-0PRT missing from data/parco-auto.json');
  const {status, html} = await page('/parco-auto?auto=CTC-0PRT');
  assert.equal(status, 200);
  assert.ok(html.includes(`${car.make} ${car.model}`));
});
test('/parco-auto?auto=NOPE ignores an unknown code', async () => {assert.equal((await render('/parco-auto?auto=NOPE')).status, 200)});
test('every gallery src and thumb exists under public/', () => {
  for (const car of cars) for (const photo of car.gallery) for (const file of [photo.src, photo.thumb]) assert.ok(fs.existsSync(new URL('../public' + file, import.meta.url)), `${car.code}: ${file}`);
});
test('/parco-auto JSON-LD parses, counts every car and carries no offers or price', async () => {
  const blocks = jsonLdBlocks((await page('/parco-auto')).html);
  const ld = blocks.map(data => JSON.parse(data)).find(data => data['@type'] === 'CollectionPage');
  assert.ok(ld, 'CollectionPage JSON-LD missing');
  assert.equal(ld.mainEntity.numberOfItems, cars.length);
  for (const data of blocks) assert.doesNotMatch(data, /"offers"|"price"/);
});
test('/parco-auto never leaks CRM data', async () => {
  for (const path of ['/parco-auto', '/parco-auto?auto=CTC-0PRT']) {
    const {html} = await page(path);
    for (const text of ['openingOffer', '"/cars/', 'data/cars.json']) assert.ok(!html.includes(text), `${path} contains ${text}`);
  }
});
test('homepage links to /parco-auto', async () => {assert.ok((await page('/')).html.includes('href="/parco-auto"'))});

test('withdrawn listings stay archived and are absent from the public catalog', async () => {
  const archived = JSON.parse(fs.readFileSync(new URL('../data/parco-auto-archive.json', import.meta.url), 'utf8')).cars;
  for (const {car} of archived) {
    assert.ok(!cars.some(c => c.code === car.code));
    const {status, html} = await page('/parco-auto?auto=' + car.code);
    assert.equal(status, 200);
    for (const photo of car.gallery) assert.ok(!html.includes(photo.src), `withdrawn asset exposed: ${car.code}`);
  }
});
