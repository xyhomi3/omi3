import fr from '../messages/fr.json';

type Messages = typeof fr;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
