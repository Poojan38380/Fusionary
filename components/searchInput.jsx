import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="border-2 border-light w-full h-16 px-4 bg-secondary rounded-2xl focus:border-secondary flex-row items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#fff"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please atleast input something."
            );
          }

          if (pathName.startsWith("/search")) {
            router.setParams;
            ({ query });
          } else router.push(`/search/${query}`);
        }}
      >
        <Image
          source={icons.search}
          resizeMethod="contain"
          className="w-5 h-5"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
