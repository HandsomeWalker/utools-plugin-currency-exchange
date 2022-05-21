import iso from '@/assets/iso.json';

export const getIconClassName = function (value: string, size: number): string {
  for (const item of iso) {
    if (value === item.iso + ':CUR') {
      return `icon-${size}-${item.flag.replace(/\.png/g, '')}`;
    }
  }
  return '';
};

export const simpleDeepCopy = function <T = any>(src: T): T {
  return JSON.parse(JSON.stringify(src));
};

export const sortArrayByIndex = function <T = any>(
  arr: T[],
  oldIndex: number,
  newIndex: number,
): T[] {
  let ret = simpleDeepCopy(arr);
  const moveNode = ret[oldIndex];
  ret[oldIndex] = null;
  ret.splice(newIndex > oldIndex ? newIndex + 1 : newIndex, 0, moveNode);
  for (let i = 0; i < ret.length; i++) {
    if (ret[i] === null) {
      ret.splice(i, 1);
      break;
    }
  }
  return ret;
};
