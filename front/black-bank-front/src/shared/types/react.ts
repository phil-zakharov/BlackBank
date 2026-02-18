
export type BaseComponent<T = unknown> = (props: {
    children?: React.ReactNode;
} & T) => React.ReactNode