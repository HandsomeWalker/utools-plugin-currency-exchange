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
