import { StyleSheet, View } from "react-native";
import { colors } from "../../theme/colors";

type LoadingSkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
};

export function LoadingSkeleton({ height = 16, width = "100%" }: LoadingSkeletonProps) {
  return <View style={[styles.skeleton, { height, width }]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.skeleton,
    borderRadius: 8
  }
});
