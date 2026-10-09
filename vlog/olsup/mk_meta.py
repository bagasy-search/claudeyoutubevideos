# public/olsup_meta.json: título (el de la tarjeta), descripción con la guía ARRIBA, capítulos reales y pregunta. python vlog/olsup/mk_meta.py
import json,re
W=json.load(open('_v3/olsup_wordms.json',encoding='utf8'))
P=json.load(open('_v3/olsup_paras.json',encoding='utf8'))
L={x['n']:x for x in json.load(open('vlog/olsup/lista30.json',encoding='utf8'))}
def ts(s): s=int(s); return f"{s//60}:{s%60:02d}"
start={}
for p in P:
    m=re.match(r'(?:Alright\. )?Number (\w+(?:-\w+)?)\.',p['text'])
    if m: start[m.group(1)]=p['s']
start['one']=next(p['s'] for p in P if p['text'].startswith('And now, the thing'))
words="zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split()
def num(n):
    if n<=20: return words[n]
    t={30:'thirty',20:'twenty'}
    if n==30: return 'thirty'
    return 'twenty-'+words[n-20]
chap=[("0:00","Fourteen hours in the woods")]
chap.append((ts(next(p['s'] for p in P if p['text'].startswith('Now, quick word'))),"The cookbook"))
first=start[num(30)] if num(30) in start else None
for n in range(30,0,-1):
    k=num(n)
    s=start.get(k)
    if s is None: print("sin tiempo",n,k); continue
    chap.append((ts(s),f"{n}. "+L[n]['t'].replace(' + ',' with ').replace(' (coffee trick)','').replace(' (Maine 1923 menu)','')))
end=next(p['s'] for p in P if p['text'].startswith('Now, there\'s one more thing'))
chap.append((ts(end),"The cook and the empty plates"))
bookpages=sorted({x['p'] for x in L.values() if x['p']}|{7})
desc="""📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (the bean method is page 7, camp baked beans page 13, sourdough page 26, beef and barley stew page 29): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-suppers

Pull up a chair, friend. Thirty real logging camp suppers, from the cheap ones to the one every man fought over — with the tricks an old camp cook learned the hard way.

A FEW OF THE TRICKS IN THIS VIDEO
• Brown beef a few pieces at a time — crowd the pot and it steams instead of browning.
• A cup of black coffee in the pot roast makes the gravy dark and rich (you won't taste the coffee).
• Rinse and dry sliced potatoes before frying so they turn crisp instead of gluey.
• Never let a boiled dinner boil hard: keep the water just trembling, and add the cabbage last.
• Simmer beans first; the sweet and the sour go in only when they are nearly tender.

CHAPTERS
"""+"\n".join(f"{a} {b}" for a,b in chap)+"""

Which of these thirty did your family eat? What did YOUR grandpa eat after a long day? Tell me in the comments, I read every one. Subscribe for more old logging camp suppers and wood stove cooking.

Historical photographs: public domain, Wikimedia Commons (Kinsey collection, Minnesota and other historical archives). Calories, silent meals, 400-500 pancakes for eighty men and pork and beans as the camp staple: Minnesota Historical Society. Ole is the cook-character of this channel; recipes are traditional camp methods adapted for the home kitchen.
"""
json.dump({"title":"30 Logging Camp Suppers Lumberjacks Ate After 14 Hours in the Woods","description":desc,"pinned":"The bean method (page 7) and the camp baked beans (page 13) are in my cookbook, 50 recipes with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-suppers"},open('public/olsup_meta.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print(desc[:1800])
