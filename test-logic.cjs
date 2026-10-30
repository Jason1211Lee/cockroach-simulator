// Runs the gameplay assertions without a browser. Does not validate rendering or real touch.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{style:{},textContent:'',dataset:{action:id.includes('fly')?'fly':''},handlers:{},addEventListener(k,f){this.handlers[k]=f},getBoundingClientRect(){return {left:0,top:0,width:112,height:112}},setPointerCapture(){},getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true})}});return elements.get(id)}
const document={querySelector:element,querySelectorAll:()=>[],addEventListener(){}};
const context=vm.createContext({document,requestAnimationFrame(){},addEventListener(){},console,Math,Set});
const source=fs.readFileSync(__dirname+'/index.html','utf8').split('<script>')[1].split('</script>')[0];
vm.runInContext(source,context);
const page={evaluate:async fn=>{const value=vm.runInContext('('+fn.toString()+')()',context);return value===undefined?undefined:JSON.parse(JSON.stringify(value))}};
let tests=fs.readFileSync(__dirname+'/test.cjs','utf8');tests=tests.slice(tests.indexOf("await page.evaluate(()=>{reset();state.npcs=[];keys.add"),tests.indexOf('await page.setViewportSize'));
(async()=>{await eval('(async()=>{'+tests+'})()');await page.evaluate(()=>{axis={x:1,y:0};clearInput()});assert.equal(await page.evaluate(()=>axis.x),0);console.log('PASS: movement, collision, rewards, upgrades, win, damage cooldown, safe zone, flight landing, chase, spray, input reset. Browser rendering and device touch NOT tested.');})().catch(e=>{console.error(e);process.exit(1)});
