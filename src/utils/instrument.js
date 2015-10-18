export default (fn) => {
  const startTime = +new Date;
  console.log('start time', startTime);
  const returnValue = fn();
  const endTime = +new Date;
  console.log('end time', endTime)
  console.log('Function takes ', endTime - startTime, ' ms to execute.');

  return returnValue;
};
