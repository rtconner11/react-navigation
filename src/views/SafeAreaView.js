import React, { Component } from 'react';
import { DeviceInfo, View } from 'react-native';
import withOrientation from './withOrientation';

const { isIPhoneX_deprecated: isIPhoneX } = DeviceInfo;
const DEVICE_WIDTH = 375;
const DEVICE_HEIGHT = 812;

class SafeView extends Component {
  state = {
    touchesTop: true,
    touchesBottom: true,
    touchesLeft: true,
    touchesRight: true,
  };

  defaultSafeAreaStyle = () => {
    const { touchesTop, touchesBottom, touchesLeft, touchesRight } = this.state;
    const { isLandscape } = this.props;

    return {
      paddingTop: touchesTop ? (isLandscape ? 0 : 44) : 0,
      paddingBottom: touchesBottom ? (isLandscape ? 24 : 34) : 0,
      paddingLeft: touchesLeft ? (isLandscape ? 44 : 0) : 0,
      paddingRight: touchesRight ? (isLandscape ? 44 : 0) : 0,
    };
  };

  getInset = key => {
    const { isLandscape } = this.props;
    switch (key) {
      case 'horizontal':
      case 'right':
      case 'left': {
        return isLandscape ? 44 : 0;
      }
      case 'vertical':
      case 'top': {
        return isLandscape ? 0 : 44;
      }
      case 'bottom': {
        return isLandscape ? 24 : 34;
      }
    }
  };

  render() {
    const { insetOverride, isLandscape, children, style } = this.props;

    if (!isIPhoneX) {
      return <View style={style}>{this.props.children}</View>;
    }

    const safeAreaStyle = this.defaultSafeAreaStyle();

    if (insetOverride) {
      Object.keys(insetOverride).forEach(key => {
        let inset = insetOverride[key];

        if (inset === 'always') {
          inset = this.getInset(key);
        }

        if (inset === 'never') {
          inset = 0;
        }

        switch (key) {
          case 'horizontal': {
            safeAreaStyle.paddingLeft = inset;
            safeAreaStyle.paddingRight = inset;
            break;
          }
          case 'vertical': {
            safeAreaStyle.paddingTop = inset;
            safeAreaStyle.paddingBottom = inset;
            break;
          }
          case 'left':
          case 'right':
          case 'top':
          case 'bottom': {
            const [first] = key;
            const padding = `padding${first.toUpperCase()}${key.slice(1)}`;
            safeAreaStyle[padding] = inset;
            break;
          }
        }
      });
    }

    return (
      <View
        onLayout={this._onLayout}
        style={[style, safeAreaStyle]}
        //ref={c => (this.view = c)}
      >
        {this.props.children}
      </View>
    );
  }

  _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    const { isLandscape, verbose } = this.props;

    const WIDTH = isLandscape ? DEVICE_HEIGHT : DEVICE_WIDTH;
    const HEIGHT = isLandscape ? DEVICE_WIDTH : DEVICE_HEIGHT;

    // if (this.view) {
    // this.view.measure((x, y, width, height) => {
    const touchesTop = y === 0;
    const touchesBottom = y + height === HEIGHT;
    const touchesLeft = x === 0;
    const touchesRight = x + width === WIDTH;

    if (verbose) {
      // console.log(this.view);
      console.log(
        isLandscape ? 'landscape' : 'portrait',
        `\ny:${y.toFixed(2)} + height:${height.toFixed(2)} = ${(y + height
        ).toFixed(2)} =? ${HEIGHT}`,
        `\nx:${x.toFixed(2)} + width:${width.toFixed(2)} = ${(x + width
        ).toFixed(2)} =? ${WIDTH}\n`
      );
      // console.log(pageX, pageY);
    }

    this.setState({ touchesTop, touchesBottom, touchesLeft, touchesRight });
    // });
    // }
  };
}

export default withOrientation(SafeView);
