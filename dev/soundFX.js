/**
 * This javascript file contains the functions for in-game sfx to be played
 * upon certain game events.
 * 
 * Workflow for adding new sound effect:
 * 1) load global variable in main.js (after adding new sound into assets/SFX)
 * 2) add new case in switch statement with appropriate name
 * 3) set the local variable sound to that newly created global variable
 * 4) use playSFX(sfx_name) where-ever you need that new sound played! 
 */


/**
 * This function plays the SFX of the string variable passed.
 * 
 * @param sfx_name The name of the requested SFX 
 */
function playSFX(sfx_name) {
    let sound;
    switch (sfx_name) {
        case "explosion":
            sound = explosionNormal;
            break;
        case "healthUp":
            sound = healthSFX;
            break;
        case "enemyGone":
            sound = shockedSFX;
            break;
        case "bossHurt":
            sound = waveClearSFX;
            break;
        case "hover":
            sound = selectSFX;
            break;
        case "click":
            sound = toggleSFX;
            break;
        default:
            // Sound unrecognized! 
            break;
    }

    // Play the found sound
    if (sound) {
        // I think explosion should be louder
        if (sfx_name == "explosion" && sfx_volume != 0) {
            sound.setVolume(sfx_volume + 0.5);
        } else {
            sound.setVolume(sfx_volume); // sfx_volume is declared in main.js
        }
        sound.play();
    }
}