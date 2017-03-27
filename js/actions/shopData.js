
import type { Action } from './types';

export const SET_SHOP_DATA = 'SET_SHOP_DATA';

export function setShopData(shopData:Object):Action {
  return {
    type: SET_SHOP_DATA,
    payload: shopData,
  };
}
