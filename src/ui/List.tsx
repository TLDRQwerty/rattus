import type {Dispatch, ReactNode} from 'react';
import React, {createContext, useReducer, useContext, useMemo} from 'react';
import {View} from 'react-native';
import {match} from '../utils/match';
import Pressable from './Pressable';
import tw from '../tailwind';
import {Selector} from './Icons';

interface ListProps<TData extends {id: number}> {
  value: TData;
  onChange: (value: TData) => void | Promise<void>;
  children: ReactNode;
}

function Button({children}: {children: ReactNode}): JSX.Element {
  const {state, dispatch} = useListContext();
  return (
    <Pressable
      style={tw`relative mt-1 flex-row w-1/3 justify-between pl-2 items-center rounded`}
      onPress={() => {
        dispatch({type: state.open ? ActionTypes.Close : ActionTypes.Open});
      }}>
      {children}
      <Selector />
    </Pressable>
  );
}

function List<TData extends {id: number}>({
  value,
  onChange,
  children,
}: ListProps<TData>): JSX.Element {
  const [state, dispatch] = useReducer(stateReducer, {
    open: false,
    selectedValue: value,
  });

  const actions = useMemo<ListActionContext>(
    () => ({
      value,
      onChange,
    }),
    [],
  );

  return (
    <ListActionContext.Provider value={actions}>
      <ListContext.Provider value={{state, dispatch}}>
        {children}
      </ListContext.Provider>
    </ListActionContext.Provider>
  );
}

function Options({children}: {children: ReactNode}): JSX.Element | null {
  const {state} = useListContext();
  if (!state.open) {
    return null;
  }
  return (
    <View style={tw`absolute top-0 bg-white rounded w-full`}>{children}</View>
  );
}

function Option({
  children,
  value,
  disabled,
}: {
  children: ReactNode;
  value: never;
  disabled?: boolean;
}): JSX.Element {
  const {dispatch} = useListContext();
  const {onChange} = useListActionContext();
  return (
    <Pressable
      onPress={() => {
        void onChange(value);
        dispatch({type: ActionTypes.Close});
      }}
      disabled={disabled}
      style={tw`flex-row items-center pl-2 py-2`}>
      {children}
    </Pressable>
  );
}

interface StateDef<TData = {id: number}> {
  selectedValue: TData;
  open: boolean;
}

enum ActionTypes {
  Close,
  Open,
}

type Actions =
  | {
      type: ActionTypes.Open;
    }
  | {type: ActionTypes.Close};

const reducer: {
  [A in ActionTypes]: (
    state: StateDef,
    action: Extract<Actions, {type: A}>,
  ) => StateDef;
} = {
  [ActionTypes.Open](state) {
    return {
      ...state,
      open: true,
    };
  },
  [ActionTypes.Close](state) {
    return {
      ...state,
      open: false,
    };
  },
};

interface ListContext {
  state: StateDef;
  dispatch: Dispatch<Actions>;
}

const ListContext = createContext<ListContext | null>(null);

interface ListActionContext {
  onChange: (item: unknown) => void | Promise<void>;
  value: unknown;
}

const ListActionContext = createContext<ListActionContext | null>(null);

function useListContext() {
  const context = useContext(ListContext);
  if (!context) {
    throw Error('List Context not found in the current stack');
  }
  return context;
}

function useListActionContext() {
  const context = useContext(ListActionContext);
  if (!context) {
    throw Error('List action context not found in current stack');
  }
  return context;
}

function stateReducer(state: StateDef, action: Actions): StateDef {
  return match(action.type, reducer, state, action);
}

export default Object.assign(List, {Button, Options, Option});
