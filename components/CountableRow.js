import { Text, View, StyleSheet } from "react-native";

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
  index,
}) => (
  <View style={CommonStyles.row}>
    <View style={styles.nameColumn}>
      <Text style={CommonStyles.textItem}>{countable.name}</Text>
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
        label="X"
        submit={() => {
          deleteCountable(countable.name);
        }}
        color="red"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  nameColumn: {
    flex: 0.8,
    alignItems: "center",
  },
  buttonColumn: {
    flex: 0.2,
  },
});
