import assert from 'node:assert/strict';
import {ROACH_MOVEMENT as types,steeringInput,turnToward,forwardStep} from './movement-controls.mjs';
for(const [key,expected] of [['w',{x:0,z:-1}],['d',{x:1,z:0}],['s',{x:0,z:1}],['a',{x:-1,z:0}]]){
 const input=steeringInput({x:0,z:0},new Set([key]),0),step=forwardStep(input.heading,1);
 assert.ok(Math.abs(step.x-expected.x)<1e-10&&Math.abs(step.z-expected.z)<1e-10);
}
assert.deepEqual(steeringInput({x:0,z:0},new Set(['w']),.4),steeringInput({x:0,z:0},new Set(['arrowup']),.4));
assert.equal(steeringInput({x:1,z:1},new Set(['w','d']),0).magnitude,1);
assert.equal(steeringInput({x:.25,z:0},new Set(),0).magnitude,.25);
assert.equal(turnToward(0,1,10,.04),.4);
assert.equal(turnToward(0,.1,10,.04),.1);
assert.ok(turnToward(Math.PI-.1,-Math.PI+.1,1,.04)>Math.PI-.1);
assert.ok(types.agile.turnRate>types.fast.turnRate&&types.fast.turnRate>types.fly.turnRate);
assert.ok(types.fast.speed>types.agile.speed&&types.agile.speed>types.fly.speed);
function turnFrames(fps){let angle=0;for(let i=0;i<fps;i++)angle=turnToward(angle,2,1,1/fps);return angle}
assert.ok(Math.abs(turnFrames(30)-turnFrames(60))<1e-10);
console.log('PASS: 4 cardinal facings, arrow parity, diagonal/analog magnitude, bounded/no-overshoot/shortest turn, archetype tradeoffs, frame-rate consistency.');
