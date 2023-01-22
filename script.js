const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
position: {
    x: 0,
    y: 0
},
 ImageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
     ImageSrc: './img/shop.png',
     scale: 2.75,
     framesMax: 6
    })

const player = new Fighter({
    position:{
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    },ImageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale:2.5,
    offset : {x:215, y:157},

    sprites:{
        idle:{  ImageSrc: './img/samuraiMack/Idle.png',
        framesMax: 8,
        },
        run:{  ImageSrc: './img/samuraiMack/Run.png',
        framesMax: 8,
        },
        jump:{  ImageSrc: './img/samuraiMack/Jump.png',
        framesMax: 2,
        },
        fall:{  ImageSrc: './img/samuraiMack/Fall.png',
        framesMax: 2,
        },
        attack1:{  ImageSrc: './img/samuraiMack/Attack1.png',
        framesMax: 6,
        },
        takeHit:{  ImageSrc: './img/samuraiMack/Take hit - white silhouette.png',
        framesMax: 4,
        },
        death:{  ImageSrc: './img/samuraiMack/Death.png',
        framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x:100,
            y: 50
        },
        width:150,
        height: 50
    }
})

player.draw()

const enemy = new Fighter({
    position:{
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset:{
    x: -50,
    y: 0
    },ImageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale:2.5,
    offset : {x:215, y:167},

    sprites:{
        idle:{  ImageSrc: './img/kenji/Idle.png',
        framesMax: 4,
        },
        run:{  ImageSrc: './img/kenji/Run.png',
        framesMax: 8,
        },
        jump:{  ImageSrc: './img/kenji/Jump.png',
        framesMax: 2,
        },
        fall:{  ImageSrc: './img/kenji/Fall.png',
        framesMax: 2,
        },
        attack1:{  ImageSrc: './img/kenji/Attack1.png',
        framesMax: 4,
        },
        takeHit:{  ImageSrc: './img/kenji/Take hit.png',
        framesMax: 3,
        },
        death:{  ImageSrc: './img/kenji/Death.png',
        framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x:-172,
            y: 50
        },
        width:172,
        height: 50
    }
})

enemy.draw()

console.log(player)

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.12)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 3
        player.switchSprite('run')
    } else {player.switchSprite('idle')}

    // player jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

      //enemy movement
      if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    } else {enemy.switchSprite('idle')}

    // enemy jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }


    // detect for collision & enemy gets hit
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.framesCurrent === 4
        ){
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent ===4) {
        player.isAttacking = false
    }


    // this is where our player gets hit
    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking && enemy.framesCurrent ===2
        ){
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + "%"
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent ===2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy. health <= 0 || player.health <= 0){
      determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) =>{
    if (!player.dead){

    
    switch (event.key) {
        case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
        case 'w':
         player.velocity.y = -18
        break
        case ' ':
          player.attack()
        break   
    }
}   

    if (!enemy.dead){
    switch(event.key){
     case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
     break
     case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
     break
     case 'ArrowUp':
      enemy.velocity.y = -18
     break
     case 'ArrowDown':
     enemy.attack()
     break
    }
}
})

window.addEventListener('keyup', (event) =>{
    switch (event.key) {
        case 'd':
        keys.d.pressed = false
        break
        case 'a':
        keys.a.pressed = false
        break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
})
