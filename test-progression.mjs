import assert from 'node:assert/strict';
import {createProgress,awardExperience,growthStats} from './progression.mjs';
import {ROACH_MOVEMENT} from './movement-controls.mjs';
const p=createProgress();
assert.deepEqual(growthStats(29),{level:1,strength:1,speedMultiplier:1});
assert.equal(growthStats(30).level,2);
assert.equal(growthStats(79).level,2);
assert.equal(growthStats(80).level,3);
assert.equal(awardExperience(p,'food:1',10),true);
assert.equal(awardExperience(p,'food:1',10),false);
assert.equal(p.xp,10);
assert.equal(awardExperience(p,'bad',NaN),false);
assert.equal(awardExperience(p,'bad',-5),false);
for(const xp of [0,30,80]){
 const m=growthStats(xp).speedMultiplier;
 assert.ok(ROACH_MOVEMENT.fast.speed*m>ROACH_MOVEMENT.agile.speed*m);
 assert.ok(ROACH_MOVEMENT.agile.speed*m>ROACH_MOVEMENT.fly.speed*m);
 assert.equal(ROACH_MOVEMENT.fast.turnRate,10);
}
assert.equal(growthStats(100000).speedMultiplier,1.1,'growth capped');
assert.equal(createProgress().xp,0);
console.log('PASS: XP thresholds, reward deduplication, invalid rewards, capped growth and archetype speed ordering.');
