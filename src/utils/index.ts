import iso from '@/assets/iso.json';
import { Modal, ModalFuncProps } from 'antd';
import { ModalFunc, ModalStaticFunctions } from 'antd/lib/modal/confirm';

interface FnDialogProps extends ModalStaticFunctions {
  open: ModalFunc;
}

export const getIconClassName = function (value: string, size: number): string {
  for (const item of iso) {
    if (value === item.iso + ':CUR' || value === item.iso) {
      const flag = item.flag.replace(/\.png/g, '');
      return `icon-${size}-${flag === 'tw' ? 'cn' : flag}`;
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

export const FnDialog: FnDialogProps = new Proxy(Modal.prototype.constructor, {
  get(target, key) {
    if (key === 'open') {
      return (props: ModalFuncProps) =>
        target.info({
          getContainer: document.querySelector('#modal'),
          closable: true,
          maskClosable: true,
          centered: true,
          ...props,
        });
    }
    return (props: ModalFuncProps) =>
      target[key]({
        closable: true,
        maskClosable: true,
        centered: true,
        ...props,
      });
  },
});
