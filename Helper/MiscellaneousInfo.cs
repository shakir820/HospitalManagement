using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Helper
{
    public class MiscellaneousInfo
    {
        public static int ConsultDoctorTimeDurationInMins = 10;
        public static string InvestigationDoc_Link = "api/Investigation/GetInvestigationFile?investigation_id=";
        public static string PatientDoc_Link = "api/PatientDocument/GetPatientDocumentFile?document_id=";
        public static string PatientDoc_Folder_Path = "FileData/PatientDocument";
        public static string InvestigationDoc_Folder_Path = "FileData/InvestigationDocument";
    }


    public class ModelBindingResolver
    {
      


        public static UserModel ResolveUser(User dbUser, List<string> dbUserRoles = null)
        {
            if(dbUser == null)
            {
                return null;
            }

            var user = new UserModel();
            user.age = dbUser.Age;
            user.approved = dbUser.Approved;
            user.biography = dbUser.Biography;
            user.address = dbUser.Address;
            user.bloodGroup = dbUser.BloodGroup;
            user.bmdc_certifcate = dbUser.BMDC_certifcate;
            user.city_name = dbUser.city_name;
            user.country_name = dbUser.country_name;
            user.country_phone_code = dbUser.country_phone_code;
            user.country_short_name = dbUser.country_short_name;
            user.degree_title = dbUser.DegreeTittle;
            user.doctor_title = dbUser.DoctorTitle;
            user.email = dbUser.Email;
            user.experience = dbUser.year_of_Experience;
            user.gender = dbUser.Gender;
            user.id = dbUser.Id;
            user.isActive = dbUser.IsActive;
            user.languages = new List<LanguageTagModel>();
            
            if(dbUser.Languages != null)
            {
                foreach(var item in dbUser.Languages)
                {
                    var lang = new LanguageTagModel();
                    lang.id = item.LanguageId;
                    lang.languageName = item.LanguageName;
                    user.languages.Add(lang);
                }
            }

            user.name = dbUser.Name;
            user.new_patient_visiting_price = dbUser.NewPatientVisitingPrice;
            user.old_patient_visiting_price = dbUser.OldPatientVisitingPrice;
            user.phoneNumber = dbUser.PhoneNumber;
            user.created_date = dbUser.CreatedDate;
            user.roles = new List<string>();

            if(dbUserRoles != null)
            {
                user.roles = dbUserRoles;
            }

            user.schedules = new List<ScheduleModel>();
            if(dbUser.Schedules != null)
            {
                foreach(var item in dbUser.Schedules)
                {
                    var schedule = new ScheduleModel();
                    schedule.day_name = item.DayName;
                    schedule.end_time = item.EndTime;
                    schedule.id = item.Id;
                    schedule.start_time = item.StartTime;

                    user.schedules.Add(schedule);
                }
            }

            user.specialities = new List<SpecialityTagModel>();
            if(dbUser.Specialities != null)
            {
                foreach(var item in dbUser.Specialities)
                {
                    var speciality = new SpecialityTagModel();
                    speciality.id = item.SpecialityTagId;
                    speciality.specialityName = item.SpecialityName;
                    user.specialities.Add(speciality);
                }
            }


            user.state_name = dbUser.state_name;
            user.types_of = dbUser.TypesOf;
            user.username = dbUser.UserName;

            return user;
        }

        public static DoctorAppointmentModel ResovleAppointment(DoctorAppointment doctorAppointment, UserModel doctor = null)
        {
            var appointment = new DoctorAppointmentModel();
            appointment.appointment_date = doctorAppointment.AppointmentDate;
            appointment.appointment_date_str = doctorAppointment.AppointmentDate.ToString();
            appointment.consulted = doctorAppointment.Consulted;
            appointment.created_date = doctorAppointment.CreatedDate;
            appointment.doctor_id = doctorAppointment.DoctorId;
            appointment.doctor_name = doctor?.name;
            if(doctor != null)
            {
                if (doctor.schedules != null && doctor.schedules.Count > 0)
                {
                    var appointment_day = doctor.schedules.FirstOrDefault(a => a.day_name == appointment.appointment_date.DayOfWeek);
                    appointment.end_time = appointment_day.end_time;
                    appointment.start_time = appointment_day.start_time;
                }
            }
           
            
            appointment.id = doctorAppointment.Id;
            appointment.patient_id = doctorAppointment.PatientId;
            appointment.patient_name = doctorAppointment.PatientName;
            appointment.serial_no = doctorAppointment.SerialNo;
            appointment.visiting_price = doctorAppointment.VisitingPrice;
            return appointment;
        }

        public static PrescriptionModel ResolvePrescription(Prescription db_pres)
        {
            var prescription = new PrescriptionModel();
            prescription.created_date = db_pres.CreatedDate;
            prescription.id = db_pres.Id;
            prescription.modified_date = db_pres.ModifiedDate;
            prescription.notes = new List<PrescriptionNoteModel>();
            
            if(db_pres.Notes != null && db_pres.Notes.Count > 0)
            {
                foreach(var item in db_pres.Notes)
                {
                    prescription.notes.Add(new PrescriptionNoteModel
                    {
                        id = item.Id,
                        note = item.Note
                    });
                }
            }

            prescription.patient_complains = new List<PrescriptionPatientComplainModel>();
            if(db_pres.PatientComplains != null && db_pres.PatientComplains.Count > 0)
            {
                foreach(var item in db_pres.PatientComplains)
                {
                    prescription.patient_complains.Add(new PrescriptionPatientComplainModel
                    {
                        description = item.Description,
                        id = item.Id,
                        title = item.Title
                    });
                }
            }

            prescription.patient_examinations = new List<PrescriptionPatientExaminationModel>();
            if(db_pres.Examinations != null && db_pres.Examinations.Count > 0)
            {
                foreach(var item in db_pres.Examinations)
                {
                    prescription.patient_examinations.Add(new PrescriptionPatientExaminationModel
                    {
                        description = item.Description,
                        id = item.Id,
                        title = item.Title
                    });
                }
            }

            return prescription;

        }


        public static InvestigationDocModel ResolveInvestigationDoc(InvestigationDoc investigation, UserModel doctor = null, UserModel patient = null, UserModel investigator = null)
        {
            var inv = new InvestigationDocModel();
            inv.abbreviation = investigation.Abbreviation;
            inv.created_date = investigation.CreatedDate;
            inv.doctor = doctor;
            inv.file_name = investigation.FileName;
            inv.id = investigation.Id;
            inv.investigation_status = investigation.InvestigationStatus;
            inv.investigation_tag_id = investigation.InvestigationTagId;
            inv.investigator = investigator;
            inv.name = investigation.Name;
            inv.patient = patient;
            inv.prescription_id = investigation.PrescriptionId;
            inv.result_publish_date = investigation.ResultPublishDate;
            inv.sample_submit_date = investigation.SampleSubmitDate;
            inv.content_type = investigation.ContentType;
            inv.file_location = investigation.FileLocation;
            
            
            return inv;
        }


        public static PatientDocumentModel ResolvePatientDocument(PatientDocument patientDocument)
        {
            var pd = new PatientDocumentModel();
            pd.created_date = patientDocument.CreatedDate;
            pd.id = patientDocument.Id;
            pd.name = patientDocument.Name;

            return pd;
        }
    }
}
