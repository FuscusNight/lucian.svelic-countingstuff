// Import necessary modules from expo and react
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
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
    // is name empty?
    if (!name.trim()) {
      return false; // Yep yep, return false to prevent adding empty items
    }

    const nameExists = countables.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() // lowercase to avoid case sensitivity issue, ie Crow =/= crow
    );

    if (!nameExists) {
      // Create a new array with the added countable
      const newState = [...countables, { name, count: 0 }];
      setCountables(newState);
      return true;
    }

    return false; // name exists, too bad
  };

  const deleteCountable = (nameToDelete) => {
    const newState = countables.filter((item) => item.name !== nameToDelete);
    setCountables(newState);
  };

  const editCountableName = (oldName, newName) => {
    // checking if name exists
    const nameExists = countables.some(
      (item) =>
        item.name.toLowerCase() === newName.toLowerCase() &&
        // eslint-disable-next-line prettier/prettier
        item.name !== oldName
    );
    // if name doesnt exist and newName is not empty, return the new name so we can edit it
    if (!nameExists && newName.trim()) {
      const newState = countables.map(
        (item) =>
          // eslint-disable-next-line prettier/prettier
          item.name === oldName ? { ...item, name: newName } : item // ...item copy properties of og item, but override name with newName
      );
      setCountables(newState);
      return true;
    }
    return false; //keep unchanged if name exists or is empty
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
            {countables.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Pretty empty in here 😕</Text>
              </View>
            ) : (
              /* Map n Sort through countables array to create a row for each item */
              [...countables] // copy to manipulate for sorting, though we don't pass it back to the og this time, it's just for display
                .sort((a, b) => {
                  if (b.count !== a.count) {
                    // sort by descending order
                    return b.count - a.count;
                  }
                  return a.name.localeCompare(b.name); // if count is same, sort by name
                })
                .map((countable, index) => (
                  <CountableRow
                    countable={countable}
                    key={countable.name} // Unique key for React's reconciliation
                    changeCount={changeCount} // passes a function from the parent component (App.js) to the child component (CountableRow)
                    deleteCountable={deleteCountable}
                    editCountableName={editCountableName}
                    index={countables.findIndex(
                      (item) => item.name === countable.name
                    )} // can't use map index anymore, findindex to get og index in unsorted array
                  />
                ))
            )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%", // ensures it takes up the full height of the screen so i can get the text to center of the phone
  },
  emptyText: {
    fontSize: 20,
    textAlign: "center",
    color: "#888",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
