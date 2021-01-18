
const width = 20
const cells = []
let displayAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
let playerStart = 388
let direction = 1
const aliensMoving = false
const laserShot = false
let bombMoving = false
const bombInitiated = false
// const makeAliensMove = null
let bombStartPosition
let laserPosition = 388
const grid = document.querySelector('.grid')
let displayLives = document.querySelector('#lives_remaining')
let displayPoints = document.querySelector('#score')
const startButton = document.querySelector('#start')
const resetButton = document.querySelector('#reset')


// create grid
for (let index = 0; index < width * width; index++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  cell.innerHTML = index
  cell.style.width = `${100 / width}%`
}

// game starts when player clicks start button
startButton.addEventListener('click', () => {

  // starting position of player and aliens
  cells[playerStart].classList.add('gun')
  cells[laserPosition].classList.add('laser')
  displayAliens.forEach(alien => {
    cells[alien].classList.add('alien')
  })

  aliensMove()
  bombAlignedToAlien()
  bombsMove()


  // when player clicks arrows to move
  document.addEventListener('keydown', (event) => {
    const key = event.key

    if (key === 'ArrowLeft' && !(playerStart % width === 0)) {
      cells[playerStart].classList.remove('gun')
      cells[laserPosition].classList.remove('laser')
      playerStart -= 1
      laserPosition -= 1
      cells[playerStart].classList.add('gun')
      cells[laserPosition].classList.add('laser')
    } else if (key === 'ArrowRight' && !(playerStart % width === width - 1)) {
      cells[playerStart].classList.remove('gun')
      cells[laserPosition].classList.remove('laser')
      playerStart += 1
      laserPosition += 1
      cells[playerStart].classList.add('gun')
      cells[laserPosition].classList.add('laser')
    } else if (key === 'ArrowUp') {

      setInterval(() => {
        cells[laserPosition].classList.remove('laser')
        if (laserPosition > 19) {
          laserPosition -= 20
          cells[laserPosition].classList.add('laser')
        } else if (laserPosition > 19) {
          cells[laserPosition].classList.remove('laser')
        }
      }, 100)
    }
  })

  // if (displayLives.innerHTML === 0 || displayAliens[33] === 399) {
  //   gameOver()
  // } else if (displayAliens.length === 0) {
  //    player wins 
  // } else if (cells.classList.contains('bomb') && cells.classList.contains('playerStart')) {
  //   displayLives.innerHTML -= 1
  // } else if (cells.classList.contains('alien') && cells.classList.contains('laser')) {
  //   displayPoints.innerHTML += 100
  // }

  // when user clicks to restart game - needs updating, not currently working

  // resetButton.addEventListener('click', () => {

  //   cells[playerStart].classList.remove('gun')
  //   displayAliens.forEach(alien => {
  //     cells[alien].classList.remove('alien')
  //   })
  // })
})

// direction is defined at start of game, so movement will begin by going right
function alienMovement() {
  removeAlienClass()
  if (direction === 1 && displayAliens[0] % width === 7) {
    direction = width
  } else if (direction === -1 & displayAliens[0] % width === 0) {
    direction = width
  } else if (direction === width && displayAliens[0] % width === 7) {
    direction = -1
  } else if (direction === width && displayAliens[0] % width === 0) {
    direction = 1
  }
  updateAlienClass()
}

// when alien is in new position, remove class, move alien using alienMovement if statement
function removeAlienClass() {
  displayAliens.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
}

// and then update the new position with updateAlienClass
function updateAlienClass() {
  displayAliens = displayAliens.map(alienPosition => alienPosition + direction)
  displayAliens.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
}

function aliensMove() {
  if (aliensMoving === false) {
    setInterval(alienMovement, 500)
  }
}

// function and interval to create bomb position
function randomBomb() {
  const alienBomber = Math.floor(Math.random() * displayAliens.length)
  bombStartPosition = displayAliens[alienBomber] + 20
  cells[bombStartPosition].classList.add('bomb')
}

function bombAlignedToAlien() {
  if (bombInitiated === false) {
    setInterval(randomBomb, 3000)
  }
}

function moveBomb() {
  cells[bombStartPosition].classList.remove('bomb')
  bombStartPosition += 20
  cells[bombStartPosition].classList.add('bomb')
}

function bombsMove() {
  if (bombMoving === false) {
    bombMoving = setInterval(moveBomb, 150)
  }
}

function gameOver() {
  alert(`Game Over! Your final score was ${displayPoints}`)
}