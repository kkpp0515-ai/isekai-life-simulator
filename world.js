(function(){
'use strict';
const G=Game,pick=(a,r)=>a[Math.floor(r()*a.length)],clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
G.kingdoms=[
{name:'灰峰王国',sigil:'⚒',land:'雪山と鉱山の国',climate:'長い冬、短い夏',income:145,bread:140,rent:18000,medicine:28,school:30,water:false,peace:64,sport:'大槌競技',culture:'客人には、炉で温めた石を渡す。',towns:['霜鉄の鉱山町','煤けた谷の集落','白樺の村'],greeting:'雪の積もる夜、炉の火が消えないように誰かが薪を足した。'},
{name:'リュミエール王国',sigil:'♜',land:'運河と学問の国',climate:'穏やかな雨と緑の平野',income:310,bread:180,rent:45000,medicine:78,school:82,water:true,peace:88,sport:'水上槍試合',culture:'誕生日には、その人のために一節の詩を読む。',towns:['運河沿いの下町','学都の外れ','葦の村'],greeting:'朝の鐘が鳴るころ、窓から運河の光が差し込んだ。'},
{name:'サハル砂王国',sigil:'☀',land:'砂漠と隊商の国',climate:'乾いた熱風、冷たい夜',income:195,bread:160,rent:24000,medicine:42,school:45,water:false,peace:54,sport:'砂海の騎獣競走',culture:'最後の一杯の水を、旅人と分ける。',towns:['泉を囲む町','隊商宿の路地','赤砂の村'],greeting:'星の明るい夜、泉から運んだ水であなたの頬を拭いた。'},
{name:'翠枝の王領',sigil:'❧',land:'古い森と薬草の国',climate:'深い霧と豊かな雨',income:110,bread:90,rent:12000,medicine:62,school:52,water:false,peace:81,sport:'樹上弓競べ',culture:'生まれた子のために、一本の木を植える。',towns:['大樹の根元の村','薬草市のほとり','霧の森の集落'],greeting:'葉を打つ雨音のなか、小さな産声を森が受け止めた。'},
{name:'ヴァルド辺境王国',sigil:'⚑',land:'城塞と開拓の国',climate:'乾いた草原と厳しい寒暖差',income:95,bread:130,rent:9000,medicine:18,school:22,water:false,peace:27,sport:'盾押し相撲',culture:'旅立つ人の靴に、帰郷を願う青い糸を結ぶ。',towns:['国境の城下町','開拓地の小村','風の強い牧草地'],greeting:'遠くで見張りの角笛が響くなか、あなたはこの世界に生まれた。'},
{name:'碧潮海王国',sigil:'⚓',land:'島々と海運の国',climate:'潮風、雨季の嵐',income:245,bread:170,rent:32000,medicine:56,school:63,water:true,peace:70,sport:'帆走競技',culture:'食卓には、帰らない船乗りの席を一つ残す。',towns:['港の坂道の町','小島の漁村','造船所の長屋'],greeting:'潮騒の届く部屋で、あなたの誕生を告げる灯がともった。'}
];
const names=['ミラ','リオ','セナ','トーマ','ニナ','エル','ユナ','ガル','ルカ','フィン','アダ','ノア'];
const traits=['口数は少ないが、約束を守る','よく笑い、失敗しても話を聴く','心配性で、つい厳しく叱る','疲れを抱えているが、歌うことが好き','不器用で、気持ちをうまく言えない','好奇心が強く、昔話をよく聞かせる'];
const jobs={'農家':['畑仕事と家畜の世話','季節雇いの荷運び'],'商家':['市場の露店商','行商と帳簿付け'],'没落貴族':['写本と代筆','役所の下働き'],'孤児院':['共同の台所を切り盛りする養育者','町の修繕を担う養育者']};
const baseBirth=G.birth,baseChoose=G.choose,baseEnding=G.ending;
function parent(role,job,r){return {role,name:pick(names,r),job,trait:pick(traits,r),health:pick(['丈夫','持病があり無理がきかない','古傷が痛む'],r),time:pick(['夕食を一緒に食べられる','夜明けから働き、帰りは遅い','遠方の仕事で、帰宅は月に二度'],r)};}
G.birth=function(r=Math.random){let s=baseBirth(r),k=pick(G.kingdoms,r);s.version=2;s.kingdom=k.name;s.place=pick(k.towns,r);s.reveal=0;s.started=false;s.prepared=-1;s.queue=[];s.queueIndex=0;s.worldTick=0;s.memories=[];s.support=25+Math.floor(r()*60);s.siblings=Math.floor(r()*5);s.parents=[parent(s.family==='孤児院'?'育ての親':'母',jobs[s.family][0],r),parent(s.family==='孤児院'?'もう一人の養育者':'父',jobs[s.family][1],r)];s.absent=s.family!=='孤児院'&&r()<.22;if(s.absent)s.parents[1].absence=pick(['幼いころに亡くなり、周囲から話を聞いて育つ','行方が分からず、帰りを待っている'],r);s.householdIncome=Math.round(k.income*({農家:.7,商家:1.55,没落貴族:1.05,孤児院:.48}[s.family])*(.7+r()*.6));s.health=clamp(58+k.medicine*.28);s.happy=clamp(24+s.support*.5);s.wealth=clamp(s.householdIncome/k.income*22);s.life=Math.round(s.life*(.67+k.medicine*.0033+k.peace*.0007));s.log=[{age:0,title:'あなたの誕生',text:`${k.name}、${s.place}。${k.greeting} ${s.race}の${s.family}で、${s.siblings?`${s.siblings+1}人きょうだいの一人`:'一人っ子'}として育つ。`,kind:'birth'}];return s;};
G.country=s=>G.kingdoms.find(k=>k.name===s.kingdom);
G.lifeExpectancy=(s)=>Math.round(G.races.find(r=>r.name===s.race).life*(.67+G.country(s).medicine*.0033+G.country(s).peace*.0007));
G.deathRisk=function(s,o){const k=G.country(s);return o.risk*(1+(100-s.health)/150)*(k?1+(50-k.medicine)/170:1);};
G.targetAge=s=>Math.round(s.life*[.08,.17,.29,.46,.66,.86][Math.min(s.step,5)]);
function entry(age,title,text,compare,effect={},tag='日々の記録'){return {age,title,text,compare,effect,tag,kind:'daily'};}
// These facts belong to this fictional country, not a claim about every fantasy world.
function daily(s,slot,age,r){const k=G.country(s),p=s.parents[0],q=s.parents[1],early=s.step<2;
if(s.step===1&&slot===1&&p.health!=='丈夫')return entry(age,'働けない家の人',`${p.role}の${p.name}は${p.health}。仕事を休む日が増えた。あなたは家の手伝いを増やし、近所から届いた差し入れを温めた。`,'この地方には傷病手当や公的な介護の仕組みがない。休む人の暮らしを、家族や隣人が支えている。',{wealth:-8,happy:s.support>50?2:-3});
if(s.step===2&&slot===1&&r()<.5)return entry(age,'家の仕事が途切れた',`${s.place}の仕事が減り、家へ回せる銅貨が少なくなった。${p.name}から受け継いだ道具を借り、臨時の仕事を探した。`,'この国には失業保険がない。仕事を失ったあと、蓄えや身近な人の助けが暮らしをつなぐ。',{wealth:-9,health:-3});
const choices=[
()=>entry(age,k.water?'共同水栓の列':'水を運ぶ朝',k.water?'近所の共同水栓まで桶を運ぶ。雨の翌日は、濁りが引くのを待つ。':'井戸までの道を、桶を持って往復した。水をこぼさず帰れた日は、それだけで少し誇らしかった。','現代日本で身近な蛇口。この地区には、各家庭へ水を届ける水道がない。',{body:2,health:-2}),
()=>entry(age,early?'家の人の帰りを待つ':'故郷からの便り',early?`${p.role}の${p.name}は${p.time}。${p.trait}人だ。今日は短い時間だけ、隣に座ってくれた。`:`${s.place}から、${p.name}がよく歌っていた歌の話が届いた。遠く離れても、節回しは忘れていなかった。`,'この国には電話もインターネットもない。遠方の知らせには、何週間もかかる。',{happy:s.support>50?6:2,charm:2}),
()=>{let ill=r()>(k.medicine/130);return entry(age,'熱の夜',ill?`${p.name}が残してくれた看病の知恵を頼りに、熱が下がるのを待った。薬師の往診は、この家には高い買い物だった。`:'町の施療所で薬を受け取り、数日休んだ。魔法でも、すべての病が治るわけではなかった。','この国に公的な医療保険や救急車はない。治療を受けられるかは、距離と手持ちのお金にも左右される。',{health:ill?-11:-3,wealth:ill?-6:-2})},
()=>entry(age,'文字を覚える',k.school>60?'町の学び舎で、初めて自分の名を書いた。紙の余白いっぱいに、同じ文字を繰り返した。':'働き終えた人に頼み、木片の裏で文字を教わった。教室へ毎日通える子は、この町ではまだ少ない。','この王国には、すべての子どもが無償で通える義務教育の仕組みはない。',{mind:k.school>60?6:2,happy:2}),
()=>entry(age,'長い食卓',s.support>50?'隣の家からスープが届いた。翌日は、こちらが薪割りを手伝った。借りは帳簿に書かれなかった。':'広場の共同鍋に、残った豆を一握り入れた。名前を知らない人が、あなたの器によそってくれた。',null,{happy:7,charm:2}),
()=>entry(age,k.peace<50?'街道が閉ざされた':'市の立つ日',k.peace<50?'国境の争いで街道が閉まり、粉の値段が上がった。いつものパンを、今日は薄く切り分けた。':'荷車が市に集まり、遠くの果物が並んだ。買えなくても、店先の匂いを覚えて帰った。','この国には鉄道や冷蔵輸送がない。街道や収穫の不調が、食卓に直接響く。',{wealth:k.peace<50?-7:3,happy:k.peace<50?-3:2}),
()=>entry(age,`${k.sport}の祭り`,`町じゅうが${k.sport}に沸いた。勝者よりも大きな声で、転んだ選手に声援が送られた。${k.culture}`,null,{happy:6}),
()=>entry(age,early?'小さな手の仕事':'手のなかの稼ぎ',early?`${s.family==='孤児院'?'養育者':p.role}の仕事を手伝い、初めて小さな銅貨をもらった。遊ぶ時間は減ったが、食卓に豆が増えた。`:`働いた分の銅貨を並べた。${s.job==='まだ名もなき子'?'働き始めたばかりの者':s.job}としての暮らしにも、休めない日と、役に立てた日がある。`,'この地方に有給休暇や失業保険の制度はない。働けない期間を、家族や近隣で支えている。',{wealth:4,body:2,health:-2}),
()=>entry(age,'雨漏りの夜','雨の落ちる場所に器を並べた。明け方、屋根を直しに来た隣人へ、温かい茶をいれた。','この家には電気も自動の暖房もない。明かりと暖かさには、薪や油を用意する手間がいる。',{wealth:-3,happy:3}),
()=>entry(age,'家族のかたち',s.absent?`${q.role}は${q.absence}。その空いた場所を、${p.name}だけで埋めることはできない。それでも一緒に過ごす人がいる。`:s.siblings?`きょうだいと一枚の毛布を取り合った。夜半に目が覚めると、半分がそっとこちらへ戻されていた。`:`${s.family==='孤児院'?'同じ家で育った子':'近所の子'}と、屋根の上に見える星へ勝手な名前をつけた。`,null,{happy:5}),
()=>entry(age,'役目を引き継ぐ',`${p.name}が使っていた道具を、若い人が磨いている。あなたが知っている手順を、一つずつ伝えた。`,null,{happy:5,mind:2}),
()=>entry(age,'何でもない一日','朝に目覚め、食べ物を分け、夕方に帰る場所があった。年表に書くほどのことではないと、思っていた。',null,{happy:4}),
()=>entry(age,'布切れの人形',`${p.name}が古い服の端で作った人形を、寝床に置いてくれた。片方だけ大きな目が、暗い部屋でもこちらを向いていた。`,null,{happy:5}),
()=>entry(age,'午後の泥遊び','仕事のない午後、子どもたちと泥の城を作った。王様役は順番で、帰るころにはみんな同じくらい汚れていた。',null,{happy:5,body:1}),
()=>entry(age,'借りた一冊','旅人が置いていった本を、何人かで回し読みした。破れた頁の先に何があったのか、みんなで続きを考えた。','この地方に印刷所や公共図書館はまだ少ない。一冊の本に出会えることにも、場所による違いがある。',{mind:3,happy:3}),
()=>entry(age,'雨上がりの友','帰り道、同じ年ごろの子と軒先で雨を待った。話すことが尽きても、気まずくならない時間があると知った。',null,{charm:3,happy:4}),
()=>entry(age,'最初の自分の靴','すり減った靴を直してもらった。自分で払った代金を見て、職人が紐を一本おまけしてくれた。',null,{wealth:-3,happy:4}),
()=>entry(age,'旅立ちの朝',`${k.culture} あなたもその習わしを受け取った。大きな旅でなくても、昨日と違う場所へ一歩出るのは怖かった。`,null,{luck:2,happy:3}),
()=>entry(age,'仕事仲間の席','いつも隣で働く人が来ない日があった。理由を聞く前に、誰かがその人の分の仕事を少しずつ引き受けた。',null,{body:2,health:-1,happy:3}),
()=>entry(age,'小さな修理','欠けた器を直して、また食卓に戻した。継ぎ目を見るたび、捨てずにすんだ日のことを思い出す。',null,{mind:2,wealth:2}),
()=>entry(age,'若い人の相談','自分には分からないことを尋ねられた。一緒に考えようと答えると、相手は少し肩の力を抜いた。',null,{charm:3,happy:4}),
()=>entry(age,'残しておいた種','小さな袋にしまった種を、近所の子と蒔いた。あなたが収穫するとは限らない。それでも土をかぶせた。',null,{happy:5}),
()=>entry(age,'覚えていてくれた人','ずっと前に手を貸した相手が、あなたを訪ねてきた。こちらは忘れかけていた日のことを、その人は覚えていた。',null,{happy:6,charm:2}),
()=>entry(age,'灯を消す前に','いつもの器を洗い、窓を閉めた。明日のための薪を一本だけ足す。その小さな支度が、誰かを朝まで温める。',null,{happy:5})
];
let index;if(slot===0)index=[0,3,7,5,10,11][s.step];else if(slot===1)index=[9,2,6,8,4,1][s.step];else index=12+s.step*2+Math.floor(r()*2);return choices[index]();}
G.prepare=function(s,r=Math.random){if(s.ended||s.prepared===s.step)return;s.prepared=s.step;s.queueIndex=0;const from=s.age,to=G.targetAge(s);s.queue=Array.from({length:3},(_,i)=>daily(s,i,Math.round(from+(to-from)*(i+1)/4),r));};
G.advance=function(s){if(s.ended||s.queueIndex>=s.queue.length)return null;let e=s.queue[s.queueIndex++];s.age=e.age;for(const [key,v] of Object.entries(e.effect)){if(key in s.stats)s.stats[key]=clamp(s.stats[key]+v);else if(['health','wealth','happy'].includes(key))s[key]=clamp(s[key]+v);}s.log.push({...e});s.memories.push(e.title);s.worldTick++;return e;};
G.choose=function(s,index,r=Math.random){if(s.ended||s.pending||!Number.isInteger(index)||index<0||index>2||s.queueIndex<s.queue.length)return s;const e=G.events[s.eventIds[s.step]],o=e.options[index],risk=G.deathRisk(s,o); // Adapt legacy engine's risk without mutating shared event data.
const original=o.risk;o.risk=risk/(1+(100-s.health)/150);try{baseChoose(s,index,r);}finally{o.risk=original;}if(s.step&&s.log.length){let l=s.log.findLast(x=>x.choice);if(l&&!l.fatal){l.text=`「${o.label}」という選択は、${l.success?'新しいつながりと経験を残した':'思うようには実らなかった'}。${s.support>55?'家へ戻れば、話を聴く人がいた。':'それでも翌朝には、また暮らしが続いていた。'}`;}}if(s.ended&&s.cause==='天寿を迎えて'){const last=s.log.findLast(x=>x.choice);s.age=Math.max(s.age,last.age+1);s.log[s.log.length-1].age=s.age;}return s;};
G.ending=function(s){let end=baseEnding(s);if(!s.kingdom)return end;const p=s.parents[0];end.text=`${s.kingdom}の${s.place}で、${p.name}に育てられた${s.race}の子。${s.absent?'会えない家族を想いながら、':s.siblings?'きょうだいと日々を分け合い、':'身近な人たちに出会い、'}あなたは${s.age}年を生きた。${s.job==='まだ名もなき子'?'まだ大人になる前の人生だった。':`${s.job}として過ごした日々があった。`}${s.happy>=65?'豊かさだけでは測れない、共に食卓を囲む時間が残った。':'暮らしの重さを、一人では抱えきれない日もあった。'}${s.memories.includes('文字を覚える')?'かつて木片や紙に書いた文字は、やがて誰かへ言葉を渡す力になった。':''} 歴史書には載らなくても、あなたがいた世界は、いなかった世界と同じではない。`;return end;};
G.valid=function(s){return !!(s&&s.version===2&&G.country(s)&&G.races.some(r=>r.name===s.race)&&G.families.some(f=>f.name===s.family)&&G.talents.some(t=>t.name===s.talent)&&Number.isInteger(s.step)&&s.step>=0&&s.step<=6&&(s.step<6||s.ended)&&Number.isInteger(s.reveal)&&s.reveal>=0&&s.reveal<=4&&s.stats&&Object.values(s.stats).every(Number.isFinite)&&Array.isArray(s.parents)&&s.parents.length===2&&Array.isArray(s.log)&&Array.isArray(s.queue)&&Number.isInteger(s.queueIndex)&&s.queueIndex>=0&&s.queueIndex<=s.queue.length&&Array.isArray(s.eventIds)&&s.eventIds.length===6&&s.eventIds.every((id,i)=>G.events[id]?.stage===i));};
})();



