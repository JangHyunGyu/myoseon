// myoseon SEO 생성기 — ko only, 3 pages
const fs = require('fs'); const path = require('path');
const SITE = 'https://myoseon.kr'; const HOME = '/';
const PAGES = [
  { slug:'healing-essay', h1:'힐링 에세이 모음 — 마음이 지칠 때 천천히 읽는 글', title:'힐링 에세이 추천 | 따뜻한 글로 마음 쉬어가기', meta:'마음이 지칠 때 천천히 읽기 좋은 힐링 에세이 모음. 따뜻한 햇살이 머무는 묘선의 감성 글.', intro:'한 줄에 마음이 쉬어가는 글이 필요할 때가 있습니다. 묘선의 힐링 에세이는 그런 순간을 위해 천천히 쓰입니다.' },
  { slug:'gamseong-geulgwi', h1:'감성 글귀 모음 — 짧지만 오래 남는 문장', title:'감성 글귀 모음 | 마음에 오래 남는 짧은 문장', meta:'짧지만 마음에 오래 남는 감성 글귀 모음. 묘선이 직접 쓴 따뜻한 문장들.', intro:'길고 멋진 글보다 한 줄짜리 글이 더 오래 남을 때가 있습니다. 감성 글귀를 천천히 모아두는 공간입니다.' },
  { slug:'mind-comfort', h1:'마음 위로 글 — 위로가 필요한 밤에', title:'마음 위로 글 | 위로가 필요한 밤에 읽는 글', meta:'위로가 필요한 밤, 천천히 읽기 좋은 글 모음. 묘선의 따뜻한 에세이와 글귀.', intro:'잠이 안 오는 밤, 누구한테 말하기엔 너무 작은 마음을 위해 쓴 글들입니다.' }
];
const C = {
  why_title:'묘선이란',
  why:['따뜻한 햇살이 머무는 곳, 당신의 이야기를 담는 공간','감성 에세이 · 사진 · 그림이 있는 힐링 콘텐츠','광고 없이 깔끔한 가독성','매주 새로운 글 업데이트'],
  how_title:'천천히 읽는 법',
  how:['아래 [지금 보기] 클릭','오늘의 글 한 편을 천천히 읽기','마음에 남는 글귀는 따로 저장'],
  faq_title:'자주 묻는 질문',
  faqs:[
    ['누가 쓰는 글인가요?','묘선이라는 필명으로 쓰는 1인 작가의 에세이입니다.'],
    ['업데이트는 얼마나 자주 되나요?','일정한 주기 없이 마음이 차오를 때마다 천천히 올립니다.'],
    ['글을 인용해도 되나요?','출처(myoseon.kr)를 밝혀주시면 개인 SNS 인용은 자유롭게 해주셔도 됩니다.']
  ],
  picks_title:'시작하기 좋은 글',
  main_name:'묘선 (Myoseon)',
  main_desc:'따뜻한 햇살이 머무는 곳. 당신의 마음에 한 줄을 남기는 힐링 에세이 공간.',
  cta:'지금 보기 →',
  footer:'© myoseon.kr — 따뜻한 햇살이 머무는 곳'
};

const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,"Noto Sans KR",sans-serif;line-height:1.75;color:#3a3530;background:linear-gradient(180deg,#fef9f3 0%,#fff 50%);min-height:100vh}.wrap{max-width:680px;margin:0 auto;padding:32px 22px 80px}h1{font-size:26px;line-height:1.4;margin:24px 0 18px;color:#8d6e63;text-align:center;font-weight:600}h2{font-size:19px;margin:36px 0 12px;color:#6d4c41;border-bottom:1px solid #efebe9;padding-bottom:8px;font-weight:600}p{margin-bottom:14px}ul{margin:12px 0 18px 22px}li{margin-bottom:8px}.intro{font-size:17px;color:#5d4e44;background:#fff;border-left:3px solid #d7ccc8;padding:16px 20px;border-radius:4px;margin:18px 0;font-style:italic}.cta-box{text-align:center;margin:36px 0;padding:26px 20px;background:linear-gradient(135deg,#bcaaa4,#8d6e63);border-radius:12px}.cta{display:inline-block;background:#fff;color:#5d4037;font-weight:600;font-size:17px;padding:13px 30px;border-radius:50px;text-decoration:none}.pick{background:#fff;border:1px solid #efebe9;border-radius:8px;padding:16px;margin-bottom:14px}.pick h3{font-size:16px;color:#5d4037;margin-bottom:6px}.pick p{font-size:14px;color:#6d5c52}.faq{margin-bottom:14px}.faq summary{cursor:pointer;font-weight:600;padding:10px 0;color:#5d4037}.faq p{padding:6px 0;color:#6d5c52;font-size:15px}footer{margin-top:48px;padding-top:20px;border-top:1px solid #efebe9;text-align:center;font-size:13px;color:#a89890}@media(max-width:520px){h1{font-size:22px}h2{font-size:17px}.cta{font-size:15px;padding:11px 26px}}`;

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function render(p) {
  const url = `${SITE}/seo/${p.slug}.html`;
  const pageId = `${url}#webpage`;
  const faqLd = {"@context":"https://schema.org","@graph":[
    {"@type":"WebSite","@id":`${SITE}/#website`,"url":`${SITE}/`,"name":"Myoseon","inLanguage":"ko"},
    {"@type":"WebPage","@id":pageId,url,"name":p.title,"description":p.meta,"inLanguage":"ko","isPartOf":{"@id":`${SITE}/#website`},"breadcrumb":{"@id":`${url}#breadcrumb`}},
    {"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"Myoseon","item":`${SITE}/`},{"@type":"ListItem","position":2,"name":p.h1,"item":url}]},
    {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":C.faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}
  ]};
  return `<!DOCTYPE html>
<html lang="ko"><head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0TNF61Y3D0"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0TNF61Y3D0');
</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.meta)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.meta)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script src="../assets/js/ga-engagement.js?v=20260618-engagement" defer></script>
</head><body><div class="wrap">
<h1>${esc(p.h1)}</h1>
<p class="intro">${esc(p.intro)}</p>
<div class="cta-box"><a class="cta" href="${HOME}">${esc(C.cta)}</a></div>
<h2>${esc(C.why_title)}</h2><ul>${C.why.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>
<h2>${esc(C.picks_title)}</h2>
<div class="pick"><h3>${esc(C.main_name)}</h3><p>${esc(C.main_desc)}</p></div>
<h2>${esc(C.how_title)}</h2><ul>${C.how.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
<div class="cta-box"><a class="cta" href="${HOME}">${esc(C.cta)}</a></div>
<h2>${esc(C.faq_title)}</h2>
${C.faqs.map(([q,a])=>`<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
<footer>${esc(C.footer)}</footer>
</div></body></html>`;
}

let n=0;
for (const p of PAGES) { fs.writeFileSync(path.join(__dirname, `${p.slug}.html`), render(p), 'utf8'); n++; }
console.log(`✓ ${n} pages generated`);
const frag = PAGES.map(p=>`  <url><loc>${SITE}/seo/${p.slug}.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n');
fs.writeFileSync(path.join(__dirname, '_sitemap_fragment.xml'), frag, 'utf8');
console.log('✓ sitemap fragment written');
