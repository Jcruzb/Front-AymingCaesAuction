// src/Components/TimeRemainingCell.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const TimeRemainingCell = ({ createdAt, durationDays }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const creationDate = dayjs(createdAt);
      const endDate = creationDate.add(durationDays, 'day');
      const now = dayjs();
      const diff = endDate.diff(now);
      if (diff <= 0) {
        setTimeRemaining('Subasta finalizada');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, durationDays]);

  return <span>{timeRemaining}</span>;
};

export default TimeRemainingCell;