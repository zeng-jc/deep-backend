import { configLoader } from '@app/common/configLoader';

export const { emailConfig, emailFrom } = configLoader<{ emailConfig: object; emailFrom: string }>('email');
