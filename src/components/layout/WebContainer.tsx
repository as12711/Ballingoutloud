import { Platform, View } from "react-native";
import { cn } from "@/lib/utils";

interface WebContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export function WebContainer({ children, wide, className }: WebContainerProps) {
  if (Platform.OS !== "web") {
    return <View className={cn("flex-1", className)}>{children}</View>;
  }

  return (
    <View
      className={cn(
        "flex-1 mx-auto w-full px-4",
        wide ? "max-w-7xl" : "max-w-5xl",
        className
      )}
    >
      {children}
    </View>
  );
}
