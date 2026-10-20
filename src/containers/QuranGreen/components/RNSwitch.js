import React from 'react';
import {Platform, Switch, View} from 'react-native';
import {COLORS} from '../theme';
import { Colors } from '../../../theme';

const RNSwitch = ({onValueChange, value}) => {
  return (
    <View>
      <Switch
        trackColor={{
          false: '#E0E0E0',
          true: Colors.wasilgreentext
        }}
        thumbColor={Colors.wasilgreenthemecolor}
        ios_backgroundColor={Colors.transparent}
        onValueChange={onValueChange}
        value={value}
        style={{
          transform:
            Platform.OS === 'ios'
              ? [{scaleX: 0.9}, {scaleY: 0.85}]
              : [{scaleX: 1}, {scaleY: 1}],
        }}
      />
    </View>
  );
};

export default RNSwitch;
