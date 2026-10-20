import { useTheme } from '../theme';
import {
  WasilNewHeartfilledBTSVG,
  WasilNewBTTasbihHeartUnFilled,
  WasilNewBTShareSVG,
  HeartfilledSVG,
  DuaHeartUnfillSVG,
  DuaShareSVG,
} from '../assets/icons';

// Icons that exist in a dark-theme and a light-theme variant.
const ICONS = {
  dark: { HeartFilled: WasilNewHeartfilledBTSVG, HeartOutline: WasilNewBTTasbihHeartUnFilled, Share: WasilNewBTShareSVG },
  light: { HeartFilled: HeartfilledSVG, HeartOutline: DuaHeartUnfillSVG, Share: DuaShareSVG },
};

export default function useThemeIcons() {
  const { theme } = useTheme();
  return theme === 'white' ? ICONS.light : ICONS.dark;
}
