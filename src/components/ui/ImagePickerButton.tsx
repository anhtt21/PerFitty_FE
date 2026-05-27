import { ImagePlus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../theme/colors";
import { Button } from "./Button";

type ImagePickerButtonProps = {
  label?: string;
  onPicked: (asset: ImagePicker.ImagePickerAsset) => void;
};

export function ImagePickerButton({ label = "Pick image", onPicked }: ImagePickerButtonProps) {
  async function handlePick() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ["images"],
      quality: 0.85
    });

    if (!result.canceled) {
      onPicked(result.assets[0]);
    }
  }

  return (
    <Button
      label={label}
      onPress={handlePick}
      icon={<ImagePlus color={colors.primaryText} size={18} />}
    />
  );
}
