export function adjustAltitude(height,delta){return Math.max(.25,Math.min(2.2,height+delta));}
export function flightHeight(remaining,height){return remaining>0?adjustAltitude(height,0):0;}
