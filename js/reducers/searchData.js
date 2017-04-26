
import type { Action } from '../actions/types';
import { SET_SEARCH_DATA } from '../actions/searchData';

export type State = {
    name: string
}

const initialState = {
  name: '',
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_SEARCH_DATA) {
    return {
      ...state,
      name: action.payload,
    };
  }
  return state;
}
