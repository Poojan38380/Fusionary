import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants/";
import SearchInput from "../../components/searchInput";
import Trending from "../../components/trending";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import EmptyState from "../../components/emptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import UseAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/videoCard";
import { useGlobalContext } from "../../context/globalProvider";

const Home = () => {
  const { user } = useGlobalContext();

  const { data: posts, refetch } = UseAppwrite(getAllPosts);
  const { data: latestPosts } = UseAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back,
                </Text>
                <Text className="text-2xl font-psemibold text-secondary">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  resizeMode="contain"
                  className="w-9 h-10"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full  flex-1 pt-5 pb-8">
              <Text className="text-lg text-black  font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found."
            subtitle="Be the first one to upload a video."
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <ExpoStatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
