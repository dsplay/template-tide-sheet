import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useConfig } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';

const MIN_LOADING_DURATION = 2000;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Gidolinya Regular',
];

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();

  const [lng] = (locale || 'en').split('_');
  i18n.changeLanguage(lng);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        fonts={fonts}
        minDuration={MIN_LOADING_DURATION}
        tasks={tasks}
      >
        <div className={`app fade-in ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
