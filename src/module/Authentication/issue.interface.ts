export interface Iuser {
    id :Number;
    name : string;
    email : string;
    password : string;
    role : 'contributor' | 'maintainer';
}

