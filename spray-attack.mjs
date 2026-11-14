export function createSprayAttack(){return {phase:'idle',remaining:0,target:null,tick:0};}
export function insideSprayCloud(player,target){
 return !!target&&player.y>=0&&player.y<=1.5&&Math.hypot(player.x-target.x,player.z-target.z)<=.85;
}
export function stepSprayAttack(state,dt,attacker,player){
 const result={damage:false};
 dt=Math.max(0,dt);
 if(state.phase==='idle'){
  if(Math.hypot(attacker.x-player.x,attacker.z-player.z)<=2.2&&player.y<=1.5){
   state.phase='windup';state.remaining=.8;state.target={x:player.x,y:0,z:player.z};
  }
  return result;
 }
 state.remaining=Math.max(0,state.remaining-dt);
 if(state.phase==='windup'&&state.remaining<=1e-9){
  state.phase='cloud';state.remaining=3;state.tick=1;result.damage=insideSprayCloud(player,state.target);
 }else if(state.phase==='cloud'){
  if(state.remaining<=1e-9){state.phase='recovery';state.remaining=4;}
  else{
   state.tick-=dt;
   if(state.tick<=1e-9){state.tick=1;result.damage=insideSprayCloud(player,state.target);}
  }
 }else if(state.phase==='recovery'&&state.remaining<=1e-9){
  state.phase='idle';state.target=null;
 }
 return result;
}
