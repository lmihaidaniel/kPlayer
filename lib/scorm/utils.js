const pad = (num, size) => {
  let s = String(num);
  while (s.length < size) s = `0${s}`;
  return s;
};

export const formatTime = (ms) => {
  const seconds = (ms < 0 ? 0 : ms) / 1000;

  // Decomposing
  let s = Math.floor(seconds % 60);
  let m = Math.floor((seconds / 60) % 60);
  let h = Math.floor(seconds / 3600);

  // Leading zeros, to respect the format: hhhh:mm:ss
  h = pad(h, 4);
  m = pad(m, 2);
  s = pad(m, 2);
  
  return `${h}:${m}:${s}`;
};
