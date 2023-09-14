/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { useQuery } from 'react-query';
import { VersionObject } from '../utils/types';
import { getReleaseInfo } from '../apis/misc.api';
import { useTheme } from '@mui/system';
import { useEffect, useState } from 'react';

export const useGetVersionNumber = () => {
  return useQuery<VersionObject, Error>(['version'], async () => {
    const { data } = await getReleaseInfo();
    return data;
  });
};

export enum Breakpoint {
  MOBILE = 1,
  TABLET = 2,
  DESKTOP_SMALL = 3,
  DESKTOP_LARGE = 4
}

export const useCurrentBreakpoint = (): Breakpoint => {
  const {
    breakpoints: { values: breakpointValues }
  } = useTheme();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  window.addEventListener('resize', () => setScreenWidth(window.innerWidth));

  if (screenWidth < breakpointValues.sm) {
    return Breakpoint.MOBILE;
  } else if (screenWidth < breakpointValues.md) {
    return Breakpoint.TABLET;
  } else if (screenWidth < breakpointValues.lg) {
    return Breakpoint.DESKTOP_SMALL;
  } else {
    return Breakpoint.DESKTOP_LARGE;
  }
};
