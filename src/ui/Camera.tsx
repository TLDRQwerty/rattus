import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Camera as RootCamera,
  useCameraDevices,
} from 'react-native-vision-camera';
import Loading from './Loading';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import type {PinchGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {useAppState} from '../hooks/use-app-state';
import tw from '../tailwind';
import Pressable from './Pressable';
import {CameraBolt, CameraCancel, CameraRotate, CircleDot} from './Icons';

const ReanimatedCamera = Reanimated.createAnimatedComponent(RootCamera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const MAX_ZOOM_FACTOR = 20;

export default function Camera(): JSX.Element {
  const camera = useRef<RootCamera>(null);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );

  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const [flash, setFlash] = useState<undefined | boolean>(device?.hasFlash);

  const zoom = useSharedValue(0);

  const isFocussed = useIsFocused();
  const isForeground = useAppState() === 'active';
  const isActive = isFocussed && isForeground;

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => !f);
  }, []);

  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  const onTakePhotoPressed = useCallback(async () => {
    if (camera.current) {
      await camera.current.takePhoto({
        flash: flash ? 'on' : 'off',
      });
    }
  }, [flash]);

  if (device == null) {
    return <Loading />;
  }

  return (
    <View style={tw`flex-1 bg-black`}>
      <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
            <ReanimatedCamera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              enableZoomGesture={false}
              animatedProps={cameraAnimatedProps}
            />
          </TapGestureHandler>
        </Reanimated.View>
      </PinchGestureHandler>

      <View style={tw`bottom-0 absolute flex-row`}>
        <Pressable onPress={onFlipCameraPressed}>
          <CameraRotate style={tw`w-12 h-12`} />
        </Pressable>
        {flash != null && (
          <Pressable onPress={onFlashPressed}>
            {flash ? <CameraBolt /> : <CameraCancel />}
          </Pressable>
        )}
        <Pressable onPress={onTakePhotoPressed}>
          <CircleDot />
        </Pressable>
      </View>
    </View>
  );
}

function TakePicture() {}
