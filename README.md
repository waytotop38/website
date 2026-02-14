# React Router Starter

[tailwindcss](https://tailwindcss.com/)(버전4)와 [shadcn/ui](https://ui.shadcn.com/)가 적용된 [React Router](https://reactrouter.com/)(버전7)스타터 탬플릿입니다.
라이트&다크 테마 변경과 다국어 현지화 언어셋을 사용할 수 있습니다.
[Ajv](https://ajv.js.org/)가 포함되어 있으므로 데이터 구조의 유효성 검사는 [JSON schema](https://json-schema.org/) 형식을 사용하는 것을 권장합니다.

## 설치

로컬에 20버전 이상의 node.js가 설치되어 있어야합니다.
패키지 매니저는 yarn 4.7.0 버전을 사용합니다.

패키지 설치하자

```bash
yarn
```

환경변수를 설정합니다. 아래 커맨드로 .env.example을 복사하여 .env 파일을 복사하여 만들어 줍니다.

```bash
cp .env.example .env
```

.env를 로컬 개발 환경에 맞게 수정해줍니다.

## 실행 및 배포

### 개발 환경 실행

```bash
yarn dev
```

### 배포 전 빌드

```bash
yarn build
```

### 배포 앱 실행

```bash
yarn start
```

(`yarn build`후에 `yarn start`로 실행하게 되면 더 이상 .env 파일의 환경 변수는 참조되지 않습니다)

## 구조

```plaintext
├── .vscode
│   └── settings.json       # VS Code 설정 파일 (저장시 eslint와 prettier 포맷팅)
├── .yarn
│   ├── install-state.gz    # 설치 패키지 상태 파일
│   └── releases            # Yarn 파일
├── app                     # 리액트라우터 App 폴더
│   ├── .server             # Vite 서버사이드 전용 폴더
│   │   ├── controllers     # Request&Response 컨트롤러
│   │   ├── lib             # 유틸리티 (서버 사이드에서만 사용)
│   │   ├── locales         # 다국어 언어셋 폴더
│   │   │   ├── en          # 영어 네임스페이스 언어셋
│   │   │   ├── ko          # 한국어 네임스페이스 언어셋
│   │   │   └── types.d.ts  # 언어 JSON 파일 타입 정의
│   │   ├── schemas         # 요청 파라미터 유효성 검증 JSON Schema
│   │   └── services        # 서비스 로직
│   ├── common              # 공통
│   │   ├── constants.ts    # 공통 상수
│   │   └── types.d.ts      # 공통 타입
│   ├── components          # 컴포넌트
│   │   ├── svg             # svg 파일 폴더 (SVGR로 리액트 컴포넌트로 사용)
│   │   └── ui              # shadcn/ui 컴포넌트 폴더
│   ├── hooks               # 커스텀 훅
│   ├── lib                 # 유틸리티
│   ├── routes              # 경로 폴더
│   │   ├── apis            # API 경로 폴더
│   │   └── pages           # 리액트 페이지 경로 폴더
│   ├── app.css             # tailwindcss 및 shadcn/ui 스타일 설정
│   ├── root.tsx            # 리액트라우터 Root 파일
│   └── routes.ts           # 경로 설정 파일
├── public
│   └── favicon.ico         # 파비콘
├── .env.example            # 환경변수 예제
├── .eslintignore           # ES Lint 제외 파일
├── .eslintrc.cjs           # ES Lint 설정 파일
├── .gitignore              # Git 제외 파일
├── .prettierignore         # Prettier 제외 파일
├── .prettierrc.cjs         # Prettier 설정 파일
├── .yarnrc.yml             # Yarn 설정 파일
├── components.json         # shadcn/ui 설정 파일
├── package.json            # node.js 패키지 설정 파일
├── react-router.config.ts  # 리액트라우터 설정 파일
├── README.md               # README 파일
├── tsconfig.json           # 타입스크립트 설정
├── vite.config.ts          # Vite 설정
└── yarn.lock
```

## 가이드

### SVGR

[vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr#readme)이 적용되어 있으므로 svg 파일은 아래 코드처럼 img 태그가 아닌 리액트 컴포넌트로 임포트하여 사용할 수 있습니다. 파일 경로 뒤에 `?react`를 붙여서 임포트해야 합니다.

```tsx
import Logo from '~/components/svg/logo.svg?react';

export default function SomePage() {
  return (
    <div>
      <Logo />
    </div>
  );
}
```

### Hooks

#### useTheme

현재 테마의 확인과 테마를 변경할 수 있는 훅입니다.

```typescript
import { useTheme } from '~/hooks/use-theme';

const [theme, setTheme] = useTheme();
```

`theme`의 기본 값은 시스템 테마를 따라갑니다. `setTheme()`로 테마를 변경하면 세션에 영구 저장되어 다음 접속때에도 동일한 테마가 유지됩니다.

#### useLanguage

현재 언어 코드를 확인하고 변경할 수 있는 훅입니다.

```typescript
import { useLanguage } from '~/hooks/use-language';

const [language, setLanguage] = useLanguage();
```

`language`로 현재 적용된 언어 코드를 확인할 수 있습니다. 언어 변경은 `setLanguage('en')`처럼 변경할 언어 코드를 `setLanguage`함수의 인자로 사용하면 됩니다. 테마와 마찬가지로 세션에 영구 저장되므로 다음 접속 때도 동일한 언어 설정이 유지됩니다.

#### useFetcherWithCallback

리액트라우터의 `useFetcher`를 래핑한 훅입니다. `useFetcherWithCallback`을 사용하면 응답 처리에 대한 추가 코드 없이 응답이 완료된 경우에 즉시 실행할 콜백 함수를 인자로 전달하여 처리하도록 할 수 있습니다.

```tsx
import { useFetcherWithCallback } from '~/hooks/use-fetcher-callback';

export default function SomeComponent() {
  const fetcher = useFetcherWithCallback((data) => console.log(data));
  // ...
}
```

`useFetcherWithCallback`의 응답 데이터 타입 적용은 useFetcher에서 제네릭으로 주입하는 것과 동일합니다.

```tsx
import { useFetcherWithCallback } from '~/hooks/use-fetcher-callback';

export const action = async ({ params }) => {
  const user = { name: params.name };
  return toJson({ user });
};

export default function Page() {
  const fetcher = useFetcherWithCallback<typeof action>(
    (data) => console.log(data), // { user: { name: string; } }
  );
  // ...
}
```

### 유효성 검사

유효성 검사는 [JSON schema](https://json-schema.org/) 형식과 [Ajv](https://ajv.js.org/)를 사용하면 하나의 JSON 스키마로 유효성 검사와 타입 추론이 모두 가능합니다. 작성된 JSON 스키마는 [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts)의 `FromSchema`를 사용하면 JSON 스키마의 검증 타입으로 추론됩니다. `/app/.server/schemas/` 경로에 아래 코드처럼 JSON 스키마와 타입 선언 파일을 생성해 사용합니다. `FromSchema`의 사용은 제네릭에 정의한 JSON 스키마를 `typeof`로 타입 적용하면 됩니다.

```typescript
export const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 6,
      maxLength: 50,
      description: '이메일',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$',
      description: '비밀번호',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;

export type Login = FromSchema<typeof loginSchema>;
// Login { email: string; password: string; }
```

`/app/.server/lib/utils.ts`의 `validate`, `validateFormData`과 같은 유틸리티 함수를 사용하면 `action`과 같은 서버 작업에서 파라미터 유효성 검사를 보다 간편하게 처리할 수 있습니다. `validateFormData`는 요청 받은 FormData를 JSON 스키마로 검증하고 검증에 성공할 경우 FormData를 객체로 변환하여 반환합니다. 검증에 실패한 경우는 `AjvInvalidException` 에러로 예외 처리됩니다.

```tsx
import { validateFormData } from '~/.server/lib/utils';
import { Login, loginSchema } from '~/.server/schemas/user';

export const action = async ({ request }) => {
  const { email, password } = await validateFormData<Login>(request, loginSchema);
  // ...
};
```

ajv의 기본 에러 메세지 템플릿을 사용하지 않고 에러 케이스 별로 메세지를 따로 반환하도록 할 수 있습니다. JSON 스키마 `errorMessage`필드에 각 조건 별 검증 에러메세지를 추가하면 됩니다.

```typescript
export const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 6,
      maxLength: 50,
      description: '이메일',
      errorMessage: {
        format: '이메일 형식이 올바르지 않습니다',
        minLength: '이메일은 최소 6자 이상이어야 합니다',
        maxLength: '이메일은 최대 50자 이하여야 합니다',
      },
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$',
      description: '비밀번호',
      errorMessage: {
        minLength: '비밀번호는 최소 8자 이상이어야 합니다',
        maxLength: '비밀번호는 최대 20자 이하여야 합니다',
        pattern: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
      },
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;
```

`/app/.server/lib/utils.ts`의 `control` 함수를 사용하면 loader와 action 서버 처리 중 발생하는 에러를 `{ message: string; path: string; }` 형식의 일관된 json 데이터로 응답하도록 할 수 있습니다. 아래 코드처럼 `control` 함수로 action에 대한 처리 함수를 래핑하면 `message`와 `path` 값은 처리 중 에러가 발생할 때에 응답 데이터로 반환됩니다. `path` 값 비교로 어느 경로에서 발생한 에러인지 구분할 수 있습니다. `control` 함수는 `/app/.server/lib/exception.ts`의 커스텀 에러 예외들을 포함한 모든 에러를 `{ message: string; path: string; }` 구조의 json 형식으로 반환하도록 합니다.

```tsx
import { control } from '~/.server/lib/utils';

const loginAction = async ({ request }: ActionFunctionArgs) => {
  const { email, password } = await validateFormData<Login>(request, loginSchema);
  // ...
};

export const action = async (args: ActionFunctionArgs) => {
  return control(loginAction, args);
};

export default function SomePage({ actionData }: Route.ComponentProps) {
  const data = useActionData<typeof action>();

  return (
    <Form>
      <input name="email" type="email" />
      {data?.path === 'email' && data?.message && <p>{data.message}</p>}
      <input name="password" type="password" />
      {data?.path === 'password' && data?.message && <p>{data.message}</p>}
      <button type="submit">로그인</button>
    </Form>
  );
}
```

ajv 반환 에러 메세지에 다국어를 지원하려면 `errorMessage`의 에러 메세지는 키 값으로 사용하고 json 언어셋 파일에 키 값 별로 언어별 에러 메세지를 추가하면 됩니다.

```typescript
export const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 6,
      maxLength: 50,
      description: '이메일',
      errorMessage: {
        format: 'emailFormatError',
        minLength: 'emailMinLengthError',
        maxLength: 'emailMaxLengthError',
      },
    },
    // ...
  },
  // ...
} as const;
```

```json
{
  "login": "로그인",
  "emailFormatError": "이메일 형식이 올바르지 않습니다",
  "emailMinLengthError": "이메일은 최소 6자 이상이어야 합니다",
  "emailMaxLengthError": "이메일은 최대 50자 이하여야 합니다"
}
```

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await localize<LoginJson>(request, 'login');
  return { t };
};

export const action = async (args: ActionFunctionArgs) => {
  return control(loginAction, args);
};

export default function SomePage({ loaderData, actionData }: Route.ComponentProps) {
  const { t } = loaderData;
  return (
    <Form>
      <input name="email" type="email" />
      {actionData?.path === 'email' && actionData?.message && (
        <p>{t[actionData.message]}</p>
      )}
      <input name="password" type="password" />
      {actionData?.path === 'password' && actionData?.message && (
        <p>{t[actionData.message]}</p>
      )}
      <button type="submit">{t.login}</button>
    </Form>
  );
}
```

`localize` 함수를 사용한 다국어 현지화 번역 텍스트 적용에 대한 설명은 아래 [다국어 현지화](#다국어-현지화) 내용을 참고하세요.

### 다국어 현지화

i18n 관련 라이브러리를 사용하지 않지만, 본 프로젝트에서는 리액트라우터 프레임워크의 SSR 형태에 맞게 다국어 옵션을 사용할 수 있습니다. i18n을 사용하는 것과 유사하지만 번역 텍스트가 서버사이드에서 먼저 렌더링되는 차이점이 있습니다.

#### localize

언어별 텍스트 정의는 `/app/.server/locales/{languageCode}/` 경로에 JSON 파일로 저장하면 됩니다. 영어는 `/app/.server/locales/en/`, 한국어는 `/app/.server/locales/ko/` 아래에 JSON 파일을 저장하는 식입니다. `common.json`은 공통 언어 파일로 기본 네임스페이스가 되고 다른 네임스페이스에 언어 정의를 상속합니다. 이외 파일들은 각 파일 명으로 네임스페이스가 지정됩니다. 예를 들어 `welcome.json`파일은 네임스페이스가 `welcome`이 되므로 welcome 언어셋을 가져오려면 리믹스 `loader` 구문에서 아래 코드처럼 가져옵니다.

```typescript
import { localize } from '~/.server/lib/localization';
import { WelcomeJson } from '~/.server/locales/types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await localize<WelcomeJson>(request, 'welcome');
  return { t };
};
```

`localize()` 함수를 사용할 때, 위 코드처럼 `/app/.server/locales/types.d.ts` 파일에 정의된 타입을 제네릭으로 주입하여 사용하는 언어셋 `t`의 타입 추론을 할 수 있습니다. JSON 언어 파일을 생성할 때 `types.d.ts`에 타입 정의도 함께 해주면 됩니다.

```json
{
  "welcome": "React Router에 오신 것을 환영합니다!"
}
```

```typescript
// /app/locales/types.d.ts
export type WelcomeJson = typeof import('../locales/en/welcome.json');
```

화면에 언어 텍스트 적용 아래 코드처럼 `t`를 `useLoaderData` 훅으로 가져와서 사용합니다.

```tsx
// /app/.server/locales/en/welcome.json = { "welcome": "Welcome to React Router!" }
// /app/.server/locales/ko/welcome.json = { "welcome": "React Router에 오신 것을 환영합니다!" }

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await localize<WelcomeJson>(request, 'welcome');
  return { t };
};

export default function Index() {
  const { t } = useLoaderDate<typeof loader>();

  return <p>{t.welcome}</p>;
  // 언어가 en인 경우 <p>Welcome to React Router!</p>
  // 언어가 ko인 경우 <p>React Router에 오신 것을 환영합니다!</p>
}
```

언어를 추가해야 하는 경우 `/app/common/constants.ts` 상수 파일의 `LANGUAGES` 배열에 언어 코드를 추가합니다. 기본 언어 코드는 `DEFAULT_LANGUAGE` 값으로 설정합니다.

#### 동적 번역 텍스트

번역 텍스트에 파라미터를 추가해서 번역 텍스트를 동적으로 처리할 수 있습니다. 동적 번역 텍스트는 아래 json 코드처럼 중첩 중괄호(`{{}}`)로 감싼 파라미터를 먼저 추가해야 합니다.

```json
{
  "invalid": "{{value}} is not a valid {{path}}"
}
```

이후에 `replaceT` 유틸리티 함수의 첫번째 인자에는 템플릿 텍스트, 두번째 인자에는 파라미터 객체를 전달해 처리하면 `{{}}`로 감싸진 파라미터 텍스트는 전달된 객체의 매치되는 값으로 대체되게 됩니다.

```typescript
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (id !== 'someId') {
    const t = await localize<ErrorJson>(request, 'error');
    throw new InvalidException(replaceT(t.invalid, { path: t.word.id, value: id }));
  }
  // ...
};
```
