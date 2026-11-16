// Ground refuge matches the 1.2 x 1.2 green delivery pad.
export function inSafeZone(position){
 return Math.abs(position.x+4)<=.6+1e-9&&Math.abs(position.z-3)<=.6+1e-9&&position.y>=0&&position.y<=.2;
}
