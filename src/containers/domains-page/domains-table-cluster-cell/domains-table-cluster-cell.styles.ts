import type { StyletronCSSObject, StyletronCSSObjectOf } from "@/hooks/useStyletronClasses";

const cssStylesObj = {
    clustersLinks: (theme) => ({
        display: 'flex',
        gap: theme.sizing.scale400,
        ...theme.typography.LabelXSmall,
    }),
    metricLinkContainer: (theme) => ({
        display: 'flex',
        ...theme.typography.LabelXSmall,
    }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;
