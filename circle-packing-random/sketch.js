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
    // Choose a color and store it in node.data.color
    node.data.color = random(palette);
  }
  if (node.children) {
    for (let child of node.children) {
      // Recursively assign colors to each child
      assignColors(child);
    }
  }
}

function draw() {
  background(255);
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
    text(popup.text1, popup.x + 10, popup.y + 3 * s + 10, popup.w);
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
      text(popup.text1, popup.x - 180, popup.y + 3 * s + 10, popup.w);
    }
  }
}
function drawPack() {
  for (let node of root) {
    //console.log(node)
    let { x, y, r } = node;
    let w = 2 * r;
    let h = 2 * r;

    // Attempt to make sure node and parent don't have same color
    if (node.parent) {
      if (node.data.color == node.parent.data.color) {
        node.data.color = [252, 238, 33];
      }
    }

    let buffer = createGraphics(w, h);
    buffer.fill(node.data.color);
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
          w: 350,
          h: 125,
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

// function renderText(r, txt) {
//   let sentenceArray = txt.split("");
//   for (let i = 0; i < sentenceArray.length; i++) {
//     noStroke();
//     fill(255);
//     textSize(18);
//     let angle = map(i, 0, sentenceArray.length, 0, TWO_PI);
//     push();
//     let x = r * cos(angle);
//     let y = r * sin(angle);
//     translate(x, y);
//     rotate(angle + PI / 2);
//     text(sentenceArray[i], 0, 0);
//     pop();
//   }
// }
