import { useState } from "react";
import { View, TextInput } from "react-native";

import { CountableButton } from "./CountableButton";
import { CommonStyles } from "../styles/CommonStyles";

// AddRow component - takes the prop addNewCountable from App.js
export const AddRow = ({ addNewCountable }) => {
  // Input field for the item name we will be adding to the list
  const [name, setName] = useState("");

  // RENDER UI
  return (
    <View style={CommonStyles.row}>
      {/* onChangeText automatically passes the current text to setName when user types */}
      <TextInput placeholder="Enter name" onChangeText={setName} />
      <CountableButton
        label="Add"
        submit={() => {
          // Calls the addNewCountable function from App.js with the current name we set in the input field
          addNewCountable(name);
        }}
      />
    </View>
  );
};
