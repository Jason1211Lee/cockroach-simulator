import assert from 'node:assert/strict';
import {orbitDrag,orbitOffset} from './camera-orbit.mjs';
assert.equal(orbitDrag(0,.4,100,0).yaw,-.5);
assert.equal(orbitDrag(0,.4,0,1000).pitch,1.15);
assert.equal(orbitDrag(0,.4,0,-1000).pitch,.12);
assert.deepEqual(orbitDrag(2,.4,0,0),{yaw:2,pitch:.4});
const start=orbitDrag(0,.4,40,30),back=orbitDrag(start.yaw,start.pitch,-40,-30);
assert.ok(Math.abs(back.yaw)<1e-12&&Math.abs(back.pitch-.4)<1e-12);
for(const yaw of [0,1,3,-2]){const p=orbitOffset(yaw,.4,2.4);assert.ok(Math.abs(Math.hypot(p.x,p.y,p.z)-2.4)<1e-12);assert.ok(p.y>0)}
assert.throws(()=>orbitDrag(0,.4,NaN,0),TypeError);
console.log('PASS: horizontal orbit, pitch bounds, zero/reversed drag, fixed camera radius and invalid input. No browser/device verification.');
