const removeReminder = (intervals, authorId) => {
  const interval = intervals[authorId];
  if (interval) {
    clearInterval(interval);
    delete intervals[authorId];
    return true;
  } else {
    return false;
  }
};

module.exports = {
  removeReminder,
};
