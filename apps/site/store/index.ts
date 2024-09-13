import * as audioActions from './audio/actions';
import * as audioAtoms from './audio/atoms';

export const audio = {
  ...audioAtoms,
  ...audioActions,
};
