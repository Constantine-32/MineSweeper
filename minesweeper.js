function createGrid(rows, cols) {
  var container = document.getElementById("container")
  var height = rows * 16
  var width = cols * 16
  container.style.width = width+"px"
  container.style.height = height+"px"

  for (var row = 1; row <= rows; row++) {
    for (var col = 1; col <= cols; col++) {
      var div = document.createElement("div")
      div.className = "cell blank"
      div.id = row+'_'+col
      container.appendChild(div)
    }
  }
}

createGrid(9, 9)