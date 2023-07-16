import React, {forwardRef} from 'react';
import RootBottomSheet from '@gorhom/bottom-sheet';
import type {BottomSheetProps} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import tw from '../tailwind';

type Props = BottomSheetProps;

export default forwardRef<RootBottomSheet, Props>(function BottomSheet(
  {children, enablePanDownToClose, ...rest},
  ref,
): JSX.Element {
  return (
    <RootBottomSheet
      ref={ref}
      enablePanDownToClose={enablePanDownToClose ?? true}
      {...rest}>
      <GestureHandlerRootView style={tw`flex-1`}>
        {children}
      </GestureHandlerRootView>
    </RootBottomSheet>
  );
});
