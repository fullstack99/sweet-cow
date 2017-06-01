
import type { Action } from '../actions/types';
import { SET_APP_INFO_DATA } from '../actions/appInfoData';

export type State = {
    name: string
}

const initialState = {
  name: '',
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_APP_INFO_DATA) {
    return {
      ...state,
      name: action.payload,
    };
  }
  return state;
}
