export function orbitDrag(yaw,pitch,dx,dy){
  if(![yaw,pitch,dx,dy].every(Number.isFinite))throw new TypeError('Finite orbit input required');
  return {yaw:yaw-dx*.005,pitch:Math.max(.12,Math.min(1.15,pitch+dy*.005))};
}
export function orbitOffset(yaw,pitch,radius){
  return {x:Math.sin(yaw)*Math.cos(pitch)*radius,y:Math.sin(pitch)*radius,z:Math.cos(yaw)*Math.cos(pitch)*radius};
}
