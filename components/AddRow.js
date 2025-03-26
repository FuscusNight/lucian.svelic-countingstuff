import { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

import { CountableButton } from "./CountableButton";
import { CommonStyles } from "../styles/CommonStyles";

// AddRow component - takes the prop addNewCountable from App.js
export const AddRow = ({ addNewCountable }) => {
  // Input fields for the item name we will be adding to the list and error message
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // RENDER UI
  return (
    <View style={CommonStyles.row}>
      {/* onChangeText automatically passes the current text to setName when user types */}
      <TextInput
        placeholder="Enter name"
        onChangeText={(text) => {
          setName(text);
          if (error) setError(""); // Clear error message when user types, if one exists
        }}
        value={name}
      />
      <CountableButton
        label="Add"
        submit={() => {
          // Calls the addNewCountable function from App.js with the current name we set in the input field
          const success = addNewCountable(name);

          if (success) {
            // if succesful, clear input field
            setName("");
            // Clear error log
            setError("");
          } else {
            if (name.trim()) {
              setError(`"${name}" already exists!`);
            } else {
              setError("Please enter a name");
            }
          }
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
});
