import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.poojan.aora",
  projectId: "6668913d000a9daf6e2a",
  databaseId: "666892ae003c5991af09",
  userCollectionId: "666892d0002d4fc2fa82",
  videoCollectionId: "6668930b00320f16d150",
  storageId: "66689462000b3d1d0b0b",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error();

    const avatarURL = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarURL }
    );

    return newUser;
  } catch (error) {
    console.log("Error in function createUser", error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log("Error in function signIn", error);
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log("Error in function getCurrentUser", error);
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return (await posts).documents;
  } catch (error) {
    console.log("Error in function getAllPosts", error);
    throw new Error(error);
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return (await posts).documents;
  } catch (error) {
    console.log("Error in function getAllPosts", error);
    throw new Error(error);
  }
};
export const searchPosts = async (query) => {
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    console.log("Error in function searchPosts", error);
    throw new Error(error);
  }
};
export const getUserPosts = async (userId) => {
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    console.log("Error in function searchPosts", error);
    throw new Error(error);
  }
};
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log("Error in function signOut", error);
    throw new Error(error);
  }
};
export const getFilePreview = async (fileId, type) => {
  let fileURL;

  try {
    if (type === "video") {
      fileURL = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileURL = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid File Type");
    }

    if (!fileURL) throw new Error();
    return fileURL;
  } catch (error) {
    console.log("Error in function getFilePreview", error);
    throw new Error(error);
  }
};
export const uploadFile = async (file, type) => {
  try {
    if (!file) {
      console.log("No file to upload");
      return;
    }

    const asset = {
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri,
    };

    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
      const fileURL = await getFilePreview(uploadedFile.$id, type);
    } catch (error) {
      console.log(
        "Error in function uploadFile, error in uploading file to appwrite",
        error
      );
      throw new Error(error);
    }
  } catch (error) {
    console.log("Error in function uploadFile", error);
    throw new Error(error);
  }
};
export const createVideo = async (form) => {
  try {
    const [thumnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumnail: thumnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log("Error in function createVideo", error);
    throw new Error(error);
  }
};
