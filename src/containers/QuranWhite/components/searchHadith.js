import React from 'react';
import { View, TextInput, StyleSheet,Platform } from 'react-native';
import { SearchSVG } from '../../../../src/assets/icons';
import { Colors } from '../../../../src/theme';

const SearchHadith = ({ search, searchFilterFunction }) => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    keyboardType={'default'}
                    placeholder="Search Hadith Chapter"
                    fontFamily={Platform.OS === 'ios' ? 'Poppins-Regular' : 'Raleway'}
                    placeholderTextColor={Colors.bordercolor}
                    onChangeText={text => searchFilterFunction(text)}
                    value={search}/>
            </View>
            <View style={styles.searchIconContainer}>
                <SearchSVG />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderColor: Colors.white,
        backgroundColor: Colors.white,
        borderWidth: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    textInputContainer: {
        left: 20,
    },
    textInput: {
        fontSize: 12,
        color: Colors.bordercolor,
    },
    searchIconContainer: {
        flex: 0.1,
        right: 10,
    },
});

export default SearchHadith;
