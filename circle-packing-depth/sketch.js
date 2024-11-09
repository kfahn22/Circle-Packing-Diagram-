// https://d3js.org/d3-hierarchy/pack

let data;
let root;
let popup = null;
let graphics = [];
let p;

function preload() {
  data = loadJSON("showcases.json");
}

function setup() {
  createCanvas(1280, 1280);
  p = createP(`Circle Packing of Coding Train Challenge Showcases`).addClass(
    "title"
  );

  // Initialize D3 Hierarchy and pack
  root = d3.pack(data).size([width, height]).padding(1)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  drawPack();
}

function assignColor(node, color1, color2) {
  let depth = node.depth;
  let amt = depth / 3;
  return lerpColor(color1, color2, amt);
}

function draw() {
  background(0);
  for (let g of graphics) {
    image(g.buffer, g.x, g.y, g.w, g.h);
  }
  let s = 18;
  if (popup && popup.x < width * 0.66) {
    fill(255, 255, 255, 200);
    noStroke();
    rect(popup.x, popup.y, popup.w, popup.h, 5);
    fill(0);
    noStroke();
    textSize(s);
    textAlign(LEFT, TOP);
    text(popup.text, popup.x + 10, popup.y + 10, popup.w);
    if (popup.text1) {
      text(popup.text1, popup.x + 10, popup.y + 3 * s + 10, popup.w);
    }
  } else {
    if (popup && popup.x > width * 0.66) {
      fill(255, 255, 255, 200);
      noStroke();
      rect(popup.x - 200, popup.y, popup.w, popup.h, 5);
      fill(0);
      noStroke();
      textSize(s);
      textAlign(LEFT, TOP);
      text(popup.text, popup.x - 180, popup.y, popup.w);
      if (popup.text1) {
        text(popup.text1, popup.x - 180, popup.y + 3 * s + 10, popup.w);
      }
    }
  }
}
function drawPack() {
  for (let node of root) {
    // Assign color based on depth of node
    let c0 = color("#70327E");
    let c1 = color("#F89E4F");
    let c = assignColor(node, c0, c1);

    let { x, y, r } = node;
    let w = 2 * r;
    let h = 2 * r;

    let buffer = createGraphics(w, h);
    buffer.fill(c);
    buffer.noStroke();
    buffer.circle(r, r, 2 * r);
    buffer.fill(0);
    buffer.textSize(5);
    buffer.textAlign(LEFT, TOP);

    graphics.push({
      buffer: buffer,
      x: x - r,
      y: y - r,
      w: w,
      h: h,
      node: node,
    });
  }
}

function mouseMoved() {
  let found = false;
  for (let g of graphics) {
    let node = g.node;
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < node.r && node.data.name != "root") {
      if (node.children) {
        inChild = false; // boolean for whether in a child circle
        for (n of node.children) {
          let childD = dist(mouseX, mouseY, n.x, n.y);
          if (childD < n.r) {
            inChild = true;
            popup = {
              x: mouseX,
              y: mouseY,
              w: 350,
              h: 125,
              text: `${n.data.name}\n${n.value} showcases `,
              text1: `${node.data.name} ${node.value} showcases`,
            };
          }
        }

        if (!inChild) {
          popup = {
            x: mouseX,
            y: mouseY,
            w: 300,
            h: 75,
            text: `${node.data.name}\n${node.value} showcases`,
          };
        }
        found = true;
        break;
      }
    }
  }
  if (!found) {
    popup = null;
  }
}
