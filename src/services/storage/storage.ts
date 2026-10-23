import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async set<TValue>(key: string, value: TValue): Promise<void> {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
  },

  async get<TValue>(key: string): Promise<TValue | null> {
    const item = await AsyncStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item) as TValue;
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export default storage;
