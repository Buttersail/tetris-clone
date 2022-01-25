document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0

  const colors = ['orange', 'red', 'purple', 'green', 'blue']

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

  const tetrisShapes = [lTetrisShape, zTetrisShape, tTetrisShape, oTetrisShape, iTetrisShape]

  let currentPosition = 4
  let currentRotation = 0

  //randomly select tetris shape
  let random = Math.floor(Math.random() * tetrisShapes.length)
  let current = tetrisShapes[random][currentRotation]

  //draw the first tetris shape
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetris-shape')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the tetris shape
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetris-shape')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

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
  document.addEventListener('keydown', control)

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
      nextRandom = Math.floor(Math.random() * tetrisShapes.length)
      current = tetrisShapes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the shape left, unless it an edge or something is blocking it
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

  //make check for if the tetris-piece is at the edge
  function checkRotatedTakenPosition() {
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentRotation++
      if (currentRotation === current.length) {
        currentRotation = 0
      }
      current = theTetraminoes[random][currentRotation]
      checkRotatedPositionAtEdge()
      checkRotatedTakenPosition()
    }
  }

  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0)
  }

  function checkRotatedPositionAtEdge(edge) {
    edge = edge || currentPosition
    if ((edge + 1) % width < 4) {
      if (isAtRight()) {
        currentPosition += 1
        checkRotatedPositionAtEdge(edge)
      }
    } else if (edge % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPositionAtEdge(edge)
      }
    }
  }

  //rotate the shape
  function rotate() {
    undraw()
    currentRotation++
    //goes back to the default rotation if it reaches rotation of 4
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = tetrisShapes[random][currentRotation]
    checkRotatedTakenPosition()
    checkRotatedPositionAtEdge()
    draw()
  }

  //show which shape is coming up next in the mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

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
      squares.style.backgroundColor = ''
    })
    upNextShape[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetris-shape')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //add functionality to our button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * tetrisShapes.length)
      displayShape()
    }
  })

  //add score feature
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach((index) => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetris-shape')
          squares[index].style.backgroundColor = ''
        })

        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach((cell) => grid.appendChild(cell))
      }
    }
  }

  //Game Over
  function gameOver() {
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerId)
    }
  }
})
