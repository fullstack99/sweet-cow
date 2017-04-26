
import type { Action } from './types';

export const SET_SEARCH_DATA = 'SET_SEARCH_DATA';

export function setSearchData(searchData:Object):Action {
  return {
    type: SET_SEARCH_DATA,
    payload: searchData,
  };
}
