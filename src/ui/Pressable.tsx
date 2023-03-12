import {cva, VariantProps} from 'class-variance-authority';
import React from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import tw from '../tailwind';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

interface Props extends PressableProps, VariantProps<typeof pressable> {}

const pressable = cva('', {
  variants: {
    type: {
      default: '',
      button: 'border border-gray-300 rounded-md p-4 items-center',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export default function Pressable({
  onPressIn,
  onPressOut,
  style,
  type = 'default',
  ...rest
}: Props) {
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePressIn = (e: GestureResponderEvent) => {
    opacity.value = 0.5;
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    opacity.value = 1;
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={StyleSheet.compose(
        StyleSheet.compose(style, animatedStyle),
        tw.style(pressable({type})),
      )}
      {...rest}
    />
  );
}
