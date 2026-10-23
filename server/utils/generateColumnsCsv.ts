const prefixColumn = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const generateColumnsCsv = (num: number) => {
    if(num === 0)return 'A'
    const index = []
    const prefixLen = prefixColumn.length
    const res = []
    while(num){
        index.push(num%prefixLen)
        num = Math.floor(num/prefixLen)
    }
    for(let i = index.length-1; i >= 0; --i){
        res.push(prefixColumn[index[i]])
    }
    return res.join('')
};
