export class Prescription{

  id: number;
  patient_id:number;
  doctor_id: number;
  created_date: Date;
  patient_complains: PrescriptionPatientComplain[];
  patient_examinations: PrescriptionPatientExamination[];
  patient_investigations: InvestigationDoc[];
  medicines:PrescriptionMedicine[];
  notes: PrescriptionNote[];
  }


  export class PrescriptionPatientComplain{
    id: number;
    title: string;
    description: string;
  }



  export class PrescriptionPatientExamination{
    id: number;
    title: string;
    description: string;
  }


  export class InvestigationDoc{
    id: number;
    prescription_id: number;
    investigation_tag_id: number;
    doctor_id: number;
    patient_id: number;
    investigator_id: number;
    name: string;
    abbreviation: string;
    file_location: string;
    file_name: string;
    created_date: Date;
  }


  export class PrescriptionMedicine{
    id: number;
    patient_id: number;
    doctor_id: number;
    medicine_id: number;
    prescription_id: number;
    note: string;
    title: string;
    created_date: Date;
    schedule: string;
    duration: string;
  }



  export class PrescriptionNote{
    id: number;
    note: string;
  }



