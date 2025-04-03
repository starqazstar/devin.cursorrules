export declare const BASIC_SLOT_EXAMPLE: {
    type: string;
    props: {
        title: string;
    };
    children: {
        type: string;
        name: string;
        children: {
            type: string;
            props: {
                content: string;
            };
        }[];
    }[];
};
export declare const GENERATION_PROMPT: string;
export declare const OPTIMIZATION_PROMPT = "\u8BF7\u6839\u636E\u4EE5\u4E0B\u89C4\u5219\u4F18\u5316\u9875\u9762 Schema\uFF1A\n1. \u68C0\u67E5\u5E76\u4F18\u5316\u63D2\u69FD\u7684\u4F7F\u7528\n2. \u786E\u4FDD\u63D2\u69FD\u5185\u5BB9\u7684\u5408\u7406\u6027\n3. \u9A8C\u8BC1\u7EC4\u4EF6\u5C5E\u6027\u7684\u5B8C\u6574\u6027\n4. \u4F18\u5316\u7EC4\u4EF6\u5D4C\u5957\u7ED3\u6784\n\n\u4F18\u5316\u5EFA\u8BAE\uFF1A\n- \u79FB\u9664\u4E0D\u5FC5\u8981\u7684\u5D4C\u5957\u5C42\u7EA7\n- \u5408\u5E76\u7C7B\u4F3C\u7684\u7EC4\u4EF6\u7ED3\u6784\n- \u8865\u5145\u7F3A\u5931\u7684\u5FC5\u9700\u5C5E\u6027\n- \u8C03\u6574\u4E0D\u5408\u7406\u7684\u5C5E\u6027\u503C";
