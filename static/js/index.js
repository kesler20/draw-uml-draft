const dragDiagrams = document.querySelectorAll(".diagram");
const gridDiagram = document.querySelector(".uml");
const btn = document.querySelector(".dragBtn");

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

const addRow = () => {
  let diagramRow1 = document.createElement("input");
  let diagramRow2 = document.createElement("input");
  let diagramRow3 = document.createElement("input");
  
  let arrowBtn = document.createElement("div");
  arrowBtn.classList.add("arrowBtn");
  let arrowBtnIcon = document.createElement("i");
  arrowBtnIcon.classList.add("fas");
  arrowBtnIcon.classList.add("fa-plus");
  arrowBtn.appendChild(arrowBtnIcon);
  
  umlTable = document.querySelector(".grid-table");
  umlTable.appendChild(diagramRow1);
  umlTable.appendChild(diagramRow2);
  umlTable.appendChild(diagramRow3);
  umlTable.appendChild(arrowBtn);
  diagramRow1.focus();
};

const deleteRow = () => {
  umlTable = document.querySelector(".grid-table");
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

dragDiagrams.forEach((inputElement) => {
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addRow();
    } else if (e.keyCode === 8 && e.target.value === "") {
      deleteRow();
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

btn.addEventListener("click", addRow);

// insert pluses as default inputs