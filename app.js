document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const resetBtn = document.querySelector('#reset')
  const gridWidth = 10
  let score = 0
  let nextRandom = 0
  let timerId
  const colors = ['orange', 'red', 'purple', 'green', 'blue']

  //The Tetrominoes
  const lTetromino = [
    [1, gridWidth+1, gridWidth*2+1, 2],
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2+2],
    [1, gridWidth+1, gridWidth*2+1, gridWidth*2],
    [gridWidth, gridWidth*2, gridWidth*2+1, gridWidth*2+2]
  ]

  const zTetromino = [
    [0,gridWidth,gridWidth+1,gridWidth*2+1],
    [gridWidth+1, gridWidth+2,gridWidth*2,gridWidth*2+1],
    [0,gridWidth,gridWidth+1,gridWidth*2+1],
    [gridWidth+1, gridWidth+2,gridWidth*2,gridWidth*2+1]
  ]

  const tTetromino = [
    [1,gridWidth,gridWidth+1,gridWidth+2],
    [1,gridWidth+1,gridWidth+2,gridWidth*2+1],
    [gridWidth,gridWidth+1,gridWidth+2,gridWidth*2+1],
    [1,gridWidth,gridWidth+1,gridWidth*2+1]
  ]

  const oTetromino = [
    [0,1,gridWidth,gridWidth+1],
    [0,1,gridWidth,gridWidth+1],
    [0,1,gridWidth,gridWidth+1],
    [0,1,gridWidth,gridWidth+1]
  ]

  const iTetromino = [
    [1,gridWidth+1,gridWidth*2+1,gridWidth*3+1],
    [gridWidth,gridWidth+1,gridWidth+2,gridWidth+3],
    [1,gridWidth+1,gridWidth*2+1,gridWidth*3+1],
    [gridWidth,gridWidth+1,gridWidth+2,gridWidth+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currPos = 4
  let currRotation = 0

  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currRotation]

  function draw() {
    current.forEach(index => {
      squares[currPos + index].classList.add('tetromino')
      squares[currPos + index].style.backgroundColor = colors[random]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currPos + index].classList.remove('tetromino')
      squares[currPos + index].style.backgroundColor = ''
    })
  }

  function control(e) {
    if(e.keyCode === 37) {
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

  function moveDown() {
    undraw()
    currPos += gridWidth
    draw()
    freeze()
  }


  function freeze() {
    if(current.some(index => squares[currPos + index + gridWidth].classList.contains('taken'))) {
      current.forEach(index => squares[currPos + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currRotation]
      currPos = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currPos + index) % gridWidth === 0)
    if(!isAtLeftEdge) currPos -=1
    if(current.some(index => squares[currPos + index].classList.contains('taken'))) {
      currPos +=1
    }
    draw()
  }

  
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currPos + index) % gridWidth === gridWidth -1)
    if(!isAtRightEdge) currPos +=1
    if(current.some(index => squares[currPos + index].classList.contains('taken'))) {
      currPos -=1
    }
    draw()
  }
  
  function rotate() {
    undraw()
    currRotation++
    if(currRotation === current.length) { 
      currRotation = 0
    }
    current = theTetrominoes[random][currRotation]
    checkRotatedPosition()
    draw()
  }

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1], 
    [1, displayWidth, displayWidth+1, displayWidth+2], 
    [0, 1, displayWidth, displayWidth+1], 
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] 
  ]


  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }else {
      draw()
      timerId = setInterval(moveDown, 500)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  resetBtn.addEventListener('click', () => {
    location.reload()
  })

  function addScore() {
    for (let i = 0; i < 199; i +=gridWidth) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, gridWidth)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }


  function gameOver() {
    if(current.some(index => squares[currPos + index].classList.contains('taken')) || currents.some(index => squaress[currPoss + index].classList.contains('takens'))) {
      clearInterval(timerId)
      alert(`GAME OVER! Your score is ${score + scores}`)
      scoreDisplay.innerHTML = 'end'
    }
  }









  const grids = document.querySelector('.grids')
  let squaress = Array.from(document.querySelectorAll('.grids div'))
  const scoreDisplays = document.querySelector('#scores')
  const startBtns = document.querySelector('#start-buttons')
  const gridWidths = 10
  let scores = 0
  let nextRandoms = 0
  let timerIds
  const colorss = ['orange', 'red', 'purple', 'green', 'blue']

  //The Tetrominoes
  const lTetrominos = [
    [1, gridWidths+1, gridWidths*2+1, 2],
    [gridWidths, gridWidths+1, gridWidths+2, gridWidths*2+2],
    [1, gridWidths+1, gridWidths*2+1, gridWidths*2],
    [gridWidths, gridWidths*2, gridWidths*2+1, gridWidths*2+2]
  ]

  const zTetrominos = [
    [0,gridWidths,gridWidths+1,gridWidths*2+1],
    [gridWidths+1, gridWidths+2,gridWidths*2,gridWidths*2+1],
    [0,gridWidths,gridWidths+1,gridWidths*2+1],
    [gridWidths+1, gridWidths+2,gridWidths*2,gridWidths*2+1]
  ]

  const tTetrominos = [
    [1,gridWidths,gridWidths+1,gridWidths+2],
    [1,gridWidths+1,gridWidths+2,gridWidths*2+1],
    [gridWidths,gridWidths+1,gridWidths+2,gridWidths*2+1],
    [1,gridWidths,gridWidths+1,gridWidths*2+1]
  ]

  const oTetrominos = [
    [0,1,gridWidths,gridWidths+1],
    [0,1,gridWidths,gridWidths+1],
    [0,1,gridWidths,gridWidths+1],
    [0,1,gridWidths,gridWidths+1]
  ]

  const iTetrominos = [
    [1,gridWidths+1,gridWidths*2+1,gridWidths*3+1],
    [gridWidths,gridWidths+1,gridWidths+2,gridWidths+3],
    [1,gridWidths+1,gridWidths*2+1,gridWidths*3+1],
    [gridWidths,gridWidths+1,gridWidths+2,gridWidths+3]
  ]

  const theTetrominoess = [lTetrominos, zTetrominos, tTetrominos, oTetrominos, iTetrominos]

  let currPoss = 4
  let currRotations = 0

  let randoms = Math.floor(Math.random()*theTetrominoess.length)
  let currents = theTetrominoess[randoms][currRotations]

  function draws() {
    currents.forEach(index => {
      squaress[currPoss + index].classList.add('tetrominos')
      squaress[currPoss + index].style.backgroundColor = colorss[randoms]
    })
  }

  function undraws() {
    currents.forEach(index => {
      squaress[currPoss + index].classList.remove('tetrominos')
      squaress[currPoss + index].style.backgroundColor = ''
    })
  }

  function controls(e) {
    if(e.keyCode === 65) {
      moveLefts()
    } else if (e.keyCode === 87) {
      rotates()
    } else if (e.keyCode === 68) {
      moveRights()
    } else if (e.keyCode === 83) {
      moveDowns()
    }
  }
  document.addEventListener('keydown', controls)

  function moveDowns() {
    undraws()
    currPoss += gridWidths
    draws()
    freezes()
  }


  function freezes() {
    if(currents.some(index => squaress[currPoss + index + gridWidths].classList.contains('takens'))) {
      currents.forEach(index => squaress[currPoss + index].classList.add('takens'))
      randoms = nextRandoms
      nextRandoms = Math.floor(Math.random() * theTetrominoess.length)
      currents = theTetrominoess[randoms][currRotations]
      currPoss = 4
      draws()
      displayShapes()
      addScores()
      gameOvers()
    }
  }

  
  function moveLefts() {
    undraws()
    const isAtLeftEdges = currents.some(index => (currPoss + index) % gridWidths === 0)
    if(!isAtLeftEdges) currPoss -=1
    if(currents.some(index => squaress[currPoss + index].classList.contains('takens'))) {
      currPoss +=1
    }
    draws()
  }

  
  function moveRights() {
    undraws()
    const isAtRightEdges = currents.some(index => (currPoss + index) % gridWidths === gridWidths -1)
    if(!isAtRightEdges) currPoss +=1
    if(currents.some(index => squaress[currPoss + index].classList.contains('takens'))) {
      currPoss -=1
    }
    draws()
  }
  
  function rotates() {
    undraws()
    currRotations++
    if(currRotations === currents.length) { 
      currRotations = 0
    }
    currents = theTetrominoess[randoms][currRotations]
    //checkRotatedPosition()
    draws()
  }

  const displaySquaress = document.querySelectorAll('.mini-grids div')
  const displayWidths = 4
  const displayIndexs = 0

  const upNextTetrominoess = [
    [1, displayWidths+1, displayWidths*2+1, 2],
    [0, displayWidths, displayWidths+1, displayWidths*2+1], 
    [1, displayWidths, displayWidths+1, displayWidths+2], 
    [0, 1, displayWidths, displayWidths+1], 
    [1, displayWidths+1, displayWidths*2+1, displayWidths*3+1] 
  ]


  function displayShapes() {
    displaySquaress.forEach(square => {
      square.classList.remove('tetrominos')
      square.style.backgroundColor = ''
    })
    upNextTetrominoess[nextRandoms].forEach( index => {
      displaySquaress[displayIndexs + index].classList.add('tetrominos')
      displaySquaress[displayIndexs + index].style.backgroundColor = colorss[nextRandoms]
    })
  }

  startBtns.addEventListener('click', () => {
    if (timerIds) {
      clearInterval(timerIds)
      timerIds = null
    }else {
      draws()
      timerIds = setInterval(moveDowns, 500)
      nextRandoms = Math.floor(Math.random()*theTetrominoess.length)
      displayShapes()
    }
  })

  function addScores() {
    for (let i = 0; i < 199; i +=gridWidths) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squaress[index].classList.contains('takens'))) {
        scores +=10
        scoreDisplays.innerHTML = scores
        row.forEach(index => {
          squaress[index].classList.remove('takens')
          squaress[index].classList.remove('tetrominos')
          squaress[index].style.backgroundColor = ''
        })
        const squaresRemoved = squaress.splice(i, gridWidths)
        squaress = squaresRemoved.concat(squaress)
        squaress.forEach(cell => grids.appendChild(cell))
      }
    }
  }


  function gameOvers() {
    if(currents.some(index => squaress[currPoss + index].classList.contains('takens')) || current.some(index => squares[currPos + index].classList.contains('taken'))) {
      clearInterval(timerIds)
      alert(`GAME OVER! Your score is ${score + scores}`)
      scoreDisplays.innerHTML = 'end'
    }
  }

})