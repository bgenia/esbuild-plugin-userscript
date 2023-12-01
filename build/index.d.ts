import * as esbuild from 'esbuild';

declare namespace Metadata {
    type Author = string | {
        name: string;
        email?: string;
        url?: string;
    };
    /**
     * Serialized as `prop:key value`
     * Use the "" key for default value `prop key`
     */
    type LocalizableString = string | Record<string, string>;
    type Grant = "none" | "GM.getValue" | "GM_getValue" | "GM.setValue" | "GM_setValue" | "GM.openInTab" | "GM.deleteValue" | "GM.listValues" | "GM.getResourceUrl" | "GM.notification" | "GM.registerMenuCommand" | "GM.setClipboard" | "GM.xmlHttpRequest" | "unsafeWindow" | (string & {});
    type CustomValue = string | string[] | undefined | null | Record<string, string>;
    type InjectionType = "document-end" | "document-start" | "document-body" | "document-idle" | "context-menu" | (string & {});
}
type Metadata = {
    name?: Metadata.LocalizableString;
    namespace?: string;
    description?: Metadata.LocalizableString;
    license?: string;
    include?: string[] | string;
    require?: string[] | string;
    connect?: string[] | string;
    "run-at"?: Metadata.InjectionType;
    version?: string;
    author?: Metadata.Author;
    resource?: string[] | Record<string, string>;
    grant?: Metadata.Grant[] | Metadata.Grant;
    [keys: string]: Metadata.CustomValue;
};

type Intersection<U> = (U extends U ? (_: U) => void : never) extends (_: infer R) => void ? R : never;
type Options = Intersection<Parameters<(typeof plugins)[number]>[0]>;
declare function userscript(options: Options): esbuild.Plugin;
declare namespace userscript {
    const metadata: (options: {
        metadata: Metadata;
    }) => esbuild.Plugin;
}
declare const plugins: ((options: {
    metadata: Metadata;
}) => esbuild.Plugin)[];

export { userscript };
