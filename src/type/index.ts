interface Iuser {
    id :Number;
    name : string;
    email : string;
    password : string;
    role : 'contributor' | 'maintainer';
}



type Troles = 'contributor'|'maintainer';
export type {
    Iuser,
    Troles
}