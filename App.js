// Import necessary modules from expo and react
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// SafeAreaView ensures content is displayed in visible areas (away from notches, etc.)
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

// Import custom components
import { AddRow } from "./components/AddRow";
import { CountableRow } from "./components/CountableRow";
// Import storage functions to persist data
import { loadCountables, saveCountables } from "./storage/CountableStorage";

export default function App() {
  // STATE MANAGEMENT
  // useState is sorta like a special thingy that remembers info even when the app redraws it self
  // countables: array of objects, each representing an item to count {name, count}
  const [countables, setCountables] = useState([]);
  // isLoaded: tracks if data has been loaded from storage to prevent premature saving
  const [isLoaded, setIsLoaded] = useState(false);

  // EFFECT HOOKS , they are are side effects that happen outside the usual render process loop, like "run this code when x happens"
  // This effect runs once when component mounts (empty dependency array ie run once at start)
  // Loads saved data from device storage
  useEffect(() => {
    loadCountables().then((result) => {
      setCountables(result); // Update state with loaded data
      setIsLoaded(true); // Mark data as loaded
    });
  }, []);

  // This effect runs whenever countables or isLoaded changes, basically an autosave
  // Saves data to device storage ( saveCountables(countables), but only after initial load is complete (isLoaded)
  useEffect(() => {
    if (isLoaded) {
      saveCountables(countables);
    }
  }, [countables, isLoaded]);

  // HANDLER FUNCTIONS
  // Increases or decreases the count for a specific countable
  const changeCount = (amount, index) => {
    // Create a new array to avoid mutating the og state directly
    const newState = [...countables]; // ... is the spread operator, it creates a shallow copy of the array because in react we never should mod state variables directly
    newState[index].count += amount; // copy gets updated
    setCountables(newState); // then the copy gets set as the new state ie we replace the original state with the copy
  };

  // Adds a new countable to the list
  const addNewCountable = (name) => {
    // Create a new array with the added countable
    const newState = [...countables, { name, count: 0 }];
    setCountables(newState);
  };

  // RENDER UI
  return (
    // SafeAreaProvider enables SafeAreaView to work so phone UI doesn't cover content, both it and AreaView are needed for iOS
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "undefined"}
          style={styles.container}
        >
          <ScrollView>
            {/* Map through countables array to create a row for each item */}
            {countables.map((countable, index) => (
              <CountableRow
                countable={countable}
                key={countable.name} // Unique key for React's reconciliation
                changeCount={changeCount} // passes a function from the parent component (App.js) to the child component (CountableRow)
                index={index} // Pass index for changeCount to identify which item to update
              />
            ))}
          </ScrollView>
          {/* Component for adding new countable items */}
          <AddRow addNewCountable={addNewCountable} />
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
