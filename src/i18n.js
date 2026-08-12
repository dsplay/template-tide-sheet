import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          'Tide Chart': 'Tide Chart',
          'Loading...': 'Loading...',
          'Error fetching data': 'Error fetching data',
          Meters: 'Meters',
          'UV Index now': 'UV Index now',
          'Wind velocity': 'Wind velocity',
          'Wind direction': 'Wind direction',
        },
      },
      pt: {
        translations: {
          'Tide Chart': 'Tábua de Marés',
          'Loading...': 'Carregando...',
          'Error fetching data': 'Erro ao buscar dados',
          Meters: 'Metros',
          'UV Index now': 'Índice UV agora',
          'Wind velocity': 'Velocidade do vento',
          'Wind direction': 'Direção do vento',
        },
      },
      es: {
        translations: {
          'Tide Chart': 'Tabla de Mareas',
          'Loading...': 'Cargando...',
          'Error fetching data': 'Error al obtener datos',
          Meters: 'Metros',
          'UV Index now': 'Índice UV ahora',
          'Wind velocity': 'Velocidad del viento',
          'Wind direction': 'Dirección del viento',
        },
      },
      it: {
        translations: {
          'Tide Chart': 'Tabella delle Maree',
          'Loading...': 'Caricamento...',
          'Error fetching data': 'Errore nel recupero dei dati',
          Meters: 'Metri',
          'UV Index now': 'Indice UV attuale',
          'Wind velocity': 'Velocità del vento',
          'Wind direction': 'Direzione del vento',
        },
      },
      de: {
        translations: {
          'Tide Chart': 'Gezeitentafel',
          'Loading...': 'Wird geladen...',
          'Error fetching data': 'Fehler beim Abrufen der Daten',
          Meters: 'Meter',
          'UV Index now': 'UV-Index jetzt',
          'Wind velocity': 'Windgeschwindigkeit',
          'Wind direction': 'Windrichtung',
        },
      },
      nl: {
        translations: {
          'Tide Chart': 'Getijdentabel',
          'Loading...': 'Laden...',
          'Error fetching data': 'Fout bij het ophalen van gegevens',
          Meters: 'Meter',
          'UV Index now': 'UV-index nu',
          'Wind velocity': 'Windsnelheid',
          'Wind direction': 'Windrichting',
        },
      },
    },
    fallbackLng: {
      default: ['en'],
    },
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
