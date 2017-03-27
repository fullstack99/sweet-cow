
import type { Action } from '../actions/types';
import { SET_SHOP_DATA } from '../actions/shopData';

export type State = {
    name: string
}

const initialState = {
  name: '',
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_SHOP_DATA) {
    return {
      ...state,
      name: action.payload,
    };
  }
  return state;
}
