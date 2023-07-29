import React, {forwardRef, useMemo} from 'react';
import RootBottomSheet from '@gorhom/bottom-sheet';
import type {
  BottomSheetHandleProps,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import tw from '../tailwind';
import Animated, {
  interpolate,
  Extrapolate,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';
import {toRad} from 'react-native-redash';

type Props = BottomSheetProps;

export default forwardRef<RootBottomSheet, Props>(function BottomSheet(
  {children, enablePanDownToClose, ...rest},
  ref,
): JSX.Element {
  return (
    <RootBottomSheet
      ref={ref}
      enablePanDownToClose={enablePanDownToClose ?? true}
      handleComponent={Handle}
      {...rest}>
      <GestureHandlerRootView style={tw`flex-1`}>
        {typeof children === 'function' ? children() : children}
      </GestureHandlerRootView>
    </RootBottomSheet>
  );
});

const transformOrigin = (
  {x, y}: {x: number; y: number},
  ...transformations
) => {
  'worklet';
  return [
    {translateX: x},
    {translateY: y},
    ...transformations,
    {translateX: x * -1},
    {translateY: y * -1},
  ];
};

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

function Handle({style, animatedIndex}: HandleProps): JSX.Element {
  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP),
  );
  //#endregion

  //#region styles
  const containerStyle = useMemo(() => [styles.header, style], [style]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedIndex.value,
      [1, 2],
      [20, 0],
      Extrapolate.CLAMP,
    );
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
    };
  });
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
    }),
    [],
  );
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(-30), 0, toRad(30)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -5,
        },
      ),
    };
  });
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
    }),
    [],
  );
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(30), 0, toRad(-30)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        {x: 0, y: indicatorTransformOriginY.value},
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 5,
        },
      ),
    };
  });
  //#endregion

  // render
  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle]}
      renderToHardwareTextureAndroid={true}>
      <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
      <Animated.View
        style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  indicator: {
    position: 'absolute',
    width: 10,
    height: 4,
    backgroundColor: '#999',
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2,
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
});
