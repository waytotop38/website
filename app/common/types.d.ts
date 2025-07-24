// * 서버 예외 반환 타입
export interface ServerException {
  message?: string; // 에러 메시지
  path?: string; // 에러 발생 경로
  details?: any; // 추가 세부 정보
}

// * JSON 직렬화 타입 추론
// NOTE: Serializable하지 않은 타입은 loader와 action 함수에서 반환 시 타입 유실 발생하므로,
// NOTE: 타입 유실 방지를 위해 toJson 함수로 JSON 직렬화 반환하는 경우 사용
export type ToJson<T> = T extends string | number | boolean | null
  ? T // 기본 타입은 그대로 반환
  : T extends undefined
    ? never // undefined는 반환하지 않음
    : T extends (...args: any[]) => any
      ? never // 함수는 반환하지 않음
      : T extends bigint
        ? never // bigint은 반환하지 않음
        : T extends symbol
          ? never // symbol은 반환하지 않음
          : T extends Promise<infer U>
            ? Promise<ToJson<U>> // Promise의 반환 타입에 ToJson 적용
            : T extends ArrayBuffer | ArrayBufferView
              ? never // ArrayBuffer와 TypedArray는 직렬화되지 않음
              : T extends Set<any>
                ? never // Set은 직렬화되지 않음
                : T extends Map<any, any>
                  ? never // Map은 직렬화되지 않음
                  : T extends Date
                    ? string // Date는 ISO 문자열로 변환
                    : T extends Array<infer U>
                      ? Array<ToJson<U>> // 배열은 재귀적으로 변환
                      : { [K in keyof T]: ToJson<T[K]> };

// * React Router 유틸리티 타입
// NOTE: React Router 프레임워크 내부에서 사용되는 타입들로, 참고 및 필요시 외부에서 사용하기 위해 재작성
export type Serializable =
  | undefined
  | null
  | boolean
  | string
  | symbol
  | number
  | Array<Serializable>
  | {
      [key: PropertyKey]: Serializable;
    }
  | bigint
  | Date
  | URL
  | RegExp
  | Error
  | Map<Serializable, Serializable>
  | Set<Serializable>
  | Promise<Serializable>;
export type unstable_SerializesTo<T> = {
  unstable__ReactRouter_SerializesTo: [T];
};
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type Func = (...args: any[]) => unknown;
export type Pretty<T> = {
  [K in keyof T]: T[K];
} & object;
export type Serialize<T> =
  T extends unstable_SerializesTo<infer To>
    ? To
    : T extends Serializable
      ? T
      : T extends (...args: any[]) => unknown
        ? undefined
        : T extends Promise<infer U>
          ? Promise<Serialize<U>>
          : T extends Map<infer K, infer V>
            ? Map<Serialize<K>, Serialize<V>>
            : T extends Set<infer U>
              ? Set<Serialize<U>>
              : T extends []
                ? []
                : T extends readonly [infer F, ...infer R]
                  ? [Serialize<F>, ...Serialize<R>]
                  : T extends Array<infer U>
                    ? Array<Serialize<U>>
                    : T extends readonly unknown[]
                      ? readonly Serialize<T[number]>[]
                      : T extends Record<any, any>
                        ? {
                            [K in keyof T]: Serialize<T[K]>;
                          }
                        : undefined;
export type VoidToUndefined<T> = Equal<T, void> extends true ? undefined : T;
export type DataFrom<T> =
  IsAny<T> extends true
    ? undefined
    : T extends Func
      ? VoidToUndefined<Awaited<ReturnType<T>>>
      : undefined;
export type ClientData<T> = T extends Response
  ? never
  : T extends DataWithResponseInit<infer U>
    ? U
    : T;
export type ServerData<T> = T extends Response
  ? never
  : T extends DataWithResponseInit<infer U>
    ? Serialize<U>
    : Serialize<T>;
export type ServerDataFrom<T> = ServerData<DataFrom<T>>;
export type ClientDataFrom<T> = ClientData<DataFrom<T>>;
export type SerializeFrom<T> = T extends (...args: infer Args) => unknown
  ? Args extends [ClientLoaderFunctionArgs | ClientActionFunctionArgs]
    ? ClientDataFrom<T>
    : ServerDataFrom<T>
  : T;
