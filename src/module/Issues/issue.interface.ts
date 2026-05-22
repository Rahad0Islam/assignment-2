export interface Issues {
    id? : number;
    title:string;
    description:string;
    type:'bug' | 'feature_request';
    status : 'open' | 'in_progress' | 'resolved';
    reporter_id? : number;
}