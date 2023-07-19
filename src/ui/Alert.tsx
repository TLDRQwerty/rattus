import type {Dispatch, ReactNode} from 'react';
import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useReducer,
} from 'react';
import {match} from '../utils/match';
import {Modal, Pressable, View} from 'react-native';
import tw from '../tailwind';

interface AlertProps {
  children: ReactNode;
}

export interface RefHandle {
  show: () => void;
  hide: () => void;
}

const Alert = forwardRef<RefHandle, AlertProps>(function Alert(
  {children},
  ref,
): JSX.Element {
  const [state, dispatch] = useReducer(matchReducer, {
    visible: false,
  });

  useImperativeHandle(ref, () => {
    return {
      show: () => dispatch({type: ActionTypes.Open}),
      hide: () => dispatch({type: ActionTypes.Close}),
    };
  });

  return (
    <AlertContext.Provider value={{state, dispatch}}>
      <Modal
        transparent
        visible={state.visible}
        onDismiss={() => {
          dispatch({
            type: ActionTypes.Close,
          });
        }}>
        <View
          style={tw`z-1 p-4 min-h-[15%] min-w-[25%] bg-white rounded-xl m-auto`}>
          {children}
        </View>
        <View style={tw`absolute inset-0 bg-gray-800/25`} />
      </Modal>
    </AlertContext.Provider>
  );
});

type StateDef = {
  visible: boolean;
};

enum ActionTypes {
  Close,
  Open,
}

type Actions = {type: ActionTypes.Close} | {type: ActionTypes.Open};

const reducer: {
  [T in ActionTypes]: (
    state: StateDef,
    action: Extract<Actions, {type: T}>,
  ) => StateDef;
} = {
  [ActionTypes.Close](state) {
    return {
      ...state,
      visible: false,
    };
  },
  [ActionTypes.Open](state) {
    return {
      ...state,
      visible: true,
    };
  },
};

function matchReducer(state: StateDef, action: Actions) {
  return match(action.type, reducer, state, action);
}

interface AlertContext {
  state: StateDef;
  dispatch: Dispatch<Actions>;
}

const AlertContext = createContext<AlertContext | null>(null);

function useAlertContext() {
  const context = useContext(AlertContext);
  if (context == null) {
    throw Error('Alert Provider not found in stack');
  }
  return context;
}

export default Object.assign(Alert);
