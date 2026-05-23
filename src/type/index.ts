

type Troles = 'contributor'|'maintainer';

type MyJwtPayload = {
    id: number;
    name: string;
    role: string;
};
export type {
    Troles,
    MyJwtPayload
}