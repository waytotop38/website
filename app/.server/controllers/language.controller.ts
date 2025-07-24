import type { ActionFunctionArgs } from 'react-router';

import { type UpdateLanguage, updateLanguageSchema } from '~/.server/schemas/language';
import { isLanguage } from '~/hooks/use-language';
import { replaceT } from '~/lib/utils';

import { InvalidException, MethodNotAllowedException } from '../lib/exceptions';
import { localizedError } from '../lib/localization';
import { toJson, validateFormData } from '../lib/utils';
import { getLanguageSession } from '../services/session.service';

export const languageAction = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const payload = await validateFormData<UpdateLanguage>(
        request,
        updateLanguageSchema,
      );
      if (!isLanguage(payload.language)) {
        const t = await localizedError(request);
        throw new InvalidException(
          replaceT(t.invalid, { path: t.word.language, value: payload.language }),
        );
      }
      const languageSession = await getLanguageSession(request);
      languageSession.setLanguage(payload.language);
      return toJson(
        { language: payload.language },
        { headers: { 'Set-Cookie': await languageSession.commit() } },
      );
    }

    default: {
      throw new MethodNotAllowedException();
    }
  }
};
