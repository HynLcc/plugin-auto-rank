import Main from "./Main";
import enSDkJson from '@teable/common-i18n/src/locales/en/sdk.json';
import zhSDkJson from '@teable/common-i18n/src/locales/zh/sdk.json';
import { EnvProvider } from '@/components/context/EnvProvider';
import { I18nProvider } from '@/components/context/I18nProvider';
import { Metadata } from 'next';
import enCommonJson from '../locales/en.json';
import zhCommonJson from '../locales/zh.json';
import { IPageParams } from '@/components/context/types';

const resources = {
  en: { sdk: enSDkJson, common: enCommonJson },
  zh: { sdk: zhSDkJson, common: zhCommonJson },
};

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: '自动排名',
  };
}

export default async function Home(props: { searchParams: Promise<IPageParams> }) {
  const searchParams = await props.searchParams;

  // 为开发环境提供更友好的默认值，如果URL中没有指定语言，默认使用英文
  const lang = searchParams.lang || 'en';
  const theme = searchParams.theme || 'light';

  return (
    <main className="h-screen">
      <EnvProvider>
        <I18nProvider
          lang={lang}
          resources={resources}
        >
          <Main theme={theme} />
        </I18nProvider>
      </EnvProvider>
    </main>
  );
}
