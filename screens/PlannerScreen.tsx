import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import slugify from "slugify";

import { Modal } from "../components/styled/Modal";
import { RootTabScreenProps } from "../types";
import ExerciseForm, { ExerciseFormData } from "../components/ExerciseForm";
import { SequenceItem, SequenceType, Workout } from "../types/data";
import ExerciseItem from "../components/ExerciseItem";
import { PressableText } from "../components/styled/PressableText";
import WorkoutForm, { WorkoutFormData } from "../components/WorkoutForm";
import { storeWorkout } from "../storage/workout";
import { PressableThemeText } from "../components/styled/PressableThemeText";

export default function PlannerScreen({ navigation }: NativeStackHeaderProps) {
  const [seqItems, setSeqItem] = useState<SequenceItem[]>([]);

  const handleExerciseSubmit = (form: ExerciseFormData) => {
    const sequenceItem: SequenceItem = {
      slug: slugify(form.name + Date.now(), { lower: true }),
      name: form.name,
      type: form.type as SequenceType,
      duration: Number(form.duration),
    };
    if (form.reps) {
      sequenceItem.reps = Number(form.reps);
    }
    setSeqItem([...seqItems, sequenceItem]);
  };

  const computeDifficulty = (
    exerciseCount: number,
    workoutDuration: number
  ) => {
    const intensity = workoutDuration / exerciseCount;

    if (intensity <= 60) {
      return "hard";
      2;
    } else if (intensity <= 100) {
      return "normal";
    } else {
      return "easy";
    }
  };

  const handleWorkoutSubmit = async (form: WorkoutFormData) => {
    if (seqItems.length > 0) {
      const duration = seqItems.reduce((acc, item) => {
        return acc + item.duration;
      }, 0);

      const workout: Workout = {
        name: form.name,
        slug: slugify(form.name + " " + Date.now(), { lower: true }),
        difficulty: computeDifficulty(seqItems.length, duration),
        sequence: [...seqItems],
        duration,
      };
      await storeWorkout(workout)
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={seqItems}
        keyExtractor={(item) => item.slug}
        renderItem={({ item, index }) => (
          <ExerciseItem item={item}>
            <PressableText
              text="Remove"
              onPressIn={() => {
                const items = [...seqItems];
                items.splice(index, 1);
                setSeqItem(items);
              }}
            />
          </ExerciseItem>
        )}
      />
      <ExerciseForm onSubmit={handleExerciseSubmit} />

      <View>
        <Modal
          activator={({ handleOpen }) => (
            <PressableThemeText
              style={{ marginTop: 20 }}
              text="Create Workout"
              onPress={handleOpen}
            />
          )}
        >
          {(handleClose) => 
            <View>
              <WorkoutForm
                onSubmit={ async (data) => {
                  await handleWorkoutSubmit(data)
                  handleClose
                  navigation.navigate('Home')
                }}
              />
            </View>
          }
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
