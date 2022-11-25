export const asctime = (duration: number): string => {
  const milliseconds = Math.floor(duration % 1000),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  const hours_ = hours < 10 ? '0' + hours : hours;
  const minutes_ = minutes < 10 ? '0' + minutes : minutes;
  const seconds_ = seconds < 10 ? '0' + seconds : seconds;
  let milliseconds_ = milliseconds < 10 ? '0' + milliseconds : milliseconds;
  milliseconds_ = milliseconds < 100 ? '0' + milliseconds_ : milliseconds_;

  return days + ' ' + hours_ + ':' + minutes_ + ':' + seconds_ + '.' + milliseconds_;
};

export const filter: <T>(iterable: T[], condition: (x: T) => boolean) => T[] = (iterable, condition) => {
  const result = [];
  for (const item of iterable) {
    if (condition(item)) {
      result.push(item);
    }
  }
  return result;
};
