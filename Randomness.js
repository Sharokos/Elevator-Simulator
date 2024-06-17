

class Randomness{
    constructor(){}

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }
    getRandomFloat(min, max) {
      return Math.random() * (max - min) + min; // The maximum is exclusive and the minimum is inclusive
    }
    getRandomItem(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }

}