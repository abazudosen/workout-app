import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Pressable, Text } from 'react-native';
import WorkoutItem from "../components/WorkoutItem";
import { useWorkouts } from "../hooks/useWorkouts";
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { ThemeText } from '../components/styled/Text';

export default function HomeScreen({ navigation }: NativeStackHeaderProps) {

  const workouts = useWorkouts()

  return (
    <View style={styles.container}>
      <ThemeText style={styles.header}>New Workout</ThemeText>
      <FlatList
        data={workouts}
        keyExtractor={item => item.slug}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("WorkoutDetail", { slug: item.slug })
            }
          >
            <WorkoutItem item={item} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold"
  }
})
