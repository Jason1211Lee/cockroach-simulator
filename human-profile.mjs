// Appearance, reaction and input ownership are independent character choices.
// This ID describes the existing procedural placeholder, not a realistic asset.
export function createHumanProfile({
 appearanceId='procedural-human-v1',
 personalityId='shy',
 controller='ai'
}={}){
 if(appearanceId!=='procedural-human-v1')throw new RangeError('Unknown human appearance');
 if(!['shy','chase','spray'].includes(personalityId))throw new RangeError('Unknown human personality');
 if(!['player','ai'].includes(controller))throw new RangeError('Unknown human controller');
 return Object.freeze({appearanceId,personalityId,controller});
}

// Prototype tuning values, not claims about real human psychology.
const fearGain=Object.freeze({shy:25,chase:8,spray:14});
export function stepHumanFear(value,personalityId,threatened,dt){
 if(!Object.hasOwn(fearGain,personalityId))throw new RangeError('Unknown human personality');
 if(!Number.isFinite(value)||!Number.isFinite(dt)||dt<0)throw new RangeError('Invalid fear state or time');
 return Math.max(0,Math.min(100,value+(threatened?fearGain[personalityId]:-15)*dt));
}
