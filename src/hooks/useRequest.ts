import { useEffect, useState } from 'react';

interface UseRequestProps<T> {
  onSuccess?: (price: any) => void;
  onError?: (err: any) => void;
  refreshDeps?: any[];
  formatResult?: (res: T) => any;
}
interface UseRequestReturnProps {
  data: any;
  loading: boolean;
  run: () => void;
}

function useRequest<T = any>(
  pms: (...args: any) => Promise<T>,
  config: UseRequestProps<T> = {},
): UseRequestReturnProps {
  const { onSuccess, onError, refreshDeps = [], formatResult } = config;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [toggle, setToggle] = useState<any>(Date.now());

  useEffect(() => {
    async function asyncFunc() {
      setLoading(true);
      try {
        let data = await pms();
        formatResult && (data = formatResult(data));
        onSuccess && onSuccess(data);
        setData(data);
      } catch (e) {
        onError && onError(e);
      }
      setLoading(false);
    }
    asyncFunc();
  }, [...refreshDeps, toggle]);

  return { data, loading, run: () => setToggle(Date.now()) };
}

export default useRequest;
