import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ToJson } from '~/common/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// * localize 템플릿 문자열 치환
export const replaceT = (template: string, params: Record<string, string>) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => params[key.trim()] ?? key);
};

// * 세자리 콤마
export const toComma = (
  value: number | string,
  maxDecimals: number | undefined = 4,
  minDecimals?: number,
) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
  });
};

// * Query string으로 변환
export const formatQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== 'undefined') searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

// * JSON fetch
export const fetchJson = async <T = any>(
  url: string,
  options?: RequestInit,
): Promise<ToJson<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const data = (await response.json()) as ToJson<T>;
    return data;
  } catch (error) {
    throw error;
  }
};

// * Timeout promise
export const withTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
  errorMessage: string = 'timeout',
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeout);
  });
  return Promise.race([promise, timeoutPromise]);
};
