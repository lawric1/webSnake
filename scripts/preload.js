let urls = {
  start: "./assets/startscreen.png",
  pause: "./assets/pausescreen.png",
  gameover: "./assets/gameover.png",
  bg: "./assets/background.png",
  snake: "./assets/snake.png",
  food1: "./assets/food1.png",
  food2: "./assets/food2.png",
  food3: "./assets/food3.png",
};

export async function preloadImages() {
    const loadedImages = {};
  
    const promises = Object.entries(urls).map(([name, url]) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
  
        image.onload = () => {
          loadedImages[name] = image;
          resolve();
        };
  
        image.onerror = () => reject(`Image '${name}' failed to load: ${url}`);
      });
    });
  
    await Promise.all(promises);
  
    return loadedImages;
}

export {
    urls
}