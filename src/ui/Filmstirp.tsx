import type {Dispatch, ReactNode} from 'react';
import React, {createContext, useContext, useReducer} from 'react';
import {match} from '../utils/match';
import Pressable from './Pressable';
import tw from '../tailwind';
import type {CellRendererProps, ListRenderItem} from 'react-native';
import {View, VirtualizedList, StyleSheet} from 'react-native';
import {Circle, CircleCheckFilled} from './Icons';

interface Props<TData> {
  data: TData[];
  children: (item: TData) => JSX.Element;
}

function ItemSeparatorComponent(): JSX.Element {
  return <View style={tw`w-2`} />;
}

function CellRendererComponent({
  children,
  style,
  ...props
}: CellRendererProps<unknown>): JSX.Element {
  return (
    <View style={StyleSheet.compose(tw`rounded`, style)} {...props}>
      {children}
    </View>
  );
}

const getItemCount = (items: unknown[]): number => items.length;
const getItem = (items: unknown[], index: number): unknown => items[index];
const keyExtractor = item => String(item);

function Filmstrip<TData>({data, children}: Props<TData>): JSX.Element {
  const [state, dispatch] = useReducer(stateReducer, {
    data,
    selection: [],
  });
  const renderItem: ListRenderItem<TData> = ({item}) => {
    return children(item);
  };
  return (
    <FilmstripContext.Provider value={{state, dispatch}}>
      <VirtualizedList
        horizontal
        data={data}
        renderItem={renderItem}
        getItemCount={getItemCount}
        keyExtractor={keyExtractor}
        getItem={getItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        CellRendererComponent={CellRendererComponent}
      />
    </FilmstripContext.Provider>
  );
}

function Item({
  id,
  children,
  onPress,
}: {
  id: string;
  children: ReactNode;
  onPress?: () => void | Promise<void>;
}) {
  const {state, dispatch} = useFilmstripContext();
  const selected = state.selection.includes(id);
  const onPressWrapper = () => {
    if (selected) {
      dispatch({type: ActionTypes.Remove, payload: id});
    } else {
      dispatch({type: ActionTypes.Add, payload: id});
    }
    void onPress?.();
  };
  console.log(id);
  return (
    <Pressable onPress={onPressWrapper}>
      <View style={tw`relative`}>
        <View style={tw`top-0 left-0 absolute z-10`}>
          {selected ? <CircleCheckFilled /> : <Circle />}
        </View>
        {children}
      </View>
    </Pressable>
  );
}

interface State {
  data: unknown[];
  selection: unknown[];
}

enum ActionTypes {
  Add,
  Remove,
}

type Actions =
  | {type: ActionTypes.Add; payload: unknown}
  | {type: ActionTypes.Remove; payload: unknown};

const reducer: {
  [A in ActionTypes]: (
    state: State,
    action: Extract<Actions, {type: A}>,
  ) => State;
} = {
  [ActionTypes.Add](state, action) {
    return {
      ...state,
      selection: state.selection.concat(action.payload),
    };
  },
  [ActionTypes.Remove](state, action) {
    return {
      ...state,
      selection: state.selection.filter(value => value !== action.payload),
    };
  },
};

function stateReducer(state: State, action: Actions): State {
  return match(action.type, reducer, state, action);
}

interface FilmstrpContext {
  state: State;
  dispatch: Dispatch<Actions>;
}

const FilmstripContext = createContext<FilmstrpContext | null>(null);
function useFilmstripContext(): FilmstrpContext {
  const context = useContext(FilmstripContext);
  if (!context) {
    throw Error('Filmstrip Context not found in stack');
  }

  return context;
}

export default Object.assign(Filmstrip, {Item});
