import { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

import { CountableButton } from "./CountableButton";
import { CommonStyles } from "../styles/CommonStyles";

// Props:
// - countable: the item object with name and count properties
// - changeCount: function to increase/decrease the count (passed from app.js)
// - index: position in the array (needed to identify which item to update)
export const CountableRow = ({
  countable,
  changeCount,
  deleteCountable,
  editCountableName,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(countable.name);

  const handleSubmitEdit = () => {
    const success = editCountableName(countable.name, editedName);
    if (success) {
      setIsEditing(false);
    } else {
      setEditedName(countable.name);
    }
  };

  return (
    //explicit return needed now because we are returning more than just html in JSX, we got states and functions now in countableRow too

    <View style={CommonStyles.row}>
      <View style={styles.editColumn}>
        <CountableButton
          label="✎" // pencil icon
          submit={() => setIsEditing(!isEditing)}
          color="orange"
        />
      </View>
      <View style={styles.nameColumn}>
        {isEditing ? (
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            onBlur={handleSubmitEdit} // Saves when input loses focus
            onSubmitEditing={handleSubmitEdit} // Save when edit button is pressed again
            style={[CommonStyles.textItem, styles.editInput]}
          />
        ) : (
          <>
            <Text style={CommonStyles.textItem}>{countable.name}</Text>
          </>
        )}
      </View>
      <View style={styles.countColumn}>
        <Text style={CommonStyles.textItem}>{countable.count}</Text>
      </View>
      <View style={styles.buttonColumn}>
        <CountableButton
          label="+"
          submit={() => {
            changeCount(1, index);
          }}
        />
        <CountableButton
          label="-"
          submit={() => {
            changeCount(-1, index);
          }}
          disabled={countable.count === 0} // if the count is 0, turn it off
        />
        <CountableButton
          label="🗑️"
          submit={() => {
            deleteCountable(countable.name);
          }}
          color="hsl(0, 83.20%, 69.60%)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editColumn: {
    flex: 0.5,
  },
  editInput: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  nameColumn: {
    flex: 0.8,
    alignItems: "center",
  },
  countColumn: {
    flex: 0.2,
    padding: 5,
    marginRight: 2.5,
  },
  buttonColumn: {
    flex: 0.4,
  },
});
