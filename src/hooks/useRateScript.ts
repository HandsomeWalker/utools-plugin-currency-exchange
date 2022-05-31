import { useEffect, useState } from 'react';

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
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    async function asyncFunc() {
      setLoading(true);
      try {
        const data = await (window as any).getRateScript();
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

  return { data, loading, run: () => setToggle(!toggle) };
}

export default useRateScript;
