document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0

  //The tetris shapes
  const lTetrisShape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ]

  const zTetrisShape = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ]

  const tTetrisShape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ]

  const oTetrisShape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ]

  const iTetrisShape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ]

  const theTetrisShapes = [lTetrisShape, zTetrisShape, tTetrisShape, oTetrisShape, iTetrisShape]

  let currentPosition = 4
  let currentRotation = 0

  //randomly select tetris shape
  let random = Math.floor(Math.random() * theTetrisShapes.length)
  let current = theTetrisShapes[random][currentRotation]

  //draw the first tetris shape
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetris-shape')
    })
  }

  //undraw the tetris shape
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetris-shape')
    })
  }

  //make the shape move down every second
  timerId = setInterval(moveDown, 1000)

  //assing function to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach((index) => squares[currentPosition + index].classList.add('taken'))
      //make a new shape move down
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrisShapes.length)
      current = theTetrisShapes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
    }
  }

  //move the shape unless its at an edge
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  //move the shape right, unless it an edge or something is blocking it
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  //rotate the shape
  function rotate() {
    undraw()
    currentRotation++

    //goes back to the default rotation if it reaches rotation of 4
    if (currentRotation === current.length) {
      currentRotation = 0
    }

    current = theTetrisShapes[random][currentRotation]

    draw()
  }

  //show which shape is coming up next in the mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  //the shapes without the rotations
  const upNextShape = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ]

  //display the shape in the mini-grid
  function displayShape() {
    displaySquares.forEach((squares) => {
      squares.classList.remove('tetris-shape')
    })

    upNextShape[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetris-shape')
    })
  }
})
