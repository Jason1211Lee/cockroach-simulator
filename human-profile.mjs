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
