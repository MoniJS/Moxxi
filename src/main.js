import { createScene } from "/bootstrapBabylon.js";

let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);

let scene = createScene();

engine.runRenderLoop(() => {
  scene.render(canvas, engine);
});

window.addEventListener("resize", () => {
  engine.resize();
});