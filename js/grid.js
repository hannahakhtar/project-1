
// variables
const width = 20
const cells = []
let displayAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
const bottomRow = [380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]
let playerStart = 388
let direction = 1
let aliensMoving = false
let bombMoving = false
let bombInitiated = false
let bombStartPosition
let laserPosition = 388
let scoreUpdate = 0
let livesUpdate = 3
let newLaserPos
let gameOver = true
let laserShot
let bombOnMove
let hasLaser = false
let bombBottom = false

// DOM elements
const grid = document.querySelector('.grid')
const displayLives = document.querySelector('#lives_remaining')
const displayPoints = document.querySelector('#score')
const startButton = document.querySelector('#start')
const resetButton = document.querySelector('#reset')

// create grid
for (let index = 0; index < width * width; index++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
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

  gameOver = false

  checkCollision()
  bombAlignedToAlien()
  aliensMove()

  bombOnMove = setInterval(() => {
    if (bombMoving === true) {
      moveBomb()
    }
  }, 150)

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
      // work on this in AM
      if (hasLaser === false) {
        hasLaser = true
        newLaserPos = laserPosition - 20
        if (newLaserPos > 19) {
          laserShot = setInterval(() => {
            // console.log(newLaserPos, 'laser pos')
            cells[newLaserPos].classList.remove('laser')
            newLaserPos -= 20
            cells[newLaserPos].classList.add('laser')
          }, 80)
        } else if (newLaserPos <= 19) {
          console.log('hello')
          clearInterval(laserShot)
          hasLaser = false
        }
      }
    }
  })
})

// ! direction is defined at start of game, so movement will begin by going right
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

// ! when alien is in new position, remove class, move alien using alienMovement if statement
function removeAlienClass() {
  displayAliens.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
}

// ! and then update the new position with updateAlienClass
function updateAlienClass() {
  displayAliens = displayAliens.map(alien => alien + direction)
  displayAliens.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
}

function aliensMove() {
  if (aliensMoving === false) {
    setInterval(alienMovement, 1000)
  }
}

// function and interval to create bomb position
function randomBomb() {
  const alienBomber = Math.floor(Math.random() * displayAliens.length)
  bombStartPosition = displayAliens[alienBomber] + 20
  cells[bombStartPosition].classList.add('bomb')
  bombMoving = true
  bombInitiated = true
  bombBottom = false
}

function bombAlignedToAlien() {
  setInterval(() => {
    if (bombInitiated === false) {
      randomBomb()
    }
  }, 2500)
}

function moveBomb() {
  // console.log(bombStartPosition)
  if (cells[bombStartPosition]) {
    cells[bombStartPosition].classList.remove('bomb')
    bombStartPosition += 20
    cells[bombStartPosition].classList.add('bomb')
  }
}

function checkCollision() {
  const collisionCheck = setInterval(() => {
    if (gameOver === true) {
      clearInterval(collisionCheck)
      gameEnded()
      // ! this else if statement works, if the laser has been fired and is on the grid
    } else if (cells[newLaserPos]) {
      for (let i = 0; i < width - 1; i++) {
        if (cells[i].classList.contains('laser')) {
          hasLaser = false
          clearInterval(laserShot)
          cells[newLaserPos].classList.remove('laser')
          newLaserPos = null
        }
      }
      // 
      if (cells[playerStart].classList.contains('bomb') && bottomRow.some(cell => cells[cell].classList.contains('laser'))) {

        console.log(livesUpdate)
        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true
        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          console.log('yes')
          cells[playerStart].classList.remove('bomb')
          // newLaserPos = 0
          bombMoving = true
          bombInitiated = false
          console.log('cleared')
        }
      }

      if (cells[playerStart].classList.contains('bomb')) {

        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true
        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          console.log('yes')
          cells[playerStart].classList.remove('bomb')
          // newLaserPos = 0
          bombMoving = true
          bombInitiated = false
          console.log('cleared')
        }
      }

      if (cells[newLaserPos].classList.contains('bomb')) {
        hasLaser = false
        clearInterval(laserShot)
        cells[newLaserPos].classList.remove('bomb')
        cells[newLaserPos].classList.remove('laser')
        bombMoving = false
        bombInitiated = false
      }

      if (cells[newLaserPos].classList.contains('alien')) {
        scoreUpdate += 150
        displayPoints.innerHTML = scoreUpdate
        hasLaser = false
        clearInterval(laserShot)
        const collision = displayAliens.indexOf(newLaserPos)
        displayAliens.splice(collision, 1)
        cells[newLaserPos].classList.remove('laser')
        newLaserPos = null
        cells[newLaserPos].classList.remove('alien')

        console.log('laser hits alien and score increases, so I work')
      }

    } else if (bombStartPosition > 380 && !bombBottom) {
      console.log('bombbottom')
      bombMoving = false
      bombInitiated = false
      bombBottom = true
      setTimeout(() => {
        bottomRow.forEach(cell => cells[cell].classList.remove('bomb'))
      }, 100)

      if (cells[playerStart].classList.contains('bomb')) {

        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true

        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          console.log('yes')
          cells[playerStart].classList.remove('bomb')
          bombMoving = true
          bombInitiated = false
          console.log('cleared')
        }
      }
    } else if (displayAliens.length === 0) {
      gameOver = true
      alert(`You win!! Your final score was ${scoreUpdate}`)

    } else if (displayAliens[displayAliens.length - 1] >= 380) {
      gameEnded()
      gameOver === true

    }
  }, 1)
}

function gameEnded() {
  alert(`You lost! Your final score was ${scoreUpdate}`)
  cells[playerStart].classList.remove('gun')
  cells[laserPosition].classList.remove('laser')
  cells[displayAliens].classList.remove('alien')
  clearInterval(bombOnMove)
  clearInterval(laserShot)
  aliensMoving = false
  bombInitiated = true

}

resetButton.addEventListener('click', () => {
  location.reload()
})
