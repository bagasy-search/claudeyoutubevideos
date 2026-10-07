import json,re,statistics as st
S=json.load(open('analizador/cache/radar/saturation_videos.json'))
C=json.load(open('analizador/cache/radar/channels.json'))
M={
 "senior_dinero_seguridad_social":r"social security|medicare|retire|pension|seniors?.*(money|bill|tax|deadline|check|deposit)|born before|65\+|ssi\b|ssa\b",
 "senior_viajes_aerolineas":r"flight|airport|airline|flying|tsa|boarding|cruise",
 "senior_cocina_slowcooker":r"slow cooker|crock ?pot|dinner|meals?|recipe|cooking for one|supper|casserole",
 "senior_moda_mujer60":r"outfit|wear|style|fashion|hair|blouse|dress|look younger|makeup",
 "western_ficcion_cowboy":r"cowboy|widow|rancher|outlaw|sheriff|gunslinger|ranch|frontier",
 "far_west_historia_listas":r"wild west|cowboy|pioneer|oregon trail|frontier|saloon|wagon",
 "outlaws_biografias":r"outlaw|gunslinger|tombstone|marshal|wild west|lawman|bandit|billy the kid|wyatt earp|jesse james",
 "aviacion_historia_porque":r"plane|aircraft|jet|bomber|fighter|b-\d|f-\d|airliner|cockpit|aviation|wing",
 "ww2_historias_soldados":r"ww ?2|wwii|world war|german|nazi|hitler|d-day|normandy|soldier|panzer|pacific|u-boat|sniper|omaha",
 "barcos_guerra_ingenieria":r"battleship|carrier|submarine|navy|warship|cruiser|destroyer|ironclad|frigate|uss ",
 "roma_vida_soldados":r"roman|rome|legion|caesar|sucked to be|ottoman|medieval|empire",
 "hollywood_then_now":r"then and now|then & now|cast|hollywood|stars?|actor|actress|still alive|tv",
 "objetos_viejos_valor":r"worth|value|valuable|money|antique|collect",
 "metodo_japones_hogar":r"japan",
 "marcas_americanas_perdidas":r"compan|brand|chain|restaurant|vanish|disappear|anymore|made in america|american products|factor",
 "apalaches_abuelos_saberes":r"appalach|grandfather|grandpa|barn|farm|old-time|1960s|1950s",
 "secretos_oficios_bicarbonato":r"don.t want you to know|baking soda|plumber|mechanic|landscaper|repairm|electrician|contractor",
 "cold_case_estado_anio":r"cold case",
 "hoa_venganza":r"hoa",
 "amish_offgrid":r"amish|off.grid|grandpa|no electricity|old way",
 "doctor_seniors_salud":r"doctor|cardiologist|over 60|over 70|after 60|after 70|seniors?|blood|heart|stroke|leg",
 "fabrica_cuernos_lujo":r"factory|how .* made|process",
 "tech_nueva_invencion":r"invention|replace|obsolete|new technology|breakthrough",
 "biblia_enoch_ia":r"enoch|bible|jesus|grok|biblical|ethiopian|noah|god",
 "rescate_animales_historias":r"dog|puppy|puppies|cat|kitten|rescue|stray",
 "ww2_pows_america":r"pow|prisoner",
 "ww2_enemigo_ve_america":r"(german|soviet|japan|british|enemy|nazi|pow).*(america|u\.s\.|american)|(america|american).*(german|soviet|japan)",
 "western_ficcion_viuda":r"widow|cowboy|rancher|outlaw|bride|sheriff",
 "hollywood_cast_then_now":r"then|now|cast|alive",
 "ww2_home_front":r"home front|ration|194\d|ww ?2|wwii|world war",
 "vida_cotidiana_epoca":r"sucked|daily life|all day|life was|really like",
}
rep=[]
for k,vs in S.items():
    rx=re.compile(M[k],re.I)
    vids=[v for v in vs.values() if v.get('ageDays') is not None and v['ageDays']<=31 and rx.search(v['title'])]
    if not vids: continue
    by={}
    for v in vids: by.setdefault(v['channelId'],[]).append(v)
    rows=[]
    for cid,cv in by.items():
        ch=C.get(cid,{})
        own=[v for v in ch.get('videos',[]) if v.get('ageDays') is not None and v['ageDays']<=30 and rx.search(v['title'])]
        allv=cv+own
        best=max(allv,key=lambda v:v['views'])
        b14=[v for v in allv if v['ageDays']<=14]
        b14=max(b14,key=lambda v:v['views']) if b14 else None
        rows.append(dict(id=cid,h=ch.get('handle') or cv[0].get('handle'),age=ch.get('ageDays'),subs=ch.get('subs'),nv=ch.get('nVideos'),joined=ch.get('joined'),best=best,b14=b14))
    nuevos=[r for r in rows if r['age'] is not None and r['age']<=180]
    gan=[r for r in nuevos if r['best']['views']>=100000]
    gan.sort(key=lambda r:-(r['b14']['views'] if r['b14'] else 0))
    views=sorted(v['views'] for v in vids)
    rep.append(dict(cluster=k,canales=len(rows),nuevos=len(nuevos),ganadores=len(gan),tasa=round(len(gan)/max(1,len(nuevos)),2),mediana=views[len(views)//2],pct100k=round(sum(v>=100000 for v in views)/len(views),2),viejosHit=sum(1 for r in rows if (r['age'] or 0)>180 and r['best']['views']>=100000),top=[dict(handle=r['h'],joined=r['joined'],age=r['age'],subs=r['subs'],nv=r['nv'],best=dict(id=r['best']['id'],t=r['best']['title'],v=r['best']['views'],d=r['best']['ageDays'],len=r['best'].get('len')),b14=(dict(id=r['b14']['id'],t=r['b14']['title'],v=r['b14']['views'],d=r['b14']['ageDays']) if r['b14'] else None)) for r in gan[:8]]))
rep.sort(key=lambda r:-r['tasa'])
json.dump(rep,open('analizador/cache/radar/saturation_filtered.json','w'),indent=1)
for r in rep:
    print(f"\n## {r['cluster']}: canales {r['canales']} | nuevos {r['ganadores']}/{r['nuevos']} hit ({int(r['tasa']*100)}%) | viejos con hit {r['viejosHit']} | mediana {r['mediana']} | %100k {r['pct100k']}")
    for t in r['top'][:5]:
        b=t['b14'] or t['best']
        print(f"   {t['handle']} ({t['joined']}, {t['age']}d, {t['subs']} subs, {t['nv']} v): {b['v']:,} en {round(b['d'])}d — {b['t'][:80]}")
