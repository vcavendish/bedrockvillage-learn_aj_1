// Handle collisions with monsters
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, monster) {
    monster.destroy(effects.disintegrate, 500)
    projectile.destroy()
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (hero, monster) {
    info.changeLifeBy(-1)
    monster.destroy(effects.fire, 500)
    if (info.life() <= 0) {
        game.over(false, effects.dissolve)
    }
})
let arrow: Sprite = null
let monster: Sprite = null
// Set up player character
let hero = sprites.create(img`
    . . . . . f f f f f f f . . . . . 
    . . . f f e e e e e e e f f . . . 
    . . f e e e e e e e e e e e f . . 
    . f e e e e e e e e e e e e e f . 
    . f e e e f f f f f f f f e e f . 
    . f e e f f e e e e e f f f e f . 
    . f e f f e e e e e e e f f e f . 
    . f f e e e e e e e e e e f e f . 
    . f e e e e e e e e e e e e e f . 
    . f e e e e e e e e e e e e e f . 
    . . f f e e e e e e e e e e f f . 
    . . e f f e e e e e e e e f e e . 
    . . e e f f e e e e e e f e e e . 
    . . . e e f f e e e e f f e e . . 
    . . . . e e e f f f f e e e . . . 
    . . . . . e e e e e e e . . . . . 
    `, SpriteKind.Player)
controller.moveSprite(hero)
scene.cameraFollowSprite(hero)
// Manage player's health and game over
info.setLife(3)
// Create mutant monsters every few seconds
game.onUpdateInterval(2000, function () {
    monster = sprites.create(img`
        . . . . . . c c c c . . . . . . 
        . . . . c c d d d d c c . . . . 
        . . . c d d d d d d d d c . . . 
        . . c d d d d d d d d d d c . . 
        . . c d d d c c c c d d d c . . 
        . c d d d c 4 4 4 4 c d d d c . 
        . c d d c 4 4 4 4 4 4 c d d c . 
        . c d c 4 4 4 4 4 4 4 4 c d c . 
        . c d c 4 4 4 4 4 4 4 4 c d c . 
        . c d d c 4 4 4 4 4 4 c d d c . 
        . c d d d c c c c c c d d d c . 
        . . c d d d d d d d d d d c . . 
        . . . c d d d d d d d d c . . . 
        . . . . c c d d d d c c . . . . 
        . . . . . . c c c c . . . . . . 
        `, SpriteKind.Enemy)
    monster.setPosition(Math.randomRange(0, scene.screenWidth()), Math.randomRange(0, scene.screenHeight()))
    monster.follow(hero, 20)
})
// Create user interface for weapons
game.onUpdateInterval(500, function () {
    if (controller.A.isPressed()) {
        // Sword attack feedback
        pause(100)
        sprites.allOfKind(SpriteKind.Enemy).forEach(function (monster) {
            if (hero.overlapsWith(monster)) {
                monster.destroy()
                info.changeScoreBy(1)
            }
        })
    }
    if (controller.B.isPressed()) {
        // Bow and arrow
        arrow = sprites.createProjectileFromSprite(img`
            . . . . 2 2 b b b b b b . . . 
            . . . 2 2 b b b b b b b b . . 
            . . 2 b b b b b b b b b b b . 
            . 2 b b b b b b b b b b b b b 
            . 2 b b b b b b b b b b b b b 
            . 2 b b b b b b b b b b b b b 
            . 2 b b b b b b b b b b b b b 
            . 2 b b b b b b b b b b b b b 
            . 2 b b b b b b b b b b b b b 
            . . 2 b b b b b b b b b b b . 
            . . . 2 2 b b b b b b b b . . 
            . . . . 2 2 b b b b b b . . . 
            `, hero, controller.dx(), controller.dy())
        arrow.setKind(SpriteKind.Projectile)
    }
})
// Win condition
game.onUpdateInterval(10000, function () {
    if (info.score() >= 10) {
        game.over(true, effects.confetti)
    }
})
