import {cameraStopFraction} from './camera-collision.mjs';
// Bounds describe solid furniture; actors use eye/body sample points.
export function hasLineOfSight(origin,target,boxes){
 return cameraStopFraction(origin,target,boxes,0)===1;
}
export function humanCanSee(human,roach,boxes){
 return hasLineOfSight(
  {x:human.x,y:human.y+1.6,z:human.z},
  {x:roach.x,y:roach.y+.08,z:roach.z},boxes);
}
