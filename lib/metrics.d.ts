type Tags = string[] | { [key: string]: string };

export declare function registerDogStatsD(host: string, port: number, prefix?: `${string}.`): void;

declare function convertTagsIfRequired(tags: Tags): string[];

export declare function timing(stat: string, timeMs: number, sampleRate?: number, tags?: Tags): void;

export declare function increment(stat: string, sampleRate?: number, tags?: Tags): void;

export declare function incrementBy(stat: string, value?: number, tags?: Tags): void;

export declare function decrement(stat: string, sampleRate?: number, tags?: Tags): void;

export declare function decrementBy(stat: string, value?: number, tags?: Tags): void;

export declare function gauge(stat: string, value: number, sampleRate?: number, tags?: Tags): void;

export declare function histogram(stat: string, value: number, sampleRate?: number, tags?: Tags): void;

export declare function timed(fn: (cb: (stat: string, sampleRate?: number, tags?: Tags) => void) => void): void;
