export class TimePickerUtils {
  static getHours(format: number) {
    return Array(format).fill(1).map((v, i) => {
      const angleStep = 30;
      const time = v + i;
      const angle = angleStep * time;
      return { time: time === 24 ? 0 : time, angle };
    });
  }

  static getMinutes() {
    const minutesCount = 60;
    const angleStep = 360 / minutesCount;
    const minutes = [];

    for (let i = 0; i < minutesCount; i++) {
      const angle = angleStep * i;
      minutes.push({ time: i, angle: angle !== 0 ? angle : 360 });
    }
    return minutes;
  }
}
