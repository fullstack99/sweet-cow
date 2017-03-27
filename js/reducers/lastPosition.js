import type { Action } from '../actions/types';
import { SET_LAST_POSITION } from '../actions/lastPosition';

export type State = {
    name: string
}

const initialState = {
  name: '',
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_LAST_POSITION) {
    return {
      ...state,
      name: action.payload,
    };
  }
  return state;
}
