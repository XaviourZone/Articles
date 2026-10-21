import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const $ = id => document.getElementById(id);
const canvas = $('world');
let renderer, scene, camera, water, boat, clock, raf, lastQuizAt=-99;
let running=false, paused=false, started=false, elapsed=0, distance=0, score=0, lane=0, laneTarget=0, slideTimer=0, fireCooldown=0, invulnerable=0, taskCount=0, quizCount=0, correctCount=0, collected=0, hull=100, transponder=false, kills=0, intelPause=false, helmAngle=0, helmDragging=false, helmPointer=null, missionOrder=0, lastOrderAt=0, spawnedEnemies=0;
let obstacles=[], collectibles=[], projectiles=[], effects=[], clouds=[];
const laneX=[-3.05,0,3.05], rnd=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function makeMat(color,rough=.5,metal=0,extra={}){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,...extra})}
function addMesh(parent,geo,mat,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1]){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.rotation.set(...rot);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(parent,w,h,d,mat,pos){return addMesh(parent,new THREE.BoxGeometry(w,h,d),mat,pos)}
function makeBoat(){
 const g=new THREE.Group();
 const hullMat=makeMat('#e8edf0',.32,.35), navy=makeMat('#153b52',.3,.35), orange=makeMat('#ff643c',.34,.15), glass=makeMat('#69d8ee',.17,.4,{emissive:'#0a3148',emissiveIntensity:.4}), metal=makeMat('#c8e4ed',.25,.75), black=makeMat('#0b202d',.4,.4);
 // sculpted hull cross-sections; bow tapers forward
 const rings=[{z:-2.45,w:.08,y:.1},{z:-1.95,w:.58,y:-.12},{z:-1.2,w:.86,y:-.28},{z:.1,w:.94,y:-.34},{z:1.2,w:.82,y:-.26},{z:1.75,w:.68,y:-.08},{z:1.95,w:.55,y:.02}];
 const verts=[],inds=[];
 rings.forEach(r=>{verts.push(-r.w,r.y, r.z, r.w,r.y,r.z, -r.w,r.y+.28,r.z, r.w,r.y+.28,r.z)});
 for(let i=0;i<rings.length-1;i++){let a=i*4,b=a+4;inds.push(a,b,a+2,a+2,b,b+2,a+1,a+3,b+1,a+3,b+3,b+1,a,a+1,b,a+1,b+1,b)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(inds);geo.computeVertexNormals();addMesh(g,geo,new THREE.MeshStandardMaterial({color:'#e8edf0',roughness:.3,metalness:.35,side:THREE.DoubleSide}));
 // rub rail, dark hull stripe and bow trim
 box(g,1.45,.12,2.75,navy,[0,-.02,.05]);box(g,1.66,.1,1.8,hullMat,[0,.18,.18]);
 // rear deck and non-slip pads
 box(g,1.35,.12,1.12,makeMat('#b9c9d0',.72),[0,.24,1.05]);
 for(let x of [-.46,-.23,0,.23,.46])box(g,.035,.012,.78,makeMat('#637e8c',.8),[x,.307,1.05]);
 // central cabin
 box(g,.93,.48,1.03,hullMat,[0,.48,-.05]);
 box(g,.87,.06,.98,navy,[0,.74,-.05]);
 // bridge front windows, angled windscreen strips
 for(let x of [-.31,-.1,.1,.31]){const win=box(g,.18,.22,.035,glass,[x,.58,-.59]);win.rotation.x=-.16}
 // orange safety bands both sides
 for(let side of [-1,1]){box(g,.06,.14,1.8,orange,[side*.81,.02,.1]);box(g,.07,.08,1.22,orange,[side*.72,.23,.86]);
  // rail stanchions
  for(let z of [-.45,.05,.55,1.05,1.45]){let pole=addMesh(g,new THREE.CylinderGeometry(.018,.022,.36,8),metal,[side*.68,.46,z]);}
  const rail=addMesh(g,new THREE.CylinderGeometry(.018,.018,1.9,8),metal,[side*.68,.64,.52],[Math.PI/2,0,0]);}
 // bow deck, anchor cleat and light
 box(g,.42,.09,.55,hullMat,[0,.26,-1.4]);
 addMesh(g,new THREE.CylinderGeometry(.035,.035,.1,10),metal,[0,.33,-1.55],[Math.PI/2,0,0]);
 // cabin roof, mast, radar scanner
 box(g,1.02,.1,.9,makeMat('#f8fbfd',.3),[0,.79,-.04]);
 addMesh(g,new THREE.CylinderGeometry(.025,.035,.9,8),metal,[0,1.22,-.02]);
 box(g,.46,.035,.09,navy,[0,1.58,-.02]);
 const radar=addMesh(g,new THREE.BoxGeometry(.52,.025,.055),makeMat('#9cf4ff',.2,.4,{emissive:'#34caff',emissiveIntensity:1}),[0,1.6,-.02]);radar.userData.spin=true;
 // mast lights
 const red= new THREE.MeshStandardMaterial({color:'#ff503e',emissive:'#ff251c',emissiveIntensity:2});
 const green=new THREE.MeshStandardMaterial({color:'#44ffd2',emissive:'#20ffbd',emissiveIntensity:2});
 addMesh(g,new THREE.SphereGeometry(.055,12,8),red,[-.48,.49,.15]);addMesh(g,new THREE.SphereGeometry(.055,12,8),green,[.48,.49,.15]);
 // lifebuoys and twin outboards
 for(let side of [-1,1]){addMesh(g,new THREE.TorusGeometry(.12,.035,8,18),orange,[side*.58,.32,1.32],[Math.PI/2,0,0]);box(g,.22,.42,.2,black,[side*.31,-.08,1.78]);}
 // search lamp
 addMesh(g,new THREE.SphereGeometry(.09,12,8),new THREE.MeshStandardMaterial({color:'#fff4bd',emissive:'#ffe79a',emissiveIntensity:1.8}),[0,.87,-.56]);
 g.userData.radar=radar;return g;
}
function makeSky(){const geo=new THREE.SphereGeometry(500,32,20);const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uTime:{value:0}},vertexShader:'varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vPos; void main(){float h=normalize(vPos).y;vec3 c=mix(vec3(0.95,0.68,0.43),vec3(0.08,0.49,0.73),smoothstep(-0.08,0.5,h));c=mix(c,vec3(0.025,0.16,0.3),smoothstep(0.45,0.9,h));gl_FragColor=vec4(c,1.0);}'});scene.add(new THREE.Mesh(geo,mat))}
function makeWater(){
 const geo=new THREE.PlaneGeometry(180,420,160,260);geo.rotateX(-Math.PI/2);
 const mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uSpeed:{value:1},uStorm:{value:0},uSun:{value:new THREE.Vector3(-.4,.8,.3)}},vertexShader:`uniform float uTime; uniform float uSpeed; varying vec3 vWorld; varying float vWave; varying vec2 vUv; void main(){vUv=uv;vec3 p=position;float t=uTime;float w1=sin(p.x*.19+p.z*.045+t*1.2)*.11;float w2=sin(p.x*.43-p.z*.075-t*1.7)*.045;float w3=cos(p.x*.075+p.z*.13+t*.8)*.16;p.y+=w1+w2+w3;vWave=w1+w2+w3;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`uniform float uTime;uniform float uStorm;uniform vec3 uSun;varying vec3 vWorld;varying float vWave;varying vec2 vUv;void main(){float t=uTime;float longWave=sin(vWorld.x*.12+vWorld.z*.035+t*.8);float crossWave=sin(vWorld.x*.29-vWorld.z*.11-t*1.25);float smallWave=sin(vWorld.x*1.7+vWorld.z*.42+t*2.1)*sin(vWorld.z*1.25-vWorld.x*.19-t*1.7);float crest=longWave*.42+crossWave*.31+smallWave*.27;vec3 deep=vec3(.006,.105,.19);vec3 blue=vec3(.008,.29,.41);vec3 teal=vec3(.035,.47,.53);vec3 c=mix(deep,blue,smoothstep(-.85,.35,crest));c=mix(c,teal,smoothstep(.2,.9,crest)*.34);float sunLine=exp(-pow((vWorld.x+vWorld.z*.075+sin(vWorld.z*.08+t)*1.8)*.16,2.))*smoothstep(-.5,.5,vWorld.z+45.);float spec=pow(max(0.,crest*.52+smallWave*.6),8.)*.62;float brokenReflection=sunLine*(.18+.82*pow(max(0.,sin(vWorld.x*2.1+vWorld.z*.16+t*2.8)),7.));float foam=smoothstep(.72,.97,abs(sin(vWorld.x*.52+vWorld.z*.19+t*1.4)*sin(vWorld.x*.17-vWorld.z*.7-t*1.1)));float nearFoam=exp(-abs(vWorld.z-3.5)*.16)*smoothstep(2.5,7.,abs(vWorld.x));c+=vec3(.28,.68,.75)*spec;c+=vec3(.9,.83,.64)*brokenReflection*.42;c=mix(c,vec3(.74,.92,.93),foam*.15+nearFoam*.28);c=mix(c,vec3(.015,.045,.09),uStorm*.72);gl_FragColor=vec4(c,1.);}`,transparent:false});
 water=new THREE.Mesh(geo,mat);water.position.set(0,-.45,-120);water.frustumCulled=false;scene.add(water);
 // ocean fog helps blend horizon
}
function makeCloudTexture(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(255,255,255,.78)');g.addColorStop(.45,'rgba(255,255,255,.42)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
function makeClouds(){const tex=makeCloudTexture();for(let i=0;i<17;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:i%4===0?'#ffe6c6':'#e7f8ff',transparent:true,opacity:rnd(.15,.4),depthWrite:false}));m.position.set(rnd(-85,85),rnd(14,35),rnd(-230,-100));m.scale.set(rnd(18,42),rnd(6,14),1);scene.add(m);clouds.push(m)}}
function createObstacle(type,lane,z){const g=new THREE.Group();if(type==='container'){const body=makeMat(['#df6746','#276d87','#d3a148','#b64a51'][Math.floor(Math.random()*4)],.6);addMesh(g,new THREE.BoxGeometry(2.2,1.35,3.1),body,[0,.68,0]);const line=makeMat('#ffffff55',.6);for(let x=-.85;x<=.9;x+=.28)addMesh(g,new THREE.BoxGeometry(.035,1.2,.025),line,[x,.68,1.56]);addMesh(g,new THREE.BoxGeometry(2.25,.09,3.15),makeMat('#263f4c'),[0,1.37,0]);}
 else if(type==='buoy'){addMesh(g,new THREE.CylinderGeometry(.22,.42,1.35,12),makeMat('#ff6c45',.36),[0,.7,0]);addMesh(g,new THREE.CylinderGeometry(.24,.24,.18,12),makeMat('#f3f7f5'),[0,.62,0]);addMesh(g,new THREE.CylinderGeometry(.07,.07,.45,8),makeMat('#f9d66e'),[0,1.58,0]);addMesh(g,new THREE.SphereGeometry(.12,12,8),new THREE.MeshStandardMaterial({color:'#ffdb75',emissive:'#ff9d32',emissiveIntensity:1.2}),[0,1.82,0]);}
 else { // drifting timber / net hazard
 addMesh(g,new THREE.CylinderGeometry(.23,.28,2.4,10),makeMat('#7b553d'),[0,.28,0],[0,0,Math.PI/2]);for(let x of [-.8,-.25,.3,.8])addMesh(g,new THREE.CylinderGeometry(.3,.3,.05,10),makeMat('#a47a54'),[x,.28,0],[0,0,Math.PI/2]);}
 g.position.set(laneX[lane],-.35,z);g.userData={kind:type,lane,hit:false};scene.add(g);obstacles.push(g);return g}
function createBook(lane,z){
 const g=new THREE.Group();const aura=new THREE.Mesh(new THREE.TorusGeometry(.72,.035,8,40),new THREE.MeshBasicMaterial({color:'#4df5ed',transparent:true,opacity:.72}));aura.rotation.x=Math.PI/2;g.add(aura);
 const box=makeMat('#167e91',.32,.28,{emissive:'#064452',emissiveIntensity:.35}),metal=makeMat('#d5edf0',.4,.35),cross=makeMat('#d5fff3',.3,0,{emissive:'#4df5c1',emissiveIntensity:.5});
 addMesh(g,new THREE.BoxGeometry(.82,.58,.78),box,[0,.3,0]);addMesh(g,new THREE.BoxGeometry(.88,.09,.84),metal,[0,.62,0]);
 addMesh(g,new THREE.BoxGeometry(.12,.025,.48),cross,[0,.69,0]);addMesh(g,new THREE.BoxGeometry(.48,.025,.12),cross,[0,.69,0]);
 const glow=new THREE.PointLight('#39ffeb',2,5);glow.position.y=1;g.add(glow);g.position.set(laneX[lane],.6,z);g.userData={lane,spin:true};scene.add(g);collectibles.push(g);return g;
}
function createTarget(lane,z){
 const g=new THREE.Group();
 const hullMat=makeMat('#b8c6ce',.3,.38), dark=makeMat('#18384a',.45), deck=makeMat('#d7e0df',.55), glass=new THREE.MeshStandardMaterial({color:'#163d51',metalness:.5,roughness:.15,emissive:'#0a526c',emissiveIntensity:.35});
 // A small hostile fast craft silhouette: tapered bow, hull, deckhouse, windows, mast and warning lights.
 const hullGeo=new THREE.BufferGeometry();const verts=new Float32Array([-0.68,0,-1.75,0.68,0,-1.75,0.5,.05,1.2,-0.5,.05,1.2,-0.68,0,-1.75,0.68,0,-1.75,0,.22,1.5,-0.5,.05,1.2,0.5,.05,1.2,0,.22,1.5,-0.34,.42,.35,.34,.42,.35,.28,.42,1.05,-.28,.42,1.05]);hullGeo.setAttribute('position',new THREE.BufferAttribute(verts,3));hullGeo.setIndex([0,1,2,0,2,3,4,5,6,7,8,9,10,11,12,10,12,13]);hullGeo.computeVertexNormals();g.add(new THREE.Mesh(hullGeo,hullMat));
 addMesh(g,new THREE.BoxGeometry(.8,.3,.85),deck,[0,.33,.35]);addMesh(g,new THREE.BoxGeometry(.62,.23,.42),glass,[0,.55,.24]);addMesh(g,new THREE.CylinderGeometry(.025,.035,.72,6),dark,[0,.86,-.18]);addMesh(g,new THREE.BoxGeometry(.55,.04,.05),makeMat('#ff5548',.3,0,{emissive:'#ff291e',emissiveIntensity:1.8}),[0,1.15,-.18]);
 const ring=addMesh(g,new THREE.TorusGeometry(.9,.035,8,36),new THREE.MeshBasicMaterial({color:'#ff735e',transparent:true,opacity:.9}),[0,.1,0]);ring.rotation.x=Math.PI/2;
 const lamp=new THREE.PointLight('#ff463a',1.6,5);lamp.position.set(0,1.2,0);g.add(lamp);
 g.position.set(laneX[lane],-.25,z);g.rotation.y=Math.PI;g.userData={lane,hit:false,kind:'target',ring,contactId:Math.floor(1000+Math.random()*8999),contactName:['SKIMMER','NOMAD','GREY FIN','RAVEN'][spawnedEnemies%4],speed:rnd(.86,1.15)};spawnedEnemies++;scene.add(g);obstacles.push(g);return g;
}
function burst(pos,color='#8af7ff',n=18){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(rnd(.025,.075),6,5),new THREE.MeshBasicMaterial({color,transparent:true,opacity:1}));m.position.copy(pos);m.userData={vel:new THREE.Vector3(rnd(-2,2),rnd(-.1,2.6),rnd(-3,2)),life:rnd(.3,.9),max:0};m.userData.max=m.userData.life;scene.add(m);effects.push(m)}}
function makeProjectile(){const g=new THREE.Group();addMesh(g,new THREE.SphereGeometry(.13,16,12),new THREE.MeshBasicMaterial({color:'#fff7c2'}));addMesh(g,new THREE.CylinderGeometry(.025,.12,2.1,10),new THREE.MeshBasicMaterial({color:'#ff8b3d',emissive:'#ff5a23',emissiveIntensity:1.8}),[0,0,.95],[Math.PI/2,0,0]);const light=new THREE.PointLight('#ff9e48',5,8);g.add(light);g.position.set(boat.position.x,.65,boat.position.z-1.4);g.userData={life:0};scene.add(g);burst(g.position,'#ffe7a2',4);projectiles.push(g)}
function makeWake(){const g=new THREE.Group();for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.1,1.3+i*.16),new THREE.MeshBasicMaterial({color:'#e8fdff',transparent:true,opacity:.3-i*.025,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set((i-3)*.14,-.27,2.3+i*.28);g.add(m)}scene.add(g);return g}
let wake;
function makeDistantScene(){
 // Layered island silhouettes give the sea a readable horizon and sense of scale.
 const islandMat=makeMat('#286b6b',.95), ridgeMat=makeMat('#174f5a',1), sandMat=makeMat('#c8a779',.95), foliage=makeMat('#2e7562',.9);
 function island(x,z,scale){
  const g=new THREE.Group();g.position.set(x,-1.2,z);g.scale.setScalar(scale);
  addMesh(g,new THREE.ConeGeometry(13,19,7),ridgeMat,[0,7,0],[0,.25,.1]);
  addMesh(g,new THREE.ConeGeometry(10,14,7),islandMat,[-8,5,5],[0,-.4,.08]);
  addMesh(g,new THREE.CylinderGeometry(11,14,2.2,9),sandMat,[0,0,0]);
  for(let i=0;i<7;i++){const p=new THREE.Group();addMesh(p,new THREE.CylinderGeometry(.12,.24,2.8,6),makeMat('#74533b'),[0,1.3,0]);addMesh(p,new THREE.SphereGeometry(1.15,8,7),foliage,[0,3,0]);p.position.set(rnd(-10,10),0,rnd(-7,7));g.add(p)}
  scene.add(g);
 }
 island(-68,-185,.9);island(79,-220,1.25);island(-112,-285,1.5);
 // Tiny merchant silhouettes far ahead make the channel feel inhabited.
 function distantShip(x,z,scale,color){
  const g=new THREE.Group();const dark=makeMat('#17384a',.8), hull=makeMat(color,.8), deck=makeMat('#d0d6d2',.8);
  addMesh(g,new THREE.BoxGeometry(3.5,.8,9),hull,[0,0,0]);
  addMesh(g,new THREE.BoxGeometry(2.8,1.5,5.2),deck,[0,.9,.7]);
  for(let i=0;i<5;i++)for(let j=0;j<2;j++)addMesh(g,new THREE.BoxGeometry(1.15,.75,1.2),makeMat(['#c86b4b','#d9b36a','#477d94'][((i+j)%3)],.85),[(j-.5)*1.25,1.95,.6+i*1.1]);
  addMesh(g,new THREE.BoxGeometry(1.2,1.5,1.3),deck,[0,1.5,-3.1]);
  addMesh(g,new THREE.CylinderGeometry(.06,.08,2.8,6),dark,[0,2.9,-3.1]);
  g.position.set(x,-.4,z);g.scale.setScalar(scale);scene.add(g);return g;
 }
 distantShip(-31,-142,.7,'#334f5d');distantShip(38,-178,.95,'#243f50');distantShip(-95,-260,1.15,'#354f5a');
}
function setup(){try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#0b5775',.0027);camera=new THREE.PerspectiveCamera(57,innerWidth/innerHeight,.1,700);camera.position.set(0,6.6,15.8);camera.lookAt(0,1,-13);
 scene.add(new THREE.HemisphereLight('#bdeeff','#10364c',2.1));const sun=new THREE.DirectionalLight('#fff0d1',3.4);sun.position.set(-28,45,-30);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;scene.add(sun);const fill=new THREE.DirectionalLight('#50d8ff',1.25);fill.position.set(20,15,12);scene.add(fill);
 makeSky();makeWater();makeClouds();makeDistantScene();boat=makeBoat();boat.position.set(0,.1,3.3);scene.add(boat);wake=makeWake();clock=new THREE.Clock();addEventListener('resize',resize);$('loading').classList.add('hidden');$('start').classList.remove('hidden');animate();}catch(e){console.error(e);$('loadingText').textContent='3D renderer unavailable. Try the latest Chrome or enable WebGL.'}}
function resize(){if(!renderer)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
function start(){
 elapsed=distance=score=taskCount=quizCount=correctCount=collected=0;update.spawn=0;update.enemySpawn=1.4;hull=100;transponder=false;kills=0;intelPause=false;helmAngle=0;helmDragging=false;helmPointer=null;missionOrder=0;lastOrderAt=0;spawnedEnemies=0;lastQuizAt=-99;
 lane=laneTarget=0;slideTimer=fireCooldown=invulnerable=0;
 obstacles.forEach(o=>scene.remove(o));collectibles.forEach(o=>scene.remove(o));projectiles.forEach(o=>scene.remove(o));effects.forEach(o=>scene.remove(o));
 obstacles=[];collectibles=[];projectiles=[];effects=[];
 running=true;paused=false;started=true;boat.position.set(0,.1,3.3);boat.rotation.set(0,0,0);
 $('start').classList.add('hidden');$('end').classList.add('hidden');$('intel').classList.add('hidden');
 $('hud').classList.remove('hidden');$('bottom').classList.remove('hidden');$('mission').classList.remove('hidden');$('status').classList.remove('hidden');
 $('toast').classList.remove('on');$('transponder').classList.remove('active');$('xpdrstate').textContent='OFF';$('helmknob').style.transform='rotate(0deg)';$('helm').style.setProperty('--wheel-rotation','0deg');$('helmread').textContent='000°';
 $('missiontext').textContent='Neutralise 5 hostile contacts';$('missionstate').textContent='0 / 5';$('missiontag').textContent='PRIMARY OBJECTIVE';
 $('statusText').textContent='RADAR ONLINE · GUN SYSTEM READY';updateHud();clock.getDelta();
}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('on'),1450)}
function updateHud(){
 $('score').textContent=String(score).padStart(5,'0');$('dist').textContent=distance.toFixed(1);
 $('hullfill').style.width=hull+'%';$('hulltext').textContent=Math.max(0,Math.round(hull))+'%';
 $('hullfill').style.background=hull<35?'linear-gradient(90deg,#ff4c55,#ffb26c)':'linear-gradient(90deg,#42efc4,#a8f48d)';
 $('missionstate').textContent=kills+' / 5';$('helm').setAttribute('aria-valuenow',String(Math.round(helmAngle*100)));
}
function move(d){if(!running)return;helmAngle=clamp(helmAngle+d*.35,-1,1);$('helmknob').style.transform='rotate('+(helmAngle*135)+'deg)'}
function fire(){if(!running||fireCooldown>0||intelPause)return;fireCooldown=.42;makeProjectile();burst(boat.position,'#ffad60',3);toast('PULSE CANNON · SHOT AWAY')}
function slide(){if(!running)return;slideTimer=1.05;toast('LOW PROFILE')}
function setTransponder(){if(!running)return;transponder=!transponder;$('transponder').classList.toggle('active',transponder);$('xpdrstate').textContent=transponder?'ON':'OFF';if(transponder){score+=100;$('statusText').textContent='AIS / TRANSPONDER ACTIVE';toast('TRANSPONDER ACTIVE +100');$('missiontext').textContent=kills>=5?'Reach the patrol marker':'Neutralise hostile contacts';}else{$('statusText').textContent='TRANSPONDER OFFLINE';toast('TRANSPONDER OFFLINE');}updateHud()}
function showIntel(title,body,reward,badge='HOSTILE NEUTRALISED'){
 intelPause=true;running=false;$('inteltitle').textContent=title;$('intelbody').textContent=body;$('intelreward').textContent=reward;$('intelbadge').textContent=badge;$('intel').classList.remove('hidden');
}
function closeIntel(){$('intel').classList.add('hidden');intelPause=false;if(hull<=0){finish(false);return}if(distance>=10){finish(true);return}running=true;toast('BRIDGE · RESUME PATROL')}
function orderTransponder(){missionOrder=1;lastOrderAt=elapsed;$('missiontag').textContent='BRIDGE ORDER';$('missiontext').textContent='Activate your transponder';$('missionstate').textContent=transponder?'ACK':'REQUIRED';toast('BRIDGE: ACTIVATE TRANSPONDER');$('statusText').textContent='BRIDGE REQUEST · TRANSPONDER';}
function finish(success=hull>0&&distance>=10){running=false;started=false;intelPause=false;$('hud').classList.add('hidden');$('bottom').classList.add('hidden');$('mission').classList.add('hidden');$('status').classList.add('hidden');$('intel').classList.add('hidden');$('end').classList.remove('hidden');
 $('endtitle').textContent=success?'PATROL COMPLETE':hull<=0?'VESSEL DISABLED':'PATROL ENDED';$('finalscore').textContent=String(score).padStart(5,'0');
 $('endtext').textContent=success?'Hostile contacts neutralised. Your patrol craft has reached the rendezvous.':hull<=0?'Hull integrity reached zero. Review your steering and contact engagement.':'The patrol ended before reaching the rendezvous.';
 $('endstats').innerHTML='<span class="stat-chip">CONTACTS '+kills+'/5</span><span class="stat-chip">HULL '+Math.max(0,Math.round(hull))+'%</span><span class="stat-chip">TRANSPONDER '+(transponder?'ON':'OFF')+'</span>';
}
function hitTest(){
 const bx=boat.position.x;
 for(const o of obstacles){
  if(o.userData.hit)continue;
  if(Math.abs(o.position.z-boat.position.z)<1.9&&Math.abs(o.position.x-bx)<1.45){
   if(o.userData.kind==='target'){
    if(invulnerable<=0){o.userData.hit=true;hull=Math.max(0,hull-24);invulnerable=1.5;score=Math.max(0,score-80);burst(boat.position,'#ff665b',32);toast('HOSTILE CONTACT · HULL −24%');updateHud();if(hull<=0){finish(false);return}}
   }else if(invulnerable<=0){
    o.userData.hit=true;hull=Math.max(0,hull-13);invulnerable=1.1;score=Math.max(0,score-35);burst(boat.position,'#ff805f',24);toast('HAZARD COLLISION · HULL −13%');boat.position.x+=Math.sign(bx-o.position.x||1)*.45;updateHud();if(hull<=0){finish(false);return}
   }
  }
 }
 for(const c of collectibles){
  if(c.userData.hit)continue;
  if(Math.abs(c.position.z-boat.position.z)<1.8&&Math.abs(c.position.x-bx)<1.4){
   c.userData.hit=true;scene.remove(c);collected++;hull=Math.min(100,hull+9);score+=60;burst(c.position,'#5cfff0',24);updateHud();toast('SUPPLY CACHE · +60 · HULL RESTORED');
  }
 }
}
function update(dt,t){
 if(!running||intelPause)return;
 elapsed+=dt;distance=Math.min(10,elapsed/6);fireCooldown=Math.max(0,fireCooldown-dt);slideTimer=Math.max(0,slideTimer-dt);invulnerable=Math.max(0,invulnerable-dt);
 const speed=15.5+Math.min(10,distance)*.65;
 water.material.uniforms.uTime.value=t;water.material.uniforms.uStorm.value=clamp((distance-6.2)/3.8,0,1);
 // Wheel steering is continuous, with inertia and a gentle recentering when released.
 const targetX=helmDragging?helmAngle*6.2:helmAngle*6.2;
 boat.position.x=THREE.MathUtils.damp(boat.position.x,targetX,3.9,dt);
 boat.position.x=clamp(boat.position.x,-6.3,6.3);
 boat.rotation.z=THREE.MathUtils.damp(boat.rotation.z,-(targetX-boat.position.x)*.075,3.8,dt);
 boat.position.y=.08+Math.sin(t*3.1)*.07+Math.sin(t*5.3)*.035;
 boat.rotation.x=THREE.MathUtils.damp(boat.rotation.x,Math.sin(t*1.4)*.025,2,dt);
 boat.rotation.y=THREE.MathUtils.damp(boat.rotation.y,clamp((targetX-boat.position.x)*.09,-.18,.18),3,dt);
 if(boat.userData.radar)boat.userData.radar.rotation.y=t*2.2;
 wake.position.x=boat.position.x;wake.position.z=boat.position.z;
 wake.children.forEach((m,i)=>{m.material.opacity=.18+Math.sin(t*5+i)*.06;m.scale.x=1+Math.sin(t*4+i)*.3});
 camera.position.x=THREE.MathUtils.damp(camera.position.x,boat.position.x*.31,1.8,dt);
 camera.position.y=6.3+Math.sin(t*1.7)*.08;camera.lookAt(boat.position.x*.22,1,-13);
 clouds.forEach((cl,i)=>{cl.position.x+=dt*(.7+i%3*.2);if(cl.position.x>100)cl.position.x=-100});
 // Spawn hazards with safe gaps. Hostile craft are separate contacts, not quiz prompts.
 if(!update.spawn)update.spawn=0;update.spawn+=dt;
 if(update.spawn>Math.max(.95,1.55-distance*.035)){
  update.spawn=0;const l=Math.floor(Math.random()*3),z=-105;const roll=Math.random();
  createObstacle(roll<.45?'container':roll<.78?'buoy':'timber',l,z);
  if(Math.random()<.28){const cache=createBook(Math.floor(Math.random()*3),z-rnd(18,30));if(cache)cache.position.x=rnd(-5.2,5.2)}
 }
 if(!update.enemySpawn)update.enemySpawn=2.6;update.enemySpawn+=dt;
 if(update.enemySpawn>Math.max(2.5,4.4-distance*.08)&&kills<7){
  update.enemySpawn=0;const enemy=createTarget(Math.floor(Math.random()*3),-112-rnd(0,18));enemy.position.x=rnd(-5.3,5.3);enemy.userData.speed=rnd(.83,1.05);
  toast('RADAR · HOSTILE CONTACT');$('statusText').textContent='RADAR CONTACT · ID '+enemy.userData.contactId;
 }
 obstacles.forEach(o=>{
  o.position.z+=speed*dt*(o.userData.kind==='target'?(o.userData.speed||.95):1);
  if(o.userData.kind==='target'){o.rotation.y+=Math.sin(t*1.1)*dt*.1;if(o.userData.ring)o.userData.ring.rotation.z+=dt*.7}
  else if(o.userData.kind==='buoy')o.rotation.y+=dt*.25;
 });
 collectibles.forEach(c=>{c.position.z+=speed*dt;c.rotation.y+=dt*1.8;c.position.y=.65+Math.sin(t*3+c.position.z)*.14;if(c.children[0])c.children[0].rotation.z+=dt*.5});
 // Projectile hits are resolved against the actual contact position; aim by steering the boat into alignment.
 projectiles.forEach(p=>{
  p.position.z-=dt*68;p.position.y+=dt*.35;
  for(const o of obstacles){
   if(o.userData.kind==='target'&&!o.userData.hit&&Math.abs(o.position.z-p.position.z)<3.4&&Math.abs(o.position.x-p.position.x)<1.15){
    o.userData.hit=true;scene.remove(o);burst(o.position,'#ffcf6e',34);burst(o.position,'#ff6c45',18);score+=250;kills++;taskCount=kills;updateHud();p.userData.dead=true;
    const name=o.userData.contactName||'UNKNOWN CONTACT',id=o.userData.contactId||'----';
    const facts=[
     'AIS is a cooperative broadcast system that shares identity and navigational data. It improves awareness but does not replace radar, visual lookout, or safe navigation.',
     'A vessel’s radar return can support contact tracking in poor visibility. Identification should be cross-checked with available sensors and reports.',
     'A nautical mile is 1,852 metres. Knots express speed in nautical miles per hour.',
     'COLREGs establish international collision-prevention rules at sea. A real bridge team must assess risk and apply the rules to the actual situation.',
     'A transponder can help other stations identify and track a vessel. Keep equipment use consistent with operational orders and applicable procedures.'
    ];
    showIntel(name+' · CONTACT '+id,facts[(kills-1)%facts.length],'+250 SCORE','CONTACT NEUTRALISED');
    $('missiontag').textContent='PRIMARY OBJECTIVE';$('missiontext').textContent=kills>=5?'Proceed to rendezvous marker':'Neutralise '+(5-kills)+' more hostile contact'+(5-kills===1?'':'s');
    break;
   }
  }
 });
 projectiles=projectiles.filter(p=>{if(p.userData.dead||p.position.z<-130){scene.remove(p);return false}return true});
 effects.forEach(p=>{p.userData.life-=dt;p.position.addScaledVector(p.userData.vel,dt);p.userData.vel.y-=dt*2.6;p.material.opacity=clamp(p.userData.life/p.userData.max,0,1)});
 effects=effects.filter(p=>{if(p.userData.life<=0){scene.remove(p);p.geometry.dispose();p.material.dispose();return false}return true});
 obstacles=obstacles.filter(o=>{if(o.position.z>13||o.userData.hit){scene.remove(o);return false}return true});
 collectibles=collectibles.filter(o=>{if(o.position.z>13||o.userData.hit){scene.remove(o);return false}return true});
 hitTest();if(!running)return;
 // A timed bridge order teaches a control through action, not a quiz.
 if(elapsed>7&&missionOrder===0)orderTransponder();
 if(missionOrder===1&&transponder){missionOrder=2;$('missiontag').textContent='PRIMARY OBJECTIVE';$('missiontext').textContent='Neutralise 5 hostile contacts';$('missionstate').textContent=kills+' / 5';score+=100;toast('ORDER ACKNOWLEDGED · +100');$('statusText').textContent='TRANSPONDER ACTIVE · RADAR ONLINE';updateHud()}
 if(missionOrder===1&&!transponder&&elapsed-lastOrderAt>12){lastOrderAt=elapsed;toast('BRIDGE: TRANSPONDER REQUIRED')}
 if(distance>=10){finish(kills>=5&&hull>0);return}
 updateHud();
}
function animate(){raf=requestAnimationFrame(animate);if(!renderer)return;const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;if(water){water.position.z= -120 + (t*4%4);water.material.uniforms.uTime.value=t;clouds.forEach((c,i)=>{c.material.opacity=(.18+Math.sin(t*.2+i)*.08)})}if(running)update(dt,t);renderer.render(scene,camera)}
function bindControls(){
 const world=$('world'),helm=$('helm');world.style.touchAction='none';helm.style.touchAction='none';
 let sx=0,sy=0,pid=null,baseAngle=0,lastAngle=0;
 const pointerAngle=e=>{const r=helm.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))};
 helm.addEventListener('pointerdown',e=>{if(!running)return;helmDragging=true;helmPointer=e.pointerId;pid=e.pointerId;baseAngle=helmAngle;lastAngle=pointerAngle(e);try{helm.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
 helm.addEventListener('pointermove',e=>{if(!helmDragging||pid!==e.pointerId)return;let now=pointerAngle(e),delta=now-lastAngle;if(delta>Math.PI)delta-=Math.PI*2;if(delta< -Math.PI)delta+=Math.PI*2;helmAngle=clamp(helmAngle+delta/Math.PI,-1,1);lastAngle=now;$('helmknob').style.transform='rotate('+(helmAngle*135)+'deg)';$('helm').style.setProperty('--wheel-rotation',(helmAngle*135)+'deg');$('helmread').textContent=String(Math.round(helmAngle*135)).padStart(3,'0')+'°';helm.setAttribute('aria-valuenow',String(Math.round(helmAngle*100)));e.preventDefault()});
 const endHelm=e=>{if(pid!==e.pointerId)return;helmDragging=false;helmPointer=null;pid=null};
 helm.addEventListener('pointerup',endHelm);helm.addEventListener('pointercancel',endHelm);helm.addEventListener('lostpointercapture',()=>{helmDragging=false;helmPointer=null;pid=null});
 world.addEventListener('pointerdown',e=>{if(!running||e.target!==world)return;sx=e.clientX;sy=e.clientY;pid='world-'+e.pointerId;try{world.setPointerCapture(e.pointerId)}catch(_){}});
 world.addEventListener('pointerup',e=>{if(!running||pid!=='world-'+e.pointerId)return;const dx=e.clientX-sx,dy=e.clientY-sy;pid=null;const threshold=Math.max(22,Math.min(42,innerWidth*.05));if(Math.abs(dx)>threshold){helmAngle=clamp(helmAngle+(dx>0?.32:-.32),-1,1);$('helmknob').style.transform='rotate('+(helmAngle*135)+'deg)';$('helmread').textContent=String(Math.round(helmAngle*135)).padStart(3,'0')+'°'}else if(dy>threshold){/* down gesture is reserved for moving the camera in a later build */}else if(dy< -threshold){fire()}});
 $('fire').addEventListener('pointerdown',e=>{e.preventDefault();fire()});$('transponder').onclick=setTransponder;$('startbtn').onclick=start;$('restart').onclick=start;$('intelclose').onclick=closeIntel;
 $('share').onclick=()=>{const text='I scored '+score+' in Ocean Run 🌊⚓ Can you take command and beat my score?';if(navigator.share)navigator.share({title:'Ocean Run',text,url:location.href}).catch(()=>{});else location.href='https://wa.me/?text='+encodeURIComponent(text+' '+location.href)};
 addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a'){helmAngle=clamp(helmAngle-.18,-1,1);$('helmknob').style.transform='rotate('+(helmAngle*135)+'deg)';$('helm').style.setProperty('--wheel-rotation',(helmAngle*135)+'deg')}if(e.key==='ArrowRight'||e.key==='d'){helmAngle=clamp(helmAngle+.18,-1,1);$('helmknob').style.transform='rotate('+(helmAngle*135)+'deg)';$('helm').style.setProperty('--wheel-rotation',(helmAngle*135)+'deg')}if(e.key===' '||e.key==='Enter')fire();if(e.key==='t')setTransponder()});
}
setup();
