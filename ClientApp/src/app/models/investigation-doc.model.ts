import { User } from "./user.model";

export class InvestigationDoc{
  id: number;
  prescription_id: number;
  investigation_tag_id: number;
  name: string;
  abbreviation:string;
  file_location: string;
  file_link: string;
  file_name: string;
  created_date: Date;
  result_publish_date:Date;
  sample_submit_date:Date;
  doctor: User;
  patient: User;
  investigator:User;
  investigation_status: InvestigationStatus;
  content_type: string;
}




 export enum InvestigationStatus
{
    Completed = 3,
    Inprogress = 1,
    Pending = 0,
    Canceled = 2
}
