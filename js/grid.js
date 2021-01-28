
const width = 20
const cells = []
let displayAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
const bottomRow = [380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]
let playerStart = 388
let direction = 1
const aliensMoving = false
let bombMoving = false
let bombInitiated = false
let bombStartPosition
let rocketPosition = 388
let scoreUpdate = 0
let livesUpdate = 3
let newRocketPos
let gameOver = true
let rocketShot
let bombOnMove
let hasRocket = false
let bombBottom = false

const grid = document.querySelector('.grid')
const displayLives = document.querySelector('#lives_remaining')
const displayPoints = document.querySelector('#score')
const startButton = document.querySelector('#start')
const audioPlayer = document.querySelector('#backgroundMusic')
const audioPlayerDead = document.querySelector('#playerDead')
const audioPlayerShoots = document.querySelector('#playerShoots')
const audioAlienHit = document.querySelector('#alienHit')
const audioBombHits = document.querySelector('#bombHitsPlayer')
const modal = document.querySelector('.closing_modal')
const modalText = document.querySelector('.modal_score')
const modalButton = document.querySelector('.modal_button')

for (let index = 0; index < width * width; index++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  cell.style.width = `${100 / width}%`
}

startButton.addEventListener('click', () => {

  audioPlayer.play()

  // starting position of player and aliens
  cells[playerStart].classList.add('spaceship')
  cells[rocketPosition].classList.add('rocket')
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
  }, 100)

  document.addEventListener('keydown', (event) => {
    const key = event.key

    if (key === 'ArrowLeft' && !(playerStart % width === 0)) {
      cells[playerStart].classList.remove('spaceship')
      cells[rocketPosition].classList.remove('rocket')
      playerStart -= 1
      rocketPosition -= 1
      cells[playerStart].classList.add('spaceship')
      cells[rocketPosition].classList.add('rocket')
    } else if (key === 'ArrowRight' && !(playerStart % width === width - 1)) {
      cells[playerStart].classList.remove('spaceship')
      cells[rocketPosition].classList.remove('rocket')
      playerStart += 1
      rocketPosition += 1
      cells[playerStart].classList.add('spaceship')
      cells[rocketPosition].classList.add('rocket')
    } else if (key === 'ArrowUp') {
      audioPlayerShoots.play()
      if (hasRocket === false) {
        hasRocket = true
        newRocketPos = rocketPosition - 20
        if (newRocketPos > 19) {
          rocketShot = setInterval(() => {
            cells[newRocketPos].classList.remove('rocket')
            newRocketPos -= 20
            cells[newRocketPos].classList.add('rocket')
          }, 80)
        } else if (newRocketPos <= 19) {
          clearInterval(rocketShot)
          hasRocket = false
        }
      }
    }
  })
})

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

function removeAlienClass() {
  displayAliens.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
}

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
      // ! this else if statement works, if the rocket has been fired and is currently on the grid
    } else if (cells[newRocketPos]) {
      for (let i = 0; i < width - 1; i++) {
        if (cells[i].classList.contains('rocket')) {
          hasRocket = false
          clearInterval(rocketShot)
          cells[newRocketPos].classList.remove('rocket')
          newRocketPos = null
        }
      }
      
      if (cells[playerStart].classList.contains('bomb') && bottomRow.some(cell => cells[cell].classList.contains('rocket'))) {

        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true
        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          cells[playerStart].classList.remove('bomb')
          bombMoving = true
          bombInitiated = false
        }
      }

      if (cells[playerStart].classList.contains('bomb')) {
        audioBombHits.play()
        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true
          gameEnded()
          modalText.innerHTML = `You lost! Your final score: ${scoreUpdate}`
        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          cells[playerStart].classList.remove('bomb')
          bombMoving = true
          bombInitiated = false
        }
      }

      if (cells[newRocketPos].classList.contains('bomb')) {
        hasRocket = false
        clearInterval(rocketShot)
        cells[newRocketPos].classList.remove('bomb')
        cells[newRocketPos].classList.remove('rocket')
        bombMoving = false
        bombInitiated = false
      }

      if (cells[newRocketPos].classList.contains('alien')) {
        audioAlienHit.play()
        scoreUpdate += 150
        displayPoints.innerHTML = scoreUpdate
        hasRocket = false
        clearInterval(rocketShot)
        const collision = displayAliens.indexOf(newRocketPos)
        displayAliens.splice(collision, 1)
        cells[newRocketPos].classList.remove('rocket')
        cells[newRocketPos].classList.remove('alien')
        newRocketPos = null
      }

    } else if (bombStartPosition > 380 && !bombBottom) {
      bombMoving = false
      bombInitiated = false
      bombBottom = true
      setTimeout(() => {
        bottomRow.forEach(cell => cells[cell].classList.remove('bomb'))
      }, 100)

      if (cells[playerStart].classList.contains('bomb')) {
        audioBombHits.play()

        if (livesUpdate === 1) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          gameOver = true
          bombMoving = false
          bombInitiated = true
          gameEnded()
          modalText.innerHTML = `You lost! Your final score: ${scoreUpdate}`

        } else if (livesUpdate >= 2) {
          livesUpdate -= 1
          displayLives.innerHTML = livesUpdate
          cells[playerStart].classList.remove('bomb')
          bombMoving = true
          bombInitiated = false
        }
      }
    } else if (displayAliens.length === 0) {
      gameOver = true
      gameEnded()
      modalText.innerHTML = `You win! Your final score: ${scoreUpdate}`
      audioPlayer.pause()

    } else if (displayAliens[displayAliens.length - 1] >= 380) {
      gameEnded()
      gameOver = true
      modalText.innerHTML = `You lost! Your final score: ${scoreUpdate}`
    }
  }, 1)
}

function gameEnded() {
  gameEndedModal()
  audioPlayer.pause()
  audioPlayerDead.play()
}

function gameEndedModal() {
  modal.classList.add('show_modal')
}

modalButton.addEventListener('click', () => {
  location.reload()
})
