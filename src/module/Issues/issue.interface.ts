export interface Issues {
    id? : number;
    title:string;
    description:string;
    type:'bug' | 'feature_request';
    status : 'open' | 'in_progress' | 'resolved';
    reporter_id? : number;
    created_at: Date;
    updated_at: Date;
}

export interface IussueWithuser{
    id: number;
    title: string;
    description: string;
    type: string;
    status: string;

    reporter: {
        id: number;
        name: string;
        role: string;
    },

    created_at: Date;
    updated_at: Date;
}