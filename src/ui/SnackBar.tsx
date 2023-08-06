import {useContext, useId} from 'react';
import type {Dispatch, ReactNode, RefObject} from 'react';
import React, {
  createContext,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import {View} from 'react-native';
import {match} from '../utils/match';
import tw from '../tailwind';

interface Props {}

function SnackBar({}: Props): JSX.Element {
  return <View />;
}

type RefHandle = {
  showSnack: (element: JSX.Element, duration?: number) => void;
};

function Container({children}: {children: ReactNode}): JSX.Element {
  const ref = useRef<RefHandle | null>(null);
  const [state, dispatch] = useReducer(stateReducer, {
    snacks: [],
  });
  useImperativeHandle(ref, () => {
    return {
      showSnack: (element: JSX.Element, duration = 2000) => {
        dispatch({
          type: ActionTypes.New,
          snack: {
            element,
            duration,
          },
        });

        setTimeout(() => {
          dispatch({type: ActionTypes.Remove});
        }, duration);
      },
    };
  });
  return (
    <SnackBarRefContext.Provider value={{ref}}>
      {children}
      <SnackBarContext.Provider value={{state, dispatch}}>
        <Snacks />
      </SnackBarContext.Provider>
    </SnackBarRefContext.Provider>
  );
}

function Snacks(): JSX.Element | null {
  const {state, dispatch} = useSnackBarContext();

  console.log(state.snacks);
  if (state.snacks.length === 0) {
    return null;
  }

  return (
    <View style={tw`absolute bottom-10 gap-2 mx-auto w-screen`}>
      {state.snacks.map((snack, index) => (
        <View
          key={index}
          style={tw`rounded bg-gray-800 py-2 px-1 w-1/2 self-center`}>
          {snack.element}
        </View>
      ))}
    </View>
  );
}

type SnackBarContext = {
  state: StateDef;
  dispatch: Dispatch<Actions>;
};

const SnackBarContext = createContext<SnackBarContext | null>(null);

export default Object.assign(SnackBar, {Container});

type Snack = {
  element: JSX.Element;
  duration: number;
};

interface StateDef {
  snacks: Array<Snack>;
}

enum ActionTypes {
  Remove,
  New,
}

type Actions =
  | {
      type: ActionTypes.New;
      snack: Snack;
    }
  | {type: ActionTypes.Remove};

const reducer: {
  [A in ActionTypes]: (
    state: StateDef,
    action: Extract<Actions, {type: A}>,
  ) => StateDef;
} = {
  [ActionTypes.New]: (state, action) => {
    return {...state, snacks: [...state.snacks, action.snack]};
  },
  [ActionTypes.Remove]: state => {
    const snacksClone = [...state.snacks];
    snacksClone.pop();
    return {
      ...state,
      snacks: snacksClone,
    };
  },
};

function stateReducer(state: StateDef, action: Actions): StateDef {
  return match(action.type, reducer, state, action);
}

function useSnackBarContext() {
  const context = useContext(SnackBarContext);
  if (context == null) {
    throw new Error(
      'useSnackBarContext must be used within a SnackBarProvider',
    );
  }
  return context;
}

const SnackBarRefContext = createContext<{
  ref: RefObject<RefHandle> | null;
} | null>(null);

function useSnackBarRefContext() {
  const context = useContext(SnackBarRefContext);
  if (context == null) {
    throw new Error(
      'useSnackBarRefContext must be used within a SnackBarProvider',
    );
  }
  return context;
}

export function useSnackBar() {
  const context = useSnackBarRefContext();
  const {ref} = context;
  let showSnack = null;
  if (ref?.current != null) {
    showSnack = ref.current.showSnack;
  }
  return {showSnack};
}
