import fs from "fs";
const f="_v3/rowereddots/sec_f.json";const s=JSON.parse(fs.readFileSync(f,"utf8"));
const add=[
{n:"rd_st_good_news",p:"Benign means not cancer.",tipo:"stock",q:"doctor smiling with senior patient",porque:"la buena noticia"},
{n:"rd_st_relaxed",p:"They do not turn into skin cancer over time.",tipo:"stock",q:"relaxed senior man smiling outdoors",porque:"alivio"},
{n:"rd_st_worried_woman",p:"one of them in particular should never be ignored",tipo:"stock",q:"worried senior woman thinking",porque:"el que no hay que ignorar"},
{n:"rd_st_worried_bath",p:"Because this is the part that frightens people.",tipo:"stock",q:"worried elderly man looking in mirror",porque:"el susto del sangrado"},
{n:"rd_st_ultrasound",p:"because he or she may want to check your liver",tipo:"stock",q:"doctor ultrasound abdomen patient",porque:"revisar el hígado"},
{n:"rd_drawer_away",p:"never cut, burn or pick at a spot",tipo:"gen",enc:"medio",seg:3.5,porque:"nunca cortes ni quemes → guardar las herramientas caseras",prompt:"medium shot of an older man in a grey cardigan closing a bathroom vanity drawer that holds a pair of nail clippers, a sewing needle card and a plastic lighter, with a calm decided half-smile, a hand towel on a ring, a soap dispenser, a small plant on the windowsill, white tiles, bright morning light",motion:"the drawer slides shut slowly under his hand"},
{n:"rd_dr_confusing",p:"The name is confusing, because it is not an infection.",tipo:"pres",enc:"medio",seg:3.5,porque:"el nombre confunde → él encogiéndose de hombros",prompt:"sitting on the corner of his desk holding a thick open dermatology textbook in one hand, shrugging with the other palm up and a playful, apologetic grimace as if admitting the name is silly, a stethoscope around his neck, a mug, a desk lamp, bookshelf with plant, framed mountain print, daylight",motion:"he shrugs a little and closes the book slowly"}
];
for(const a of add) if(!s[0].momentos.find(m=>m.n===a.n)) s[0].momentos.push(a);
fs.writeFileSync(f,JSON.stringify(s,null,1));
