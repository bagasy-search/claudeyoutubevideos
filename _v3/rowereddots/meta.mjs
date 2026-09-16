import fs from "fs";
const S=fs.readFileSync("_v3/rowereddots/guion_rowereddots.txt","utf8");const W=JSON.parse(fs.readFileSync("_v3/rowereddots/rowereddots_wordms.json","utf8"));
const at=(p)=>{const c=S.indexOf(p);if(c<0)throw p;let r=W[0];for(const w of W){if(w.c<=c)r=w;else break}return r.s};
const ts=(s)=>{s=Math.floor(s);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`};
const CH=[["Those tiny bright red dots","Those red dots are not your liver"],["Let's start with the name.","What cherry angiomas really are"],["Now let me describe what they usually look like","How to recognize them + the glass test"],["So why do they appear?","Why they appear"],["And I want to clear up three myths","3 myths (liver, diet, cancer)"],["So if they're harmless, why am I making","The lookalike that matters: petechiae"],["Let me paint you a picture","Ruth's story"],["Now let's talk about the other lookalikes","Spider angioma, pyogenic granuloma, red melanoma"],["So here are the warning signs.","Warning signs + the ugly duckling"],["Now, what about bleeding?","If one bleeds"],["That brings me to the thing I really want to warn you about.","The home mistake"],["So what if they bother you?","Safe removal and what happens at the doctor"],["So let's put this into a simple routine.","Your monthly skin check"],["Let me leave you with the big picture.","The big picture"]];
const chapters=CH.map(([p,t])=>`${ts(at(p))} ${t}`).join("\n");
const description=`Those tiny bright red dots on your chest and belly are usually cherry angiomas: small clusters of blood vessels that are benign, very common after 60, not a liver problem and not contagious. But one lookalike should never wait. Here is the simple check I teach my patients, so you can save it or print it for your bathroom mirror.

THE GLASS TEST (keep a clear glass in the bathroom cabinet)
1. Press a clear drinking glass gently against the red dots.
2. Many cherry angiomas get a little paler under the pressure.
3. Tiny FLAT red or purple dots that appear suddenly, in a cluster, and DO NOT fade under the glass may be petechiae. Call your doctor that same day.
4. Don't wait for an appointment (get seen right away) if those dots come with fever or feeling very sick, new bruises you can't explain, bleeding gums or nosebleeds, or blood in your urine.

CHERRY ANGIOMA OR SOMETHING ELSE?
- Cherry angioma: round, bright red to purple, flat pinpoint that becomes a smooth dome, appears slowly over years, doesn't hurt or itch.
- Spider angioma: red center with thin "legs". Several new ones on the face, neck or chest: mention it to your doctor.
- Pyogenic granuloma: a raw red bump that grows fast and bleeds with the slightest touch. Have it checked.
- Rarely, a skin cancer can be red or pink. What gives it away is behavior.

SHOW A RED SPOT TO A DOCTOR IF IT:
- grows quickly over weeks
- changes shape or gets an irregular edge
- turns black or blue
- bleeds again and again without being scratched
- becomes an open sore that doesn't heal
- looks different from all your other spots (the "ugly duckling" sign)
- or if dozens of new ones appear suddenly over a few weeks or months

IF ONE BLEEDS
Press firmly with a clean cloth or gauze for 10 full minutes without peeking (longer if you take blood thinners). Still bleeding after 20 minutes of steady pressure? Get help.

WHAT NOT TO DO
Never burn, cut, tie off, or put vinegar, garlic or "remover pens" on a spot a doctor hasn't looked at. If one bothers you, a doctor can remove it safely in the office (electric needle, laser, freezing or a small shave removal). Ask about the cost first: it is often considered cosmetic.

YOUR MONTHLY SKIN CHECK
Once a month, after a shower, in good light: look at your chest, belly and arms, and ask someone you trust to check your back. Take the same photos every month (with a coin next to any spot you're unsure about) and compare.

CHAPTERS
${chapters}

This video is for education only and does not replace an exam by your own doctor, who knows your history, your medicines, and can look at your skin.

#cherryangioma #skincheck #petechiae #healthyaging #seniorhealth`;
const meta={title:"Those Tiny Red Dots on Your Chest After 60 — What They Really Are",description};
fs.writeFileSync("public/rowereddots_meta.json",JSON.stringify(meta,null,1));console.log(chapters, description.length);
