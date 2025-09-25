import 'dotenv/config';

import {
  environment,
  port,
  corsUrl,
  tokenInfo,
  email,
} from '../config/envVar';
import { EMOJIS } from '../constants/emojis';

export const checkAllEnsAreNotEmpty = () => {
  const envs = [
    environment,
    port,
    corsUrl,
    tokenInfo.issuer,
    tokenInfo.audience,
  ];
  envs.forEach((env) => {
    if (!env) {
      console.error(`\n${EMOJIS.PROHIBITED}\tOne of the environment variables is not set! \n`);
      process.exit(0);
    }
  });
  console.info(`\n${EMOJIS.SUCCESS}\tAll environment variables are set! \n`);
};

checkAllEnsAreNotEmpty();
