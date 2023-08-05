import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import React, { forwardRef, useCallback, createContext, useContext } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { View, Pressable as RootPressable, StyleSheet } from 'react-native';
import type { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import tw from '../tailwind';
import Pressable from './Pressable';

type RefHandle = BottomSheetModal;

interface Props {
  children: ReactNode;
}

const SNAP_POINTS = ['CONTENT_HEIGHT'];

const ActionSheet = forwardRef<RefHandle, Props>(function ActionSheet(
  { children },
  ref,
): JSX.Element {
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(SNAP_POINTS);

  const backdropComponent = useCallback(() => {
    return (
      <RootPressable
        onPress={() => {
          if (ref.current) {
            ref.current?.close();
          }
        }}
        style={tw`absolute inset-0 bg-gray-700/25`}
      />
    );
  }, [ref]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={false}
      enableOverDrag={false}
      backdropComponent={backdropComponent}
      backgroundComponent={BackgroundComponent}
      handleComponent={null}>
      <BottomSheetView onLayout={handleContentLayout}>
        <ActionSheetContext.Provider value={{ ref }}>
          {children}
        </ActionSheetContext.Provider>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function BackgroundComponent({ style }: BottomSheetBackgroundProps) {
  return <View style={StyleSheet.compose(tw`bg-white`, style)} />;
}

function Item({
  children,
  onPress,
  ...rest
}: ComponentProps<typeof Pressable>): JSX.Element {
  const context = useActionSheetContext();

  const onPressWrapper = (e: GestureResponderEvent) => {
    if (context.ref.current) {
      context.ref.current?.close();
    }
    if (onPress) {
      onPress(e);
    }
  };
  return (
    <Pressable style={tw`px-4 py-2`} onPress={onPressWrapper} {...rest}>
      {children}
    </Pressable>
  );
}

interface ActionSheetContext {
  ref: ForwardedRef<BottomSheetModal>;
}

const ActionSheetContext = createContext<ActionSheetContext | null>(null);

function useActionSheetContext() {
  const context = useContext(ActionSheetContext);
  console.log({ context });
  if (!context) {
    throw new Error('useActionSheetContext must be used within an ActionSheet');
  }
  return context;
}

export default Object.assign(ActionSheet, { Item });
