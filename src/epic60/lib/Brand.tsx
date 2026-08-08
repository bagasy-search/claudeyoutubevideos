import React, {createContext, useContext} from 'react';

export type Brand = {channelName: string; avatarName: string; accent: string};
export const BrandContext = createContext<Brand>({
  channelName: 'TU CANAL',
  avatarName: 'TUX',
  accent: '#ffd60a',
});
export const useBrand = () => useContext(BrandContext);
