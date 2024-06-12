import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { searchPosts } from "./appwrite";

const usingSearchPosts = (query) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await searchPosts(query);
      setdata(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default usingSearchPosts;
