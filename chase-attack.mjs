// Fixed ground target, with one strike event per windup.
export function createChaseAttack(){return {phase:'idle',remaining:0,target:null};}
export function stepChaseAttack(state,dt,attacker,player){
 const result={started:false,strike:null};
 if(state.phase==='idle'){
  if(Math.hypot(attacker.x-player.x,attacker.z-player.z)<=.9&&player.y<=.3){
   state.phase='windup';state.remaining=.6;
   state.target={x:player.x,y:0,z:player.z};result.started=true;
  }
 }else{
  state.remaining=Math.max(0,state.remaining-Math.max(0,dt));
  if(state.remaining<=1e-9){
   if(state.phase==='windup'){result.strike={...state.target};state.phase='recovery';state.remaining=1.5;}
   else{state.phase='idle';state.target=null;}
  }
 }
 return result;
}
