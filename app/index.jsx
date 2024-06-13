import {
  Image,
  ScrollView,
  ScrollViewComponent,
  Text,
  View,
} from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/customButton";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useGlobalContext } from "../context/globalProvider";

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full  justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[130px] h-[84px]"
          />
          <Image
            source={images.cards}
            resizeMode="contain"
            className=" max-w-[380px] w-full h-[300px]"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-secondary font-pbold text-center">
              Discover Endless Possibilities with{" "}
            </Text>
            <Image
              source={images.logo}
              className="w-[300px] "
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-gray-100 font-pregular mt-7 text-center">
            Where creativity meets innovation: Embark on a jouney of limitless
            exploration with Fusionary
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <ExpoStatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
