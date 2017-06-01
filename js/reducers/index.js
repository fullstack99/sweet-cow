
import { combineReducers } from 'redux';

import drawer from './drawer';
import cardNavigation from './cardNavigation';
import user from './user';
import lastPosition from './lastPosition';
import shopData from './shopData';
import searchData from './searchData';
import appInfoData from './appInfoData';
import list from './list';

export default combineReducers({

  drawer,
  user,
  list,
  cardNavigation,
  lastPosition,
  shopData,
  searchData,
  appInfoData,


});
