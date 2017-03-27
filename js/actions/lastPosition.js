
import type { Action } from './types';

export const SET_LAST_POSITION = 'SET_LAST_POSITION';

export function setLastPosition(lastPosition:Object):Action {
  return {
    type: SET_LAST_POSITION,
    payload: lastPosition,
  };
}
