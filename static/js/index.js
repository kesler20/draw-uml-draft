const diagram = document.querySelector(".diagram");
const objectName = document.querySelectorAll(".object-name").item(0);
const dataModelCanvas = document.querySelector(".data-model-canvas");
const createTableBtn = document
  .getElementsByClassName("create-table-btn")
  .item(0);
class Line {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  connect = () => {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute(
      "viewBox",
      `${this.from[0]} ${this.from[1]} ${this.to[0]} ${this.to[1]}`
    );
    svg.setAttribute("aria-hidden", "true");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "blue");
    path.setAttribute(
      "d",
      `M ${this.from[0]},${this.from[1]} L ${this.to[0]}, ${this.to[1]}`
    );
    svg.appendChild(path);
    dataModelCanvas.appendChild(svg);
  };
}
class UmlDiagramTable {
  constructor(name) {
    this.name = name;
  }

  createTable = () => {
    const diagram = document.createElement("div");
    diagram.classList.add("diagram");

    const uml = document.createElement("div");
    uml.classList.add("uml");

    const gridTable = document.createElement("div");
    gridTable.classList.add("grid-table");

    const objectName = document.createElement("input");
    objectName.classList.add("object-name");
    objectName.type = "text";
    objectName.style.borderTop = `25px solid ${getRandomColor()}`;
    objectName.placeholder = "Object Name";

    uml.appendChild(objectName);
    uml.appendChild(gridTable);
    diagram.appendChild(uml);
    dataModelCanvas.appendChild(diagram);

    enableDrag();
    enableNavigation();
    trackElement(diagram);
  };
}

const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

const getRandomColor = () => {
  const r = getRandomNumber(200);
  const g = getRandomNumber(200);
  const b = getRandomNumber(200);

  return `rgb(${r}, ${g}, ${b})`;
};

const enableDrag = () => {
  const dragDiagrams = document.querySelectorAll(".diagram");
  dragDiagrams.forEach((diagram) => {
    const drag = (e) => {
      diagram.style.top = e.pageY + "px";
      diagram.style.left = e.pageX + "px";
    };

    /*function drag(e) {
      
    }*/

    diagram.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", drag);
    });

    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", drag);
    });
  });
};

const addRow = (e) => {
  let diagramRow1 = document.createElement("input");
  let diagramRow2 = document.createElement("input");
  let diagramRow3 = document.createElement("input");
  diagramRow1.value = "+";

  let arrowBtn = document.createElement("div");
  arrowBtn.classList.add("arrowBtn");
  let arrowBtnIcon = document.createElement("i");
  arrowBtnIcon.classList.add("fas");
  arrowBtnIcon.classList.add("fa-plus");
  arrowBtn.appendChild(arrowBtnIcon);

  umlTable =
    e.target.parentNode.classList.value === "grid-table"
      ? e.target.parentNode
      : e.target.parentNode.children.item(1);

  umlTable.appendChild(diagramRow1);
  umlTable.appendChild(diagramRow2);
  umlTable.appendChild(diagramRow3);
  umlTable.appendChild(arrowBtn);
  diagramRow2.focus();

  // arrowBtn.addEventListener("click", (e) => {
  //   let diagramToTrack =
  //   e.target.parentNode.parentNode.parentNode.classList.value === "diagram"
  //   ? e.target.parentNode.parentNode.parentNode
  //   : e.target.parentNode.parentNode.parentNode.parentNode;
  //   trackElement(diagramToTrack);
  // });
};

const deleteRow = (e) => {
  umlTable =
    e.target.parentNode.classList.value === "grid-table"
      ? e.target.parentNode
      : e.target.parentNode.children.item(1);
  umlTable.removeChild(umlTable.children.item(umlTable.children.length - 1));
  umlTable.removeChild(umlTable.children.item(umlTable.children.length - 1));
  umlTable.removeChild(umlTable.children.item(umlTable.children.length - 1));
  umlTable.removeChild(umlTable.children.item(umlTable.children.length - 1));
  try {
    umlTable.children.item(umlTable.children.length - 4).focus();
  } catch (e) {
    umlTable.children.item(umlTable.children.length - 1).focus();
  }
};

const findIndex = (collection, item) => {
  let i = 0;
  for (let j of collection) {
    if (j === item) return i;
    i++;
  }
};

const enableNavigation = () => {
  const dragDiagrams = document.querySelectorAll(".diagram");
  dragDiagrams.forEach((inputElement) => {
    inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addRow(e);
      } else if (e.keyCode === 8 && e.target.value === "") {
        deleteRow(e);
      } else if (e.key === "ArrowRight") {
        try {
          let nextRow = e.target.parentNode.children.item(
            findIndex(e.target.parentNode.children, e.target) + 1
          );
          nextRow.focus();
        } catch (e) {
          console.log(e);
        }
      } else if (e.key === "ArrowLeft") {
        try {
          let nextRow = e.target.parentNode.children.item(
            findIndex(e.target.parentNode.children, e.target) - 1
          );
          nextRow.focus();
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(e.key);
      }
    });
  });
};

// only the diagram needs to be tracked as is the only element which can be moved
const trackElement = (diagram) => {
  const getPosition = () => {
    return [parseInt(diagram.style.left), parseInt(diagram.style.top)];
  };

  // draw a line from the element being tracked to the screen
  const trackMouse = () => {
    let line = new Line(
      [getPosition()[0], getPosition()[1]],
      [getPosition()[0] + 20, getPosition()[1] + 20]
    );
    line.connect();
  };

  diagram.addEventListener("mousedown", () => {
    window.addEventListener("mousemove", trackMouse);
  });

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", trackMouse);
  });
};

// yDistance is the difference in top position between the two elements
const generateBelzierCurve = (x1, y1, xDistance, yDistance) => {
  let c = 5;
  let d = yDistance - 2 * c;
  let x2 = x1 + d + c;
  let p = xDistance - x2 - 2 * c;
  return `M ${x1},${y1} L ${x2}, ${y1} Q ${x2 + c}, ${y1}  ${x2 + c}, ${
    y1 + c
  } L ${x2 + c}, ${y1 + c + d} Q ${x2 + c}, ${y1 + 2 * c + d}  ${x2 + 2 * c}, ${
    y1 + 2 * c + d
  } L ${x2 + 2 * c + p}, ${y1 + 2 * c + d}`;
};

const createLine = () => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "octicon octicon-star");
  svg.setAttribute("viewBox", "0 0 800 800");
  svg.setAttribute("aria-hidden", "true");

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "blue");
  path.setAttribute(
    "d",
    generateBelzierCurve(
      getPosition()[0],
      getPosition()[1],
      getPosition()[0] + 100,
      getPosition()[1] + 200
    )
  );

  svg.appendChild(path);
  dataModelCanvas.appendChild(svg);
};

objectName.style.borderTop = `25px solid ${getRandomColor()}`;

enableDrag();
enableNavigation();
// insert pluses as default inputs
createTableBtn.addEventListener("click", () => {
  table = new UmlDiagramTable("this");
  table.createTable();
});

