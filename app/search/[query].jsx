import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants/";
import SearchInput from "../../components/searchInput";
import Trending from "../../components/trending";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import EmptyState from "../../components/emptyState";
import { getAllPosts, searchPosts } from "../../lib/appwrite";
import UseAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/videoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = UseAppwrite(() => searchPosts(query));
  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100">
              Results with...
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found."
            subtitle={`No videos relating to "${query}" found.`}
          />
        )}
      />
      <ExpoStatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
