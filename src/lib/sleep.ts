export const sleep = (seconds: number) => {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(true);
    }, seconds * 1000);
  });
};
