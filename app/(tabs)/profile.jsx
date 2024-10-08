import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import EmptyState from "../../components/emptyState";
import { getUserPosts, searchPosts, signOut } from "../../lib/appwrite";
import UseAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/videoCard";
import { useGlobalContext } from "../../context/globalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/infoBox";
import { router } from "expo-router";

const Profile = () => {
  const { setIsLogged, user, setUser } = useGlobalContext();
  const { data: posts } = UseAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="border border-secondary w-16 h-16 rounded-full justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-full"
                resizeMode="contain"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title="0"
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found."
            subtitle={`No videos posted by "${user?.username}".`}
          />
        )}
      />
      <ExpoStatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
