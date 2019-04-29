export const orderText = (left, right, direction = 'asc') => {
  const directions = {
    desc: [-1, 1],
    asc: [1, -1]
  }[direction];

  if (right < left) {
    return directions[0];
  } else if (right > left) {
    return directions[1];
  } else {
    return 0;
  }
};

export const orderArray = (sorter = orderText) => (left, right, direction = 'asc') => {
  const directions = {
    desc: [-1, 1],
    asc: [1, -1]
  }[direction];

  if (left && !right) {
    return directions[0];
  } else if (right && !left) {
    return directions[1];
  } else if (left.length > right.length) {
    return directions[0];
  } else if (right.length > left.length) {
    return directions[1];
  }

  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();

  for (let index = 0; index < leftSorted.length; ++index) {
    const result = sorter(leftSorted[index], rightSorted[index], direction);

    if (result) {
      return result;
    }
  }

  return 0;
};

export const orderProperty = (property, sorter = orderText) => (left, right, direction = 'asc') =>
  sorter(left[property], right[property], direction);

export const stableSort = (array, order) => {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((left, right) => {
    const result = order(left[0], right[0]);

    return result === 0 ? left[1] - right[1] : result;
  });

  return stabilizedThis.map(([element]) => element);
};
