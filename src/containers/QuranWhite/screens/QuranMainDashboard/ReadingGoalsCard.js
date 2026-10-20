import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const ReadingGoalsCard = ({
  progress = 0,
  time = "0:00",
  goal = 15,
  onPressExplore
}) => {

  const radius = 120;
  const strokeWidth = 10;

  const size = radius * 2 + strokeWidth * 2;
  const center = size / 2;

  const startAngle = Math.PI;
  const endAngle = Math.PI + Math.PI * progress;

 const polarToCartesian = (angle) => {
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
};

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);

  const largeArcFlag = progress > 0.5 ? 1 : 0;

  const arcPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;

  return (
    <View style={styles.card}>
      
      <Text style={styles.title}>Reading Goals</Text>
      <Text style={styles.subtitle}>
        Set a goal and make reading a daily habit.
      </Text>

      <View style={styles.progressContainer}>
        
        <Svg width={size} height={radius + strokeWidth}>
          <Path
  d={`M ${center - radius} ${center} 
      A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
  stroke="#6A5ACD"
  strokeWidth={strokeWidth}
  fill="none"
  opacity={0.3}
/>
          <Path
            d={arcPath}
            stroke="#8A7BFF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.centerText}>
          <Text style={styles.today}>Today's Reading</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.goalText}>
            of your {goal}-minute goal
          </Text>
        </View>

      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Explore the Quran</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ReadingGoalsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3B247A',
    marginLeft: 15,
    marginRight: 15,
    bottom:5,
    borderRadius: 25,
    paddingVertical: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 5,
  },

  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerText: {
    position: 'absolute',
    alignItems: 'center',
    top: 50,
  },

  today: {
    color: '#ddd',
    fontSize: 14,
  },

  time: {
    fontSize: 42,
    color: '#fff',
    fontWeight: '700',
  },

  goalText: {
    color: '#ccc',
    fontSize: 13,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});