
// variables
const width = 20
const cells = []
let displayAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
let playerStart = 388
let direction = 1
const aliensMoving = false
let bombMoving = false
let bombInitiated = false
let bombStartPosition
let laserPosition = 388
let scoreUpdate = 0
let newLaserPos
// let newerLaserPos
let gameOver = true
let laserShot
let bombOnMove
let hasLaser = false

// DOM elements
const grid = document.querySelector('.grid')
const displayLives = document.querySelector('#lives_remaining')
const displayPoints = document.querySelector('#score')
const startButton = document.querySelector('#start')

// create grid
for (let index = 0; index < width * width; index++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  // cell.innerHTML = index
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
      // bombOnMove = setInterval(moveBomb, 150)
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
          console.log('yes')
          laserShot = setInterval(() => {
            cells[newLaserPos].classList.remove('laser')
            newLaserPos -= 20
            cells[newLaserPos].classList.add('laser')
          }, 100)

        } else if (newLaserPos <= 19) {
          console.log('hello')
          clearInterval(laserShot)
          hasLaser = false
        } 

        // else {
        //   laserShot = setInterval(() => {
        //     cells[newLaserPos].classList.remove('laser')
        //     newLaserPos -= 20
        //     cells[newLaserPos].classList.add('laser')
        //   }, 100)
        // }
      }
    }
  })
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
  // else if (direction === width && cells[displayAliens] > 380) {
  //   alert('You Lost')
  // }
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
  displayAliens = displayAliens.map(alien => alien + direction)
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
  if (cells[bombStartPosition]) {
    cells[bombStartPosition].classList.remove('bomb')
    bombStartPosition += 20
    cells[bombStartPosition].classList.add('bomb')
  }

}

let bombBottom = false

function checkCollision() {
  const collisionCheck = setInterval(() => {
    if (gameOver === true) {
      clearInterval(collisionCheck)
    } else if (cells[newLaserPos]) {
      
      // if (cells[0].classList.contains('laser') || cells[1].classList.contains('laser') || cells[2].classList.contains('laser') || cells[4].classList.contains('laser') || cells[5].classList.contains('laser') || cells[0].classList.contains('laser') || )


      if (cells[newLaserPos].classList.contains('bomb')) {
        hasLaser = false
        console.log('collision')
        clearInterval(laserShot)
        bombMoving = false
        cells[newLaserPos].classList.remove('laser')
        cells[newLaserPos].classList.remove('bomb')
        bombInitiated = false
      }
      //  another if statement
      if (cells[newLaserPos].classList.contains('alien')) {
        hasLaser = false
        clearInterval(laserShot)
        const collision = displayAliens.indexOf(newLaserPos)
        displayAliens.splice(collision, 1)
        cells[newLaserPos].classList.remove('laser')
        newLaserPos = 0
        cells[newLaserPos].classList.remove('alien')
        displayPoints.innerHTML = scoreUpdate
        scoreUpdate += 150
      }
    } else if (bombStartPosition > 380 && !bombBottom) {
      bombMoving = false
      bombInitiated = false
      console.log(typeof (bombStartPosition))
      bombBottom = true
      setTimeout(() => {
        const bottomRow = [380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]
        bottomRow.forEach(cell => cells[cell].classList.remove('bomb'))
      }, 100)
    }
  }, 1)
}