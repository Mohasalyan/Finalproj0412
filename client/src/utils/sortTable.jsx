export const sortTable = (data = [], order = "asc", orderBy = "id") => {
  const property = orderBy.split(".");
  const len = property.length;
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    let i = 0;
    while (i < len) {
      a = a[property[i]];
      b = b[property[i]];
      i++;
    }
    if (a > b) {
      return order === "asc" ? 1 : -1;
    } else if (a < b) {
      return order === "asc" ? -1 : 1;
    }
    return 0;
  });

  return sortedData; 
};
