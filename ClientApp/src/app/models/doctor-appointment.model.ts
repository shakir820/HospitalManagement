export class DoctorAppointment{

  id: number;
  patient_id: number;
  doctor_id: number;
  serial_no: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: Date;
  appointment_date_str: string;
  created_date: Date
  modified_date: Date;
  start_time:Date;
  end_time:Date;
}
