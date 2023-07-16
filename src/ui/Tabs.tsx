import type {Dispatch, ReactNode} from 'react';
import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {View} from 'react-native';
import Pressable from './Pressable';
import tw from '../tailwind';
import {match} from '../utils/match';

function TabsInner({children}: {children: ReactNode}): JSX.Element {
  const {state, dispatch} = useTabContext();

  return (
    <View>
      <View style={tw`flex-row justify-between relative`}>
        {state.tabs.map((tab, i) => (
          <Pressable
            key={i}
            style={tw.style('flex-1 items-center py-2', {
              'bg-gray-400/25': i === state.index,
            })}
            onPress={() => {
              dispatch({type: ActionTypes.SetIndex, index: i});
            }}>
            {tab}
          </Pressable>
        ))}
      </View>
      {children}
      <View>{state.panels[state.index]}</View>
    </View>
  );
}

interface TabProps {
  title: JSX.Element;
  children: JSX.Element;
}

function Tab({title, children}: TabProps): JSX.Element | null {
  const {dispatch} = useTabContext();
  useEffect(() => {
    dispatch({type: ActionTypes.AddTab, tab: title});
    dispatch({type: ActionTypes.AddPanel, panel: children});
    return () => {
      dispatch({type: ActionTypes.RemovePanel, panel: children});
      dispatch({type: ActionTypes.RemoveTab, tab: title});
    };
  }, [children, dispatch, title]);
  return null;
}

interface TabContext {
  state: StateDef;
  dispatch: Dispatch<Actions>;
}

const TabContext = createContext<TabContext | null>(null);

function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw Error('Tab context not found in stack');
  }
  return context;
}

function Tabs({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(stateReducer, {
    tabs: [],
    panels: [],
    index: 0,
  });
  return (
    <TabContext.Provider value={{state, dispatch}}>
      <TabsInner>{children}</TabsInner>
    </TabContext.Provider>
  );
}

type StateDef = {
  index: number;
  tabs: JSX.Element[];
  panels: JSX.Element[];
};
enum ActionTypes {
  SetIndex,
  AddTab,
  RemoveTab,
  AddPanel,
  RemovePanel,
  ClearTabs,
}

type Actions =
  | {
      type: ActionTypes.SetIndex;
      index: number;
    }
  | {type: ActionTypes.AddTab; tab: JSX.Element}
  | {type: ActionTypes.RemoveTab; tab: JSX.Element}
  | {type: ActionTypes.AddPanel; panel: JSX.Element}
  | {type: ActionTypes.RemovePanel; panel: JSX.Element}
  | {type: ActionTypes.ClearTabs};

const reducer: {
  [A in ActionTypes]: (
    state: StateDef,
    Action: Extract<Actions, {type: A}>,
  ) => StateDef;
} = {
  [ActionTypes.SetIndex](state, action) {
    return {
      ...state,
      index: action.index,
    };
  },
  [ActionTypes.AddTab](state, action) {
    return {
      ...state,
      tabs: [...state.tabs, action.tab],
    };
  },
  [ActionTypes.RemoveTab](state, action) {
    return {
      ...state,
      tabs: state.tabs.filter(tab => tab !== action.tab),
    };
  },
  [ActionTypes.AddPanel](state, action) {
    return {
      ...state,
      panels: [...state.panels, action.panel],
    };
  },
  [ActionTypes.RemovePanel](state, action) {
    return {
      ...state,
      panels: state.panels.filter(panel => panel !== action.panel),
    };
  },
  [ActionTypes.ClearTabs](state) {
    return {
      ...state,
      tabs: [],
    };
  },
};

function stateReducer(state: StateDef, action: Actions): StateDef {
  return match(action.type, reducer, state, action);
}

export default Object.assign(Tabs, {Tab});
