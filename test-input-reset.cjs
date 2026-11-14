const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/3d.html','utf8');
const clear=html.slice(html.indexOf('function clearMovement(){'),html.indexOf('\nfunction reset(){'));
const reset=html.slice(html.indexOf('function reset(){'),html.indexOf('reset();function move'));
const context=vm.createContext({});
vm.runInContext(`let keys=new Set(['w']),axis={x:1,z:-1},pointer=7,p,score,end,hp,cool,flight,yaw;let foods=[];const scene={remove(){}};const human={position:{set(){}}},roach={position:{set(){}}};function box(){return {}};${clear};${reset}`,context);
for(const call of ['reset()','clearMovement()']){vm.runInContext("keys.add('w');axis={x:1,z:-1};pointer=7;"+call,context);assert.equal(vm.runInContext('keys.size===0&&axis.x===0&&axis.z===0&&pointer===null',context),true)}
for(const snippet of ["document.addEventListener('visibilitychange',clearMovement)","addEventListener('resize',()=>{clearMovement();","addEventListener('blur',clearMovement)"])assert.ok(html.includes(snippet));
for(const id of ['#role','#type','#mood'])assert.ok(html.includes(`$('${id}').onchange=reset`));
console.log('PASS: reset and clearMovement clear keyboard/axis/pointer; lifecycle and selection wiring checked. VM stubs only, no browser/device validation.');
