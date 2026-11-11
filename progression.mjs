// Game balance values, not biological measurements.
export function createProgress(){return {xp:0,claimed:new Set()};}
export function awardExperience(progress,id,amount){
 if(progress.claimed.has(id)||!Number.isFinite(amount)||amount<=0)return false;
 progress.claimed.add(id);progress.xp+=amount;return true;
}
export function growthStats(xp){
 const level=xp>=80?3:xp>=30?2:1;
 return {level,strength:level>=2?2:1,speedMultiplier:level>=2?1.1:1};
}
