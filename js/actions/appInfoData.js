
import type { Action } from './types';

export const SET_APP_INFO_DATA = 'SET_APP_INFO_DATA';

export function setAppInfoData(appInfoData:Object):Action {
  return {
    type: SET_APP_INFO_DATA,
    payload: appInfoData,
  };
}
