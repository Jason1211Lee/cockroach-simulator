import assert from 'node:assert/strict';
import {inSafeZone} from './safe-zone.mjs';
for(const p of [{x:-4,y:0,z:3},{x:-4.6,y:0,z:2.4},{x:-3.4,y:.2,z:3.6}])assert.equal(inSafeZone(p),true);
for(const p of [{x:-4.6001,y:0,z:3},{x:-4,y:0,z:2.3999},{x:-4,y:.2001,z:3},{x:-4,y:-.01,z:3},{x:0,y:0,z:0}])assert.equal(inSafeZone(p),false);
console.log('PASS: refuge center, inclusive pad corners and height, outside edges, airborne and below-floor rejection.');
