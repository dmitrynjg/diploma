import React from 'react';
import { Head, Main } from '@react-ssr/express';

export default function () {
  return (
    <html lang='en'>
      <Head>
        <title>1</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body>
        <Main />
      </body>
    </html>
  );
}
