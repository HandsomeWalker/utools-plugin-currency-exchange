import { useEffect, useState } from 'react';
import { getRateScript } from '@/request';

interface UseRateScriptProps {
  onSuccess?: (price: any) => void;
  onError?: (err: any) => void;
  refreshDeps?: any[];
}
interface UseRateScriptReturnProps {
  data: any;
  loading: boolean;
  run: () => void;
}

function useRateScript(config: UseRateScriptProps): UseRateScriptReturnProps {
  const { onSuccess, onError, refreshDeps = [] } = config;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();
  const [toggle, setToggle] = useState<any>(Date.now());

  useEffect(() => {
    async function asyncFunc() {
      setLoading(true);
      try {
        const data = await getRateScript();
        eval(data);
        const price = (window as any).prize;
        onSuccess && onSuccess(price);
        setData(price);
      } catch (e) {
        onError && onError(e);
      }
      setLoading(false);
    }
    asyncFunc();
  }, [...refreshDeps, toggle]);

  return { data, loading, run: () => setToggle(Date.now()) };
}

export default useRateScript;
