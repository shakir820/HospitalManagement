import { User } from "./user.model";

export class PatientDocument{
  id: number;
  name: string;
  patient_id: number;
  medicine_link: string;
  patient:User;
  created_date: Date;
  document_link: string;
}
