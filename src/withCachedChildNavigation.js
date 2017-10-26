/* @flow */

import * as React from 'react';

import addNavigationHelpers from './addNavigationHelpers';

import type { NavigationScreenProp } from './TypeDefinition';

type InjectedProps<N> = {
  childNavigationProps: {
    [key: string]: N,
  },
};

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation<T: *, N: *>(
  Comp: React.ComponentType<T & InjectedProps<N>>
): React.ComponentType<T> {
  return class extends React.PureComponent<T> {
    static displayName = `withCachedChildNavigation(${Comp.displayName ||
      Comp.name})`;

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps: T) {
      this._updateNavigationProps(nextProps.navigation);
    }

    _childNavigationProps: {
      [key: string]: NavigationScreenProp<N>,
    };

    _updateNavigationProps = (navigation: NavigationScreenProp<N>) => {
      // Update props for each child route
      if (!this._childNavigationProps) {
        this._childNavigationProps = {};
      }
      navigation.state.routes.forEach((route: *) => {
        const childNavigation = this._childNavigationProps[route.key];
        if (childNavigation && childNavigation.state === route) {
          return;
        }
        this._childNavigationProps[route.key] = addNavigationHelpers({
          ...navigation,
          state: route,
        });
      });
    };

    render() {
      return (
        <Comp
          {...this.props}
          childNavigationProps={this._childNavigationProps}
        />
      );
    }
  };
}
