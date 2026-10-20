import React from 'react';
import {View} from 'react-native';
import Header from '../../components/Header';
import Translations from '../Translation';

const TranslatePage = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <Header
        title="Translation"
        onPressLeftIcon={() => navigation.goBack()}
        rightIcon={false}
      />

      <Translations navigation={navigation} />
    </View>
  );
};

export default TranslatePage;