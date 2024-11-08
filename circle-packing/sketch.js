// https://d3js.org/d3-hierarchy/pack

let data;
let root;
let popup = null;
let popup2 = null;
let popup3 = null;
let graphics = [];
let p;
let palette = [
  [11, 106, 136], // teal
  [45, 197, 244], // aqua
  [112, 50, 126], // dk purple
  [146, 83, 161], // purple
  [164, 41, 99], // red-purple
  [236, 1, 90], // raspberry
  [240, 99, 164], // pink
  [241, 97, 100], // pink-orange
  [248, 158, 79], // orange
  [102, 211, 52], // green
  // [252, 238, 33], // yellow
  [112, 22, 22], // maroon
];

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

  // Assign a color from the palette to each node in the hierarchy
  assignColors(root);
  drawPack();
}

function assignColors(node) {
  if (!node.data.color) {
    node.data.color = random(palette); // Choose a color and store it in node.data.color
  }
  if (node.children) {
    for (let child of node.children) {
      assignColors(child); // Recursively assign colors to each child
    }
  }
}

function draw() {
  background(255);
  for (let g of graphics) {
    image(g.buffer, g.x, g.y, g.w, g.h);
  }
  let s = 18;
  if (popup && popup.x < width * 0.75) {
    fill(255, 255, 255, 200);
    noStroke();
    rect(popup.x, popup.y, popup.w, popup.h, 20);
    fill(0);
    noStroke();
    textSize(s);
    textAlign(LEFT, TOP);
    text(popup.text, popup.x + 10, popup.y + 10, popup.w);
    text(popup.text1, popup.x + 10, popup.y + 3 * s + 10, popup.w);
  } else {
    if (popup && popup.x > width * 0.75) {
      fill(255, 255, 255, 200);
      noStroke();
      rect(popup.x - 200, popup.y, popup.w, popup.h, 20);
      fill(0);
      noStroke();
      textSize(s);
      textAlign(LEFT, TOP);
      text(popup.text, popup.x - 180, popup.y, popup.w);
      text(popup.text1, popup.x - 180, popup.y + 3 * s + 10, popup.w);
    }
  }
}
function drawPack() {
  // Clear the graphics array to avoid layering
  graphics = [];

  for (let node of root) {
    let col = node.data.color;
    let { x, y, r } = node;
    let w = 2 * r;
    let h = 2 * r;

    // Make sure node and parent don't have same color
    if (node.parent) {
      if (col == node.parent.data.color) {
        col = [252, 238, 33];
      }
    }

    let buffer = createGraphics(w, h);
    buffer.fill(col);
    buffer.noStroke();
    buffer.circle(r, r, 2 * r);
    buffer.fill(255);
    buffer.textSize(18);
    buffer.textAlign(LEFT, TOP);
    if (r > 100) {
      buffer.text(node.data.name, w, y);
    }

    graphics.push({
      buffer: buffer,
      x: x - r,
      y: y - r,
      w: w,
      h: h,
      r: r,
      cX: x,
      cY: y,
      name: node.data.name,
      value: node.value,
      parent: node.parent,
      children: node.children,
    });
  }
}

function mouseMoved() {
  let found = false;
  for (let g of graphics) {
    let d = dist(mouseX, mouseY, g.cX, g.cY);
    if (d < g.r && g.name != "root" && g.children == null) {
      let parent = g.parent.data.name;
      if (parent) {
        popup = {
          x: mouseX,
          y: mouseY,
          w: 300,
          h: 120,
          text: `${g.name}\n${g.value} showcases `,
          text1: `${parent} ${g.parent.value} showcases`,
        };
      } else {
        popup = {
          x: mouseX,
          y: mouseY,
          w: 300,
          h: 75,
          text: `${g.name}\n${g.value} showcases `,
        };
      }
      found = true;
      break;
    }
  }
  if (!found) {
    popup = null;
  }
}
