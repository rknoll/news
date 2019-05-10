import { useState, useEffect, useCallback } from 'react';

export default (callback = () => {}, ms = 300) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    if (!startLongPress) return;
    const timerId = setTimeout(callback, ms);
    return () => clearTimeout(timerId);
  }, [startLongPress]);

  const start = useCallback(() => setStartLongPress(true), []);
  const stop = useCallback(() => setStartLongPress(false), []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onTouchStart: start,
    onMouseLeave: stop,
    onTouchEnd: stop,
  };
};
