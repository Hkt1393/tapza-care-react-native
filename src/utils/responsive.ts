import { Dimensions, useWindowDimensions } from 'react-native';

const baseWidth = 375;
const baseHeight = 812;

export const scale = (value: number, width = Dimensions.get('window').width): number =>
  (value * width) / baseWidth;

export const verticalScale = (value: number, height = Dimensions.get('window').height): number =>
  (value * height) / baseHeight;

export const moderateScale = (value: number, factor = 0.5, width = Dimensions.get('window').width): number =>
  value + (scale(value, width) - value) * factor;

export const responsiveWidth = (value: number, width = Dimensions.get('window').width): number =>
  (width / baseWidth) * value;

export const responsiveHeight = (value: number, height = Dimensions.get('window').height): number =>
  (height / baseHeight) * value;

export const useResponsiveLayout = () => {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    scale: (value: number) => scale(value, width),
    verticalScale: (value: number) => verticalScale(value, height),
    moderateScale: (value: number, factor = 0.5) => moderateScale(value, factor, width),
    responsiveWidth: (value: number) => responsiveWidth(value, width),
    responsiveHeight: (value: number) => responsiveHeight(value, height),
  };
};
