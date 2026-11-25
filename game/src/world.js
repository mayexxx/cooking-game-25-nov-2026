export const recipes = [
  {name:'Garden Salad', items:['chopped lettuce','chopped tomato','chopped onion'], reward:40},
  {name:'Classic Burger', items:['bun','grilled patty','chopped lettuce','chopped tomato'], reward:65},
  {name:'Cheese Melt', items:['bun','grilled patty','cheese'], reward:55}
];
export const stations = [
  ...['tomato','lettuce','onion','patty','bun','cheese'].map((item,i)=>({id:item,x:80+i*73,y:319,kind:'crate'})),
  {id:'board',x:555,y:330},{id:'grill',x:752,y:330},{id:'plate',x:953,y:330},{id:'window',x:1133,y:295},{id:'bin',x:1158,y:568}
];
export function createWorld(random=Math.random){
  const w={};
  w.reset=()=>{Object.assign(w,{time:180,score:0,coins:0,served:0,combo:0,bestCombo:0,strikes:0,orders:[],spawn:20,hand:null,plate:[],board:null,chop:0,grill:null,cook:0,player:{x:620,y:550},message:'Welcome to the kitchen!',messageTime:3,over:false}); w.addOrder(0);};
  w.say=(s)=>{w.message=s;w.messageTime=2.4;};
  w.addOrder=(type)=>{if(w.orders.length<3)w.orders.push({type,patience:100,max:100});};
  w.step=(dt,dx=0,dy=0,chopping=false)=>{if(w.over)return; w.time=Math.max(0,w.time-dt); w.player.x=Math.max(35,Math.min(1245,w.player.x+dx*220*dt));w.player.y=Math.max(390,Math.min(666,w.player.y+dy*220*dt));w.messageTime=Math.max(0,w.messageTime-dt);w.spawn-=dt; if(w.spawn<=0){const elapsed=180-w.time;w.addOrder(elapsed<25?0:Math.floor(random()*(elapsed<55?2:3)));w.spawn=Math.max(10,20-elapsed/24);} for(const o of w.orders)o.patience-=dt*(100/85);const expired=w.orders.filter(o=>o.patience<=0);if(expired.length){w.strikes+=expired.length;w.combo=0;w.orders=w.orders.filter(o=>o.patience>0);w.say('A guest left waiting!');} if(w.grill){w.cook+=dt;if(w.cook>=14)w.grill='burnt patty';else if(w.cook>=7)w.grill='grilled patty';} if(chopping&&w.board&&!w.board.startsWith('chopped')&&Math.hypot(w.player.x-555,w.player.y-390)<125){w.chop+=dt;if(w.chop>=2){w.board='chopped '+w.board;w.chop=0;w.say('Chopped and ready!');}} if(w.time<=0||w.strikes>=3)w.over=true;};
  w.interact=(id)=>{if(w.over)return; if(['tomato','lettuce','onion','patty','bun','cheese'].includes(id)){if(!w.hand){w.hand=id==='patty'?'raw patty':id;w.say('Picked up '+w.hand);}else w.say('Your hands are full');return;}
    if(id==='board'){if(w.hand&&['tomato','lettuce','onion'].includes(w.hand)&&!w.board){w.board=w.hand;w.hand=null;w.chop=0;w.say('Hold E to chop');}else if(!w.hand&&w.board?.startsWith('chopped')){w.hand=w.board;w.board=null;w.say('Ready for the plate');}else if(w.board)w.say('Hold E to chop');else w.say('Bring a vegetable to chop');}
    if(id==='grill'){if(w.hand==='raw patty'&&!w.grill){w.grill=w.hand;w.hand=null;w.cook=0;w.say('Patty on the grill');}else if(!w.hand&&w.grill){w.hand=w.grill;w.grill=null;w.cook=0;w.say(w.hand==='burnt patty'?'That belongs in the bin':'Picked up '+w.hand);}else w.say('Bring a raw patty');}
    if(id==='plate'){if(w.hand==='plate'){w.hand=null;w.say('Plate returned');}else if(w.hand){if(w.hand==='burnt patty'||w.hand==='raw patty'||['tomato','lettuce','onion'].includes(w.hand))w.say('Prepare that ingredient first');else if(w.plate.length<4){w.plate.push(w.hand);w.hand=null;w.say('Added to the plate');}else w.say('Plate is full');}else if(w.plate.length){w.hand='plate';w.say('Take it to the window');}else w.say('Add ingredients here');}
    if(id==='window'){if(w.hand==='plate'){const match=w.orders.findIndex(o=>[...recipes[o.type].items].sort().join('|')===[...w.plate].sort().join('|'));if(match>=0){const o=w.orders.splice(match,1)[0],tip=Math.round(o.patience/10);w.combo++;w.bestCombo=Math.max(w.combo,w.bestCombo);const points=recipes[o.type].reward+tip+w.combo*2;w.coins+=points;w.score+=points;w.served++;w.say('Served! +'+points+' coins');}else{w.combo=0;w.say('No matching ticket');}w.hand=null;w.plate=[];}else w.say('Bring a finished plate');}
    if(id==='bin'){if(w.hand==='plate'){w.plate=[];w.hand=null;}else if(w.hand)w.hand=null;else if(w.plate.length)w.plate=[];w.say('Cleared away');}
  };w.reset();return w;
}
