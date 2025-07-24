import { useEffect } from 'react';
import { useFetcher } from 'react-router';

// * useFetcher의 응답 데이터를 콜백으로 전달해 실행하는 래퍼 훅
export const useFetcherWithCallback = <T>(
  callback: (data: ReturnType<typeof useFetcher<T>>['data']) => void,
  key?: string,
) => {
  const fetcher = useFetcher<T>({ key });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      callback(fetcher.data);
    }
  }, [callback, fetcher]);

  return fetcher;
};
