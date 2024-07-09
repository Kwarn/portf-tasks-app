import cache from "./cache";

const generateCacheKey = (...args: any[]): string => {
  const serializedArgs = args.map((arg) => {
    if (typeof arg === "object" && arg !== null) {
      return JSON.stringify(arg, Object.keys(arg).sort());
    } else {
      return JSON.stringify(arg);
    }
  });

  return serializedArgs.join("_");
};

const fetchData = async (fn: Function, ...args: any[]) => {
  const data = await fn(...args);
  return data;
};

const cacheWrapper = () => {
  return (fn: Function) => {
    return async (...args: any[]) => {
      const key = generateCacheKey(...args);

      const cachedResult = cache.get(key);

      if (cachedResult) {
        console.log(`Returning cached result for key: ${key}`);
        return cachedResult;
      }

      const data = await fetchData(fn, ...args);
      cache.set(key, data, 60); // cache for 60 seconds

      console.log(`Caching result for key: ${key}`);
      return data;
    };
  };
};

export default cacheWrapper;
