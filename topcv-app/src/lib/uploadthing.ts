import { generateReactNativeHelpers } from '@uploadthing/expo';

import { UPLOADTHING_URL } from '@/src/config/env';

export const { uploadFiles, useDocumentUploader } = generateReactNativeHelpers<any>({
  url: UPLOADTHING_URL,
});
