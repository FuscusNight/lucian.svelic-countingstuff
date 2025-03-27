import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { CommonStyles } from "../styles/CommonStyles";

// Props:
// - label: text to display on the button (like "+", "-", or "Add")
// - submit: function to call when the button is pressed (gets used in CountableRow.js)
// - disabled: boolean to check if the button is disabled (passed from CountableRow.js)
export const CountableButton = ({ label, submit, disabled = false }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled]} // uses button for style but different styles if disabled
    onPress={submit}
  >
    <Text style={CommonStyles.textItem}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    margin: 5,
    backgroundColor: "lightblue",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "lightgray",
    opacity: 0.5,
  },
});
