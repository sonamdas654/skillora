import fs from "node:fs";
const U="https://xibftkurmlxtftwdkpah.supabase.co", K="sb_publishable_hW_VW8Xthg3nf_aBU-Fpsw_cqwRPoPn";
const slug=process.argv[2];
const r=await fetch(`${U}/rest/v1/blog_posts?slug=eq.${slug}&select=slug,title,content,key_takeaways,faqs,service_cta_slug,status`,
  {headers:{apikey:K,Authorization:`Bearer ${K}`}});
const p=(await r.json())[0];
if(!p){console.log("NOT FOUND");process.exit(1);}
// Compare against the source of truth in the repo.
const src=fs.readFileSync("supabase/phase23_cluster_articles.sql","utf8");
const bodies=[...src.matchAll(/\$body\$([\s\S]*?)\$body\$/g)].map(m=>m[1]);
const expected=bodies.find(b=>p.content.slice(0,60)===b.slice(0,60));
console.log(`slug        ${p.slug}`);
console.log(`status      ${p.status}`);
console.log(`cta         ${p.service_cta_slug}`);
console.log(`content     ${p.content.length} chars, ${(p.content.match(/^## /gm)||[]).length} headings, ${p.content.split("\n\n").length} paragraphs`);
console.log(`takeaways   ${p.key_takeaways.length}   faqs ${p.faqs.length}`);
console.log(`matches repo source exactly: ${expected ? (expected.trim()===p.content.trim() ? "YES" : "NO — differs") : "could not locate source"}`);
if(expected && expected.trim()!==p.content.trim()){
  const a=expected.trim(), b=p.content.trim();
  const i=[...a].findIndex((c,j)=>c!==b[j]);
  console.log(`  first difference at char ${i}:`);
  console.log(`    repo: ${JSON.stringify(a.slice(i-40,i+40))}`);
  console.log(`    db  : ${JSON.stringify(b.slice(i-40,i+40))}`);
}
