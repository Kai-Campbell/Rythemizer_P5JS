var gamepadInput = {
  leftStick: { x: 0, y: 0 },
  rightStick: { x: 0, y: 0 },
  dpad: { up: false, down: false, left: false, right: false },
};

var gamepadState = {
  deadzone: 0.18,
  aimDeadzone: 0.22,
  lastFireAt: 0,
};

function gamepadApplyDeadzone(value, deadzone) {
  const a = Math.abs(value);
  if (a < deadzone) return 0;
  const sign = value < 0 ? -1 : 1;
  const scaled = (a - deadzone) / (1 - deadzone);
  return sign * Math.min(1, scaled);
}

function gamepadFirstConnected() {
  const list = navigator.getGamepads ? navigator.getGamepads() : null;
  if (!list) return null;
  for (let i = 0; i < list.length; i++) {
    if (list[i]) return list[i];
  }
  return null;
}

function gamepadButtonPressed(gp, index) {
  const b = gp.buttons[index];
  if (!b) return false;
  if (typeof b.pressed === "boolean") return b.pressed;
  return b.value > 0.5;
}

/**
 * Refresh sticks + D-pad from the first connected pad; fire while right trigger is held
 * or while the right stick is actively aiming. Call once per frame (e.g. start of draw).
 */
function updateGamepads() {
  const gp = gamepadFirstConnected();
  const dz = gamepadState.deadzone;
  const adz = gamepadState.aimDeadzone;

  if (!gp) {
    gamepadInput.leftStick.x = 0;
    gamepadInput.leftStick.y = 0;
    gamepadInput.rightStick.x = 0;
    gamepadInput.rightStick.y = 0;
    gamepadInput.dpad.up = false;
    gamepadInput.dpad.down = false;
    gamepadInput.dpad.left = false;
    gamepadInput.dpad.right = false;
    return;
  }

  gamepadInput.leftStick.x = gamepadApplyDeadzone(gp.axes[0] || 0, dz);
  gamepadInput.leftStick.y = gamepadApplyDeadzone(gp.axes[1] || 0, dz);
  gamepadInput.rightStick.x = gamepadApplyDeadzone(gp.axes[2] || 0, adz);
  gamepadInput.rightStick.y = gamepadApplyDeadzone(gp.axes[3] || 0, adz);

  gamepadInput.dpad.up = gamepadButtonPressed(gp, 12);
  gamepadInput.dpad.down = gamepadButtonPressed(gp, 13);
  gamepadInput.dpad.left = gamepadButtonPressed(gp, 14);
  gamepadInput.dpad.right = gamepadButtonPressed(gp, 15);

  const fireNow = gamepadButtonPressed(gp, 7) || Math.hypot(gamepadInput.rightStick.x, gamepadInput.rightStick.y) > 0;
  if (fireNow) {
    gamepadTryFireProjectile();
  }
}

function gamepadTryFireProjectile() {
  if (typeof paused !== "undefined" && paused) {
    return;
  }
  if (
    typeof levelRender === "undefined" ||
    (levelRender !== "rock" && levelRender !== "edm" && levelRender !== "lofi")
  ) {
    return;
  }
  if (typeof player_1 === "undefined" || !player_1) {
    return;
  }
  if (typeof projectiles === "undefined") {
    return;
  }

  let tx = mouseX;
  let ty = mouseY;
  const rx = gamepadInput.rightStick.x;
  const ry = gamepadInput.rightStick.y;
  if (Math.hypot(rx, ry) > 0.2) {
    tx = player_1.x + rx * 400;
    ty = player_1.y + ry * 400;
  }

  const now = millis();
  const fireInterval =
    typeof PLAYER_FIRE_INTERVAL_MS !== "undefined" ? PLAYER_FIRE_INTERVAL_MS : 200;
  if (now - gamepadState.lastFireAt < fireInterval) {
    return;
  }

  projectiles.push(new Projectile(player_1.x, player_1.y, tx, ty, "player"));
  gamepadState.lastFireAt = now;
}
