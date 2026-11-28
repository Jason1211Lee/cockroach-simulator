export function cameraStopFraction(origin,end,boxes,margin=.12){
 const delta=['x','y','z'].map(k=>end[k]-origin[k]),length=Math.hypot(...delta);
 if(length===0)return 1;
 let nearest=1;
 for(const box of boxes){
  let enter=0,exit=1,miss=false;
  for(let i=0;i<3;i++){
   const k=['x','y','z'][i],v=delta[i],p=origin[k];
   if(Math.abs(v)<1e-10){if(p<box.min[k]||p>box.max[k]){miss=true;break}}
   else{let a=(box.min[k]-p)/v,b=(box.max[k]-p)/v;if(a>b)[a,b]=[b,a];enter=Math.max(enter,a);exit=Math.min(exit,b);if(enter>exit){miss=true;break}}
  }
  if(!miss&&exit>=0&&enter<=1)nearest=Math.min(nearest,Math.max(0,enter-margin/length));
 }
 return nearest;
}
