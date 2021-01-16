// ? Initial game state

const grid = document.querySelector('.grid')
const width = 20
const height = 20
const cells = []
let displayAliens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
let direction = 1
const aliensMoving = false
let makeAliensMove = null
let playerStart = 388
let laserPosition = playerStart
let displayLives = document.querySelector('#lives_remaining')
let displayPoints = document.querySelector('#score')
const startButton = document.querySelector('#start')
const resetButton = document.querySelector('#reset')


for (let index = 0; index < width * height; index++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  cell.innerHTML = index
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`
  cell.setAttribute('id', `cell-${index}`)
}

// game starts when player clicks start button
startButton.addEventListener('click', () => {

  // starting position of player and aliens
  cells[playerStart].classList.add('gun')
  displayAliens.forEach(alien => {
    cells[alien].classList.add('alien')
  })

  aliensMove()

  // when player clicks arrows to move
  document.addEventListener('keydown', (event) => {
    const key = event.key

    if (key === 'ArrowLeft' && !(playerStart % width === 0)) {
      cells[playerStart].classList.remove('gun')
      playerStart -= 1
      cells[playerStart].classList.add('gun')
    } else if (key === 'ArrowRight' && !(playerStart % width === width - 1)) {
      cells[playerStart].classList.remove('gun')
      playerStart += 1
      cells[playerStart].classList.add('gun')
    } else if (key === 'ArrowUp') {
      playerShoots()
      console.log('work please')
    }
  })

  // when user clicks to restart game - needs updating, not currently working
  resetButton.addEventListener('click', () => {

    cells[playerStart].classList.remove('gun')
    displayAliens.forEach(alien => {
      cells[alien].classList.remove('alien')

    })
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
    makeAliensMove = setInterval(alienMovement, 600)
  }
}

function playerShoots() {
  
  const laserPosWhenPlayerShoots = playerStart - width
  const currentLaserPosition = document.getElementById(`cell-${laserPosWhenPlayerShoots}`)
  currentLaserPosition.classList.add('laser')
  checkCollision(laserPosWhenPlayerShoots)
  // change background colour to red(add/remove class) 
   
  
  
  
  // let laserRow = laserPosWhenPlayerShoots
  // const laserRowArray = []

  // for (let i = 1; i < height - 1; i++) {
  //   laserRowArray.push(laserRow -= 20)
  // }

  // if (!laserRow.contains('laser')) {
  //   cells[laserRow].classList.add('laser')
  // }

  // function laserMovement() {
  //   laserRowArray[laserRow].classList.remove('laser')
  //   laserRow++
  //   laserRowArray[laserRow].classList.add('laser')
  // }

}




function checkCollision (laserPosWhenPlayerShoots) {
 
  const currentLaserPosition = document.getElementById(`cell-${laserPosWhenPlayerShoots}`)
  if (currentLaserPosition.classList.contains('alien') && currentLaserPosition.classList.contains('laser')) {
    console.log('we collide')
    // remove alien from that ID
    // increase points by 100
  } else {
    console.log('we dont')
  }
}