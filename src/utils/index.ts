const rtf = new Intl.RelativeTimeFormat("en");

export const parseTimestamp = (timestamp: number) => {
  return new Date(
    timestamp * 1000 - new Date().getTimezoneOffset() * 60 * 1000
  );
};

export const formatTimestamp = (timestamp: number) => {
  const date = parseTimestamp(timestamp);
  const diff = new Date().getTime() - date.getTime();

  if (diff < 60 * 1000) {
    return "now";
  }

  if (diff < 60 * 60 * 1000) {
    return (
      rtf.format(-Math.floor(diff / 60 / 1000), "minutes") +
      ` (${date.toLocaleTimeString()})`
    );
  }

  if (diff < 24 * 60 * 60 * 1000) {
    return (
      rtf.format(-Math.floor(diff / 60 / 60 / 1000), "hours") +
      ` (${date.toLocaleTimeString()})`
    );
  }

  if (diff < 3 * 24 * 60 * 60 * 1000) {
    return (
      rtf.format(-Math.floor(diff / 24 / 60 / 60 / 1000), "days") +
      ` (${date.toLocaleString()})`
    );
  }

  return date.toLocaleString();
};

export const PromiseAllObject = async <T extends Record<string, Promise<any>>>(
  obj: T
) => {
  const keys = Object.keys(obj);
  const values = await Promise.all(Object.values(obj));
  return keys.reduce(
    (acc, key, i) => {
      (acc as any)[key] = values[i];
      return acc;
    },
    {} as { [K in keyof T]: T[K] extends Promise<infer U> ? U : never }
  );
};
