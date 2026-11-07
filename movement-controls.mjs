export const ROACH_MOVEMENT=Object.freeze({
 fast:Object.freeze({speed:1.38,turnRate:10}),
 agile:Object.freeze({speed:1.2,turnRate:12}),
 fly:Object.freeze({speed:1.02,turnRate:8.5})
});
export function steeringInput(axis,keys,yaw){
 const x=axis.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
 const z=axis.z+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
 const magnitude=Math.min(1,Math.hypot(x,z));
 return {magnitude,heading:Math.atan2(-x,-z)+yaw};
}
export function turnToward(current,desired,rate,dt){
 const difference=Math.atan2(Math.sin(desired-current),Math.cos(desired-current));
 return current+Math.sign(difference)*Math.min(Math.abs(difference),rate*Math.max(0,dt));
}
export function forwardStep(heading,distance){return {x:-Math.sin(heading)*distance,z:-Math.cos(heading)*distance};}
