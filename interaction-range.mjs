export function withinReach(a,b,radius){
  if(!Number.isFinite(radius)||radius<0)return false;
  const coordinates=[a.x,a.y,a.z,b.x,b.y,b.z];
  if(!coordinates.every(Number.isFinite))return false;
  return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<radius;
}
