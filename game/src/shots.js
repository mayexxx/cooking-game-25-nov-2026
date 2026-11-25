export function stageShot(name,w){
  w.reset();
  if(name==='start')return 'title';
  if(name==='play'){w.time=132;w.orders=[{type:1,patience:72,max:100},{type:2,patience:91,max:100}];w.plate=['bun','grilled patty','chopped lettuce'];w.grill='grilled patty';w.cook=8;w.hand='chopped tomato';w.player={x:850,y:510};w.score=w.coins=86;w.served=1;w.combo=1;w.say('Burger nearly ready — add tomato!');return 'play';}
  if(name==='serve'){w.time=96;w.orders=[{type:1,patience:64,max:100},{type:0,patience:83,max:100}];w.plate=['bun','grilled patty','chopped lettuce','chopped tomato'];w.hand='plate';w.player={x:1100,y:416};w.score=w.coins=148;w.served=2;w.combo=2;w.say('Ready to serve! Press E');return 'play';}
  w.time=0;w.score=w.coins=428;w.served=7;w.bestCombo=4;w.strikes=2;w.over=true;return 'end';
}
