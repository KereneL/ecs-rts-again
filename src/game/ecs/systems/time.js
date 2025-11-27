export const timeSystem = {
  // init: function (world) {},// init: function (world) {},
  update: (world, deltaTime) => {
    const { time } = world
    time.delta = deltaTime
    time.elapsed += deltaTime
    time.then = performance.now()
  }
}