"use client";

import { useEffect, useRef } from "react";
import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// All visible objects are meshes. No reference image, image plane or bitmap texture.
export default function DeliverySculptures() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    // Compact and software-rendered browsers get the complete CSS sculpture
    // beneath this layer. Avoid requesting a fragile WebGL context there.
    if (window.matchMedia("(max-width: 899px)").matches) {
      mount.dataset.webglFallback = "true";
      return;
    }
    let renderer: T.WebGLRenderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { mount.dataset.webglFallback = "true"; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .95;
    mount.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.OrthographicCamera(-8, 8, 2.9, -2.9, .1, 80);
    camera.position.set(0, 0, 25);
    const pmrem = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, .04);
    scene.environment = env.texture;
    room.dispose();
    scene.add(new T.HemisphereLight(0xfff9ee, 0x8e7963, .85));
    const key = new T.DirectionalLight(0xfff2dd, 3);
    key.position.set(-5, 9, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -12, right: 12, top: 9, bottom: -9, near: .1, far: 45 });
    key.shadow.bias = -.0005;
    key.shadow.normalBias = .025;
    scene.add(key);
    const rim = new T.DirectionalLight(0xffd29e, 2.8);
    rim.position.set(8, 3, -4); scene.add(rim);
    const root = new T.Group(); scene.add(root);
    const mat = (color: string, metalness = 0, roughness = .4) =>
      new T.MeshStandardMaterial({ color, metalness, roughness });
    const gold = mat("#c89d60", .85, .24), brass = mat("#eac28b", .72, .25);
    const teal = mat("#164c4b", .55, .26), dark = mat("#162a30", .55, .32);
    const paper = mat("#fff7e9", .02, .6), silver = mat("#b7bab6", .88, .24);
    const card = mat("#c99a69", .05, .75), white = mat("#fffbf2", .05, .42);
    const glow = new T.MeshStandardMaterial({ color:"#fff1c6", emissive:"#ffc879", emissiveIntensity: 2.6 });
    const aqua = new T.MeshStandardMaterial({ color:"#a3eae1", emissive:"#61cfc8", emissiveIntensity:.9 });
    const marble = mat("#f1e7d6", .08, .48);
    // Procedural veins in object space, not an image texture.
    marble.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vStone;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvStone = position;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vStone;")
        .replace("#include <color_fragment>", "#include <color_fragment>\nfloat vein = abs(sin(vStone.x*13.0 + vStone.y*5.0 + sin(vStone.z*9.0 + vStone.x*3.0)*2.2));\nfloat line = pow(1.0-vein, 22.0);\ndiffuseColor.rgb *= 1.0 - line*0.22;");
    };
    function box(parent: T.Object3D, w:number,h:number,d:number,m:T.Material,x=0,y=0,z=0,r=.06) {
      const mesh = new T.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),m);
      mesh.position.set(x,y,z); mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
    }
    function cyl(parent:T.Object3D,r:number,h:number,m:T.Material,x=0,y=0,z=0) {
      const mesh=new T.Mesh(new T.CylinderGeometry(r,r,h,48),m);
      mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
    }
    function tube(parent:T.Object3D,points:number[][],radius:number,m:T.Material) {
      const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number])));
      const mesh=new T.Mesh(new T.TubeGeometry(curve,32,radius,8,false),m);parent.add(mesh);return mesh;
    }
    function group(x:number,y:number,z=0) { const g=new T.Group();g.position.set(x,y,z);root.add(g);return g; }
    function check(parent:T.Object3D,x:number,y:number,z:number,size=.15) {
      tube(parent,[[x-size,y,z],[x-size*.2,y-size*.6,z],[x+size,y+size*.7,z]],.023,brass);
    }
    const clockHands:T.Object3D[]=[];
    const moving:T.Group[]=[];
    // Wall receives real shadows from the raised objects.
    box(root,18,8,.15,paper,0,0,-1.3);
    const arch=new T.Mesh(new T.TorusGeometry(2.45,.11,12,64,Math.PI),brass);
    arch.position.set(9,-.5,-.8);root.add(arch);
    for(const [x,kind] of [[-5.35,"shield"],[-1.25,"clock"],[2.9,"folder"]] as const) {
      const g=group(x,1.82,.1);g.rotation.y=-.16;g.rotation.x=.12;
      box(g,1.45,.28,.75,marble,0,-.63,0,.09);
      if(kind==="shield") {
        const s=new T.Shape();s.moveTo(-.43,.48);s.lineTo(.43,.48);s.quadraticCurveTo(.52,.48,.52,.35);
        s.lineTo(.46,-.13);s.quadraticCurveTo(.3,-.42,0,-.57);s.quadraticCurveTo(-.3,-.42,-.46,-.13);
        s.lineTo(-.52,.35);s.quadraticCurveTo(-.52,.48,-.43,.48);
        const shield=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.19,bevelEnabled:true,bevelSize:.055,bevelThickness:.05,bevelSegments:4,steps:1}),gold);
        shield.castShadow=true;g.add(shield);
        // Rupee form extruded from strokes.
        tube(g,[[-.22,.3,.27],[.25,.3,.27]],.034,brass);
        tube(g,[[-.22,.16,.27],[.25,.16,.27]],.03,brass);
        tube(g,[[-.08,.28,.27],[.11,.14,.27],[.06,-.01,.27],[-.18,-.05,.27],[.21,-.36,.27]],.036,brass);
      } else if(kind==="clock") {
        const face=cyl(g,.56,.22,teal);face.rotation.x=Math.PI/2;
        const dial=cyl(g,.475,.03,paper,0,0,.135);dial.rotation.x=Math.PI/2;
        const ring=new T.Mesh(new T.TorusGeometry(.49,.025,12,64),gold);ring.position.z=.16;g.add(ring);
        for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=box(g,.024,.075,.015,gold,Math.sin(a)*.4,Math.cos(a)*.4,.165);tick.rotation.z=-a;}
        const hands=new T.Group();g.add(hands);
        const hour=box(hands,.034,.24,.035,gold,0,.1,.2);hour.rotation.z=-.65;
        const minute=box(hands,.018,.34,.035,gold,0,.14,.23);minute.rotation.z=.9;clockHands.push(hands);
        const cap=cyl(g,.11,.13,teal,0,.64);cap.rotation.z=.07;
        box(g,.06,.13,.06,gold,0,.54);
      } else {
        box(g,.96,.82,.15,gold,-.07,.02,-.1);
        box(g,.38,.15,.12,brass,-.29,.45,-.1);
        box(g,.96,.82,.19,teal,.06,-.04,.12);
        tube(g,[[-.16,.19,.24],[-.32,.02,.24],[-.16,-.14,.24]],.034,brass);
        tube(g,[[.26,.19,.24],[.42,.02,.24],[.26,-.14,.24]],.034,brass);
        tube(g,[[.08,.21,.24],[.01,-.15,.24]],.035,brass);
      }
    }
    // The metal conveyor sits behind, not across the front of the workstation objects.
    const belt=group(0,-2.1,.05);belt.rotation.x=.26;
    box(belt,14.85,.42,1.42,silver,0,0,0,.2);
    box(belt,14.55,.12,1.28,dark,0,.26,0,.08);
    for(let i=0;i<64;i++){
      const roller=cyl(belt,.087,1.08,i%2?silver:teal,-7.08+i*.225,.34);
      roller.rotation.x=Math.PI/2;
    }
    box(belt,14.7,.055,.05,brass,0,.32,.67,.02);
    box(belt,14.7,.032,.032,glow,0,.33,.71,.01);
    box(belt,14.7,.07,.07,gold,0,-.14,.71,.03);
    const stations=[-5.85,-2,1.85,5.7];
    stations.forEach((x,index)=>{
      const base=group(x,-1.72,.62);base.rotation.x=.2;
      box(base,2.32,.14,1.2,gold,0,0,0,.13);
      box(base,2.23,.055,1.12,white,0,.09,0,.1);
      box(base,2.26,.024,.027,glow,0,.1,.57,.01);
      const g=group(x-.3,-.92,.82);g.rotation.x=.08;g.rotation.y=-.17;
      moving.push(g);
      if(index<2){
        box(g,1.01,1.5,.14,teal,0,0,0,.08);
        box(g,.93,1.42,.075,paper,.015,0,.115,.06);
        if(index===0){box(g,.34,.16,.1,gold,0,.75,.17); const pin=cyl(g,.033,.025,teal,0,.79,.24);pin.rotation.x=Math.PI/2;}
        for(let j=0;j<5;j++){
          box(g,.56,.021,.02,silver,.08,.43-j*.22,.17,.007);
          if(index===1){box(g,.095,.1,.025,teal,-.3,.43-j*.22,.18,.016);check(g,-.3,.43-j*.22,.21,.027);}
          else cyl(g,.021,.1,silver,-.3,.43-j*.22,.17).rotation.x=Math.PI/2;
        }
        if(index===0){
          const badge=cyl(g,.25,.09,teal,.47,-.56,.3);badge.rotation.x=Math.PI/2;
          const head=new T.Mesh(new T.SphereGeometry(.064,16,12),paper);head.position.set(.47,-.49,.37);g.add(head);
          const body=cyl(g,.11,.085,paper,.47,-.62,.36);body.rotation.x=Math.PI/2;
        } else {
          const pen=new T.Group();pen.position.set(.68,-.06,.28);pen.rotation.z=-.38;g.add(pen);
          cyl(pen,.051,1.23,dark);cyl(pen,.055,.12,gold,0,.34);cyl(pen,.053,.06,gold,0,-.39);
          const tip=new T.Mesh(new T.ConeGeometry(.048,.22,20),gold);tip.rotation.z=Math.PI;tip.position.y=-.71;pen.add(tip);
          box(pen,.015,.34,.024,brass,.055,.32,.045,.006);
        }
      } else if(index===2){
        g.position.y=-1.13;
        box(g,1.65,1.05,.1,silver,0,.28,0,.055);
        box(g,1.52,.91,.024,dark,0,.28,.066,.02);
        box(g,.27,.86,.015,teal,-.6,.28,.083,.005);
        for(let row=0;row<20;row++){
          const y=.68-row*.042;
          box(g,.025,.012,.008,silver,-.41,y,.085,.002);
          for(let col=0;col<3;col++)box(g,.12+((row*7+col*3)%5)*.038,.013,.008,[aqua,gold,paper][(row+col)%3],-.27+col*.35,y,.085,.002);
        }
        const keyboard=box(g,1.76,.09,.85,silver,0,-.3,.41,.06);keyboard.rotation.x=.13;
        for(let row=0;row<5;row++)for(let col=0;col<13;col++)box(g,.091,.014,.072,dark,-.68+col*.11,-.24,.17+row*.095,.01);
        box(g,.43,.016,.22,mat("#999d96",.6),0,-.23,.68,.02);
      } else {
        g.position.y=-1.19;
        box(g,1.5,.94,1.0,card,0,0,0,.025);
        box(g,1.36,.024,.84,dark,0,.48,0,.01);
        const front=box(g,1.5,.42,.025,card,0,.63,.51,.01);front.rotation.x=-.68;
        const back=box(g,1.5,.44,.025,card,0,.67,-.49,.01);back.rotation.x=.7;
        const side=box(g,.46,.035,.9,card,-.89,.56,0,.01);side.rotation.z=-.5;
        const side2=box(g,.46,.035,.9,card,.87,.59,0,.01);side2.rotation.z=.55;
        [teal,gold,mat("#7097c6",.4),dark,aqua].forEach((m,j)=>{
          const tile=box(g,.39,.43,.13,m,-.62+j*.3,.96+(j%2)*.15,.05+(j%2)*.24,.05);
          tile.rotation.z=(j-2)*-.14;check(tile,0,0,.09,.09);
        });
      }
      // Curving glass conduit and glowing connector at each stage.
      if(index<3)tube(root,[[x+.4,-1.38,.2],[x+1.55,-1.32,.2],[x+1.9,-1.05,.2],[x+2.5,-1.02,.2]],.034,silver);
      const connector=new T.Mesh(new T.SphereGeometry(.11,20,12),glow);connector.position.set(x+1.1,-1.26,.46);root.add(connector);
    });
    // Architectural side foliage, modelled leaf by leaf.
    [-8.05,8.3].forEach((x,side)=>{
      const plant=group(x,-1.4,-.3);
      cyl(plant,.27,.57,white,0,-.5);
      for(let j=0;j<8;j++){
        const a=j*2.4;const y=j*.24;
        tube(plant,[[0,-.2,0],[Math.sin(a)*.24,y,0],[Math.sin(a)*.5,y+.3,.07]],.018,teal);
        const leaf=new T.Mesh(new T.SphereGeometry(1,14,10),mat(j%2?"#657348":"#344e35",0,.7));
        leaf.scale.set(.19,.42,.035);leaf.position.set(Math.sin(a)*.46,y+.2,.08);leaf.rotation.z=Math.sin(a)*.8;plant.add(leaf);
      }
      plant.rotation.z=side?-.14:.14;
    });
    let visible=true, frame=0, previous=0;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize=new ResizeObserver(()=>{renderer.setSize(mount.clientWidth,mount.clientHeight,false);});
    resize.observe(mount);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{rootMargin:"100px"});
    observer.observe(mount);
    const render=(now:number)=>{
      frame=requestAnimationFrame(render);
      if(!visible || document.hidden || now-previous<32)return;
      previous=now;
      const t=now*.001;
      if(!reduced.matches){
        moving.forEach((g,i)=>{g.rotation.y=-.17+Math.sin(t*.5+i)*.035;});
        clockHands.forEach(g=>g.rotation.z=-t*.035);
      }
      renderer.render(scene,camera);
    };
    frame=requestAnimationFrame(render);
    return ()=>{
      cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();
      scene.traverse(obj=>{if(obj instanceof T.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});
      env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[]);
  return <div ref={host} className="atelier-sculptures" aria-hidden="true" />;
}
