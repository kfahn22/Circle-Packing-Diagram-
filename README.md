# Circle Packing Diagram in p5.js using d3.js


# Circle Pack Diagram Of Coding Train Challenges Showcases 

When Daniel Shiffman did an Apollonian Gasket Coding Challenge last year, I created variations of his code. In addition to nice ??, you can also use the circle-packing algorithm is the visualize data.  I have already created a [treemap](https://github.com/kfahn22/Treemap-of-Coding-Train-Challenges) of Coding Challenge showcases.

I am utilizing the d3.js library to create the circle-packing diagram You will need to add the d3.js library in the index.html file.

```html
 <script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
```

### Preload the json file into your p5 sketch

```JavaScript
function preload() {
  data = loadJSON("showcases.json");
}
```

### Initialize the d3 hierarchy and call pack()

```JavaScript
// Initialize D3 Hierarchy and Pack
  root = d3.pack(data).size([width, height]).padding(1)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );
```

The d3.js [examples](https://observablehq.com/@d3/pack-component) use a svg container, which is not something that is natively supported in p5.js. I used a couple of 


## References

[d3-pack](https://d3js.org/d3-hierarchy/pack)

[Treemap-of-Coding-Train-Challenges](https://github.com/kfahn22/Treemap-of-Coding-Train-Challenges)